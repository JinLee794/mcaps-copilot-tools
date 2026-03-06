#!/usr/bin/env node
// Outlook Local MCP Server — entry point
// Wraps Outlook COM scripts (email search, draft composition) as MCP tools over stdio transport

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools } from './tools.js';

async function main() {
  const server = new McpServer({
    name: 'outlook-local',
    version: '0.1.0'
  });

  registerTools(server);

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
  console.error('Outlook MCP server failed to start:', err);
  process.exit(1);
});
