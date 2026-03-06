---
description: "Generate this week's action plan by reading cached account data, live MSX/M365 signals, and FLAG tranche classification. Replaces weekly-digest."
---

# Generate Weekly Plan

Build or refresh `WeeklyActionPlan.md` — your prioritized action list for the week. Combines cached account data with live signals from MSX and M365.

## Interaction

**Ask the user:** "Which accounts? Enter TPID(s), account name(s), a FLAG tranche (e.g., 'Tranche 1'), or 'all'."

## Workflow

### Step 1 — Resolve Scope

- Read `.docs/AccountReference.md` for TPID → account name mapping, SSP, GH AE, **Tier** (Strategic/Major), **Tranche** (A/B/C).
- If user said "all", use every account from `_index.md`. If a tranche, filter by tranche from AccountReference.md. If specific names/TPIDs, resolve to `_data/` folder names.

### Step 2 — Read Cached Data Per Account

For each in-scope account, read available data files (skip missing ones silently):
- `.docs/_data/<Account>/email-threads.md` → latest email thread status, unanswered flags.
- `.docs/_data/<Account>/teams-threads.md` → latest Teams thread status.
- `.docs/_data/<Account>/state.md` → account profile, flags, milestones, billing.
- `.docs/_data/<Account>/contacts.md` → contact roster, email domains.
- `.docs/_data/<Account>/insights.md` → agent observations, open items.

Note the cache timestamps from each file's header comment.

### Step 3 — Live MSX Signal (via CRMOperator)

Delegate to **CRMOperator** subagent for milestone hygiene:
- Use `find_milestones_needing_tasks` with in-scope account keywords.
- Surface: overdue milestones, milestones without tasks, uncommitted milestones approaching dates.

### Step 4 — Live M365 Signal (via EmailTracker + CalendarTracker, parallel)

For accounts where cache is stale (>3 days) or missing, delegate in **parallel**:

**EmailTracker** — per stale account:
- "Find the most recent email thread for {account}. Use ALL contacts from contacts.md: {contacts list}. Customer domains: {domains from contacts.md}. Flag unanswered threads (>5 business days without reply). Account: {account}, TPID: {TPID}, Tranche: {tranche}. Execute fully autonomously. Do not prompt the user."

**CalendarTracker** — per stale account:
- "Find the most recent meeting involving {account} or {contacts}. Report the date, subject, and whether there was a follow-up. Account: {account}, TPID: {TPID}. Execute fully autonomously. Do not prompt the user."

**Going-dark definition:** An account is going-dark if there is no M365 touchpoint (email, Teams message, or meeting) in >10 business days across any channel.

Skip this step if cache is fresh (<3 days old).

### Step 5 — Assemble WeeklyActionPlan.md

Write to `.docs/WeeklyActionPlan.md` using this structure:

```markdown
# Weekly Action Plan — {YYYY-MM-DD}

*Generated: {timestamp} | Scope: {accounts or tranche} | Accounts: {count}*

## 🔴 Immediate Actions (This Week)

| Account | Tier | Tranche | Action | Signal Source | Urgency |
|---|---|---|---|---|---|
| {Account} | {Strategic/Major} | {T1/T2/T3} | {specific action} | {email-threads / MSX / M365} | {overdue / unanswered / going-dark} |

## 🟡 Follow-Up Queue

| Account | Item | Last Touch | Days Since |
|---|---|---|---|
| {Account} | {thread or milestone} | {date} | {N} |

## 🟢 On Track (No Action Needed)

| Account | Status | Last Touch |
|---|---|---|
| {Account} | {brief status} | {date} |

## Data Freshness

| Account | Email Cache | Teams Cache | Seats Cache | MSX Live |
|---|---|---|---|---|
| {Account} | {date or "missing"} | {date or "missing"} | {date or "missing"} | {today} |

## Blockers & Failures

- {Any MCP failures, rate limits, missing data — log here for troubleshooting}
```

### Step 6 — Report to User

Present the Immediate Actions and Follow-Up Queue sections. Offer to drill into any specific account.

## Input

{user provides scope: TPID(s), account name(s), tranche, or "all"}
