---
description: "Obsidian vault integration — local knowledge layer, customer roster, durable storage, CRM prefetch context, Connect hook routing. Use when reasoning about vault reads, customer defaults, durable memory, Obsidian notes, OIL tools, customer roster filtering, vault-first storage, or cross-medium context assembly."
---

# Obsidian Vault — Local Knowledge Layer

The Obsidian vault is the agent's **primary local knowledge store** — personal notes, customer context, durable memory, and known defaults. It is NOT optional scaffolding; it is the lens through which CRM data is scoped and interpreted.

MSX/CRM is the **authoritative system of record** for live state (milestones, opportunities, pipeline). The vault provides the *context* that makes CRM data meaningful: which customers matter, what was discussed, what decisions were made, what the agent should focus on.

## Core Principles

1. **Vault defines scope; CRM provides fresh state.** The vault tells the agent *who* and *what* to care about. CRM tells the agent *where things stand right now*.
2. **Vault-listed customers are the active roster.** If a customer does not have a `Customers/<Name>.md` file in the vault, treat it as out-of-scope for proactive workflows. Past/completed/limbo opportunities for un-tracked customers should be ignored unless the user explicitly asks.
3. **CRM data is always retrieved fresh for complex operations.** Even if the vault has cached findings, milestone/opportunity status must be validated from CRM when the workflow involves writes, risk assessment, governance reporting, or cross-customer analysis.
4. **Vault is the durable storage layer.** Validated findings, decisions, Connect hooks, and agent insights are persisted to the vault. Without the vault, the agent operates statelessly — durable memory requires Obsidian or a user-configured persistence layer.

## Vault Structure Conventions

```
Customers/
  <CustomerName>.md       # One file per actively-tracked customer
People/
  <Full Name>.md          # Contact/stakeholder notes (internal, customer, partner)
Projects/
  <ProjectName>.md        # Cross-customer or internal projects
Meetings/
  <YYYY-MM-DD> - <Title>.md  # Meeting notes, organized by date
Daily/
  <YYYY-MM-DD>.md         # Daily notes (optional)
Weekly/
  <YYYY>-W<XX>.md         # Weekly digest summaries
Templates/
  ...                     # Note templates
```

### Frontmatter Conventions

All note types use YAML frontmatter for structured retrieval via `query_notes` or `search_vault`. Consistent keys enable cross-note queries.

| Key | Used In | Type | Purpose |
|---|---|---|---|
| `tags` | All | `string[]` | Note type classification (`meeting`, `people`, `project`, `customer`, `weekly-digest`) |
| `date` | Meetings, Weekly, Daily | `string` | ISO date (`YYYY-MM-DD`) |
| `customer` | Meetings, Projects | `string` | Customer name — must match a `Customers/` filename |
| `project` | Meetings | `string` | Project name — must match a `Projects/` filename |
| `status` | Meetings, Projects | `string` | `open` / `closed` / `active` / `completed` |
| `action_owners` | Meetings | `string[]` | People with outstanding action items |
| `company` | People | `string` | Organization the person belongs to |
| `org` | People | `string` | `internal` / `customer` / `partner` |
| `customers` | People | `string[]` | Customer accounts they're associated with |

### Customer File Anatomy (`Customers/<Name>.md`)

Each customer file is the single source of local truth for that customer. Sections are additive — create them as content arrives, don't pre-populate empty headings.

| Section | Purpose |
|---|---|
| `# <CustomerName>` | Header — customer name |
| `## Team` | Account team members, roles, stakeholder contacts |
| `## Opportunities` | **Active opportunity names AND GUIDs** (`opportunityid: <GUID>`). This is the primary bridge from customer name → MSX identifiers. Always include the GUID so VAULT-PREFETCH can inject it directly into CRM queries. |
| `## Milestones` | Milestone-level notes, commitments, context not in CRM. Include milestone IDs/numbers when known for direct lookup. |
| `## Agent Insights` | Validated findings promoted from working memory |
| `## Connect Hooks` | Evidence capture entries (see Connect Hooks schema) |
| `## Notes` | Free-form meeting notes, decisions, observations |

**ID Storage Rule**: When the agent discovers MSX identifiers during a CRM workflow (opportunity GUIDs, account IDs, TPIDs, milestone numbers), it MUST write them back to the customer file so future VAULT-PREFETCH steps can use them directly. An opportunity entry without a GUID is incomplete.

### OIL Tool Reference

The vault is managed by the **Obsidian Intelligence Layer (OIL)** MCP server (`oil`). OIL provides 22 domain-specific tools organized into four categories:

#### Orient (read-only context)

| Operation | Tool | Key Parameters |
|---|---|---|
| Vault map & health | `get_vault_context` | *(none)* — returns folder tree, note count, top tags, active customers. **Call first in any new session.** |
| Customer context | `get_customer_context` | `customer` — returns assembled context: opportunities (with GUIDs), team, meetings, action items, insights |
| Person context | `get_person_context` | `person` — returns person profile, customer associations, org type, linked notes |
| Graph traversal | `query_graph` | `path`, `direction`, `depth`, `filter` — backlinks, forward links, N-hop neighborhood |
| People→Customer batch | `resolve_people_to_customers` | `people` array — batch-resolves person names to customer associations |

#### Retrieve (search/query)

| Operation | Tool | Key Parameters |
|---|---|---|
| Unified search | `search_vault` | `query` — 3-tier search: lexical → fuzzy → semantic. Ranked results with scores |
| Frontmatter query | `query_notes` | `where`, `and`, `or`, `order_by`, `limit` — SQL-like frontmatter query |
| Find similar | `find_similar_notes` | `path` or `text` — similarity by tags or semantic embeddings |

#### Write (gated modifications)

| Operation | Tool | Gate | Key Parameters |
|---|---|---|---|
| Append to section | `patch_note` | Auto / Gated | `path`, `heading`, `content`, `operation` — auto-confirmed for "Agent Insights", "Connect Hooks" |
| Connect evidence | `capture_connect_hook` | Auto | `customer`, `hook` — appends to customer file + backup |
| Audit trail | `log_agent_action` | Auto | `action`, `detail` — writes to `_agent-log/` |
| Meeting note | `draft_meeting_note` | Gated | `customer`, `date`, `attendees` — generates from template |
| Update customer | `update_customer_file` | Gated | `customer`, `section`, `content` — proposes frontmatter/section changes |
| Create customer | `create_customer_file` | Gated | `customer` — scaffolds new customer file |
| Write note | `write_note` | Gated | `path`, `content` — low-level write, always gated |
| Batch tags | `apply_tags` | Gated | `paths`, `action`, `tags` — batch tag add/remove |
| Manage pending | `manage_pending_writes` | — | `action` — list, confirm, or reject queued writes |

#### Composite (multi-step workflows)

| Operation | Tool | Key Parameters |
|---|---|---|
| CRM prefetch | `prepare_crm_prefetch` | `customers` array — extracts GUIDs/TPIDs and returns pre-built OData filter strings |
| Entity correlation | `correlate_with_vault` | `entities` — batch-resolves external entities (people, meetings) against vault notes |
| Promote findings | `promote_findings` | `findings` array — batch-promotes validated findings to customer files |
| Vault health | `check_vault_health` | *(none)* — surfaces stale insights, missing IDs, incomplete sections, orphaned notes |
| Drift report | `get_drift_report` | *(none)* — compares vault snapshots against expected CRM state |

## Vault Protocol Phases

Skills reference these phases by name (e.g., "run VAULT-PREFETCH") instead of duplicating vault logic. Each phase includes an **availability guard** — if OIL is unreachable, the phase is skipped gracefully and the workflow continues with fallback behavior.

### Availability Guard (all phases)

Before executing any vault phase:
1. Attempt `get_vault_context()` — this returns the vault map (folder tree, note count, top tags, active customers).
2. If reachable → proceed with the phase.
3. If unreachable → skip the phase, apply the phase-specific fallback, and continue the workflow without breaking.

Cache the availability result for the duration of the current workflow — do not re-check on every phase invocation within the same turn.

### VAULT-PREFETCH

**When**: Before any CRM query or multi-customer workflow. **This is mandatory when OIL is available** — do not skip it in favor of going directly to CRM tools.
**Purpose**: Resolve customer→MSX identifiers from vault notes so CRM queries use precise IDs instead of broad discovery.

Steps:
1. Run availability guard.
2. Call `get_vault_context()` to identify the active customer roster.
3. If targeting a specific customer, call `get_customer_context({ customer: "<Name>" })` — this returns assembled context in one call:
   - **Opportunity GUIDs** (e.g., `opportunityid: 00000000-0000-0000-0000-000000000000`). These go directly into CRM `$filter` expressions (`_msp_opportunityid_value eq '<GUID>'`).
   - **Account TPID / Account ID** — use for account-scoped CRM filters.
   - **Milestone IDs or numbers** if previously recorded.
   - **Team composition** — identifies relevant owners for `_ownerid_value` filters.
   - **Prior Agent Insights** — avoid re-running queries for already-validated findings.
4. For CRM-ready OData filters, use `prepare_crm_prefetch({ customers: ["<Name>"] })` — returns pre-built filter strings ready to paste into `crm_query`.
5. For multi-customer workflows, call `prepare_crm_prefetch({ customers: ["Contoso", "Fabrikam", ...] })` to collect all relevant IDs in one pass.

**Critical rule**: If the vault has the opportunity GUID for a customer, use it directly. Do NOT call `list_opportunities({ customerKeyword })` or `crm_query` on `accounts` to rediscover an ID the vault already provides.

**Skip when**: User provides an explicit opportunity/milestone ID, or asks to search beyond tracked customers.
**Fallback (no vault)**: Ask user for customer names, or use `crm_whoami` + `get_my_active_opportunities()` for scope.

### VAULT-CORRELATE

**When**: After retrieving M365/WorkIQ evidence or CRM data that may relate to existing vault notes (meetings, decisions, action items).
**Purpose**: Cross-reference retrieved activities with vault notes for richer context, and resolve people/entities to customer associations.

Steps:
1. Run availability guard.
2. **People→Customer resolution**: Call `resolve_people_to_customers({ people: [...] })` to batch-resolve person names to customer associations. This enables attributing M365 activity (meetings, chats, emails) to specific customer accounts based on who participated.
3. For richer correlation, call `correlate_with_vault({ entities: [...] })` — batch-resolves external entities (people, meetings from M365) against vault notes with confidence scoring.
4. Search vault by customer name and date range using `query_notes` (frontmatter `customer` + `date` fields). Use resolved customer names from step 2 to target searches.
5. Surface connections: prior meeting notes, decisions, and action items that relate to the retrieved evidence.
6. Return the people→customer lookup to the calling workflow for downstream attribution (e.g., WorkIQ entity resolution, output grouping by customer).

**Date/time boundary rules**:
- Always scope vault searches to the **same date window** as the source query (e.g., if WorkIQ was scoped to today, search vault for today's date only).
- Never let vault correlation silently expand the time window — if a broader search is needed, state the expanded range explicitly to the user.
- Use ISO date format (`YYYY-MM-DD`) in all time-based vault queries.

**Skip when**: No M365/WorkIQ evidence was retrieved, or vault context wouldn't add value to the current output.
**Fallback (no vault)**: Skip correlation; present M365/CRM evidence as-is without vault enrichment.

### VAULT-PROMOTE

**When**: After completing a CRM query or write workflow with validated findings worth persisting.
**Purpose**: Persist validated findings to the vault for future context.

Steps:
1. Run availability guard.
2. Use `promote_findings()` to batch-promote validated findings to customer files. This auto-confirms for designated sections ("Agent Insights", "Connect Hooks") and gates other sections for review.
3. Include datestamp (`YYYY-MM-DD`) and brief summary of what was found or changed.
4. If no customer file exists and the customer is now actively tracked, use `create_customer_file({ customer: "<Name>" })` to scaffold it with the findings.
5. For Connect hooks: use `capture_connect_hook({ customer: "<Name>", hook: { ... } })` — this appends to the customer file and creates a backup automatically.

**Do NOT promote**: speculative, unvalidated, or redundant information.
**Fallback (no vault)**: Write to `.connect/hooks/hooks.md` only. Durable memory is not available without a configured persistence layer.

### VAULT-HYGIENE

**When**: Periodic review, governance cadence, or on-demand cleanup.
**Purpose**: Keep vault data current and aligned with CRM reality.

Steps:
1. Run availability guard.
2. Call `check_vault_health()` — this surfaces stale insights, missing IDs, incomplete sections, and orphaned notes in one call.
3. Cross-reference the vault health report with `get_my_active_opportunities()` — flag gaps (CRM customers not in vault, vault customers with no active CRM opps).
4. For deeper analysis, call `get_drift_report()` to compare vault snapshots against expected CRM state.
5. Recommend additions/removals to the user — do not auto-delete vault content.

**Skip when**: Not explicitly requested or not part of a governance cadence.
**Fallback (no vault)**: Ask the user for customer names or use `crm_whoami` context. No automatic roster approximation without a configured persistence layer.

## Workflow Integration (Detailed Reference)

> Skills should invoke the named Vault Protocol Phases above. This section provides detailed reference for the patterns underlying each phase.

### 1. CRM Query Prefetch (Vault → CRM)

**Before any CRM query workflow**, check the vault for relevant customer context:

1. Call `get_vault_context()` to identify the active customer roster.
2. If the query targets a specific customer, call `get_customer_context({ customer: "<Name>" })` to get:
   - Known opportunity names/IDs (avoids discovery queries).
   - Team composition (identifies relevant owners for filtering).
   - Prior findings and open items (avoids redundant queries).
3. For CRM-ready filters, use `prepare_crm_prefetch({ customers: ["<Name>"] })` to get pre-built OData filter strings.

**When to skip vault prefetch:**
- The user provides an explicit opportunity ID or customer name not in the vault.
- The user explicitly asks to search broadly beyond their tracked customers.

### 2. Freshness Rules (When to Use CRM vs Vault)

| Scenario | Source |
|---|---|
| "Who are my active customers?" | **Vault** (customer roster) |
| "What milestones need attention for Contoso?" | **CRM** (fresh state), vault for context |
| "What did we discuss last time about Contoso?" | **Vault** (notes, agent insights) |
| "Create a task for milestone X" | **CRM** (fresh milestone state → write) |
| "Which customers have at-risk milestones?" | **Vault** (roster) → **CRM** (filtered query) |
| "Summarize my account health" | **Vault** (roster + context) → **CRM** (fresh state per customer) |
| "What's the status of opportunity Y?" | **CRM** (always fresh for status) |

**Rule of thumb:** Use vault for *who/what/why* context. Use CRM for *current state* data. When both are needed, vault scopes first, CRM validates second.

### 3. Post-Workflow Promotion (CRM → Vault)

After completing a CRM query or write workflow, promote **validated findings** back to the vault:

1. Use `promote_findings()` to batch-promote findings to the relevant `Customers/<Name>.md` files under `## Agent Insights`.
2. Include a datestamp and brief summary of what was found/changed.
3. If no customer file exists and the customer is now being actively tracked, use `create_customer_file({ customer: "<Name>" })` to scaffold it.
4. Do NOT promote speculative or unvalidated information.

### 4. Connect Hook Storage

When capturing Connect-relevant evidence:

1. **Primary**: Use `capture_connect_hook({ customer: "<Name>", hook: { ... } })` — this appends to the customer file under `## Connect Hooks` and creates a backup automatically.
2. **Create file** if no customer file exists — use `create_customer_file({ customer: "<Name>" })` first, then capture the hook.
3. **Fallback**: If OIL is unavailable, write to `.connect/hooks/hooks.md` for repo-tracked persistence.

See `.github/instructions/connect-hooks.instructions.md` for the hook schema and formatting rules.

### 5. Customer Roster as Scope Filter

The vault customer roster acts as a **default filter** for multi-customer operations:

- **Proactive workflows** (e.g., "check my milestones", "what needs attention"): Scope to vault-listed customers only. Past/completed customers without vault files are excluded.
- **Reactive queries** (e.g., "what about Fabrikam?"): If the user explicitly asks about a customer not in the vault, query CRM directly — but note that the customer isn't in their active tracking set.
- **Composite tools**: When using `find_milestones_needing_tasks` or similar batch tools, derive the `customerKeywords` list from the vault roster — don't guess or use a hardcoded list.

## Fallback Behavior (No Vault)

> The Vault Protocol Phases above include per-phase fallback instructions. This section provides the consolidated fallback reference.

When OIL is unreachable (availability guard fails):
- The agent operates **statelessly** — no persistent memory across sessions. CRM remains the source of truth for live state.
- CRM query scoping reverts to asking the user for customer names or using `crm_whoami` context.
- Connect hooks go to `.connect/hooks/hooks.md` only.
- Vault correlation (VAULT-CORRELATE) is skipped — present M365/CRM evidence without vault enrichment.
- Users who want cross-session persistence without Obsidian can configure their own memory layer (local files, another MCP server, etc.). The agent does not assume any specific fallback directory structure.

## Anti-Patterns

- **Treating vault as optional** — when configured, it IS the local knowledge layer. Don't ignore it and query CRM blind.
- **Stale vault over fresh CRM** — vault context is for scoping and narrative. Never use cached vault data as a substitute for live CRM status when accuracy matters.
- **Querying all CRM data without vault scoping** — if the vault has a customer roster, use it. Don't `get_milestones(mine: true)` to retrieve everything when the vault tells you which 5 customers matter.
- **Promoting unvalidated data to vault** — only write confirmed findings, decisions, and evidence to vault files. Working hypotheses should be discarded at session end, not persisted.
- **Creating vault files for transient customers** — only create `Customers/<Name>.md` for customers the user intends to actively track. One-off CRM lookups don't warrant a vault file unless the user says so.
