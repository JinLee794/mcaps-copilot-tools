// AG-UI Event Translator — SDK events → AG-UI events (§2.3 translation map)
import { BrowserWindow } from 'electron';
import { AgUiEventType, createAgUiEvent } from '../shared/types/AgUiEvent';
import type { SdkEvent } from '../shared/types/SdkEvent';
import { SdkEventType } from '../shared/types/SdkEvent';

let messageCounter = 0;

/**
 * SDK → AG-UI Event Translation Map (from §2.3):
 *   session.start          → RUN_STARTED
 *   session.idle           → RUN_FINISHED
 *   assistant.message_start → TEXT_MESSAGE_START
 *   assistant.message_delta → TEXT_MESSAGE_CONTENT
 *   assistant.message_end   → TEXT_MESSAGE_END
 *   tool.request           → TOOL_CALL_START
 *   tool.result            → TOOL_CALL_END
 *   permission.request     → INTERRUPT
 *   state.update           → STATE_DELTA
 */
export function translateSdkToAgUi(sdkEvent: SdkEvent, runId: string): ReturnType<typeof createAgUiEvent> | null {
  switch (sdkEvent.type) {
    case SdkEventType.SESSION_START:
      return createAgUiEvent(AgUiEventType.RUN_STARTED, runId, {});

    case SdkEventType.SESSION_IDLE:
      return createAgUiEvent(AgUiEventType.RUN_FINISHED, runId, {});

    case SdkEventType.ASSISTANT_MESSAGE_START:
      messageCounter++;
      return createAgUiEvent(AgUiEventType.TEXT_MESSAGE_START, runId, {
        messageId: `msg-${messageCounter}`,
        role: 'assistant',
      });

    case SdkEventType.ASSISTANT_MESSAGE_DELTA:
      return createAgUiEvent(AgUiEventType.TEXT_MESSAGE_CONTENT, runId, {
        messageId: `msg-${messageCounter}`,
        content: sdkEvent.data.content ?? '',
      });

    case SdkEventType.ASSISTANT_MESSAGE_END:
      return createAgUiEvent(AgUiEventType.TEXT_MESSAGE_END, runId, {
        messageId: `msg-${messageCounter}`,
      });

    case SdkEventType.TOOL_REQUEST:
      return createAgUiEvent(AgUiEventType.TOOL_CALL_START, runId, {
        toolName: sdkEvent.data.name as string,
        args: sdkEvent.data.args as Record<string, unknown>,
        callId: sdkEvent.data.callId as string ?? `call-${Date.now()}`,
      });

    case SdkEventType.TOOL_RESULT:
      return createAgUiEvent(AgUiEventType.TOOL_CALL_END, runId, {
        toolName: sdkEvent.data.name as string,
        callId: sdkEvent.data.callId as string ?? '',
        result: sdkEvent.data.result,
        status: sdkEvent.data.error ? 'error' : 'success',
        durationMs: sdkEvent.data.durationMs as number ?? 0,
      });

    case SdkEventType.PERMISSION_REQUEST:
      return createAgUiEvent(AgUiEventType.INTERRUPT, runId, {
        message: sdkEvent.data.message as string,
        toolName: sdkEvent.data.tool as string,
        proposedArgs: sdkEvent.data.proposed as Record<string, unknown> ?? {},
      });

    case SdkEventType.STATE_UPDATE:
      return createAgUiEvent(AgUiEventType.STATE_DELTA, runId, sdkEvent.data);

    default:
      return null;
  }
}

/**
 * Sends a translated AG-UI event to the renderer via Electron IPC.
 */
export function emitAgUiEvent(window: BrowserWindow, sdkEvent: SdkEvent, runId: string): void {
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
