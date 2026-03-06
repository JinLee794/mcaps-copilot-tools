# GHCP & Dev Services Hub — Weekly Report Generator

Extracts live GitHub Copilot seat data from the MSX Insights (MSXI) Power BI report and generates a formatted Excel report for all tracked accounts.

## What It Does

1. Opens the **GHCP & Dev Services Hub** report in MSXI via Playwright browser automation
2. Filters the "Acc. View" page by all account TPIDs from `.docs/AccountReference.md`
3. Exports the Account Stack Table (~48 columns: seats, ACR, attach rates, WAU/WEU, GHAS, etc.)
4. Writes the data into a copy of the template at `.docs/Customers/Template GHCP-Seats-report.xlsx`
5. Saves the result to `.docs/Weekly/<YYYY-MM-DD>_GHCP-Seats-report.xlsx`

## Prerequisites

- [VS Code Insiders](https://code.visualstudio.com/insiders/) with [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extension
- [Node.js 18+](https://nodejs.org/)
- Playwright MCP browser tools enabled in `.vscode/mcp.json`
- Access to [msxinsights.microsoft.com](https://msxinsights.microsoft.com) (AAD auth — you may need to click through MFA on first run)

## How to Run

Open Copilot chat in VS Code (`Ctrl+Shift+I`) and paste:

```
Create a new GHCP Seats report. Use the TPIDs from .docs/AccountReference.md
```

Copilot will navigate to MSXI, authenticate, set all TPIDs in the slicer, export the data, and generate the Excel file automatically.

**Seat opportunity analysis** (single account or full portfolio):

```
Show me the GHCP Seat Opportunity breakdown for TPID 719650 — current seats, qualified pipeline, remaining whitespace, and total seat opportunity
```
```
Give me the GHCP Seat Opportunity breakdown for all accounts — current seats, qualified pipeline, remaining whitespace, and total seat opportunity
```

### Understanding the Seat Opportunity Breakdown

The GHCP Seat Opportunity is the total addressable seat count for an account. It breaks down into three buckets that always sum back to it:

| Bucket | What It Means |
|---|---|
| **GHCP Seats** | Already purchased and active — seats the customer is using today |
| **Qualified Pipeline** | A deal is currently being worked where the customer is expected to buy more GHCP seats. This is an expansion opportunity in MSX where someone (Specialist, SE, or AE) has qualified the customer's intent to add seats, attached a seat count to the opportunity, and it's progressing through the pipeline |
| **Remaining (whitespace)** | Pure untapped opportunity with no active deal yet — seats that haven't been sold and aren't in any pipeline |

**Example** (TPID 719650 — Millennium Partners):

```
  Current GHCP Seats:       1,282   (already sold)
+ Qualified Pipeline:          63   (in-flight deal)
+ Remaining:                2,408   (no deal yet — pure whitespace)
= Seat Opportunity:         3,753   (total addressable)
```

The Qualified Pipeline seats are subtracted from Remaining so they aren't double-counted as untapped whitespace — they're already being pursued.

## Definitions & References

- [Dev Services Hub — Metric Glossary](https://microsoft-my.sharepoint.com/personal/anays_microsoft_com/_layouts/15/Doc.aspx?sourcedoc={1f66daa5-01bb-4ca6-a9a2-35e7f2902562}&action=view&wd=target%28Definitions.one%7C94102e77-7d04-4688-b8f8-f972faf99ffd%2FDev%20Services%20Hub%20%E2%80%94%20Metric%20Glossary%7C20417c45-4bd1-478e-a9b8-6a4a71ce2242%2F%29&wdorigin=NavigationUrl)

## Key Files

| File | Purpose |
|---|---|
| `.docs/AccountReference.md` | Account roster with TPIDs, OppIDs, MilestoneIDs, and contacts |
| `.docs/Customers/Template GHCP-Seats-report.xlsx` | Template with account list and column layout (never overwritten) |
| `.docs/Weekly/<date>_GHCP-Seats-report.xlsx` | Generated weekly report output |
| `.github/skills/gh-stack-browser-extraction/SKILL.md` | Full extraction workflow definition |

---

## Email Lookup & Follow-Up Tracker

Searches for account-related emails via `outlook-local` MCP (Outlook COM), flags unanswered threads, and drafts follow-up buddy emails.

### How to Run

Switch to the **AccountTracker** agent mode in Copilot chat, then paste:

```
Run a weekly email follow-up report for all my tracked accounts
```

Or for a single account:

```
Check email status for COMCAST — any unanswered threads?
```

Copilot will:
1. Read contacts and keywords from `AccountReference.md`
2. Search Inbox + Sent Items via `outlook-local` MCP for each account
3. Flag sent messages with no reply and calculate days waiting
4. Draft follow-up buddy emails for every unanswered thread
5. Save a report to `.docs/Weekly/<date>_WeeklyEmailFollowUp.md`

### Prerequisites

- Outlook desktop running on Windows
- AccountTracker agent mode selected in Copilot chat

---

## GitHub Billing Subscription Lookup

Finds the Azure subscription ID where GitHub is billing for a given customer account. Uses Playwright browser automation to open the **General Adoption Health** Power BI report, filter by TPID, and extract the subscription GUID.

### How to Run

Open Copilot chat in VS Code (`Ctrl+Shift+I`) and ask:

```
Do you happen to have the subscription that GitHub is billing under for Contoso?
```

Or be explicit:

```
Look up the Azure subscription ID for GitHub billing for TPID 12345678
```

Copilot will:
1. Check `.docs/Customers/<AccountName>.md` for a cached subscription ID
2. If not cached, navigate to the General Adoption Health PBI report via Playwright
3. Enter the TPID in the slicer and wait for the report to refresh
4. Extract the Azure Subscription ID from the report visuals
5. Cache the result in the customer's `.docs/` file for future lookups

### Prerequisites

- Playwright MCP browser tools enabled in `.vscode/mcp.json`
- Access to [msit.powerbi.com](https://msit.powerbi.com) (AAD auth)

### Key Files

| File | Purpose |
|---|---|
| `.github/skills/gh-billing-subscription/SKILL.md` | Full extraction workflow definition |
| `.docs/Customers/<AccountName>.md` | Cached subscription ID under `## GitHub Billing Subscription` |

---

## GHCP Seat Opportunity Analysis

Analyzes GHCP seat opportunity, whitespace, attach rates, growth cohorts, and week-over-week seat trends from the weekly report data.

### Sample Prompts

**Single account deep dive:**
```
Analyze seat opportunity for TPID 719650
```
```
Show me the full GHCP seat breakdown for Millennium Partners
```

**Portfolio ranking:**
```
Rank all my tracked accounts by untapped seat opportunity
```
```
Which accounts have the most remaining GHCP whitespace?
```

**Week-over-week comparison** (requires 2+ weekly reports):
```
Compare this week's GHCP report vs last week
```
```
Show me seat changes between 2026-02-26 and 2026-02-27
```

**Seat movement & churn:**
```
Which accounts gained or lost GHCP seats this week?
```
```
Show me a seat movement report — new, increase, decrease, loss
```

**Growth cohort analysis:**
```
Run a GHCP growth cohort analysis across all accounts
```
```
Which accounts are in Cohort 2 and need expansion?
```

**Combined weekly summary:**
```
Generate a full weekly GHCP seat opportunity summary for all tracked accounts
```

**Metric questions** (auto-loads the instruction file, no skill needed):
```
What is Remaining Seat Opportunity and how is it calculated?
```
```
Why doesn't Seat Oppty minus GHCP Seats equal Remaining Seat Opp?
```

### Key Files

| File | Purpose |
|---|---|
| `.github/instructions/GHCP_Seat_Opportunity.instructions.md` | Key formulas, growth cohorts, pitfalls |
| `.github/documents/ghcp-metric-formulas.md` | Full metric glossary, seat definitions, Excel column mapping |
| `.github/skills/ghcp-seat-opportunity/SKILL.md` | Analysis workflow (6 workflows) |
| `.docs/Weekly/<date>_GHCP-Seats-report.xlsx` | Weekly report data (input for analysis) |

---

## Email Composition & Outreach Drafts

Compose templated emails for account outreach and save them as drafts via `outlook-local` MCP (Outlook COM). The **AccountTracker** orchestrator delegates to the **EmailComposer** subagent, which renders templates from `.docs/Email-Templates/` with live account data and seat metrics.

### How to Run

Switch to the **AccountTracker** agent mode in Copilot chat, then paste:

**Single account** (by TPID):
```
Compose an introduction email for TPID 18747190 using the Introduction template.
Save the draft to my Outlook Drafts folder.
Data sources: .docs/AccountReference.md for contacts and identifiers,
latest .docs/Weekly/*_GHCP-Seat-Opp.md for seat metrics.
```

**All tracked accounts** (bulk):
```
Compose introduction emails for all tracked accounts using the Introduction template.
Read all TPIDs from .docs/AccountReference.md.
Look up seat metrics from the latest .docs/Weekly/*_GHCP-Seat-Opp.md report.
Save each draft to my Outlook Drafts folder.
Report a summary table when done.
```

**By account name:**
```
Draft an introduction email for COMCAST using the Introduction template and save to Outlook Drafts.
```

Copilot will:
1. Read contacts (SSP + GitHub AE) and identifiers from `AccountReference.md`
2. Look up GHCP Seats, QP Seats, and Remaining Whitespace from the latest weekly seat report
3. Render the HTML email template with account-specific data
4. Create the draft in your Outlook Drafts folder via COM automation
5. Report a summary with recipient counts and instructions to review

Drafts are **never sent automatically** — you review each one in Outlook and send when ready.

### Available Templates

| Template | File | Purpose |
|---|---|---|
| **Introduction** | `.docs/Email-Templates/Introduction.md` | GHCP whitespace & milestone — first outreach to SSP + GitHub AE contacts |

### Prerequisites

- Outlook desktop running on Windows
- **AccountTracker** agent mode selected in Copilot chat
- `.docs/AccountReference.md` populated with account contacts
- At least one `.docs/Weekly/*_GHCP-Seat-Opp.md` report available

### Key Files

| File | Purpose |
|---|---|
| `.github/agents/email-composer.agent.md` | EmailComposer subagent — template rendering + draft creation |
| `.github/skills/outlook-compose/SKILL.md` | Skill definition — workflow, batch mode, output contract |
| `.github/skills/outlook-compose/scripts/New-OutlookDraft.ps1` | PowerShell script — Outlook COM draft creation |
| `.docs/Email-Templates/Introduction.md` | Introduction email template with placeholders |

---

## MSX Milestone & Task Management

Manage MSX milestones, tasks, and opportunities via MCP tools. Supports role-based workflows for Solution Engineer, Cloud Solution Architect, CSAM, and Specialist.

### How to Run

Switch to the **AccountTracker** agent mode in Copilot chat, then paste:

```
Which milestones need tasks for Contoso?
```
```
Update milestone tasks for my active opportunities
```
```
Run a milestone health check for TPID 12345678
```
```
Show me all at-risk milestones for Fabrikam
```

Copilot will:
1. Identify your MSX role (SE, CSA, CSAM, Specialist)
2. Query CRM for opportunities and milestones in scope
3. Identify gaps (missing tasks, stale dates, ownership issues)
4. Propose updates with human-in-the-loop approval before any CRM writes

### Prerequisites

- MSX CRM MCP server configured in `.vscode/mcp.json`
- Azure CLI authenticated (`az login`)

### Key Files

| File | Purpose |
|---|---|
| `.github/agents/subagents/crm-operator.agent.md` | CRM operations subagent |
| `.github/skills/solution-engineer/SKILL.md` | SE role workflow |
| `.github/skills/cloud-solution-architect/SKILL.md` | CSA role workflow |
| `.github/skills/csam/SKILL.md` | CSAM role workflow |
| `.github/skills/specialist/SKILL.md` | Specialist role workflow |

---

## M365 Intelligence (agent365 MCP Servers)

Query Microsoft 365 data — meetings, Teams messages, documents, emails, and calendar — for live context that supplements CRM data.

Three agent365 MCP servers provide M365 access:

| Server | Purpose |
|---|---|
| `teams-local` | Teams chats, channels, users, messages (local cache) |
| `outlook-local` (calendar) | Calendar events, meeting search, availability via Outlook COM |
| `agent365-wordserver` | Word document reading, creation, and comment collaboration |

### Sample Prompts

```
What was discussed in the last customer sync for Contoso?
```
```
Find recent documents about the FY26 GitHub roadmap
```
```
What blockers came up in the last three meetings with Fabrikam?
```

### Prerequisites

- agent365 MCP servers configured in `.vscode/mcp.json`
- Microsoft Entra tenant ID for authentication

### Key Files

| File | Purpose |
|---|---|
| `.github/skills/m365-query-scoping/SKILL.md` | Scoping broad M365 queries |

---

## Yolo Mode (Auto-Approve All Tool Calls)

By default, VS Code prompts for approval every time a tool (MCP server, terminal command, etc.) is invoked. This is disruptive when using the **AccountTracker** orchestrator, which delegates to subagents that each make multiple MCP tool calls autonomously.

To enable **yolo mode** — auto-approve all tool invocations without prompts — add this VS Code setting:

### Workspace-level (this repo only)

Already configured in `.vscode/settings.json`:

```jsonc
{
  "chat.tools.global.autoApprove": true
}
```

### User-level (all workspaces)

Open **Settings** (`Ctrl+,`) → search for `chat.tools.global.autoApprove` → enable it. Or add to your user `settings.json`:

```jsonc
{
  "chat.tools.global.autoApprove": true
}
```

> **Security note**: This disables all manual approvals, including potentially destructive actions. Only enable this if you trust all configured MCP servers and tools. See the [VS Code security documentation](https://code.visualstudio.com/docs/copilot/security) for details.

---

## AccountTracker Architecture

AccountTracker uses an **orchestrator + subagents** pattern. The orchestrator routes requests to specialized subagents, parallelizes independent workstreams, and synthesizes results.

### Subagents

| Agent | Domain | Typical Triggers |
|---|---|---|
| **EmailTracker** | Email search via outlook-local MCP (Outlook COM), follow-up buddy emails, weekly reports | "Check email for…", "Any unanswered threads?", "Weekly email follow-up report" |
| **TeamsTracker** | Teams chat and channel tracking via teams-local MCP, unanswered thread detection, message send | "What was discussed in Teams chat?", "Any unanswered Teams messages?", "Send follow-up in chat" |
| **GHCPAnalyst** | Seat opportunity analysis from weekly Excel reports | "Analyze seat opportunity…", "Rank accounts by whitespace", "Compare this week vs last" |
| **BrowserExtractor** | Playwright automation for PBI Embedded (MSXI) and PBI Service | "Create a new GHCP Seats report", "Which subscription is GitHub billing under?" |
| **CRMOperator** | MSX milestones, tasks, opportunities via MCP tools | "Update milestone tasks…", "Which milestones need tasks?", "Milestone health check" |
| **EmailComposer** | Template-based email drafts via outlook-local MCP (Outlook COM) | "Compose introduction email for…", "Draft GHCP outreach for all accounts", "Draft email for TPID…" |
| **CalendarTracker** | Calendar events, meeting search, availability via outlook-local MCP (Outlook COM) | "Do I have meetings about [TPID]?", "Any meetings with [customer]?", "Find time to meet with…" |

### How It Works

1. **Orchestrator** receives the user request and reads `.docs/` for context
2. Routes to the appropriate subagent(s) based on an intent routing table
3. Independent subagents run in parallel (e.g., EmailTracker + GHCPAnalyst)
4. Results are synthesized into a unified response
5. Validated findings are promoted to `.docs/Customers/<Name>.md`

### Key Files

| File | Purpose |
|---|---|
| `.github/agents/AccountTracker.agent.md` | Orchestrator — routing, delegation, synthesis |
| `.github/agents/subagents/email-tracker.agent.md` | Email search and follow-up tracking |
| `.github/agents/teams-tracker.agent.md` | Teams chat/channel tracking and follow-up |
| `.github/agents/subagents/ghcp-analyst.agent.md` | GHCP seat opportunity analysis |
| `.github/agents/subagents/browser-extractor.agent.md` | Playwright PBI data extraction |
| `.github/agents/subagents/crm-operator.agent.md` | CRM read/write operations |
| `.github/agents/email-composer.agent.md` | Email template rendering + draft creation via MCP (Outlook COM fallback) |
| `.github/agents/calendar-tracker.agent.md` | Calendar event search and meeting intelligence |
| `.github/agents/teams-tracker.agent.md` | Teams chat/channel tracking, unanswered detection, message send |
