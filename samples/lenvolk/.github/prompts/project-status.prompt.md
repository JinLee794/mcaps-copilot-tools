---
description: "Generate a project status summary by reading the account profile, related meetings, and validating against MSX."
---

# Summarize Project Status

Generate a project status summary by combining local account context with fresh M365 signals and MSX data.

## Workflow

### Step 1 — Read Account Context

- Read `.docs/_data/<Account>/state.md` → customer profile, type, priority, tech stack, open items, status.
- Read `.docs/_data/<Account>/contacts.md` → full contact roster.
- Read `.docs/AccountReference.md` for TPID, SSP, GH AE, OppIDs.
- Read `.docs/_data/<Account>/state.md` for tranche classification.
- `grep_search` with `includePattern: ".docs/_data/<Account>/**"` → recent meetings and notes referencing this project.
- `read_file` on the 3-5 most recent matches → extract activity, decisions, action items.

### Step 2 — M365 Evidence (via subagents, parallel)

Delegate to subagents in **parallel** for recent M365 activity:

**EmailTracker** — email threads:
- "Find email threads about {project name} or {customer} from the last 14 days. Use ALL contacts from contacts.md: {contacts list}. Highlight decisions, status updates, blockers, or asks. Account: {account}, TPID: {TPID}, Tranche: {tranche}. Execute fully autonomously. Do not prompt the user."

**TeamsTracker** — Teams messages:
- "Find Teams messages about {project name} or {customer} from the last 14 days. Use chat thread IDs from teams-threads.md. Highlight decisions, blockers, or status updates. Execute fully autonomously. Do not prompt the user."

**CalendarTracker** — meeting activity:
- "Find meetings about {project name} or with {customer} in the last 14 days. Include decisions, action items, and blockers discussed. Execute fully autonomously. Do not prompt the user."

**What to capture:**
- Activity that happened but has no local meeting note (evidence gap).
- Decisions or commitments made in email/chat that should appear in the status report.
- Blockers or risks surfaced in informal channels.
- Source attribution: mark each data point as `(M365)` in the output.

### Step 3 — MSX Validation (via CRMOperator)

If the project's customer is in the account roster, delegate to **CRMOperator** subagent:
- "Check opportunity status and milestone health for {account} (TPID: {TPID}). Use `list_opportunities` and `crm_query` with appropriate filters. Surface any discrepancies between local notes and MSX state. Execute fully autonomously. Do not prompt the user."

### Step 4 — Synthesize & Output

Combine local notes + M365 + MSX data into a scannable status report. Show the source of each data point (`Local`, `M365`, `MSX`).

### Step 5 — Update Account Notes

Use `replace_string_in_file` to update `.docs/_data/<Account>/insights.md`:
- Append the generated status summary under a dated section with today's date.
- Update the status section if it changed.

## Output Format

```markdown
## Status Summary — {Project Name}

*Generated: {YYYY-MM-DD}*
*Customer: [[{customer}]] | Type: {type} | Priority: {priority}*

### Current Status

{One sentence: where the project stands — sourced from local notes + MSX}

### Recent Activity

- **{date}**: {what happened} — from [[{meeting note}]] `(Vault)`
- **{date}**: {what happened} — from email thread `(M365)`
- **{date}**: {what happened} — from Teams chat `(M365)`

### MSX State

- **Opportunity:** {name} — {stage}, {status}
- **Active Milestones:** {count} — {any at risk or overdue}

### Key Decisions

- {Decision 1}
- {Decision 2}

### Open Action Items

- [ ] {Action} ([[{Owner}]]) — from [[{source}]]

### Blockers & Risks

- {risk or blocker}

### Next Steps

- {next step 1}
- {next step 2}

### Technologies

{Azure services, frameworks, tools involved}
```

## Input

{user provides project name}
