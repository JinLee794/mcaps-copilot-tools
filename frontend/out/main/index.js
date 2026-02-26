import { ipcMain, BrowserWindow, app } from "electron";
import { join, basename } from "path";
import { CopilotClient as CopilotClient$1, approveAll } from "@github/copilot-sdk";
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
let messageCounter = 0;
function translateSdkToAgUi(event, runId) {
  switch (event.type) {
    case "session.start":
      return createAgUiEvent(AgUiEventType.RUN_STARTED, runId, {});
    case "session.idle":
      return createAgUiEvent(AgUiEventType.RUN_FINISHED, runId, {});
    case "assistant.turn_start":
      messageCounter++;
      return createAgUiEvent(AgUiEventType.TEXT_MESSAGE_START, runId, {
        messageId: `msg-${messageCounter}`,
        role: "assistant"
      });
    case "assistant.message_delta":
      return createAgUiEvent(AgUiEventType.TEXT_MESSAGE_CONTENT, runId, {
        messageId: event.data.messageId,
        content: event.data.deltaContent
      });
    case "assistant.turn_end":
      return createAgUiEvent(AgUiEventType.TEXT_MESSAGE_END, runId, {
        messageId: `msg-${messageCounter}`
      });
    case "tool.execution_start":
      return createAgUiEvent(AgUiEventType.TOOL_CALL_START, runId, {
        toolName: event.data.toolName,
        args: event.data.arguments ?? {},
        callId: event.data.toolCallId
      });
    case "tool.execution_complete":
      return createAgUiEvent(AgUiEventType.TOOL_CALL_END, runId, {
        toolName: "",
        // Not available on completion events
        callId: event.data.toolCallId,
        result: event.data.result?.content ?? null,
        status: event.data.success ? "success" : "error",
        durationMs: 0
      });
    case "session.error":
      return createAgUiEvent(AgUiEventType.RUN_ERROR, runId, {
        error: event.data.message
      });
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
  sdk;
  mcpRegistry;
  destroyed = false;
  constructor(mcpRegistry2, opts) {
    this.mcpRegistry = mcpRegistry2;
    const sdkOpts = {
      useStdio: !opts?.cliUrl,
      autoStart: true,
      autoRestart: true,
      logLevel: "warning"
    };
    if (opts?.cliUrl) sdkOpts.cliUrl = opts.cliUrl;
    if (opts?.cliPath) sdkOpts.cliPath = opts.cliPath;
    if (process.env["COPILOT_CLI_PATH"]) sdkOpts.cliPath = process.env["COPILOT_CLI_PATH"];
    this.sdk = new CopilotClient$1(sdkOpts);
  }
  /**
   * Create a session with MCP servers from the registry automatically wired in.
   */
  async createSession(config = {}) {
    const mcpServers = this.mcpRegistry.toSdkMcpServers();
    return this.sdk.createSession({
      ...config,
      mcpServers: { ...mcpServers, ...config.mcpServers },
      onPermissionRequest: config.onPermissionRequest ?? approveAll,
      streaming: config.streaming ?? true
    });
  }
  /** Expose the underlying SDK client for advanced use (resume, ping, etc.). */
  get raw() {
    return this.sdk;
  }
  async destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    await this.sdk.stop();
  }
}
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
      case "tool.execution_start": {
        const callId = event.data.toolCallId;
        this.pendingTools.set(callId, {
          tool: event.data.toolName,
          args: event.data.arguments ?? {},
          start: Date.now()
        });
        break;
      }
      case "tool.execution_complete": {
        const callId = event.data.toolCallId;
        const pending = this.pendingTools.get(callId);
        if (pending) {
          const durationMs = Date.now() - pending.start;
          this.log.toolCallSequence.push({
            stepId: callId,
            tool: pending.tool,
            args: pending.args,
            result: event.data.result?.content ?? null,
            durationMs,
            status: event.data.success ? "success" : "error"
          });
          this.pendingTools.delete(callId);
        }
        break;
      }
      case "assistant.message_delta": {
        const content = event.data.deltaContent;
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
let permissionResolve = null;
const pendingToolCalls = /* @__PURE__ */ new Map();
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
      const allToolNames = mcpRegistry2.getTools().map((t) => t.name);
      emitCliActivity(window, runId, "tool_registered", `${allToolNames.length} tools available`, allToolNames.join(", "));
      emitCliActivity(window, runId, "context_added", "System prompt configured");
      const workspaceRoot = mcpRegistry2.workspaceRoot;
      const session = await client.createSession({
        model: "claude-sonnet-4",
        systemMessage: { mode: "append", content: systemPrompt },
        streaming: true,
        workingDirectory: workspaceRoot,
        onPermissionRequest: async (request) => {
          const toolInfo = request.toolCallId ? pendingToolCalls.get(request.toolCallId) : void 0;
          const toolName = toolInfo?.toolName ?? request.kind;
          const proposedArgs = toolInfo?.arguments ?? {};
          const kindLabels = {
            shell: "Run a terminal command",
            write: "Write to a file",
            mcp: "Call an MCP tool",
            read: "Read a file",
            url: "Fetch a URL"
          };
          const action = kindLabels[request.kind] ?? `Permission: ${request.kind}`;
          const message = `${action} — ${toolName}`;
          return new Promise((resolve) => {
            window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.INTERRUPT, runId, {
              message,
              toolName,
              proposedArgs
            }));
            permissionResolve = (resp) => {
              if (request.toolCallId) pendingToolCalls.delete(request.toolCallId);
              resolve({
                kind: resp.approved ? "approved" : "denied-interactively-by-user"
              });
            };
          });
        }
      });
      activeSession = session;
      emitCliActivity(window, runId, "session_created", `Session created: ${session.sessionId}`);
      const recorder = new SessionRecorder(
        session.sessionId,
        params.skill,
        params.context,
        workspaceRoot
      );
      recorder.attach(session);
      activeRecorder = recorder;
      session.on((sdkEvent) => {
        emitAgUiEvent(window, sdkEvent, runId);
        if (sdkEvent.type === "tool.execution_start") {
          pendingToolCalls.set(sdkEvent.data.toolCallId, {
            toolName: sdkEvent.data.toolName,
            arguments: sdkEvent.data.arguments
          });
          emitCliActivity(
            window,
            runId,
            "tool_invoked",
            `Calling: ${sdkEvent.data.toolName}`,
            sdkEvent.data.arguments ? JSON.stringify(sdkEvent.data.arguments).slice(0, 300) : void 0
          );
        } else if (sdkEvent.type === "tool.execution_complete") {
          pendingToolCalls.delete(sdkEvent.data.toolCallId);
          emitCliActivity(
            window,
            runId,
            "tool_completed",
            `Completed: ${sdkEvent.data.toolCallId}`
          );
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
      activeSession.abort();
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
    const { WorkflowRunner } = await import("./chunks/workflow-runner-DPuXsEKQ.js");
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
  ipcMain.handle("auth:az-refresh", async () => {
    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const execFileAsync = promisify(execFile);
    try {
      await execFileAsync("az", ["login", "--use-device-code"], { timeout: 12e4 });
      const { stdout } = await execFileAsync("az", ["account", "show", "--query", "user.name", "-o", "tsv"]);
      return { ok: true, user: stdout.trim() };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });
  ipcMain.handle("permission:respond", async (event, params) => {
    if (permissionResolve) {
      permissionResolve(params);
      permissionResolve = null;
    }
    if (activeRecorder) {
      activeRecorder.recordApproval(params.approved);
    }
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window && activeRunId) {
      window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.STATE_DELTA, activeRunId, {
        status: "running"
      }));
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
  /** Strip single-line (//) and block (/* *​/) comments from JSONC text. */
  stripJsonComments(text) {
    let result = "";
    let i = 0;
    let inString = false;
    let escape = false;
    while (i < text.length) {
      const ch = text[i];
      const next = text[i + 1];
      if (inString) {
        result += ch;
        if (escape) {
          escape = false;
        } else if (ch === "\\") {
          escape = true;
        } else if (ch === '"') {
          inString = false;
        }
        i++;
        continue;
      }
      if (ch === '"') {
        inString = true;
        result += ch;
        i++;
      } else if (ch === "/" && next === "/") {
        i += 2;
        while (i < text.length && text[i] !== "\n") i++;
      } else if (ch === "/" && next === "*") {
        i += 2;
        while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++;
        i += 2;
      } else {
        result += ch;
        i++;
      }
    }
    result = result.replace(/,(\s*[}\]])/g, "$1");
    return result;
  }
  async load() {
    try {
      const raw = await readFile(this.configPath, "utf-8");
      const clean = this.stripJsonComments(raw);
      this.config = JSON.parse(clean);
      this.buildToolList();
    } catch (err) {
      console.warn(`[MCP Registry] Could not load ${this.configPath}:`, err);
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
  /** Workspace root derived from the config path. */
  get workspaceRoot() {
    return this.configPath.replace(/[\/\\]\.vscode[\/\\]mcp\.json$/, "");
  }
  /**
   * Convert all loaded servers to the SDK's MCPServerConfig format.
   * Used by CopilotClient when creating sessions.
   */
  toSdkMcpServers() {
    const result = {};
    const cwd = this.workspaceRoot;
    for (const [name, cfg] of Object.entries(this.config.servers)) {
      const sdkCfg = {
        type: "local",
        command: cfg.command,
        args: cfg.args ?? [],
        tools: ["*"],
        cwd
      };
      if (cfg.env) sdkCfg.env = cfg.env;
      result[name] = sdkCfg;
    }
    return result;
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
  createAgUiEvent as c,
  mainWindow,
  mcpRegistry,
  skillsLoader
};
