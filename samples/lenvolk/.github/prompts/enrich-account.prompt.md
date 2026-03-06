---
description: "Enrich account files to Windstream-Unity quality: contacts, email threads, Teams catalog, observations, and risk signals."
---

# Enrich Account

Build out an account's `.docs/_data/` files to gold standard. Populates contacts.md with contacts and domains, email-threads.md with thread catalog, teams-threads.md with channel/chat data, and insights.md with observations.

## Interaction

**Ask the user:** "Which account(s) to enrich? Enter name(s), TPID(s), or 'all'."

## Workflow

### Step 1 — Assess Current State (context load order)

For each account, load context in this order:
1. Read `.docs/_data/<Account>/contacts.md` → check if contacts and email domains exist or are stub-only. This is the PRIMARY contact source.
2. Read `.docs/_data/<Account>/email-threads.md` → check if thread catalog exists or is stub-only.
3. Read `.docs/_data/<Account>/state.md` → check completeness (identity, milestones, flags).
4. Read `.docs/_data/<Account>/teams-threads.md` → check if Teams data exists or is stub-only.
5. Read `.docs/AccountReference.md` for SSP, GH AE, TPID, OppIDs, **Tier** (Strategic/Major), **Tranche** (A/B/C).

Classify each account as: **Stub** (empty/template only), **Partial** (some data), or **Rich** (gold-standard).

**Cold-start handling:** For Stub accounts with zero contacts in contacts.md:
- Delegate to **CRMOperator**: "Use `list_account_contacts` with customerKeyword '{account}' to retrieve the CRM customer contact roster and email domains. Execute fully autonomously. Do not prompt the user."
- This bootstraps the contact roster and email domains before email/Teams discovery.

### Step 2 — Contact Discovery (via EmailTracker + TeamsTracker + CalendarTracker, parallel)

Delegate to subagents in **parallel**:

**EmailTracker** — email thread discovery:
- "Search for all email threads involving contacts from contacts.md for {account}. Use ALL contacts (not just SSP/GH AE): {contacts list}. Customer domains from contacts.md: {domains}. If this is a cold-start (stub account), also use contacts from `list_account_contacts`. Extract all participants (To, From, CC) across all threads. Build the full contact roster. Account: {account}, TPID: {TPID}, Tranche: {tranche}. Execute fully autonomously. Do not prompt the user."

**TeamsTracker** — Teams channel/chat discovery:
- "Search for Teams chats/channels related to {account}. Extract participants and channel names. Execute fully autonomously. Do not prompt the user."

**CalendarTracker** — meeting participant discovery:
- "Find meetings involving {account} or {contacts} in the last 30 days. Extract all attendees. Report attendees not already in contacts.md. Account: {account}, TPID: {TPID}. Execute fully autonomously. Do not prompt the user."

**MicrosoftResearcher** (optional — when role data is sparse):
- "Look up role, title, and team for these contacts with missing data: {contacts without titles}. Execute fully autonomously. Do not prompt the user."

### Step 2.5 — Cross-Validate Contact Completeness

After subagent results return:
- Merge contacts from all sources (email, Teams, calendar, CRM).
- Cross-check EmailTracker's thread catalog against email-threads.md — if email-threads.md documents threads not found by EmailTracker, flag as potential search gaps.
- Deduplicate by email address (watch for alias patterns, e.g., user@company.com vs user@subsidiary.com).

### Step 3 — Populate contacts.md

Update `.docs/_data/<Account>/contacts.md` with:

```markdown
# {Account} — Collaborations

## Customer Contacts
| Name | Email | Title | Threads | Last Active |
|---|---|---|---|---|
| {Name} | {email} | {title if known} | {thread numbers} | {date} |

## Microsoft / GitHub Team
| Name | Email | Role | Threads | Last Active |
|---|---|---|---|---|
| {Name} | {email} | {SSP/GH AE/SE/CSA/etc.} | {thread numbers} | {date} |

## Email Thread Catalog
| # | Subject | Date Range | Participants | Status | Summary |
|---|---|---|---|---|---|
| 1 | {subject} | {start}–{end} | {key participants} | {Active/Closed/Unanswered} | {one-line summary} |

## Observations
- {engagement patterns: who's active, who's absent}
- {dual-domain contacts, alias patterns}
- {unanswered threads with days waiting}
```

### Step 4 — Populate teams-threads.md

Update `.docs/_data/<Account>/teams-threads.md` with discovered Teams channels/chats, participants, and last activity dates.

### Step 5 — Enrich Account State & Insights

Update `.docs/_data/<Account>/state.md`:
- Fill in identity and milestone sections with discovered data.

Update `.docs/_data/<Account>/insights.md`:
- Add observations from communication analysis.
- Add enrichment date and findings.

### Step 6 — Report

For each enriched account, report:
- Before/after quality level (Stub → Partial → Rich).
- Contacts discovered, threads cataloged.
- Any gaps that couldn't be filled (e.g., no email threads found, no Teams channels).

## Gold Standard Reference

The target quality is the gold-standard contacts.md:
- Customer-side contacts with email domains and thread participation.
- Microsoft/GitHub participants with org attribution.

Plus email-threads.md:
- Email thread catalog with dates, participants, and summaries.
- Unanswered threads flagged with days waiting.

Plus insights.md:
- Observations (engagement patterns, absent contacts, dual-domain aliases).

## Input

{user provides account name(s), TPID(s), or "all"}
