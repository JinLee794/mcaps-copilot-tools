// MCP Registry — loads .vscode/mcp.json and provides tool manifests (§11)
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import type { MCPServerConfig, MCPLocalServerConfig } from '@github/copilot-sdk';

export interface McpToolInfo {
  name: string;
  description: string;
  server: string;
  inputSchema?: Record<string, unknown>;
}

interface McpServerConfig {
  type?: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

interface McpConfig {
  servers: Record<string, McpServerConfig>;
}

export class McpRegistry {
  private tools: McpToolInfo[] = [];
  private config: McpConfig = { servers: {} };
  private configPath: string;

  constructor(workspaceRoot?: string) {
    // Resolve workspace root by looking for .vscode/mcp.json
    const root = workspaceRoot ?? this.findWorkspaceRoot();
    this.configPath = join(root, '.vscode', 'mcp.json');
  }

  private findWorkspaceRoot(): string {
    let dir = process.cwd();
    while (dir !== '/') {
      if (existsSync(join(dir, '.vscode', 'mcp.json'))) return dir;
      dir = join(dir, '..');
    }
    return process.cwd();
  }

  /** Strip single-line (//) and block (/* *​/) comments from JSONC text. */
  private stripJsonComments(text: string): string {
    let result = '';
    let i = 0;
    let inString = false;
    let escape = false;

    while (i < text.length) {
      const ch = text[i];
      const next = text[i + 1];

      if (inString) {
        result += ch;
        if (escape) { escape = false; }
        else if (ch === '\\') { escape = true; }
        else if (ch === '"') { inString = false; }
        i++;
        continue;
      }

      if (ch === '"') {
        inString = true;
        result += ch;
        i++;
      } else if (ch === '/' && next === '/') {
        // Skip until end of line
        i += 2;
        while (i < text.length && text[i] !== '\n') i++;
      } else if (ch === '/' && next === '*') {
        // Skip until */
        i += 2;
        while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i++;
        i += 2; // skip closing */
      } else {
        result += ch;
        i++;
      }
    }
    // Strip trailing commas before } or ] (invalid in JSON, valid in JSONC)
    result = result.replace(/,(\s*[}\]])/g, '$1');
    return result;
  }

  async load(): Promise<void> {
    try {
      const raw = await readFile(this.configPath, 'utf-8');
      const clean = this.stripJsonComments(raw);
      this.config = JSON.parse(clean) as McpConfig;
      this.buildToolList();
    } catch (err) {
      console.warn(`[MCP Registry] Could not load ${this.configPath}:`, err);
      this.config = { servers: {} };
      this.tools = [];
    }
  }

  private buildToolList(): void {
    // Build a static tool list from known servers.
    // In the full implementation, this will query each server's tools/list via JSON-RPC.
    this.tools = [];

    for (const [serverName, _serverConfig] of Object.entries(this.config.servers)) {
      if (serverName === 'msx-crm') {
        // Known tools from msx-crm server (§2.2, §5.4)
        const msxTools = [
          { name: 'crm_auth_status', description: 'Check CRM authentication status' },
          { name: 'crm_whoami', description: 'Get current user identity from CRM' },
          { name: 'crm_login', description: 'Device-code login to CRM' },
          { name: 'list_accounts_by_tpid', description: 'List accounts by Top Parent ID' },
          { name: 'list_opportunities', description: 'List opportunities for accounts' },
          { name: 'get_milestones', description: 'Get engagement milestones' },
          { name: 'get_milestone_activities', description: 'Get tasks for milestones' },
          { name: 'crm_get_record', description: 'Get a single CRM record by ID' },
          { name: 'crm_query', description: 'Execute OData query against CRM' },
          { name: 'crm_list_entity_properties', description: 'List entity properties/schema' },
          { name: 'get_task_status_options', description: 'Get valid task status values' },
          { name: 'view_milestone_timeline', description: 'Timeline view of milestones' },
          { name: 'view_opportunity_cost_trend', description: 'Cost trend chart data' },
          { name: 'view_staged_changes_diff', description: 'Diff preview for write ops' },
          { name: 'create_task', description: 'Create a new CRM task (LIVE write)' },
          { name: 'update_task', description: 'Update an existing CRM task (LIVE write)' },
          { name: 'close_task', description: 'Close a CRM task (LIVE write)' },
          { name: 'update_milestone', description: 'Update milestone fields (LIVE write)' },
        ];
        for (const tool of msxTools) {
          this.tools.push({ ...tool, server: serverName });
        }
      } else if (serverName === 'workiq') {
        this.tools.push({
          name: 'ask_work_iq',
          description: 'Query M365 data (Teams, Outlook, SharePoint, Transcripts)',
          server: serverName,
        });
      }
      // Other servers: tools would be discovered via JSON-RPC tools/list
    }
  }

  getTools(): McpToolInfo[] {
    return this.tools;
  }

  getToolsByServer(serverName: string): McpToolInfo[] {
    return this.tools.filter((t) => t.server === serverName);
  }

  getServerConfig(serverName: string): McpServerConfig | undefined {
    return this.config.servers[serverName];
  }

  getServers(): string[] {
    return Object.keys(this.config.servers);
  }

  /** Workspace root derived from the config path. */
  get workspaceRoot(): string {
    return this.configPath.replace(/[\/\\]\.vscode[\/\\]mcp\.json$/, '');
  }

  /**
   * Convert all loaded servers to the SDK's MCPServerConfig format.
   * Used by CopilotClient when creating sessions.
   */
  toSdkMcpServers(): Record<string, MCPServerConfig> {
    const result: Record<string, MCPServerConfig> = {};
    const cwd = this.workspaceRoot;
    for (const [name, cfg] of Object.entries(this.config.servers)) {
      const sdkCfg: MCPLocalServerConfig = {
        type: 'local',
        command: cfg.command,
        args: cfg.args ?? [],
        tools: ['*'],
        cwd,
      };
      if (cfg.env) sdkCfg.env = cfg.env;
      result[name] = sdkCfg;
    }
    return result;
  }
}
