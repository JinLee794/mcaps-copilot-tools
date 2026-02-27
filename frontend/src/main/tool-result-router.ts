// tool-result-router.ts — routes MCP tool results to SalesAgentState source nodes
//
// When a tool completes, this module determines:
//   1. Which source node (if any) should be updated
//   2. What state delta to emit (loading → loaded, with records + count)
//   3. What signals to extract for the correlation engine
//
// See _specs/tool-call-ux-spec.md §4 for the full mapping.

import type { SalesAgentState, CrmMilestone, CrmTask } from '../shared/types/SalesAgentState';

// ── Types ───────────────────────────────────────────────────────────

type SourceKey = keyof SalesAgentState['sources'];

interface SourceUpdate {
  sourceKey: SourceKey;
  status: 'loading' | 'loaded' | 'error';
  count?: number;
  records?: unknown[];
  signals?: string[];
  errorInfo?: { code: string; message: string; action?: string };
}

interface ToolCompletion {
  toolName: string;
  args: Record<string, unknown>;
  result: unknown;
  success: boolean;
}

// ── Tool → Source Node Mapping ──────────────────────────────────────

const TOOL_SOURCE_MAP: Record<string, SourceKey> = {
  get_milestones: 'milestones',
  find_milestones_needing_tasks: 'milestones',
  list_opportunities: 'opportunities',
  get_my_active_opportunities: 'opportunities',
  get_milestone_activities: 'tasks',
};

// Tools that don't update source nodes (metadata, views, writes)
const METADATA_TOOLS = new Set([
  'crm_whoami', 'crm_auth_status', 'crm_get_record', 'crm_query',
  'get_task_status_options', 'list_accounts_by_tpid',
  'view_milestone_timeline', 'view_opportunity_cost_trend', 'view_staged_changes_diff',
  'create_task', 'update_task', 'update_milestone', 'close_task',
]);

// ── Public API ──────────────────────────────────────────────────────

/**
 * Determine which source node (if any) should be set to 'loading'
 * when a tool execution starts.
 */
export function getSourceKeyForTool(toolName: string, args?: Record<string, unknown>): SourceKey | null {
  if (TOOL_SOURCE_MAP[toolName]) return TOOL_SOURCE_MAP[toolName];
  if (toolName === 'ask_work_iq') return detectWorkIqScope(args ?? {});
  // crm_query can target milestones or tasks depending on entitySet
  if (toolName === 'crm_query') return detectCrmQuerySource(args ?? {});
  return null;
}

/**
 * Route a completed tool result to a source node update.
 * Returns null if the tool doesn't map to any source node.
 */
export function routeToolResult(completion: ToolCompletion): SourceUpdate | null {
  const { toolName, args, result, success } = completion;

  const sourceKey = getSourceKeyForTool(toolName, args);

  if (!success) {
    return sourceKey
      ? { sourceKey, status: 'error', errorInfo: parseToolError(result) }
      : null;
  }

  if (!sourceKey) return null;

  const parsed = parseToolResult(result);
  if (!parsed) return { sourceKey, status: 'loaded', count: 0, records: [] };

  switch (toolName) {
    case 'get_milestones':
    case 'find_milestones_needing_tasks': {
      const milestones = extractArray(parsed, 'milestones') ?? extractTopLevelArray(parsed);
      return {
        sourceKey: 'milestones',
        status: 'loaded',
        count: milestones.length,
        records: milestones,
        signals: extractMilestoneSignals(milestones as CrmMilestone[]),
      };
    }

    case 'list_opportunities':
    case 'get_my_active_opportunities': {
      const opps = extractArray(parsed, 'opportunities') ?? extractTopLevelArray(parsed);
      return {
        sourceKey: 'opportunities',
        status: 'loaded',
        count: opps.length,
        records: opps,
      };
    }

    case 'get_milestone_activities': {
      const tasks = extractArray(parsed, 'tasks') ?? extractArray(parsed, 'activities') ?? extractTopLevelArray(parsed);
      return {
        sourceKey: 'tasks',
        status: 'loaded',
        count: tasks.length,
        records: tasks,
        signals: extractTaskSignals(tasks as CrmTask[]),
      };
    }

    case 'ask_work_iq': {
      return {
        sourceKey,
        status: 'loaded',
        count: typeof parsed.count === 'number' ? parsed.count : (extractTopLevelArray(parsed)).length,
        records: extractTopLevelArray(parsed),
      };
    }

    case 'crm_query': {
      const records = extractArray(parsed, 'value') ?? extractTopLevelArray(parsed);
      return {
        sourceKey,
        status: 'loaded',
        count: records.length,
        records,
        signals: sourceKey === 'milestones' ? extractMilestoneSignals(records as CrmMilestone[]) : undefined,
      };
    }

    default:
      return null;
  }
}

// ── WorkIQ Scope Detection ──────────────────────────────────────────

function detectWorkIqScope(args: Record<string, unknown>): SourceKey | null {
  const query = String(args['query'] ?? '').toLowerCase();
  const scope = String(args['scope'] ?? '').toLowerCase();

  // Explicit scope parameter
  if (scope === 'email' || scope === 'outlook') return 'emails';
  if (scope === 'transcript' || scope === 'meeting') return 'transcripts';
  if (scope === 'teams' || scope === 'chat' || scope === 'channel') return 'teams';
  if (scope === 'file' || scope === 'sharepoint' || scope === 'onedrive') return 'sharepoint';

  // Keyword fallback from query text
  if (/\b(email|outlook|inbox|sent)\b/.test(query)) return 'emails';
  if (/\b(transcript|recording|meeting)\b/.test(query)) return 'transcripts';
  if (/\b(teams|chat|channel|message)\b/.test(query)) return 'teams';
  if (/\b(file|document|sharepoint|onedrive)\b/.test(query)) return 'sharepoint';

  return null;
}

// ── CRM Query Source Detection ──────────────────────────────────────

function detectCrmQuerySource(args: Record<string, unknown>): SourceKey | null {
  const entitySet = String(args['entitySet'] ?? '').toLowerCase();
  if (entitySet.includes('milestone')) return 'milestones';
  if (entitySet.includes('task') || entitySet.includes('activit')) return 'tasks';
  if (entitySet.includes('opportunit')) return 'opportunities';
  return null;
}

// ── Result Parsing ──────────────────────────────────────────────────

/**
 * Parse the raw MCP tool result. MCP results come wrapped as:
 * { content: [{ type: 'text', text: '...' }] }
 * or sometimes as plain objects/arrays.
 */
function parseToolResult(result: unknown): Record<string, unknown> | null {
  if (!result) return null;

  // MCP text content format
  if (typeof result === 'object' && !Array.isArray(result)) {
    const obj = result as Record<string, unknown>;

    // Unwrap MCP content envelope: { content: [{ type: 'text', text: '...' }] }
    if (Array.isArray(obj['content'])) {
      const firstContent = (obj['content'] as Array<Record<string, unknown>>)[0];
      if (firstContent?.type === 'text' && typeof firstContent.text === 'string') {
        try {
          return JSON.parse(firstContent.text as string);
        } catch {
          return { text: firstContent.text };
        }
      }
    }

    return obj;
  }

  // String result — try JSON parse
  if (typeof result === 'string') {
    try {
      const parsed = JSON.parse(result);
      return typeof parsed === 'object' && parsed !== null ? parsed : { value: parsed };
    } catch {
      return { text: result };
    }
  }

  // Array result
  if (Array.isArray(result)) {
    return { items: result };
  }

  return null;
}

function extractArray(obj: Record<string, unknown>, key: string): unknown[] | null {
  const val = obj[key];
  return Array.isArray(val) ? val : null;
}

function extractTopLevelArray(obj: Record<string, unknown>): unknown[] {
  // Look for the first array-valued property
  for (const val of Object.values(obj)) {
    if (Array.isArray(val)) return val;
  }
  return [];
}

// ── Signal Extraction ───────────────────────────────────────────────

function extractMilestoneSignals(milestones: CrmMilestone[]): string[] {
  const signals: string[] = [];
  if (milestones.length === 0) return signals;

  // Count by status using formatted values
  const statusCounts: Record<string, number> = {};
  for (const m of milestones) {
    const status = m['msp_milestonestatus@OData.Community.Display.V1.FormattedValue'] ?? String(m.msp_milestonestatus);
    statusCounts[status] = (statusCounts[status] ?? 0) + 1;
  }

  const statusParts = Object.entries(statusCounts).map(([s, c]) => `${c} ${s}`);
  if (statusParts.length > 0) signals.push(statusParts.join(' · '));

  // At-risk count
  const atRisk = milestones.filter((m) => {
    const fv = m['msp_milestonestatus@OData.Community.Display.V1.FormattedValue'];
    return fv === 'At Risk' || m.msp_milestonestatus === 861980002;
  });
  if (atRisk.length > 0) signals.push(`${atRisk.length} milestone${atRisk.length > 1 ? 's' : ''} at risk`);

  // Overdue milestones
  const now = new Date().toISOString().slice(0, 10);
  const overdue = milestones.filter((m) =>
    m.msp_milestonedate && m.msp_milestonedate < now && m.msp_milestonestatus !== 861980003,
  );
  if (overdue.length > 0) signals.push(`${overdue.length} overdue`);

  return signals;
}

function extractTaskSignals(tasks: CrmTask[]): string[] {
  const signals: string[] = [];
  if (tasks.length === 0) return signals;

  const overdue = tasks.filter((t) => {
    if (!t.scheduledend) return false;
    return t.scheduledend < new Date().toISOString().slice(0, 10) && t.statecode === 0;
  });
  if (overdue.length > 0) signals.push(`${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}`);

  const open = tasks.filter((t) => t.statecode === 0);
  const closed = tasks.filter((t) => t.statecode !== 0);
  signals.push(`${open.length} open · ${closed.length} closed`);

  return signals;
}

// ── Error Parsing ───────────────────────────────────────────────────

/**
 * Parse common CRM/MCP error patterns into structured info.
 * Exported for use by renderer-side error display.
 */
export function parseToolError(result: unknown): { code: string; message: string; action?: string } {
  const text = typeof result === 'string' ? result : JSON.stringify(result ?? '');
  const lower = text.toLowerCase();

  if (lower.includes('401') || lower.includes('unauthorized') || lower.includes('token expired')) {
    return { code: '401', message: 'Authentication expired or invalid', action: 'Re-authenticate with CRM' };
  }
  if (lower.includes('403') || lower.includes('forbidden') || lower.includes('access denied')) {
    return { code: '403', message: 'Insufficient permissions for this operation', action: 'Check role assignment' };
  }
  if (lower.includes('404') || lower.includes('not found') || lower.includes('does not exist')) {
    return { code: '404', message: 'Record not found', action: 'Verify the record ID is correct' };
  }
  if (lower.includes('429') || lower.includes('rate limit') || lower.includes('throttl')) {
    return { code: '429', message: 'Rate limited by CRM API', action: 'Wait a moment and retry' };
  }
  if (lower.includes('500') || lower.includes('internal server')) {
    return { code: '500', message: 'CRM server error', action: 'Retry or check CRM service health' };
  }
  if (lower.includes('timeout') || lower.includes('econnrefused') || lower.includes('network')) {
    return { code: 'NETWORK', message: 'Network or connection error', action: 'Check connectivity' };
  }

  return { code: 'UNKNOWN', message: text.slice(0, 200) };
}
