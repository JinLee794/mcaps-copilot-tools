---
name: exit-criteria-validation
description: 'Validates opportunity progress against formal MCEM exit criteria for the current stage using Verifiable Outcomes from CRM entity state. Available at any MCEM stage. Use when any role checks stage readiness, validates exit criteria, prepares for stage transition, or asks about stage progression readiness. Triggers: exit criteria, stage readiness, stage gate, stage transition, ready to advance, progression check.'
argument-hint: 'Provide opportunityId and current or target MCEM stage'
---

## Purpose

Checks whether an opportunity meets the formal MCEM exit criteria for its current stage by reading Verifiable Outcomes from CRM entity state — not relying on the Stage field alone.

## Freedom Level

**Medium** — VO interpretation requires judgment; exit criteria checks are rule-based.

## Trigger

- Any role preparing for stage progression
- User asks "are we ready for Stage X?" or "exit criteria check"
- Pre-governance stage readiness validation

## Flow

1. Determine current stage using `mcem-stage-identification` skill.
2. Load exit criteria for current stage from MCEM flow (see criteria below).
3. Call `msx-crm:crm_get_record` on opportunity for stage, solution play, success plan.
4. Call `msx-crm:get_milestones` with `opportunityId` for milestone state.
5. Map achieved Verifiable Outcomes against exit criteria.
6. Report pass/fail per criterion.

## Stage Gate Exit Criteria (VO-based)

| Gate | Criterion | CRM Evidence |
|---|---|---|
| 1→2 | Qualified opportunity | `opportunity.statecode = 0` + `activestageid` past qualification |
| 1→2 | Solution play selected | `opportunity.msp_salesplay ne null` |
| 2→3 | Plays confirmed | `opportunity.msp_salesplay` valid value |
| 2→3 | Business value reviewed | BVA entity `status = Complete` |
| 2→3 | CSP created | `msp_successplan` linked |
| 3→4 | Customer agreement | `opportunity.activestageid` post-commitment |
| 3→4 | Resources aligned | `msp_commitmentrecommendation = 861980001` + `msp_milestonedate` set |
| 4→5 | Solution delivered | `msp_milestonestatus = 861980003` |
| 4→5 | Health metrics agreed | CSP health fields populated |

## Decision Logic

- **All criteria met** → stage progression is supported, recommend next-stage skills
- **Partial** → list specific gaps with remediation actions
- **BPF stage diverges from VO-based stage** → flag discrepancy explicitly
- Route gaps to the accountable role for the current stage

## Output Schema

- `stage_gate`: which gate is being evaluated
- `criteria_results`: pass/fail per criterion with CRM evidence
- `overall_readiness`: ready | not_ready | partial
- `gap_analysis`: specific items blocking progression
- `bpf_vs_vo_discrepancy`: flag if declared stage differs from evidence-based stage
- `next_action`: names the appropriate skill for either gap remediation or next-stage entry
