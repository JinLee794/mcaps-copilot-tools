#!/usr/bin/env node
// MSX Helper MCP Server — entry point
// Exposes Dynamics 365 CRM operations as MCP tools over stdio transport

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createAuthService } from './auth.js';
import { createCrmClient } from './crm.js';
import { registerTools } from './tools.js';

const DEFAULT_CRM_URL = 'https://microsoftsales.crm.dynamics.com';
const DEFAULT_TENANT_ID = '72f988bf-86f1-41af-91ab-2d7cd011db47';

function getConfig() {
  return {
    crmUrl: process.env.MSX_CRM_URL || DEFAULT_CRM_URL,
    tenantId: process.env.MSX_TENANT_ID || DEFAULT_TENANT_ID
  };
}

async function main() {
  const config = getConfig();

  const authService = createAuthService({
    crmUrl: config.crmUrl,
    tenantId: config.tenantId
  });

  const crmClient = createCrmClient(authService);

  const server = new McpServer({
    name: 'msx-crm',
    version: '1.0.0'
  });

  registerTools(server, crmClient);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });
  process.on('SIGTERM', async () => {
    await server.close();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error('MCP server failed to start:', err);
  process.exit(1);
});
