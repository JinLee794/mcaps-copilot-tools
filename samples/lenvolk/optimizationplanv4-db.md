# Optimization Plan v4 — .docs/ Database Architecture

> **Status**: Implementation Complete — User Acceptance Testing
> **Created**: 2026-03-02
> **Implemented**: 2026-03-02
> **Author**: Agent (brainstormed with user)
> **Branch**: `optimizationplanv4-db` (2 commits ahead of main)
> **Predecessor**: optimizationplanv3-instructions.md (merged to main 2026-03-02)

---

## Problem Statement

The `.docs/` knowledge layer has grown to **236 files / 785 KB** across 38 customer folders. Current architecture forces agents to perform a "scavenger hunt" — reading 5-7 files to answer a single-account query, and 40+ files for portfolio operations. As accounts get enriched this week, we expect **~600 files / 2 MB** within a month.

### Current Pain Points

| Problem | Impact | Example |
|---|---|---|
| **No central entry point** | Agents read 5-7 files to orient on one account | EmailTracker reads collaborations.md + CustomerDomains.md + AccountReference.md before searching |
| **Contact data in 3 places** | Duplication, drift, extra reads | Contacts live in `<Account>.md`, `collaborations.md`, and `CustomerDomains.md` |
| **Portfolio queries scan all accounts** | 38+ reads for weekly plan generation | `generate-weekly-plan` reads every `<Account>.md` + FLAG + WeeklyActionPlan |
| **Flat portfolio files don't scale** | `FLAG.md`, `V-Team.md`, `CustomerDomains.md` grow linearly with accounts | Adding 10 accounts = 10 more rows in 3 separate files |
| **No freshness metadata** | Agent doesn't know which data is stale without reading files | Must open `collaborations.md` to check if email data is from today or last week |
| **Overlapping file content** | Same data in multiple files, no single source of truth | Customer contacts in `CONDUENT.md` Team table AND `collaborations.md` Customer Contacts table |

---

## Design Decisions (Brainstormed with User)

| Decision | Choice | Rationale |
|---|---|---|
| Architecture | **Approach A: Portfolio Index + Per-Account Manifest** | Best read performance at scale: 1 read for portfolio, 2 reads for single-account |
| Index maintenance | **Option 1: Real-time updates** | Agents update `_index.md` inline after every account data modification. Index is always trustworthy. |
| AccountReference.md | **Manual, user-owned** | User maintains it as personal reference. Agent reads but never writes. User asks agent to reconcile when needed. |
| Per-account file structure | **5 files + chats subfolder, split by write ownership** | Prevents agent write conflicts. Each file has a clear owner and growth pattern. |

---

## Target Architecture

### Directory Structure

```
.docs/
  AccountReference.md              ← USER-OWNED. Agent reads, never writes.
  _index.md                        ← AGENT-OWNED. Portfolio index. Agent's primary entry point.
  _schema.md                       ← File format specs for all data files (agent reference)
  _data/
    <ACCOUNT>/                     ← Per-account subfolder (naming: spaces→underscores)
      _manifest.md                 ← Enrichment status, freshness dates, file inventory
      contacts.md                  ← ALL contacts consolidated: MS + GH + Customer + domains + V-Team
      email-threads.md             ← Email thread catalog (subjects, dates, participants, status)
      teams-threads.md             ← Teams chat catalog (thread IDs, members, status)
      state.md                     ← Profile identity + milestones + seats + flags
      insights.md                  ← Agent findings, enrichment notes, connect hooks
      chats/                       ← Raw chat transcripts (group-chat-01.md, meeting-chat-01.md, ...)
  Weekly/                          ← Portfolio-wide weekly reports (unchanged)
    <YYYY-MM-DD>_<Report>.{md,xlsx}
  Email-Templates/                 ← Email templates (unchanged)
  Training-AND-Knowledge.md        ← Reference doc (unchanged)
  VBD-DevTools-Catalog.md          ← Reference doc (unchanged)
  LenVolkSE.md                     ← Reference doc (unchanged)
  Role-Descriptions.md             ← Reference doc (unchanged)
  Strategy-Leadership.md           ← Reference doc (unchanged)
  README.md                        ← Updated to describe new structure
```

### Files Eliminated (Absorbed Into New Structure)

| Old File | Absorbed Into | Rationale |
|---|---|---|
| `Customers/<Account>/<Account>.md` | `_data/<Account>/state.md` + `contacts.md` + `insights.md` | Split by purpose: identity/CRM → state, contacts → contacts, findings → insights |
| `Customers/<Account>/collaborations.md` | `_data/<Account>/contacts.md` + `email-threads.md` | Contacts separated from thread catalog. Contacts is the most-read file. |
| `Customers/<Account>/teams-catalog.md` | `_data/<Account>/teams-threads.md` | Renamed for consistency. Same content. |
| `FLAG.md` | Per-account `state.md` + `_index.md` flag column | Account flags live with account data. Portfolio view via index. |
| `CustomerDomains.md` | Per-account `contacts.md` (domains section) | Domains belong with contacts. One read for all contact data. |
| `V-Team.md` | Per-account `contacts.md` (V-Team roles section) | V-Team roles belong with contacts. Eliminates massive portfolio file. |
| `ENRICHMENT-QUEUE.md` | `_index.md` enrichment columns + `_manifest.md` | Enrichment status is metadata, not content. |
| `MEETINGS-STATUS.md` | `_index.md` enrichment columns + `_manifest.md` | Same — dashboard data belongs in the index. |
| `WeeklyActionPlan.md` | `Weekly/` (generated from `_index.md`) | Action plan is a generated view, not a source file. |
| `Customers/BillingSubscriptions.md` | Per-account `state.md` (billing section) | Billing data belongs with account state. |

---

## File Format Specifications

### `_index.md` — Portfolio Index

The agent's **single entry point**. Contains enough inline data that 80% of queries never need to read individual account files.

```markdown
# Portfolio Index

> Last updated: 2026-03-02T14:30Z | Accounts: 38 | Total data: 785 KB

## Dashboard

| Account | TPID | Tier | Tr | Seats | Attach% | WS | Email | Teams | MSX | Flag | Next Action |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CONDUENT | 41111524 | Strat | A | 0 | 0.0 | 3692 | 3/2 ✅ | 3/2 ✅ | 3/1 ✅ | No GH AE | Re-engage Balaji |
| COMCAST | 624606 | Strat | B | 16528 | 56.8 | 11055 | 3/1 ⚠️ | 3/1 ✅ | 3/1 ✅ | SSP gap | Create milestone tasks |
| PROLOGIS | 2920395 | Major | B | 30 | 7.6 | 233 | 2/24 ⚠️ | — | — | | Follow up Mehul |
...

## Legend
- **Email/Teams/MSX**: Date of last enrichment. ✅ = <3 days. ⚠️ = 3-7 days. 🔴 = >7 days. — = never enriched.
- **Flag**: Top critical issue. Full flags in per-account state.md.
- **Next Action**: Top priority action. Full plan in Weekly/ reports.
- **WS**: Remaining whitespace (seat opportunity minus current seats minus qualified pipeline).

## Enrichment Status

| Status | Count | Accounts |
|---|---|---|
| Fully enriched | 3 | CONDUENT, COMCAST, WINDSTREAM |
| Partially enriched | 10 | CBRE, Cox, Lumen, Disney, Nielsen, RELX, Verizon, Omnicom, T-Mobile, Paramount |
| Baseline only | 25 | ... |

## Account Lookup

| Account | Folder | OppID | MilestoneID | Files | Size |
|---|---|---|---|---|---|
| CONDUENT | _data/CONDUENT | 7-3GMXR4WXOY | 7-503619127 | 17 | 52 KB |
| COMCAST | _data/COMCAST | 7-3FZ5ZLN2EF | 7-503437401 | 9 | 48 KB |
...
```

**Key design choices**:
- Dashboard table is the first thing an agent sees. Sorted by Tranche (A→B→C) then alpha.
- Contains CRM identifiers (OppID, MilestoneID) so agents don't need AccountReference.md for lookups.
- Enrichment status summary replaces ENRICHMENT-QUEUE.md and MEETINGS-STATUS.md.
- Account Lookup table replaces the folder-discovery scavenger hunt.

### `_manifest.md` — Per-Account Manifest

Thin metadata file. Tells the agent exactly what data exists and how fresh it is.

```markdown
---
account: CONDUENT
tpid: 41111524
tier: Strategic
tranche: A
folder: CONDUENT
updated: 2026-03-02
---

# CONDUENT — Manifest

## File Registry

| File | Updated | Size | Writer | Status |
|---|---|---|---|---|
| contacts.md | 2026-03-02 | 8.2 KB | EmailTracker, TeamsTracker | Current |
| email-threads.md | 2026-03-02 | 4.1 KB | EmailTracker | Current |
| teams-threads.md | 2026-03-01 | 3.8 KB | TeamsTracker | Current |
| state.md | 2026-03-01 | 2.1 KB | CRMOperator | Current |
| insights.md | 2026-03-01 | 1.5 KB | Multiple | Current |
| chats/ | 2026-03-01 | 12 files (34 KB) | TeamsTracker | Current |

## Quick Facts
- SSP: Ryan Sullivan (ryansullivan@microsoft.com)
- GH AE: N/A (critical gap)
- Customer contacts: 13 discovered
- Email threads: 8 (Jan 12 – Mar 2)
- Teams threads: 12 (9 group, 3 meeting)
- Seats: 0 | Attach: 0% | Whitespace: 3,692
- Top flag: No GH AE assigned
```

**Key design choices**:
- YAML frontmatter for structured queries (`grep_search` for `tranche: A` across all manifests).
- Quick Facts section answers "what do I know about this account?" in one read.
- File Registry tells agent exactly what to read for any task — no guessing.

### `contacts.md` — Consolidated Contact File

**Most-read file in the system.** Read by EmailTracker, TeamsTracker, EmailComposer, CalendarTracker, and AccountTracker for every operation that involves people.

```markdown
# CONDUENT — Contacts

> Updated: 2026-03-02 | Sources: EmailTracker, TeamsTracker, CRM, V-Team

## Customer Contacts

| Name | Email | Domain | Role | Source | Email Threads | Teams Chats |
|---|---|---|---|---|---|---|
| Balaji Singh | Balaji.Singhy@conduent.com | conduent.com | Primary technical champion | Email | #1,2,3,5,6,7 | — |
| Aryan Shrestha | aryan.shrestha@conduent.com | conduent.com | Project Astro, infra | Teams | — | Project Astro |
...

## Microsoft Team

| Name | Email | Role | V-Team Role | Email Threads | Teams Chats |
|---|---|---|---|---|---|
| Ryan Sullivan | ryansullivan@microsoft.com | SSP | Account Executive | #1,2,4,8 | V-Team, Cloud&AI |
| Len Volk | levolkov@microsoft.com | SE | Solution Engineer | #1-8 | ALL |
| Mike Herlihy | mikeherlihy@microsoft.com | Account Leader | Account Director | — | V-Team, Cloud&AI |
...

## GitHub Team

| Name | Email | Role | Email Threads | Teams Chats |
|---|---|---|---|---|
| Chris George | cgeorge351@github.com | Seller/Engagement | #1,2,4 | V-Team, Z2A |
| Jim Jones | jim-iv@github.com | Agentic/TFS | #1,2,4,6,8 | — |
...

## Customer Email Domains

conduent.com, atlanticcs.net, dominiondms.com
```

**Key design choices**:
- ALL contacts in one file. No more 3-way lookup (collaborations + CustomerDomains + V-Team).
- Domain list at the bottom — EmailTracker reads one file for both contacts and domains.
- V-Team Role column integrates V-Team.md data.
- Source column tracks provenance (Email, Teams, CRM, V-Team).

### `email-threads.md` — Email Thread Catalog

**Written only by EmailTracker.** Prevents write conflicts.

```markdown
# CONDUENT — Email Threads

> Updated: 2026-03-02 | Source: EmailTracker (MCP + Outlook COM)

## Thread Catalog

| # | Subject | Date Range | From → To | Status | Summary |
|---|---|---|---|---|---|
| 1 | GitHub Copilot Z2A Training | Jan 12 – Jan 28 | Multi-party | ✅ Resolved | Z2A prep, QA focus |
| 2 | Re: GitHub Copilot Z2A Training | Jan 16 – Jan 28 | Multi-party | ✅ Resolved | Z2A logistics |
...
| 8 | Azure DevOps AI Work Item Assistant | Mar 2 | Len → Ryan, Jim, Cesar | 🔄 Active | ADO/TFS, Sameer interest |

## Unanswered Threads

| # | Subject | Last Sent | Days Waiting | Risk |
|---|---|---|---|---|
| 7 | Github Copilot | Feb 4 | 26 | 🔴 Champion going dark |

## Stats
- Total threads: 8
- Active: 2 (#7 unanswered, #8 active)
- Last email: 2026-03-02
- Longest silence: 16 days (Feb 13 – Mar 2, broken)
```

### `teams-threads.md` — Teams Chat Catalog

**Written only by TeamsTracker.** Thread IDs preserved for live retrieval.

```markdown
# CONDUENT — Teams Threads

> Updated: 2026-03-01 | Source: TeamsTracker (agent365-teamsserver MCP)

## Chat Index

| # | Type | Topic | Thread ID | Members | Last Activity | Status | File |
|---|---|---|---|---|---|---|---|
| 1 | Group | CNDT All V-Team | 668b9dce... | 23 | 2026-03-02 | Active | chats/group-chat-01.md |
| 2 | Group | CNDT Cloud & AI | d758b293... | 13 | 2025-10-22 | Dormant | chats/group-chat-02.md |
...

## Unanswered Messages

| Chat # | From | Date | Days | Summary |
|---|---|---|---|---|

## Stats
- Total chats: 12 (9 group, 3 meeting)
- Active: 4 (#1 V-Team, #4 Project Astro, #8 FY26 Weekly, #12 Z2A)
- Dormant: 8
- Last activity: 2026-03-02
```

### `state.md` — Account State

CRM milestones, seat data, flags, billing — everything about the account's **current status**.

```markdown
---
account: CONDUENT
tpid: 41111524
tier: Strategic
tranche: A
oppid: 7-3GMXR4WXOY
milestoneid: 7-503619127
---

# CONDUENT — State

## Identity
- **TPID**: 41111524
- **Tier**: Strategic | **Tranche**: A (Drive Adoption)
- **OppID**: 7-3GMXR4WXOY
- **MilestoneID**: 7-503619127

## Seat Snapshot (2026-02-27)

| Metric | Value |
|---|---|
| GHCP Seats | 0 |
| Qualified Pipeline | 63 |
| Remaining Whitespace | 3,692 |
| Total Seat Opportunity | 3,755 |
| Attach Rate | 0.0% |

## Tranche Rationale

Tranche A — Drive Adoption. Pure greenfield (0 seats, 0% attach). Largest untouched opportunity in portfolio at 3,755 total seats.

## Milestones

| MilestoneID | Name | Status | Commitment | Date | Use/mo | Owner |
|---|---|---|---|---|---|---|
| 7-503619127 | GitHub Copilot — CONDUENT | On Track | Uncommitted | 6/1/2026 | $1,000 | Len Volk |

## Flags

| Flag | Severity | Detail |
|---|---|---|
| No GH AE assigned | 🔴 Critical | 3,692 seat whitespace with no dedicated AE |
| No billing subscription | ⚠️ Warning | No rows in PBI adoption health report |
| Balaji unanswered | ⚠️ Warning | 26 days since Feb 4 email |
| Copilot vs Cursor eval | ⚠️ Warning | Active competitive evaluation |

## Billing
- Azure subscription: None found in PBI report
- Billing status: Unknown — may not be on metered billing

## Seat History
| Date | Seats | Attach% | WS | Source |
|---|---|---|---|---|
| 2026-02-27 | 0 | 0.0% | 3,692 | MSXI weekly report |
```

### `insights.md` — Agent Insights & Connect Hooks

**Append-only.** Any agent writes here after producing validated findings.

```markdown
# CONDUENT — Insights

## Enrichment Findings (2026-03-01)

- 7 email threads found (Jan 12 – Feb 13). Burst of 42 messages Jan 12–28, then 16-day silence.
- Balaji Singh = primary champion: Appears in 6/7 email threads.
- 11 total customer contacts discovered — significant for a "zero seat" account.
- Two disconnected engagement tracks: GHCP (email) vs Project Astro (Teams).
...

## Connect Hooks

### 2026-03-02 — V-Team Strategic Post
- **Circle**: Team/Org Outcomes
- **Evidence**: Responded to Mike Herlihy's "TOP OF MIND" V-Team post. Proposed Agent-in-a-Day session.
- **Attribution**: Len Volk → V-Team alignment, strategic acceleration
```

---

## Read Performance Comparison

### Single-Account Query: "What's happening at CONDUENT?"

| Step | Current | New |
|---|---|---|
| 1 | Read AccountReference.md (36 KB) | Read `_index.md` → find CONDUENT row |
| 2 | Read CONDUENT.md (4 KB) | Read `_manifest.md` → know what files exist |
| 3 | Read collaborations.md (8 KB) | Read `state.md` if milestones needed |
| 4 | Read teams-catalog.md (4 KB) | Done. |
| 5 | Read FLAG.md (6 KB) | — |
| 6 | Read CustomerDomains.md (5 KB) | — |
| **Total reads** | **6 (63 KB loaded)** | **2-3 (8-12 KB loaded)** |

### Portfolio Operation: "Generate weekly action plan"

| Step | Current | New |
|---|---|---|
| 1 | Read 38 × `<Account>.md` files | Read `_index.md` (1 file, ~15 KB) |
| 2 | Read FLAG.md | Dashboard table has flags inline |
| 3 | Read WeeklyActionPlan.md | Action column has next steps inline |
| **Total reads** | **40+ (200+ KB)** | **1 (15 KB)** |

### Email Search Setup: "Find latest email for CONDUENT"

| Step | Current | New |
|---|---|---|
| 1 | Read collaborations.md (contacts) | Read `_data/CONDUENT/contacts.md` (1 file) |
| 2 | Read CustomerDomains.md (domains) | Domains are in contacts.md |
| 3 | Read AccountReference.md (identifiers) | Identifiers are in `_index.md` (already loaded) |
| **Total reads** | **3 (49 KB)** | **1 (8 KB)** |

### Projection at Scale (1 Month: ~600 files, ~2 MB)

| Operation | Current Architecture | New Architecture |
|---|---|---|
| Single-account query | 6-8 reads, 80-100 KB | 2-3 reads, 10-15 KB |
| Portfolio weekly plan | 50+ reads, 400+ KB | 1 read, 20-25 KB |
| Email search | 3-4 reads, 60+ KB | 1 read, 10-15 KB |
| Full portfolio snapshot | 80+ reads (every file) | 1 read (index) |

---

## Write Protocol — Real-Time Index Updates

Every agent that modifies account data MUST update `_index.md` and `_manifest.md` in the same operation. This is the contract that keeps the index trustworthy.

### Write Sequence

```
1. Agent modifies account data file (e.g., email-threads.md)
2. Agent updates _manifest.md:
   - Update the modified file's row (date, size)
   - Update Quick Facts if relevant metrics changed
3. Agent updates _index.md:
   - Update the account's Dashboard row (date columns, flag, action)
   - Update Enrichment Status if tier changed
```

### Write Ownership Matrix

| File | Primary Writer(s) | What They Update |
|---|---|---|
| `contacts.md` | EmailTracker, TeamsTracker | New contacts, thread/chat cross-references |
| `email-threads.md` | EmailTracker | New threads, status changes, unanswered detection |
| `teams-threads.md` | TeamsTracker | New chats, activity dates, unanswered detection |
| `state.md` | CRMOperator, GHCPAnalyst | Milestones, seats, flags, billing |
| `insights.md` | Any agent | Append-only findings and connect hooks |
| `_manifest.md` | Any agent (after data write) | Freshness dates, file sizes |
| `_index.md` | Any agent (after data write) | Dashboard row for the modified account |
| `chats/*` | TeamsTracker | Raw transcripts (write-once) |

### Conflict Prevention

- Each data file has 1-2 designated writers. No two agents write to the same file simultaneously.
- `_manifest.md` and `_index.md` are updated sequentially after the data write completes.
- If an agent detects a stale `_index.md` (timestamp older than manifest), it refreshes the affected row.

---

## AccountReference.md — Reconciliation Protocol

`AccountReference.md` is user-owned. The agent reads it but never modifies it.

### When to Read AccountReference.md

- **New session start**: Agent compares AccountReference.md rows against `_index.md` rows. If AccountReference.md has an account not in the index, it means the user added a new account → agent creates the account's `_data/` folder and index entry.
- **User requests reconciliation**: User says "sync AccountReference with your index" → agent reads both, reports differences, and updates `_index.md` to match (for identity fields like TPID, OppID, contacts).

### What Comes From Where

| Field | Source of Truth | Reason |
|---|---|---|
| TPID, OppID, MilestoneID | AccountReference.md | User-managed identifiers |
| SSP Aliases, GH AE Aliases | AccountReference.md | User-managed contacts |
| Tier, Tranche | AccountReference.md (Classification table) | User/manager assignment |
| Seats, Attach, Whitespace | `_data/<Account>/state.md` | Agent-computed from weekly reports |
| Email/Teams freshness | `_data/<Account>/_manifest.md` | Agent-tracked |
| Flags | `_data/<Account>/state.md` | Agent-discovered |
| All discovered contacts | `_data/<Account>/contacts.md` | Agent-discovered from email/Teams/CRM |

---

## Migration Plan

### Phase 1: Scaffold (No Data Loss)

Create new directory structure alongside existing `Customers/` folder. No files deleted.

1. Create `.docs/_index.md` with Dashboard table (populated from current account profiles)
2. Create `.docs/_schema.md` with file format specs
3. Create `.docs/_data/` directory
4. For each of the 38 accounts:
   a. Create `_data/<Account>/` folder
   b. Create `_manifest.md` from current enrichment state
   c. Leave `Customers/<Account>/` intact

**Validation**: Both old and new structures coexist. Agents can read from either.

### Phase 2: Migrate Pilot (3 Tranche A Accounts)

Migrate CONDUENT, COMCAST, WINDSTREAM (most enriched accounts):

1. Split `<Account>.md` → `state.md` (identity, milestones, seats, flags) + `insights.md` (agent insights, connect hooks)
2. Split `collaborations.md` → `contacts.md` (all contacts + domains + V-Team roles) + `email-threads.md` (thread catalog)
3. Rename `teams-catalog.md` → `teams-threads.md`, move to new location
4. Move `chats/` contents (group-chat-*, meeting-chat-*) to `_data/<Account>/chats/`
5. Update `_manifest.md` with actual file registry
6. Update `_index.md` Dashboard row with enrichment dates
7. Absorb FLAG.md entries for these 3 accounts into their `state.md`
8. Absorb CustomerDomains.md entries into their `contacts.md`
9. Absorb V-Team.md entries into their `contacts.md`

**Validation**: Run single-account query and email search against new structure. Verify same data, fewer reads.

### Phase 3: Migrate Remaining Accounts

Repeat Phase 2 for all 35 remaining accounts. For baseline-only accounts (stub files), the migration is simpler — mostly creating `state.md` from the profile and empty placeholders for other files.

### Phase 4: Absorb Portfolio Files

1. Delete `FLAG.md` (all entries now in per-account `state.md` + `_index.md`)
2. Delete `CustomerDomains.md` (domains now in per-account `contacts.md`)
3. Delete `V-Team.md` (roles now in per-account `contacts.md`)
4. Delete `ENRICHMENT-QUEUE.md` (status now in `_index.md`)
5. Delete `MEETINGS-STATUS.md` (status now in `_index.md`)
6. Move `Customers/BillingSubscriptions.md` data into per-account `state.md`
7. Move `Customers/Template GHCP-Seats-report.xlsx` to `Weekly/`
8. Delete empty `Customers/` directory

### Phase 5: Update Agent Instructions

Update all agent files and instructions to reference new paths:

| File | Changes |
|---|---|
| `.github/agents/AccountTracker.agent.md` | Update Shared State section, contact resolution hierarchy, file paths |
| `.github/agents/email-tracker.agent.md` | Update contact file path, domain source |
| `.github/agents/teams-tracker.agent.md` | Update catalog file path |
| `.github/agents/crm-operator.agent.md` | Update state file path |
| `.github/agents/ghcp-analyst.agent.md` | Update seat data path |
| `.github/agents/email-composer.agent.md` | Update contact resolution |
| `.github/agents/calendar-tracker.agent.md` | Update contact resolution |
| `.github/instructions/local-notes.instructions.md` | Rewrite folder structure, conventions, file anatomy |
| `.github/copilot-instructions.md` | Update .docs/ references |
| `.github/prompts/*.prompt.md` | Update file paths in prompt templates |

### Phase 6: Create Index-Aware Skill

Create a new skill or instruction that teaches agents the **index-first protocol**:

1. Always read `_index.md` first for any portfolio or account operation
2. For single-account deep dives, read `_manifest.md` second
3. Only read specific data files when the operation requires that data
4. After modifying any data file, update `_manifest.md` and `_index.md`
5. On session start, compare AccountReference.md against `_index.md` for new accounts

### Phase 7: Validate & Clean Up

1. Run portfolio snapshot prompt → verify it works with 1 read
2. Run email search for 3 accounts → verify contacts.md is sufficient
3. Run weekly plan generation → verify index has all needed data
4. Delete old `Customers/` folder structure
5. Update `.docs/README.md` to document new architecture

---

## Risk Mitigation

| Risk | Mitigation |
|---|---|
| **Migration breaks agents mid-session** | Phases 1-2 keep old files intact. New structure coexists. Agents fall back to old paths. |
| **Index gets stale** | Real-time update contract. Manifest timestamps detect staleness. Agent refreshes on detection. |
| **New accounts not picked up** | Session-start reconciliation: agent compares AccountReference.md against _index.md. |
| **File too large** | Manifest tracks file sizes. If contacts.md exceeds 20 KB, split by org (MS/GH/Customer). |
| **Agent writes to wrong file** | Write ownership matrix enforced in agent instructions. Each file has designated writers. |

---

## Success Metrics

| Metric | Current | Target | How to Measure |
|---|---|---|---|
| Reads for portfolio operation | 40+ | 1 | Count tool calls in weekly plan generation |
| Reads for single-account query | 5-7 | 2-3 | Count tool calls in account deep dive |
| Reads for email search setup | 3 | 1 | Count tool calls in EmailTracker delegation |
| Stale data incidents | Unknown | 0 | Manifest freshness vs actual file dates |
| Duplicate contact data | 3 copies | 1 copy | Contacts only in contacts.md |

---

## Execution Order

| Phase | Scope | Dependencies | Effort | Status |
|---|---|---|---|---|
| 1. Scaffold | Create _index.md, _schema.md, _data/ folders, _manifest.md stubs | None | Low | ✅ Complete |
| 2. Migrate Pilot | CONDUENT, COMCAST, WINDSTREAM (3 accounts) | Phase 1 | Medium | ✅ Complete |
| 3. Migrate Remaining | 36 accounts | Phase 2 validated | Medium-High (bulk) | ✅ Complete |
| 4. Absorb Portfolio Files | Delete FLAG, CustomerDomains, V-Team, etc. | Phase 3 | Low | ✅ Complete |
| 5. Update Agent Instructions | All agent/instruction/prompt files | Phase 4 | Medium | ✅ Complete |
| 6. Create Index-Aware Skill | New instruction file | Phase 5 | Low | ✅ Complete |
| 7. Validate & Clean Up | End-to-end testing, old file removal | Phase 6 | Low | ✅ Complete |

---

## Implementation Log

### Commit 1: `7d5ef7a` — Phase 5-7 Bulk Implementation

**28 files changed** (355 insertions, 340 deletions). All agent, prompt, skill, and instruction files rewired from old `Customers/<Account>/` paths to new `_data/<Account>/` paths.

Key changes:
- All 9 agent files updated with new file paths, contact resolution hierarchies, and shared state references
- All 12 prompt files updated with new path templates
- 4 skill files (gh-billing-subscription, gh-stack-browser-extraction, ghcp-seat-opportunity, outlook-lookup) updated
- `local-notes.instructions.md` fully rewritten for new architecture
- New file created: `docs-index-protocol.instructions.md` (Tier 1 instruction for index-first protocol)
- `.docs/README.md` updated to document new architecture
- All 132 MCP server tests pass (no server code changed)

### Commit 2: `75bcbbf` — Post-Audit Terminology Fixes

**4 files changed** (5 insertions, 5 deletions). Found during comprehensive audit of all 29 `.github/` markdown files.

#### Issues Caught

The Phase 5 path-replacement sweep correctly updated all `.docs/` file paths, but missed **3 conceptual terminology references** that used old file names without full paths:

| File | Line | Old Text | Fixed To | Why Missed |
|---|---|---|---|---|
| `AccountTracker.agent.md` | ~236 | "People file" (3 occurrences in delegation protocol) | "email-threads.md" | Conceptual reference, not a path |
| `email-tracker.agent.md` | ~96 | "People File" in section heading + body | "Email Threads File" | Section heading, not a path |
| `microsoft-researcher.agent.md` | ~95 | "V-Team.md" in advice text | "contacts.md" | Inline file name mention, not a path |

#### Optional Cleanup Also Applied

| File | Line | Old Text | Fixed To |
|---|---|---|---|
| `docs-index-protocol.instructions.md` | ~19 | "FLAG.md" in comparative explanation | "per-account state files" |

### Audit Summary

- **29 files audited** (9 agents, 8 instructions, 12 prompts, 4 skills with .docs/ refs)
- **26 PASS** — no remaining old-path references
- **3 ISSUES** found and fixed (stale terminology, not paths)
- **Final grep sweep**: zero matches for any old pattern across entire `.github/` tree
- **Branch pushed** to `origin/optimizationplanv4-db`, ready for user acceptance testing
