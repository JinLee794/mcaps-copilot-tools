---
name: vault-context-assembly
description: 'Obsidian vault retriever: fetches customer notes, engagement history, and durable context from the local Obsidian knowledge store. Provides CRM-prefetch data and prior-session memory to other workflows. Triggers: vault lookup, Obsidian notes, local knowledge store, vault file retrieval, prefetch data, customer notes file, durable memory.'
argument-hint: 'Provide customer name or account identifier for vault file retrieval'
---

## Purpose

Retrieves and assembles customer context from the Obsidian vault to support CRM prefetch, reduce redundant queries, and provide durable knowledge context that CRM alone cannot supply.

## Freedom Level

**Medium** — Vault interpretation requires judgment; retrieval is tool-based.

## Trigger

- Any skill requiring customer context before CRM query (vault-first pattern)
- User asks for customer background, history, or prior notes
- Pre-meeting preparation or account review

## Flow

1. **Probe vault availability** — Call `oil:get_vault_context()` with minimal scoped query.
2. If available:
   a. Retrieve customer roster entry for account identifier.
   b. Pull relevant notes, prior risk flags, relationship history, meeting summaries.
   c. Extract CRM prefetch hints (known opportunity IDs, milestone states from last sync).
3. If unavailable → return `vault_status: unavailable` and proceed statelessly.
4. Assemble context payload for the invoking skill.

## Vault Content Types

| Content Type | Location Pattern | Use |
|---|---|---|
| Customer roster | `customers/<account>.md` | Default account ID, TPID, key contacts |
| Meeting notes | `customers/<account>/meetings/` | Prior engagement context |
| Risk flags | Inline tags `#risk` in customer notes | Historical risk patterns |
| CRM prefetch | `customers/<account>/crm-cache.md` | Known opportunity IDs, recent milestone states |
| Relationship map | `customers/<account>/stakeholders.md` | Decision makers, sponsors, blockers |

## Decision Logic

- Vault data supplements CRM — never contradicts CRM entity state
- If vault data is stale (>30 days since last update), flag but still use
- CRM prefetch from vault reduces query volume for `msx-crm:crm_query` calls
- Missing vault data is not blocking — CRM is the source of truth

## Output Schema

- `vault_status`: available | unavailable
- `customer_context`: assembled notes, roster data, and relationship context
- `crm_prefetch`: known IDs and cached states to narrow CRM queries
- `staleness_flags`: any data older than 30 days
- `next_action`: returns to the invoking skill with enriched context
