---
name: pipeline-reviewer
description: >-
  Run Scott Bounds' 8-criteria pipeline audit on MSX milestones and opportunities.
  Flags commitment gaps, FY boundary pull-forward potential, pipeline hygiene issues,
  zero-execution-plan milestones, dark milestones with no forecast comments,
  committed-but-silent drift, high-stage uncommitted stalls, and missing close
  status. Groups output by SSP for single-email action. Use when user asks to
  "review pipeline", "audit milestones", "find pipeline problems", "what needs
  attention", "pipeline hygiene check", "prep SEM 1:1", "which milestones are
  at risk", "commitment gap analysis", "FY boundary optimization", or any
  pipeline health / milestone quality review. Provide account name(s), TPID(s),
  SSP name, or say "full portfolio". Optionally specify criteria subset
  (e.g., "just commitment gaps").
argument-hint: 'Account name(s), TPID(s), SSP name, or "full portfolio". Optionally limit to specific criteria.'
---

# SEM Pipeline Audit — Scott Bounds Framework

Systematic identification of SSP-actionable pipeline anomalies across the portfolio. Every flag must be resolvable with **one email to one SSP** containing a **binary ask** with **material impact** on pipeline quality or FY capture.

**Execution rule**: Resolve user intent → gather data → run criteria → produce ranked output + SSP action summary. No planning preamble.

## Data Sources

| Source | Path / Tool | Purpose |
|---|---|---|
| Local notes | `.docs/_index.md` → `.docs/_data/<Account>/state.md` | Tier, Tranche, SSP, cached milestone context |
| CRM milestones | `crm_query` on `msp_engagementmilestones` | Status, commitment, date, $/mo, tasks, forecast comments |
| CRM opportunities | `crm_query` on `opportunities` or `list_opportunities` | Stage, est. close date, close status, owner (SSP) |
| Weekly GHCP reports | `.docs/Weekly/<date>_GHCP-Seat-Opp.md` or GHCPAnalyst | Seat velocity for FY boundary credibility |
| Account roster | `.docs/AccountReference.md` | Tier, Tranche, SSP aliases |
| Metric definitions | Instruction: `GHCP_Seat_Opportunity.instructions.md` | Seat opportunity formulas |

## Scope Rules

- **Accounts**: Strategic + Major, Tranche A + B only. Tranche C = milestone-specific, lower priority.
- **Milestones**: Monthly $ > $5,000 unless flagged as duplicates or sub-threshold noise.
- **Grouping**: Group flags by SSP. One conversation per SSP, not per-milestone.

## Data Resolution Priority

1. `.docs/_index.md` + `.docs/_data/<Account>/state.md` — cached milestone context, SSP, Tier, Tranche
2. `.docs/Weekly/` — latest GHCP seat report for velocity data (Criterion 2)
3. CRM via `crm_query` — live milestone/opportunity data when `.docs/` is stale or user requests "live" audit
4. `find_milestones_needing_tasks` / `list_opportunities` — composite tools for multi-account queries

**Default**: Use `.docs/` cached data for scope filtering and SSP lookup. Use CRM for milestone-level criterion checks. If user says "from CRM" or "live", query CRM for everything.

---

## Two-Layer Audit Model

| Layer | Criteria | What to Check |
|---|---|---|
| **Opportunity** | 1, 2, 7, 8 | Close date, close status, stage vs. commitment, FY boundary |
| **Milestone** | 3, 4, 5, 6 | Date proximity, commitment, tasks, forecast comments, duplicates |

---

## Opportunity-Level Criteria

### Criterion 1: Commitment Gap — "Is This Real?"

| Field | Rule |
|---|---|
| Filter | `commitment = Uncommitted` AND `days to milestone date ≤ 45` AND `monthly $ > $5,000` |
| Tiering | $50K+/mo + ≤30 days = **URGENT**. $10–50K + ≤45 days = **ATTENTION**. <$5K = skip. |
| Ask | "Is this commit-ready? If yes, flip to Committed. If not, re-date to realistic timeline." |
| Evidence | Check: exec sponsor? decision-maker? tasks assigned? active engagement? If none → not commit-ready. |

### Criterion 2: FY Boundary Optimization — "Pull It Forward"

| Field | Rule |
|---|---|
| Filter | `milestone date > June 30 (FY boundary)` AND `account has seat velocity > 0` AND `seat opportunity is large` |
| Applicability | **H2 only (Jan–Jun)**. Skip during H1. |
| Ask | "Can we split this? Create FY26 piece for near-term growth, keep remainder in FY-next." |
| Credibility | Does seat velocity realistically support partial achievement by June 30? If static → don't flag. |

### Criterion 7: Stage Gate Stall — "High Stage, Still Uncommitted"

| Field | Rule |
|---|---|
| Filter | `opportunity stage ≥ 3 (Empower & Achieve)` AND `all milestones on that opportunity = Uncommitted` |
| Ask | "Stage 3+ but nothing committed. Deal stalled at decision gate, or paperwork gap?" |
| Pass condition | If even one milestone is Committed, opportunity passes this check. |

### Criterion 8: Missing Close Status

| Field | Rule |
|---|---|
| Filter | `opportunity est. close date ≤ 30 days` AND `close status = blank/missing` |
| Ask | "Closes in ≤30 days with no outcome. Won, Lost, Abandoned, or needs re-dating?" |

---

## Milestone-Level Criteria

### Criterion 3: Pipeline Hygiene — "Clean the Noise"

| Sub-type | Rule | Ask |
|---|---|---|
| **Duplicates** | 2+ milestones, same opp, overlapping dates, similar names | "Merge or cancel the duplicate." |
| **Sub-threshold** | $/mo implies < 50 seats | "Cancel or re-scope." |
| **Zombie dates** | Date in past, status still "On Track" | "Close, re-date, or mark completed/cancelled." |

### Criterion 4: Zero Execution Plan — "Nobody's Driving"

| Field | Rule |
|---|---|
| Filter | `tasks = 0` AND `monthly $ > $5,000` AND `days to milestone date ≤ 90` |
| Ask | "Add execution tasks or explain why no plan." |
| Sequencing | Run after Criterion 1 — commitment before execution planning. |

### Criterion 5: No Forecast Comments — "Dark Milestones"

| Field | Rule |
|---|---|
| Filter | `forecast comments = 0 or blank` AND `days to milestone date ≤ 90` |
| Ask | "SSP needs to narrate — status, blockers, next steps." |
| Priority | Lower than Criteria 1–4. Flag in bulk. |

### Criterion 6: Committed but Silent — "Committed Value Drifting"

| Field | Rule |
|---|---|
| Filter | `commitment = Committed` AND `last CRM note > 30 days old` AND `days to milestone date ≤ 60` |
| Ask | "Who's tracking this? Committed value needs active monitoring." |
| Risk tier | Highest pipeline risk — committed value missig without warning. |

---

## Timing & Applicability

| Calendar Position | Active Criteria | Rationale |
|---|---|---|
| **H2 (Jan–Jun)** | All 8 | FY boundary pressure |
| **H1 (Jul–Dec)** | 1, 3, 4, 5, 6, 7, 8 | Criterion 2 not actionable yet |
| **Last 30 days of quarter** | 1, 7, 8 prioritized | Highest forecast risk |
| **Post-QBR** | 3, 4, 5 | Hygiene gaps exposed during review |

## Anti-Patterns (Don't Flag)

- Milestones under $5K/mo unless duplicates or hygiene
- Tranche C unless material $ anomaly
- Milestones > 90 days out for Criteria 1, 4, 5
- FY-next milestones during H1 (Criterion 2)
- Accounts with no active SSP (different problem)
- Opportunities already Won/Lost/Abandoned
- Stage 1-2 opportunities (too early for Criterion 7)

---

## Output Format

### Flagged Items (Ranked)

```
| Priority | Layer | Account | Item # | $/Mo | Days Out | Criterion | SSP | Ask |
|---|---|---|---|---|---|---|---|---|
| 🔴 URGENT | ... | ... | ... | ... | ... | ... | ... | ... |
| 🟡 ATTENTION | ... | ... | ... | ... | ... | ... | ... | ... |
| ⚪ MONITOR | ... | ... | ... | ... | ... | ... | ... | ... |
```

### SSP Action Summary

Group all flags by SSP. One email per SSP with all their flagged items.

```
| SSP | # Flags | Accounts | Total $/Mo at Risk | Items |
|---|---|---|---|---|
```

### Email Template (per SSP)

**Subject**: `[Account] — Pipeline Review: [Brief Description]`

1. **What**: One-sentence anomaly description
2. **Evidence**: CRM data point (date, commitment, $, stage)
3. **Ask**: Binary question (commit/re-date, split/keep, cancel/justify)
4. **Recommendation**: Suggested action with rationale
5. **Deadline**: "Please respond by [date]"
