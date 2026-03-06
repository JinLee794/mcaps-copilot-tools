# MSX Role — Shared Runtime Reference

> Referenced by all MSX role skills (CSA, CSAM, SE, Specialist). Single source of truth for definitions, available tools, and shared operational patterns.

## Shared Definitions

- **Opportunity**: customer engagement container aligned to MCEM stages.
- **Milestone**: execution unit for commitment, delivery, and usage/consumption outcomes.
- **Uncommitted**: still shaping; not fully resourced for delivery.
- **Committed**: customer agreement + internal readiness for execution.

## Runtime Contract (current server behavior)

### Read tools (live)

`crm_auth_status`, `crm_whoami`, `crm_query`, `crm_get_record`, `get_my_active_opportunities`, `list_opportunities`, `list_accounts_by_tpid`, `get_milestones`, `get_milestone_activities`, `find_milestones_needing_tasks`, `get_task_status_options`.

### Write-intent tools (staged execution)

`create_task`, `update_task`, `close_task`, `update_milestone` — these tools **stage** operations for human-in-the-loop review. They do NOT execute immediately. Staged operations expire after 10 minutes.

### Approval queue tools (live)

`list_pending_operations`, `execute_operation`, `execute_all`, `cancel_operation`, `cancel_all` — review, approve, or reject staged write operations.

### Visualization tools (live)

`view_milestone_timeline`, `view_opportunity_cost_trend`, `view_staged_changes_diff`.

### Write gate

Follow `.github/instructions/msx-role-and-write-gate.instructions.md` for mandatory human confirmation before executing staged operations.

## Upfront Scoping Pattern (minimize context expansion)

Collect relevant scope in as few calls as possible before branching into per-milestone workflows:

1. `get_my_active_opportunities()` — one call returns all active opps with customer names (use `customerKeyword` to narrow).
2. `get_milestones({ opportunityId })` — scoped to one opportunity. For filtered/multi-opportunity lookups, use `crm_query` with `entitySet: "msp_engagementmilestones"` and `$filter`/`$select`/`$top`.
3. Only call `get_milestone_activities(milestoneId)` for specific milestones needing investigation. Use `get_milestone_activities({ milestoneIds: [...] })` for batch retrieval.
4. Use `find_milestones_needing_tasks({ customerKeywords: [...] })` for multi-customer task gap analysis in one call.
5. Reserve `crm_query` for ad-hoc OData needs not covered by structured tools.

**Important**: `get_milestones` supports only simple lookups by `milestoneId`, `milestoneNumber`, `opportunityId`, `ownerId`, or `mine: true`. It does NOT support `statusFilter`, `format`, `taskFilter`, or `opportunityIds` (plural). Use `crm_query` for these.

## agent365 MCP Companion (M365 retrieval)

- Use `outlook-local` MCP tools for email search evidence not modeled in CRM entities.
- Use `teams-local` MCP tools for Teams-specific queries (chats, channels, messages) — routed via the **TeamsTracker** agent.
- Use `outlook-local` MCP calendar tools (`outlook_search_calendar`) for the user's own calendar/meeting queries (meeting search, own availability analysis).
- Use `agent365-calendartools` MCP tools (`GetSchedule`, `FindMeetingTimes`) for multi-person availability lookups and group meeting scheduling (requires Microsoft Graph).
- Primary M365 sources: Teams chats/channels, meetings/transcripts, Outlook email/calendar, SharePoint/OneDrive docs.
- CRM tools answer ownership/status/execution integrity.
- agent365 tools answer discussion history, decision rationale, and document/meeting evidence.
- For email search, use `outlook-local` MCP (Outlook COM) — zero rate limits, returns full email bodies, no auth token issues.
