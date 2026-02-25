// WorkflowRunner — deterministic replay engine (§13.6)
//
// Executes a CapturedWorkflow directly, bypassing Copilot CLI for
// mcp_tool steps. Only the llm_synthesize step uses a CopilotClient session.
// Emits the same AG-UI events as Explore mode so the UI is identical.

import { BrowserWindow } from 'electron';
import type {
  CapturedWorkflow,
  WorkflowStep,
  WorkflowStepMcpTool,
  WorkflowStepLlmSynthesize,
} from '../shared/types/CapturedWorkflow';
import { AgUiEventType, createAgUiEvent } from '../shared/types/AgUiEvent';
import type { CopilotClient } from './copilot-client';
import type { McpRegistry } from './ipc/mcp-registry';

interface WorkflowRunResult {
  success: boolean;
  stepResults: Map<string, unknown>;
  output: string;
  durationMs: number;
}

export class WorkflowRunner {
  private client: CopilotClient;
  private mcpRegistry: McpRegistry;

  constructor(client: CopilotClient, mcpRegistry: McpRegistry) {
    this.client = client;
    this.mcpRegistry = mcpRegistry;
  }

  async run(
    workflow: CapturedWorkflow,
    params: Record<string, unknown>,
    window: BrowserWindow,
  ): Promise<WorkflowRunResult> {
    const runId = `wf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const stepResults = new Map<string, unknown>();
    const startTime = Date.now();

    // Emit RUN_STARTED with workflow mode badge
    window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.RUN_STARTED, runId, {
      mode: 'workflow',
      workflowId: workflow.id,
    }));

    let output = '';

    for (const step of workflow.steps) {
      // Check approval gates
      const gate = workflow.approvalGates.find((g) => g.beforeStep === step.id);
      if (gate) {
        window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.INTERRUPT, runId, {
          message: gate.message,
          toolName: step.type === 'mcp_tool' ? step.tool : 'synthesis',
          proposedArgs: {},
        }));

        // Wait for user approval via IPC — handled by copilot-handlers
        const approved = await this.waitForApproval();
        if (!approved) {
          // User rejected — skip remaining steps
          break;
        }
      }

      if (step.type === 'mcp_tool') {
        const result = await this.executeMcpStep(step, params, stepResults, runId, window);
        if (result !== undefined) {
          stepResults.set(step.id, result);
        }
      } else if (step.type === 'llm_synthesize') {
        output = await this.executeSynthesisStep(step, stepResults, runId, window);
      }

      // Emit progress STATE_DELTA
      const completedSteps = stepResults.size;
      const totalSteps = workflow.steps.length;
      const progress = Math.round((completedSteps / totalSteps) * 100);
      window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.STATE_DELTA, runId, {
        status: 'running',
        progress,
      }));
    }

    // Emit RUN_FINISHED
    window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.RUN_FINISHED, runId, {
      mode: 'workflow',
      workflowId: workflow.id,
    }));

    return {
      success: true,
      stepResults,
      output,
      durationMs: Date.now() - startTime,
    };
  }

  private async executeMcpStep(
    step: WorkflowStepMcpTool,
    params: Record<string, unknown>,
    stepResults: Map<string, unknown>,
    runId: string,
    window: BrowserWindow,
  ): Promise<unknown> {
    // Resolve template variables in args
    const resolvedArgs = this.resolveArgs(step.args, params, stepResults);

    // Emit TOOL_CALL_START
    const callId = `wf-${step.id}`;
    window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.TOOL_CALL_START, runId, {
      toolName: step.tool,
      args: resolvedArgs,
      callId,
    }));

    const startTime = Date.now();

    try {
      // Direct MCP invocation via registry
      const { invokeMcpToolDirect } = await import('./copilot-client.js');
      const result = await Promise.race([
        invokeMcpToolDirect(step.tool, resolvedArgs, this.mcpRegistry),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), step.timeout),
        ),
      ]);

      const durationMs = Date.now() - startTime;
      window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.TOOL_CALL_END, runId, {
        toolName: step.tool,
        callId,
        result,
        status: 'success',
        durationMs,
      }));

      return result;
    } catch (err) {
      const durationMs = Date.now() - startTime;
      window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.TOOL_CALL_END, runId, {
        toolName: step.tool,
        callId,
        result: null,
        status: 'error',
        durationMs,
      }));

      if (step.onError === 'abort') {
        throw err;
      }
      // 'skip' — continue to next step
      return undefined;
    }
  }

  private async executeSynthesisStep(
    step: WorkflowStepLlmSynthesize,
    stepResults: Map<string, unknown>,
    runId: string,
    window: BrowserWindow,
  ): Promise<string> {
    // Gather inputs from previous step results
    const inputData: Record<string, unknown> = {};
    for (const inputRef of step.inputs) {
      // inputRef format: "step_id.field" or just "step_id"
      const dotIdx = inputRef.indexOf('.');
      const stepId = dotIdx >= 0 ? inputRef.slice(0, dotIdx) : inputRef;
      const field = dotIdx >= 0 ? inputRef.slice(dotIdx + 1) : undefined;

      const stepResult = stepResults.get(stepId);
      if (field && stepResult && typeof stepResult === 'object') {
        inputData[inputRef] = (stepResult as Record<string, unknown>)[field];
      } else {
        inputData[inputRef] = stepResult;
      }
    }

    // Use CopilotClient session for synthesis
    const session = await this.client.createSession({
      model: 'gpt-4.5',
      systemMessage: `You are generating a ${step.outputFormat} output using the template: ${step.template}`,
      tools: [],
      streaming: true,
    });

    let output = '';

    session.on((event) => {
      if (event.type === 'assistant.message_start') {
        window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.TEXT_MESSAGE_START, runId, {
          messageId: `wf-synth-${step.id}`,
          role: 'assistant',
        }));
      } else if (event.type === 'assistant.message_delta') {
        const content = (event.data['content'] as string) ?? '';
        output += content;
        window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.TEXT_MESSAGE_CONTENT, runId, {
          messageId: `wf-synth-${step.id}`,
          delta: content,
        }));
      } else if (event.type === 'assistant.message_end') {
        window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.TEXT_MESSAGE_END, runId, {
          messageId: `wf-synth-${step.id}`,
        }));
      }
    });

    await session.send({
      prompt: `Generate the ${step.template} output from this data:\n\n${JSON.stringify(inputData, null, 2)}`,
    });

    return output;
  }

  /**
   * Resolve {{param}} and {{step_id.field}} template variables in args.
   */
  private resolveArgs(
    args: Record<string, unknown>,
    params: Record<string, unknown>,
    stepResults: Map<string, unknown>,
  ): Record<string, unknown> {
    const resolved: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(args)) {
      if (typeof value === 'string') {
        resolved[key] = value.replace(/\{\{([^}]+)\}\}/g, (_match, path: string) => {
          // Try params first
          if (path in params) return String(params[path]);

          // Try step results (e.g., "step_id.field[0].subfield")
          const parts = path.split('.');
          const stepId = parts[0];
          const stepResult = stepResults.get(stepId);
          if (stepResult !== undefined) {
            let current: unknown = stepResult;
            for (let i = 1; i < parts.length && current != null; i++) {
              const part = parts[i];
              // Handle array index syntax: "field[0]"
              const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
              if (arrayMatch) {
                current = (current as Record<string, unknown>)[arrayMatch[1]];
                if (Array.isArray(current)) {
                  current = current[parseInt(arrayMatch[2])];
                }
              } else {
                current = (current as Record<string, unknown>)[part];
              }
            }
            return current != null ? String(current) : '';
          }
          return '';
        });
      } else if (Array.isArray(value)) {
        resolved[key] = value.map((v) =>
          typeof v === 'string'
            ? this.resolveArgs({ _: v }, params, stepResults)['_']
            : v,
        );
      } else {
        resolved[key] = value;
      }
    }

    return resolved;
  }

  private waitForApproval(): Promise<boolean> {
    // This will be wired to the IPC permission:respond handler
    return new Promise((resolve) => {
      const { ipcMain } = require('electron') as typeof import('electron');
      const handler = (_event: unknown, params: { approved: boolean }) => {
        ipcMain.removeHandler('workflow:approve');
        resolve(params.approved);
      };
      ipcMain.handle('workflow:approve', handler);
    });
  }
}
