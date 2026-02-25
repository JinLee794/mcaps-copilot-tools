// useAgUiTransport — listens for AG-UI events from main process, maintains agent state.
// Uses React Context so all panels share a single subscription + state.
import React, { useState, useEffect, useContext, createContext } from 'react';
import type { AgUiEvent, AgUiEventType, CliActivityEntry } from '../../shared/types/AgUiEvent';
import type { SalesAgentState } from '../../shared/types/SalesAgentState';
import { createInitialState } from '../../shared/types/SalesAgentState';
import type { ToolCallEntry } from '../components/ToolCallLog';

declare global {
  interface Window {
    electronAPI: import('../../main/preload').ElectronAPI;
  }
}

export interface InterruptState {
  message: string;
  toolName: string;
  proposedArgs?: Record<string, unknown>;
  diffPreview?: Array<{ field: string; before: string; after: string }>;
}

interface AgUiTransportValue {
  state: SalesAgentState;
  toolCalls: ToolCallEntry[];
  interrupt: InterruptState | null;
  connected: boolean;
  /** Accumulated assistant text from TEXT_MESSAGE_CONTENT events (for AgentChat) */
  streamingText: string;
  /** Live CLI activity entries (skills loaded, tools registered, etc.) */
  cliActivity: CliActivityEntry[];
}

const AgUiTransportContext = createContext<AgUiTransportValue | null>(null);

/**
 * Provider: wraps the app to create a single IPC subscription shared by all panels.
 */
export function AgUiTransportProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SalesAgentState>(createInitialState());
  const [toolCalls, setToolCalls] = useState<ToolCallEntry[]>([]);
  const [interrupt, setInterrupt] = useState<InterruptState | null>(null);
  const [connected, setConnected] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [cliActivity, setCliActivity] = useState<CliActivityEntry[]>([]);

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
          setStreamingText('');
          setCliActivity([]);
          break;

        case 'RUN_FINISHED':
          setState((prev) => ({ ...prev, status: 'complete', progress: 100 }));
          break;

        case 'RUN_ERROR':
          setState((prev) => ({ ...prev, status: 'error' }));
          break;

        case 'TEXT_MESSAGE_START':
          setState((prev) => ({
            ...prev,
            output: { ...prev.output, status: 'streaming' },
          }));
          setStreamingText('');
          break;

        case 'TEXT_MESSAGE_CONTENT': {
          const delta = String(d['delta'] ?? '');
          setState((prev) => ({
            ...prev,
            output: {
              ...prev.output,
              markdown: prev.output.markdown + delta,
            },
          }));
          setStreamingText((prev) => prev + delta);
          break;
        }

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

        case 'STATE_DELTA':
          setState((prev) => ({ ...prev, ...d as Partial<SalesAgentState> }));
          break;

        case 'STATE_SNAPSHOT':
          setState(d as unknown as SalesAgentState);
          break;

        case 'INTERRUPT':
          setInterrupt(d as unknown as InterruptState);
          setState((prev) => ({ ...prev, status: 'paused' }));
          break;

        case 'CUSTOM': {
          const entry = d as unknown as CliActivityEntry;
          if (entry.kind && entry.label) {
            setCliActivity((prev) => [...prev, entry]);
          }
          break;
        }

        default:
          break;
      }
    });

    return cleanup;
  }, []);

  const value: AgUiTransportValue = { state, toolCalls, interrupt, connected, streamingText, cliActivity };

  return React.createElement(AgUiTransportContext.Provider, { value }, children);
}

function useTransportContext(): AgUiTransportValue {
  const ctx = useContext(AgUiTransportContext);
  if (!ctx) throw new Error('useAgUiTransport must be used inside <AgUiTransportProvider>');
  return ctx;
}

/** Full transport state — used by App for status bar / header. */
export function useAgUiTransport() {
  return useTransportContext();
}

/** Just the agent state — used by ResearchCanvas. */
export function useAgentState() {
  const { state } = useTransportContext();
  return { state };
}

/** Tool calls, interrupt, streaming text, and CLI activity — used by AgentChat. */
export function useAgUiEvents() {
  const { toolCalls, interrupt, streamingText, cliActivity } = useTransportContext();
  return { toolCalls, interrupt, streamingText, cliActivity };
}
