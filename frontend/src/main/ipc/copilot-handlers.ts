// IPC Handlers — registers all ipcMain handlers (§11, IPC Channel Reference)
import { ipcMain, BrowserWindow } from 'electron';
import type { McpRegistry } from './mcp-registry';
import type { SkillsLoader } from './skills-loader';
import { emitAgUiEvent, resetTranslatorState } from '../ag-ui-translator';
import { AgUiEventType, createAgUiEvent } from '../../shared/types/AgUiEvent';
import type { CliActivityKind } from '../../shared/types/AgUiEvent';
import { CopilotClient, buildToolDefinitions } from '../copilot-client';
import { SessionRecorder } from '../session-recorder';
import type { CopilotSession } from '../../shared/types/CopilotSdk';

// Active run state
let activeRunId: string | null = null;
let activeSession: CopilotSession | null = null;
let activeRecorder: SessionRecorder | null = null;
let copilotClient: CopilotClient | null = null;
let permissionResolve: ((response: { approved: boolean; edits?: Record<string, unknown> }) => void) | null = null;

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
    // Dev mode: use COPILOT_CLI_URL if set, otherwise spawn CLI
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

      // 2. Build tool definitions from MCP registry
      // If skill has specific tools, use those; otherwise register all
      const allTools = mcpRegistry.getTools().map((t) => t.name);
      const toolDefs = buildToolDefinitions(allTools, mcpRegistry);
      emitCliActivity(window, runId, 'tool_registered', `${toolDefs.length} tools registered`, allTools.join(', '));
      emitCliActivity(window, runId, 'context_added', 'System prompt configured');

      // 3. Create SDK session
      const session = await client.createSession({
        model: 'gpt-4.5',
        systemMessage: systemPrompt,
        tools: toolDefs,
        streaming: true,
      });
      activeSession = session;
      emitCliActivity(window, runId, 'session_created', `Session created: ${session.id}`);

      // 4. Attach SessionRecorder for workflow capture
      const workspaceRoot = mcpRegistry['configPath']
        ? mcpRegistry['configPath'].replace('/.vscode/mcp.json', '')
        : process.cwd();
      const recorder = new SessionRecorder(
        session.id,
        params.skill,
        params.context,
        workspaceRoot,
      );
      recorder.attach(session);
      activeRecorder = recorder;

      // 5. Subscribe to SDK events → AG-UI translation → renderer
      session.on((sdkEvent) => {
        emitAgUiEvent(window, {
          type: sdkEvent.type as unknown as import('../../shared/types/SdkEvent.js').SdkEventType,
          data: sdkEvent.data,
        }, runId);

        // Forward tool call events as CLI activity entries
        if (sdkEvent.type === 'tool.request') {
          emitCliActivity(window, runId, 'tool_invoked',
            `Calling: ${String(sdkEvent.data['name'] ?? 'unknown')}`,
            sdkEvent.data['args'] ? JSON.stringify(sdkEvent.data['args']).slice(0, 300) : undefined,
          );
        } else if (sdkEvent.type === 'tool.result') {
          emitCliActivity(window, runId, 'tool_completed',
            `Completed: ${String(sdkEvent.data['name'] ?? 'unknown')}`,
          );
        }

        // Handle HITL: if permission.request, pause for user approval
        if (sdkEvent.type === 'permission.request') {
          window.webContents.send('ag-ui:event', createAgUiEvent(AgUiEventType.INTERRUPT, runId, {
            message: sdkEvent.data['message'] as string,
            toolName: sdkEvent.data['tool'] as string,
            proposedArgs: sdkEvent.data['proposed'] ?? {},
          }));
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
      activeSession.cancel();
      activeSession = null;
      activeRunId = null;
    }
  });

  // ── copilot:capture-workflow ────────────────────────────────────
  // Renderer → Main: Capture the last session as a workflow
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

  // ── permission:respond ──────────────────────────────────────────
  ipcMain.handle('permission:respond', async (_event, params: { approved: boolean; edits?: Record<string, unknown> }) => {
    if (permissionResolve) {
      permissionResolve(params);
      permissionResolve = null;
    }
    // Also record approval in SessionRecorder
    if (activeRecorder) {
      activeRecorder.recordApproval(params.approved);
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
