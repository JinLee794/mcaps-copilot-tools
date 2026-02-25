// ToolCallLog — collapsible log of tool invocations in the chat pane
import React, { useState } from 'react';
import { Wrench, Loader2, CheckCircle2, XCircle, ChevronDown, ChevronRight } from 'lucide-react';

export interface ToolCallEntry {
  id: string;
  name: string;
  server: string;
  status: 'pending' | 'success' | 'error';
  args?: Record<string, unknown>;
  result?: unknown;
  durationMs?: number;
  timestamp: Date;
}

interface ToolCallLogProps {
  calls: ToolCallEntry[];
}

export function ToolCallLog({ calls }: ToolCallLogProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (calls.length === 0) return null;

  return (
    <div className="tool-call-log">
      <div className="tool-call-log-header"><Wrench size={14} /> Tool Calls ({calls.length})</div>
      {calls.map((call) => (
        <div key={call.id} className="tool-call-entry">
          <div
            className="tool-call-summary"
            onClick={() => setExpanded(expanded === call.id ? null : call.id)}
          >
            <span className={`tool-status-icon ${call.status}`}>
              {call.status === 'pending' ? <Loader2 size={14} className="spin" /> : call.status === 'success' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
            </span>
            <span className="tool-call-name">{call.server}/{call.name}</span>
            {call.durationMs != null && (
              <span className="tool-call-duration">{call.durationMs}ms</span>
            )}
            <span className="tool-call-expand">{expanded === call.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
          </div>
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
                  <pre className="tool-detail-pre">
                    {typeof call.result === 'string'
                      ? call.result
                      : JSON.stringify(call.result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
