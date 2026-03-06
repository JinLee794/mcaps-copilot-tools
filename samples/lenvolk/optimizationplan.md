# Optimization Plan — mcaps-copilot-tools

> **Generated**: 2026-03-01 | **Revised**: 2026-03-04 (co-authored brainstorm with Len Volk + Claude Opus 4.6)
> **Status**: Phase 1 ✅ | Phase 2 ✅ | Phase 3 ✅ | Phase 4 ✅ | Phase 5 ✅ | Phase 6 ✅ | Phase 7 ✅

---

## Problem Statement

The SE (Len Volk) manages 35 customer accounts with one goal: **move MSX milestones from Uncommitted → Committed** to drive GHCP seat adoption. The agent system (AccountTracker + 8 subagents) is powerful but:

1. `.docs/` has 5 parallel folder trees per account (Customers, People, Meetings, Projects, Weekly) — most are empty scaffolding
2. Results are ephemeral — agent work dies when the chat session ends
3. WorkIQ rate limits (~30 calls/session) remain for people/org research; email and Teams are now unlimited via local MCP servers
4. No shared working document exists where user and agent can align on priorities
5. Terminology is inconsistent (CRM vs MSX vs Dynamics)

**The fix is not a complete restructuring**, it's:
- Consolidate the 5 trees into 1 per-account folder
- Add 3 user-facing dashboard files at `.docs/` root
- Cache MCP results inside per-account folders
- Create custom prompts so the user can drive workflows with one click

---

## Terminology Standard

| Term | Meaning | Use When |
|---|---|---|
| **MSX** | The CRM system (microsoftsales.crm.dynamics.com) | All milestone, opportunity, task, and account operations |
| **MSXI** | The insights/reporting layer (Power BI embedded msxinsights.microsoft.com) | GHCP seat reports, stack summaries, PBI data extraction |
| **MCP** | Model Context Protocol tools (msx-crm, outlook-local, teams-local, workiq, etc.) | Technical references to the tool layer |

**Stop using**: "CRM", "Dynamics", "D365", "Dynamics 365" in agent instructions, skills, and prompts. Replace with **MSX** everywhere.

---

## The Three-File Dashboard

These three files live at `.docs/` root. This is the user's entry point — the only files you need to browse before prompting the agent.

```
.docs/
  AccountReference.md          ← Portfolio roster: TPIDs, contacts, IDs
  FLAG.md                      ← Tranche data, audit items, data mismatches
  WeeklyActionPlan.md          ← Agent's weekly assessment + your notes
```

### AccountReference.md (existing — move from Customers/ to root)
Your cheat sheet for composing prompts. "Which account, which TPID, who's the SSP?" Quick-scan before you prompt.

### FLAG.md (existing — move from Customers/ to root)
Tranche classifications, GH AE audit, flagged accounts. The strategic overlay on the roster.

### WeeklyActionPlan.md (new)
**The shared working document between you and the agent.** Agent writes its weekly assessment here. You review, annotate, push back. This is where brainstorming happens.

Content structure:
```markdown
# Weekly Action Plan — 2026-W09

> Generated: 2026-03-03 | Data freshness: email 3/3, Teams 3/3, MSX 3/2, seats 2/27

## Portfolio Health
| Metric | This Week | Last Week | Δ |
|---|---|---|---|
| Total GHCP Seats | 71,100 | — | — |
| Portfolio Attach Rate | 52.2% | — | — |
| Accounts with Unanswered Threads | 4 | — | — |
| Milestones Uncommitted | 35 | — | — |
| Milestones Committed | 0 | — | — |

## Immediate Action (Red)
1. **CONDUENT** (TPID 41111524) — Zero seats, zero email activity 14 days. Going dark.
   - Action: Send intro email to SSP (Ryan Sullivan)
   - Tranche: A | Attach: 0%

## Follow-Up Needed (Yellow)
2. **COMCAST** (TPID 624606) — Unanswered email from Breslin (3 days)
   - Action: Reply with pilot metrics
   - Tranche: B | Attach: 56.8%

## On Track (Green)
3. **RELX GROUP** — 74% attach, strong QP pipeline
4. **Cox Corporate** — 74% attach, steady growth

## Blockers & Failures
- Teams search for DISH NETWORK returned 0 results (MCP timeout 3/2)
- Outlook COM fallback failed for AT&T (Outlook not running)

## Your Notes
<!-- Add your thoughts here — agent reads this on next run -->

```

---

## Consolidated Folder Structure

### Before (5 parallel trees, mostly empty)
```
.docs/
  Customers/COMCAST/COMCAST.md
  People/COMCAST/.gitkeep              ← empty
  Meetings/COMCAST/teams-chats-catalog.md
  Projects/COMCAST/.gitkeep            ← empty
  Weekly/COMCAST/                      ← empty or sparse
```

### After (1 folder per account, everything inside)
```
.docs/
  AccountReference.md                  ← YOUR DASHBOARD (moved from Customers/)
  FLAG.md                              ← YOUR DASHBOARD (moved from Customers/)
  WeeklyActionPlan.md                  ← NEW — shared working doc
  README.md                            ← existing

  Customers/
    COMCAST/
      COMCAST.md                       ← Enriched profile (Windstream-quality)
      collaborations.md               ← Contacts + threads (merged from People/)
      teams-catalog.md                 ← Teams data (merged from Meetings/)
      cache-email.md                   ← Agent-managed cache
      cache-teams.md                   ← Agent-managed cache
      cache-seats.md                   ← Agent-managed cache
    AT&T/
      AT&T.md
      collaborations.md
      ...
    ... (all 35 accounts)
    BillingSubscriptions.md            ← stays (billing reference)
    Template GHCP-Seats-report.xlsx    ← stays (MSXI template)

  Weekly/                              ← Portfolio-level seat reports only
    2026-02-27_GHCP-Seats-report.xlsx
    2026-02-27_GHCP-Seat-Opp.md
    ... (future weekly snapshots)

  Email-Templates/                     ← stays as-is
```

### What Gets Removed
| Folder | Action | Reason |
|---|---|---|
| `People/` | Merge content → per-account `collaborations.md`, then delete | Only Windstream-Unity has real data; rest are `.gitkeep` or minimal |
| `Meetings/` | Merge content → per-account `teams-catalog.md`, then delete | Content consolidates into account folder |
| `Projects/` | Merge content → per-account profile or sub-file, then delete | 100% `.gitkeep` scaffolding |
| `Weekly/<Account>/` subfolders | Delete empty ones; any content → per-account `cache-seats.md` | Portfolio reports stay at `Weekly/` root |
| All `.gitkeep` files | Delete everywhere | Dead scaffolding, not needed |

### Gold Standard: Windstream-Unity

The Windstream-Unity `collaborations.md` is the target quality for all accounts. It contains:
- Customer-side contacts with email domains and thread participation
- Microsoft/GitHub participants with org attribution
- Email thread catalog with dates, participants, and summaries
- Observations (who's engaged, who's absent, dual-domain contacts)
- Unanswered threads flagged with days waiting

The `enrich-account` prompt replicates this quality for any account.

---

## Caching Strategy

### Why Cache?
Email and Teams now use local MCP servers (outlook-local, teams-local) with zero rate limits. However, WorkIQ still caps at ~30 calls/session, calendar uses cloud API, and CRM is always remote. Caching remains valuable to avoid re-reading the same data across sessions and to provide an audit trail.

### Where Cache Lives
Inside each account folder, agent-managed. The user never needs to look at these files.

```
Customers/COMCAST/
  cache-email.md        ← Latest email search results
  cache-teams.md        ← Latest Teams search results
  cache-seats.md        ← Latest GHCP seat data from MSXI report
```

### Cache Format (markdown with timestamp header)
```markdown
<!-- cache-email.md -->
<!-- Last fetched: 2026-03-01T14:30:00Z | Source: outlook-local | Status: OK -->
<!-- Contacts searched: johnbreslin@, pidrag@, cm121212@, kamarcum@, padraignix@, nickismyname@ -->

| # | Subject | Date | From | To | Summary |
|---|---|---|---|---|---|
| 1 | Re: GHCP Expansion Pilot | 2026-02-28 | John Breslin | Len Volk, Chris Mallon | Pilot metrics requested |
| 2 | ... | ... | ... | ... | ... |
```

### Freshness Rules

| Data Type | Fetch Frequency | When Stale |
|---|---|---|
| Email threads | On-demand per account (or batch via prompt) | Agent states cache age in WeeklyActionPlan |
| Teams messages | On-demand per account | Agent states cache age |
| GHCP seat data | Weekly (Monday after MSXI refresh) | Agent flags "seat data from [date]" |
| MSX milestones | On-demand, always fresh for writes | Never cache for write operations |

### When Cache Fails
Agent surfaces failures in `WeeklyActionPlan.md` under **Blockers & Failures**:
- "Teams search for DISH NETWORK returned 0 results (MCP timeout 3/2)"
- "Outlook COM fallback failed for AT&T (Outlook not running)"
- "WorkIQ rate limit hit after 28 calls — remaining people lookups skipped"

### Troubleshooting Cache
When the user needs to reverse-engineer a bad result:
1. User asks: "Why did you say COMCAST has no unanswered threads?"
2. Agent reads `Customers/COMCAST/cache-email.md` → shows the raw cache
3. Agent explains: "Cache from 3/1 shows these threads. The one you're thinking of may have arrived after the cache date. Want me to refresh?"

---

## Custom Prompts

All prompts are **interactive** — the user picks scope (one TPID, multiple, or all). The agent never runs autonomously without user direction.

### New Prompts

| Prompt | Trigger | What It Does |
|---|---|---|
| `generate-weekly-plan` | "Generate this week's action plan" | Replaces `weekly-digest`. Reads cache + live data → builds `WeeklyActionPlan.md`. Asks: "Which accounts? (TPID, list, or all)" |
| `account-deep-dive` | "Deep dive on COMCAST" | Full account analysis: email, Teams, MSX milestones, GHCP seats, communication gaps. Asks for account name/TPID |
| `msxi-ghcp-report` | "Use MSXI to generate this week's GHCP Seats report" | Browser extraction from MSXI → populate template → save to `Weekly/`. Asks: "Which TPIDs? (list or all)" |
| `check-comms` | "Check communications for AT&T" | Email + Teams thread status: unanswered, response lag, going-dark alerts. Asks for account(s) |
| `msx-milestone-review` | "Review MSX milestones" | Milestone/task status from MSX: overdue, uncommitted, needs tasks. Asks for account(s) |
| `enrich-account` | "Enrich CONDUENT" | Build out account files to Windstream-Unity quality. Contacts, threads, observations. Asks for account(s) |
| `portfolio-snapshot` | "Give me the lay of the land" | Quick read of AccountReference.md + FLAG.md + latest seat data. Zero MCP calls — instant. Asks nothing, reads local files |

### Updated Existing Prompts

| Prompt | Change |
|---|---|
| `weekly-digest` | **Replaced** by `generate-weekly-plan` |
| `project-status` | Update paths to consolidated structure, MSX terminology |
| `create-person` | Update paths, use `collaborations.md` pattern instead of People/ |
| `prepare-meeting` | Update paths, MSX terminology, read from per-account folder |
| `process-meeting-notes` | Update paths, MSX terminology, write to per-account folder |
| `sync-project-from-github` | Keep as-is (GitHub-focused) |

---

## Migration Strategy

### Phase 1: Cleanup & Prep ✅ (2026-03-01)

1. ~~**Delete all `.gitkeep` files** across entire `.docs/` tree~~ ✔️ 181 files deleted
2. ~~**Move** `AccountReference.md` and `FLAG.md` from `Customers/` to `.docs/` root~~ ✔️
3. ~~**Create** `WeeklyActionPlan.md` at `.docs/` root (empty template)~~ ✔️
4. ~~**Delete empty account folders** in People/, Meetings/, Projects/, Weekly/ that contain no real content~~ ✔️ 125 empty dirs removed

### Phase 2: Content Consolidation (Per-Account) ✅ (2026-03-01)

For each of the 35 accounts:
1. ~~**Existing profile** (`Customers/<Account>/<Account>.md`) — stays, gets enriched~~ ✔️
2. ~~**People data** → create `Customers/<Account>/collaborations.md`~~ ✔️ Windstream-Unity → WINDSTREAM_COMMUNICATIONS/collaborations.md; AT&T → AT&T/collaborations.md. Portfolio files (LenVolkSE.md, Role-Descriptions.md, V-Team.md) moved to .docs/ root.
3. ~~**Meetings data** → create `Customers/<Account>/teams-catalog.md`~~ ✔️ 107 files migrated across 14 accounts. Catalog files renamed teams-chats-catalog.md → teams-catalog.md. Individual chat files preserved alongside catalogs.
4. ~~**Weekly data** → per-account seat data becomes `Customers/<Account>/cache-seats.md`~~ ✔️ Only Windstream-Unity had content (identical to Projects/Summary.md, already migrated as account-summary.md). Portfolio reports stay at Weekly/ root.
5. ~~**Projects data** → merge into account profile or create sub-file if substantial~~ ✔️ Windstream-Unity Azure-MCP-Server-Thread.md + Summary.md → WINDSTREAM_COMMUNICATIONS/

**Additional Phase 2 actions:**
- Created Customer folders for Lumen, T_Mobile, Verizon (had Meetings/ data but no Customer/ folder)
- Moved portfolio-level files to .docs/ root: ENRICHMENT-QUEUE.md, MEETINGS-STATUS.md

### Phase 3: Remove Empty Top-Level Folders ✅ (2026-03-01)

After merging content:
1. ~~Delete `People/`~~ ✔️ Removed (5 files migrated: 2 per-account → collaborations.md, 3 portfolio → .docs/ root)
2. ~~Delete `Meetings/`~~ ✔️ Removed (109 files: 107 per-account migrated to Customers/, 2 portfolio → .docs/ root)
3. ~~Delete `Projects/`~~ ✔️ Removed (2 files migrated to WINDSTREAM_COMMUNICATIONS/)
4. ~~Clean up `Weekly/Windstream-Unity/`~~ ✔️ Removed (content was duplicate of Projects/, already migrated). Weekly/ root preserved with portfolio reports.

**Additional Phase 2→3 work:** Created `collaborations.md` + `teams-catalog.md` stubs for all 38 accounts (pre-seeded with SSP/GH AE from AccountReference.md).

**Final .docs/ structure:**
```
.docs/
  AccountReference.md, FLAG.md, WeeklyActionPlan.md    ← Dashboard
  ENRICHMENT-QUEUE.md, MEETINGS-STATUS.md               ← Operations
  LenVolkSE.md, Role-Descriptions.md, V-Team.md         ← Portfolio reference
  README.md
  Customers/          ← 38 account folders, each with profile + collaborations.md + teams-catalog.md
  Email-Templates/    ← Email templates
  Weekly/             ← Portfolio-level seat reports only
```

### Phase 4: Update Agent & Instruction References ✅ (2026-03-01)

Audit and update all files that reference `.docs/` paths:
- ~~`AccountTracker.agent.md` — path references to new locations~~ ✔️ People/ → Customers/<Account>/collaborations.md, Meetings/ → teams-catalog.md, Projects/ removed, V-Team.md → .docs/ root, AccountReference.md/FLAG.md → .docs/ root
- ~~`email-tracker.agent.md` — People/ references → Customers/<Account>/collaborations.md~~ ✔️
- ~~`teams-tracker.agent.md` — Meetings/ references → Customers/<Account>/teams-catalog.md~~ ✔️
- ~~`calendar-tracker.agent.md` — V-Team.md and Meetings/ path updates~~ ✔️
- ~~`microsoft-researcher.agent.md` — V-Team.md path update~~ ✔️
- ~~`copilot-instructions.md` — People/ → collaborations.md path~~ ✔️
- ~~`local-notes.instructions.md` — folder structure rewritten for consolidated layout~~ ✔️
- ~~`outlook-lookup/SKILL.md` — People/ → collaborations.md~~ ✔️
- ~~4 prompt files (process-meeting-notes, prepare-meeting, create-person, sync-project-from-github)~~ ✔️
- ~~AccountReference.md — Meetings/ reference updated~~ ✔️
- ~~email-composer.agent.md, ghcp-analyst.agent.md — AccountReference.md path to .docs/ root~~ ✔️
- ~~outlook-compose/SKILL.md, gh-stack-browser-extraction/SKILL.md, gh-billing-subscription/SKILL.md — AccountReference.md path~~ ✔️
- ~~README.md — AccountReference.md paths + MSX terminology~~ ✔️
- ~~Email-Templates/Introduction.md — AccountReference.md path~~ ✔️
- ~~MSX terminology: "Dynamics 365" → "MSX" in agent/instruction/README user-facing text~~ ✔️ (kept "Dynamics 365" in technical OData references per plan)
- ~~crm-operator.agent.md — "Dynamics 365 / MSX" → "MSX" in description~~ ✔️

### Phase 5: Create Custom Prompts ✅ (2026-03-01)

1. ~~Create 7 new prompts in `.github/prompts/`~~ ✔️ generate-weekly-plan, account-deep-dive, msxi-ghcp-report, check-comms, msx-milestone-review, enrich-account, portfolio-snapshot
2. ~~Update existing prompts (paths, MSX terminology, vault references)~~ ✔️ project-status updated; create-person, prepare-meeting, process-meeting-notes, sync-project-from-github already updated in Phase 4
3. ~~Delete `weekly-digest.prompt.md` (replaced by `generate-weekly-plan`)~~ ✔️

### Phase 6: Pilot & Validate ✅ 2026-03-01

- ✅ Run `portfolio-snapshot` — validated all local file reads work with consolidated structure
- ✅ Run `enrich-account` on 3 pilot accounts (COMCAST, CONDUENT, WINDSTREAM) — EmailTracker + TeamsTracker enrichment complete, Agent Insights updated, contact corrections applied
- ✅ Run `generate-weekly-plan` — WeeklyActionPlan.md populated with email/Teams/MSX signals, 5 immediate actions, 12 follow-up items identified
- Findings: cache-email/teams/seats files not yet generated (enrichment lives in profiles/collaborations); future runs should write cache files for the prompt workflow

### Phase 7: MCP Server Consolidation ✅ (2026-03-04)

Replaced remote HTTP MCP servers with local stdio-based alternatives. Email and Teams operations now have zero API rate limits.

1. ~~**Comment out** `agent365-teamsserver` and `agent365-m365copilot` in `.vscode/mcp.json`~~ ✔️
2. ~~**Replace all references** across 20+ agent/instruction/skill/README files~~ ✔️
   - `agent365-teamsserver` → `teams-local` (local Teams cache via LevelDB/SSTable)
   - `agent365-m365copilot` → `outlook-local` (email via Outlook COM) + `agent365-wordserver` (document links)
3. ~~**Remove fallback chains** — email-composer no longer falls back to cloud MCP; single tool per domain~~ ✔️
4. ~~**Update MCP server tables** in copilot-instructions.md, README.md, intent.instructions.md~~ ✔️
5. ~~**Preserve** `workiq` for people/org research, `agent365-calendartools` for calendar, `agent365-wordserver` for document resolution~~ ✔️

**Eliminated API limitations:**
- Email search: M365 Graph throttling → zero (Outlook COM, unlimited)
- Teams retrieval: Graph API pagination + throttling → zero (local SSTable, 62K+ messages)
- Auth token expiry for email/Teams → eliminated (COM uses running session, cache needs no auth)
- Phantom draft creation (`agent365-m365copilot` reporting false success) → eliminated
- Session call budget impact: only WorkIQ (~30/session) still has remote API limits for the agent fleet

6. ~~**Rename skill** `workiq-query-scoping` → `m365-query-scoping` (folder, SKILL.md name, README reference)~~ ✔️ Name was misleading — skill scopes queries across all M365 servers, not just WorkIQ.

See `optimizationplanv5-agents.md` § v5.1–v5.2 for detailed server mapping, file change inventory, and skill rename.

---

## Observability (Troubleshooting)

When something seems wrong, the user asks the agent. The agent walks through:

1. **WeeklyActionPlan.md** → Blockers & Failures section shows what failed
2. **Per-account cache files** → Raw cached data shows exactly what was fetched and when
3. **Agent explains** → "Cache from 3/1 used these contacts. The thread you're looking for may have arrived after. Want me to refresh?"

No separate audit folder needed. The cache files ARE the audit trail. Keep it simple.

---

## Instruction/Skill Updates

| File | Change | Reason |
|---|---|---|
| `copilot-instructions.md` | Replace "CRM" → "MSX" throughout; update `.docs/` section | Terminology + structure |
| `local-notes.instructions.md` | Rewrite for consolidated folder structure | Documents the new layout |
| `msx-role-and-write-gate.instructions.md` | Replace "CRM" → "MSX" in user-facing language | Terminology |
| `crm-entity-schema.instructions.md` | Keep "CRM" for technical OData references only | API layer is still Dynamics CRM OData |
| All agent `.agent.md` files | Update `.docs/` path references | Structure change |
| `outlook-lookup` + `outlook-compose` skills | Consider merging into `email-automation` | Same COM automation layer |
| 4 role skills (SE, CSA, CSAM, Specialist) | Keep separate, load only via CRMOperator | Roles only matter for MSX writes |

---

## Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Broken agent paths after migration | 🔴 High | Phase 4 audits ALL files for `.docs/` references before deleting old folders |
| Data loss during folder removal | 🟡 Medium | Phase 2 copies first, Phase 3 deletes only verified-empty or fully-merged folders |
| Cache goes stale without user noticing | 🟡 Medium | Timestamp headers on every cache file; WeeklyActionPlan.md states data freshness |
| Rate limits during batch operations | � Low | Email + Teams are now local (unlimited). Only WorkIQ (~30/session), calendar, and CRM have remote API limits. Tranche-based batching still applies for those. |
| Prompt format doesn't match workflow | 🟢 Low | Pilot with 3 accounts, iterate before full rollout |

---

## Execution Order

| Phase | What | Depends On | Status |
|---|---|---|---|
| 1 | Cleanup: delete `.gitkeep`, move dashboard files, create `WeeklyActionPlan.md` | Nothing | ✅ 2026-03-01 |
| 2 | Content consolidation: merge People/Meetings/Projects into per-account folders | Phase 1 | ✅ 2026-03-01 |
| 3 | Remove empty folders: People/, Meetings/, Projects/ | Phase 2 | ✅ 2026-03-01 |
| 4 | Update agent/instruction references + MSX terminology | Phase 3 | ✅ 2026-03-01 |
| 5 | Create/update custom prompts | Phase 4 | ✅ 2026-03-01 |
| 6 | Pilot: enrich 3 accounts, generate weekly plan, validate | Phase 5 | ✅ 2026-03-01 |
| 7 | MCP consolidation: replace remote agent365 servers with local MCP (email + Teams) | Phase 4 | ✅ 2026-03-04 |

---

## What This Changes for Your Daily Workflow

### Before (today)
```
You: Open .docs/ → see 7 folders → dig into Customers/ → find AccountReference.md
You: Prompt agent → agent live-fetches everything → results in chat → lost next session
You: Want to check comms → have to explain what you need each time
```

### After (optimized)
```
You: Open .docs/ → see 3 files: AccountReference.md, FLAG.md, WeeklyActionPlan.md
You: Quick-scan → know exactly how to compose your prompt
You: Pick a custom prompt → "check-comms" → "COMCAST" → done
You: Agent writes findings to cache + WeeklyActionPlan.md → persists across sessions
You: Monday morning → "generate-weekly-plan" → "all" → full portfolio assessment saved
```

---

*Plan co-authored by Len Volk + Claude Opus 4.6 on 2026-03-01. Ready for phased implementation — say "start phase 1" to begin.*
