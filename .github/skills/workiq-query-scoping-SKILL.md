---
name: workiq-query-scoping
description: 'Scope broad WorkIQ requests into bounded, relevant retrieval across meetings, chats, email, and SharePoint/OneDrive content.'
argument-hint: 'Paste the user request and any known constraints (people, customer, time, source types, output needed)'
---

# WorkIQ Query Scoping

Convert broad WorkIQ asks into focused retrieval plans that minimize noise and accidental overreach.

## MCP Tooling
- Primary tool: `workiq:ask_work_iq`. CRM stays in `msx-crm`; vault in `oil`.
- Accept EULA if required before first retrieval.
- **Seed context before retrieval**: resolve customer/people via `msx-crm:get_my_active_opportunities` and vault People notes (`oil:resolve_people_to_customers`) to build a people→customer lookup.

## When to Activate
- Broad M365 retrieval (meetings + chats + files + emails).
- Request lacks boundaries (time, entities, customer, output type).
- "Everything" / "all notes" / cross-workstream summaries.

## Fact Map (build before retrieval)
| Field | Notes |
|---|---|
| Business goal | Decision or output needed |
| Source types | Meetings, chat, email, SharePoint/OneDrive |
| People / entities | Names, team, account, opportunity |
| People→Customer map | Pre-resolved from vault + CRM |
| Time window | **REQUIRED** — explicit ISO dates; default: last 14 days |
| Topic constraints | Keywords, product, workstream, customer |
| Output shape | Summary, action items, risks, decisions |

**Clarification**: If ≥2 fields missing, ask up to 3 focused questions. Apply safe defaults (14 days, meetings+chats, named entities only) and confirm in one line. Confirm scope before crossing customer boundaries.

## Two-Pass Retrieval

### Pass 1 — Discovery
- Narrow, low-cost retrieval. Filter priority: time → entities → sources → keywords.
- **Always include explicit date boundaries** in every prompt. Never unbounded.
- One prompt per source family to keep results attributable.

### Entity Resolution (between passes)
Extract names from Pass 1 results, then resolve to customer associations:
1. **Vault first** — `oil:resolve_people_to_customers` for batch lookup (see `obsidian-vault.instructions.md`).
2. **CRM fallback** — for unresolved names, query via `msx-crm` (see `crm-query-strategy.instructions.md`).
3. **Attribute** — tag each candidate with resolved customer(s). Flag multi-customer or unresolved contacts for user confirmation.

### Vault Correlation (between passes)
If OIL available, cross-reference Pass 1 candidates with vault notes for the same date window using resolved customer attributions. See `obsidian-vault.instructions.md` § Vault Protocol Phases.

### Pass 2 — Deep Retrieval
- Fetch full detail only for Pass 1 matches; exclude the rest.
- **Group output by customer** — not a flat list.

## Narrowing Heuristics
- Too many results → tighten time window, then entities, then keywords.
- Too few results → broaden source types, then time window.
- Change one boundary at a time.

## Output
1. Fact map (values + assumptions)
2. Entity resolution summary (resolved, unresolved)
3. Final deliverable in requested shape, organized by customer

## Safety
- No content outside confirmed customer/entity boundaries.
- State assumptions explicitly.
- Concise summaries with references over raw dumps.
