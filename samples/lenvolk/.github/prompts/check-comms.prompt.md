---
description: "Check email, Teams, and calendar communications for an account: unanswered threads, response lag, going-dark alerts."
---

# Check Communications

Quick communication health check for one or more accounts. Searches email, Teams, and calendar for unanswered threads, calculates response lag, and flags going-dark risks.

## Interaction

**Ask the user:** "Which account(s)? Enter name(s), TPID(s), or 'all'."

## Workflow

### Step 1 — Resolve Accounts

- Read `.docs/AccountReference.md` to resolve names/TPIDs → account folder, SSP, GH AE, **Tier** (Strategic/Major), **Tranche** (A/B/C).
- For each account:
  - Read `.docs/_data/<Account>/contacts.md` for the full contact roster and email domains.
  - Read `.docs/_data/<Account>/teams-threads.md` for known Teams channels/chats.
  - Read `.docs/_data/<Account>/state.md` for flagged issues.

### Step 2 — Live Checks (via EmailTracker + TeamsTracker + CalendarTracker, parallel)

Delegate to all three subagents in **parallel** per account:

**EmailTracker** — email health:
- "Find the most recent email thread for {account}. Use ALL contacts from contacts.md: {contacts list}. Customer domains: {domains from contacts.md}. Cross-check against documented threads in email-threads.md. Flag unanswered threads (>5 business days without reply). Account: {account}, TPID: {TPID}, Tranche: {tranche}. Execute fully autonomously. Do not prompt the user."

**TeamsTracker** — Teams health:
- "Search known channels/chats from teams-threads.md for {account}. Find last message activity. Flag unanswered threads (user's last message with no reply >3 business days). Execute fully autonomously. Do not prompt the user."

**CalendarTracker** — meeting activity:
- "Find the most recent meeting involving {account} or {contacts from contacts.md}. Report date, subject, and whether it was a recurring cadence or ad-hoc. Account: {account}, TPID: {TPID}. Execute fully autonomously. Do not prompt the user."

### Step 3 — Cross-Validate Recency

After subagent results return:
- Compare EmailTracker's "most recent email" date against thread catalog in email-threads.md.
- If email-threads.md documents a more recent thread, re-delegate to EmailTracker with that thread's exact subject + sender + recipients.
- This prevents false recency claims when M365 search misses emails with generic subjects.

**Going-dark definition:** No M365 touchpoint (email, Teams message, or meeting) in >10 business days across any channel.

### Step 4 — Report

Present results per account:

```markdown
## Communication Check — {date}

| Account | Tier | Tranche | Email Status | Last Email | Teams Status | Last Teams | Last Meeting | Alert |
|---|---|---|---|---|---|---|---|---|
| {Account} | {Strategic/Major} | {T1/T2/T3} | {OK/Unanswered/Going Dark} | {date} | {OK/Unanswered/No Channels} | {date} | {date} | {flag} |

### Flagged Threads

| Account | Channel | Subject | Sent | Days Waiting | Action |
|---|---|---|---|---|---|
| {Account} | Email | {subject} | {date} | {N} | Follow up / Escalate |
```

Offer to draft follow-up emails for any flagged threads.

## Input

{user provides account name(s), TPID(s), or "all"}
