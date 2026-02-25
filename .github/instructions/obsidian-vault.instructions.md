---
description: "Obsidian vault integration — local knowledge layer, customer roster, durable storage, CRM prefetch context, Connect hook routing. Use when reasoning about vault reads, customer defaults, durable memory, Obsidian notes, mcp-obsidian tools, customer roster filtering, vault-first storage, or cross-medium context assembly."
---

# Obsidian Vault — Local Knowledge Layer

The Obsidian vault is the agent's **primary local knowledge store** — personal notes, customer context, durable memory, and known defaults. It is NOT optional scaffolding; it is the lens through which CRM data is scoped and interpreted.

MSX/CRM is the **authoritative system of record** for live state (milestones, opportunities, pipeline). The vault provides the *context* that makes CRM data meaningful: which customers matter, what was discussed, what decisions were made, what the agent should focus on.

## Core Principles

1. **Vault defines scope; CRM provides fresh state.** The vault tells the agent *who* and *what* to care about. CRM tells the agent *where things stand right now*.
2. **Vault-listed customers are the active roster.** If a customer does not have a `Customers/<Name>.md` file in the vault, treat it as out-of-scope for proactive workflows. Past/completed/limbo opportunities for un-tracked customers should be ignored unless the user explicitly asks.
3. **CRM data is always retrieved fresh for complex operations.** Even if the vault has cached findings, milestone/opportunity status must be validated from CRM when the workflow involves writes, risk assessment, governance reporting, or cross-customer analysis.
4. **Vault is the durable storage layer.** Validated findings, decisions, Connect hooks, and agent insights are persisted to the vault — not `.agent-memory/durable/`. The `.agent-memory/` hierarchy handles session and working memory only.

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

All note types use YAML frontmatter for structured retrieval via `search_notes`. Consistent keys enable cross-note queries.

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
| `## Opportunities` | Active opportunity names/IDs the user cares about |
| `## Milestones` | Milestone-level notes, commitments, context not in CRM |
| `## Agent Insights` | Validated findings promoted from working memory |
| `## Connect Hooks` | Evidence capture entries (see Connect Hooks schema) |
| `## Notes` | Free-form meeting notes, decisions, observations |

### MCP Obsidian Tool Reference

When reading or writing vault notes, use these `mcp-obsidian` tools:

| Operation | Tool | Key Parameters |
|---|---|---|
| List folder contents | `list_directory` | `path` (e.g., `Customers/`) |
| Read a note | `read_note` | `path` (e.g., `Customers/Contoso.md`) |
| Read multiple notes | `read_multiple_notes` | `paths` array |
| Search by content | `search_notes` | `query`, optional frontmatter search |
| Create a new note | `write_note` | `path`, `content` |
| Append to a section | `patch_note` | `path`, `operation: "append"`, `heading` |
| Get frontmatter | `get_frontmatter` | `path` |
| Update frontmatter | `update_frontmatter` | `path`, `properties` |
| List/add tags | `manage_tags` | `path`, `action`, `tags` |

## Workflow Integration

### 1. CRM Query Prefetch (Vault → CRM)

**Before any CRM query workflow**, check the vault for relevant customer context:

1. Read the user's vault `Customers/` directory to identify the active roster.
2. If the query targets a specific customer, read `Customers/<Name>.md` to extract:
   - Known opportunity names/IDs (avoids discovery queries).
   - Team composition (identifies relevant owners for filtering).
   - Prior findings and open items (avoids redundant queries).
3. Use vault context to **scope** the CRM query — filter by known opportunity IDs, target specific milestones, or skip customers the user doesn't track.

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

1. Append findings to the relevant `Customers/<Name>.md` under `## Agent Insights`.
2. Include a datestamp and brief summary of what was found/changed.
3. If no customer file exists and the customer is now being actively tracked, create `Customers/<Name>.md` with the findings.
4. Do NOT promote speculative or unvalidated information.

### 4. Connect Hook Storage

When capturing Connect-relevant evidence:

1. **Primary**: Append to `Customers/<Name>.md` under `## Connect Hooks` (use `patch_note` with `operation: "append"` and `heading: "Connect Hooks"`).
2. **Create section** if `## Connect Hooks` doesn't exist in the file.
3. **Create file** if no customer file exists — minimal header + hook entry.
4. **Local backup**: Always also write to `.connect/hooks/hooks.md` for repo-tracked persistence.

See `.github/instructions/connect-hooks.instructions.md` for the hook schema and formatting rules.

### 5. Customer Roster as Scope Filter

The vault customer roster acts as a **default filter** for multi-customer operations:

- **Proactive workflows** (e.g., "check my milestones", "what needs attention"): Scope to vault-listed customers only. Past/completed customers without vault files are excluded.
- **Reactive queries** (e.g., "what about Fabrikam?"): If the user explicitly asks about a customer not in the vault, query CRM directly — but note that the customer isn't in their active tracking set.
- **Composite tools**: When using `find_milestones_needing_tasks` or similar batch tools, derive the `customerKeywords` list from the vault roster — don't guess or use a hardcoded list.

## Detection & Fallback

### Detecting Vault Availability

Before vault-dependent operations, verify `mcp-obsidian` is reachable:
- Attempt `list_directory` at the vault root.
- If reachable → vault-first workflow.
- If unreachable → fall back to `.agent-memory/` for all retrieval and promotion. No workflow breaks.

### Fallback Behavior (No Vault)

When the vault is unavailable:
- Use `.agent-memory/working/` and `.agent-memory/durable/` for context storage.
- Use `.agent-memory/working/customer-visit-log.json` for customer roster approximation.
- CRM query scoping reverts to asking the user for customer names or using `crm_whoami` context.
- Connect hooks go to `.connect/hooks/hooks.md` only.

## Anti-Patterns

- **Treating vault as optional** — when configured, it IS the local knowledge layer. Don't ignore it and query CRM blind.
- **Stale vault over fresh CRM** — vault context is for scoping and narrative. Never use cached vault data as a substitute for live CRM status when accuracy matters.
- **Querying all CRM data without vault scoping** — if the vault has a customer roster, use it. Don't `get_milestones(mine: true)` to retrieve everything when the vault tells you which 5 customers matter.
- **Promoting unvalidated data to vault** — only write confirmed findings, decisions, and evidence to vault files. Working hypotheses stay in `.agent-memory/session/` or `working/`.
- **Creating vault files for transient customers** — only create `Customers/<Name>.md` for customers the user intends to actively track. One-off CRM lookups don't warrant a vault file unless the user says so.
