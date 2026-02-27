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
        // Resolved by copilot-handlers from pendingToolCalls
        callId: event.data.toolCallId,
        result: event.data.result?.content ?? null,
        status: event.data.success ? "success" : "error",
        durationMs: 0
        // Computed by copilot-handlers from start timestamp
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
const TOOL_SOURCE_MAP = {
  get_milestones: "milestones",
  find_milestones_needing_tasks: "milestones",
  list_opportunities: "opportunities",
  get_my_active_opportunities: "opportunities",
  get_milestone_activities: "tasks"
};
function getSourceKeyForTool(toolName, args) {
  if (TOOL_SOURCE_MAP[toolName]) return TOOL_SOURCE_MAP[toolName];
  if (toolName === "ask_work_iq") return detectWorkIqScope(args ?? {});
  if (toolName === "crm_query") return detectCrmQuerySource(args ?? {});
  return null;
}
function routeToolResult(completion) {
  const { toolName, args, result, success } = completion;
  const sourceKey = getSourceKeyForTool(toolName, args);
  if (!success) {
    return sourceKey ? { sourceKey, status: "error", errorInfo: parseToolError(result) } : null;
  }
  if (!sourceKey) return null;
  const parsed = parseToolResult(result);
  if (!parsed) return { sourceKey, status: "loaded", count: 0, records: [] };
  switch (toolName) {
    case "get_milestones":
    case "find_milestones_needing_tasks": {
      const milestones = extractArray(parsed, "milestones") ?? extractTopLevelArray(parsed);
      return {
        sourceKey: "milestones",
        status: "loaded",
        count: milestones.length,
        records: milestones,
        signals: extractMilestoneSignals(milestones)
      };
    }
    case "list_opportunities":
    case "get_my_active_opportunities": {
      const opps = extractArray(parsed, "opportunities") ?? extractTopLevelArray(parsed);
      return {
        sourceKey: "opportunities",
        status: "loaded",
        count: opps.length,
        records: opps
      };
    }
    case "get_milestone_activities": {
      const tasks = extractArray(parsed, "tasks") ?? extractArray(parsed, "activities") ?? extractTopLevelArray(parsed);
      return {
        sourceKey: "tasks",
        status: "loaded",
        count: tasks.length,
        records: tasks,
        signals: extractTaskSignals(tasks)
      };
    }
    case "ask_work_iq": {
      return {
        sourceKey,
        status: "loaded",
        count: typeof parsed.count === "number" ? parsed.count : extractTopLevelArray(parsed).length,
        records: extractTopLevelArray(parsed)
      };
    }
    case "crm_query": {
      const records = extractArray(parsed, "value") ?? extractTopLevelArray(parsed);
      return {
        sourceKey,
        status: "loaded",
        count: records.length,
        records,
        signals: sourceKey === "milestones" ? extractMilestoneSignals(records) : void 0
      };
    }
    default:
      return null;
  }
}
function detectWorkIqScope(args) {
  const query = String(args["query"] ?? "").toLowerCase();
  const scope = String(args["scope"] ?? "").toLowerCase();
  if (scope === "email" || scope === "outlook") return "emails";
  if (scope === "transcript" || scope === "meeting") return "transcripts";
  if (scope === "teams" || scope === "chat" || scope === "channel") return "teams";
  if (scope === "file" || scope === "sharepoint" || scope === "onedrive") return "sharepoint";
  if (/\b(email|outlook|inbox|sent)\b/.test(query)) return "emails";
  if (/\b(transcript|recording|meeting)\b/.test(query)) return "transcripts";
  if (/\b(teams|chat|channel|message)\b/.test(query)) return "teams";
  if (/\b(file|document|sharepoint|onedrive)\b/.test(query)) return "sharepoint";
  return null;
}
function detectCrmQuerySource(args) {
  const entitySet = String(args["entitySet"] ?? "").toLowerCase();
  if (entitySet.includes("milestone")) return "milestones";
  if (entitySet.includes("task") || entitySet.includes("activit")) return "tasks";
  if (entitySet.includes("opportunit")) return "opportunities";
  return null;
}
function parseToolResult(result) {
  if (!result) return null;
  if (typeof result === "object" && !Array.isArray(result)) {
    const obj = result;
    if (Array.isArray(obj["content"])) {
      const firstContent = obj["content"][0];
      if (firstContent?.type === "text" && typeof firstContent.text === "string") {
        try {
          return JSON.parse(firstContent.text);
        } catch {
          return { text: firstContent.text };
        }
      }
    }
    return obj;
  }
  if (typeof result === "string") {
    try {
      const parsed = JSON.parse(result);
      return typeof parsed === "object" && parsed !== null ? parsed : { value: parsed };
    } catch {
      return { text: result };
    }
  }
  if (Array.isArray(result)) {
    return { items: result };
  }
  return null;
}
function extractArray(obj, key) {
  const val = obj[key];
  return Array.isArray(val) ? val : null;
}
function extractTopLevelArray(obj) {
  for (const val of Object.values(obj)) {
    if (Array.isArray(val)) return val;
  }
  return [];
}
function extractMilestoneSignals(milestones) {
  const signals = [];
  if (milestones.length === 0) return signals;
  const statusCounts = {};
  for (const m of milestones) {
    const status = m["msp_milestonestatus@OData.Community.Display.V1.FormattedValue"] ?? String(m.msp_milestonestatus);
    statusCounts[status] = (statusCounts[status] ?? 0) + 1;
  }
  const statusParts = Object.entries(statusCounts).map(([s, c]) => `${c} ${s}`);
  if (statusParts.length > 0) signals.push(statusParts.join(" · "));
  const atRisk = milestones.filter((m) => {
    const fv = m["msp_milestonestatus@OData.Community.Display.V1.FormattedValue"];
    return fv === "At Risk" || m.msp_milestonestatus === 861980002;
  });
  if (atRisk.length > 0) signals.push(`${atRisk.length} milestone${atRisk.length > 1 ? "s" : ""} at risk`);
  const now = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const overdue = milestones.filter(
    (m) => m.msp_milestonedate && m.msp_milestonedate < now && m.msp_milestonestatus !== 861980003
  );
  if (overdue.length > 0) signals.push(`${overdue.length} overdue`);
  return signals;
}
function extractTaskSignals(tasks) {
  const signals = [];
  if (tasks.length === 0) return signals;
  const overdue = tasks.filter((t) => {
    if (!t.scheduledend) return false;
    return t.scheduledend < (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) && t.statecode === 0;
  });
  if (overdue.length > 0) signals.push(`${overdue.length} overdue task${overdue.length > 1 ? "s" : ""}`);
  const open = tasks.filter((t) => t.statecode === 0);
  const closed = tasks.filter((t) => t.statecode !== 0);
  signals.push(`${open.length} open · ${closed.length} closed`);
  return signals;
}
function parseToolError(result) {
  const text = typeof result === "string" ? result : JSON.stringify(result ?? "");
  const lower = text.toLowerCase();
  if (lower.includes("401") || lower.includes("unauthorized") || lower.includes("token expired")) {
    return { code: "401", message: "Authentication expired or invalid", action: "Re-authenticate with CRM" };
  }
  if (lower.includes("403") || lower.includes("forbidden") || lower.includes("access denied")) {
    return { code: "403", message: "Insufficient permissions for this operation", action: "Check role assignment" };
  }
  if (lower.includes("404") || lower.includes("not found") || lower.includes("does not exist")) {
    return { code: "404", message: "Record not found", action: "Verify the record ID is correct" };
  }
  if (lower.includes("429") || lower.includes("rate limit") || lower.includes("throttl")) {
    return { code: "429", message: "Rate limited by CRM API", action: "Wait a moment and retry" };
  }
  if (lower.includes("500") || lower.includes("internal server")) {
    return { code: "500", message: "CRM server error", action: "Retry or check CRM service health" };
  }
  if (lower.includes("timeout") || lower.includes("econnrefused") || lower.includes("network")) {
    return { code: "NETWORK", message: "Network or connection error", action: "Check connectivity" };
  }
  return { code: "UNKNOWN", message: text.slice(0, 200) };
}
const WRITE_TOOLS = /* @__PURE__ */ new Set(["create_task", "update_task", "close_task", "update_milestone"]);
const CRM_FIELD_LABELS = {
  milestoneId: "Milestone ID",
  milestoneDate: "Milestone Date",
  msp_milestonedate: "Milestone Date",
  monthlyUse: "Monthly Use ($)",
  msp_monthlyuse: "Monthly Use ($)",
  forecastComments: "Forecast Comments",
  msp_forecastcomments: "Forecast Comments",
  taskId: "Task ID",
  subject: "Subject",
  dueDate: "Due Date",
  scheduledend: "Due Date",
  description: "Description",
  statusCode: "Status Code",
  category: "Task Category",
  ownerId: "Owner ID"
};
function buildWriteToolDiffPreview(toolName, args) {
  if (!WRITE_TOOLS.has(toolName)) return void 0;
  const rows = [];
  for (const [key, value] of Object.entries(args)) {
    if (value == null) continue;
    if (key === "milestoneId" || key === "taskId") continue;
    const label = CRM_FIELD_LABELS[key] ?? key;
    rows.push({
      field: label,
      before: toolName === "create_task" ? "(new)" : "(current)",
      after: String(value)
    });
  }
  return rows.length > 0 ? rows : void 0;
}
let activeRunId = null;
let activeSession = null;
let activeSessionMeta = null;
let activeRecorder = null;
let copilotClient = null;
let permissionResolve = null;
const pendingToolCalls = /* @__PURE__ */ new Map();
async function getSessionsDir() {
  const { join: join2 } = await import("node:path");
  return join2(process.cwd(), ".copilot", "sessions");
}
async function loadSessionIndex() {
  const { readFile: readFile2 } = await import("node:fs/promises");
  const { join: join2 } = await import("node:path");
  try {
    const raw = await readFile2(join2(await getSessionsDir(), "index.json"), "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data.sessions) ? data.sessions : [];
  } catch {
    return [];
  }
}
async function saveSessionIndex(sessions) {
  const { writeFile: writeFile2, mkdir: mkdir2 } = await import("node:fs/promises");
  const { join: join2 } = await import("node:path");
  const dir = await getSessionsDir();
  await mkdir2(dir, { recursive: true });
  await writeFile2(join2(dir, "index.json"), JSON.stringify({ sessions }, null, 2), "utf-8");
}
async function upsertSessionMeta(meta) {
  const sessions = await loadSessionIndex();
  const idx = sessions.findIndex((s) => s.id === meta.id);
  if (idx >= 0) {
    sessions[idx] = meta;
  } else {
    sessions.unshift(meta);
  }
  await saveSessionIndex(sessions);
}
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
      if (activeSession && activeSessionMeta) {
        activeSessionMeta.messageCount += 1;
        activeSessionMeta.lastActiveAt = (/* @__PURE__ */ new Date()).toISOString();
        await upsertSessionMeta(activeSessionMeta);
        emitCliActivity(window, runId, "prompt_sent", "Follow-up sent to existing session", params.prompt.slice(0, 200));
        window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.STATE_DELTA, runId, {
          sessionId: activeSessionMeta.id,
          sessionTitle: activeSessionMeta.title,
          messageCount: activeSessionMeta.messageCount
        }));
        await activeSession.send({ prompt: params.prompt });
        return runId;
      }
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
            const diffPreview = buildWriteToolDiffPreview(toolName, proposedArgs);
            window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.INTERRUPT, runId, {
              message,
              toolName,
              proposedArgs,
              ...diffPreview ? { diffPreview } : {}
            }));
            permissionResolve = (resp) => {
              resolve({
                kind: resp.approved ? "approved" : "denied-interactively-by-user"
              });
            };
          });
        }
      });
      activeSession = session;
      const sessionTitle = params.prompt.slice(0, 80).replace(/\n/g, " ").trim() || "Untitled session";
      activeSessionMeta = {
        id: session.sessionId,
        skillId: params.skill,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        lastActiveAt: (/* @__PURE__ */ new Date()).toISOString(),
        messageCount: 1,
        title: sessionTitle
      };
      await upsertSessionMeta(activeSessionMeta);
      emitCliActivity(window, runId, "session_created", `Session created: ${session.sessionId}`);
      window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.STATE_DELTA, runId, {
        sessionId: session.sessionId,
        sessionTitle,
        messageCount: 1
      }));
      const recorder = new SessionRecorder(
        session.sessionId,
        params.skill,
        params.context,
        workspaceRoot
      );
      recorder.attach(session);
      activeRecorder = recorder;
      session.on((sdkEvent) => {
        if (sdkEvent.type === "tool.execution_complete") {
          const toolInfo = pendingToolCalls.get(sdkEvent.data.toolCallId);
          const durationMs = toolInfo ? Date.now() - toolInfo.startedAt : 0;
          const resolvedName = toolInfo?.toolName ?? "";
          const resolvedArgs = toolInfo?.arguments ?? {};
          pendingToolCalls.delete(sdkEvent.data.toolCallId);
          const sourceUpdate = routeToolResult({
            toolName: resolvedName,
            args: resolvedArgs,
            result: sdkEvent.data.result?.content ?? sdkEvent.data.result,
            success: sdkEvent.data.success ?? true
          });
          window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.TOOL_CALL_END, runId, {
            toolName: resolvedName,
            callId: sdkEvent.data.toolCallId,
            result: sdkEvent.data.result?.content ?? null,
            status: sdkEvent.data.success ? "success" : "error",
            durationMs,
            ...sourceUpdate?.errorInfo ? { errorInfo: sourceUpdate.errorInfo } : {},
            ...sourceUpdate?.signals?.length ? { summary: sourceUpdate.signals.join(" · ") } : {}
          }));
          if (sourceUpdate) {
            const sourcePayload = {
              status: sourceUpdate.status,
              count: sourceUpdate.count ?? 0,
              records: sourceUpdate.records ?? [],
              signals: sourceUpdate.signals ?? [],
              lastFetched: (/* @__PURE__ */ new Date()).toISOString()
            };
            if (sourceUpdate.errorInfo) {
              sourcePayload.errorInfo = sourceUpdate.errorInfo;
            }
            window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.STATE_DELTA, runId, {
              sources: {
                [sourceUpdate.sourceKey]: sourcePayload
              }
            }));
          }
          emitCliActivity(
            window,
            runId,
            "tool_completed",
            `Completed: ${resolvedName || sdkEvent.data.toolCallId} (${durationMs}ms)`
          );
        } else {
          emitAgUiEvent(window, sdkEvent, runId);
        }
        if (sdkEvent.type === "tool.execution_start") {
          pendingToolCalls.set(sdkEvent.data.toolCallId, {
            toolName: sdkEvent.data.toolName,
            arguments: sdkEvent.data.arguments,
            startedAt: Date.now()
          });
          const sourceKey = getSourceKeyForTool(
            sdkEvent.data.toolName,
            sdkEvent.data.arguments
          );
          if (sourceKey) {
            window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.STATE_DELTA, runId, {
              sources: {
                [sourceKey]: { status: "loading", count: 0, records: [], signals: [] }
              }
            }));
          }
          emitCliActivity(
            window,
            runId,
            "tool_invoked",
            `Calling: ${sdkEvent.data.toolName}`,
            sdkEvent.data.arguments ? JSON.stringify(sdkEvent.data.arguments).slice(0, 300) : void 0
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
      activeSessionMeta = null;
      activeRunId = null;
    }
  });
  ipcMain.handle("copilot:new-session", async () => {
    if (activeSession) {
      try {
        activeSession.abort();
      } catch {
      }
    }
    activeSession = null;
    activeSessionMeta = null;
    activeRunId = null;
    activeRecorder = null;
    return { ok: true };
  });
  ipcMain.handle("copilot:list-sessions", async () => {
    const sessions = await loadSessionIndex();
    return { sessions };
  });
  ipcMain.handle("copilot:get-active-session", async () => {
    return { session: activeSessionMeta };
  });
  ipcMain.handle("copilot:resume-session", async (event, { sessionId }) => {
    const { readFile: readFile2 } = await import("node:fs/promises");
    const { join: join2 } = await import("node:path");
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return { error: "No window" };
    if (activeSession) {
      try {
        activeSession.abort();
      } catch {
      }
      activeSession = null;
    }
    const sessionsDir = await getSessionsDir();
    let sessionLog = null;
    try {
      const raw = await readFile2(join2(sessionsDir, `session-${sessionId}.json`), "utf-8");
      sessionLog = JSON.parse(raw);
    } catch {
    }
    const sessions = await loadSessionIndex();
    const meta = sessions.find((s) => s.id === sessionId);
    if (!meta) return { error: "Session not found" };
    let contextSummary = "";
    if (sessionLog?.finalOutput) {
      contextSummary = `

Previous conversation summary:
${sessionLog.finalOutput.slice(0, 2e3)}`;
    }
    if (sessionLog?.toolCallSequence?.length) {
      const toolSummary = sessionLog.toolCallSequence.slice(-10).map((t) => `- ${t.tool}(${JSON.stringify(t.args).slice(0, 100)})`).join("\n");
      contextSummary += `

Recent tool calls from previous session:
${toolSummary}`;
    }
    const client = getClient(mcpRegistry2);
    const skill = skillsLoader2.getSkill(meta.skillId);
    const systemPrompt = skill?.rawContent ?? `You are a sales assistant. Run the "${meta.skillId}" skill.`;
    const workspaceRoot = mcpRegistry2.workspaceRoot;
    const session = await client.createSession({
      model: "claude-sonnet-4",
      systemMessage: {
        mode: "append",
        content: systemPrompt + contextSummary
      },
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
          const diffPreview = buildWriteToolDiffPreview(toolName, proposedArgs);
          window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.INTERRUPT, activeRunId ?? "resumed", {
            message,
            toolName,
            proposedArgs,
            ...diffPreview ? { diffPreview } : {}
          }));
          permissionResolve = (resp) => {
            resolve({ kind: resp.approved ? "approved" : "denied-interactively-by-user" });
          };
        });
      }
    });
    activeSession = session;
    activeSessionMeta = { ...meta, lastActiveAt: (/* @__PURE__ */ new Date()).toISOString() };
    await upsertSessionMeta(activeSessionMeta);
    session.on((sdkEvent) => {
      if (sdkEvent.type === "tool.execution_complete") {
        const toolInfo = pendingToolCalls.get(sdkEvent.data.toolCallId);
        const durationMs = toolInfo ? Date.now() - toolInfo.startedAt : 0;
        const resolvedName = toolInfo?.toolName ?? "";
        const resolvedArgs = toolInfo?.arguments ?? {};
        pendingToolCalls.delete(sdkEvent.data.toolCallId);
        const sourceUpdate = routeToolResult({ toolName: resolvedName, args: resolvedArgs, result: sdkEvent.data.result?.content ?? sdkEvent.data.result, success: sdkEvent.data.success ?? true });
        window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.TOOL_CALL_END, activeRunId ?? "resumed", {
          toolName: resolvedName,
          callId: sdkEvent.data.toolCallId,
          result: sdkEvent.data.result?.content ?? null,
          status: sdkEvent.data.success ? "success" : "error",
          durationMs,
          ...sourceUpdate?.errorInfo ? { errorInfo: sourceUpdate.errorInfo } : {},
          ...sourceUpdate?.signals?.length ? { summary: sourceUpdate.signals.join(" · ") } : {}
        }));
        if (sourceUpdate) {
          const sourcePayload = {
            status: sourceUpdate.status,
            count: sourceUpdate.count ?? 0,
            records: sourceUpdate.records ?? [],
            signals: sourceUpdate.signals ?? [],
            lastFetched: (/* @__PURE__ */ new Date()).toISOString()
          };
          if (sourceUpdate.errorInfo) sourcePayload.errorInfo = sourceUpdate.errorInfo;
          window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.STATE_DELTA, activeRunId ?? "resumed", {
            sources: { [sourceUpdate.sourceKey]: sourcePayload }
          }));
        }
      } else {
        emitAgUiEvent(window, sdkEvent, activeRunId ?? "resumed");
      }
      if (sdkEvent.type === "tool.execution_start") {
        pendingToolCalls.set(sdkEvent.data.toolCallId, {
          toolName: sdkEvent.data.toolName,
          arguments: sdkEvent.data.arguments,
          startedAt: Date.now()
        });
        const sourceKey = getSourceKeyForTool(sdkEvent.data.toolName, sdkEvent.data.arguments);
        if (sourceKey) {
          window.webContents.send("ag-ui:event", createAgUiEvent(AgUiEventType.STATE_DELTA, activeRunId ?? "resumed", {
            sources: { [sourceKey]: { status: "loading", count: 0, records: [], signals: [] } }
          }));
        }
      }
    });
    return { ok: true, session: activeSessionMeta };
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
