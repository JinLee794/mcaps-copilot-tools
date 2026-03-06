---
description: "Review MSX milestone and task status: overdue milestones, uncommitted milestones, milestones without tasks, task hygiene."
---

# MSX Milestone Review

Check MSX milestone and task health for one or more accounts. Surfaces overdue milestones, missing tasks, uncommitted milestones, and status mismatches.

## Interaction

**Ask the user:** "Which account(s)? Enter name(s), TPID(s), or 'all'."

## Workflow

### Step 1 — Resolve Accounts

- Read `.docs/AccountReference.md` to resolve names/TPIDs → OppIDs, MilestoneIDs, **Tier** (Strategic/Major), **Tranche** (A/B/C).
- For each account, read `.docs/_data/<Account>/contacts.md` for broader team roles (CSAM, CSA, AM) — needed for owner resolution and escalation routing.
- Read `.docs/_data/<Account>/state.md` for flagged issues and tranche observation notes.

### Step 2 — MSX Query (via CRMOperator)

**Read scope:** Before querying, narrow the read request based on the account list. Do not request all milestones for the user — always scope by account keywords or OppIDs.

Delegate to **CRMOperator** subagent:
- "Check milestone health for accounts: {account list}. Use `find_milestones_needing_tasks` with customerKeywords: [{account keywords}]. For accounts with known OppIDs ({oppIds}), use `crm_query` on `msp_engagementmilestones` with filters for active/non-completed milestones. Use `get_milestone_activities` to retrieve tasks for flagged milestones. Account TPIDs: {TPIDs}. Tier: {tier per account}. Tranche: {tranche per account}. Execute fully autonomously. Do not prompt the user."

### Step 3 — Analyze & Categorize

For each milestone, classify into:
- **Overdue**: `msp_milestonedate` is past, status is not Completed.
- **No Tasks**: Active milestone with zero associated tasks.
- **Uncommitted**: Milestone still in uncommitted state approaching its date.
- **At Risk**: Status mismatch or owner not assigned.
- **On Track**: Active, has tasks, date is future, status is healthy.

### Step 4 — Report

```markdown
## MSX Milestone Review — {date}

*Scope: {accounts} | Total Milestones: {N}*

### 🔴 Needs Immediate Action

| Account | Tier | Milestone | Status | Date | Issue | Owner |
|---|---|---|---|---|---|---|
| {Account} | {Strategic/Major} | {name} | {status} | {date} | {Overdue / No Tasks / Uncommitted} | {owner} |

### 🟡 Watch List

| Account | Milestone | Status | Date | Note |
|---|---|---|---|---|
| {Account} | {name} | {status} | {date} | {approaching / needs attention} |

### 🟢 Healthy

| Account | Milestone | Status | Date | Tasks |
|---|---|---|---|---|
| {Account} | {name} | {status} | {date} | {count} |

### Recommended Actions
1. {specific action — e.g., "Add tasks to COMCAST milestone M-12345"}
2. {specific action — e.g., "Update CONDUENT overdue milestone status"}
```

Offer to execute task creation or milestone updates via CRMOperator. Write operations will be staged for human-in-the-loop approval via the approval queue.

### Step 5 — Connect Hook Capture (optional)

If findings include measurable impact (e.g., caught overdue milestones, prevented task gaps, flagged risks early):
- Append a brief entry under `## Connect Hooks` on `.docs/_data/<Account>/insights.md`.
- Include: date, hook type (Execution Integrity / Risk Mitigation), and one-line evidence.
- Only capture concrete, attributable findings — not speculation.

## Input

{user provides account name(s), TPID(s), or "all"}
