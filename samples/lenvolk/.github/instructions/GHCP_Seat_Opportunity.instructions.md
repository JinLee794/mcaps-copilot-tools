---
description: "GHCP Seat Opportunity and Remaining Seat Opportunity calculation reference from the Dev Services Hub (MSXI) Metric Glossary. Use when reasoning about GHCP seat potential, remaining seat opportunity, seat whitespace, TAM, attach rate, qualified/unqualified pipeline seats, GHCP growth framework cohorts, or any GHCP metric interpretation from the MSXI Acc. View report."
---

# GHCP Seat Opportunity — Metric Reference

Canonical source: **Dev Services Hub — Metric Glossary** (OneNote, maintained by the MSXI dashboard team).
Report: **GHCP & Dev Services Hub** in MSX Insights → Acc. View tab.
Weekly extract: `.docs/Weekly/<YYYY-MM-DD>_GHCP-Seats-report.xlsx` (see `gh-stack-browser-extraction` skill).

> For full metric glossary, seat definitions, penetration metrics, pipeline/outlook formulas, new logo incentive rules, engagement metrics, cross-sell metrics, and Excel column mapping, read `.github/documents/ghcp-metric-formulas.md`.

---

## Key Formulas

### GHCP Seat Opportunity (historically called TAM / Whitespace)

The total addressable developer seats within an account:

```
Seat Oppty = MAX(GHE License Seats + GHE Metered Seats, ADO Seats)
```

- If `(GHE License + GHE Metered) > ADO Seats` → Seat Oppty = GHE total
- Otherwise → Seat Oppty = ADO Seats
- Calculated at the **account (TPID) level**. Group totals = sum of per-account maxima (not max of aggregated totals).

### Remaining Seat Opportunity

The potential for additional GHCP seats after accounting for actuals and all pipeline:

```
Remaining Seat Opp = Seat Oppty − GHCP Seats − Qualified Pipeline Seats − Unqualified Pipeline Seats
```

- **Qualified Pipeline Seats**: estimated monthly seats from milestones beyond the earliest sales stage, with approved statuses (On Track / At Risk / Blocked / Completed), in POC/Pilot or Production categories, in open fiscal periods. Converted using the Seat Ratio ($16/seat).
- **Unqualified Pipeline Seats**: estimated seats from milestones at the earliest sales stage (Sales Stage Number = 1).
- The report column "Remaining GHCP Seat Opp" reflects this full subtraction, which is why simple `Seat Oppty − GHCP Seats` does **not** match.

### GHCP Attach Rate

```
GHCP Attach = GHCP Seats / GHCP Seat Opportunity
```

### ARPU (Average Revenue Per User)

```
ARPU = GHCP ACR ($) / GHCP Seats
```

---

## Worked Example — TPID 719650 (Millennium Partners)

| Metric | Value | Source |
|---|---|---|
| GHE License Seats | 3,753 | MSXI Acc. View |
| GHE Metered Seats | 0 | MSXI Acc. View |
| ADO Seats | 8 | MSXI Acc. View |
| **GHCP Seat Oppty** | **3,753** | MAX(3753 + 0, 8) = 3,753 |
| GHCP Seats | 1,282 | MSXI Acc. View |
| Qualified GH Seats FY26 (open) | 63 | MSXI pipeline data |
| Unqualified Pipeline Seats | ~937 | Inferred (see below) |
| **Remaining GHCP Seat Opp** | **1,471** | 3,753 − 1,282 − 63 − ~937 |

**Why Seat Oppty − GHCP Seats ≠ Remaining Seat Opp:**
- Naive subtraction: 3,753 − 1,282 = 2,471
- Report shows: 1,471 (a difference of 1,000)
- The PBI model subtracts both qualified AND unqualified pipeline seats from the opportunity, not just actuals. The pipeline seat values come from milestone-level calculations and are not directly visible as separate columns in the Acc. View export. Use the pipeline/milestone views in MSXI to see the breakdown.

---

## GHCP Growth Framework (Cohort Definitions)

| Cohort | Name | Criteria | Action |
|---|---|---|---|
| **0** | No GHE/ADO/GHCP | No GHE licenses, no ADO, no GHCP seats | Land Copilot |
| **1** | GHE/ADO, limited GHCP | GHE and/or ADO present, < 50 GHCP seats | Land Copilot |
| **2** | >50 GHCP, <50% attached | GHE/ADO present, > 50 GHCP seats, < 50% attach | Expand Copilot |
| **3** | >50 GHCP, >50% attach, <$30 ARPU | Strong adoption but low monetization | Upsell to Enterprise |
| **4** | >50 GHCP, >50% attach, >$30 ARPU | High-value, well-penetrated | Nurture & Cross-sell |

---

## Common Pitfalls

1. **Remaining ≠ Seat Oppty − GHCP Seats.** The PBI model also subtracts qualified and unqualified pipeline seats. Always check pipeline views for the full breakdown.
2. **Seat Oppty ≠ GHE Total Seats** in general. It equals GHE Total only when GHE > ADO. For ADO-heavy accounts, Seat Oppty = ADO Seats.
3. **Group-level Seat Oppty** is the sum of per-account MAX values, not MAX of aggregated GHE/ADO totals.
4. **Seat Targets** are authoritative only at Field Accountability Unit (area) and STB Mid-Segment (segment) levels. Lower-level values are derived approximations.
5. **New Logo ACR excludes PRU.** Remove PRU revenue when comparing against new logo thresholds.
6. **Strategic Pillar ACR ≠ GHCP ACR** — the pillar view includes PRU revenue.

---

*Source: Dev Services Hub — Metric Glossary (OneNote, dashboard owner: anays@microsoft.com)*
*Validated: 2026-02-27 against TPID 719650 (Millennium Partners) weekly extract.*
