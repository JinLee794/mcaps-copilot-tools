// CliActivityStream — live feed of CLI execution steps (skills, tools, context)
import React, { useState, useRef, useEffect } from 'react';
import type { CliActivityEntry, CliActivityKind } from '../../shared/types/AgUiEvent';

const KIND_ICONS: Record<CliActivityKind, string> = {
  skill_loaded: '📘',
  instruction_loaded: '📄',
  context_added: '🧩',
  tool_registered: '🔧',
  session_created: '🔗',
  prompt_sent: '📨',
  tool_invoked: '⚙️',
  tool_completed: '✅',
  cli_log: '📝',
};

interface CliActivityStreamProps {
  entries: CliActivityEntry[];
}

export function CliActivityStream({ entries }: CliActivityStreamProps) {
  const [expanded, setExpanded] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries.length]);

  if (entries.length === 0) return null;

  const toggleDetail = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="cli-activity-stream">
      <div
        className="cli-activity-header"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="cli-activity-toggle">{expanded ? '▾' : '▸'}</span>
        <span>Agent Activity</span>
        <span className="cli-activity-count">{entries.length}</span>
      </div>

      {expanded && (
        <div className="cli-activity-list">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`cli-activity-entry cli-activity-kind-${entry.kind}`}
              onClick={() => entry.detail && toggleDetail(entry.id)}
            >
              <span className="cli-activity-icon">
                {KIND_ICONS[entry.kind] ?? '•'}
              </span>
              <span className="cli-activity-label">{entry.label}</span>
              <span className="cli-activity-time">
                {new Date(entry.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
              {entry.detail && expandedIds.has(entry.id) && (
                <div className="cli-activity-detail">{entry.detail}</div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
