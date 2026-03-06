# Copilot Instructions for MSX Helper MCP

## Build, Test, and Run

All commands run from `mcp/msx/`:

```bash
npm install              # Install dependencies
npm start                # Run MCP server (stdio transport)
npm test                 # Run all tests (vitest)
npx vitest run src/__tests__/validation.test.js   # Run a single test file
npx vitest -t "sanitizeODataString"               # Run tests matching a name
npm run test:watch       # Watch mode
```

The MCP server is plain Node.js (ES modules, no build step). Entry point: `mcp/msx/src/index.js`.

## Issue Tracking (bd)

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started. Use `bd ready` to find work, `bd close <id>` to complete it. **Always `git push` before ending a session** — unpushed work is stranded work.

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

- **Never `pip install` without user consent.** If a Python library is missing, tell the user and ask before installing. For Excel operations, `openpyxl` is always available — use it instead of `pandas`.
- Prefer invoking MCP tools over creating/running local one-off scripts.
- Do not generate or execute ad-hoc CRM query scripts under `mcp-server/.tmp` for normal workflows.
- Use the configured MCP server `msx-crm` from `.vscode/mcp.json` for read and write-intent operations.
- If an MCP read tool fails (for example `get_milestones`), do not auto-fallback to shell/Node scripts. First retry with corrected MCP parameters and only use local diagnostics when the user explicitly asks.
- When an MCP tool requires identifiers, ask for or derive missing parameters via other MCP read tools (for example `crm_whoami`) instead of creating script files.

## Python in PowerShell Terminal

- **Never use inline `python -c "..."` for anything beyond trivial one-liners.** PowerShell mangles regex characters (`.+?`, `$`, `|`, brackets) and special escapes. Write a `.tmp_<name>.py` script file, run `python .tmp_<name>.py`, then delete it.
- For any Python that includes regex, f-strings with `$`, CSV parsing, or multi-line logic: always use a script file.
- **Single-script pattern**: when a workflow needs multiple Python steps (read → process → write), combine them into one script. Do not iterate with multiple scripts or debug cycles.
- **Clean up temp scripts**: delete `.tmp_*.py` files after successful execution.
- **Virtual environment required**: Before running any Python script that needs `pip install`, create a virtual environment. Never install packages into the global Python environment.
  ```bash
  python -m venv .venv
  .venv\Scripts\Activate.ps1
  pip install <package>
  python .tmp_<name>.py
  deactivate
  ```
- **Clean up virtual environment**: After the script completes successfully, delete the `.venv` directory. Do not leave virtual environments in the workspace.
  ```bash
  Remove-Item .venv -Recurse -Force
  ```

## Outlook COM Batch Convention

- **For multi-account Outlook COM operations (4+ accounts), always use batch script pattern.** Never generate per-account `.tmp_*.ps1` files in loops.
- Batch email search: write ONE `.tmp_email_batch_input_<runId>.json`, run `Search-OutlookEmailBatch.ps1`, read ONE `.tmp_email_batch_results_<runId>.json`.
- Batch draft composition: write ONE `.tmp_draft_batch_input_<runId>.json`, run `New-OutlookDraftBatch.ps1`, read ONE `.tmp_draft_batch_results_<runId>.json`.
- `runId` is a 6-character hex string (e.g., `a3f21c`) to prevent collision on concurrent runs.
- Fleet mode threshold: **4 accounts**. Below 4, use single-account scripts.
- Python post-processors (`.tmp_process_all.py` etc.) are eliminated — agents read batch JSON directly.

## MCP Server Architecture

The `mcp/msx/` directory is a standalone Node.js MCP server (ES modules, `@modelcontextprotocol/sdk`):

- **`index.js`** — Entry point. Wires auth → CRM client → tool registration → stdio transport.
- **`auth.js`** — Azure CLI token acquisition (`az account get-access-token`). No SDK dependency — spawns `az` directly.
- **`crm.js`** — HTTP client for Dynamics 365 OData API (v9.2). Handles retries, backoff, 429/5xx, and timeout. Write methods (`POST`/`PATCH`/`PUT`/`DELETE`) are gated.
- **`tools.js`** — All MCP tool definitions. Uses `zod` for parameter validation. Maps tool calls to `crmClient` methods.
- **`validation.js`** — Input sanitization: GUID validation, TPID checks, OData string escaping.
- **`approval-queue.js`** — Stages CRM write operations for human-in-the-loop review. Operations expire after 10 minutes. Emits events (`staged`, `approved`, `rejected`, `executed`).

Key conventions in the server code:
- All source is plain `.js` (no TypeScript, no transpilation).
- Tests live in `src/__tests__/*.test.js` and run via vitest.
- Tool responses use `text()` helper for success, `error()` helper for failures.
- CRM field names must match the schema in `.github/instructions/crm-entity-schema.instructions.md` exactly — never guess property names.

## MSX/CRM Operations

- Capture the user's MSX role up front for every MSX/CRM workflow (before guidance, reads that drive workflow decisions, or any write-intent planning).
- If role is not already confirmed, present these role workflow options and ask the user to select one:
	- `Solution Engineer` → `.github/skills/solution-engineer/SKILL.md`
	- `Cloud Solution Architect` → `.github/skills/cloud-solution-architect/SKILL.md`
	- `Customer Success Account Manager` → `.github/skills/csam/SKILL.md`
	- `Specialist` → `.github/skills/specialist/SKILL.md`
- If you can infer role from `crm_auth_status`/`crm_whoami` + `crm_get_record`, present the top likely role(s) and ask the user to confirm before proceeding.
- If role mapping is ambiguous or unknown, do not assume; require explicit user role selection first.
- For read flows, use MCP tools such as `crm_auth_status`, `crm_whoami`, `crm_query`, `crm_get_record`, `get_milestones`, `get_milestone_activities`, and `list_account_contacts`.
- Before using `crm_query` or `crm_get_record` with property names you are not certain about, refer to `.github/instructions/crm-entity-schema.instructions.md` for valid property names. Never guess CRM property names.
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
- ✅ `find_milestones_needing_tasks({ customerKeywords: ["Contoso", "Fabrikam", "Northwind"] })` (1 call)
- ✅ `crm_query({ entitySet: "msp_engagementmilestones", filter: "_msp_opportunityid_value eq '...' and msp_milestonestatus eq 861980000", top: 25 })` (filtered, efficient)
- ✅ `get_milestone_activities({ milestoneIds: ["ms1", "ms2", "ms3"] })` (1 call instead of 3)

## M365 Intelligence (Local + Cloud MCP Servers)

Local and cloud MCP servers provide M365 data access, plus additional MCP servers for external intelligence (configured in `.vscode/mcp.json`):

| Server | Purpose | Use When |
|---|---|---|
| `teams-local` | Teams chats, channels, users, messages — reads from local Teams cache (LevelDB/SSTable) | Teams-specific queries, channel message search, chat management |
| `outlook-local` (calendar) | Calendar events, meeting search, user's own availability via Outlook COM | Meeting lookups, own availability checks, account meeting history |
| `agent365-calendartools` | Multi-person free/busy schedules, group availability, meeting time suggestions via Microsoft Graph | Finding a time across multiple attendees, checking if someone else is free, scheduling across account teams |
| `agent365-wordserver` | Word document reading, creation, and comment collaboration | Document link resolution in emails/Teams messages, document content retrieval |
| `workiq` | People/org research — roles, reporting lines, expertise, stakeholder identification | Person profile lookups, "who is my manager", org navigation, role discovery |
| `linkedin` | LinkedIn company profiles, company posts, people profiles, job/people search (read-only) | Customer company research, stakeholder LinkedIn lookups, company announcements. Does NOT support personal feed browsing or interactions (like/comment/share). |

### M365 Query Scoping

- For broad M365 asks (emails/meetings/chats/files/transcripts), always narrow scope before retrieval.
- If role mapping and M365 scoping both apply, resolve role first, then scope the M365 query.
- Choose the right server: use `teams-local` for Teams-specific data, `outlook-local` for email search and the user's own calendar/scheduling, `agent365-calendartools` for multi-person availability and group meeting scheduling, `agent365-wordserver` for Word document content, and `workiq` for person/org profile lookups.

### Email Search: Participant-First Rule (Outlook-Local Primary)

⚠️ **Never search for account emails by account name alone.** Most email threads about an account do NOT contain the CRM account name in the subject or body — they use product terms (GHAS, GHCP, Z2A), milestone references, or are simply conversations between known contacts with generic subjects like "Re: Azure MCP Server".

⚠️ **Always use `outlook-local` MCP tools for email search as the primary tool.** Outlook COM automation returns full email bodies, metadata, and unanswered thread analysis with zero API calls, no rate limits, and no auth tokens. Outlook is always running locally.

**Always**:
1. Read `.docs/_data/<Account>/contacts.md` FIRST for the full contact roster (customer + Microsoft + GitHub participants from past threads), email domains, and v-team roles. AccountReference.md provides TPID, OppID, MilestoneID, and baseline SSP/GH AE — but it is NOT the complete contact list for search.
2. If the account's contacts.md lacks customer email domains, call `list_account_contacts` (via milestoneNumber, opportunityId, or customerKeyword) to get domains on-the-fly.
3. Search via `outlook-local` MCP tools (`outlook_search_emails` or `outlook_search_emails_batch`) with ALL collected contacts as primary criteria (To/From/CC match). Keywords are secondary.
4. If 0 results, that's a legitimate finding — retry with larger `daysBack` (60, then 90) before concluding.
5. Use `teams-local` for any Teams chat context cross-referencing.

For the AccountTracker agent workflow, see `.github/agents/AccountTracker.agent.md`.

### Email Composition: Outlook-Local Primary

- **Primary**: Use `outlook-local` MCP tools (`outlook_create_draft`, `outlook_create_draft_batch`) for composing and saving email drafts. Saves directly to local Outlook Drafts folder via COM — drafts appear immediately and are verifiable.
- **No cloud fallback**: If Outlook COM fails (Outlook not running, COM error), report the failure — do not fall back to cloud MCP for email composition.

### Outlook Local MCP (outlook-local)

- **Primary tool for all email operations** (search + composition).
- Uses Outlook COM automation — zero API calls, no rate limits, no auth tokens.
- Returns full email bodies (plain text, up to 4000 chars per message), complete metadata, and unanswered thread analysis.
- MCP Server: `outlook-local` in `.vscode/mcp.json`. Scripts: `.github/skills/outlook-lookup/scripts/` and `.github/skills/outlook-compose/scripts/`.
- Requires Outlook desktop running on Windows (always running for this user).
- Use for all email search, weekly email follow-up reports, draft composition, and account communication tracking.

## Knowledge Layers (.docs/ + vscode/memory)

The agent operates with two knowledge layers. The `.docs/` folder at the repo root is the **primary** local knowledge store; the built-in `vscode/memory` tool handles session and persistent memory.

### Local Notes (Primary — `.docs/`)

- The `.docs/` folder defines the **active customer roster** — only accounts listed in `.docs/_index.md` are in scope for proactive workflows.
- **Before CRM queries**: read `.docs/_index.md` for portfolio overview, then `.docs/_data/<Account>/state.md` for context. Don't query CRM blind when the notes tell you who matters.
- **After CRM workflows**: promote validated findings to `.docs/_data/<Account>/insights.md`.
- **Notes scope, CRM validates**: use `.docs/` for *who/what/why* context; use CRM for *current state* data. Never substitute cached notes for live CRM status on complex operations (writes, risk assessment, governance).
- See `.github/instructions/local-notes.instructions.md` for full conventions, freshness rules, and workflow integration.

### Agent Memory (vscode/memory)

- Use the built-in `vscode/memory` tool for session context (`/memories/session/`) and persistent notes (`/memories/`, `/memories/repo/`).
- Durable promotion of validated findings goes to `.docs/` customer files.
- Do not store secrets, tokens, or credentials in memory.

## Connect Hooks (Evidence Capture)

When an interaction includes measurable impact or meaningful progress within the three circles of impact
(individual contribution, team/org outcomes, customer/business value), capture Connect-relevant evidence.

Capture should be:
- Concrete and attributable (who/what/where).
- Evidence-based (numbers, outcomes, decisions, recognition).

Storage routing follows the notes-first pattern: append to the customer's `.docs/` file under `## Connect Hooks`, with `.connect/hooks/hooks.md` as local backup. Do NOT store speculation.

See `.github/instructions/connect-hooks.instructions.md` for hook schema and `.github/instructions/local-notes.instructions.md` for notes routing conventions.

## Response Expectations

- Keep outputs concise and action-oriented.
- When asked to "use MCP server", do not pivot to direct shell-based CRM calls.

## CRM Token Recovery (Global)

When any agent encounters a **401**, **auth expired**, or **"Not logged in"** error from `msx-crm` tools:

1. **Stop** the current CRM operation immediately (staged writes are preserved — nothing is lost).
2. **Tell the user** to run these commands and provide the output:
   ```
   az login --tenant 72f988bf-86f1-41af-91ab-2d7cd011db47
   az account get-access-token --resource https://microsoftsales.crm.dynamics.com
   ```
3. **Stop and wait** for the user to provide the token output. Do NOT run any terminal commands yourself.
4. Once the user provides the token, **ask the user** to restart the `msx-crm` MCP server in VS Code.
5. **Stop and wait** for the user to confirm the MCP server is restarted.
6. **Retry** the failed operation.

Do NOT run `az login`, `az account get-access-token`, or any terminal commands for token recovery. Do NOT retry CRM calls in a loop against an expired token. This applies to **all agents** that delegate to CRMOperator or call `msx-crm` tools directly.

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