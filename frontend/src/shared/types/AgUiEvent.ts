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
