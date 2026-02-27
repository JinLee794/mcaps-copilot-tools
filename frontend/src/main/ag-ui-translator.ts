// AG-UI Event Translator — SDK events → AG-UI events (§2.3 translation map)
import { BrowserWindow } from 'electron';
import { AgUiEventType, createAgUiEvent } from '../shared/types/AgUiEvent';
import type { SessionEvent } from '@github/copilot-sdk';

let messageCounter = 0;

/**
 * SDK → AG-UI Event Translation Map (from §2.3):
 *   session.start          → RUN_STARTED
 *   session.idle           → RUN_FINISHED
 *   assistant.message       → TEXT_MESSAGE_START + CONTENT + END
 *   assistant.message_delta → TEXT_MESSAGE_CONTENT
 *   tool.execution_start   → TOOL_CALL_START
 *   tool.execution_complete → TOOL_CALL_END
 */
export function translateSdkToAgUi(event: SessionEvent, runId: string): ReturnType<typeof createAgUiEvent> | null {
  switch (event.type) {
    case 'session.start':
      return createAgUiEvent(AgUiEventType.RUN_STARTED, runId, {});

    case 'session.idle':
      return createAgUiEvent(AgUiEventType.RUN_FINISHED, runId, {});

    case 'assistant.turn_start':
      messageCounter++;
      return createAgUiEvent(AgUiEventType.TEXT_MESSAGE_START, runId, {
        messageId: `msg-${messageCounter}`,
        role: 'assistant',
      });

    case 'assistant.message_delta':
      return createAgUiEvent(AgUiEventType.TEXT_MESSAGE_CONTENT, runId, {
        messageId: event.data.messageId,
        content: event.data.deltaContent,
      });

    case 'assistant.turn_end':
      return createAgUiEvent(AgUiEventType.TEXT_MESSAGE_END, runId, {
        messageId: `msg-${messageCounter}`,
      });

    case 'tool.execution_start':
      return createAgUiEvent(AgUiEventType.TOOL_CALL_START, runId, {
        toolName: event.data.toolName,
        args: event.data.arguments ?? {},
        callId: event.data.toolCallId,
      });

    case 'tool.execution_complete':
      // NOTE: This path is bypassed by copilot-handlers.ts which constructs
      // an enriched TOOL_CALL_END with the real toolName + durationMs from
      // the pendingToolCalls map. Kept as a fallback for direct translator use.
      return createAgUiEvent(AgUiEventType.TOOL_CALL_END, runId, {
        toolName: '', // Resolved by copilot-handlers from pendingToolCalls
        callId: event.data.toolCallId,
        result: event.data.result?.content ?? null,
        status: event.data.success ? 'success' : 'error',
        durationMs: 0, // Computed by copilot-handlers from start timestamp
      });

    case 'session.error':
      return createAgUiEvent(AgUiEventType.RUN_ERROR, runId, {
        error: event.data.message,
      });

    default:
      return null;
  }
}

/**
 * Sends a translated AG-UI event to the renderer via Electron IPC.
 */
export function emitAgUiEvent(window: BrowserWindow, sdkEvent: SessionEvent, runId: string): void {
  const agUiEvent = translateSdkToAgUi(sdkEvent, runId);
  if (agUiEvent) {
    window.webContents.send('ag-ui:event', agUiEvent);
  }
}

/**
 * Resets internal counters (call between sessions).
 */
export function resetTranslatorState(): void {
  messageCounter = 0;
}
