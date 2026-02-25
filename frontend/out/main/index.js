import { ipcMain, BrowserWindow, app } from "electron";
import { join, basename } from "path";
import { spawn } from "child_process";
import { mkdir, writeFile, readFile, readdir } from "fs/promises";
import { existsSync } from "fs";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
var AgUiEventType = /* @__PURE__ */ ((AgUiEventType2) => {
  AgUiEventType2["RUN_STARTED"] = "RUN_STARTED";
  AgUiEventType2["RUN_FINISHED"] = "RUN_FINISHED";
  AgUiEventType2["RUN_ERROR"] = "RUN_ERROR";
  AgUiEventType2["TEXT_MESSAGE_START"] = "TEXT_MESSAGE_START";
  AgUiEventType2["TEXT_MESSAGE_CONTENT"] = "TEXT_MESSAGE_CONTENT";
  AgUiEventType2["TEXT_MESSAGE_END"] = "TEXT_MESSAGE_END";
  AgUiEventType2["TOOL_CALL_START"] = "TOOL_CALL_START";
  AgUiEventType2["TOOL_CALL_END"] = "TOOL_CALL_END";
  AgUiEventType2["STATE_DELTA"] = "STATE_DELTA";
  AgUiEventType2["STATE_SNAPSHOT"] = "STATE_SNAPSHOT";
  AgUiEventType2["INTERRUPT"] = "INTERRUPT";
  AgUiEventType2["STEP_STARTED"] = "STEP_STARTED";
  AgUiEventType2["STEP_FINISHED"] = "STEP_FINISHED";
  AgUiEventType2["CUSTOM"] = "CUSTOM";
  return AgUiEventType2;
})(AgUiEventType || {});
function createAgUiEvent(type, runId, data) {
  return { type, timestamp: Date.now(), runId, data };
}
var SdkEventType = /* @__PURE__ */ ((SdkEventType2) => {
  SdkEventType2["SESSION_START"] = "session.start";
  SdkEventType2["SESSION_IDLE"] = "session.idle";
  SdkEventType2["ASSISTANT_MESSAGE_START"] = "assistant.message_start";
  SdkEventType2["ASSISTANT_MESSAGE_DELTA"] = "assistant.message_delta";
  SdkEventType2["ASSISTANT_MESSAGE_END"] = "assistant.message_end";
  SdkEventType2["TOOL_REQUEST"] = "tool.request";
  SdkEventType2["TOOL_RESULT"] = "tool.result";
  SdkEventType2["PERMISSION_REQUEST"] = "permission.request";
  SdkEventType2["STATE_UPDATE"] = "state.update";
  return SdkEventType2;
})(SdkEventType || {});
let messageCounter = 0;
function translateSdkToAgUi(sdkEvent, runId) {
  switch (sdkEvent.type) {
    case SdkEventType.SESSION_START:
      return createAgUiEvent(AgUiEventType.RUN_STARTED, runId, {});
    case SdkEventType.SESSION_IDLE:
      return createAgUiEvent(AgUiEventType.RUN_FINISHED, runId, {});
    case SdkEventType.ASSISTANT_MESSAGE_START:
      messageCounter++;
      return createAgUiEvent(AgUiEventType.TEXT_MESSAGE_START, runId, {
        messageId: `msg-${messageCounter}`,
        role: "assistant"
      });
    case SdkEventType.ASSISTANT_MESSAGE_DELTA:
      return createAgUiEvent(AgUiEventType.TEXT_MESSAGE_CONTENT, runId, {
        messageId: `msg-${messageCounter}`,
        content: sdkEvent.data.content ?? ""
      });
    case SdkEventType.ASSISTANT_MESSAGE_END:
      return createAgUiEvent(AgUiEventType.TEXT_MESSAGE_END, runId, {
        messageId: `msg-${messageCounter}`
      });
    case SdkEventType.TOOL_REQUEST:
      return createAgUiEvent(AgUiEventType.TOOL_CALL_START, runId, {
        toolName: sdkEvent.data.name,
        args: sdkEvent.data.args,
        callId: sdkEvent.data.callId ?? `call-${Date.now()}`
      });
    case SdkEventType.TOOL_RESULT:
      return createAgUiEvent(AgUiEventType.TOOL_CALL_END, runId, {
        toolName: sdkEvent.data.name,
        callId: sdkEvent.data.callId ?? "",
        result: sdkEvent.data.result,
        status: sdkEvent.data.error ? "error" : "success",
        durationMs: sdkEvent.data.durationMs ?? 0
      });
    case SdkEventType.PERMISSION_REQUEST:
      return createAgUiEvent(AgUiEventType.INTERRUPT, runId, {
        message: sdkEvent.data.message,
        toolName: sdkEvent.data.tool,
        proposedArgs: sdkEvent.data.proposed ?? {}
      });
    case SdkEventType.STATE_UPDATE:
      return createAgUiEvent(AgUiEventType.STATE_DELTA, runId, sdkEvent.data);
    default:
      return null;
  }
}
function emitAgUiEvent(window, sdkEvent, runId) {
  const agUiEvent = translateSdkToAgUi(sdkEvent, runId);
  if (agUiEvent) {
    window.webContents.send("ag-ui:event", agUiEvent);
  }
}
function resetTranslatorState() {
  messageCounter = 0;
}
class CopilotClient {
  cliProcess = null;
  cliUrl = null;
  nextRequestId = 1;
  pendingRequests = /* @__PURE__ */ new Map();
  sessionListeners = /* @__PURE__ */ new Map();
  buffer = "";
  ready = false;
  readyPromise;
  readyResolve;
  mcpRegistry;
  constructor(mcpRegistry2, options) {
    this.mcpRegistry = mcpRegistry2;
    this.readyPromise = new Promise((resolve) => {
      this.readyResolve = resolve;
    });
    if (options?.cliUrl) {
      this.cliUrl = options.cliUrl;
      this.ready = true;
      this.readyResolve();
    } else {
      this.spawnCli();
    }
  }
  // ── CLI Process Management ────────────────────────────────────────
  spawnCli() {
    this.cliProcess = spawn("copilot", ["--server"], {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env }
    });
    this.cliProcess.stdout?.on("data", (chunk) => {
      this.handleStdout(chunk.toString("utf-8"));
    });
    this.cliProcess.stderr?.on("data", (chunk) => {
      console.error("[Copilot CLI stderr]", chunk.toString("utf-8"));
    });
    this.cliProcess.on("error", (err) => {
      console.error("[Copilot CLI] Failed to spawn:", err.message);
    });
    this.cliProcess.on("exit", (code) => {
      console.log("[Copilot CLI] Exited with code:", code);
      this.cliProcess = null;
      this.ready = false;
    });
    const readyTimeout = setTimeout(() => {
      if (!this.ready) {
        this.ready = true;
        this.readyResolve();
      }
    }, 3e3);
    const origHandler = this.handleNotification.bind(this);
    this.handleNotification = (notification) => {
      if (notification.method === "initialized" || notification.method === "ready") {
        this.ready = true;
        this.readyResolve();
        clearTimeout(readyTimeout);
      }
      origHandler(notification);
    };
  }
  handleStdout(chunk) {
    this.buffer += chunk;
    let newlineIdx;
    while ((newlineIdx = this.buffer.indexOf("\n")) !== -1) {
      const line = this.buffer.slice(0, newlineIdx).trim();
      this.buffer = this.buffer.slice(newlineIdx + 1);
      if (!line) continue;
      try {
        const msg = JSON.parse(line);
        if ("id" in msg && msg.id != null) {
          this.handleResponse(msg);
        } else {
          this.handleNotification(msg);
        }
      } catch {
      }
    }
  }
  handleResponse(response) {
    const pending = this.pendingRequests.get(response.id);
    if (!pending) return;
    this.pendingRequests.delete(response.id);
    if (response.error) {
      pending.reject(new Error(`CLI error ${response.error.code}: ${response.error.message}`));
    } else {
      pending.resolve(response.result);
    }
  }
  handleNotification(notification) {
    const sessionId = notification.params["sessionId"];
    if (sessionId && this.sessionListeners.has(sessionId)) {
      const sdkEvent = this.notificationToSdkEvent(notification);
      if (sdkEvent) {
        for (const listener of this.sessionListeners.get(sessionId)) {
          listener(sdkEvent);
        }
      }
    }
  }
  notificationToSdkEvent(notification) {
    const methodMap = {
      "session/started": "session.start",
      "session/idle": "session.idle",
      "assistant/messageStart": "assistant.message_start",
      "assistant/messageDelta": "assistant.message_delta",
      "assistant/messageEnd": "assistant.message_end",
      "tool/request": "tool.request",
      "tool/result": "tool.result",
      "permission/request": "permission.request",
      "state/update": "state.update"
    };
    const eventType = methodMap[notification.method];
    if (!eventType) return null;
    return {
      type: eventType,
      data: notification.params
    };
  }
  async sendRequest(method, params) {
    await this.readyPromise;
    const id = this.nextRequestId++;
    const request = {
      jsonrpc: "2.0",
      id,
      method,
      params
    };
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      const data = JSON.stringify(request) + "\n";
      if (this.cliProcess?.stdin?.writable) {
        this.cliProcess.stdin.write(data);
      } else {
        this.pendingRequests.delete(id);
        reject(new Error("CLI process stdin not writable"));
      }
    });
  }
  // ── Session Management ────────────────────────────────────────────
  async createSession(options) {
    const toolDefs = options.tools.map((t) => ({
      name: t.name,
      description: t.description
    }));
    const result = await this.sendRequest("session/create", {
      model: options.model,
      systemMessage: options.systemMessage,
      tools: toolDefs,
      streaming: options.streaming ?? true
    });
    const sessionId = result.sessionId;
    const toolHandlers = /* @__PURE__ */ new Map();
    for (const tool of options.tools) {
      toolHandlers.set(tool.name, tool.handler);
    }
    const listeners = [];
    this.sessionListeners.set(sessionId, listeners);
    const toolCallHandler = async (event) => {
      if (event.type === "tool.request") {
        const toolName = event.data["name"];
        const args = event.data["args"];
        const callId = event.data["callId"];
        const handler = toolHandlers.get(toolName);
        if (handler) {
          const startTime = Date.now();
          try {
            const toolResult = await handler(args);
            await this.sendRequest("tool/result", {
              sessionId,
              callId,
              name: toolName,
              result: toolResult,
              durationMs: Date.now() - startTime
            });
          } catch (err) {
            await this.sendRequest("tool/result", {
              sessionId,
              callId,
              name: toolName,
              error: err.message,
              durationMs: Date.now() - startTime
            });
          }
        }
      }
    };
    listeners.push(toolCallHandler);
    const session = {
      id: sessionId,
      on: (callback) => {
        listeners.push(callback);
      },
      off: (callback) => {
        const idx = listeners.indexOf(callback);
        if (idx >= 0) listeners.splice(idx, 1);
      },
      send: async (params) => {
        await this.sendRequest("session/send", {
          sessionId,
          prompt: params.prompt
        });
      },
      cancel: () => {
        this.sendRequest("session/cancel", { sessionId }).catch(() => {
        });
        this.sessionListeners.delete(sessionId);
      }
    };
    return session;
  }
  // ── Cleanup ───────────────────────────────────────────────────────
  destroy() {
    for (const [, listeners] of this.sessionListeners) {
      listeners.length = 0;
    }
    this.sessionListeners.clear();
    this.pendingRequests.clear();
    if (this.cliProcess) {
      this.cliProcess.kill();
      this.cliProcess = null;
    }
  }
}
function buildToolDefinitions(toolNames, mcpRegistry2) {
  const { z } = require2("zod");
  return toolNames.map((name) => {
    const toolInfo = mcpRegistry2.getTools().find((t) => t.name === name);
    return {
      name,
      description: toolInfo?.description ?? name,
      parameters: z.object({}).passthrough(),
      // Accept any args — MCP server validates
      handler: async (args) => {
        return invokeMcpToolDirect(name, args, mcpRegistry2);
      }
    };
  });
}
async function invokeMcpToolDirect(toolName, args, mcpRegistry2) {
  const toolInfo = mcpRegistry2.getTools().find((t) => t.name === toolName);
  if (!toolInfo) throw new Error(`Unknown MCP tool: ${toolName}`);
  const serverConfig = mcpRegistry2.getServerConfig(toolInfo.server);
  if (!serverConfig) throw new Error(`No server config for: ${toolInfo.server}`);
  return new Promise((resolve, reject) => {
    const proc = spawn(serverConfig.command, serverConfig.args ?? [], {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, ...serverConfig.env }
    });
    let stdout = "";
    proc.stdout?.on("data", (chunk) => {
      stdout += chunk.toString("utf-8");
    });
    proc.stderr?.on("data", (chunk) => {
      console.error(`[MCP ${toolInfo.server}]`, chunk.toString("utf-8"));
    });
    const initRequest = {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "copilot-sales", version: "0.1.0" }
      }
    };
    const callRequest = {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: { name: toolName, arguments: args }
    };
    proc.stdin?.write(JSON.stringify(initRequest) + "\n");
    proc.stdin?.write(JSON.stringify(callRequest) + "\n");
    proc.on("close", () => {
      try {
        const lines = stdout.split("\n").filter(Boolean);
        for (const line of lines) {
          const msg = JSON.parse(line);
          if (msg.id === 2) {
            if (msg.error) {
              reject(new Error(msg.error.message));
            } else {
              resolve(msg.result);
            }
            return;
          }
        }
        reject(new Error("No response from MCP server"));
      } catch (err) {
        reject(new Error(`Failed to parse MCP response: ${err.message}`));
      }
    });
    proc.on("error", (err) => {
      reject(new Error(`MCP server spawn error: ${err.message}`));
    });
    setTimeout(() => {
      proc.kill();
      reject(new Error(`MCP tool call timed out: ${toolName}`));
    }, 3e4);
  });
}
const copilotClient$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CopilotClient,
  buildToolDefinitions,
  invokeMcpToolDirect
}, Symbol.toStringTag, { value: "Module" }));
class SessionRecorder {
  log;
  startTime;
  pendingTools = /* @__PURE__ */ new Map();
  outputChunks = [];
  outputDir;
  constructor(sessionId, skillId, context, workspaceRoot) {
    this.startTime = Date.now();
    this.outputDir = join(workspaceRoot, ".copilot", "sessions");
    this.log = {
      sessionId,
      skillId,
      skillVersion: "1.0",
      capturedAt: (/* @__PURE__ */ new Date()).toISOString(),
      contextParams: context,
      toolCallSequence: [],
      interruptEvents: [],
      finalOutput: "",
      totalDurationMs: 0
    };
  }
  /**
   * Attach to a CopilotSession — subscribes to events passively.
   */
  attach(session) {
    session.on((event) => {
      this.handleEvent(event);
    });
  }
  handleEvent(event) {
    switch (event.type) {
      case "tool.request": {
        const callId = event.data["callId"] ?? `call-${Date.now()}`;
        this.pendingTools.set(callId, {
          tool: event.data["name"],
          args: event.data["args"] ?? {},
          start: Date.now()
        });
        break;
      }
      case "tool.result": {
        const callId = event.data["callId"] ?? "";
        const pending = this.pendingTools.get(callId);
        if (pending) {
          const durationMs = Date.now() - pending.start;
          const hasError = Boolean(event.data["error"]);
          this.log.toolCallSequence.push({
            stepId: callId,
            tool: pending.tool,
            args: pending.args,
            result: event.data["result"],
            durationMs,
            status: hasError ? "error" : "success",
            errorMessage: hasError ? String(event.data["error"]) : void 0
          });
          this.pendingTools.delete(callId);
        }
        break;
      }
      case "permission.request": {
        this.log.interruptEvents.push({
          message: event.data["message"] ?? "",
          tool: event.data["tool"] ?? "",
          proposed: event.data["proposed"] ?? {},
          userApproved: false,
          // Updated when user responds
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
        break;
      }
      case "assistant.message_delta": {
        const content = event.data["content"];
        if (content) this.outputChunks.push(content);
        break;
      }
      case "session.idle": {
        this.finalise();
        break;
      }
    }
  }
  /**
   * Record a user's approval/rejection response for the last interrupt.
   */
  recordApproval(approved) {
    const last = this.log.interruptEvents[this.log.interruptEvents.length - 1];
    if (last) {
      last.userApproved = approved;
    }
  }
  finalise() {
    this.log.finalOutput = this.outputChunks.join("");
    this.log.totalDurationMs = Date.now() - this.startTime;
    this.persist();
  }
  async persist() {
    try {
      await mkdir(this.outputDir, { recursive: true });
      const filePath = join(this.outputDir, `session-${this.log.sessionId}.json`);
      await writeFile(filePath, JSON.stringify(this.log, null, 2), "utf-8");
      console.log(`[SessionRecorder] Saved: ${filePath}`);
    } catch (err) {
      console.error("[SessionRecorder] Failed to persist:", err.message);
    }
  }
  getLog() {
    return { ...this.log };
  }
}
let activeRunId = null;
let activeSession = null;
let activeRecorder = null;
let copilotClient = null;
function emitCliActivity(window, runId, kind, label, detail) {
  window.webContents.send(
    "ag-ui:event",
    createAgUiEvent(AgUiEventType.CUSTOM, runId, {
      id: `cli-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      kind,
      label,
      detail,
      timestamp: Date.now()
    })
  );
}
function getClient(mcpRegistry2) {
  if (!copilotClient) {
    copilotClient = new CopilotClient(mcpRegistry2, {
      cliUrl: process.env["COPILOT_CLI_URL"]
    });
  }
  return copilotClient;
}
function registerIpcHandlers(mcpRegistry2, skillsLoader2) {
  ipcMain.handle("copilot:run", async (event, params) => {
    const runId = `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    activeRunId = runId;
    resetTranslatorState();
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return runId;
    window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.RUN_STARTED, runId, {
      skill: params.skill
    }));
    try {
      const client = getClient(mcpRegistry2);
      const skill = skillsLoader2.getSkill(params.skill);
      const systemPrompt = skill?.rawContent ?? `You are a sales assistant. Run the "${params.skill}" skill.`;
      emitCliActivity(window, runId, "skill_loaded", `Skill loaded: ${params.skill}`, systemPrompt.slice(0, 200));
      const allTools = mcpRegistry2.getTools().map((t) => t.name);
      const toolDefs = buildToolDefinitions(allTools, mcpRegistry2);
      emitCliActivity(window, runId, "tool_registered", `${toolDefs.length} tools registered`, allTools.join(", "));
      emitCliActivity(window, runId, "context_added", "System prompt configured");
      const session = await client.createSession({
        model: "gpt-4.5",
        systemMessage: systemPrompt,
        tools: toolDefs,
        streaming: true
      });
      activeSession = session;
      emitCliActivity(window, runId, "session_created", `Session created: ${session.id}`);
      const workspaceRoot = mcpRegistry2["configPath"] ? mcpRegistry2["configPath"].replace("/.vscode/mcp.json", "") : process.cwd();
      const recorder = new SessionRecorder(
        session.id,
        params.skill,
        params.context,
        workspaceRoot
      );
      recorder.attach(session);
      activeRecorder = recorder;
      session.on((sdkEvent) => {
        emitAgUiEvent(window, {
          type: sdkEvent.type,
          data: sdkEvent.data
        }, runId);
        if (sdkEvent.type === "tool.request") {
          emitCliActivity(
            window,
            runId,
            "tool_invoked",
            `Calling: ${String(sdkEvent.data["name"] ?? "unknown")}`,
            sdkEvent.data["args"] ? JSON.stringify(sdkEvent.data["args"]).slice(0, 300) : void 0
          );
        } else if (sdkEvent.type === "tool.result") {
          emitCliActivity(
            window,
            runId,
            "tool_completed",
            `Completed: ${String(sdkEvent.data["name"] ?? "unknown")}`
          );
        }
        if (sdkEvent.type === "permission.request") {
          window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.INTERRUPT, runId, {
            message: sdkEvent.data["message"],
            toolName: sdkEvent.data["tool"],
            proposedArgs: sdkEvent.data["proposed"] ?? {}
          }));
        }
      });
      emitCliActivity(window, runId, "prompt_sent", "Prompt sent to agent", params.prompt.slice(0, 200));
      await session.send({ prompt: params.prompt });
    } catch (err) {
      window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.RUN_ERROR, runId, {
        error: err.message
      }));
      activeRunId = null;
      activeSession = null;
    }
    return runId;
  });
  ipcMain.handle("copilot:cancel", async (_event, { runId }) => {
    if (activeRunId === runId && activeSession) {
      activeSession.cancel();
      activeSession = null;
      activeRunId = null;
    }
  });
  ipcMain.handle("copilot:capture-workflow", async () => {
    if (!activeRecorder) return { error: "No session to capture" };
    return { log: activeRecorder.getLog() };
  });
  ipcMain.handle("mcp:list-tools", async () => {
    return { tools: mcpRegistry2.getTools() };
  });
  ipcMain.handle("skill:list", async () => {
    return { skills: skillsLoader2.getSkills() };
  });
  ipcMain.handle("skill:load", async (_event, { skillId }) => {
    return skillsLoader2.getSkill(skillId);
  });
  ipcMain.handle("skill:save", async (_event, { skillId, content }) => {
    await skillsLoader2.saveSkill(skillId, content);
  });
  ipcMain.handle("workflow:list", async () => {
    const { readdir: readdir2, readFile: readFile2 } = await import("node:fs/promises");
    const { join: join2 } = await import("node:path");
    const workflowDir = join2(process.cwd(), ".copilot", "workflows");
    try {
      const files = await readdir2(workflowDir);
      const workflows = await Promise.all(
        files.filter((f) => f.endsWith(".json")).map(async (f) => {
          const raw = await readFile2(join2(workflowDir, f), "utf-8");
          const entry = JSON.parse(raw);
          return {
            id: entry.id ?? f.replace(".json", ""),
            name: entry.name ?? f.replace(".json", ""),
            capturedAt: entry.capturedAt ?? "",
            stepsCount: entry.stepsCount ?? (entry.steps?.length ?? 0),
            estimatedDurationMs: entry.estimatedDurationMs ?? 0,
            starred: entry.starred ?? false
          };
        })
      );
      return { workflows };
    } catch {
      return { workflows: [] };
    }
  });
  ipcMain.handle("workflow:run", async (event, { workflowId, params }) => {
    const { readFile: readFile2 } = await import("node:fs/promises");
    const { join: join2 } = await import("node:path");
    const { WorkflowRunner } = await import("./chunks/workflow-runner-fefn4QMB.js");
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return { error: "No window" };
    const filePath = join2(process.cwd(), ".copilot", "workflows", `${workflowId}.json`);
    const raw = await readFile2(filePath, "utf-8");
    const workflow = JSON.parse(raw);
    const client = getClient(mcpRegistry2);
    const runner = new WorkflowRunner(client, mcpRegistry2);
    const result = await runner.run(workflow, params, window);
    return { runId: result.output };
  });
  ipcMain.handle("permission:respond", async (_event, params) => {
    if (activeRecorder) {
      activeRecorder.recordApproval(params.approved);
    }
  });
}
class McpRegistry {
  tools = [];
  config = { servers: {} };
  configPath;
  constructor(workspaceRoot) {
    const root = workspaceRoot ?? this.findWorkspaceRoot();
    this.configPath = join(root, ".vscode", "mcp.json");
  }
  findWorkspaceRoot() {
    let dir = process.cwd();
    while (dir !== "/") {
      if (existsSync(join(dir, ".vscode", "mcp.json"))) return dir;
      dir = join(dir, "..");
    }
    return process.cwd();
  }
  async load() {
    try {
      const raw = await readFile(this.configPath, "utf-8");
      this.config = JSON.parse(raw);
      this.buildToolList();
    } catch {
      console.warn(`[MCP Registry] Could not load ${this.configPath}`);
      this.config = { servers: {} };
      this.tools = [];
    }
  }
  buildToolList() {
    this.tools = [];
    for (const [serverName, _serverConfig] of Object.entries(this.config.servers)) {
      if (serverName === "msx-crm") {
        const msxTools = [
          { name: "crm_auth_status", description: "Check CRM authentication status" },
          { name: "crm_whoami", description: "Get current user identity from CRM" },
          { name: "crm_login", description: "Device-code login to CRM" },
          { name: "list_accounts_by_tpid", description: "List accounts by Top Parent ID" },
          { name: "list_opportunities", description: "List opportunities for accounts" },
          { name: "get_milestones", description: "Get engagement milestones" },
          { name: "get_milestone_activities", description: "Get tasks for milestones" },
          { name: "crm_get_record", description: "Get a single CRM record by ID" },
          { name: "crm_query", description: "Execute OData query against CRM" },
          { name: "crm_list_entity_properties", description: "List entity properties/schema" },
          { name: "get_task_status_options", description: "Get valid task status values" },
          { name: "view_milestone_timeline", description: "Timeline view of milestones" },
          { name: "view_opportunity_cost_trend", description: "Cost trend chart data" },
          { name: "view_staged_changes_diff", description: "Diff preview for write ops" },
          { name: "create_task", description: "Create a new CRM task (LIVE write)" },
          { name: "update_task", description: "Update an existing CRM task (LIVE write)" },
          { name: "close_task", description: "Close a CRM task (LIVE write)" },
          { name: "update_milestone", description: "Update milestone fields (LIVE write)" }
        ];
        for (const tool of msxTools) {
          this.tools.push({ ...tool, server: serverName });
        }
      } else if (serverName === "workiq") {
        this.tools.push({
          name: "ask_work_iq",
          description: "Query M365 data (Teams, Outlook, SharePoint, Transcripts)",
          server: serverName
        });
      }
    }
  }
  getTools() {
    return this.tools;
  }
  getToolsByServer(serverName) {
    return this.tools.filter((t) => t.server === serverName);
  }
  getServerConfig(serverName) {
    return this.config.servers[serverName];
  }
  getServers() {
    return Object.keys(this.config.servers);
  }
}
class SkillsLoader {
  skills = /* @__PURE__ */ new Map();
  skillsDir;
  constructor(workspaceRoot) {
    const root = workspaceRoot ?? this.findWorkspaceRoot();
    this.skillsDir = join(root, ".github", "skills");
  }
  findWorkspaceRoot() {
    let dir = process.cwd();
    while (dir !== "/") {
      if (existsSync(join(dir, ".vscode", "mcp.json"))) return dir;
      dir = join(dir, "..");
    }
    return process.cwd();
  }
  async load() {
    this.skills.clear();
    if (!existsSync(this.skillsDir)) {
      console.warn(`[Skills Loader] Skills directory not found: ${this.skillsDir}`);
      return;
    }
    const files = await readdir(this.skillsDir);
    const skillFiles = files.filter((f) => f.endsWith("_SKILL.md") || f.endsWith("SKILL.md"));
    for (const file of skillFiles) {
      const filePath = join(this.skillsDir, file);
      const content = await readFile(filePath, "utf-8");
      const parsed = this.parseFrontmatter(content, filePath);
      if (parsed) {
        this.skills.set(parsed.id, parsed);
      }
    }
  }
  parseFrontmatter(content, filePath) {
    const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!match) return null;
    const frontmatter = match[1];
    const name = this.extractField(frontmatter, "name") ?? basename(filePath, ".md");
    const description = this.extractField(frontmatter, "description") ?? "";
    const argumentHint = this.extractField(frontmatter, "argument-hint") ?? "";
    return {
      id: name,
      name,
      description,
      argumentHint,
      filePath,
      rawContent: content
    };
  }
  extractField(frontmatter, field) {
    const regex = new RegExp(`^${field}:\\s*(.+(?:\\n(?:  |\\t).+)*)`, "m");
    const match = frontmatter.match(regex);
    if (!match) return null;
    return match[1].replace(/\n\s+/g, " ").trim();
  }
  getSkills() {
    return Array.from(this.skills.values()).map(({ id, name, description }) => ({
      id,
      name,
      description
    }));
  }
  getSkill(skillId) {
    return this.skills.get(skillId);
  }
  async saveSkill(skillId, content) {
    const skill = this.skills.get(skillId);
    if (!skill) throw new Error(`Skill not found: ${skillId}`);
    await writeFile(skill.filePath, content, "utf-8");
    const parsed = this.parseFrontmatter(content, skill.filePath);
    if (parsed) {
      this.skills.set(parsed.id, parsed);
    }
  }
}
let mainWindow = null;
let mcpRegistry;
let skillsLoader;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: "Copilot Sales Assistant",
    titleBarStyle: "hiddenInset",
    backgroundColor: "#0f172a",
    webPreferences: {
      preload: join(__dirname, "../preload/preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });
  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
app.whenReady().then(async () => {
  mcpRegistry = new McpRegistry();
  await mcpRegistry.load();
  skillsLoader = new SkillsLoader();
  await skillsLoader.load();
  registerIpcHandlers(mcpRegistry, skillsLoader);
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
export {
  AgUiEventType as A,
  copilotClient$1 as a,
  createAgUiEvent as c,
  mainWindow,
  mcpRegistry,
  skillsLoader
};
