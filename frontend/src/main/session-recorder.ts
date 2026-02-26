// SessionRecorder — passively records SDK events during Explore runs (§13.3)
//
// Subscribes to all CopilotSession events and builds a structured
// SessionLog. Persists to .copilot/sessions/session-{id}.json on completion.

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type { CopilotSession, SessionEvent } from '@github/copilot-sdk';

// ── Session Log Types ───────────────────────────────────────────────

export interface ToolCallRecord {
  stepId: string;
  tool: string;
  args: Record<string, unknown>;
  result: unknown;
  durationMs: number;
  status: 'success' | 'error' | 'skipped';
  errorMessage?: string;
}

export interface InterruptRecord {
  message: string;
  tool: string;
  proposed: Record<string, unknown>;
  userApproved: boolean;
  timestamp: string;
}

export interface SessionLog {
  sessionId: string;
  skillId: string;
  skillVersion: string;
  capturedAt: string;
  contextParams: Record<string, unknown>;
  toolCallSequence: ToolCallRecord[];
  interruptEvents: InterruptRecord[];
  finalOutput: string;
  totalDurationMs: number;
}

// ── SessionRecorder ─────────────────────────────────────────────────

export class SessionRecorder {
  private log: SessionLog;
  private startTime: number;
  private pendingTools = new Map<string, { tool: string; args: Record<string, unknown>; start: number }>();
  private outputChunks: string[] = [];
  private outputDir: string;

  constructor(
    sessionId: string,
    skillId: string,
    context: Record<string, unknown>,
    workspaceRoot: string,
  ) {
    this.startTime = Date.now();
    this.outputDir = join(workspaceRoot, '.copilot', 'sessions');

    this.log = {
      sessionId,
      skillId,
      skillVersion: '1.0',
      capturedAt: new Date().toISOString(),
      contextParams: context,
      toolCallSequence: [],
      interruptEvents: [],
      finalOutput: '',
      totalDurationMs: 0,
    };
  }

  /**
   * Attach to a CopilotSession — subscribes to events passively.
   */
  attach(session: CopilotSession): void {
    session.on((event: SessionEvent) => {
      this.handleEvent(event);
    });
  }

  private handleEvent(event: SessionEvent): void {
    switch (event.type) {
      case 'tool.execution_start': {
        const callId = event.data.toolCallId;
        this.pendingTools.set(callId, {
          tool: event.data.toolName,
          args: (event.data.arguments as Record<string, unknown>) ?? {},
          start: Date.now(),
        });
        break;
      }

      case 'tool.execution_complete': {
        const callId = event.data.toolCallId;
        const pending = this.pendingTools.get(callId);
        if (pending) {
          const durationMs = Date.now() - pending.start;
          this.log.toolCallSequence.push({
            stepId: callId,
            tool: pending.tool,
            args: pending.args,
            result: event.data.result?.content ?? null,
            durationMs,
            status: event.data.success ? 'success' : 'error',
          });
          this.pendingTools.delete(callId);
        }
        break;
      }

      case 'assistant.message_delta': {
        const content = event.data.deltaContent;
        if (content) this.outputChunks.push(content);
        break;
      }

      case 'session.idle': {
        this.finalise();
        break;
      }
    }
  }

  /**
   * Record a user's approval/rejection response for the last interrupt.
   */
  recordApproval(approved: boolean): void {
    const last = this.log.interruptEvents[this.log.interruptEvents.length - 1];
    if (last) {
      last.userApproved = approved;
    }
  }

  private finalise(): void {
    this.log.finalOutput = this.outputChunks.join('');
    this.log.totalDurationMs = Date.now() - this.startTime;
    this.persist();
  }

  private async persist(): Promise<void> {
    try {
      await mkdir(this.outputDir, { recursive: true });
      const filePath = join(this.outputDir, `session-${this.log.sessionId}.json`);
      await writeFile(filePath, JSON.stringify(this.log, null, 2), 'utf-8');
      console.log(`[SessionRecorder] Saved: ${filePath}`);
    } catch (err) {
      console.error('[SessionRecorder] Failed to persist:', (err as Error).message);
    }
  }

  getLog(): SessionLog {
    return { ...this.log };
  }
}
