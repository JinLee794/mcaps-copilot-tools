// Type definitions for @github/copilot-sdk (Technical Preview)
// These mirror the SDK's public API surface. When the SDK ships to npm,
// replace these with `import { ... } from '@github/copilot-sdk'`.

import type { ZodType } from 'zod';

/** SDK event types emitted during a session. */
export type CopilotSdkEventType =
  | 'session.start'
  | 'session.idle'
  | 'assistant.message_start'
  | 'assistant.message_delta'
  | 'assistant.message_end'
  | 'tool.request'
  | 'tool.result'
  | 'permission.request'
  | 'state.update';

/** Raw event structure emitted by the SDK session. */
export interface CopilotSdkEvent {
  type: CopilotSdkEventType;
  data: Record<string, unknown>;
}

/** Tool definition for SDK's defineTool(). */
export interface CopilotToolDefinition {
  name: string;
  description: string;
  parameters: ZodType;
  handler: (args: Record<string, unknown>) => Promise<unknown>;
}

/** Options for session creation. */
export interface CreateSessionOptions {
  model: string;
  systemMessage: string;
  tools: CopilotToolDefinition[];
  streaming?: boolean;
}

/** A running SDK session. */
export interface CopilotSession {
  id: string;
  on: (callback: (event: CopilotSdkEvent) => void) => void;
  off: (callback: (event: CopilotSdkEvent) => void) => void;
  send: (params: { prompt: string }) => Promise<void>;
  cancel: () => void;
}

/** The top-level SDK client. */
export interface ICopilotClient {
  createSession: (options: CreateSessionOptions) => Promise<CopilotSession>;
  destroy: () => void;
}
