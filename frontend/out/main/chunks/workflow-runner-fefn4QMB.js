import { c as createAgUiEvent, A as AgUiEventType } from "../index.js";
import "electron";
import "path";
import "child_process";
import "fs/promises";
import "fs";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
class WorkflowRunner {
  client;
  mcpRegistry;
  constructor(client, mcpRegistry) {
    this.client = client;
    this.mcpRegistry = mcpRegistry;
  }
  async run(workflow, params, window) {
    const runId = `wf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const stepResults = /* @__PURE__ */ new Map();
    const startTime = Date.now();
    window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.RUN_STARTED, runId, {
      mode: "workflow",
      workflowId: workflow.id
    }));
    let output = "";
    for (const step of workflow.steps) {
      const gate = workflow.approvalGates.find((g) => g.beforeStep === step.id);
      if (gate) {
        window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.INTERRUPT, runId, {
          message: gate.message,
          toolName: step.type === "mcp_tool" ? step.tool : "synthesis",
          proposedArgs: {}
        }));
        const approved = await this.waitForApproval();
        if (!approved) {
          break;
        }
      }
      if (step.type === "mcp_tool") {
        const result = await this.executeMcpStep(step, params, stepResults, runId, window);
        if (result !== void 0) {
          stepResults.set(step.id, result);
        }
      } else if (step.type === "llm_synthesize") {
        output = await this.executeSynthesisStep(step, stepResults, runId, window);
      }
      const completedSteps = stepResults.size;
      const totalSteps = workflow.steps.length;
      const progress = Math.round(completedSteps / totalSteps * 100);
      window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.STATE_DELTA, runId, {
        status: "running",
        progress
      }));
    }
    window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.RUN_FINISHED, runId, {
      mode: "workflow",
      workflowId: workflow.id
    }));
    return {
      success: true,
      stepResults,
      output,
      durationMs: Date.now() - startTime
    };
  }
  async executeMcpStep(step, params, stepResults, runId, window) {
    const resolvedArgs = this.resolveArgs(step.args, params, stepResults);
    const callId = `wf-${step.id}`;
    window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.TOOL_CALL_START, runId, {
      toolName: step.tool,
      args: resolvedArgs,
      callId
    }));
    const startTime = Date.now();
    try {
      const { invokeMcpToolDirect } = await import("../index.js").then((n) => n.a);
      const result = await Promise.race([
        invokeMcpToolDirect(step.tool, resolvedArgs, this.mcpRegistry),
        new Promise(
          (_, reject) => setTimeout(() => reject(new Error("timeout")), step.timeout)
        )
      ]);
      const durationMs = Date.now() - startTime;
      window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.TOOL_CALL_END, runId, {
        toolName: step.tool,
        callId,
        result,
        status: "success",
        durationMs
      }));
      return result;
    } catch (err) {
      const durationMs = Date.now() - startTime;
      window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.TOOL_CALL_END, runId, {
        toolName: step.tool,
        callId,
        result: null,
        status: "error",
        durationMs
      }));
      if (step.onError === "abort") {
        throw err;
      }
      return void 0;
    }
  }
  async executeSynthesisStep(step, stepResults, runId, window) {
    const inputData = {};
    for (const inputRef of step.inputs) {
      const dotIdx = inputRef.indexOf(".");
      const stepId = dotIdx >= 0 ? inputRef.slice(0, dotIdx) : inputRef;
      const field = dotIdx >= 0 ? inputRef.slice(dotIdx + 1) : void 0;
      const stepResult = stepResults.get(stepId);
      if (field && stepResult && typeof stepResult === "object") {
        inputData[inputRef] = stepResult[field];
      } else {
        inputData[inputRef] = stepResult;
      }
    }
    const session = await this.client.createSession({
      model: "gpt-4.5",
      systemMessage: `You are generating a ${step.outputFormat} output using the template: ${step.template}`,
      tools: [],
      streaming: true
    });
    let output = "";
    session.on((event) => {
      if (event.type === "assistant.message_start") {
        window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.TEXT_MESSAGE_START, runId, {
          messageId: `wf-synth-${step.id}`,
          role: "assistant"
        }));
      } else if (event.type === "assistant.message_delta") {
        const content = event.data["content"] ?? "";
        output += content;
        window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.TEXT_MESSAGE_CONTENT, runId, {
          messageId: `wf-synth-${step.id}`,
          delta: content
        }));
      } else if (event.type === "assistant.message_end") {
        window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.TEXT_MESSAGE_END, runId, {
          messageId: `wf-synth-${step.id}`
        }));
      }
    });
    await session.send({
      prompt: `Generate the ${step.template} output from this data:

${JSON.stringify(inputData, null, 2)}`
    });
    return output;
  }
  /**
   * Resolve {{param}} and {{step_id.field}} template variables in args.
   */
  resolveArgs(args, params, stepResults) {
    const resolved = {};
    for (const [key, value] of Object.entries(args)) {
      if (typeof value === "string") {
        resolved[key] = value.replace(/\{\{([^}]+)\}\}/g, (_match, path) => {
          if (path in params) return String(params[path]);
          const parts = path.split(".");
          const stepId = parts[0];
          const stepResult = stepResults.get(stepId);
          if (stepResult !== void 0) {
            let current = stepResult;
            for (let i = 1; i < parts.length && current != null; i++) {
              const part = parts[i];
              const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
              if (arrayMatch) {
                current = current[arrayMatch[1]];
                if (Array.isArray(current)) {
                  current = current[parseInt(arrayMatch[2])];
                }
              } else {
                current = current[part];
              }
            }
            return current != null ? String(current) : "";
          }
          return "";
        });
      } else if (Array.isArray(value)) {
        resolved[key] = value.map(
          (v) => typeof v === "string" ? this.resolveArgs({ _: v }, params, stepResults)["_"] : v
        );
      } else {
        resolved[key] = value;
      }
    }
    return resolved;
  }
  waitForApproval() {
    return new Promise((resolve) => {
      const { ipcMain } = require2("electron");
      const handler = (_event, params) => {
        ipcMain.removeHandler("workflow:approve");
        resolve(params.approved);
      };
      ipcMain.handle("workflow:approve", handler);
    });
  }
}
export {
  WorkflowRunner
};
