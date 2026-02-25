---
description: "Optional Obsidian vault integration for local memory prefetch, durable knowledge promotion, and human-reviewable CRM insights. Use when reasoning about vault prefetch, local memory layer, customer context retrieval order, durable fact promotion, agent insights, CRM findings persistence, or knowledge graph bridging between agent-memory and Obsidian."
---

# Vault Memory Layer (Optional Enhancement)

## Overview

The vault memory layer is an **optional, backwards-compatible** enhancement that uses a locally-running `mcp-obsidian` MCP server as a curated knowledge tier sitting between the hot `.agent-memory/` runtime state and the live CRM/M365 endpoints.

When available, the vault provides:
- **Pre-retrieval context** — customer profiles, stakeholders, tech stacks, prior findings — before any CRM call.
- **Durable promotion target** — validated facts/decisions write to human-reviewable vault notes instead of `.agent-memory/durable/` JSON.
- **Knowledge graph participation** — promoted insights become wiki-linked, searchable, and Dataview-queryable alongside existing notes.

When unavailable, everything falls back to the existing `.agent-memory/` system with zero breakage.

---

## Detection and Fallback

### How to detect

Before using vault tools, check availability:

1. Check if `mcp-obsidian` tools are accessible (e.g., `get_vault_stats` or `read_note`).
2. If the tool call succeeds → vault is available, use the enhanced retrieval order.
3. If the tool call fails or the server is not configured → vault is unavailable, use the standard `.agent-memory/` flow.

### Fallback behavior (no vault)

| Capability | With vault | Without vault |
|---|---|---|
| Pre-retrieval context | Read `Customers/<name>.md` and `Projects/*.md` via `mcp-obsidian` | Read `.agent-memory/working/customer-visit-log.json` only |
| Durable promotion | Write to vault note via `mcp-obsidian` | Write to `.agent-memory/durable/` (existing behavior) |
| Relationship graph | Wiki-links in vault connect people, customers, projects | Entity arrays in `.agent-memory/` JSON (flat, no graph) |
| Human review surface | Obsidian search, graph view, Dataview queries | Manual JSON file inspection |

**Rule**: Never fail a workflow because the vault is unavailable. The vault is an accelerator, not a dependency.

---

## Enhanced Retrieval Order (When Vault Available)

When starting a CRM workflow with vault available, retrieve context in this order:

```
Step 1: .agent-memory/working/customer-visit-log.json
        → "Have I seen this customer recently? What was found?"
        → If recent visit exists AND vault is available, jump to Step 2.
        → If recent visit exists AND vault unavailable, use visit-log findings directly (Step 4).

Step 2: mcp-obsidian → read_note("Customers/<name>.md")
        → Team composition (STU/ATU/CSU), stakeholders, active projects,
          prior CRM findings (## Agent Insights section), open action items.

Step 3: mcp-obsidian → read_note("Projects/<relevant>.md") (if needed)
        → Tech stack, architecture decisions, target dates, positioning notes.
        → Only read projects referenced by the customer file or relevant to the query.

Step 4: CRM (msx-crm tools)
        → Live pipeline state, milestone status, tasks, consumption.
        → Scope queries using context from Steps 1-3 (customer IDs, opp names,
          stakeholder names for ownership matching).

Step 5: WorkIQ (ask_work_iq) (if M365 evidence needed)
        → Meetings, chats, emails, shared docs.
        → Seed fact map from Steps 2-3 (stakeholder names, project keywords)
          for more precise WorkIQ scoping.
```

### Why this order matters

- Steps 1-3 are **zero-latency local reads** — no CRM auth, no network, no rate limits.
- The agent arrives at Step 4 already knowing who the people are, what's active, and what was found last time.
- Steps 2-3 provide entity names that make Step 4 queries more precise (customer keywords, opp names for `crm_query` filters).
- Step 5 benefits from Steps 2-3's stakeholder lists and project keywords for tighter WorkIQ scoping.

### Standard Retrieval Order (Without Vault)

```
Step 1: .agent-memory/working/customer-visit-log.json
Step 2: .agent-memory/working/ (any relevant facts by entity match)
Step 3: .agent-memory/durable/ (promoted facts by entity match)
Step 4: CRM (msx-crm tools)
Step 5: WorkIQ (if needed)
```

This is the existing behavior and remains fully functional.

---

## Durable Promotion (Vault-Enhanced)

When the vault is available, `durable` promotion writes to the vault instead of `.agent-memory/durable/`:

### Promotion routing

| Content type | Vault destination | How |
|---|---|---|
| Customer-scoped CRM finding | `Customers/<name>.md` → `## Agent Insights` section | `mcp-obsidian: patch_note` — append to section |
| Project-scoped decision | `Projects/<name>.md` → `## Agent Insights` section | `mcp-obsidian: patch_note` — append to section |
| Cross-account pattern | `CRM Insights/<title>.md` (new note) | `mcp-obsidian: write_note` — create with frontmatter |
| Operational procedure | `.agent-memory/durable/` (keep in repo) | Existing `memory:promote` — not vault-appropriate |

### Customer file `## Agent Insights` convention

When appending to a Customer file, use this format:

```markdown
## Agent Insights

### 2026-02-24 — Milestone Hygiene Sweep
- **Source**: CRM query via SE workflow
- **Finding**: 12 active milestones, 0 with tasks. Highest priority: Azure AI Platform (due 2026-03-15).
- **Action**: Task creation needed for top 3 milestones by due date.
- [[Cencora - AI Platform Patterning]] — related project context.
```

Rules:
- Each entry gets a date-stamped `###` heading.
- Include `Source` (which workflow/tool produced this).
- Include `Finding` (the fact or decision).
- Include `Action` (what should happen next — or "None, informational" if purely factual).
- Use `[[wiki-links]]` to connect to People, Projects, and other Customers where relevant.
- Append new entries; never overwrite prior insights (they form a chronological record).

### `CRM Insights/` folder convention

For cross-account patterns (e.g., "42 milestones across 5 accounts have zero tasks"):

```yaml
---
tags: [crm-insight]
date: 2026-02-24
source: milestone-hygiene-sweep
customers: [Stryker, Cencora, BD, Epic, R1]
role: Solution Engineer
---
```

### Promotion without vault (fallback)

When the vault is unavailable, promotion writes to `.agent-memory/durable/` as a JSON record (existing behavior). No change required.

---

## Customer Visit Log Updates

The `.agent-memory/working/customer-visit-log.json` format gains one optional field when the vault is available:

```json
{
  "timestamp": "2026-02-24T...",
  "role": "Solution Engineer",
  "customers": ["Stryker", "Cencora"],
  "intent": "milestone hygiene sweep",
  "findings": "12 active milestones, 0 tasks across 2 accounts",
  "notes": "Task creation planned for top 3 by due date",
  "vault_synced": true
}
```

- `vault_synced: true` means findings were also written to the vault's `## Agent Insights` section.
- `vault_synced: false` (or absent) means findings live only in this JSON file.
- When `vault_synced: true`, the visit-log entry can be slim (just a pointer) — the vault has the full context.

---

## Vault Setup (Opt-in)

Users who want the vault layer:

1. Have an Obsidian vault with `Customers/`, `Projects/`, and `People/` folders following the vault schema in the Obsidian workspace's `copilot-instructions.md`.
2. Have `mcp-obsidian` built locally (clone, `npm install && npm run build`).
3. Configure `mcp-obsidian` in `.vscode/mcp.json` with their vault path.
4. Create a `CRM Insights/` folder in their vault (optional — created on first promotion if needed).

Users who do not want the vault layer:
- Leave the `mcp-obsidian` server unconfigured or remove it from `.vscode/mcp.json`.
- Everything works exactly as before via `.agent-memory/`.
