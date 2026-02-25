// useAgUiTransport — listens for AG-UI events from main process, maintains agent state
import { useState, useEffect, useCallback, useRef } from 'react';
import type { AgUiEvent, AgUiEventType } from '../../shared/types/AgUiEvent';
import type { SalesAgentState } from '../../shared/types/SalesAgentState';
import { createInitialState } from '../../shared/types/SalesAgentState';
import type { ToolCallEntry } from '../components/ToolCallLog';

declare global {
  interface Window {
    electronAPI: import('../../main/preload').ElectronAPI;
  }
}

interface InterruptState {
  message: string;
  toolName: string;
  proposedArgs?: Record<string, unknown>;
  diffPreview?: Array<{ field: string; before: string; after: string }>;
}

/**
 * Core hook: subscribes to AG-UI events via IPC and maintains the SalesAgentState.
 * Returns the full transport handle used by the CopilotKit provider.
 */
export function useAgUiTransport() {
  const [state, setState] = useState<SalesAgentState>(createInitialState());
  const [toolCalls, setToolCalls] = useState<ToolCallEntry[]>([]);
  const [interrupt, setInterrupt] = useState<InterruptState | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!window.electronAPI) return;

    const cleanup = window.electronAPI.copilot.onEvent((event: AgUiEvent) => {
      const d = event.data;
      switch (event.type as AgUiEventType) {
        case 'RUN_STARTED':
          setState((prev) => ({ ...prev, status: 'running', progress: 0 }));
          setToolCalls([]);
          setInterrupt(null);
          setConnected(true);
          break;

        case 'RUN_FINISHED':
          setState((prev) => ({ ...prev, status: 'complete', progress: 100 }));
          break;

        case 'RUN_ERROR':
          setState((prev) => ({
            ...prev,
            status: 'error',
          }));
          break;

        case 'TEXT_MESSAGE_START':
          setState((prev) => ({
            ...prev,
            output: { ...prev.output, status: 'streaming' },
          }));
          break;

        case 'TEXT_MESSAGE_CONTENT':
          setState((prev) => ({
            ...prev,
            output: {
              ...prev.output,
              markdown: prev.output.markdown + (String(d['delta'] ?? '')),
            },
          }));
          break;

        case 'TEXT_MESSAGE_END':
          setState((prev) => ({
            ...prev,
            output: { ...prev.output, status: 'complete' },
          }));
          break;

        case 'TOOL_CALL_START': {
          const entry: ToolCallEntry = {
            id: String(d['toolCallId'] ?? `tc-${Date.now()}`),
            name: String(d['name'] ?? 'unknown'),
            server: String(d['server'] ?? 'msx-crm'),
            status: 'pending',
            timestamp: new Date(),
          };
          setToolCalls((prev) => [...prev, entry]);
          break;
        }

        case 'TOOL_CALL_END': {
          const callId = String(d['toolCallId'] ?? '');
          setToolCalls((prev) =>
            prev.map((tc) =>
              tc.id === callId
                ? { ...tc, status: 'success' as const, result: d['result'] }
                : tc,
            ),
          );
          break;
        }

        case 'STATE_DELTA': {
          setState((prev) => ({ ...prev, ...d as Partial<SalesAgentState> }));
          break;
        }

        case 'STATE_SNAPSHOT': {
          setState(d as unknown as SalesAgentState);
          break;
        }

        case 'INTERRUPT': {
          setInterrupt(d as unknown as InterruptState);
          setState((prev) => ({ ...prev, status: 'paused' }));
          break;
        }

        default:
          break;
      }
    });

    return cleanup;
  }, []);

  return { state, toolCalls, interrupt, connected };
}

/**
 * Convenience hook: just the agent state (used by ResearchCanvas, AgentChat).
 */
export function useAgentState() {
  const { state } = useAgUiTransport();
  return { state };
}

/**
 * Convenience hook: tool call log + interrupt state (used by AgentChat).
 */
export function useAgUiEvents() {
  const { toolCalls, interrupt } = useAgUiTransport();
  return { toolCalls, interrupt };
}
