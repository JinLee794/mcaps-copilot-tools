---
name: workiq-query-scoping
description: 'Scope broad WorkIQ requests into bounded, relevant retrieval across meetings, chats, email, and SharePoint/OneDrive content using a fact-map and two-pass retrieval strategy.'
argument-hint: 'Paste the user request and any known constraints (people, customer, time, source types, output needed)'
---

# WorkIQ Query Scoping

## Purpose
Convert broad WorkIQ asks into focused retrieval plans that minimize noise, latency, and accidental overreach while preserving user intent.

## MCP Tooling
- Primary retrieval tool: WorkIQ MCP `ask_work_iq`.
- If EULA is required by environment policy, complete acceptance before retrieval.
- Keep CRM reads/writes in `msx-crm`; use WorkIQ for M365 evidence retrieval only.

## When to Use
- User asks for broad retrieval across Microsoft 365 sources (for example meetings + chats + files + emails).
- Request lacks clear boundaries (time window, entities, customer, project, or output type).
- User asks for “everything,” “all notes/transcripts,” or cross-workstream summaries.

## Source Types (M365)
- Teams chats/channels
- Meetings and transcripts/notes
- Outlook email and calendar context
- SharePoint/OneDrive files

## Fact Map Contract
Build a short fact map before retrieval:
1. Business goal (decision/output needed)
2. Source types (meetings, chat, email, SharePoint/OneDrive)
3. People/entities (names, team, account, opportunity, project)
4. Time window (explicit range)
5. Topic constraints (keywords, product/workstream, customer)
6. Output shape (summary, action items, risks, decisions)

## Clarification Rules
- If 2 or more fact-map fields are missing, ask up to 3 focused clarifying questions.
- If user is unsure, apply safe defaults and confirm in one line:
  - Time: last 14 days
  - Sources: meetings + chats
  - Scope: named team/entities only
- If request appears cross-customer or sensitive, confirm scope boundaries before including content.

## Retrieval Strategy (Two Passes)
### Pass 1: Discovery
- Run narrow, low-cost retrieval to validate relevance.
- Prefer filters in this order: time window → entities → source types → keywords.
- Output candidate set only (threads/transcripts/files ids or references).
- Prefer one `ask_work_iq` prompt per source family to keep results attributable.

### Pass 2: Deep Retrieval
- Retrieve full detail only for candidates matched in Pass 1.
- Exclude unmatched sources to reduce noise and token load.
- Use targeted `ask_work_iq` prompts that explicitly cite selected candidates and exclusions.

## Narrowing Heuristics
- If too many results: tighten time window and entities first, then keywords.
- If too few results: broaden source types first, then expand time window.
- Keep query intent stable; change one boundary at a time.

## Output Format
Produce:
1. Fact map (explicit values + assumptions)
2. Pass 1 findings (candidate count + why selected)
3. Pass 2 scope (what will be fetched, what is excluded)
4. Final deliverable in requested output shape

## Safety Notes
- Do not include content outside confirmed customer/entity boundaries.
- State assumptions explicitly whenever defaults are applied.
- Prefer concise summaries with links/references over raw transcript dumps unless explicitly requested.

## Suggested Prompt Skeleton for `ask_work_iq`
- Goal: what decision/output is needed.
- Scope: customer/account/opportunity + named people/entities.
- Time window: explicit dates.
- Sources: Teams / meetings / Outlook / SharePoint (pick only needed).
- Output: requested shape (summary, actions, risks, decisions) with concise evidence citations.
