---
name: value-realization-pack
description: 'Produces value realization assessment for CSA at MCEM Stages 4-5. Validates that committed milestones have measurable outcome definitions, tracking mechanisms, and delivery evidence. Generates gap closures for under-specified value milestones. Use when CSA enters Realize Value phase, prepares value realization report, or asks about outcome measurement, value tracking, or Stage 4-5 readiness. Triggers: value realization, outcome measurement, value tracking, Stage 4-5 value, realization pack, value evidence.'
argument-hint: 'Provide opportunityId entering or in Realize Value / Manage & Optimize phase'
---

## Purpose

Validates that committed milestones have measurable outcome definitions, metric tracking, execution cadence, and CSU coordination — ensuring value realization is observable and reportable.

## Freedom Level

**Medium** — Value assessment requires judgment; gap identification is rule-based.

## Trigger

- Opportunity enters Realize Value / Manage & Optimize
- User asks "is value being realized?" or "value tracking status"
- Pre-governance value evidence preparation

## Flow

1. Call `msx-crm:crm_get_record` on opportunity for stage, success plan, and solution play.
2. Call `msx-crm:get_milestones` with `opportunityId` — isolate value/adoption milestones from summary.
3. Call `msx-crm:get_milestone_activities` for milestones lacking execution cadence evidence (targeted only).
4. Evaluate value completeness per milestone (see below).
5. Generate dry-run corrections:
   - `msx-crm:update_milestone` for measurable comments/metric updates
   - `msx-crm:create_task` for missing CSAM/CSU coordination actions

## Value Completeness Criteria

| Element | Required | Evidence |
|---|---|---|
| Metric intent | Yes | `msp_monthlyuse` or equivalent populated |
| Baseline defined | Yes | Starting measurement documented |
| Target defined | Yes | Success threshold stated |
| Owner assigned | Yes | CSU-aligned owner on milestone |
| Tracking active | Yes | Recent activity showing measurement cadence |

## Decision Logic

- Pack complete only when each value milestone has metric intent, owner, date, and next activity
- Weak evidence → output mandatory gap closures before declaring value realization readiness
- Route adoption concerns to CSAM via `adoption-excellence-review`
- Route expansion signals to `expansion-signal-routing`

## Output Schema

- `value_checklist`: per-milestone completeness assessment
- `measurement_plan`: metrics, baselines, targets, tracking approach
- `csam_ready_summary`: what CSAM needs for customer governance
- `dry_run_gap_fixes`: milestone/task payloads
- `next_action`: "Value pack prepared. Would you like to run `adoption-excellence-review` for milestones with usage gaps?"
