// WorkflowRunner — deterministic replay engine (§13.6)
//
// Executes a CapturedWorkflow. MCP tool steps are executed by sending
// a constrained prompt to a CopilotSession (the CLI manages MCP servers).
// LLM synthesis steps use a dedicated session for open-ended generation.
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

        const approved = await this.waitForApproval();
        if (!approved) break;
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
    const resolvedArgs = this.resolveArgs(step.args, params, stepResults);

    const callId = `wf-${step.id}`;
    window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.TOOL_CALL_START, runId, {
      toolName: step.tool,
      args: resolvedArgs,
      callId,
    }));

    const startTime = Date.now();

    try {
      // Use a constrained session to invoke the tool via the CLI
      const session = await this.client.createSession({
        systemMessage: {
          mode: 'replace',
          content: `You MUST call the tool "${step.tool}" with exactly these arguments: ${JSON.stringify(resolvedArgs)}. Do not call any other tools. Do not add commentary.`,
        },
        streaming: false,
      });

      const response = await Promise.race([
        session.sendAndWait({ prompt: `Call ${step.tool}` }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), step.timeout),
        ),
      ]);

      await session.destroy();

      const result = response ?? null;
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

      if (step.onError === 'abort') throw err;
      return undefined;
    }
  }

  private async executeSynthesisStep(
    step: WorkflowStepLlmSynthesize,
    stepResults: Map<string, unknown>,
    runId: string,
    window: BrowserWindow,
  ): Promise<string> {
    const inputData: Record<string, unknown> = {};
    for (const inputRef of step.inputs) {
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

    const session = await this.client.createSession({
      systemMessage: {
        mode: 'append',
        content: `You are generating a ${step.outputFormat} output using the template: ${step.template}`,
      },
      streaming: true,
    });

    let output = '';
    const messageId = `wf-synth-${step.id}`;

    session.on('assistant.turn_start', () => {
      window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.TEXT_MESSAGE_START, runId, {
        messageId,
        role: 'assistant',
      }));
    });

    session.on('assistant.message_delta', (event) => {
      const content = event.data.deltaContent;
      output += content;
      window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.TEXT_MESSAGE_CONTENT, runId, {
        messageId,
        delta: content,
      }));
    });

    session.on('assistant.turn_end', () => {
      window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.TEXT_MESSAGE_END, runId, {
        messageId,
      }));
    });

    await session.sendAndWait({
      prompt: `Generate the ${step.template} output from this data:\n\n${JSON.stringify(inputData, null, 2)}`,
    });

    await session.destroy();
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
          if (path in params) return String(params[path]);

          const parts = path.split('.');
          const stepId = parts[0];
          const stepResult = stepResults.get(stepId);
          if (stepResult !== undefined) {
            let current: unknown = stepResult;
            for (let i = 1; i < parts.length && current != null; i++) {
              const part = parts[i];
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
