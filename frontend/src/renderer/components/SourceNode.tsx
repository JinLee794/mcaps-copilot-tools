// SourceNode — a single data-source card on the Research Canvas
import React from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';

export interface SourceNodeData {
  status: 'idle' | 'loading' | 'loaded' | 'error';
  count?: number;
  items?: unknown[];
  records?: unknown[];
  signals?: string[];
  errorInfo?: { code: string; message: string; action?: string };
}

interface SourceNodeCardProps {
  icon: React.ReactNode;
  title: string;
  node?: SourceNodeData;
  onClick?: () => void;
}

// Extract a short preview label from the first record
function firstRecordPreview(records: unknown[]): string | null {
  if (records.length === 0) return null;
  const first = records[0] as Record<string, unknown> | undefined;
  if (!first || typeof first !== 'object') return null;
  // Try common name fields
  for (const key of ['msp_name', 'name', 'subject', 'title']) {
    if (typeof first[key] === 'string') {
      const val = first[key] as string;
      return val.length > 28 ? val.slice(0, 26) + '…' : val;
    }
  }
  return null;
}

// Build mini status-breakdown badges (e.g. milestones: 2▲ 1⚠ 1✓)
function statusBreakdown(records: unknown[]): Array<{ label: string; className: string }> | null {
  if (records.length === 0) return null;

  // Detect if records have msp_milestonestatus (milestones)
  const first = records[0] as Record<string, unknown> | undefined;
  if (!first) return null;

  // Milestones — group by formatted status value
  const statusField = 'msp_milestonestatus';
  const formattedField = `${statusField}@OData.Community.Display.V1.FormattedValue`;
  if (first[statusField] !== undefined || first[formattedField] !== undefined) {
    const counts: Record<string, number> = {};
    for (const r of records) {
      const rec = r as Record<string, unknown>;
      const label = String(rec[formattedField] ?? rec[statusField] ?? 'Unknown');
      counts[label] = (counts[label] ?? 0) + 1;
    }
    return Object.entries(counts).map(([label, count]) => {
      const cls = label.toLowerCase().includes('risk') ? 'badge-risk' :
        label.toLowerCase().includes('complet') ? 'badge-complete' : 'badge-active';
      return { label: `${count} ${label}`, className: cls };
    });
  }

  // Tasks — group by open/closed
  if (first['statecode'] !== undefined) {
    const open = records.filter((r) => (r as Record<string, unknown>)['statecode'] === 0).length;
    const closed = records.length - open;
    const badges: Array<{ label: string; className: string }> = [];
    if (open > 0) badges.push({ label: `${open} open`, className: 'badge-active' });
    if (closed > 0) badges.push({ label: `${closed} closed`, className: 'badge-complete' });
    return badges;
  }

  return null;
}

export function SourceNodeCard({ icon, title, node, onClick }: SourceNodeCardProps) {
  const status = node?.status ?? 'idle';
  const records = node?.records ?? node?.items ?? [];
  const signals = node?.signals ?? [];
  const preview = firstRecordPreview(records);
  const badges = statusBreakdown(records);

  return (
    <div
      className={`source-node source-node--${status}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="source-node-header">
        <span className="source-node-icon">{icon}</span>
        <span className="source-node-title">{title}</span>
        {status === 'loading' && <Loader2 size={14} className="source-node-spinner" />}
        {status === 'loaded' && node?.count != null && (
          <span className="source-node-count">{node.count}</span>
        )}
        {signals.length > 0 && (
          <span className="source-node-signals-badge" title={signals.join('\n')}>
            {signals.length}
          </span>
        )}
      </div>
      <div className="source-node-body">
        {status === 'idle' && <span className="source-node-idle">Waiting</span>}
        {status === 'loading' && <span className="source-node-loading">Fetching…</span>}
        {status === 'loaded' && (
          <>
            <span className="source-node-loaded">{node?.count ?? 0} items loaded</span>
            {preview && <span className="source-node-preview">{preview}</span>}
            {badges && (
              <div className="source-node-badges">
                {badges.map((b, i) => (
                  <span key={i} className={`source-node-badge ${b.className}`}>{b.label}</span>
                ))}
              </div>
            )}
          </>
        )}
        {status === 'error' && (
          <div className="source-node-error-detail">
            <AlertTriangle size={12} />
            <span>{node?.errorInfo?.message ?? 'Error'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
