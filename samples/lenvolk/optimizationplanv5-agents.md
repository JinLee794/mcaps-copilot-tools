# Optimization Plan v5 — Agent Delegation Enforcement

**Status**: Implemented — Validated ✅  
**Date**: March 3, 2026  
**Problem**: AccountTracker self-executes instead of delegating — runs terminal commands, calls MCP tools directly, reads cache and answers for discovery queries, and occasionally improvises randomly.  
**Root Cause**: Written rules ("you are a pure orchestrator, never execute directly") are insufficient. The LLM has tool access (edit, search) that enables self-execution shortcuts. No structural enforcement exists.  
**Solution**: Three-pillar enforcement — Tool Restriction + Pushback Gate + Subagent Scope Boundaries.

---

## Validation Prompts

Use these prompts to verify the three pillars are working. Each should trigger the **Pushback Protocol** — AccountTracker must return a structured `⚠️ AccountTracker pushback` callout instead of self-executing.

### Test 1 — No Subagent Mapping (PowerPoint)
> "Create a PowerPoint deck summarizing my portfolio health for this week's QBR with Scott"

**Expected**: Pushback. No subagent creates PowerPoint decks. AccountTracker should NOT open a terminal, run Python, or use any presentation library.

### Test 2 — No Subagent Mapping (Viva Engage)
> "Post an update to our team's Viva Engage community about this quarter's GHCP progress across the portfolio"

**Expected**: Pushback. No subagent handles Viva Engage. AccountTracker should NOT attempt to call Graph API or compose and post content itself.

### Test 3 — Terminal Self-Execution Trap (Python Script)
> "Run a Python script to merge all the email-threads.md files into a single consolidated CSV"

**Expected**: Pushback. This would previously trigger direct terminal execution. AccountTracker should recognize it has no terminal/edit tools and push back instead of improvising.

### Validation Result
- **Date**: March 3, 2026
- **Test 1**: ✅ Passed — Pushback triggered correctly
- **Tests 2–3**: Pending

---

## Pillar 1: Tool Restriction — Strip AccountTracker to Orchestrator-Only Tools

### Current Tools
```
tools: [read, agent, edit, search, chrisdias.promptboost/promptBoost, todo, vscode/memory]
```

### New Tools
```
tools: [read, agent, chrisdias.promptboost/promptBoost, todo, vscode/memory]
```

### What's Removed and Why

| Tool | Action | Reason |
|---|---|---|
| `edit` | **Dropped** | Enables self-execution: writing scripts, editing .docs/ files, modifying subagents. All writes now go through subagent delegation. Subagent editing moves to Feature Request workflow. |
| `search` | **Dropped** | Enables "let me search and answer directly" behavior. AccountTracker reads known paths from .docs/_index.md — doesn't need search. |

### What's Kept and Why

| Tool | Reason |
|---|---|
| `read` | Must read .docs/ context, instructions, skills before delegating |
| `agent` | Core capability — delegates to subagents via runSubagent |
| `chrisdias.promptboost/promptBoost` | Step 0 of every delegation — boost user's prompt |
| `todo` | Task tracking for multi-phase workflows |
| `vscode/memory` | Session and persistent memory |

---

## Pillar 2: Pushback Gate — Mandatory Pre-Execution Checkpoint

### The 3-Question Gate (before every action)

**Gate 1: "Does this map to a subagent?"**  
Check the Intent Routing Table. Clear map → delegate. Partial map → delegate with tight scoping. Zero map → Pushback.

**Gate 2: "Am I about to do domain work myself?"**  
If the next action is anything other than `read_file`, `runSubagent`, `promptBoost`, `manage_todo_list`, or `memory` → STOP. This is self-execution. Reroute to correct subagent, or Pushback.

**Gate 3: "Can the subagent actually do this?"**  
Check the subagent's domain scope. If the request asks for something outside the subagent's tools and instructions → Pushback.

### AccountTracker Pushback Format

```
⚠️ AccountTracker pushback

I can't map this request to any of my subagents.

What you asked: "[user's request]"

Subagents evaluated:
  - EmailTracker: ❌ [reason]
  - TeamsTracker: ❌ [reason]
  - CRMOperator: ❌ [reason]
  - [... each relevant subagent]

Why none fit: [specific reason — missing tool, wrong domain, capability gap]

Recommendation: This needs a [new subagent / feature enhancement / manual action].
  - Domain: [what it would cover]
  - Tools: [which MCP servers or capabilities needed]
  - Trigger: [when to route to it]

Want me to draft a feature request for this?
```

### Subagent Pushback Format (returned to AccountTracker)

```
⚠️ [SubagentName] scope boundary

I received a task outside my domain.

Task received: "[delegation prompt summary]"
My domain: [what I do]
Why this doesn't fit: [specific reason]

Suggested reroute: This looks like a job for [other subagent] because [reason].
Or it may need a new subagent with [capability].
```

---

## Pillar 3: Database Store Decision Tree

### Known vs New Entity Logic

```
User prompt → AccountTracker loads context (.docs/_index.md, _data/<Account>/)
                    │
                    ▼
         Is this entity (chat/thread/email) already in .docs/?
                    │
          ┌─────────┴─────────┐
         YES                  NO
          │                    │
          ▼                    ▼
   KNOWN ENTITY           NEW ENTITY
   Delegate with           Delegate with
   Mode 1:                 Mode 2:
   "Execute + Store"       "Execute + Return Only"
          │                    │
          ▼                    ▼
   Subagent fetches,      Subagent fetches,
   updates .docs/,        returns summary to
   returns summary        AccountTracker
          │                    │
          ▼                    ▼
   Present to user        Is this CRM or GHCP data?
   (done)                      │
                        ┌──────┴──────┐
                       YES            NO
                        │              │
                        ▼              ▼
                   Auto-store      Present summary +
                   (CRM/GHCP       recommendation:
                   exception)      "Worth tracking because X"
                        │          or "Low value — Y"
                        ▼              │
                   Delegate to   ┌─────┴─────┐
                   subagent:   User says   User says
                   Mode 1      "Yes"       "No"
                        │        │           │
                        ▼        ▼           ▼
                   Done     Delegate to    Done —
                            subagent:      no storage
                            Mode 1 with
                            curated data
```

### Two-Mode Delegation

**Mode 1 — Execute + Store** (known entities, CRM, GHCP):
> "Search emails for Contoso. Contacts: [...]. Update `.docs/_data/CONTOSO/email-threads.md` with findings. Update `_manifest.md` and `_index.md` per write protocol. If you return results without updating these files, you have failed the task."

**Mode 2 — Execute + Return Only** (new non-CRM/non-GHCP entities):
> "Search emails for Contoso. Contacts: [...]. Return results ONLY — do NOT update any `.docs/` files. I will evaluate and decide on storage."

### Autonomy Rules

| Data Source | Known Entity | New Entity |
|---|---|---|
| Email | Autonomous — execute + store | Ask user — present summary + recommend |
| Teams | Autonomous — execute + store | Ask user — present summary + recommend |
| Calendar | Autonomous — execute + report | Ask user — present summary + recommend |
| GHCP/Seats | Autonomous — execute + store | Autonomous — always store |
| CRM | Autonomous — execute + store | Autonomous — always store (CRM exception) |
| LinkedIn/People | Autonomous — execute + return | Ask user — present summary + recommend |

### What "Ask User" Looks Like

```
📋 New entity detected — not currently tracked in .docs/

Chat: Group chat with Anna Noftle, Aaron Dunlap, Len Volkov
Topic: GHCP rollout timeline for Lumen
Key content: Anna confirmed Q3 pilot target, asked about training resources
Strategic relevance: HIGH — directly related to Lumen Tranche A milestone

Recommendation: Store this. It links to an active milestone and contains 
a customer commitment date.

Store in .docs/_data/LUMEN/ or skip?
```

---

## Pillar 4: Adaptive Subagent Management — Feature Request Only

### Old Pattern (removed)
AccountTracker silently edits subagent .agent.md files for "slight changes" — introduces drift, bypasses review.

### New Pattern
AccountTracker identifies gaps → presents **Feature Request** to user → user plans, implements, and tests.

```
📋 Feature Request — [SubagentName] enhancement

Gap identified: [what the subagent can't do today]
Request: "[user's original prompt]"
Closest subagent: [name] — but it lacks [specific capability]

Proposed enhancement:
  - Add: [new tool / workflow / output format]
  - Change: [specific section of the .agent.md]
  - Risk: [what could break]

This keeps the agent fleet intentional. Want to plan this together?
```

---

## Implementation Checklist

### File: `.github/agents/AccountTracker.agent.md`

| Change | Section | Type |
|---|---|---|
| Update frontmatter tools | `tools:` line | Remove `edit`, `search` |
| Add Pushback Protocol section | New `## Pushback Protocol` | New section after Guardrails |
| Add Store Decision Tree section | New `## Database Store Decision Tree` | New section before Delegation Protocol Step 3 |
| Replace Adaptive Subagent Management | `## Adaptive Subagent Management` | Replace "Slight Change" with Feature Request pattern |
| Update Autonomous Execution Policy | `## Autonomous Execution Policy` | Add new-entity exception |
| Update Guardrails | `## Guardrails` | Add self-execution detection rule |

### File: `.github/agents/email-tracker.agent.md`

| Change | Type |
|---|---|
| Add `## Scope Boundary` section | New section |
| Does: Email search, thread tracking, follow-up detection, buddy emails |
| Does NOT: Teams messages, calendar events, CRM writes, browser automation, email composition/drafts |

### File: `.github/agents/teams-tracker.agent.md`

| Change | Type |
|---|---|
| Add `## Scope Boundary` section | New section |
| Does: Teams chat/channel retrieval, unanswered detection, message send |
| Does NOT: Email search, calendar events, CRM operations, browser automation |

### File: `.github/agents/ghcp-analyst.agent.md`

| Change | Type |
|---|---|
| Add `## Scope Boundary` section | New section |
| Does: Excel seat report analysis, portfolio ranking, cohort classification |
| Does NOT: Browser extraction, CRM operations, email/Teams, report creation |

### File: `.github/agents/browser-extractor.agent.md`

| Change | Type |
|---|---|
| Add `## Scope Boundary` section | New section |
| Does: PBI report extraction, LinkedIn research, browser automation |
| Does NOT: Email, Teams, CRM, calendar, Excel analysis |

### File: `.github/agents/crm-operator.agent.md`

| Change | Type |
|---|---|
| Add `## Scope Boundary` section | New section |
| Does: Milestone/task/opportunity reads and writes, pipeline health |
| Does NOT: Email, Teams, calendar, browser, seat analysis |

### File: `.github/agents/email-composer.agent.md`

| Change | Type |
|---|---|
| Add `## Scope Boundary` section | New section |
| Does: Draft creation from templates, bulk email campaigns |
| Does NOT: Email search, Teams, CRM, calendar |

### File: `.github/agents/calendar-tracker.agent.md`

| Change | Type |
|---|---|
| Add `## Scope Boundary` section | New section |
| Does: Meeting search, availability, event creation |
| Does NOT: Email, Teams, CRM, browser, seat analysis |

### File: `.github/agents/microsoft-researcher.agent.md`

| Change | Type |
|---|---|
| Add `## Scope Boundary` section | New section |
| Does: People/org research via WorkIQ |
| Does NOT: Email, Teams, CRM, calendar, browser — anything outside WorkIQ |

---

## What We're NOT Changing

- Delegation Protocol Steps 0-6 (already solid — adding store decision tree integrates naturally)
- Intent Routing Table (already comprehensive)
- Fleet Mode / Parallelization rules
- Contact Resolution Hierarchy
- Tier + Tranche Framework
- Subagent internal workflows (only adding scope boundaries at the top)
- Python venv protocol
- Escalation rules (pushback supplements, doesn't replace)

---

## v5.1: MCP Server Consolidation — Remote → Local

**Status**: Implemented ✅  
**Date**: March 4, 2026  
**Problem**: Two remote HTTP MCP servers (`agent365-teamsserver`, `agent365-m365copilot`) introduced API rate limits, throttling, auth token dependencies, and unreliable fallback chains across the agent fleet.  
**Solution**: Replace both remote servers with local stdio-based MCP servers. Email uses `outlook-local` (Outlook COM automation). Teams uses `teams-local` (local LevelDB/SSTable cache reader). No more remote API calls for email or Teams operations.

### What Changed

| Before (Remote) | After (Local) | Benefit |
|---|---|---|
| `agent365-m365copilot` — HTTP, cloud-hosted, Graph API | `outlook-local` — stdio, Outlook COM, zero API calls | No rate limits, no auth tokens, full email bodies, instant |
| `agent365-teamsserver` — HTTP, cloud-hosted, Graph API | `teams-local` — stdio, local Teams cache (LevelDB + Snappy) | No rate limits, no auth tokens, 62K+ messages available offline |
| M365 throttling at ~30 calls/session | Unlimited local reads | Portfolio-wide batch operations now feasible in single session |
| Cloud fallback chains (outlook-local → agent365-m365copilot) | Single tool per domain, no fallback needed | Simpler error handling, no phantom draft creation |

### Servers Removed

| Server | Status in `mcp.json` | Reason |
|---|---|---|
| `agent365-teamsserver` | Commented out | Replaced by `teams-local` |
| `agent365-m365copilot` | Commented out | Replaced by `outlook-local` (email) + `agent365-wordserver` (document links) |

### Servers Preserved

| Server | Purpose |
|---|---|
| `msx-crm` | MSX/Dynamics OData API — no local equivalent |
| `agent365-calendartools` | Calendar events, scheduling — no local equivalent |
| `agent365-wordserver` | Word document reading, cross-link resolution |
| `workiq` | People/org research, role lookups, manager chain |
| `outlook-local` | Email search + draft composition via Outlook COM |
| `teams-local` | Teams chat/channel retrieval from local cache |
| `linkedin` | LinkedIn company/people research |

### API Limitations Eliminated

| Limitation | Was | Now |
|---|---|---|
| Email search rate limit | M365 Graph throttling via `agent365-m365copilot` | **Eliminated** — Outlook COM has zero rate limits |
| Teams message retrieval limit | Graph API pagination + throttling via `agent365-teamsserver` | **Eliminated** — local SSTable parsing reads all cached messages |
| Auth token expiry for email/Teams | Required valid Graph tokens, token refresh logic | **Eliminated** — COM uses running Outlook session, cache reader needs no auth |
| Fallback chain complexity | `outlook-local` → `agent365-m365copilot` for email; `teams-local` → `agent365-teamsserver` for Teams | **Eliminated** — single tool per domain, failure = report error |
| Session call budget (~30 calls for WorkIQ + M365) | Shared budget across WorkIQ, M365 Copilot, Teams Server | **Reduced** — only WorkIQ uses remote API; email + Teams are unlimited local |
| Phantom draft creation | `agent365-m365copilot` reported success but draft didn't appear | **Eliminated** — COM writes directly to local mailbox, always verifiable |

### Files Updated (20+ files across agents, instructions, skills)

| Scope | Files | Change |
|---|---|---|
| MCP config | `.vscode/mcp.json` | Commented out `agent365-teamsserver` + `agent365-m365copilot` |
| Agents | `teams-tracker`, `email-tracker`, `email-composer`, `AccountTracker`, `microsoft-researcher` | Replaced remote server references with local equivalents |
| Instructions | `copilot-instructions.md`, `intent.instructions.md`, `msx-role-shared-runtime.md` | Updated MCP server tables + routing |
| Skills | 4 role skills, `outlook-compose`, `outlook-lookup`, `workiq-people-research`, `m365-query-scoping` (renamed from `workiq-query-scoping`) | Updated tool references + renamed confusing skill |
| README | `README.md` | Updated server table + subagent descriptions |

### Remaining Remote Dependencies

Only these operations still require cloud API calls:
- **Calendar**: `agent365-calendartools` — no local calendar cache exists
- **Word documents**: `agent365-wordserver` — resolves document links from email/Teams
- **People research**: `workiq` — internal Microsoft/GitHub org lookups (~30 calls/session limit still applies)
- **CRM operations**: `msx-crm` — Dynamics 365 OData API (always remote)
- **LinkedIn**: `linkedin` — external company/people data

---

## v5.2: Skill Rename — `workiq-query-scoping` → `m365-query-scoping`

**Status**: Implemented ✅  
**Date**: March 4, 2026  
**Problem**: The skill `workiq-query-scoping` was named after WorkIQ, but it scopes queries across **all** M365 local and cloud MCP servers (`outlook-local`, `teams-local`, `agent365-calendartools`, `workiq`). With email and Teams now running locally, WorkIQ is just one of four servers — not the defining one.  
**Solution**: Rename to `m365-query-scoping` to accurately reflect its purpose.

### What Changed

| Item | Before | After |
|---|---|---|
| Folder | `.github/skills/workiq-query-scoping/` | `.github/skills/m365-query-scoping/` |
| SKILL.md `name:` | `workiq-query-scoping` | `m365-query-scoping` |
| README.md skill table | `workiq-query-scoping/SKILL.md` | `m365-query-scoping/SKILL.md` |

The skill's internal content (fact-map, two-pass retrieval strategy, MCP server routing, call budget awareness) is unchanged. Only the name and folder were updated.

---

## Expected Outcomes

1. **Tool restriction**: AccountTracker physically cannot run terminal commands, call MCP tools, or edit files — self-execution impossible
2. **Pushback gate**: Ambiguous requests get structured rejection with feature request proposals instead of improvisation
3. **Subagent boundaries**: Mis-routed delegations get caught at the subagent level with suggested reroutes
4. **Store decision tree**: .docs/ database stays high-signal — known entities auto-update, new entities get user judgment (except CRM/GHCP which always store)
5. **Feature request workflow**: Agent fleet evolves deliberately through planned enhancements, not random edits
6. **Zero API limits for email/Teams**: Local MCP servers eliminate rate limits, auth tokens, and throttling for the two highest-volume data sources — enabling portfolio-wide batch operations in a single session
