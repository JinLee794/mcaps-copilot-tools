// SDK Event types — mirrors @github/copilot-sdk event surface (§2.3)

export enum SdkEventType {
  SESSION_START = 'session.start',
  SESSION_IDLE = 'session.idle',
  ASSISTANT_MESSAGE_START = 'assistant.message_start',
  ASSISTANT_MESSAGE_DELTA = 'assistant.message_delta',
  ASSISTANT_MESSAGE_END = 'assistant.message_end',
  TOOL_REQUEST = 'tool.request',
  TOOL_RESULT = 'tool.result',
  PERMISSION_REQUEST = 'permission.request',
  STATE_UPDATE = 'state.update',
}

export interface SdkEvent {
  type: SdkEventType;
  data: Record<string, unknown>;
}
