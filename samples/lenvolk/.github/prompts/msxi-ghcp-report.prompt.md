---
description: "Extract GHCP seat data from MSXI Power BI report via browser automation, populate template, and save weekly report to .docs/Weekly/."
---

# MSXI GHCP Report

Extract GitHub Stack Summary data from MSXI using browser automation (BrowserExtractor), populate the GHCP Seats report template, and save to `.docs/Weekly/`.

## Interaction

**Ask the user:** "Which TPIDs? Enter TPID(s), account name(s), or 'all tracked accounts'."

## Workflow

### Step 1 — Resolve TPIDs

- Read `.docs/AccountReference.md` to resolve names → TPIDs.
- Read `.docs/_index.md` for tranche ordering (Tranche A first if "all").
- Build the TPID list for extraction.

### Step 1.5 — Cache-Age Pre-Check

- List `.docs/Weekly/` and check for a recent `*_GHCP-Seats-report.xlsx` (< 3 days old).
- If a fresh report exists, skip browser extraction and proceed directly to Step 4 (GHCPAnalyst analysis) using the existing report.
- If no fresh report, continue to Step 2.
- This avoids launching expensive browser automation (AAD MFA) when data is already current.

### Step 2 — Browser Extraction (via BrowserExtractor)

Delegate to **BrowserExtractor** subagent with the `gh-stack-browser-extraction` skill:
- Navigate to MSXI PBI Embedded report.
- User completes AAD MFA if prompted.
- For each TPID: apply slicer filter → extract GitHub Stack Summary table via PBI JS API.
- Capture: GHE Seats, GHAS Seats, GHCP Seats, PRU, WAU/WEU, ACR, Attach Rate, Seat Opportunity.

**Partial-success protocol:** If extraction fails for some TPIDs but succeeds for others:
- Continue with available data. Do NOT retry failed TPIDs automatically.
- Log failures in the report's Blockers section with TPID, error type, and timestamp.
- Proceed to Steps 3-5 for the successfully extracted TPIDs.

### Step 3 — Populate Template

**Artifact ownership:** BrowserExtractor extracts raw data; this prompt (the orchestrator) owns the XLSX file creation.

- Read `.docs/Weekly/Template GHCP-Seats-report.xlsx` as the base template.
- **Template safety:** Never modify the template file. Always save output as a new file.
- For each extracted TPID, fill in the seat data row.
- Save as `.docs/Weekly/{YYYY-MM-DD}_GHCP-Seats-report.xlsx`.

### Step 4 — Generate Seat Opportunity Analysis

Delegate to **GHCPAnalyst** subagent:
- Compare this week's report against last week's (if available in `.docs/Weekly/`).
- Generate `.docs/Weekly/{YYYY-MM-DD}_GHCP-Seat-Opp.md` with:
  - Per-account seat whitespace breakdown.
  - Week-over-week movement (gains, losses, unchanged).
  - Portfolio-level totals and attach rate.
  - Growth framework cohort classification.

### Step 5 — Update Account Cache

For each extracted account, update `.docs/_data/<Account>/state.md` seat snapshot section:

```markdown
<!-- Last fetched: {ISO timestamp} | Source: MSXI PBI Embedded | Status: OK -->
<!-- TPID: {TPID} -->

| Metric | Value |
|---|---|
| GHE Seats | {N} |
| GHAS Seats | {N} |
| GHCP Seats | {N} |
| Seat Opportunity | {N} |
| Attach Rate | {%} |
| ACR | ${N} |
| WAU | {N} |
| WEU | {N} |
```

### Step 6 — Report to User

Present a summary table with key metrics and highlight significant week-over-week changes.

## Input

{user provides TPID(s), account name(s), or "all"}
