---
name: workiq-people-research
description: 'Research internal Microsoft and GitHub people — roles, org charts, expertise, project involvement, reporting lines — via WorkIQ MCP (ask_work_iq). Use when user asks "who is [person]", "what does [person] do", "who owns [topic] at Microsoft", "find the right contact for [area]", "who reports to [manager]", "what team is [person] on", or any people/org research within Microsoft or GitHub. Covers role lookups, org navigation, expertise discovery, and stakeholder identification.'
argument-hint: 'Person name, alias, or role/area to research. Optionally include account or team context.'
---

# WorkIQ People Research

## Purpose

Research internal Microsoft and GitHub people using the WorkIQ MCP server (`ask_work_iq`). Answers questions about roles, teams, org structure, expertise, project involvement, and stakeholder identification within the Microsoft/GitHub corporate directory.

## MCP Server

This skill uses **only** the `workiq` MCP server (configured in `.vscode/mcp.json`):

```json
"workiq": {
  "command": "npx",
  "args": ["-y", "@microsoft/workiq", "mcp"],
  "type": "stdio"
}
```

**Tool**: `ask_work_iq` — natural language queries against M365 Copilot backend.

**No other MCP servers** (`teams-local`, `outlook-local` calendar tools, `msx-crm`) are used by this skill. WorkIQ is the sole data source.

## Rate Limits — CRITICAL

The M365 Copilot backend throttles WorkIQ with **session-scoped rate limiting**:

| Constraint | Value |
|---|---|
| Approximate hard limit | ~30 `ask_work_iq` calls per session |
| Safe operating cap | **25 calls per session** (leave headroom) |
| Throttle signal | Generic error: "An error occurred invoking ask_work_iq" or "We're experiencing high demand" |
| Recovery | **Start a new chat session** — throttle is session-scoped, no Retry-After header |
| Root cause | Microsoft Graph-style HTTP 429 / TooManyRequests, but WorkIQ swallows the details |

### Workarounds

1. **Cap at ~25 calls** — count every `ask_work_iq` invocation and stop before hitting the wall.
2. **Batch questions** — combine multiple questions into fewer, broader prompts instead of one-per-call.
3. **Scope before querying** — narrow the question to exactly what's needed before calling WorkIQ.
4. **New session recovers** — if you hit the throttle, the only way out is a new Copilot chat session.
5. **No fallback exists** — WorkIQ is the only tool for people/org research in this skill. If throttled, report the limitation and suggest the user start a new session.

### Call Budget Protocol

Before making any `ask_work_iq` call, mentally track:
- **Calls used so far** in this session (across ALL subagent invocations, not just this one)
- **Calls remaining** before the 25-call cap
- **Questions still queued** — if remaining calls < remaining questions, batch aggressively

If the delegation prompt includes a call count (e.g., "WorkIQ budget: 18/25 used"), respect that budget.

## Query Patterns

### Single Person Lookup
```
"Who is [Full Name or Alias]? What is their role, team, and manager?"
```
- Returns: title, org, manager, location, recent activity context
- Cost: **1 call**

### Role/Area Discovery
```
"Who is the [Role] for [Account/Area/Product] at Microsoft?"
```
- Examples: "Who is the CSAM for Contoso?", "Who owns GitHub Copilot licensing at Microsoft?"
- Cost: **1 call**

### Org Navigation
```
"Who reports to [Manager Name]? What teams do they lead?"
```
- Returns: direct reports, team structure
- Cost: **1 call**

### Expertise Search
```
"Who at Microsoft/GitHub has expertise in [topic]?"
```
- Returns: people associated with the topic based on M365 signals
- Cost: **1 call**

### Batch Person Lookup (efficient)
```
"For each of these people, tell me their role and team: [Name1], [Name2], [Name3]"
```
- Returns: role/team for multiple people in one response
- Cost: **1 call** (instead of 3 separate calls)

### Stakeholder Identification
```
"Who are the key Microsoft stakeholders for [Account Name] (TPID [TPID])? Include their roles."
```
- Returns: account team members with roles
- Cost: **1 call**

## Workflow

### Step 1 — Understand the Question
Parse the delegation prompt for:
- **Target**: person name/alias, or role/area to discover
- **Context**: account name, TPID, team, project (helps WorkIQ narrow results)
- **Depth**: simple lookup vs. org tree vs. expertise mapping

### Step 2 — Formulate Efficient Queries
- **Batch related questions** into a single `ask_work_iq` call.
- **Be specific** — include the person's full name + alias if known, or the exact role + account context.
- **Include context** — "Who is the CSAM for Contoso (TPID 12345)?" returns better results than "Who is the CSAM?"

### Step 3 — Execute and Parse
Call `ask_work_iq` with the formulated query. Parse the response for:
- Full name, alias, title/role
- Organization/team
- Manager (reporting line)
- Location
- Relevant context (projects, expertise, recent activity)

### Step 4 — Report
Return structured results:

```markdown
## People Research Results

### [Person Name] ([alias]@microsoft.com)
- **Role**: [Title]
- **Team**: [Org / Team]
- **Manager**: [Manager Name]
- **Location**: [City, Country]
- **Context**: [Any relevant notes — expertise, project involvement, account association]
```

For multi-person results, use a table:

```markdown
| Name | Alias | Role | Team | Manager |
|---|---|---|---|---|
| Alice Smith | alismit | Sr. CSA | GitHub CSU | Bob Jones |
| Carol Lee | carlee | CSAM | Unified Support | Dave Kim |
```

## Error Handling

| Error | Action |
|---|---|
| "An error occurred invoking ask_work_iq" | **Stop immediately.** Report: "WorkIQ rate limit likely hit. Start a new chat session to recover." |
| "We're experiencing high demand" | Same as above — session is throttled. |
| Empty/irrelevant response | Rephrase with more context and retry (costs 1 more call). Max 2 retries per question. |
| Person not found | Report "not found" — do not guess or fabricate. |

## Anti-Patterns

- **Never fan out** — don't call `ask_work_iq` once per person when you can batch them.
- **Never retry on throttle** — a throttled session stays throttled. Report and stop.
- **Never guess** — if WorkIQ doesn't return a result, say so. Don't fabricate org data.
- **Never use other MCP servers** — this skill is WorkIQ-only. Don't fall back to `teams-local` for people research.
- **Never exceed 25 calls** — count carefully and stop before the limit.

## Integration with AccountTracker

When delegated from AccountTracker, the prompt will include:
- Account name, TPID, contacts from `.docs/`
- Specific people or roles to research
- Current WorkIQ call budget (if tracking across multiple subagent invocations)

Return results in the structured format above so AccountTracker can synthesize them with other subagent outputs.
