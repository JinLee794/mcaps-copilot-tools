// IPC Handlers — registers all ipcMain handlers (§11, IPC Channel Reference)
import { ipcMain, BrowserWindow } from 'electron';
import type { McpRegistry } from './mcp-registry';
import type { SkillsLoader } from './skills-loader';
import { emitAgUiEvent, resetTranslatorState } from '../ag-ui-translator';
import { AgUiEventType, createAgUiEvent } from '../../shared/types/AgUiEvent';
import type { CliActivityKind } from '../../shared/types/AgUiEvent';
import { CopilotClient } from '../copilot-client';
import type { CopilotSession, PermissionRequestResult } from '@github/copilot-sdk';
import { SessionRecorder } from '../session-recorder';
import { getSourceKeyForTool, routeToolResult } from '../tool-result-router';

// ── Write-tool diff preview ───────────────────────────────────
// At INTERRUPT time the tool hasn't executed yet, so we don't have a
// before-state from CRM. Build a "proposed changes" preview from the
// tool arguments so the ApprovalCard shows what fields will be set.

const WRITE_TOOLS = new Set(['create_task', 'update_task', 'close_task', 'update_milestone']);

const CRM_FIELD_LABELS: Record<string, string> = {
  milestoneId: 'Milestone ID',
  milestoneDate: 'Milestone Date',
  msp_milestonedate: 'Milestone Date',
  monthlyUse: 'Monthly Use ($)',
  msp_monthlyuse: 'Monthly Use ($)',
  forecastComments: 'Forecast Comments',
  msp_forecastcomments: 'Forecast Comments',
  taskId: 'Task ID',
  subject: 'Subject',
  dueDate: 'Due Date',
  scheduledend: 'Due Date',
  description: 'Description',
  statusCode: 'Status Code',
  category: 'Task Category',
  ownerId: 'Owner ID',
};

function buildWriteToolDiffPreview(
  toolName: string,
  args: Record<string, unknown>,
): Array<{ field: string; before: string; after: string }> | undefined {
  if (!WRITE_TOOLS.has(toolName)) return undefined;

  const rows: Array<{ field: string; before: string; after: string }> = [];
  for (const [key, value] of Object.entries(args)) {
    if (value == null) continue;
    // Skip ID params — they identify the record, not a change
    if (key === 'milestoneId' || key === 'taskId') continue;
    const label = CRM_FIELD_LABELS[key] ?? key;
    rows.push({
      field: label,
      before: toolName === 'create_task' ? '(new)' : '(current)',
      after: String(value),
    });
  }
  return rows.length > 0 ? rows : undefined;
}

// ── Session index types ────────────────────────────────────────────
export interface SessionMeta {
  id: string;
  skillId: string;
  createdAt: string;
  lastActiveAt: string;
  messageCount: number;
  title: string;
}

// Active run state
let activeRunId: string | null = null;
let activeSession: CopilotSession | null = null;
let activeSessionMeta: SessionMeta | null = null;
let activeRecorder: SessionRecorder | null = null;
let copilotClient: CopilotClient | null = null;
let permissionResolve: ((response: { approved: boolean; edits?: Record<string, unknown> }) => void) | null = null;

// Map toolCallId → { toolName, arguments, startedAt } so we can display real info in permission requests
const pendingToolCalls = new Map<string, { toolName: string; arguments?: Record<string, unknown>; startedAt: number }>();

// ── Session index persistence helpers ─────────────────────────────
async function getSessionsDir(): Promise<string> {
  const { join } = await import('node:path');
  return join(process.cwd(), '.copilot', 'sessions');
}

async function loadSessionIndex(): Promise<SessionMeta[]> {
  const { readFile } = await import('node:fs/promises');
  const { join } = await import('node:path');
  try {
    const raw = await readFile(join(await getSessionsDir(), 'index.json'), 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data.sessions) ? data.sessions : [];
  } catch {
    return [];
  }
}

async function saveSessionIndex(sessions: SessionMeta[]): Promise<void> {
  const { writeFile, mkdir } = await import('node:fs/promises');
  const { join } = await import('node:path');
  const dir = await getSessionsDir();
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.json'), JSON.stringify({ sessions }, null, 2), 'utf-8');
}

async function upsertSessionMeta(meta: SessionMeta): Promise<void> {
  const sessions = await loadSessionIndex();
  const idx = sessions.findIndex((s) => s.id === meta.id);
  if (idx >= 0) {
    sessions[idx] = meta;
  } else {
    sessions.unshift(meta);
  }
  await saveSessionIndex(sessions);
}

function emitCliActivity(
  window: BrowserWindow,
  runId: string,
  kind: CliActivityKind,
  label: string,
  detail?: string,
) {
  window.webContents.send(
    'ag-ui:event',
    createAgUiEvent(AgUiEventType.CUSTOM, runId, {
      id: `cli-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      kind,
      label,
      detail,
      timestamp: Date.now(),
    }),
  );
}

function getClient(mcpRegistry: McpRegistry): CopilotClient {
  if (!copilotClient) {
    copilotClient = new CopilotClient(mcpRegistry, {
      cliUrl: process.env['COPILOT_CLI_URL'],
    });
  }
  return copilotClient;
}

export function registerIpcHandlers(mcpRegistry: McpRegistry, skillsLoader: SkillsLoader): void {
  // ── copilot:run ─────────────────────────────────────────────────
  // Renderer → Main: Start a skill run (reuses active session for follow-ups)
  ipcMain.handle('copilot:run', async (event, params: { skill: string; prompt: string; context: Record<string, unknown> }) => {
    const runId = `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    activeRunId = runId;
    resetTranslatorState();

    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return runId;

    // Emit RUN_STARTED
    window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.RUN_STARTED, runId, {
      skill: params.skill,
    }));

    try {
      // ── Follow-up on existing session ──────────────────────────
      if (activeSession && activeSessionMeta) {
        activeSessionMeta.messageCount += 1;
        activeSessionMeta.lastActiveAt = new Date().toISOString();
        await upsertSessionMeta(activeSessionMeta);

        emitCliActivity(window, runId, 'prompt_sent', 'Follow-up sent to existing session', params.prompt.slice(0, 200));

        // Notify renderer of current session ID
        window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.STATE_DELTA, runId, {
          sessionId: activeSessionMeta.id,
          sessionTitle: activeSessionMeta.title,
          messageCount: activeSessionMeta.messageCount,
        }));

        await activeSession.send({ prompt: params.prompt });
        return runId;
      }

      // ── New session creation ──────────────────────────────────
      const client = getClient(mcpRegistry);

      // 1. Load skill definition
      const skill = skillsLoader.getSkill(params.skill);
      const systemPrompt = skill?.rawContent ?? `You are a sales assistant. Run the "${params.skill}" skill.`;
      emitCliActivity(window, runId, 'skill_loaded', `Skill loaded: ${params.skill}`, systemPrompt.slice(0, 200));

      // 2. Log registered tools
      const allToolNames = mcpRegistry.getTools().map((t) => t.name);
      emitCliActivity(window, runId, 'tool_registered', `${allToolNames.length} tools available`, allToolNames.join(', '));
      emitCliActivity(window, runId, 'context_added', 'System prompt configured');

      // 3. Create SDK session — MCP servers are wired in automatically by CopilotClient
      const workspaceRoot = mcpRegistry.workspaceRoot;
      const session = await client.createSession({
        model: 'claude-sonnet-4',
        systemMessage: { mode: 'append', content: systemPrompt },
        streaming: true,
        workingDirectory: workspaceRoot,
        onPermissionRequest: async (request) => {
          // Look up the real tool name/args from the preceding tool.execution_start event
          const toolInfo = request.toolCallId ? pendingToolCalls.get(request.toolCallId) : undefined;
          const toolName = toolInfo?.toolName ?? request.kind;
          const proposedArgs = toolInfo?.arguments ?? {};

          const kindLabels: Record<string, string> = {
            shell: 'Run a terminal command',
            write: 'Write to a file',
            mcp: 'Call an MCP tool',
            read: 'Read a file',
            url: 'Fetch a URL',
          };
          const action = kindLabels[request.kind] ?? `Permission: ${request.kind}`;
          const message = `${action} — ${toolName}`;

          // HITL: emit INTERRUPT and wait for user response
          return new Promise<PermissionRequestResult>((resolve) => {
            const diffPreview = buildWriteToolDiffPreview(toolName, proposedArgs);
            window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.INTERRUPT, runId, {
              message,
              toolName,
              proposedArgs,
              ...(diffPreview ? { diffPreview } : {}),
            }));

            permissionResolve = (resp) => {
              // Do NOT delete from pendingToolCalls here — tool.execution_complete
              // needs the entry for toolName resolution + duration calculation.
              resolve({
                kind: resp.approved ? 'approved' : 'denied-interactively-by-user',
              });
            };
          });
        },
      });
      activeSession = session;

      // 4a. Build + persist session metadata
      const sessionTitle = params.prompt.slice(0, 80).replace(/\n/g, ' ').trim() || 'Untitled session';
      activeSessionMeta = {
        id: session.sessionId,
        skillId: params.skill,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        messageCount: 1,
        title: sessionTitle,
      };
      await upsertSessionMeta(activeSessionMeta);

      emitCliActivity(window, runId, 'session_created', `Session created: ${session.sessionId}`);

      // Notify renderer of session ID
      window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.STATE_DELTA, runId, {
        sessionId: session.sessionId,
        sessionTitle,
        messageCount: 1,
      }));

      // 4. Attach SessionRecorder for workflow capture
      const recorder = new SessionRecorder(
        session.sessionId,
        params.skill,
        params.context,
        workspaceRoot,
      );
      recorder.attach(session);
      activeRecorder = recorder;

      // 5. Subscribe to SDK events → AG-UI translation → renderer
      session.on((sdkEvent) => {
        // For tool.execution_complete, emit an enriched TOOL_CALL_END
        // with the real toolName and computed durationMs from pendingToolCalls.
        if (sdkEvent.type === 'tool.execution_complete') {
          const toolInfo = pendingToolCalls.get(sdkEvent.data.toolCallId);
          const durationMs = toolInfo ? Date.now() - toolInfo.startedAt : 0;
          const resolvedName = toolInfo?.toolName ?? '';
          const resolvedArgs = toolInfo?.arguments ?? {};
          pendingToolCalls.delete(sdkEvent.data.toolCallId);

          // Route tool result → source node STATE_DELTA (compute before TOOL_CALL_END so we can enrich it)
          const sourceUpdate = routeToolResult({
            toolName: resolvedName,
            args: resolvedArgs,
            result: sdkEvent.data.result?.content ?? sdkEvent.data.result,
            success: sdkEvent.data.success ?? true,
          });

          window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.TOOL_CALL_END, runId, {
            toolName: resolvedName,
            callId: sdkEvent.data.toolCallId,
            result: sdkEvent.data.result?.content ?? null,
            status: sdkEvent.data.success ? 'success' : 'error',
            durationMs,
            ...(sourceUpdate?.errorInfo ? { errorInfo: sourceUpdate.errorInfo } : {}),
            ...(sourceUpdate?.signals?.length ? { summary: sourceUpdate.signals.join(' · ') } : {}),
          }));

          if (sourceUpdate) {
            const sourcePayload: Record<string, unknown> = {
              status: sourceUpdate.status,
              count: sourceUpdate.count ?? 0,
              records: sourceUpdate.records ?? [],
              signals: sourceUpdate.signals ?? [],
              lastFetched: new Date().toISOString(),
            };
            if (sourceUpdate.errorInfo) {
              sourcePayload.errorInfo = sourceUpdate.errorInfo;
            }
            window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.STATE_DELTA, runId, {
              sources: {
                [sourceUpdate.sourceKey]: sourcePayload,
              },
            }));
          }

          emitCliActivity(window, runId, 'tool_completed',
            `Completed: ${resolvedName || sdkEvent.data.toolCallId} (${durationMs}ms)`,
          );
        } else {
          emitAgUiEvent(window, sdkEvent, runId);
        }

        // Forward tool call events as CLI activity entries
        if (sdkEvent.type === 'tool.execution_start') {
          // Track for permission request lookups + duration calculation
          pendingToolCalls.set(sdkEvent.data.toolCallId, {
            toolName: sdkEvent.data.toolName,
            arguments: sdkEvent.data.arguments as Record<string, unknown> | undefined,
            startedAt: Date.now(),
          });

          // Emit 'loading' state for the relevant source node
          const sourceKey = getSourceKeyForTool(
            sdkEvent.data.toolName,
            sdkEvent.data.arguments as Record<string, unknown> | undefined,
          );
          if (sourceKey) {
            window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.STATE_DELTA, runId, {
              sources: {
                [sourceKey]: { status: 'loading', count: 0, records: [], signals: [] },
              },
            }));
          }

          emitCliActivity(window, runId, 'tool_invoked',
            `Calling: ${sdkEvent.data.toolName}`,
            sdkEvent.data.arguments ? JSON.stringify(sdkEvent.data.arguments).slice(0, 300) : undefined,
          );
        }
      });

      // 6. Send the prompt
      emitCliActivity(window, runId, 'prompt_sent', 'Prompt sent to agent', params.prompt.slice(0, 200));
      await session.send({ prompt: params.prompt });

    } catch (err) {
      // Emit error event
      window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.RUN_ERROR, runId, {
        error: (err as Error).message,
      }));
      activeRunId = null;
      activeSession = null;
    }

    return runId;
  });

  // ── copilot:cancel ──────────────────────────────────────────────
  ipcMain.handle('copilot:cancel', async (_event, { runId }: { runId: string }) => {
    if (activeRunId === runId && activeSession) {
      activeSession.abort();
      activeSession = null;
      activeSessionMeta = null;
      activeRunId = null;
    }
  });

  // ── copilot:new-session ─────────────────────────────────────────
  // Explicitly close the current session so the next copilot:run creates a fresh one
  ipcMain.handle('copilot:new-session', async () => {
    if (activeSession) {
      try { activeSession.abort(); } catch { /* ignore */ }
    }
    activeSession = null;
    activeSessionMeta = null;
    activeRunId = null;
    activeRecorder = null;
    return { ok: true };
  });

  // ── copilot:list-sessions ───────────────────────────────────────
  ipcMain.handle('copilot:list-sessions', async () => {
    const sessions = await loadSessionIndex();
    return { sessions };
  });

  // ── copilot:get-active-session ──────────────────────────────────
  ipcMain.handle('copilot:get-active-session', async () => {
    return { session: activeSessionMeta };
  });

  // ── copilot:resume-session ──────────────────────────────────────
  // Load a previous session's context and create a new SDK session seeded
  // with the conversation summary so the agent has continuity.
  ipcMain.handle('copilot:resume-session', async (event, { sessionId }: { sessionId: string }) => {
    const { readFile } = await import('node:fs/promises');
    const { join } = await import('node:path');
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return { error: 'No window' };

    // Close any current session
    if (activeSession) {
      try { activeSession.abort(); } catch { /* ignore */ }
      activeSession = null;
    }

    // Load the session log from disk
    const sessionsDir = await getSessionsDir();
    let sessionLog: { finalOutput?: string; toolCallSequence?: Array<{ tool: string; args: Record<string, unknown>; result: unknown }> } | null = null;
    try {
      const raw = await readFile(join(sessionsDir, `session-${sessionId}.json`), 'utf-8');
      sessionLog = JSON.parse(raw);
    } catch { /* session log may not exist yet */ }

    // Find session metadata
    const sessions = await loadSessionIndex();
    const meta = sessions.find((s) => s.id === sessionId);
    if (!meta) return { error: 'Session not found' };

    // Build a context summary from the previous session log
    let contextSummary = '';
    if (sessionLog?.finalOutput) {
      contextSummary = `\n\nPrevious conversation summary:\n${sessionLog.finalOutput.slice(0, 2000)}`;
    }
    if (sessionLog?.toolCallSequence?.length) {
      const toolSummary = sessionLog.toolCallSequence
        .slice(-10)
        .map((t) => `- ${t.tool}(${JSON.stringify(t.args).slice(0, 100)})`)
        .join('\n');
      contextSummary += `\n\nRecent tool calls from previous session:\n${toolSummary}`;
    }

    // Create a new SDK session seeded with the previous context
    const client = getClient(mcpRegistry);
    const skill = skillsLoader.getSkill(meta.skillId);
    const systemPrompt = skill?.rawContent ?? `You are a sales assistant. Run the "${meta.skillId}" skill.`;
    const workspaceRoot = mcpRegistry.workspaceRoot;

    const session = await client.createSession({
      model: 'claude-sonnet-4',
      systemMessage: {
        mode: 'append',
        content: systemPrompt + contextSummary,
      },
      streaming: true,
      workingDirectory: workspaceRoot,
      onPermissionRequest: async (request) => {
        const toolInfo = request.toolCallId ? pendingToolCalls.get(request.toolCallId) : undefined;
        const toolName = toolInfo?.toolName ?? request.kind;
        const proposedArgs = toolInfo?.arguments ?? {};
        const kindLabels: Record<string, string> = {
          shell: 'Run a terminal command', write: 'Write to a file',
          mcp: 'Call an MCP tool', read: 'Read a file', url: 'Fetch a URL',
        };
        const action = kindLabels[request.kind] ?? `Permission: ${request.kind}`;
        const message = `${action} — ${toolName}`;
        return new Promise<PermissionRequestResult>((resolve) => {
          const diffPreview = buildWriteToolDiffPreview(toolName, proposedArgs);
          window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.INTERRUPT, activeRunId ?? 'resumed', {
            message, toolName, proposedArgs,
            ...(diffPreview ? { diffPreview } : {}),
          }));
          permissionResolve = (resp) => {
            resolve({ kind: resp.approved ? 'approved' : 'denied-interactively-by-user' });
          };
        });
      },
    });

    activeSession = session;
    activeSessionMeta = { ...meta, lastActiveAt: new Date().toISOString() };
    await upsertSessionMeta(activeSessionMeta);

    // Attach event forwarding (same as copilot:run)
    session.on((sdkEvent) => {
      if (sdkEvent.type === 'tool.execution_complete') {
        const toolInfo = pendingToolCalls.get(sdkEvent.data.toolCallId);
        const durationMs = toolInfo ? Date.now() - toolInfo.startedAt : 0;
        const resolvedName = toolInfo?.toolName ?? '';
        const resolvedArgs = toolInfo?.arguments ?? {};
        pendingToolCalls.delete(sdkEvent.data.toolCallId);
        const sourceUpdate = routeToolResult({ toolName: resolvedName, args: resolvedArgs, result: sdkEvent.data.result?.content ?? sdkEvent.data.result, success: sdkEvent.data.success ?? true });
        window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.TOOL_CALL_END, activeRunId ?? 'resumed', {
          toolName: resolvedName, callId: sdkEvent.data.toolCallId,
          result: sdkEvent.data.result?.content ?? null,
          status: sdkEvent.data.success ? 'success' : 'error', durationMs,
          ...(sourceUpdate?.errorInfo ? { errorInfo: sourceUpdate.errorInfo } : {}),
          ...(sourceUpdate?.signals?.length ? { summary: sourceUpdate.signals.join(' · ') } : {}),
        }));
        if (sourceUpdate) {
          const sourcePayload: Record<string, unknown> = {
            status: sourceUpdate.status, count: sourceUpdate.count ?? 0,
            records: sourceUpdate.records ?? [], signals: sourceUpdate.signals ?? [],
            lastFetched: new Date().toISOString(),
          };
          if (sourceUpdate.errorInfo) sourcePayload.errorInfo = sourceUpdate.errorInfo;
          window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.STATE_DELTA, activeRunId ?? 'resumed', {
            sources: { [sourceUpdate.sourceKey]: sourcePayload },
          }));
        }
      } else {
        emitAgUiEvent(window, sdkEvent, activeRunId ?? 'resumed');
      }
      if (sdkEvent.type === 'tool.execution_start') {
        pendingToolCalls.set(sdkEvent.data.toolCallId, {
          toolName: sdkEvent.data.toolName,
          arguments: sdkEvent.data.arguments as Record<string, unknown> | undefined,
          startedAt: Date.now(),
        });
        const sourceKey = getSourceKeyForTool(sdkEvent.data.toolName, sdkEvent.data.arguments as Record<string, unknown> | undefined);
        if (sourceKey) {
          window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.STATE_DELTA, activeRunId ?? 'resumed', {
            sources: { [sourceKey]: { status: 'loading', count: 0, records: [], signals: [] } },
          }));
        }
      }
    });

    return { ok: true, session: activeSessionMeta };
  });

  // ── copilot:capture-workflow ────────────────────────────────────
  ipcMain.handle('copilot:capture-workflow', async () => {
    if (!activeRecorder) return { error: 'No session to capture' };
    return { log: activeRecorder.getLog() };
  });

  // ── mcp:list-tools ──────────────────────────────────────────────
  ipcMain.handle('mcp:list-tools', async () => {
    return { tools: mcpRegistry.getTools() };
  });

  // ── skill:list ──────────────────────────────────────────────────
  ipcMain.handle('skill:list', async () => {
    return { skills: skillsLoader.getSkills() };
  });

  // ── skill:load ──────────────────────────────────────────────────
  ipcMain.handle('skill:load', async (_event, { skillId }: { skillId: string }) => {
    return skillsLoader.getSkill(skillId);
  });

  // ── skill:save ──────────────────────────────────────────────────
  ipcMain.handle('skill:save', async (_event, { skillId, content }: { skillId: string; content: string }) => {
    await skillsLoader.saveSkill(skillId, content);
  });

  // ── workflow:list ───────────────────────────────────────────────
  ipcMain.handle('workflow:list', async () => {
    const { readdir, readFile } = await import('node:fs/promises');
    const { join } = await import('node:path');
    const workflowDir = join(process.cwd(), '.copilot', 'workflows');
    try {
      const files = await readdir(workflowDir);
      const workflows = await Promise.all(
        files.filter((f) => f.endsWith('.json')).map(async (f) => {
          const raw = await readFile(join(workflowDir, f), 'utf-8');
          const entry = JSON.parse(raw);
          return {
            id: entry.id ?? f.replace('.json', ''),
            name: entry.name ?? f.replace('.json', ''),
            capturedAt: entry.capturedAt ?? '',
            stepsCount: entry.stepsCount ?? (entry.steps?.length ?? 0),
            estimatedDurationMs: entry.estimatedDurationMs ?? 0,
            starred: entry.starred ?? false,
          };
        }),
      );
      return { workflows };
    } catch {
      return { workflows: [] };
    }
  });

  // ── workflow:run ────────────────────────────────────────────────
  ipcMain.handle('workflow:run', async (event, { workflowId, params }: { workflowId: string; params: Record<string, string> }) => {
    const { readFile } = await import('node:fs/promises');
    const { join } = await import('node:path');
    const { WorkflowRunner } = await import('../workflow-runner');

    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return { error: 'No window' };

    const filePath = join(process.cwd(), '.copilot', 'workflows', `${workflowId}.json`);
    const raw = await readFile(filePath, 'utf-8');
    const workflow = JSON.parse(raw);

    const client = getClient(mcpRegistry);
    const runner = new WorkflowRunner(client, mcpRegistry);
    const result = await runner.run(workflow, params, window);
    return { runId: result.output };
  });
  // ── auth:az-refresh ─────────────────────────────────────────
  ipcMain.handle('auth:az-refresh', async () => {
    const { execFile } = await import('node:child_process');
    const { promisify } = await import('node:util');
    const execFileAsync = promisify(execFile);
    try {
      await execFileAsync('az', ['login', '--use-device-code'], { timeout: 120_000 });
      const { stdout } = await execFileAsync('az', ['account', 'show', '--query', 'user.name', '-o', 'tsv']);
      return { ok: true, user: stdout.trim() };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  });
  // ── permission:respond ──────────────────────────────────────────
  ipcMain.handle('permission:respond', async (event, params: { approved: boolean; edits?: Record<string, unknown> }) => {
    if (permissionResolve) {
      permissionResolve(params);
      permissionResolve = null;
    }
    // Also record approval in SessionRecorder
    if (activeRecorder) {
      activeRecorder.recordApproval(params.approved);
    }
    // Tell the renderer to dismiss the approval card
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window && activeRunId) {
      window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.STATE_DELTA, activeRunId, {
        status: 'running',
      }));
    }
  });
}

/**
 * Sets the permission resolver for HITL interrupts.
 * Called by the Copilot session handler when an INTERRUPT is emitted.
 */
export function setPermissionResolver(
  resolve: (response: { approved: boolean; edits?: Record<string, unknown> }) => void,
): void {
  permissionResolve = resolve;
}
