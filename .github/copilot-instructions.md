# Copilot Instructions for MSX Helper MCP

## Intent (Resolve First)

Before role mapping, tool selection, or any operational workflow, resolve against the overarching intent defined in `.github/instructions/intent.instructions.md`.

The agent's primary purpose is to **enhance cross-role communication and strategic alignment** for account teams. MSX is one medium — not the mission. Every action should serve visibility, alignment, or risk awareness across roles and mediums (CRM, M365, agent memory, governance cadences).

When processing requests:
1. Apply the intent resolution order (Intent → Role → Medium → Action → Risk check).
2. Cross-reference multiple mediums when the question involves status, risk, or next steps.
3. Surface risks and communication gaps proactively, even when not explicitly asked.
4. Connect responses to strategic dimensions (pipeline health, execution integrity, customer value, cross-role coverage, risk posture) when the request touches account state.
5. Think "rooms of the house" — bring context from separated rooms together so the full value reaches the person who needs it.

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
- Treat local Node scripts as last-resort diagnostics only when MCP tooling is unavailable or explicitly requested by the user.

### CRM Read Query Scoping (Scope-Before-Retrieve)

**Never call `get_milestones` with `mine: true` (or no filters) as the first action.** This returns _all_ milestones for the user and produces massive payloads (500KB+). Always narrow scope before retrieval.

**Step 1 — Clarify intent.** Before any milestone/task/opportunity read, ask clarifying questions to narrow scope:
- Which opportunity or customer? (name or ID)
- Which milestone status? (e.g., active, at risk, overdue, completed)
- What time range? (e.g., this quarter, next 30 days)
- What information is needed? (e.g., just milestone names, tasks, dates)

**Step 2 — Use composite and batch tools first.** For common multi-customer workflows, prefer composite tools over chaining primitives:
- `find_milestones_needing_tasks({ customerKeywords: ["Stryker", "Cencora", "BD"] })` — one call replaces the entire accounts→opportunities→milestones→tasks chain.
- `list_opportunities({ customerKeyword: "Stryker" })` — resolves account names to GUIDs internally, no separate account lookup needed.
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
- ❌ Loop: `list_opportunities` per customer → `get_milestones` per opp → `get_milestone_activities` per milestone (~30 calls)
- ✅ `find_milestones_needing_tasks({ customerKeywords: ["Stryker", "Cencora", "BD"] })` (1 call)
- ✅ `crm_query({ entitySet: "msp_engagementmilestones", filter: "_msp_opportunityid_value eq '...' and msp_milestonestatus eq 861980000", top: 25 })` (filtered, efficient)
- ✅ `get_milestone_activities({ milestoneIds: ["ms1", "ms2", "ms3"] })` (1 call instead of 3)

## WorkIQ Query Scoping

- For broad WorkIQ asks (emails/meetings/chats/files/transcripts), always narrow scope before retrieval.
- Use `.github/skills/WorkIQ_Query_Scoping_SKILL.md` as the canonical execution playbook for fact mapping, clarifying questions, defaults, two-pass retrieval, and sensitivity boundaries.
- If role mapping and WorkIQ scoping both apply, resolve role first, then apply WorkIQ scoping before retrieval.

## Local Agent Memory Retrieval

- Use local structured memory at `.agent-memory/` for context recall when relevant to the user request.
- Retrieve in this order: `session` → `working` → `durable`.
- Apply hard filters before ranking when available (`scope`, `kind`, `tags`, `entities`).
- Prefer lexical retrieval first; only use semantic fallback if lexical results are weak.
- Keep retrieval context token-efficient by using limit + token budget packing.
- Promote only validated/stable `fact` or `decision` memories to `durable`; avoid promoting tentative notes.
- Do not store secrets, tokens, or credentials in agent memory.

### Vault Memory Layer (Optional)

- If `mcp-obsidian` is configured and reachable, use it as an enhanced prefetch and durable promotion tier.
- **Before CRM queries**: read the relevant `Customers/<name>.md` from the vault to get team composition, stakeholders, prior findings, and open action items — then scope CRM queries with that context.
- **After CRM workflows**: promote validated findings to the vault's `## Agent Insights` section on the Customer or Project file, instead of `.agent-memory/durable/`.
- If `mcp-obsidian` is not available, fall back to `.agent-memory/` for all retrieval and promotion — no workflow breaks.
- See `.github/instructions/vault-memory-layer.instructions.md` for full detection logic, retrieval order, promotion routing, and vault conventions.

### Customer Visit Log

- The file `.agent-memory/working/customer-visit-log.json` tracks customers previously queried in CRM sessions.
- Before starting a new CRM query workflow, read this file to recall prior context (last customers visited, findings, role).
- After completing a CRM query workflow, append a new visit entry with: `timestamp`, `role`, `customers`, `intent`, `findings`, and `notes`.
- Use the `entities` array to quickly look up which customers have been visited before.
- This enables faster re-engagement: if the user asks about a previously visited customer, reference prior findings instead of re-querying from scratch.

### Memory CLI

- Use local scripts from `mcp-server` for memory operations:
	- `npm run memory:add -- --scope working --kind fact --summary "..." --content "..."`
	- `npm run memory:find -- --query "..." --scope working --limit 8 --tokenBudget 1200`
	- `npm run memory:promote -- --id <memoryId> --fromScope session`
	- `npm run memory:weekly` (weekly dry-run compaction report)
	- `npm run memory:weekly:apply` (weekly apply-mode compaction)

## Connect Hooks (Evidence Capture)

When an interaction includes measurable impact or meaningful progress within the three circles of impact
(individual contribution, team/org outcomes, customer/business value), capture Connect-relevant evidence.

Capture should be:
- Concrete and attributable (who/what/where).
- Evidence-based (numbers, outcomes, decisions, recognition).
- Stored as a durable "hook" in `.connect/hooks/hooks.md` (and optionally `hooks.jsonl`).

Do NOT store speculation. Prefer direct quotes, metrics, and links to PRs/issues/design docs.

See `.github/instructions/connect-hooks.instructions.md` for the full hook schema and formatting rules.

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