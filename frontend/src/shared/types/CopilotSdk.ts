// Re-exports from @github/copilot-sdk — replaces the old manual type stubs.
// Import directly from '@github/copilot-sdk' in new code; these re-exports
// exist only so existing barrel imports (`types/index.ts`) keep working.

export type {
  SessionEvent as CopilotSdkEvent,
  SessionEventType as CopilotSdkEventType,
  SessionConfig as CreateSessionOptions,
  Tool as CopilotToolDefinition,
} from '@github/copilot-sdk';

export type { CopilotSession } from '@github/copilot-sdk';
export type { CopilotClient as ICopilotClient } from '@github/copilot-sdk';
