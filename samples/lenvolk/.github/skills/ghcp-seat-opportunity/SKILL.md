---
name: ghcp-seat-opportunity
description: >-
  Analyze GHCP seat opportunity, whitespace, remaining seat potential, attach rates,
  growth cohorts, and week-over-week seat trends from MSXI weekly reports. Use when
  user asks to analyze seat whitespace for an account or portfolio, compare weekly
  GHCP reports, rank accounts by untapped opportunity, identify seat movement or
  churn, calculate remaining seat opportunity breakdown, determine growth framework
  cohort placement, or produce a seat opportunity summary report. Triggers on
  requests like "show me seat whitespace", "rank accounts by opportunity",
  "compare this week vs last week", "which accounts lost seats", "GHCP growth
  cohort analysis", "seat opportunity breakdown for TPID X", or "weekly seat
  movement report". Provide TPID(s), account name(s), or say "all tracked
  accounts". Optionally specify comparison week.
argument-hint: 'Provide TPID(s), account name(s), or say "all tracked accounts". Optionally specify comparison week.'
---

# GHCP Seat Opportunity Analysis

Analyze GHCP seat opportunity data from MSXI weekly reports, produce actionable insights, and track trends over time.

**Execution rule**: Resolve the user's intent into one of the workflows below, then execute. No planning preamble needed.

## Data Sources

| Source | Path | Purpose |
|---|---|---|
| Weekly reports | `.docs/Weekly/<YYYY-MM-DD>_GHCP-Seats-report.xlsx` | Account-level GHCP metrics (latest + historical) |
| Account roster | `.docs/Weekly/Template GHCP-Seats-report.xlsx` | Canonical list of tracked accounts (TPIDs) |
| Customer notes | `.docs/_data/<Account>/state.md` | Context: identity, milestones, flags, billing |
| Metric definitions | Instruction: `GHCP_Seat_Opportunity.instructions.md` | Key formulas, growth cohorts, pitfalls |
| Metric glossary | Document: `.github/documents/ghcp-metric-formulas.md` | Full glossary, seat definitions, Excel column mapping |

## Prerequisites

- `openpyxl` is available (always present in this workspace)
- At least one weekly report exists in `.docs/Weekly/`

---

## Workflow Selection

Determine which workflow to run based on the user's request:

| User intent | Workflow |
|---|---|
| "Analyze seat opportunity for [account/TPID]" | Single Account Deep Dive |
| "Rank accounts by whitespace / opportunity" | Portfolio Ranking |
| "Compare this week vs last week" | Week-over-Week Comparison |
| "Which accounts gained/lost seats?" | Seat Movement Report |
| "Growth cohort analysis" | Cohort Classification |
| "Full weekly summary" | Combined Report (all workflows) |

---

## Workflow 1: Single Account Deep Dive

**Input**: TPID or account name

1. Read the latest weekly report from `.docs/Weekly/` (sort by date, pick newest).
2. Find the row matching the TPID or account name.
3. Read the customer's `.docs/_data/<Account>/state.md` for context (if exists).
4. Calculate and present:

```
GHCP Seat Opportunity = MAX(GHE License + GHE Metered, ADO Seats)
Remaining Opportunity = Seat Oppty - GHCP Seats - Pipeline Seats (from report)
GHCP Attach = GHCP Seats / Seat Oppty
ARPU = GHCP ACR / GHCP Seats
```

5. Determine the Growth Framework cohort (see references/cohort-logic.md).
6. Present using this format:

```markdown
## [Account Name] (TPID: [TPID]) -- Seat Opportunity Analysis

| Metric | Value |
|---|---|
| GHCP Seat Opportunity | X,XXX |
| GHCP Seats (actual) | X,XXX |
| Remaining Seat Opp | X,XXX |
| GHCP Attach | XX.X% |
| ARPU | $XX.XX |
| Growth Cohort | Cohort N -- [Action] |

### Seat Composition
- Enterprise: X,XXX | Business: X,XXX | Standalone: XXX

### Opportunity Basis
- GHE Total Seats: X,XXX (License: X,XXX + Metered: XXX)
- ADO Seats: XXX
- Basis: [GHE|ADO] (higher value used)

### Recommended Action
[Cohort-driven recommendation based on growth framework]
```

7. If customer notes exist, append relevant context under `### Account Context`.

---

## Workflow 2: Portfolio Ranking

**Input**: "all" or list of TPIDs/names

1. Read the latest weekly report.
2. For each tracked account, extract: GHCP Seats, Seat Oppty, Remaining Seat Opp, Attach rate, ARPU.
3. Rank by **Remaining Seat Opp** descending (largest untapped opportunity first).
4. Present as a ranked table:

```markdown
## Portfolio Seat Opportunity Ranking

| Rank | Account | TPID | Seat Oppty | GHCP Seats | Remaining | Attach | ARPU | Cohort |
|---|---|---|---|---|---|---|---|---|
| 1 | ... | ... | ... | ... | ... | ... | ... | ... |
```

5. Append a summary: total portfolio Seat Oppty, total GHCP Seats, total Remaining, weighted avg Attach.

---

## Workflow 3: Week-over-Week Comparison

**Input**: Two weekly report dates (default: latest two available)

1. List `.docs/Weekly/` and identify the two most recent reports (or user-specified dates).
2. Read both reports with openpyxl.
3. For each account present in both weeks, compute deltas:
   - Seat Delta = Current GHCP Seats - Previous GHCP Seats
   - ACR Delta = Current GHCP ACR - Previous GHCP ACR
   - Attach Delta = Current Attach - Previous Attach
   - Remaining Delta = Current Remaining - Previous Remaining
4. Present:

```markdown
## Week-over-Week Comparison: [Date1] vs [Date2]

| Account | TPID | Seats (prev) | Seats (curr) | Delta | ACR Delta | Attach Delta |
|---|---|---|---|---|---|---|
```

5. Highlight:
   - **Gains**: accounts with Seat Delta > 0 (sort desc)
   - **Losses**: accounts with Seat Delta < 0 (sort asc)
   - **Flat**: accounts with no change

---

## Workflow 4: Seat Movement Report

**Input**: Two weekly reports (default: latest two)

1. Same data load as Workflow 3.
2. Classify each account using the NPSA categories:

| Category | Condition |
|---|---|
| **New** | Previous = 0, Current > 0 |
| **Increase** | Both > 0, Delta > 0 |
| **Flat** | Both > 0, Delta = 0 |
| **Decrease** | Both > 0, Delta < 0 |
| **Loss** | Previous > 0, Current = 0 |
| **Not Customer** | Both = 0 |

3. Present grouped by category with per-category totals (count, total seat delta, total ACR delta).

---

## Workflow 5: Cohort Classification

**Input**: All tracked accounts or specific list

1. Read the latest weekly report.
2. For each account, apply Growth Framework logic (see references/cohort-logic.md).
3. Present:

```markdown
## Growth Framework Cohort Distribution

| Cohort | Action | # Accounts | Total Seats | Total Remaining |
|---|---|---|---|---|
| 0 | Land Copilot | X | 0 | N/A |
| 1 | Land Copilot | X | XX | X,XXX |
| 2 | Expand Copilot | X | X,XXX | X,XXX |
| 3 | Upsell to Enterprise | X | X,XXX | X,XXX |
| 4 | Nurture & Cross-sell | X | X,XXX | X,XXX |

### Accounts by Cohort
[List accounts under each cohort heading]
```

---

## Workflow 6: Combined Report

Run Workflows 2, 3, 4, and 5 in sequence. Present as a single consolidated report with section headers.

---

## Writing Results

After presenting analysis:

1. If the user asks to save, write findings to the customer's `.docs/_data/<Account>/insights.md`.
2. For portfolio-level findings, offer to update all affected customer files.

## Error Handling

- If no weekly reports exist: tell the user to run the `gh-stack-browser-extraction` skill first.
- If a TPID is not found in the report: check if it exists in the template; if not, suggest adding it.
- If only one week of data exists: skip Workflows 3 and 4, note that trending requires 2+ weeks.

## Metric Reference

For key formulas, growth cohorts, and common pitfalls, see the instruction file:
`GHCP_Seat_Opportunity.instructions.md`

For full metric glossary, seat definitions, penetration metrics, pipeline formulas, cross-sell metrics, and Excel column mapping, see:
`.github/documents/ghcp-metric-formulas.md`

For cohort classification logic, see: [references/cohort-logic.md](references/cohort-logic.md)
