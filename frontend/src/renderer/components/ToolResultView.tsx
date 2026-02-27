// ToolResultView — schema-aware result formatter for MCP tool outputs
//
// Replaces raw JSON.stringify rendering with typed formatters based on
// tool name → result kind classification. See _specs/tool-call-ux-spec.md §5.
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Code2 } from 'lucide-react';

interface ToolResultViewProps {
  toolName: string;
  result: unknown;
  /** Compact mode for inline tool calls in the chat timeline */
  compact?: boolean;
}

type ResultKind =
  | 'milestones'
  | 'opportunities'
  | 'people'
  | 'tasks'
  | 'timeline'
  | 'cost-trend'
  | 'diff'
  | 'scalar'
  | 'raw';

// ── Kind Detection ──────────────────────────────────────────────────

function detectResultKind(toolName: string): ResultKind {
  if (toolName === 'view_milestone_timeline') return 'timeline';
  if (toolName === 'view_opportunity_cost_trend') return 'cost-trend';
  if (toolName === 'view_staged_changes_diff') return 'diff';
  if (['get_milestones', 'find_milestones_needing_tasks'].includes(toolName)) return 'milestones';
  if (['list_opportunities', 'get_my_active_opportunities'].includes(toolName)) return 'opportunities';
  if (toolName.includes('people') || toolName === 'get_team_contacts') return 'people';
  if (toolName === 'get_milestone_activities') return 'tasks';
  if (['crm_whoami', 'crm_auth_status'].includes(toolName)) return 'scalar';
  return 'raw';
}

// ── Result Parsing ──────────────────────────────────────────────────

function parseResult(result: unknown): unknown {
  if (!result) return null;

  // Unwrap MCP content envelope
  if (typeof result === 'object' && !Array.isArray(result)) {
    const obj = result as Record<string, unknown>;
    if (Array.isArray(obj['content'])) {
      const first = (obj['content'] as Array<Record<string, unknown>>)[0];
      if (first?.type === 'text' && typeof first.text === 'string') {
        try { return JSON.parse(first.text as string); } catch { return first.text; }
      }
    }
    return obj;
  }

  if (typeof result === 'string') {
    try { return JSON.parse(result); } catch { return result; }
  }

  return result;
}

function extractRecords(parsed: unknown): unknown[] {
  if (Array.isArray(parsed)) return parsed;
  if (typeof parsed === 'object' && parsed !== null) {
    const obj = parsed as Record<string, unknown>;
    // Look for common array keys
    for (const key of ['milestones', 'opportunities', 'tasks', 'activities', 'value', 'items', 'results']) {
      if (Array.isArray(obj[key])) return obj[key] as unknown[];
    }
    // Fall back to first array property
    for (const val of Object.values(obj)) {
      if (Array.isArray(val)) return val;
    }
  }
  return [];
}

// ── OData Formatted Value Helper ────────────────────────────────────

function fv(record: Record<string, unknown>, field: string): string {
  return String(
    record[`${field}@OData.Community.Display.V1.FormattedValue`] ??
    record[field] ??
    '—',
  );
}

function currency(val: unknown): string {
  if (val == null) return '—';
  const num = Number(val);
  if (Number.isNaN(num)) return String(val);
  return `$${num.toLocaleString()}`;
}

function shortDate(val: unknown): string {
  if (!val) return '—';
  const d = new Date(String(val));
  if (Number.isNaN(d.getTime())) return String(val);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// ── Milestone Table ─────────────────────────────────────────────────

function MilestoneResultRows({ records, compact }: { records: Record<string, unknown>[]; compact?: boolean }) {
  if (records.length === 0) return <span className="tool-result-empty">No milestones</span>;

  // Summary line
  const statusCounts: Record<string, number> = {};
  for (const m of records) {
    const status = fv(m, 'msp_milestonestatus');
    statusCounts[status] = (statusCounts[status] ?? 0) + 1;
  }
  const summary = Object.entries(statusCounts).map(([s, c]) => `${c} ${s}`).join(' · ');

  if (compact) {
    return <span className="tool-result-summary">{records.length} milestones — {summary}</span>;
  }

  return (
    <div className="tool-result-cards">
      <div className="tool-result-summary">{summary}</div>
      {records.map((m, i) => {
        const status = fv(m, 'msp_milestonestatus');
        const statusClass =
          status === 'At Risk' ? 'status-at-risk' :
          status === 'Completed' ? 'status-completed' :
          'status-active';
        return (
          <div key={String(m['msp_engagementmilestoneid'] ?? i)} className="tool-result-row-card">
            <div className="tool-result-row-main">
              <span className="tool-result-row-title">{String(m['msp_milestonenumber'] ?? i + 1)} · {String(m['msp_name'] ?? '—')}</span>
              <span className={`status-badge ${statusClass}`}>{status}</span>
            </div>
            <div className="tool-result-row-meta">
              <span>Due {shortDate(m['msp_milestonedate'])}</span>
              <span>Owner {fv(m, '_ownerid_value')}</span>
              <span>Monthly {currency(m['msp_monthlyuse'])}</span>
            </div>
            <div className="tool-result-row-actions">
              <button className="tool-result-action-btn">Update Task</button>
              <button className="tool-result-action-btn">Edit Milestone</button>
              <button className="tool-result-action-btn">View Tasks</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Opportunity Table ───────────────────────────────────────────────

function OpportunityResultCards({ records, compact }: { records: Record<string, unknown>[]; compact?: boolean }) {
  if (records.length === 0) return <span className="tool-result-empty">No opportunities</span>;

  if (compact) {
    const names = records.map((o) => String(o['name'] ?? '—')).join(', ');
    return <span className="tool-result-summary">{records.length} opportunities — {names}</span>;
  }

  return (
    <div className="tool-result-cards">
      {records.map((o, i) => (
        <div key={String(o['opportunityid'] ?? i)} className="tool-result-opportunity-card">
          <div className="tool-result-opportunity-header">
            <strong>{String(o['name'] ?? '—')}</strong>
            <span className="status-badge status-active">{String(o['statecode@OData.Community.Display.V1.FormattedValue'] ?? o['statecode'] ?? 'Open')}</span>
          </div>
          <div className="tool-result-opportunity-grid">
            <span>Owner: {fv(o, '_ownerid_value')}</span>
            <span>Sales play: {String(o['msp_salesplay@OData.Community.Display.V1.FormattedValue'] ?? o['msp_salesplay'] ?? '—')}</span>
            <span>Est. close: {shortDate(o['estimatedclosedate'])}</span>
            <span>Est. completion: {shortDate(o['msp_estcompletiondate'])}</span>
            <span>ACR: {currency(o['msp_consumptionconsumedrecurring'])}</span>
          </div>
          <div className="tool-result-row-actions">
            <button className="tool-result-action-btn">Open Milestones</button>
            <button className="tool-result-action-btn">Edit Opportunity</button>
            <button className="tool-result-action-btn">Refresh</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function isPersonRecord(record: Record<string, unknown>): boolean {
  return ['fullname', 'internalemailaddress', 'title', 'company', 'org'].some((f) => record[f] != null);
}

function PersonResultCards({ records, compact }: { records: Record<string, unknown>[]; compact?: boolean }) {
  if (records.length === 0) return <span className="tool-result-empty">No people</span>;
  if (compact) return <span className="tool-result-summary">{records.length} people found</span>;
  return (
    <div className="tool-result-cards">
      {records.map((p, i) => (
        <div key={String(p['systemuserid'] ?? p['id'] ?? i)} className="tool-result-person-card">
          <div className="tool-result-opportunity-header">
            <strong>{String(p['fullname'] ?? p['name'] ?? 'Unknown')}</strong>
            <span>{String(p['title'] ?? '—')}</span>
          </div>
          <div className="tool-result-opportunity-grid">
            <span>Email: {String(p['internalemailaddress'] ?? p['email'] ?? '—')}</span>
            <span>Org: {String(p['org'] ?? p['company'] ?? '—')}</span>
            <span>Customers: {Array.isArray(p['customers']) ? (p['customers'] as unknown[]).join(', ') : '—'}</span>
          </div>
          <div className="tool-result-row-actions">
            <button className="tool-result-action-btn">Copy Contact</button>
            <button className="tool-result-action-btn">Open Related Records</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Task Table ──────────────────────────────────────────────────────

function TaskResultTable({ records, compact }: { records: Record<string, unknown>[]; compact?: boolean }) {
  if (records.length === 0) return <span className="tool-result-empty">No tasks</span>;

  const open = records.filter((t) => (t['statecode'] as number) === 0).length;
  const closed = records.length - open;

  if (compact) {
    return <span className="tool-result-summary">{records.length} tasks — {open} open · {closed} closed</span>;
  }

  return (
    <div className="tool-result-table-wrap">
      <div className="tool-result-summary">{open} open · {closed} closed</div>
      <table className="tool-result-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Status</th>
            <th>Category</th>
            <th>Due</th>
          </tr>
        </thead>
        <tbody>
          {records.map((t, i) => (
            <tr key={String(t['activityid'] ?? i)}>
              <td>{String(t['subject'] ?? '—')}</td>
              <td>{fv(t, 'statuscode')}</td>
              <td>{fv(t, 'msp_taskcategory')}</td>
              <td>{shortDate(t['scheduledend'])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Diff Table ──────────────────────────────────────────────────────

function DiffResultTable({ data }: { data: Record<string, unknown> }) {
  const rows = (data['rows'] ?? []) as Array<Record<string, unknown>>;
  if (rows.length === 0) return <span className="tool-result-empty">No changes</span>;

  return (
    <div className="tool-result-table-wrap">
      {data['context'] ? <div className="tool-result-summary">{String(data['context'])}</div> : null}
      <table className="tool-result-table diff-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Before</th>
            <th>After</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`diff-${String(row['changeType'] ?? 'updated')}`}>
              <td>{String(row['field'] ?? '—')}</td>
              <td className="diff-before">{String(row['before'] ?? '—')}</td>
              <td className="diff-after">{String(row['after'] ?? '—')}</td>
              <td>{String(row['changeType'] ?? '—')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Timeline View ───────────────────────────────────────────────────

interface TimelineEvent {
  id?: string;
  date?: string;
  title?: string;
  status?: string;
  monthlyUse?: number;
  opportunityName?: string;
  milestoneNumber?: string | number;
}

const TIMELINE_STATUS_CLASS: Record<string, string> = {
  'at risk': 'status-at-risk',
  'completed': 'status-completed',
  'on track': 'status-active',
};

function TimelineResultView({ data, compact }: { data: Record<string, unknown>; compact?: boolean }) {
  const events = (data['events'] ?? []) as TimelineEvent[];
  if (events.length === 0) return <span className="tool-result-empty">No timeline events</span>;

  if (compact) {
    return <span className="tool-result-summary">{events.length} milestones on timeline</span>;
  }

  return (
    <div className="tool-result-timeline">
      {events.map((ev, i) => {
        const statusKey = String(ev.status ?? '').toLowerCase();
        const cls = TIMELINE_STATUS_CLASS[statusKey] ?? 'status-active';
        return (
          <div key={ev.id ?? i} className="timeline-event">
            <div className="timeline-date">{shortDate(ev.date)}</div>
            <div className={`timeline-marker ${cls}`} />
            <div className="timeline-content">
              <span className="timeline-title">{ev.title ?? '—'}</span>
              {ev.opportunityName && <span className="timeline-lane">{ev.opportunityName}</span>}
              <div className="timeline-meta">
                <span className={`status-badge ${cls}`}>{String(ev.status ?? '—')}</span>
                {ev.monthlyUse != null && <span className="timeline-value">{currency(ev.monthlyUse)}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Cost Trend View ─────────────────────────────────────────────────

interface TrendPoint {
  month: string;
  plannedMonthlyUse: number;
}

function CostTrendView({ data, compact }: { data: Record<string, unknown>; compact?: boolean }) {
  const points = (data['points'] ?? []) as TrendPoint[];
  const kpis = (data['kpis'] ?? {}) as Record<string, unknown>;
  const opportunity = (data['opportunity'] ?? {}) as Record<string, unknown>;

  if (compact) {
    const name = String(opportunity['name'] ?? '');
    const consumed = currency(kpis['consumedRecurring']);
    return <span className="tool-result-summary">{name} — ACR {consumed} · {points.length} months</span>;
  }

  // Simple bar chart using CSS
  const maxVal = Math.max(...points.map((p) => p.plannedMonthlyUse), 1);

  return (
    <div className="tool-result-cost-trend">
      {String(opportunity['name'] ?? '') && (
        <div className="cost-trend-header">{String(opportunity['name'])}</div>
      )}
      <div className="cost-trend-kpis">
        <span>ACR: {currency(kpis['consumedRecurring'])}</span>
        <span>Total Planned: {currency(kpis['totalPlannedMonthlyUse'])}</span>
      </div>
      <div className="cost-trend-chart">
        {points.map((p, i) => (
          <div key={i} className="cost-trend-bar-group">
            <div
              className="cost-trend-bar"
              style={{ height: `${(p.plannedMonthlyUse / maxVal) * 100}%` }}
              title={`${p.month}: ${currency(p.plannedMonthlyUse)}`}
            />
            <div className="cost-trend-label">{p.month.slice(5)}</div>
          </div>
        ))}
      </div>
      <table className="tool-result-table">
        <thead>
          <tr><th>Month</th><th>Planned Use</th></tr>
        </thead>
        <tbody>
          {points.map((p, i) => (
            <tr key={i}>
              <td>{p.month}</td>
              <td>{currency(p.plannedMonthlyUse)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Scalar View ─────────────────────────────────────────────────────

function ScalarResultView({ data, compact }: { data: Record<string, unknown>; compact?: boolean }) {
  const entries = Object.entries(data).filter(([_, v]) => v != null && typeof v !== 'object');
  if (entries.length === 0) return <RawJsonView data={data} />;

  if (compact) {
    return <span className="tool-result-summary">{entries.map(([k, v]) => `${k}: ${v}`).join(' · ')}</span>;
  }

  return (
    <div className="tool-result-scalar">
      {entries.map(([key, value]) => (
        <div key={key} className="scalar-row">
          <span className="scalar-key">{key}</span>
          <span className="scalar-value">{String(value)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Raw JSON Fallback ───────────────────────────────────────────────

function RawJsonView({ data }: { data: unknown }) {
  const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  return (
    <pre className="tool-inline-pre tool-result-raw">{text}</pre>
  );
}

// ── Main Component ──────────────────────────────────────────────────

export function ToolResultView({ toolName, result, compact }: ToolResultViewProps) {
  const [showRaw, setShowRaw] = useState(false);
  const kind = detectResultKind(toolName);
  const parsed = parseResult(result);

  if (parsed == null) return <span className="tool-result-empty">No result</span>;

  // Always allow toggling to raw view
  const rawToggle = !compact && kind !== 'raw' && (
    <button
      className="tool-result-raw-toggle"
      onClick={() => setShowRaw(!showRaw)}
    >
      <Code2 size={12} />
      {showRaw ? 'Hide' : 'Show'} raw
      {showRaw ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
    </button>
  );

  if (showRaw) {
    return (
      <div className="tool-result-view">
        {rawToggle}
        <RawJsonView data={parsed} />
      </div>
    );
  }

  const records = extractRecords(parsed);
  const dataObj = typeof parsed === 'object' && parsed !== null ? parsed as Record<string, unknown> : {};
  const hasPersonLikeRecords =
    (records as Record<string, unknown>[]).length > 0 &&
    (records as Record<string, unknown>[]).every((r) => isPersonRecord(r));

  let content: React.ReactNode;

  switch (kind) {
    case 'milestones':
      content = <MilestoneResultRows records={records as Record<string, unknown>[]} compact={compact} />;
      break;
    case 'opportunities':
      content = <OpportunityResultCards records={records as Record<string, unknown>[]} compact={compact} />;
      break;
    case 'people':
      content = <PersonResultCards records={records as Record<string, unknown>[]} compact={compact} />;
      break;
    case 'tasks':
      content = <TaskResultTable records={records as Record<string, unknown>[]} compact={compact} />;
      break;
    case 'diff':
      content = <DiffResultTable data={dataObj} />;
      break;
    case 'scalar':
      content = <ScalarResultView data={dataObj} compact={compact} />;
      break;
    case 'timeline':
      content = <TimelineResultView data={dataObj} compact={compact} />;
      break;
    case 'cost-trend':
      content = <CostTrendView data={dataObj} compact={compact} />;
      break;
    default:
      content = hasPersonLikeRecords
        ? <PersonResultCards records={records as Record<string, unknown>[]} compact={compact} />
        : compact
          ? <span className="tool-result-summary">{typeof parsed === 'string' ? parsed.slice(0, 120) : JSON.stringify(parsed).slice(0, 120)}</span>
          : <RawJsonView data={parsed} />;
  }

  return (
    <div className="tool-result-view">
      {content}
      {rawToggle}
    </div>
  );
}
