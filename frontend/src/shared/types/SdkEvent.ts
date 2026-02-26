// Re-export SDK event types — keeps old barrel imports working.
// New code should import directly from '@github/copilot-sdk'.

export type { SessionEvent as SdkEvent, SessionEventType as SdkEventType } from '@github/copilot-sdk';
