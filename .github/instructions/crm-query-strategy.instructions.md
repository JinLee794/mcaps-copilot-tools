---
description: "CRM read query scoping strategy for MSX/MCEM. Scope-Before-Retrieve pattern: VAULT-PREFETCH, composite tools, crm_query filters, get_milestones usage. Use when constructing CRM queries, milestone lookups, or opportunity scoping to avoid oversized payloads. Prevents unscoped get_milestones(mine:true) calls."
---

# CRM Query Strategy (Scope-Before-Retrieve)

**Never call `msx-crm:get_milestones` with `mine: true` (or no filters) as the first action.** This returns all milestones and produces 500KB+ payloads. Always narrow scope before retrieval.

## Step 0 — VAULT-PREFETCH (mandatory when OIL is available)

Before asking scoping questions or calling any CRM tool:

1. Call `oil:get_vault_context()` to confirm vault availability and get the vault map.
2. If customer is named/inferable, call `oil:get_customer_context({ customer: "<Name>" })` — returns opportunities with GUIDs, team, action items.
3. For CRM-ready OData filters, use `oil:prepare_crm_prefetch({ customers: ["<Name>"] })`.
4. If vault has opportunity GUIDs, **skip Step 1** and go directly to Step 2/3 with vault-provided IDs.
5. If OIL unavailable or customer has no vault file, fall through to Step 1.

Do NOT skip this step when OIL is available. The vault is the primary source for customer→opportunity ID mapping.

## Step 1 — Clarify Intent (if vault didn't resolve scope)

Ask clarifying questions:
- Which opportunity or customer? (name or ID)
- Which milestone status? (active, at risk, overdue, completed)
- What time range? (this quarter, next 30 days)
- What information is needed? (milestone names, tasks, dates)

## Step 2 — Composite and Batch Tools First

Prefer composite tools over chaining primitives:
- `msx-crm:find_milestones_needing_tasks({ customerKeywords: [...] })` — one call replaces the accounts→opportunities→milestones→tasks chain.
- `msx-crm:list_opportunities({ customerKeyword: "..." })` — resolves account names to GUIDs internally.
- `msx-crm:get_milestone_activities({ milestoneIds: [...] })` — batch task retrieval grouped by milestone.

## Step 3 — crm_query for Filtered Lookups

Preferred tool for milestone queries needing filtering. See `crm-entity-schema.instructions.md` for full schema.

- Entity set: `msp_engagementmilestones` (NOT `msp_milestones` or `msp_milestoneses`)
- Use `$filter` for status, date range, opportunity, or owner
- Use `$select` for only needed fields (avoid full-record payloads)
- Use `$top` to limit results (default 10–25)
- Use `$orderby` for date/status relevance
- Multi-opportunity: OData `or` in `$filter` (`_msp_opportunityid_value eq '<GUID1>' or _msp_opportunityid_value eq '<GUID2>'`)
- Status filtering: `msp_milestonestatus eq 861980000` (On Track), `ne 861980003` (exclude Completed)

## Step 4 — get_milestones for Simple Single-Entity Lookups

Use only for:
- By `milestoneId` or `milestoneNumber` (single record)
- By `opportunityId` (singular — scoped to one opportunity)
- By `ownerId` (scoped to one owner)
- `mine: true` only after user explicitly wants all their milestones

`get_milestones` does NOT support: `opportunityIds` (plural), `statusFilter`, `taskFilter`, or `format`. Use `crm_query` instead.

## Step 5 — Drill Down Incrementally

For "which milestones need tasks":
1. Prefer `msx-crm:find_milestones_needing_tasks` for full chain.
2. Or `msx-crm:crm_query` with `entitySet: "msp_engagementmilestones"` and filters.
3. `msx-crm:get_milestone_activities({ milestoneIds: [...] })` for batch task detail.
4. Do not call `get_milestone_activities` one milestone at a time in a loop.

## Good vs Bad Patterns

| Pattern | Status |
|---|---|
| `get_milestones(mine: true)` → "which ones need attention?" | ❌ Unscoped |
| `get_milestones({ opportunityIds: [...], statusFilter: "active" })` | ❌ Params don't exist |
| `crm_query({ entitySet: "msp_milestones" })` | ❌ Wrong entity set |
| `crm_query` with `msp_forecastedconsumptionrecurring` | ❌ Field doesn't exist |
| `crm_query` with `msp_estimatedcompletiondate` | ❌ Use `msp_milestonedate` |
| Loop: list_opportunities per customer → get_milestones per opp → get_milestone_activities per ms | ❌ ~30 calls |
| Skipping vault when OIL is available | ❌ Wastes API calls |
| `oil:get_customer_context("Contoso")` → use GUID → `crm_query` with filter | ✅ Vault-first (2 calls) |
| `oil:prepare_crm_prefetch({ customers: [...] })` → paste into `crm_query` | ✅ CRM-ready prefetch |
| `find_milestones_needing_tasks({ customerKeywords: [...] })` | ✅ 1 call |
| `crm_query` with proper `$filter`/`$select`/`$top` | ✅ Filtered, efficient |
| `get_milestone_activities({ milestoneIds: ["ms1","ms2","ms3"] })` | ✅ Batch (1 call) |
