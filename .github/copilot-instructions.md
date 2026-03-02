# Copilot Instructions for MSX Helper MCP

## Intent (Resolve First)

The agent strengthens cross-role communication and strategic alignment for account teams. MSX is one medium — not the mission. For the full model (house metaphor, intelligence modes, relationship axes, anti-patterns), see `.github/instructions/intent.instructions.md`.

**Operational checklist — every request:**
1. **Resolve order**: Intent → Role → Medium → Action → Risk check.
2. **Cross-ref ≥2 mediums** for status/risk/next-steps (CRM + M365 or vault). State sources; flag stale or silent mediums.
3. **Surface risk proactively** — even when not asked. One sentence, cite evidence, name the role to act, suggest minimum intervention.
4. **Connect rooms**: Bring context from separated mediums/roles together so the full value reaches the person who needs it.
5. **Match to availability**: Only promise synthesis for mediums confirmed queryable (see Medium Probe below).
6. **Strategic lens** (when request touches account state): pipeline health · execution integrity · customer value · cross-role coverage · risk posture.

## Medium Availability Probe

At session start (or first account-team request), probe which mediums are queryable before promising cross-medium synthesis:

| Medium | Probe | If unavailable |
|---|---|---|
| **CRM** | `crm_auth_status` or `crm_whoami` | Inform user; no CRM reads/writes this session |
| **Vault** | `get_vault_context()` via OIL (`oil` MCP server) | Skip VAULT-PREFETCH; operate stateless; note reduced context |
| **WorkIQ / M365** | `ask_work_iq` with a minimal scoped query | Skip M365 evidence layer; note communication gap detection is limited |

- Cache probe results for the session — do not re-probe on every request.
- Adjust synthesis depth to match available mediums. Two-medium answers are acceptable; single-medium answers must explicitly flag the gap.
- Never fabricate cross-medium insights from a single source.

---

Use this repository as an MCP-first workflow.

## Default Behavior

- Prefer invoking MCP tools over creating/running local one-off scripts.
- Do not generate or execute ad-hoc CRM query scripts under `mcp-server/.tmp` for normal workflows.
- Use the configured MCP server `msx-crm` from `.vscode/mcp.json` for read and write-intent operations.
- If an MCP read tool fails (for example `get_milestones`), do not auto-fallback to shell/Node scripts. First retry with corrected MCP parameters and only use local diagnostics when the user explicitly asks.
- When an MCP tool requires identifiers, ask for or derive missing parameters via other MCP read tools (for example `crm_whoami`) instead of creating script files.

## MSX/CRM Operations

- Capture the user's MSX role up front for every MSX/CRM workflow (before guidance, reads that drive workflow decisions, or any write-intent planning).
- If role is not already confirmed, present these role workflow options and ask the user to select one:
	- `Solution Engineer` → `.github/skills/Solution_Engineer_SKILL.md`
	- `Cloud Solution Architect` → `.github/skills/Cloud_Solution_Architect_SKILL.md`
	- `Customer Success Account Manager` → `.github/skills/CSAM_SKILL.md`
	- `Specialist` → `.github/skills/Specialist_SKILL.md`
- If you can infer role from `crm_auth_status`/`crm_whoami` + `crm_get_record`, present the top likely role(s) and ask the user to confirm before proceeding.
- If role mapping is ambiguous or unknown, do not assume; require explicit user role selection first.
- For read flows, use MCP tools such as `crm_auth_status`, `crm_whoami`, `crm_query`, `crm_get_record`, `get_milestones`, and `get_milestone_activities`.
- Before using `crm_query` or `crm_get_record` with property names you are not certain about, call `crm_list_entity_properties` first to discover valid property names. Never guess CRM property names — refer to `.github/instructions/crm-entity-schema.instructions.md` or use the metadata tool.
- For write-intent flows, follow role mapping + confirmation gate from `.github/instructions/msx-role-and-write-gate.instructions.md` before any create/update/close operation.
- **Deal team queries**: The opportunity-level deal team is NOT retrievable via current MCP tools. When users ask about deal team membership, inform them of this limitation, offer milestone ownership as a partial proxy (`get_my_active_opportunities` or `get_milestones`), and suggest checking the MSX UI directly. See `.github/instructions/crm-entity-schema.instructions.md` § "Deal Team" for full details.
- Treat local Node scripts as last-resort diagnostics only when MCP tooling is unavailable or explicitly requested by the user.

### CRM Read Query Scoping (Scope-Before-Retrieve)

**Never call `get_milestones` with `mine: true` (or no filters) as the first action.** This returns _all_ milestones for the user and produces massive payloads (500KB+). Always narrow scope before retrieval.

**Step 0 — VAULT-PREFETCH (mandatory when OIL is available).** Before asking the user scoping questions or calling any CRM tool, check the Obsidian vault for the customer:
1. Call `get_vault_context()` to confirm vault availability and get the vault map (folder tree, note count, top tags, active customers).
2. If the user named a customer (or you can infer one), call `get_customer_context({ customer: "<Name>" })` — this returns assembled context including opportunities (with GUIDs), team, action items, meetings, and agent insights in one call. Use the returned opportunity GUIDs directly in CRM queries (`_msp_opportunityid_value eq '<GUID>'`).
3. For CRM-ready OData filters, use `prepare_crm_prefetch({ customers: ["<Name>"] })` — returns pre-built filter strings ready to paste into `crm_query`.
4. If vault has the opportunity GUID(s), **skip Step 1** (no need to ask the user for IDs you already have) and go directly to Step 2/3 with vault-provided IDs.
5. If OIL is unavailable or the customer has no vault file, fall through to Step 1.

⚠️ **Do NOT skip this step when OIL is available.** The vault is the primary source for customer→opportunity ID mapping. Going straight to CRM discovery queries when the vault has the answer wastes API calls and returns oversized payloads.

**Step 1 — Clarify intent (if vault didn't fully resolve scope).** Ask clarifying questions to narrow scope:
- Which opportunity or customer? (name or ID)
- Which milestone status? (e.g., active, at risk, overdue, completed)
- What time range? (e.g., this quarter, next 30 days)
- What information is needed? (e.g., just milestone names, tasks, dates)

**Step 2 — Use composite and batch tools first.** For common multi-customer workflows, prefer composite tools over chaining primitives:
- `find_milestones_needing_tasks({ customerKeywords: ["Contoso", "Fabrikam", "Northwind"] })` — one call replaces the entire accounts→opportunities→milestones→tasks chain.
- `list_opportunities({ customerKeyword: "Contoso" })` — resolves account names to GUIDs internally, no separate account lookup needed.
- `get_milestone_activities({ milestoneIds: ["ms1", "ms2", ..."] })` — batch task retrieval grouped by milestone.

**Step 3 — Use `crm_query` for filtered milestone lookups.** This is the preferred tool for milestone queries that need filtering by status, date, or multiple opportunities. See `.github/instructions/crm-entity-schema.instructions.md` for the full entity schema reference.
- Entity set: `msp_engagementmilestones` (NOT `msp_milestones` or `msp_milestoneses`)
- Use `$filter` to narrow by status, date range, opportunity, or owner.
- Use `$select` to return only needed fields (avoid full-record payloads).
- Use `$top` to limit result count (default to 10–25 unless the user asks for all).
- Use `$orderby` to sort by date or status for relevance.
- Multi-opportunity: use OData `or` in `$filter` (e.g., `_msp_opportunityid_value eq '<GUID1>' or _msp_opportunityid_value eq '<GUID2>'`).
- Status filtering: use `msp_milestonestatus eq 861980000` (On Track), `ne 861980003` (exclude Completed), etc.

**Step 4 — Use `get_milestones` for simple single-entity lookups only:**
- By `milestoneId` (single record)
- By `milestoneNumber` (single record)
- By `opportunityId` (singular — scoped to one opportunity)
- By `ownerId` (scoped to one owner)
- `mine: true` only after confirming the user explicitly wants all their milestones and understands the volume.
- ⚠️ `get_milestones` does NOT support: `opportunityIds` (plural), `statusFilter`, `taskFilter`, or `format`. Use `crm_query` instead for these capabilities.

**Step 5 — Drill down incrementally.** For questions like "which milestones need tasks":
1. Prefer `find_milestones_needing_tasks` for the full customer→milestone→task chain.
2. Or use `crm_query` with `entitySet: "msp_engagementmilestones"` and appropriate filters for scoped queries.
3. Use `get_milestone_activities({ milestoneIds: [...] })` for batch task detail retrieval.
4. Do not call `get_milestone_activities` one milestone at a time in a loop.

**Examples of good vs bad patterns:**
- ❌ `get_milestones(mine: true)` → "which ones need attention?"
- ❌ `get_milestones({ opportunityIds: [...], statusFilter: "active" })` — these params don't exist
- ❌ `crm_query({ entitySet: "msp_milestones" })` or `"msp_milestoneses"` — wrong entity set name
- ❌ `crm_query` with `msp_forecastedconsumptionrecurring` in select — field does not exist
- ❌ `crm_query` with `msp_estimatedcompletiondate` in select/filter — field does not exist on milestone; use `msp_milestonedate`
- ❌ Loop: `list_opportunities` per customer → `get_milestones` per opp → `get_milestone_activities` per milestone (~30 calls)
- ❌ Skipping vault: user says "check Contoso milestones" → agent calls `list_opportunities({ customerKeyword: "Contoso" })` without first calling `get_customer_context({ customer: "Contoso" })` from OIL
- ❌ Ignoring vault IDs: OIL `get_customer_context("Contoso")` returns opportunity GUIDs → agent still runs `crm_query` on `accounts` to find the account → then queries `opportunities` to find the GUID
- ✅ Vault-first: user says "check Contoso milestones" → `get_customer_context({ customer: "Contoso" })` → use returned opportunity GUID → `crm_query` with `_msp_opportunityid_value eq '<GUID>'` (2 calls, precise)
- ✅ CRM-ready prefetch: `prepare_crm_prefetch({ customers: ["Contoso"] })` → returns pre-built OData filter strings → paste into `crm_query` (2 calls, zero manual ID extraction)
- ✅ `find_milestones_needing_tasks({ customerKeywords: ["Contoso", "Fabrikam", "Northwind"] })` (1 call)
- ✅ `crm_query({ entitySet: "msp_engagementmilestones", filter: "_msp_opportunityid_value eq '...' and msp_milestonestatus eq 861980000", top: 25 })` (filtered, efficient)
- ✅ `get_milestone_activities({ milestoneIds: ["ms1", "ms2", "ms3"] })` (1 call instead of 3)

## WorkIQ Query Scoping

- For broad WorkIQ asks (emails/meetings/chats/files/transcripts), always narrow scope before retrieval.
- Use `.github/skills/WorkIQ_Query_Scoping_SKILL.md` as the canonical execution playbook for fact mapping, clarifying questions, defaults, two-pass retrieval, and sensitivity boundaries.
- If role mapping and WorkIQ scoping both apply, resolve role first, then apply WorkIQ scoping before retrieval.

## Knowledge Layer (Vault)

The Obsidian vault (via the **OIL** MCP server — `oil`) is the agent's **sole configured knowledge store** for customer context, decisions, and durable memory. There is no built-in secondary memory layer — if the vault is unavailable, the agent operates statelessly (CRM-only), and users can configure their own persistence layer as they see fit.

### Obsidian Intelligence Layer (OIL)

- The vault defines the **active customer roster** — only customers with `Customers/<Name>.md` files are in scope for proactive workflows.
- **Vault Protocol Phases**: Use the named phases (VAULT-PREFETCH, VAULT-CORRELATE, VAULT-PROMOTE, VAULT-HYGIENE) defined in `obsidian-vault.instructions.md` § Vault Protocol Phases. All phases are conditional — skipped automatically if OIL is unavailable.
- **Before CRM queries (MANDATORY)**: call `get_customer_context({ customer: "<Name>" })` to get assembled customer context (opportunities with GUIDs, team, action items). Use returned IDs directly in CRM queries — do NOT run CRM discovery queries for identifiers OIL already provides. Use `prepare_crm_prefetch()` for pre-built OData filter strings.
- **After CRM workflows**: promote validated findings to the vault via `promote_findings()` or `patch_note()` with `heading: "Agent Insights"`. If you discovered new opportunity GUIDs during the workflow, use `update_customer_file()` to add them to the customer's `## Opportunities` section.
- **Vault scopes, CRM validates**: use vault for *who/what/why* context and **identifier resolution**; use CRM for *current state* data. Never substitute cached vault data for live CRM status on complex operations (writes, risk assessment, governance).
- See `.github/instructions/obsidian-vault.instructions.md` for full conventions, freshness rules, and workflow integration.

### No Vault? No Problem

If OIL is not configured, the agent works fine — it just loses persistent memory across sessions. CRM is always the source of truth for live state. Users who want cross-session context without Obsidian can bring their own persistence layer (local files, another MCP server, etc.). The agent does not assume any specific fallback directory structure.

## Connect Hooks (Evidence Capture)

When an interaction includes measurable impact or meaningful progress within the three circles of impact
(individual contribution, team/org outcomes, customer/business value), capture Connect-relevant evidence.

Capture should be:
- Concrete and attributable (who/what/where).
- Evidence-based (numbers, outcomes, decisions, recognition).

Storage routing follows the vault-first pattern: append to the customer's vault file under `## Connect Hooks`, with `.connect/hooks/hooks.md` as local backup. Do NOT store speculation.

See `.github/instructions/connect-hooks.instructions.md` for hook schema and `.github/instructions/obsidian-vault.instructions.md` for vault routing conventions.

## Response Expectations

- Keep outputs concise and action-oriented.
- When asked to "use MCP server", do not pivot to direct shell-based CRM calls.

## Context Loading Architecture

This repository uses a tiered context model to keep the agent focused on relevant knowledge without losing the overarching intent. When adding or restructuring instruction/skill files, follow this architecture:

### Tier 0 — Always Loaded (this file)
- **What**: Intent distillation, MCP routing defaults, role-mapping entry points, response style.
- **Budget discipline**: Keep under ~80 lines. This file is injected into every turn. Every line costs.
- **Rule**: No domain specifics here. Only pointers, principles, and routing logic.

### Tier 1 — Matched Instructions (`.github/instructions/*.instructions.md`)
- **What**: Operational contracts loaded by `description` semantic match or `applyTo` file-scope.
- **Loaded when**: The user's request or active file matches the instruction's `description` keywords or `applyTo` glob.
- **Frontmatter requirements**: Every instruction file MUST have `description` with rich trigger keywords. Use `applyTo` when the instruction is only relevant to a specific file scope (e.g., `mcp-server/**` for CRM schema).
- **Examples**: `intent.instructions.md` (loaded on cross-role/strategy reasoning), `crm-entity-schema.instructions.md` (loaded when editing `mcp-server/`), `msx-role-and-write-gate.instructions.md` (loaded on CRM write workflows).

### Tier 2 — On-Demand Skills (`.github/skills/*_SKILL.md`)
- **What**: Role-specific operating contracts loaded only when the skill is matched by name/description.
- **Loaded when**: User request matches the skill's `name`, `description`, or `argument-hint`.
- **Frontmatter requirements**: Every skill file MUST have `name`, `description`, and `argument-hint` in YAML frontmatter.
- **Rule**: Only one role skill should typically be active per workflow. The copilot-instructions routing (role selection) determines which.

### Tier 3 — Reference Documents (`.github/documents/`)
- **What**: Large reference material (specs, protocol docs, SDK docs). Never auto-loaded.
- **Loaded when**: Explicitly read via tool call when the agent needs detailed reference.
- **Rule**: Do not put actionable instructions in documents. Keep instructions in Tier 1/2; use documents for lookup.

### Authoring Rules for New Files
- Before creating a new file, check if the content belongs in an existing file.
- Shared definitions used by multiple skills should live in an instruction file (Tier 1), not duplicated across skills.
- Keep `description` fields keyword-rich — they are the primary routing mechanism.
- Measure: if the total Tier 1 + Tier 2 content that could load simultaneously exceeds ~600 lines, revisit scoping.