// CopilotClient — thin wrapper around @github/copilot-sdk
//
// Architecture: The SDK spawns and manages the Copilot CLI process,
// communicating over JSON-RPC (stdio by default). MCP servers are
// configured directly in SessionConfig.mcpServers. This module only
// adds lifecycle management and re-exports for the rest of the app.

import {
  CopilotClient as SdkClient,
  CopilotSession as SdkSession,
  approveAll,
} from '@github/copilot-sdk';
import type {
  CopilotClientOptions,
  SessionConfig,
  SessionEvent,
  SessionEventType,
  PermissionHandler,
} from '@github/copilot-sdk';
import type { McpRegistry } from './ipc/mcp-registry';

export type { SdkSession as CopilotSession };
export type { SessionConfig, SessionEvent, SessionEventType, PermissionHandler };

// ────────────────────────────────────────────────────────────────────────
// CopilotClient — SDK wrapper with MCP registry integration
// ────────────────────────────────────────────────────────────────────────

export interface CopilotClientInit {
  /** Connect to an existing CLI server instead of spawning one. */
  cliUrl?: string;
  /** Override path to the Copilot CLI binary. */
  cliPath?: string;
}

export class CopilotClient {
  private sdk: SdkClient;
  private mcpRegistry: McpRegistry;
  private destroyed = false;

  constructor(mcpRegistry: McpRegistry, opts?: CopilotClientInit) {
    this.mcpRegistry = mcpRegistry;

    const sdkOpts: CopilotClientOptions = {
      useStdio: !opts?.cliUrl,
      autoStart: true,
      autoRestart: true,
      logLevel: 'warning',
    };

    if (opts?.cliUrl) sdkOpts.cliUrl = opts.cliUrl;
    if (opts?.cliPath) sdkOpts.cliPath = opts.cliPath;
    if (process.env['COPILOT_CLI_PATH']) sdkOpts.cliPath = process.env['COPILOT_CLI_PATH'];

    this.sdk = new SdkClient(sdkOpts);
  }

  /**
   * Create a session with MCP servers from the registry automatically wired in.
   */
  async createSession(config: Partial<SessionConfig> = {}): Promise<SdkSession> {
    const mcpServers = this.mcpRegistry.toSdkMcpServers();

    return this.sdk.createSession({
      ...config,
      mcpServers: { ...mcpServers, ...config.mcpServers },
      onPermissionRequest: config.onPermissionRequest ?? approveAll,
      streaming: config.streaming ?? true,
    });
  }

  /** Expose the underlying SDK client for advanced use (resume, ping, etc.). */
  get raw(): SdkClient {
    return this.sdk;
  }

  async destroy(): Promise<void> {
    if (this.destroyed) return;
    this.destroyed = true;
    await this.sdk.stop();
  }
}
