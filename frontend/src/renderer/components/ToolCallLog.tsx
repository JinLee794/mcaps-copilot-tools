// ToolCallLog — collapsible log of tool invocations in the chat pane
import React, { useState, useMemo } from 'react';
import { Wrench, Loader2, CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';
import { ToolResultView } from './ToolResultView';

export interface ToolCallEntry {
  id: string;
  name: string;
  server: string;
  status: 'pending' | 'success' | 'error';
  args?: Record<string, unknown>;
  result?: unknown;
  durationMs?: number;
  timestamp: Date;
  /** Structured error info from parseToolError */
  errorInfo?: { code: string; message: string; action?: string };
  /** One-line summary extracted from result (e.g. "2 Active · 1 At Risk") */
  summary?: string;
}

interface ToolCallLogProps {
  calls: ToolCallEntry[];
  onRetry?: (callId: string) => void;
}

// ── Aggregate Stats ─────────────────────────────────────────────────

function useRunStats(calls: ToolCallEntry[]) {
  return useMemo(() => {
    const total = calls.length;
    const completed = calls.filter((c) => c.status === 'success').length;
    const errors = calls.filter((c) => c.status === 'error').length;
    const pending = calls.filter((c) => c.status === 'pending').length;
    const totalDurationMs = calls.reduce((sum, c) => sum + (c.durationMs ?? 0), 0);
    return { total, completed, errors, pending, totalDurationMs };
  }, [calls]);
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

// ── Error Detail ────────────────────────────────────────────────────

function ErrorDetail({ entry, onRetry }: { entry: ToolCallEntry; onRetry?: (id: string) => void }) {
  const info = entry.errorInfo;
  if (!info) {
    return <span className="tool-error-message">Error occurred</span>;
  }
  return (
    <div className="tool-error-detail">
      <AlertTriangle size={14} className="tool-error-icon" />
      <span className="tool-error-code">{info.code}</span>
      <span className="tool-error-message">{info.message}</span>
      {info.action && onRetry && (
        <button className="tool-error-action" onClick={() => onRetry(entry.id)}>
          <RefreshCw size={12} /> {info.action}
        </button>
      )}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────

export function ToolCallLog({ calls, onRetry }: ToolCallLogProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const stats = useRunStats(calls);

  if (calls.length === 0) return null;

  return (
    <div className="tool-call-log">
      <div className="tool-call-log-header"><Wrench size={14} /> Tool Calls ({calls.length})</div>
      {calls.map((call) => (
        <div key={call.id} className={`tool-call-entry ${call.status}`}>
          <div
            className="tool-call-summary"
            onClick={() => setExpanded(expanded === call.id ? null : call.id)}
          >
            <span className={`tool-status-icon ${call.status}`}>
              {call.status === 'pending' ? <Loader2 size={14} className="spin" /> : call.status === 'success' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
            </span>
            <span className="tool-call-name">{call.server}/{call.name}</span>
            {call.durationMs != null && (
              <span className="tool-call-duration">{formatDuration(call.durationMs)}</span>
            )}
            <span className="tool-call-expand">{expanded === call.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
          </div>

          {/* Summary line — always visible below completed/error calls */}
          {call.status === 'success' && call.summary && (
            <div className="tool-call-summary-line">{call.summary}</div>
          )}
          {call.status === 'error' && (
            <div className="tool-call-error-line">
              <ErrorDetail entry={call} onRetry={onRetry} />
            </div>
          )}

          {expanded === call.id && (
            <div className="tool-call-detail">
              {call.args && (
                <div>
                  <div className="tool-detail-label">Args</div>
                  <pre className="tool-detail-pre">{JSON.stringify(call.args, null, 2)}</pre>
                </div>
              )}
              {call.result !== undefined && (
                <div>
                  <div className="tool-detail-label">Result</div>
                  <ToolResultView toolName={call.name} result={call.result} />
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Performance footer */}
      {stats.total > 0 && (
        <div className="tool-call-footer">
          Total: {formatDuration(stats.totalDurationMs)} elapsed
          {' · '}{stats.completed}/{stats.total} complete
          {stats.errors > 0 && <span className="tool-footer-errors"> · {stats.errors} error{stats.errors !== 1 ? 's' : ''}</span>}
          {stats.pending > 0 && <span className="tool-footer-pending"> · {stats.pending} pending</span>}
        </div>
      )}
    </div>
  );
}
