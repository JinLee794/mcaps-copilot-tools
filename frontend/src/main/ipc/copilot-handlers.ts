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

// Active run state
let activeRunId: string | null = null;
let activeSession: CopilotSession | null = null;
let activeRecorder: SessionRecorder | null = null;
let copilotClient: CopilotClient | null = null;
let permissionResolve: ((response: { approved: boolean; edits?: Record<string, unknown> }) => void) | null = null;

// Map toolCallId → { toolName, arguments } so we can display real info in permission requests
const pendingToolCalls = new Map<string, { toolName: string; arguments?: Record<string, unknown> }>();

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
  // Renderer → Main: Start a skill run
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
            window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.INTERRUPT, runId, {
              message,
              toolName,
              proposedArgs,
            }));

            permissionResolve = (resp) => {
              // Clean up the tracked call
              if (request.toolCallId) pendingToolCalls.delete(request.toolCallId);
              resolve({
                kind: resp.approved ? 'approved' : 'denied-interactively-by-user',
              });
            };
          });
        },
      });
      activeSession = session;
      emitCliActivity(window, runId, 'session_created', `Session created: ${session.sessionId}`);

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
        emitAgUiEvent(window, sdkEvent, runId);

        // Forward tool call events as CLI activity entries
        if (sdkEvent.type === 'tool.execution_start') {
          // Track for permission request lookups
          pendingToolCalls.set(sdkEvent.data.toolCallId, {
            toolName: sdkEvent.data.toolName,
            arguments: sdkEvent.data.arguments as Record<string, unknown> | undefined,
          });
          emitCliActivity(window, runId, 'tool_invoked',
            `Calling: ${sdkEvent.data.toolName}`,
            sdkEvent.data.arguments ? JSON.stringify(sdkEvent.data.arguments).slice(0, 300) : undefined,
          );
        } else if (sdkEvent.type === 'tool.execution_complete') {
          pendingToolCalls.delete(sdkEvent.data.toolCallId);
          emitCliActivity(window, runId, 'tool_completed',
            `Completed: ${sdkEvent.data.toolCallId}`,
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
      activeRunId = null;
    }
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
