# GHCP Metric Glossary & Formulas Reference

Canonical source: **Dev Services Hub — Metric Glossary** (OneNote, maintained by the MSXI dashboard team).
Report: **GHCP & Dev Services Hub** in MSX Insights → Acc. View tab.
Weekly extract: `.docs/Weekly/<YYYY-MM-DD>_GHCP-Seats-report.xlsx` (see `gh-stack-browser-extraction` skill).

---

## GHCP Seat Metrics (Full Glossary)

### Seats & ACR

| Metric | Definition |
|---|---|
| **GHCP Seats / ACR ($)** | Total paid GHCP units or ACR — includes Business, Enterprise, and Standalone offers |
| **GHCP Ent Seats / ACR ($)** | Paid units/ACR for GHCP Enterprise tier |
| **GHCP Business Seats / ACR ($)** | Paid units/ACR for GHCP Business tier |
| **GHCP Standalone Seats / ACR ($)** | Paid units/ACR for GHCP Standalone offer |

> When Strategic Pillar = GitHub Copilot, ACR values may differ from "GHCP ACR ($)" because the strategic pillar view includes PRU revenue.

### Seat Adds & Targets

| Metric | Definition |
|---|---|
| **Seat Adds** | MoM net change in GHCP seats. Example: Dec Seat Adds = GHCP Seats (Dec) − GHCP Seats (Nov) |
| **Seat Adds VTT** | Actual Seat Adds minus budgeted Seat Adds |
| **Gap to June Target** | June seat budget minus GHCP seats as of last closed month |
| **Seat Ratio** | ACR-to-seat conversion: **$16 per seat** |

> Seat Targets are authoritative only at the Field Accountability Unit level (area) and STB Mid-Segment level (segment). Values at lower granularity are derived approximations.

### Pipeline Seats

| Metric | Definition |
|---|---|
| **Qualified Pipeline Seats (QP)** | Estimated monthly seat potential from qualified milestones (beyond earliest sales stage, approved statuses, POC/Pilot or Production, open fiscal periods). Seat Ratio conversion applied. |
| **Committed Pipeline Seats (CP)** | Subset of QP where milestone is marked committed |
| **Uncommitted Pipeline Seats (UC)** | Subset of QP where milestone is marked uncommitted |
| **Non-Qualified Pipeline Seats (NQP)** | Seat potential at earliest sales stage (Sales Stage Number = 1) |

### Opportunity & Whitespace

| Metric | Definition |
|---|---|
| **GHCP Seat Opportunity** | `MAX(GHE License + GHE Metered, ADO Seats)` — total addressable seats at account level |
| **Remaining Seat Opp** | `Seat Oppty − GHCP Seats − Qualified Seats − Unqualified Seats` |
| **GHCP Attach** | `GHCP Seats / Seat Oppty` |
| **ARPU** | `GHCP ACR ($) / GHCP Seats` |
| **GHCP Monthly Whitespace Seats** | `Seat Oppty − GHCP Seats (monthly)` — unpenetrated seats still available |

---

## GitHub Enterprise (GHE) Seats

| Metric | Definition |
|---|---|
| **GHE License Seats** | Licensed, non-metered GHE seats (entitlement-based). Includes GitHub Advanced Security, GH Advanced Security Business Hosted |
| **GHE Metered Seats / ACR ($)** | Consumption-based metered GHE usage |
| **GHE Total Seats** | GHE License + GHE Metered |

## Azure DevOps (ADO) Seats

| Metric | Definition |
|---|---|
| **ADO Seats** | Total ADO seats (Repos/Boards Basic + Test Plans) |
| **ADO Seats Basic** | Seats for Azure Repos and Boards (Basic) |
| **ADO Seats Test** | Seats for Azure Test Plans |

## GitHub Advanced Security (GHAS)

| Metric | Definition |
|---|---|
| **GHAS Seats / ACR ($) (metered)** | Metered GHAS usage |
| **GHAzDO Seats (metered)** | GHAS seats attributed to Azure DevOps usage |
| **GHAS Seats (license)** | Paid GHAS license seats (GH Advanced Security + Business Hosted) |
| **GHAS Total** | GHAS metered + GHAS license seats |

## Premium Request Units (PRU)

> Both PRU ($) and PRU Units reflect **billable usage only** — consumption within the monthly allowance is excluded.

| Metric | Definition |
|---|---|
| **PRU ($)** | ACR from Premium Request workloads (Service Level 5 = Premium Request) |
| **PRU Units (#)** | Number of Premium Request units consumed (volume, not revenue) |

## Other Seat Metrics

| Metric | Definition |
|---|---|
| **Visual Studio Seats** | Licensed Visual Studio entitlements (license-based, not usage) |
| **Total GH** | Sum of GHCP ACR + PRU ACR + GHE Metered ACR + GHAS Metered ACR — consolidated GitHub consumption |

---

## Penetration Metrics

| Metric | Definition |
|---|---|
| **# GHCP Acc (LCM)** | Accounts with any GHCP ACR in last closed month |
| **Acc. Penetrated** | >50 GHCP seats (Enterprise) or >20 GHCP seats (SME&C) |
| **# Acc Penetrated** | Count of penetrated accounts |
| **% Acc. Penetrated** | Penetrated accounts / total accounts |
| **# Acc with QP** | Accounts with ≥1 qualified pipeline milestone (FY26 view includes past milestones) |
| **# Acc with CP** | Accounts with ≥1 committed pipeline milestone |
| **% Unified Support** | Accounts with unified support / total accounts |

### Pipeline Segmentation (Mutually Exclusive)

| Category | Definition |
|---|---|
| **Acc QP > Threshold** | Qualified pipeline > 50 seats (Enterprise) or > 20 seats (SME&C) |
| **Acc QP < Threshold** | Qualified pipeline > 0 but ≤ threshold |
| **Acc NQP** | No qualified pipeline, but has non-qualified pipeline |
| **Acc No Pipe** | No pipeline at all |

---

## Seat Adds (NPSA) Change Analysis

Classifies accounts by MoM seat change using a configurable threshold:

| Category | Rule |
|---|---|
| **Increase** | Both months have seats, MoM gain exceeds threshold |
| **Decrease** | Both months have seats, MoM loss exceeds threshold |
| **Flat** | Both months have seats, MoM change within threshold |
| **New** | Previous month = 0 seats, current month > 0 |
| **Loss** | Previous month > 0, current month = 0 |
| **Not Customers** | Both months = 0 seats |

Aggregated metrics per category: **Count (#)**, **ACR ($)**, **Seats**.

## Penetration Change Analysis

| Category | Previous Month | Current Month |
|---|---|---|
| **Sustained Penetration** | Penetrated | Penetrated |
| **Newly Penetrated** | Not penetrated | Penetrated |
| **Lost Penetration** | Penetrated | Not penetrated |
| **Not Penetrated** | Not penetrated | Not penetrated |

---

## Pipeline & Outlook Metrics

| Metric | Formula |
|---|---|
| **Baseline** | Last closed month ACR → daily run rate → projected forward |
| **PBO** | ACR actuals + Baseline + Committed Pipeline excl. Blocked |
| **PBO VTB** | PBO − ACR Budget |
| **PBO VTF** | PBO − ACR Forecast |
| **NNR (Budget/Forecast)** | ACR Budget/Forecast − (ACR Actual + Baseline) |
| **CP to NNR** | Committed Pipeline excl. Blocked / \|NNR\| |
| **ACR Outlook** | Actuals + Baseline + weighted pipeline (committed × param₁ + uncommitted × param₂ + NQP × param₃) |
| **Seat Outlook** | Cumulative GHCP seats + weighted pipeline seats (same param structure) |

---

## GHCP New Logo Incentive

| Metric | Definition |
|---|---|
| **GHC New Customer Adds** | Accounts reaching meaningful GHCP adoption: >50 seats or >$800 ACR/mo (Enterprise); >20 seats or >$320 ACR/mo (SME&C) |
| **Baseline** | November ACR for eligible customers (below thresholds) |
| **Threshold** | Baseline + $800 (Enterprise) or + $320 (SME&C) |
| **Needed ACR** | Threshold − LCM ACR |
| **Enough Pipe** | Pipeline ≥ Needed ACR or LCM already exceeds Threshold |
| **Win** | Account exceeds threshold for **3 consecutive months** |

> New Logo ACR values **exclude PRU revenue**. Remove PRU when comparing to other report pages.

---

## Engagement Metrics (from OctoDash)

| Metric | Definition |
|---|---|
| **Active User** | Using Code Completion (prompting), Chat (turns), CLI, PR Summary, Knowledge Base, or API. Authentication alone ≠ active. |
| **Engaged User** | Same as Active, but for Code Completion the suggestion must also be **accepted** |
| **% Active User** | Active users / Copilot licensed users |
| **% Engaged User** | Engaged users / Copilot licensed users |

## GH + Azure Cross-Sell Metrics

| Metric | Definition |
|---|---|
| **SRE Agent ACR ($)** | ACR from Azure AI Agent usage (Azure Agent Unit, SRE designation) |
| **AI Foundry ACR ($)** | ACR from eligible Azure AI workloads (MaaS, 1P MaaS, Azure OpenAI, remaining AI services). Min threshold: $1,000 (SME&C), $5,000 (Enterprise) |
| **AKS ACR ($)** | ACR from Azure Kubernetes Service (Container Services pillar) |
| **Fabric ACR ($)** | ACR from Microsoft Fabric F-SKU (OneLake Storage, Data Warehousing Core, FabricDB only — most Dev-relevant) |
| **PGSQL ACR ($)** | ACR from Azure Database for PostgreSQL |
| **MDC ACR ($)** | ACR from Microsoft Defender for Cloud (all service levels) |
| **CSPM ACR ($)** | MDC subset: Microsoft Defender CSPM offering |

---

## Excel Report Column Mapping

The weekly extract (`.docs/Weekly/<YYYY-MM-DD>_GHCP-Seats-report.xlsx`) contains these columns in order:

| Col | Header | Notes |
|---|---|---|
| A | Account Name | |
| B | TPID | Account-level identifier |
| C | OppID | |
| D | MileStoneID | |
| E | MACC | Yes/No |
| F | Unified Support | Yes/No |
| G | Action | Growth framework cohort action |
| H | GHCP Seats | |
| I | GHCP Ent Seats | |
| J | GHCP Business Seats | |
| K | GHCP Standalone Seats | |
| L | GHCP ACR ($) | |
| M | GHCP Ent ACR ($) | |
| N | GHCP Business ACR ($) | |
| O | GHCP Standalone ACR ($) | |
| P | ARPU | |
| Q | GHCP Attach | |
| R | GHCP Seat Oppty | `MAX(GHE License + Metered, ADO)` |
| S | GH QSeats remaining FY26 | Qualified Pipeline Seats |
| T | GH Non QSeats remaining FY26 | Non-Qualified Pipeline Seats |
| U | Remaining GHCP Seat Opp | Oppty − Actuals − Pipeline |
| V | WAU % | |
| W | WEU % | |
| X | GHE Total Seats | License + Metered |
| Y | GHE License Seats | |
| Z | GHE Metered Seats | |
| AA | GHE Metered ACR ($) | |
| AB | ADO Seats | |
| AC | PRU Units | |
| AD | PRU ACR ($) | |
| AE | GHAS Total Seats | |
| AF | GHAS License Seats | |
| AG | GHAS Metered Seats | |
| AH | GHAS ACR ($) | |
| AI | GHAzDO Seats | |
| AJ | Visual Studio Seats | |
| AK | SRE ACR ($) | |
| AL–AQ | Team Aliases | ATS, SSP, SE, SE Software, GH AE aliases |

---

*Source: Dev Services Hub — Metric Glossary (OneNote, dashboard owner: anays@microsoft.com)*
*Validated: 2026-02-27 against TPID 719650 (Millennium Partners) weekly extract.*
