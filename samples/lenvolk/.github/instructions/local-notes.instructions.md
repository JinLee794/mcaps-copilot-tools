---
description: "Local notes layer (.docs/) — customer roster, durable storage, CRM prefetch context, Connect hook routing. Use when reasoning about local notes reads, customer defaults, durable memory, notes files, customer roster filtering, notes-first storage, or cross-medium context assembly."
---

# .docs/ — Local Knowledge Layer

The `.docs/` folder at the repo root is the agent's **primary local knowledge store** — personal notes, customer context, durable memory, and known defaults. It is NOT optional scaffolding; it is the lens through which CRM data is scoped and interpreted.

MSX/CRM is the **authoritative system of record** for live state (milestones, opportunities, pipeline). The `.docs/` layer provides the *context* that makes CRM data meaningful: which customers matter, what was discussed, what decisions were made, what the agent should focus on.

## Core Principles

1. **Notes define scope; CRM provides fresh state.** The `.docs/` notes tell the agent *who* and *what* to care about. CRM tells the agent *where things stand right now*.
2. **The portfolio index is the active roster.** `.docs/_index.md` is the single entry point. If an account is not listed there, treat it as out-of-scope for proactive workflows.
3. **CRM data is always retrieved fresh for complex operations.** Even if notes have cached findings, milestone/opportunity status must be validated from CRM when the workflow involves writes, risk assessment, governance reporting, or cross-customer analysis.
4. **`.docs/` is the durable storage layer.** Validated findings, decisions, Connect hooks, and agent insights are persisted to `.docs/_data/<Account>/`. Use the built-in `vscode/memory` tool for session and working memory.

## Architecture

The `.docs/` knowledge layer uses a **Portfolio Index + Per-Account Data** architecture optimized for agent read performance.

### Access Pattern (Index-First Protocol)

1. **Portfolio queries** → Read `.docs/_index.md` (1 file, inline dashboard with seat data, flags, last-contact dates)
2. **Single-account queries** → Read `.docs/_data/<Account>/_manifest.md` (1 file → which data files exist, freshness dates)
3. **Specific data needs** → Read the target data file only (contacts.md, email-threads.md, teams-threads.md, state.md, insights.md)
4. **Chat/meeting history** → Read from `.docs/_data/<Account>/chats/`

### Directory Structure

```
.docs/
  _index.md                        ← AGENT-OWNED. Portfolio index. Agent's primary entry point.
  _schema.md                       ← File format specs for all data files (agent reference)
  AccountReference.md              ← USER-OWNED. Agent reads, never writes.
  WeeklyActionPlan.md              ← Weekly action plan (generated)
  LenVolkSE.md                    ← Portfolio owner profile
  Role-Descriptions.md            ← Role reference
  Strategy-Leadership.md          ← Strategy reference
  Training-AND-Knowledge.md       ← Training reference
  VBD-DevTools-Catalog.md         ← VBD catalog reference
  README.md
  Drawing_Excalidraw/              ← Excalidraw strategy diagrams (named: <ACCOUNT_NAME>_<YYYY-MM-DD>.excalidraw)
  _data/
    <Account>/                     ← Per-account subfolder
      _manifest.md                 ← Enrichment status, freshness dates, file inventory, quick facts
      contacts.md                  ← Full contact roster (customer + MS + GH), email domains, v-team roles
      email-threads.md             ← Email thread catalog, unanswered tracking
      teams-threads.md             ← Teams chat/channel catalog, thread IDs
      state.md                     ← Identity, seats, milestones, flags, billing subscriptions
      insights.md                  ← Agent insights, validated findings (append-only)
      chats/                       ← Individual chat/meeting files (group-chat-*, meeting-chat-*, etc.)
  Weekly/
    <YYYY-MM-DD>_<ReportName>.{md,xlsx}
    Template GHCP-Seats-report.xlsx
  Email-Templates/
    <TemplateName>.md
```

### Write Ownership (Who Writes What)

Each data file has designated writer agents to prevent conflicts:

| File | Writers | Growth Pattern |
|---|---|---|
| contacts.md | EmailTracker, TeamsTracker | Grows as new participants discovered |
| email-threads.md | EmailTracker | Updated each search cycle |
| teams-threads.md | TeamsTracker | Updated each search cycle |
| state.md | CRMOperator, GHCPAnalyst | Updated from CRM/MSXI data |
| insights.md | Any agent | Append-only — never delete entries |
| chats/* | TeamsTracker | Write-once: created, never modified |

### Write Protocol

Every data modification must follow this sequence:
1. Update the target data file (e.g., contacts.md)
2. Update `_manifest.md` → file registry row (size, date, status)
3. Update `_index.md` → dashboard row for the account

### Account Subfolder Naming Convention

- Derived from the **Account Name** column in `AccountReference.md`.
- Spaces replaced with underscores: `WALT DISNEY COMPANY` → `WALT_DISNEY_COMPANY`
- Commas and special characters preserved except trailing periods (Windows-incompatible): `Cox Corporate Services, Inc.` → `Cox_Corporate_Services,_Inc`
- Ampersands kept as-is: `AT&T` → `AT&T`, `A & E Television Networks` → `A_&_E_Television_Networks`

### Account Display Name Overrides

Some accounts have a **display name override** stored in `state.md` under `## Display Name`. When composing outbound communications (emails, Teams messages, reports) that reference the account by name, agents MUST use the display name instead of the raw CRM account name. This prevents confusion when multiple CRM accounts share similar names (e.g., "NIELSEN CONSUMER LLC" vs "The Nielsen Company"). The override table is maintained in `AccountTracker.agent.md` and each account's `state.md`.

### Excalidraw Strategy Diagrams

All Excalidraw visual diagrams (strategy maps, architecture views, milestone landscapes) are saved to a **single shared folder** at the `.docs/` root — NOT inside per-account `_data/` folders.

**Location**: `.docs/Drawing_Excalidraw/`

**Naming Convention**: `<ACCOUNT_NAME>_<YYYY-MM-DD>.excalidraw`
- `<ACCOUNT_NAME>` uses the same underscore convention as account subfolders (spaces → underscores).
- `<YYYY-MM-DD>` is the creation date.
- Examples: `JOHN_WILEY_AND_SONS_2026-03-04.excalidraw`, `COMCAST_2026-03-15.excalidraw`

**Rules**:
- Always use the account name and date — never use descriptive names like `strategy-map.excalidraw`.
- One diagram per account per date. If regenerated on the same date, overwrite the existing file.
- The `Drawing_Excalidraw/` folder is shared across all accounts — do not create per-account subfolders within it.

### Contact Resolution (for Email/Teams Search)

All contact data is now consolidated in `.docs/_data/<Account>/contacts.md`:
- **Customer contacts** — names, emails, job titles, domains
- **Microsoft team** — SSP, CSA, CSAM, AM, SE, and broader v-team
- **GitHub team** — GH AE aliases and active contacts
- **Email domains** — CRM-extracted customer domains for search filters

**Rule**: For email/Teams search, always read `.docs/_data/<Account>/contacts.md` FIRST. This single file contains all contact data needed for participant-based search. If contacts.md lacks customer domains, fall back to `list_account_contacts` MCP tool.

### File Tool Reference

| Operation | Tool | Example |
|---|---|---|
| Portfolio overview | `read_file` | `.docs/_index.md` |
| Account file inventory | `read_file` | `.docs/_data/COMCAST/_manifest.md` |
| List all accounts | `list_dir` | `.docs/_data/` |
| Read account data | `read_file` | `.docs/_data/COMCAST/contacts.md` |
| Search by content | `grep_search` | `includePattern: ".docs/_data/**"` |
| Search one account | `grep_search` | `includePattern: ".docs/_data/COMCAST/**"` |
| Create a new file | `create_file` | `.docs/_data/COMCAST/insights.md` |
| Append / edit a section | `replace_string_in_file` | Find heading, insert below it |

## Workflow Integration

### 1. CRM Query Prefetch (.docs/ → CRM)

**Before any CRM query workflow**, check `.docs/` for relevant customer context:

1. Read `.docs/_index.md` for portfolio overview and to identify the active roster.
2. If the query targets a specific customer, read `.docs/_data/<Account>/state.md` to extract:
   - Known opportunity names/IDs (avoids discovery queries).
   - Seat data, tranche, flags (avoids redundant queries).
3. Use notes context to **scope** the CRM query — filter by known opportunity IDs, target specific milestones, or skip customers the user doesn't track.

**When to skip notes prefetch:**
- The user provides an explicit opportunity ID or customer name not in `.docs/_data/`.
- The user explicitly asks to search broadly beyond their tracked customers.

### 2. Freshness Rules (When to Use CRM vs .docs/)

| Scenario | Source |
|---|---|
| "Who are my active customers?" | **Notes** (`.docs/_index.md` portfolio index) |
| "What milestones need attention for Contoso?" | **CRM** (fresh state), notes for context |
| "What did we discuss last time about Contoso?" | **Notes** (insights.md, email-threads.md) |
| "Create a task for milestone X" | **CRM** (fresh milestone state → write) |
| "Which customers have at-risk milestones?" | **Notes** (`_index.md` roster) → **CRM** (filtered query) |
| "Summarize my account health" | **Notes** (`_index.md` + per-account state.md) → **CRM** (fresh state per customer) |
| "What's the status of opportunity Y?" | **CRM** (always fresh for status) |

**Rule of thumb:** Use `.docs/` for *who/what/why* context. Use CRM for *current state* data. When both are needed, notes scope first, CRM validates second.

### 3. Post-Workflow Promotion (CRM → .docs/)

After completing a CRM query or write workflow, promote **validated findings** back to `.docs/`:

1. Append findings to `.docs/_data/<Account>/insights.md`.
2. Include a datestamp and brief summary of what was found/changed.
3. Update `_manifest.md` and `_index.md` after any data file write.
4. Do NOT promote speculative or unvalidated information.

### 4. Connect Hook Storage

When capturing Connect-relevant evidence:

1. **Primary**: Append to `.docs/_data/<Account>/insights.md` under a `## Connect Hooks` section.
2. **Backup**: Always also write to `.connect/hooks/hooks.md` for repo-tracked persistence.

See `.github/instructions/connect-hooks.instructions.md` for the hook schema and formatting rules.

### 5. Customer Roster as Scope Filter

The `.docs/_index.md` portfolio index acts as a **default filter** for multi-customer operations:

- **Proactive workflows** (e.g., "check my milestones", "what needs attention"): Scope to accounts listed in `_index.md` only. Past/completed customers without `_data/` folders are excluded.
- **Reactive queries** (e.g., "what about Fabrikam?"): If the user explicitly asks about a customer not in `.docs/`, query CRM directly — but note that the customer isn't in their active tracking set.
- **Composite tools**: When using `find_milestones_needing_tasks` or similar batch tools, derive the `customerKeywords` list from the `_index.md` roster — don't guess or use a hardcoded list.

## Detection & Fallback

### Detecting .docs/ Availability

Before notes-dependent operations, check that `.docs/` exists:
- Use `list_dir` on `.docs/`.
- If present → notes-first workflow.
- If missing → fall back to `vscode/memory` (`/memories/session/`) for retrieval and context. No workflow breaks.

### Fallback Behavior (No .docs/)

When `.docs/` is missing or empty:
- Use `vscode/memory` for session and persistent context storage.
- CRM query scoping reverts to asking the user for customer names or using `crm_whoami` context.
- Connect hooks go to `.connect/hooks/hooks.md` only.

## Anti-Patterns

- **Ignoring .docs/** — when present, it IS the local knowledge layer. Don't ignore it and query CRM blind.
- **Stale notes over fresh CRM** — notes context is for scoping and narrative. Never use cached notes as a substitute for live CRM status when accuracy matters.
- **Querying all CRM data without notes scoping** — if `_index.md` has a roster, use it. Don't `get_milestones(mine: true)` to retrieve everything when the index tells you which 5 customers matter.
- **Promoting unvalidated data to notes** — only write confirmed findings, decisions, and evidence to customer files. Working hypotheses stay in `vscode/memory` session scope.
- **Creating accounts not in the roster** — only create `_data/<Name>/` folders for customers the user intends to actively track. One-off CRM lookups don't warrant a data folder unless the user says so.
- **Skipping the write protocol** — after modifying any data file, always update `_manifest.md` and `_index.md`. The index must stay accurate for portfolio queries.
