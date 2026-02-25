// Preload script — contextBridge exposing IPC channels to renderer (§11, IPC Channel Reference)
import { contextBridge, ipcRenderer } from 'electron';
import type { AgUiEvent } from '../shared/types/AgUiEvent';

export interface ElectronAPI {
  copilot: {
    run: (params: { skill: string; prompt: string; context: Record<string, unknown> }) => Promise<string>;
    cancel: (runId: string) => Promise<void>;
    captureWorkflow: () => Promise<unknown>;
    onEvent: (callback: (event: AgUiEvent) => void) => () => void;
  };
  mcp: {
    listTools: () => Promise<{ tools: Array<{ name: string; description: string; server: string }> }>;
    onToolResult: (callback: (data: { toolName: string; result: unknown; status: string }) => void) => () => void;
  };
  skills: {
    list: () => Promise<{ skills: Array<{ id: string; name: string; description: string }> }>;
    load: (skillId: string) => Promise<unknown>;
    save: (skillId: string, content: string) => Promise<void>;
  };
  workflows: {
    list: () => Promise<{ workflows: Array<{ id: string; name: string; capturedAt: string; stepsCount: number; estimatedDurationMs: number; starred: boolean }> }>;
    run: (workflowId: string, params: Record<string, string>) => Promise<string>;
  };
  permission: {
    respond: (params: { approved: boolean; edits?: Record<string, unknown> }) => Promise<void>;
  };
}

contextBridge.exposeInMainWorld('electronAPI', {
  copilot: {
    run: (params: { skill: string; prompt: string; context: Record<string, unknown> }) =>
      ipcRenderer.invoke('copilot:run', params),
    cancel: (runId: string) =>
      ipcRenderer.invoke('copilot:cancel', { runId }),
    captureWorkflow: () =>
      ipcRenderer.invoke('copilot:capture-workflow'),
    onEvent: (callback: (event: AgUiEvent) => void) => {
      const handler = (_: unknown, event: AgUiEvent) => callback(event);
      ipcRenderer.on('ag-ui:event', handler);
      return () => ipcRenderer.removeListener('ag-ui:event', handler);
    },
  },
  mcp: {
    listTools: () => ipcRenderer.invoke('mcp:list-tools'),
    onToolResult: (callback: (data: { toolName: string; result: unknown; status: string }) => void) => {
      const handler = (_: unknown, data: { toolName: string; result: unknown; status: string }) => callback(data);
      ipcRenderer.on('mcp:tool-result', handler);
      return () => ipcRenderer.removeListener('mcp:tool-result', handler);
    },
  },
  skills: {
    list: () => ipcRenderer.invoke('skill:list'),
    load: (skillId: string) => ipcRenderer.invoke('skill:load', { skillId }),
    save: (skillId: string, content: string) => ipcRenderer.invoke('skill:save', { skillId, content }),
  },
  workflows: {
    list: () => ipcRenderer.invoke('workflow:list'),
    run: (workflowId: string, params: Record<string, string>) =>
      ipcRenderer.invoke('workflow:run', { workflowId, params }),
  },
  permission: {
    respond: (params: { approved: boolean; edits?: Record<string, unknown> }) =>
      ipcRenderer.invoke('permission:respond', params),
  },
} satisfies ElectronAPI);
