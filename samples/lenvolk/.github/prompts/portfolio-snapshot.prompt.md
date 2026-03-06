---
description: "Quick portfolio overview: AccountReference.md + _index.md + latest seat data. Zero MCP calls — instant read from local files."
---

# Portfolio Snapshot

Instant portfolio overview from local files. No MCP calls, no rate limits — reads AccountReference.md, _index.md, and cached seat data to give you the lay of the land.

## Interaction

No questions needed. Reads local files immediately.

## Workflow

### Step 1 — Read Dashboard Files

- Read `.docs/AccountReference.md` → full account roster with TPIDs, SSPs, GH AEs, OppIDs, **Tier** (Strategic/Major), **Tranche** (A/B/C).
- Read `.docs/_index.md` → portfolio index with account classification.

### Step 2 — Read Latest Seat Data (if available)

- List `.docs/Weekly/` → find most recent `*_GHCP-Seats-report.xlsx` and `*_GHCP-Seat-Opp.md`.
- If seat opportunity file exists, read it for portfolio-level metrics. **Note the file date** for display.
- If not available, note "No weekly seat data found" (user can run `/msxi-ghcp-report` to generate).

### Step 3 — Read WeeklyActionPlan (if exists)

- Read `.docs/WeeklyActionPlan.md` → current action items, blockers, data freshness.
- If available, **extract the generation date** from the header (e.g., `# Weekly Action Plan — {YYYY-MM-DD}`).
- If not available, note "No action plan generated yet" (user can run `/generate-weekly-plan`).

### Step 3.5 — Per-Account Last-Touch Dates

For each account, check data file headers for freshness timestamps:
- Read first 2 lines of `.docs/_data/<Account>/email-threads.md` → extract `Last Updated:` date.
- Read first 2 lines of `.docs/_data/<Account>/teams-threads.md` → extract `Last Updated:` date.
- Read first 2 lines of `.docs/_data/<Account>/state.md` → extract `Last Updated:` date.
- Skip missing files silently. This is purely local data — zero MCP calls.

### Step 4 — Present Snapshot

```markdown
## Portfolio Snapshot — {date}

### Account Roster ({N} accounts)

| # | Account | TPID | Tier | Tranche | SSP | GH AE | Milestones |
|---|---|---|---|---|---|---|---|
| 1 | {Account} | {TPID} | {Strategic/Major} | {tranche} | {SSP} | {GH AE} | {Y/N} |

### Tranche Summary
| Tranche | Accounts | Description |
|---|---|---|
| 1 | {N} | {Tranche A description} |
| 2 | {N} | {Tranche B description} |
| 3 | {N} | {Tranche C description} |

### Latest GHCP Seat Metrics (from {date} report)
| Metric | Portfolio Total |
|---|---|
| Total GHCP Seats | {N} |
| Total Seat Opportunity | {N} |
| Avg Attach Rate | {%} |

### Current Action Plan Status
*Generated: {action plan date or "N/A"}*
{Summary from WeeklyActionPlan.md or "Not generated yet"}

### Data Freshness (per-account last touch)
| Account | Tier | Tranche | Email Cache | Teams Cache | Seats Cache |
|---|---|---|---|---|---|
| {Account} | {Strategic/Major} | {T1/T2/T3} | {date or "none"} | {date or "none"} | {date or "none"} |

### Quick Actions
- Run `/check-comms` to check communication health *(live MCP)*
- Run `/msx-milestone-review` to check MSX milestones *(live MCP)*
- Run `/generate-weekly-plan` to build this week's action plan *(live MCP)*
- Run `/account-deep-dive {account}` for detailed single-account analysis *(live MCP)*
- Run `/msxi-ghcp-report` to refresh GHCP seat data *(browser automation)*
```

## Input

None required — reads local files automatically.
