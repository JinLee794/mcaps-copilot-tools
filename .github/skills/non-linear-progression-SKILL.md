---
name: non-linear-progression
description: 'Guides MCEM stage loopback when customer readiness gaps, proof failures, capacity constraints, or scope changes require iteration to an earlier stage. Available at any stage. Use when opportunity needs to loop back, proof failed, scope changed, readiness gaps require rework, or user asks about stage regression or non-linear flow. Triggers: stage loopback, non-linear, stage regression, proof failed, scope change, rework needed, go back to Stage.'
argument-hint: 'Provide opportunityId and the reason for potential loopback'
---

## Purpose

Guides structured stage loopback when evidence shows the opportunity is not ready to progress — preventing false advancement and preserving execution integrity through deliberate iteration.

## Freedom Level

**Medium** — Loopback assessment requires judgment; loopback patterns are documented.

## Trigger

- Proof failure or incomplete evidence at Stage 3
- Capacity or readiness gaps discovered post-commitment
- User asks "should we go back?" or "this isn't ready"
- Exit criteria validation reveals unmet prerequisites

## Flow

1. Identify current stage and the triggering gap (from `exit-criteria-validation` or user context).
2. Classify the loopback type (see patterns below).
3. Recommend target stage and specific re-entry skills.
4. Generate dry-run actions to document the loopback reason in CRM.

## Common Loopback Patterns

| Trigger | From → To | Re-entry Skill |
|---|---|---|
| Proof fails or is inconclusive | Stage 3 → Stage 2 | `proof-plan-orchestration` |
| Architecture infeasible | Stage 3 → Stage 2 | `architecture-feasibility-check` |
| Capacity/delivery gap post-commit | Stage 4 → Stage 3 | `commit-gate-enforcement` |
| Scope change by customer | Stage 4 → Stage 2 | `pipeline-qualification` + `proof-plan-orchestration` |
| Adoption stall reveals design issue | Stage 5 → Stage 4 | `value-realization-pack` |
| Customer priority shift | Any → Stage 1 | `customer-outcome-scoping` |

## Decision Logic

- Loopback is recommended when VO evidence contradicts current stage positioning
- Document loopback reason in milestone comments before stage change
- Notify accountable roles for both current and target stages
- Loopback is not failure — it preserves long-term execution integrity

## Output Schema

- `loopback_recommended`: boolean
- `from_stage`: current stage
- `to_stage`: recommended target stage
- `reason`: specific evidence driving the loopback
- `re_entry_skill`: skill to invoke at the target stage
- `dry_run_documentation`: CRM update payloads to record loopback
- `next_action`: names the re-entry skill for the target stage
