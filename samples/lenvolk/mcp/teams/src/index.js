#!/usr/bin/env node
// Teams Cache Reader MCP Server — entry point
// Reads Microsoft Teams local IndexedDB/LevelDB cache and exposes
// conversations, messages, contacts, and meetings via MCP tools.
// Zero API calls — all data comes from local cache files.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools } from './tools.js';

async function main() {
  const server = new McpServer({
    name: 'teams-cache-reader',
    version: '0.1.0'
  });

  registerTools(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);

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
  console.error('Teams Cache MCP server failed to start:', err);
  process.exit(1);
});
