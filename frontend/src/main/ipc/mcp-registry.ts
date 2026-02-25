// MCP Registry — loads .vscode/mcp.json and provides tool manifests (§11)
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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

  async load(): Promise<void> {
    try {
      const raw = await readFile(this.configPath, 'utf-8');
      this.config = JSON.parse(raw) as McpConfig;
      this.buildToolList();
    } catch {
      console.warn(`[MCP Registry] Could not load ${this.configPath}`);
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
}
