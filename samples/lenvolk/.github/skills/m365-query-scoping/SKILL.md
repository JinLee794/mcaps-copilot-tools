---
name: m365-query-scoping
description: 'Scopes broad M365 retrieval requests into bounded, relevant queries across meetings, chats, email, and SharePoint/OneDrive content using a fact-map and two-pass retrieval strategy. Routes queries to the appropriate local or cloud MCP server (outlook-local, teams-local, workiq). Use when user asks for broad M365 retrieval, cross-workstream summaries, "everything" or "all notes/transcripts," or requests lacking clear time/entity/source boundaries.'
argument-hint: 'Paste the user request and any known constraints (people, customer, time, source types, output needed)'
---

# M365 Query Scoping

## Purpose
Convert broad M365 asks into focused retrieval plans that minimize noise, latency, and accidental overreach while preserving user intent.

## MCP Tooling
- MCP servers for M365 retrieval:
  - `teams-local` — Teams chats, channels, messages (local cache)
  - `outlook-local` — email search (Outlook COM)
  - `outlook-local` — calendar events, meeting search, user's own availability (via `outlook_search_calendar`)
  - `agent365-calendartools` — multi-person free/busy, group availability, meeting time suggestions (via Microsoft Graph)
  - `workiq` — person/org profile lookups (who is my manager, role discovery, org navigation)
- Keep CRM reads/writes in `msx-crm`; use these tools for M365 evidence retrieval only.
- **Seed fact map from CRM before retrieval**: call `get_my_active_opportunities(customerKeyword)` to resolve customer/opportunity context and populate entities, then use those names in M365 queries for precise scoping.
- For email search, use `outlook-local` MCP (Outlook COM) — zero rate limits, full email bodies.


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

## Call Budget Awareness

The agent365 MCP servers are HTTP-based and connect to Microsoft Graph. Be mindful of server-side rate limits.

- Prefer broader queries over per-entity fan-out to minimize total calls.
- For email queries, use `outlook-local` MCP (Outlook COM) — zero rate limits, returns full email bodies.
- Choose the right server for the data type: `teams-local` for Teams, `outlook-local` for email and user's own calendar, `agent365-calendartools` for multi-person availability, `workiq` for person/org profile lookups.

## Retrieval Strategy (Two Passes)
### Pass 1: Discovery
- Run narrow, low-cost retrieval to validate relevance.
- Prefer filters in this order: time window → entities → source types → keywords.
- Output candidate set only (threads/transcripts/files ids or references).
- Prefer one agent365 query per source family to keep results attributable.

### Pass 2: Deep Retrieval
- Retrieve full detail only for candidates matched in Pass 1.
- Exclude unmatched sources to reduce noise and token load.
- Use targeted agent365 queries that explicitly cite selected candidates and exclusions.

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

## Suggested Query Structure for MCP Retrieval
- Goal: what decision/output is needed.
- Server: which MCP server to use (`outlook-local` for email and calendar, `teams-local` for Teams, `workiq` for people).
- Scope: customer/account/opportunity + named people/entities.
- Time window: explicit dates.
- Sources: Teams / meetings / Outlook / SharePoint (pick only needed).
- Output: requested shape (summary, actions, risks, decisions) with concise evidence citations.
