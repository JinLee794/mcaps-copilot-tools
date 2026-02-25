// useToolRegistry — loads MCP tool metadata from main process
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    electronAPI: import('../../main/preload').ElectronAPI;
  }
}

interface McpTool {
  name: string;
  description: string;
  server: string;
  inputSchema?: Record<string, unknown>;
}

interface McpServer {
  name: string;
  status: 'connected' | 'disconnected';
  toolCount: number;
}

export function useToolRegistry() {
  const [tools, setTools] = useState<McpTool[]>([]);
  const [servers, setServers] = useState<McpServer[]>([]);

  useEffect(() => {
    async function load() {
      if (!window.electronAPI) return;
      try {
        const result = await window.electronAPI.mcp.listTools();
        const loadedTools = ((result as { tools: McpTool[] }).tools ?? []) as McpTool[];
        setTools(loadedTools);

        // Derive server list from tools
        const serverMap = new Map<string, number>();
        for (const t of loadedTools) {
          serverMap.set(t.server, (serverMap.get(t.server) ?? 0) + 1);
        }
        const serverList: McpServer[] = Array.from(serverMap.entries()).map(
          ([name, toolCount]) => ({
            name,
            status: 'connected' as const,
            toolCount,
          }),
        );
        setServers(serverList);
      } catch (err) {
        console.error('Failed to load MCP tools:', err);
      }
    }
    load();
  }, []);

  return { tools, servers };
}
