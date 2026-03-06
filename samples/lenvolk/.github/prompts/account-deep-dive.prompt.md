---
description: "Full account analysis: email, Teams, MSX milestones, GHCP seats, communication gaps, and risk signals for a single account."
---

# Account Deep Dive

Comprehensive single-account analysis combining local cache, live MSX data, M365 communications, and GHCP seat metrics. Surfaces risks, gaps, and next actions.

## Interaction

**Ask the user:** "Which account? Enter a name or TPID."

## Workflow

### Step 1 — Resolve Account

- Read `.docs/AccountReference.md` to resolve name/TPID → account folder name, SSP, GH AE, OppIDs, MilestoneIDs, **Tier** (Strategic/Major), **Tranche** (A/B/C).
- Read `.docs/_data/<Account>/state.md` → flags, tranche rationale, milestones, billing subscriptions.
- Read `.docs/_data/<Account>/contacts.md` → full contact roster, email domains, v-team roles.
- Read `.docs/_data/<Account>/email-threads.md` → email thread catalog.
- Read `.docs/_data/<Account>/teams-threads.md` → Teams channel/chat catalog.
- Read `.docs/_data/<Account>/insights.md` → agent observations, strategic notes.

### Step 2 — Live Data Collection (parallel subagent delegation)

Delegate to **all applicable subagents in parallel**:

**EmailTracker** — email communication health:
- "Search for all recent email threads with known contacts from contacts.md for {account}. Use ALL contacts: {contacts list}. Customer domains: {domains from contacts.md}. Flag unanswered threads (>5 business days), going-dark signals (>10 days no touchpoint). Account: {account}, TPID: {TPID}, Tranche: {tranche}. Execute fully autonomously. Do not prompt the user."

**TeamsTracker** — Teams communication health:
- "Search for recent Teams messages in known channels/chats from teams-threads.md for {account}. Flag unanswered threads, stale channels. Execute fully autonomously. Do not prompt the user."

**CRMOperator** — MSX milestone health:
- "Check milestone health for {account} (TPID: {TPID}). Use `find_milestones_needing_tasks` and `get_milestone_activities` for active milestones. Surface: overdue milestones, milestones without tasks, uncommitted milestones, status mismatches. Execute fully autonomously. Do not prompt the user."

**GHCPAnalyst** — GHCP seat analysis (if seat data exists):
- "Analyze GHCP seat data for {account}. Read latest weekly report from .docs/Weekly/. Report seat whitespace, attach rate, week-over-week movement. Execute fully autonomously. Do not prompt the user."

**CalendarTracker** — recent meeting activity:
- "Find meetings involving {account} or {contacts} in the last 14 days. Report key decisions, open questions, and next meeting if scheduled. Account: {account}, TPID: {TPID}. Execute fully autonomously. Do not prompt the user."

**MicrosoftResearcher** — role coverage gaps (if contacts.md shows open roles):
- "Look up the current CSAM, CSA, and AM assigned to {account} (TPID: {TPID}). Check if there are coverage gaps vs. the contacts.md roster. Execute fully autonomously. Do not prompt the user."

### Step 3 — Cross-Validate Recency

After subagent results return, cross-validate email/Teams recency:
- Compare EmailTracker's "most recent email" date against the thread catalog in email-threads.md.
- If email-threads.md documents a more recent thread, re-delegate to EmailTracker with that thread's exact subject + sender + recipients.
- This prevents false recency claims when M365 search misses emails with generic subjects.

### Step 4 — Synthesize & Report

Present to user:

```markdown
## Account Deep Dive — {Account Name}

*Generated: {timestamp} | TPID: {TPID} | Tier: {Strategic/Major} | Tranche: {tranche}*

### Communication Health
| Channel | Last Activity | Status | Details |
|---|---|---|---|
| Email | {date} | {OK / Unanswered / Going Dark} | {thread subject} |
| Teams | {date} | {OK / Stale / No Channels} | {channel/chat name} |

### Unanswered Threads
| # | Channel | Subject | Waiting Since | Days |
|---|---|---|---|---|
| 1 | Email | {subject} | {date} | {N} |

### MSX Milestone Status
| Milestone | Status | Date | Tasks | Risk |
|---|---|---|---|---|
| {name} | {On Track / Overdue / No Tasks} | {date} | {count} | {flag} |

### GHCP Seats
| Metric | Value |
|---|---|
| Current Seats | {N} |
| Seat Opportunity | {N} |
| Attach Rate | {%} |
| WoW Change | {+/- N} |

### Risk Summary
- 🔴 {critical risks}
- 🟡 {watch items}
- 🟢 {healthy signals}

### Recommended Actions
1. {specific next action with owner}
2. {specific next action}
```

### Step 5 — Update Account Profile

Append key findings to `.docs/_data/<Account>/insights.md` with today's date.

If findings include measurable impact (e.g., caught overdue milestones, identified going-dark risk, surfaced unanswered executive threads, discovered seat churn):
- Append a brief entry under `## Connect Hooks` on the insights file.
- Include: date, hook type (Execution Integrity / Risk Mitigation / Customer Engagement), and one-line evidence.
- Only capture concrete, attributable findings — not speculation.

## Input

{user provides account name or TPID}
