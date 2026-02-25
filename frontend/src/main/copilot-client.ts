// CopilotClient — singleton managing Copilot CLI sessions (§2.3)
//
// Architecture: The Copilot CLI runs in "server mode" as a child process,
// exposing a JSON-RPC interface. The CopilotClient spawns this process,
// manages sessions per skill run, registers MCP tools, and forwards
// SDK events through the AG-UI translator to the renderer.
//
// When @github/copilot-sdk ships to npm, the ChildProcess-based transport
// here can be replaced with the SDK's built-in `CopilotClient` class.

import { spawn, type ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import type {
  ICopilotClient,
  CopilotSession,
  CopilotSdkEvent,
  CopilotToolDefinition,
  CreateSessionOptions,
} from '../shared/types/CopilotSdk';
import type { McpRegistry } from './ipc/mcp-registry';

// ────────────────────────────────────────────────────────────────────────
// JSON-RPC Types
// ────────────────────────────────────────────────────────────────────────

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params: Record<string, unknown>;
}

interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: number;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

interface JsonRpcNotification {
  jsonrpc: '2.0';
  method: string;
  params: Record<string, unknown>;
}

// ────────────────────────────────────────────────────────────────────────
// CopilotClient
// ────────────────────────────────────────────────────────────────────────

export class CopilotClient implements ICopilotClient {
  private cliProcess: ChildProcess | null = null;
  private cliUrl: string | null = null;
  private nextRequestId = 1;
  private pendingRequests = new Map<number, {
    resolve: (value: unknown) => void;
    reject: (err: Error) => void;
  }>();
  private sessionListeners = new Map<string, Array<(event: CopilotSdkEvent) => void>>();
  private buffer = '';
  private ready = false;
  private readyPromise: Promise<void>;
  private readyResolve!: () => void;
  private mcpRegistry: McpRegistry;

  constructor(mcpRegistry: McpRegistry, options?: { cliUrl?: string }) {
    this.mcpRegistry = mcpRegistry;
    this.readyPromise = new Promise((resolve) => {
      this.readyResolve = resolve;
    });

    if (options?.cliUrl) {
      // Dev mode: connect to an already-running CLI
      this.cliUrl = options.cliUrl;
      this.ready = true;
      this.readyResolve();
    } else {
      this.spawnCli();
    }
  }

  // ── CLI Process Management ────────────────────────────────────────

  private spawnCli(): void {
    // Spawn Copilot CLI in server mode
    // The CLI communicates via stdin/stdout JSON-RPC
    this.cliProcess = spawn('copilot', ['--server'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env },
    });

    this.cliProcess.stdout?.on('data', (chunk: Buffer) => {
      this.handleStdout(chunk.toString('utf-8'));
    });

    this.cliProcess.stderr?.on('data', (chunk: Buffer) => {
      console.error('[Copilot CLI stderr]', chunk.toString('utf-8'));
    });

    this.cliProcess.on('error', (err) => {
      console.error('[Copilot CLI] Failed to spawn:', err.message);
    });

    this.cliProcess.on('exit', (code) => {
      console.log('[Copilot CLI] Exited with code:', code);
      this.cliProcess = null;
      this.ready = false;
    });

    // Mark ready once the CLI emits its init notification
    // Fallback: mark ready after a short timeout to handle CLIs that
    // don't emit an explicit ready signal
    const readyTimeout = setTimeout(() => {
      if (!this.ready) {
        this.ready = true;
        this.readyResolve();
      }
    }, 3000);

    // If we detect an init message, clear the timeout
    const origHandler = this.handleNotification.bind(this);
    this.handleNotification = (notification: JsonRpcNotification) => {
      if (notification.method === 'initialized' || notification.method === 'ready') {
        this.ready = true;
        this.readyResolve();
        clearTimeout(readyTimeout);
      }
      origHandler(notification);
    };
  }

  private handleStdout(chunk: string): void {
    this.buffer += chunk;

    // Process line-delimited JSON-RPC messages
    let newlineIdx: number;
    while ((newlineIdx = this.buffer.indexOf('\n')) !== -1) {
      const line = this.buffer.slice(0, newlineIdx).trim();
      this.buffer = this.buffer.slice(newlineIdx + 1);
      if (!line) continue;

      try {
        const msg = JSON.parse(line) as JsonRpcResponse | JsonRpcNotification;
        if ('id' in msg && msg.id != null) {
          this.handleResponse(msg as JsonRpcResponse);
        } else {
          this.handleNotification(msg as JsonRpcNotification);
        }
      } catch {
        // Not JSON — may be CLI log output, ignore
      }
    }
  }

  private handleResponse(response: JsonRpcResponse): void {
    const pending = this.pendingRequests.get(response.id);
    if (!pending) return;
    this.pendingRequests.delete(response.id);

    if (response.error) {
      pending.reject(new Error(`CLI error ${response.error.code}: ${response.error.message}`));
    } else {
      pending.resolve(response.result);
    }
  }

  private handleNotification(notification: JsonRpcNotification): void {
    // Route session events to registered listeners
    const sessionId = notification.params['sessionId'] as string | undefined;
    if (sessionId && this.sessionListeners.has(sessionId)) {
      const sdkEvent = this.notificationToSdkEvent(notification);
      if (sdkEvent) {
        for (const listener of this.sessionListeners.get(sessionId)!) {
          listener(sdkEvent);
        }
      }
    }
  }

  private notificationToSdkEvent(notification: JsonRpcNotification): CopilotSdkEvent | null {
    // Map CLI notification methods to SDK event types
    const methodMap: Record<string, CopilotSdkEvent['type']> = {
      'session/started': 'session.start',
      'session/idle': 'session.idle',
      'assistant/messageStart': 'assistant.message_start',
      'assistant/messageDelta': 'assistant.message_delta',
      'assistant/messageEnd': 'assistant.message_end',
      'tool/request': 'tool.request',
      'tool/result': 'tool.result',
      'permission/request': 'permission.request',
      'state/update': 'state.update',
    };

    const eventType = methodMap[notification.method];
    if (!eventType) return null;

    return {
      type: eventType,
      data: notification.params,
    };
  }

  private async sendRequest(method: string, params: Record<string, unknown>): Promise<unknown> {
    await this.readyPromise;

    const id = this.nextRequestId++;
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      id,
      method,
      params,
    };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });

      const data = JSON.stringify(request) + '\n';
      if (this.cliProcess?.stdin?.writable) {
        this.cliProcess.stdin.write(data);
      } else {
        this.pendingRequests.delete(id);
        reject(new Error('CLI process stdin not writable'));
      }
    });
  }

  // ── Session Management ────────────────────────────────────────────

  async createSession(options: CreateSessionOptions): Promise<CopilotSession> {
    // Build tool definitions for the CLI
    const toolDefs = options.tools.map((t) => ({
      name: t.name,
      description: t.description,
    }));

    const result = await this.sendRequest('session/create', {
      model: options.model,
      systemMessage: options.systemMessage,
      tools: toolDefs,
      streaming: options.streaming ?? true,
    }) as { sessionId: string };

    const sessionId = result.sessionId;

    // Store tool handlers for routing tool.request calls
    const toolHandlers = new Map<string, CopilotToolDefinition['handler']>();
    for (const tool of options.tools) {
      toolHandlers.set(tool.name, tool.handler);
    }

    const listeners: Array<(event: CopilotSdkEvent) => void> = [];
    this.sessionListeners.set(sessionId, listeners);

    // Auto-handle tool calls: when CLI requests a tool, invoke the handler
    // and send the result back
    const toolCallHandler = async (event: CopilotSdkEvent) => {
      if (event.type === 'tool.request') {
        const toolName = event.data['name'] as string;
        const args = event.data['args'] as Record<string, unknown>;
        const callId = event.data['callId'] as string;
        const handler = toolHandlers.get(toolName);

        if (handler) {
          const startTime = Date.now();
          try {
            const toolResult = await handler(args);
            await this.sendRequest('tool/result', {
              sessionId,
              callId,
              name: toolName,
              result: toolResult,
              durationMs: Date.now() - startTime,
            });
          } catch (err) {
            await this.sendRequest('tool/result', {
              sessionId,
              callId,
              name: toolName,
              error: (err as Error).message,
              durationMs: Date.now() - startTime,
            });
          }
        }
      }
    };
    listeners.push(toolCallHandler);

    const session: CopilotSession = {
      id: sessionId,
      on: (callback) => {
        listeners.push(callback);
      },
      off: (callback) => {
        const idx = listeners.indexOf(callback);
        if (idx >= 0) listeners.splice(idx, 1);
      },
      send: async (params) => {
        await this.sendRequest('session/send', {
          sessionId,
          prompt: params.prompt,
        });
      },
      cancel: () => {
        this.sendRequest('session/cancel', { sessionId }).catch(() => {
          // Best-effort cancel
        });
        this.sessionListeners.delete(sessionId);
      },
    };

    return session;
  }

  // ── Cleanup ───────────────────────────────────────────────────────

  destroy(): void {
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

// ────────────────────────────────────────────────────────────────────────
// MCP Tool Registration Helper
// ────────────────────────────────────────────────────────────────────────

/**
 * Builds CopilotToolDefinition[] from a skill's mcpTools list using the
 * McpRegistry. Each tool handler spawns the appropriate STDIO MCP server
 * and performs a JSON-RPC `tools/call` invocation.
 */
export function buildToolDefinitions(
  toolNames: string[],
  mcpRegistry: McpRegistry,
): CopilotToolDefinition[] {
  const { z } = require('zod') as typeof import('zod');

  return toolNames.map((name) => {
    const toolInfo = mcpRegistry.getTools().find((t) => t.name === name);
    return {
      name,
      description: toolInfo?.description ?? name,
      parameters: z.object({}).passthrough(), // Accept any args — MCP server validates
      handler: async (args: Record<string, unknown>) => {
        return invokeMcpToolDirect(name, args, mcpRegistry);
      },
    };
  });
}

/**
 * Invokes an MCP tool by spawning the server's STDIO process and sending
 * a JSON-RPC `tools/call` request. Returns the tool result.
 * Exported as `invokeMcpToolDirect` for the WorkflowRunner's direct calls.
 */
export async function invokeMcpToolDirect(
  toolName: string,
  args: Record<string, unknown>,
  mcpRegistry: McpRegistry,
): Promise<unknown> {
  const toolInfo = mcpRegistry.getTools().find((t) => t.name === toolName);
  if (!toolInfo) throw new Error(`Unknown MCP tool: ${toolName}`);

  const serverConfig = mcpRegistry.getServerConfig(toolInfo.server);
  if (!serverConfig) throw new Error(`No server config for: ${toolInfo.server}`);

  return new Promise((resolve, reject) => {
    const proc = spawn(serverConfig.command, serverConfig.args ?? [], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, ...serverConfig.env },
    });

    let stdout = '';
    proc.stdout?.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf-8');
    });
    proc.stderr?.on('data', (chunk: Buffer) => {
      console.error(`[MCP ${toolInfo.server}]`, chunk.toString('utf-8'));
    });

    // Send initialize → tools/call → shutdown sequence
    const initRequest: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'copilot-sales', version: '0.1.0' },
      },
    };
    const callRequest: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: { name: toolName, arguments: args },
    };

    proc.stdin?.write(JSON.stringify(initRequest) + '\n');
    proc.stdin?.write(JSON.stringify(callRequest) + '\n');

    proc.on('close', () => {
      try {
        // Find the tools/call response (id: 2)
        const lines = stdout.split('\n').filter(Boolean);
        for (const line of lines) {
          const msg = JSON.parse(line) as JsonRpcResponse;
          if (msg.id === 2) {
            if (msg.error) {
              reject(new Error(msg.error.message));
            } else {
              resolve(msg.result);
            }
            return;
          }
        }
        reject(new Error('No response from MCP server'));
      } catch (err) {
        reject(new Error(`Failed to parse MCP response: ${(err as Error).message}`));
      }
    });

    proc.on('error', (err) => {
      reject(new Error(`MCP server spawn error: ${err.message}`));
    });

    // Timeout: kill after 30s
    setTimeout(() => {
      proc.kill();
      reject(new Error(`MCP tool call timed out: ${toolName}`));
    }, 30_000);
  });
}
