// AG-UI Event Types — maps 1:1 to AG-UI protocol (§2.3, §8)

export enum AgUiEventType {
  RUN_STARTED = 'RUN_STARTED',
  RUN_FINISHED = 'RUN_FINISHED',
  RUN_ERROR = 'RUN_ERROR',
  TEXT_MESSAGE_START = 'TEXT_MESSAGE_START',
  TEXT_MESSAGE_CONTENT = 'TEXT_MESSAGE_CONTENT',
  TEXT_MESSAGE_END = 'TEXT_MESSAGE_END',
  TOOL_CALL_START = 'TOOL_CALL_START',
  TOOL_CALL_END = 'TOOL_CALL_END',
  STATE_DELTA = 'STATE_DELTA',
  STATE_SNAPSHOT = 'STATE_SNAPSHOT',
  INTERRUPT = 'INTERRUPT',
  STEP_STARTED = 'STEP_STARTED',
  STEP_FINISHED = 'STEP_FINISHED',
  CUSTOM = 'CUSTOM',
}

export interface AgUiEvent {
  type: AgUiEventType;
  timestamp: number;
  runId: string;
  data: Record<string, unknown>;
}

export interface ToolCallStartEvent extends AgUiEvent {
  type: AgUiEventType.TOOL_CALL_START;
  data: {
    toolName: string;
    args: Record<string, unknown>;
    callId: string;
  };
}

export interface ToolCallEndEvent extends AgUiEvent {
  type: AgUiEventType.TOOL_CALL_END;
  data: {
    toolName: string;
    callId: string;
    result: unknown;
    status: 'success' | 'error';
    durationMs: number;
  };
}

export interface TextMessageEvent extends AgUiEvent {
  type:
    | AgUiEventType.TEXT_MESSAGE_START
    | AgUiEventType.TEXT_MESSAGE_CONTENT
    | AgUiEventType.TEXT_MESSAGE_END;
  data: {
    messageId: string;
    content?: string; // present on CONTENT events
    role?: 'assistant' | 'user';
  };
}

export interface InterruptEvent extends AgUiEvent {
  type: AgUiEventType.INTERRUPT;
  data: {
    message: string;
    toolName: string;
    proposedArgs: Record<string, unknown>;
    diffPreview?: unknown;
  };
}

export interface StateDeltaEvent extends AgUiEvent {
  type: AgUiEventType.STATE_DELTA;
  data: Record<string, unknown>;
}

export interface StateSnapshotEvent extends AgUiEvent {
  type: AgUiEventType.STATE_SNAPSHOT;
  data: Record<string, unknown>;
}

export function createAgUiEvent(
  type: AgUiEventType,
  runId: string,
  data: Record<string, unknown>,
): AgUiEvent {
  return { type, timestamp: Date.now(), runId, data };
}

// ── CLI Activity Types ─────────────────────────────────────────

export type CliActivityKind =
  | 'skill_loaded'      // A SKILLS.md was parsed and loaded
  | 'instruction_loaded' // An instruction file was added to context
  | 'context_added'      // Generic context (system prompt, params) added
  | 'tool_registered'    // MCP tool registered with the agent
  | 'session_created'    // CLI session created
  | 'prompt_sent'        // User prompt sent to the agent
  | 'tool_invoked'       // Agent is calling a tool (live)
  | 'tool_completed'     // Tool call finished (live)
  | 'cli_log';           // Raw CLI log line

export interface CliActivityEntry {
  id: string;
  kind: CliActivityKind;
  label: string;
  detail?: string;
  timestamp: number;
}
