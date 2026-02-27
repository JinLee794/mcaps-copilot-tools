# Tool Call UX/UI — Architecture & Fix Plan

> **Status:** Draft  
> **Depends on:** `imported-spec.md` §2.3, §3, §5.2, §5.3  
> **Scope:** How MCP tool call outputs flow from the main process to the renderer, how they map to UI components, and what needs fixing.

---

## 1. Problem Statement

The current implementation has solid UI scaffolding and IPC plumbing, but **tool call results are orphaned** — data fetched by MCP tools never reaches the Research Canvas or structured views. Users see raw JSON in expandable rows while the canvas nodes remain empty. Six specific breaks in the data pipeline must be fixed.

### Symptoms

| # | Symptom | Root Cause | Severity |
|---|---------|------------|----------|
| 1 | `TOOL_CALL_END.toolName` is always empty string | `ag-ui-translator.ts` sets `toolName: ''` on completion events because `tool.execution_complete` doesn't carry the name | **High** |
| 2 | `durationMs` always shows `0ms` | No timing calculation — `TOOL_CALL_START` timestamp not carried forward | **Medium** |
| 3 | ResearchCanvas source nodes stay `idle` forever | No `STATE_DELTA` events emitted to update `sources.*` from tool results | **Critical** |
| 4 | Approval card `diffPreview` always empty | No diff generation logic pipes `view_staged_changes_diff` output into the interrupt | **Critical** |
| 5 | Tool results displayed as raw `JSON.stringify` | No schema-aware formatters for milestones, tasks, timelines, cost trends | **High** |
| 6 | Approval confirmation may not fully reach SDK | `permission:respond` resolves the promise, but edited args are not forwarded into the `PermissionRequestResult` | **High** |

---

## 2. Current Data Flow (As-Is)

```
User clicks "Run Skill"
      │
      ▼
AgentChat.handleSend()
      │  window.electronAPI.copilot.run({ skill, prompt, context })
      ▼
copilot-handlers.ts  ipcMain.handle('copilot:run')
      │  1. Creates CopilotSession via SDK
      │  2. session.on(sdkEvent) callback registered
      │  3. session.send({ prompt })
      ▼
SDK fires events as Copilot CLI calls MCP tools
      │
      ├─ tool.execution_start ──► emitAgUiEvent() ──► TOOL_CALL_START
      │                                                  │
      │   ag-ui-translator maps:                         ▼
      │   toolName: event.data.toolName  ✅              useAgUiTransport adds entry
      │   args: event.data.arguments     ✅              to toolCalls[] with name + args
      │   callId: event.data.toolCallId  ✅
      │
      ├─ tool.execution_complete ──► emitAgUiEvent() ──► TOOL_CALL_END
      │                                                    │
      │   ag-ui-translator maps:                           ▼
      │   toolName: ''               ❌ EMPTY              useAgUiTransport updates
      │   callId: event.data.toolCallId  ✅               the matching entry by callId
      │   result: event.data.result  ✅                   but can't fix empty toolName
      │   durationMs: 0              ❌ HARDCODED
      │
      └─ (no STATE_DELTA emitted)    ❌ MISSING
                                     Canvas nodes never update
```

### Where Things Break

**Break 1 — Lost tool name.** `tool.execution_complete` SDK events don't include `toolName`. The `pendingToolCalls` map in `copilot-handlers.ts` tracks it, but `ag-ui-translator.ts` doesn't have access to that map. The translator receives the raw SDK event and produces an AG-UI event with `toolName: ''`.

**Break 2 — No duration.** `TOOL_CALL_START` establishes a timestamp, and `TOOL_CALL_END` arrives later, but no code computes the delta. The translator hardcodes `durationMs: 0`.

**Break 3 — No state updates.** When `get_milestones` returns 4 records, nobody emits a `STATE_DELTA` to set `sources.milestones.status = 'loaded'` and `sources.milestones.records = [...]`. The useAgUiTransport hook handles `STATE_DELTA` correctly — it just never receives one for source data.

**Break 4 — No diff generation.** The `view_staged_changes_diff` tool exists in the MCP server, but its result is never piped into the `INTERRUPT` event's `diffPreview` field. The interrupt emitter in `copilot-handlers.ts` doesn't look up staged changes.

**Break 5 — No result formatting.** `InlineToolCall` in AgentChat and `ToolCallLog` both render `JSON.stringify(result, null, 2)` — no awareness of whether the result is milestones (→ table), a timeline (→ chronological view), a cost trend (→ chart), or a diff (→ before/after table).

**Break 6 — Edited args dropped.** `permission:respond` handler resolves the SDK promise with `{ kind: 'approved' }` but ignores `resp.edits`. The SDK's `PermissionRequestResult` type doesn't support passing back modified arguments — the edited args from ApprovalCard's JSON editor are lost.

---

## 3. Target Data Flow (To-Be)

```
SDK fires tool.execution_start
      │
      ▼
copilot-handlers.ts
      │  1. Track in pendingToolCalls map (already done)
      │  2. Emit TOOL_CALL_START with name + args (already done)
      │  3. NEW: Emit STATE_DELTA to set source node → 'loading'
      │         (tool-to-source mapping determines which source)
      ▼
SDK fires tool.execution_complete
      │
      ▼
copilot-handlers.ts
      │  1. Look up toolName from pendingToolCalls map
      │  2. Compute durationMs from start timestamp
      │  3. Emit TOOL_CALL_END with REAL toolName + durationMs
      │  4. NEW: Parse result, emit STATE_DELTA to:
      │         a. Set source node → 'loaded' with count + records
      │         b. Extract signals for correlation engine
      │  5. NEW: For write tools, look up staged diff and attach
      │         to INTERRUPT events
      ▼
useAgUiTransport receives events
      │
      ├─ TOOL_CALL_START → adds to toolCalls[] (no change)
      │
      ├─ TOOL_CALL_END → updates toolCalls[] with:
      │     - Real tool name (resolved from START or from event)
      │     - Duration in ms
      │     - Typed result (not just raw JSON)
      │
      ├─ STATE_DELTA → merges into SalesAgentState
      │     - sources.milestones.status = 'loaded'
      │     - sources.milestones.count = 4
      │     - sources.milestones.records = [...]
      │     → ResearchCanvas re-renders with live node states
      │
      └─ INTERRUPT → includes diffPreview from staged changes
            → ApprovalCard renders before/after table
```

---

## 4. Tool → Source Node Mapping

The key integration layer: which MCP tool results update which Research Canvas source node.

### 4.1 Source Node Registry

| Source Node | State Key | MCP Tools That Feed It | Result Shape |
|---|---|---|---|
| **Emails** | `sources.emails` | `ask_work_iq` (scope: email) | `{ count, items: string[] }` |
| **Transcripts** | `sources.transcripts` | `ask_work_iq` (scope: transcript) | `{ count, items: string[] }` |
| **Teams** | `sources.teams` | `ask_work_iq` (scope: teams) | `{ count, items: string[] }` |
| **SharePoint** | `sources.sharepoint` | `ask_work_iq` (scope: files) | `{ count, items: string[] }` |
| **Opportunities** | `sources.opportunities` | `list_opportunities`, `crm_get_record`(opp), `get_my_active_opportunities` | `CrmOpportunity[]` |
| **Milestones** | `sources.milestones` | `get_milestones`, `find_milestones_needing_tasks`, `crm_query`(milestones) | `CrmMilestone[]` |
| **Tasks** | `sources.tasks` | `get_milestone_activities`, `crm_query`(tasks) | `CrmTask[]` |

### 4.2 Tool Classification

Tools are classified by their effect on the UI:

| Category | Tools | UI Effect |
|---|---|---|
| **Source loaders** | `ask_work_iq`, `list_opportunities`, `get_milestones`, `get_milestone_activities`, `find_milestones_needing_tasks`, `get_my_active_opportunities` | Update source nodes + feed correlation engine |
| **View renderers** | `view_milestone_timeline`, `view_opportunity_cost_trend`, `view_staged_changes_diff` | Populate specialized views (timeline, chart, diff table) |
| **Write preparers** | `create_task`, `update_task`, `update_milestone`, `close_task` | Trigger INTERRUPT + approval gate + diff preview |
| **Metadata readers** | `crm_whoami`, `crm_auth_status`, `crm_query`, `crm_get_record`, `get_task_status_options`, `list_accounts_by_tpid` | Informational — show in ToolCallLog only, no source node update |

### 4.3 WorkIQ Scope Detection

`ask_work_iq` is a multi-purpose tool — the source node it updates depends on the query scope. Detection heuristic from tool arguments:

```typescript
function detectWorkIqScope(args: Record<string, unknown>): keyof SalesAgentState['sources'] | null {
  const query = String(args.query ?? '').toLowerCase();
  const scope = String(args.scope ?? '').toLowerCase();

  // Explicit scope parameter (preferred)
  if (scope === 'email' || scope === 'outlook') return 'emails';
  if (scope === 'transcript' || scope === 'meeting') return 'transcripts';
  if (scope === 'teams' || scope === 'chat' || scope === 'channel') return 'teams';
  if (scope === 'file' || scope === 'sharepoint' || scope === 'onedrive') return 'sharepoint';

  // Keyword fallback from query text
  if (/\b(email|outlook|inbox|sent)\b/.test(query)) return 'emails';
  if (/\b(transcript|recording|meeting)\b/.test(query)) return 'transcripts';
  if (/\b(teams|chat|channel|message)\b/.test(query)) return 'teams';
  if (/\b(file|document|sharepoint|onedrive)\b/.test(query)) return 'sharepoint';

  return null; // Unknown — don't update any source node
}
```

---

## 5. Fix Plan — Implementation Tasks

### Fix 1: Resolve `toolName` on `TOOL_CALL_END`

**File:** `copilot-handlers.ts` (main process)

**Approach:** The `pendingToolCalls` map already tracks `toolName` by `toolCallId`. Instead of relying on `ag-ui-translator.ts` (which only sees the raw SDK event), enrich the AG-UI event _after_ translation in the event subscriber.

```
session.on(sdkEvent) callback:
  if (sdkEvent.type === 'tool.execution_complete'):
    1. Look up toolInfo = pendingToolCalls.get(sdkEvent.data.toolCallId)
    2. Translate via emitAgUiEvent as before
    3. Emit a CORRECTED TOOL_CALL_END with toolName = toolInfo.toolName
```

Alternatively, modify `emitAgUiEvent` to accept context (the pendingToolCalls map) so the translator can resolve names. The first approach is simpler.

**What changes:**
- `copilot-handlers.ts`: In the `session.on()` callback, for `tool.execution_complete`, bypass `emitAgUiEvent()` and emit a manually constructed TOOL_CALL_END with the real tool name from `pendingToolCalls`.

### Fix 2: Compute `durationMs`

**File:** `copilot-handlers.ts`

**Approach:** Extend `pendingToolCalls` to track start timestamps.

```typescript
// Change the map value type:
const pendingToolCalls = new Map<string, {
  toolName: string;
  arguments?: Record<string, unknown>;
  startedAt: number;  // Date.now() when TOOL_CALL_START was emitted
}>();
```

On `tool.execution_complete`:
```typescript
const durationMs = Date.now() - (toolInfo?.startedAt ?? Date.now());
```

### Fix 3: Emit `STATE_DELTA` from Tool Results → Source Nodes

**New module:** `tool-result-router.ts` (main process)

This is the missing integration layer. When a tool completes, the router:
1. Classifies the tool (source loader? view renderer? write preparer? metadata?)
2. Parses the result into typed records
3. Emits a `STATE_DELTA` event updating the appropriate source node

```typescript
// tool-result-router.ts — routes tool results to SalesAgentState source nodes

interface ToolCompletion {
  toolName: string;
  args: Record<string, unknown>;
  result: unknown;
  success: boolean;
}

interface SourceUpdate {
  path: string;           // e.g. 'sources.milestones'
  status: 'loading' | 'loaded' | 'error';
  count?: number;
  records?: unknown[];
  signals?: string[];
}

function routeToolResult(completion: ToolCompletion): SourceUpdate | null {
  const { toolName, args, result, success } = completion;

  if (!success) {
    // Route errors to the appropriate source node
    const sourceKey = toolToSourceKey(toolName, args);
    return sourceKey ? { path: `sources.${sourceKey}`, status: 'error' } : null;
  }

  // Parse the MCP text content result
  const parsed = parseToolResult(result);
  if (!parsed) return null;

  switch (toolName) {
    case 'get_milestones':
    case 'find_milestones_needing_tasks':
      return {
        path: 'sources.milestones',
        status: 'loaded',
        count: Array.isArray(parsed.milestones) ? parsed.milestones.length : 0,
        records: parsed.milestones ?? [],
        signals: extractMilestoneSignals(parsed.milestones ?? []),
      };

    case 'list_opportunities':
    case 'get_my_active_opportunities':
      return {
        path: 'sources.opportunities',
        status: 'loaded',
        count: Array.isArray(parsed.opportunities) ? parsed.opportunities.length : 0,
        records: parsed.opportunities ?? [],
      };

    case 'get_milestone_activities':
      return {
        path: 'sources.tasks',
        status: 'loaded',
        count: Array.isArray(parsed.tasks) ? parsed.tasks.length : 0,
        records: parsed.tasks ?? [],
      };

    case 'ask_work_iq': {
      const scope = detectWorkIqScope(args);
      if (!scope) return null;
      return {
        path: `sources.${scope}`,
        status: 'loaded',
        count: parsed.count ?? 0,
        records: parsed.items ?? [],
      };
    }

    default:
      return null;
  }
}
```

**Integration point:** In `copilot-handlers.ts`, after emitting `TOOL_CALL_END`, call the router:

```typescript
const sourceUpdate = routeToolResult({ toolName, args, result, success });
if (sourceUpdate) {
  window.webContents.send('ag-ui:event',
    createAgUiEvent(AgUiEventType.STATE_DELTA, runId, {
      [sourceUpdate.path]: {
        status: sourceUpdate.status,
        count: sourceUpdate.count,
        records: sourceUpdate.records,
        signals: sourceUpdate.signals ?? [],
      },
    })
  );
}
```

Also emit a `loading` state on `tool.execution_start`:
```typescript
const sourceKey = toolToSourceKey(sdkEvent.data.toolName, sdkEvent.data.arguments);
if (sourceKey) {
  window.webContents.send('ag-ui:event',
    createAgUiEvent(AgUiEventType.STATE_DELTA, runId, {
      [`sources.${sourceKey}`]: { status: 'loading', count: 0, records: [], signals: [] },
    })
  );
}
```

### Fix 4: Populate Diff Preview on INTERRUPT

**Files:** `copilot-handlers.ts`, `approval-queue.js`

**Approach:** When a write-intent tool triggers a permission request, check the MCP approval queue for staged changes and include the diff in the INTERRUPT event.

```typescript
// In onPermissionRequest handler, for MCP-kind permissions:
if (request.kind === 'mcp' && toolInfo?.toolName) {
  const writeTools = ['create_task', 'update_task', 'update_milestone', 'close_task'];
  if (writeTools.includes(toolInfo.toolName)) {
    // The approval-queue in the MCP server has staged the change.
    // Query staged changes via IPC to the MCP server, or
    // read from the local staging file.
    const diff = await getStagedDiff(toolInfo.toolName, toolInfo.arguments);
    if (diff) {
      interruptData.diffPreview = diff;
    }
  }
}
```

**Note:** This requires the MCP server's staged changes to be accessible from the Electron main process. Options:
- a) Read `STAGED_OPERATIONS.md` or `.copilot/staging/` directory
- b) Call `view_staged_changes_diff` via the MCP server directly
- c) Have the MCP server emit the diff as part of the permission callback context

Option (b) is cleanest — invoke `view_staged_changes_diff` programmatically when a write tool triggers an INTERRUPT.

### Fix 5: Schema-Aware Result Formatting

**New component:** `ToolResultView.tsx` (renderer)

Replace the raw JSON `<pre>` blocks with typed formatters.

#### 5.1 Result Type Detection

```typescript
type ToolResultKind =
  | 'milestones'      // Array of CrmMilestone
  | 'opportunities'   // Array of CrmOpportunity
  | 'tasks'           // Array of CrmTask
  | 'timeline'        // TimelineData
  | 'cost-trend'      // CostTrendData
  | 'diff'            // DiffData
  | 'workiq'          // WorkIQ response (emails, transcripts, etc.)
  | 'scalar'          // Single value (whoami, auth status)
  | 'raw';            // Unknown — fallback to JSON

function detectResultKind(toolName: string, result: unknown): ToolResultKind {
  if (toolName === 'view_milestone_timeline') return 'timeline';
  if (toolName === 'view_opportunity_cost_trend') return 'cost-trend';
  if (toolName === 'view_staged_changes_diff') return 'diff';
  if (toolName === 'ask_work_iq') return 'workiq';
  if (['get_milestones', 'find_milestones_needing_tasks'].includes(toolName)) return 'milestones';
  if (['list_opportunities', 'get_my_active_opportunities'].includes(toolName)) return 'opportunities';
  if (toolName === 'get_milestone_activities') return 'tasks';
  if (['crm_whoami', 'crm_auth_status'].includes(toolName)) return 'scalar';
  return 'raw';
}
```

#### 5.2 Formatter Components

```
ToolResultView (dispatcher)
  ├── MilestoneResultTable    — sortable table with status badges, formatted values
  ├── OpportunityResultTable  — name, ACR, sales play, est. completion
  ├── TaskResultTable         — subject, due date, status, category
  ├── TimelineResultView      — vertical timeline with date markers
  ├── CostTrendChart          — line chart (using lightweight charting lib)
  ├── DiffResultTable         — field / before / after / change-type
  ├── WorkIqResultView        — grouped list by content type
  ├── ScalarResultView        — key-value pairs
  └── RawJsonView             — current fallback (collapsible JSON)
```

Each formatter receives the parsed result and renders a compact, scannable view. The raw JSON fallback is always available via a "Show raw" toggle.

#### 5.3 Integration Points

**InlineToolCall** (in AgentChat.tsx):
```tsx
// Replace:
<pre className="tool-inline-pre">
  {typeof call.result === 'string' ? call.result : JSON.stringify(call.result, null, 2)}
</pre>

// With:
<ToolResultView toolName={call.name} result={call.result} compact />
```

**ToolCallLog** (standalone component):
```tsx
// Same replacement in the expanded detail view
<ToolResultView toolName={call.name} result={call.result} />
```

### Fix 6: Forward Edited Args Through Approval

**File:** `copilot-handlers.ts`

The current SDK `PermissionRequestResult` type only supports `kind: 'approved' | 'denied-*'`. Edited args can't be passed back through the SDK's permission system directly.

**Workaround approach:** When the user edits args and approves:
1. Deny the original permission request
2. Programmatically invoke the tool with the edited args via a new SDK session message
3. This effectively "replays" the tool call with corrected parameters

**Simpler approach (recommended):** Since the SDK doesn't support arg editing in permissions, remove the "Edit" button from ApprovalCard for now and add a post-approval "Re-run with edits" action that queues a follow-up tool call. Document this as an SDK limitation.

```typescript
// copilot-handlers.ts — updated permission handler
if (resp.approved && resp.edits) {
  // SDK doesn't support modified args in PermissionRequestResult.
  // Approve the original, then queue a correction message to the session.
  resolve({ kind: 'approved' });
  // NOTE: Correction via follow-up prompt is a UX compromise.
  // Track as a known limitation for SDK enhancement request.
} else {
  resolve({
    kind: resp.approved ? 'approved' : 'denied-interactively-by-user',
  });
}
```

---

## 6. UI Component Enhancements

### 6.1 ToolCallLog — Enhanced Timeline

Current state: flat list with expand/collapse for raw JSON.

Target state:

```
┌──────────────────────────────────────────────────────────────┐
│  🔧 Tool Calls (6)                                 [Filter ▾]│
│  ────────────────────────────────────────────────────────────│
│                                                              │
│  ✓  msx-crm/list_opportunities         3 results    620ms   │
│     └─ Acme Corp, Contoso Ltd, Fabrikam                     │◀── Summary line
│                                                              │
│  ✓  msx-crm/get_milestones             4 results    1.4s    │
│     └─ 2 Active · 1 At Risk · 1 Completed                  │◀── Status breakdown
│     ┌──────────────────────────────────────────────────┐     │
│     │ #  │ Name          │ Status   │ Monthly │ Date   │     │◀── Inline table
│     │ 01 │ Azure Migrate │ Active   │ $12,000 │ Mar 15 │     │    (when expanded)
│     │ 02 │ Data Platform │ At Risk  │ $8,500  │ Apr 01 │     │
│     │ 03 │ Security Rev  │ Active   │ $4,200  │ Mar 28 │     │
│     │ 04 │ AI Pilot      │ Complete │ $0      │ Feb 10 │     │
│     └──────────────────────────────────────────────────┘     │
│     [Show Raw JSON]                                          │
│                                                              │
│  ⟳  msx-crm/get_milestone_activities   ...          ──      │◀── In progress
│                                                              │
│  ✓  workiq/ask_work_iq                 12 emails    2.1s    │
│     └─ 12 threads from last 30 days                         │
│                                                              │
│  ○  msx-crm/view_milestone_timeline    (queued)              │
│  ○  msx-crm/view_opportunity_cost_trend (queued)             │
│                                                              │
│  ─── Performance ────────────────────────────────────────── │
│  Total: 4.1s elapsed · 3/6 complete · 0 errors              │
└──────────────────────────────────────────────────────────────┘
```

**Enhancements:**
- **Summary line:** One-line summary below each completed tool (e.g., "2 Active · 1 At Risk · 1 Completed")
- **Inline formatted table:** When expanded, show schema-aware table instead of raw JSON
- **Duration:** Real elapsed time from `pendingToolCalls` timestamps
- **Performance footer:** Aggregate stats for the run
- **Filter:** Quick filter by status (pending/success/error)
- **Queued state:** Tools the agent plans to call but hasn't started yet

### 6.2 SourceNode — Richer Status Indicators

Current: icon + title + "Waiting" / "Fetching…" / "N items loaded" / "Error"

Target:

```
┌──────────────┐
│ 🏢 Milestones │ ◀── Status-colored left border
│  4 loaded     │
│  ●●●●○○○○    │ ◀── Progress bar (filled segments = loaded/total)
│  2▲ 1⚠ 1✓   │ ◀── Status breakdown badges
│  "Cloud Mig…" │ ◀── First record preview
└──────────────┘
```

**Enhancements:**
- **Status-colored border:** idle=grey, loading=amber-pulse, loaded=green, error=red
- **Record preview:** Show first record name/title as a hint
- **Status breakdown:** For milestones, show Active/At Risk/Completed counts as mini-badges
- **Clickable:** Click to open a detail drawer or scroll to the inline table in ToolCallLog
- **Signals badge:** When correlation signals are extracted, show signal count overlay

### 6.3 ApprovalCard — Diff Table from Staged Changes

Current: Shows `diffPreview` (always empty) or raw JSON `proposedArgs`.

Target:

```
┌──────────────────────────────────────────────────────────────┐
│  ⚠️ APPROVAL REQUIRED                                        │
│  ──────────────────────────────────────────────────────────  │
│                                                              │
│  Update milestone forecast comments on 7-123456789           │
│  Tool: msx-crm/update_milestone                             │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Field                   │ Current       │ Proposed     │  │
│  │─────────────────────────│───────────────│──────────────│  │
│  │ msp_forecastcomments    │ "On track…"   │ "Risk: proc… │  │
│  │ msp_milestonestatus     │ Active (0)    │ At Risk (2)  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  [✓ Approve]  [✕ Deny]                                      │
└──────────────────────────────────────────────────────────────┘
```

**Changes:**
- Pipe `view_staged_changes_diff` result into the interrupt's `diffPreview` field
- Render the `DiffData` type using the existing diff table UI
- Use OData formatted values for human-readable field names
- Remove the "Edit" button (SDK limitation — document in UI as tooltip)

### 6.4 Error Surface

Currently, tool errors log to console only. Add:

```
┌──────────────────────────────────────────────────────────────┐
│  ✕  msx-crm/get_milestones              ERROR      1.2s     │
│     └─ 401 Unauthorized — Azure CLI token expired            │
│     [🔄 Retry]  [🔑 Re-authenticate]                        │
└──────────────────────────────────────────────────────────────┘
```

- Parse common CRM error patterns (401 → auth, 404 → not found, 429 → rate limit)
- Show actionable recovery buttons (retry, re-auth, etc.)
- Feed error state to the source node (`status: 'error'`)

---

## 7. STATE_DELTA Contract

The `STATE_DELTA` event is the bridge between tool results and the Research Canvas. Here's the contract for how deep-merge works in `useAgUiTransport`.

### 7.1 Current Problem

The current handler does a shallow spread:
```typescript
case 'STATE_DELTA':
  setState((prev) => ({ ...prev, ...d as Partial<SalesAgentState> }));
```

This works for top-level fields (`status`, `progress`) but **fails for nested paths** like `sources.milestones`. A delta of `{ sources: { milestones: { status: 'loaded' } } }` would replace the entire `sources` object, wiping out other source nodes.

### 7.2 Fix: Deep Merge for STATE_DELTA

Replace shallow spread with a path-aware deep merge:

```typescript
case 'STATE_DELTA': {
  setState((prev) => deepMergeState(prev, d as Record<string, unknown>));
  break;
}

function deepMergeState(target: SalesAgentState, delta: Record<string, unknown>): SalesAgentState {
  const result = { ...target };
  for (const [key, value] of Object.entries(delta)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && key in result) {
      const existing = (result as Record<string, unknown>)[key];
      if (existing && typeof existing === 'object' && !Array.isArray(existing)) {
        (result as Record<string, unknown>)[key] = deepMergeState(
          existing as SalesAgentState,
          value as Record<string, unknown>,
        );
        continue;
      }
    }
    (result as Record<string, unknown>)[key] = value;
  }
  return result;
}
```

### 7.3 Delta Payload Examples

**Source node loading:**
```json
{
  "sources": {
    "milestones": {
      "status": "loading",
      "count": 0,
      "records": [],
      "signals": []
    }
  }
}
```

**Source node loaded:**
```json
{
  "sources": {
    "milestones": {
      "status": "loaded",
      "count": 4,
      "records": [
        { "msp_engagementmilestoneid": "...", "msp_name": "Azure Migration", ... }
      ],
      "signals": ["2 milestones at risk", "Monthly use declining"]
    }
  }
}
```

**Correlation update (from agent TEXT_MESSAGE analysis):**
```json
{
  "correlations": {
    "riskLevel": "medium",
    "momentum": "declining",
    "signals": [
      { "source": "emails", "target": "milestones", "text": "procurement delay", "confidence": 0.85 }
    ]
  }
}
```

---

## 8. Implementation Order

Prioritized by unblocking impact:

| Phase | Task | Files | Unblocks |
|-------|------|-------|----------|
| **P0** | Fix `toolName` on TOOL_CALL_END | `copilot-handlers.ts` | Tool names visible in UI |
| **P0** | Compute `durationMs` | `copilot-handlers.ts` | Timing metrics |
| **P0** | Deep merge for STATE_DELTA | `useAgUiTransport.ts` | All source node updates |
| **P1** | Emit STATE_DELTA on tool start/complete | `copilot-handlers.ts`, new `tool-result-router.ts` | ResearchCanvas goes live |
| **P1** | ToolResultView formatter component | new `ToolResultView.tsx` | Structured results in chat |
| **P1** | Milestone/Task/Opp table formatters | new formatter components | Readable inline data |
| **P2** | Diff preview on INTERRUPT | `copilot-handlers.ts` | Approval card shows changes |
| **P2** | Error surface in tool calls | `ToolCallLog.tsx`, `SourceNode.tsx` | Actionable error recovery |
| **P2** | WorkIQ scope detection | `tool-result-router.ts` | M365 source nodes |
| **P3** | Cost trend chart | new chart component | Visual trend data |
| **P3** | Timeline view | new timeline component | Chronological milestone view |
| **P3** | Tool performance footer | `ToolCallLog.tsx` | Run-level metrics |

---

## 9. Testing Strategy

### Unit Tests

- `tool-result-router.test.ts` — verify tool → source node mapping for every MCP tool
- `deepMergeState.test.ts` — verify nested merges, array replacement, no mutation
- `detectWorkIqScope.test.ts` — scope detection heuristics
- `detectResultKind.test.ts` — tool name → result kind classification

### Integration Tests

- Full flow: `copilot:run` → SDK event simulation → verify STATE_DELTA emitted → verify useAgUiTransport state updated → verify ResearchCanvas renders nodes
- Approval flow: simulate INTERRUPT → verify diffPreview populated → approve → verify STATE_DELTA clears interrupt

### Visual Regression

- ToolResultView renders correctly for each result kind
- SourceNode transitions through all status states
- ApprovalCard with populated diff table

---

## 10. Open Questions

1. **Chart library choice:** `view_opportunity_cost_trend` returns `CostTrendData` with `renderHints.defaultChart: 'line'`. Should we use a lightweight lib (e.g., `recharts`, `lightweight-charts`) or render as an ASCII/table fallback?

2. **WorkIQ result schema:** The `ask_work_iq` response format is not yet defined in the spec. What structure do we get back — array of items with metadata, or a narrative summary? This affects whether we can populate source nodes with counts.

3. **Real-time correlation:** Should the correlation engine run in the main process (extracting signals from tool results as they arrive) or defer to the agent's reasoning (agent emits STATE_DELTA with correlations as part of its analysis)?

4. **Queued tool state:** The spec wireframe shows "queued" tools (grey, not yet started). The SDK doesn't expose a tool execution plan. Options: (a) the agent declares planned tools via STATE_DELTA, (b) infer from skill definition, (c) drop the queued state.
