---
description: "Pre-populate a meeting note with context from .docs/, CRM, and recent meetings — for proactive meeting prep."
---

# Prepare Meeting

Generate a pre-populated meeting note for an upcoming meeting. Pulls context from `.docs/`, live M365 signals, and CRM to surface relevant background, open items, and attendees.

## Workflow

### Step 1 — Identify Customer & Resolve Context

From the meeting title or user input, determine the customer and project.
- Use `list_dir` on `.docs/_data/` to match the customer to an account folder.
- Read `.docs/AccountReference.md` for TPID, SSP, GH AE, OppIDs, MilestoneIDs.
- Read `.docs/_data/<Account>/state.md` for tranche classification and flags.

### Step 2 — Gather Notes Context

Pull context using standard file tools:
- `read_file` on `.docs/_data/<Account>/state.md` → account identity, milestones, flags.
- `read_file` on `.docs/_data/<Account>/contacts.md` → full contact roster, email domains.
- `read_file` on `.docs/_data/<Account>/teams-threads.md` → Teams channels/chats catalog.
- `read_file` on `.docs/_data/<Account>/email-threads.md` → email thread catalog.
- `read_file` on `.docs/_data/<Account>/insights.md` → agent observations, recent findings.

### Step 3 — Live M365 Context (via subagents, parallel)

Delegate to subagents in **parallel** for recent M365 activity:

**CalendarTracker** — recent and upcoming meetings:
- "Find meetings with {customer} or {attendees from contacts.md} in the last 14 days and next 7 days. Report key discussion points, decisions, and open questions. Account: {account}, TPID: {TPID}, Tranche: {tranche}. Execute fully autonomously. Do not prompt the user."

**EmailTracker** — recent email threads:
- "Find recent email threads involving contacts from contacts.md for {account} (TPID: {TPID}). Include ALL contacts: {contacts list}. Customer domains: {domains from contacts.md}. Report decisions, asks, or blockers from the last 14 days. Execute fully autonomously. Do not prompt the user."

**TeamsTracker** — recent Teams messages:
- "Find recent Teams messages in channels/chats from teams-threads.md for {account}. Report any decisions, status updates, or unresolved threads. Execute fully autonomously. Do not prompt the user."

**What to surface in the meeting note:**
- Decisions or commitments made outside formal meetings (chat/email)
- Open questions or unresolved threads that should be on the agenda
- Recent meeting topics to avoid rehashing
- Any stakeholder changes or new participants in recent threads

### Step 4 — CRM Validation (via CRMOperator)

If the customer is in the account roster, delegate to **CRMOperator** subagent:
- "Check opportunity status and milestone health for {account} (TPID: {TPID}). Use `list_opportunities` and `find_milestones_needing_tasks`. Report current CRM state. Execute fully autonomously. Do not prompt the user."
- This ensures the meeting prep reflects **current CRM state**, not stale notes.

### Step 5 — Write the Meeting Note

Save to `.docs/_data/<Account>/insights.md` under a dated meeting prep section.

## Output Format

```markdown
---
tags:
  - meeting
date: {YYYY-MM-DD}
customer: {customer name — matches _data/ folder name}
project: {project name — matches Projects/ filename, or empty}
summary:
status: open
action_owners: []
---

# {Meeting Title}

**Date:** [[{YYYY-MM-DD}]]
**Customer:** [[{Customer}]]
**Project:** [[{Project}]]

## Pre-Meeting Context

> **Customer:** {brief customer context from vault}
> **Project Status:** {current project status from vault/CRM}
> **Last Meeting:** [[{last meeting}]] — {summary}

## Recent M365 Activity

> {Summary of relevant emails, chats, and meeting transcripts from agent365 M365 search — last 14 days}
> - {Notable decision or commitment from email/chat}
> - {Open thread or unresolved question to address}
> - {Any stakeholder change or new participant}

## Carried-Forward Action Items

- [ ] {open action from previous meeting} ([[{Owner}]])
- [ ] {open action from previous meeting} ([[{Owner}]])

## Suggested Agenda

1. Review action items from [[{last meeting}]]
2. {topic based on project/milestone status}
3. {topic based on open items}

## Attendees

- [[{Known Stakeholder 1}]] — {role}
- [[{Known Stakeholder 2}]] — {role}

## Notes

-

## Action Items

- [ ]

## Key Decisions

-
```

## Input

{user provides meeting title, and optionally customer/project name}
