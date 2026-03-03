---
name: customer-outcome-scoping
description: 'Defines measurable customer outcomes for CSAM at MCEM Stage 1 during Listen and Consult. Ensures customer success measures are explicit, measurable, and linked to opportunity and success plan structures. Use when CSAM scopes customer outcomes, defines success measures, or asks about outcome clarity, customer priorities, or success plan creation. Triggers: customer outcomes, success measures, outcome scoping, Stage 1 outcomes, customer priorities, measurable outcomes.'
argument-hint: 'Provide account identifier and customer context for outcome scoping'
---

## Purpose

Ensures customer outcomes are explicitly defined, measurable, and documented in CRM before the opportunity progresses beyond Stage 1 — providing the foundation for success plan creation and milestone scoping.

## Freedom Level

**Medium** — Outcome definition requires customer context judgment; CRM structure is exact.

## Trigger

- New customer engagement during Listen & Consult
- User asks "what outcomes should we define?" or "customer success scope"
- Pre-Stage 2 preparation requiring explicit outcome clarity

## Flow

1. Call `msx-crm:get_my_active_opportunities` — check for existing opportunities on this account.
2. Call `msx-crm:crm_get_record` on opportunity (if exists) for current state, solution play, and success plan linkage.
3. Evaluate outcome clarity (see criteria below).
4. Generate outcome recommendations as structured output.
5. If gaps exist, generate dry-run `msx-crm:update_milestone` or `msx-crm:create_task` for documentation actions.

## Outcome Clarity Criteria

| Element | Required | Evidence |
|---|---|---|
| Business problem stated | Yes | Customer-articulated need (not Microsoft projection) |
| Measurable success metric | Yes | Quantifiable target (e.g., reduce X by Y%, achieve Z users) |
| Baseline available | Recommended | Current state measurement exists or plan to obtain |
| Timeline expectation | Yes | Customer's expected value realization window |
| Stakeholder identified | Recommended | Named customer sponsor or decision maker |

## Decision Logic

- Outcomes are scoped when all required elements are present with customer evidence
- Missing baseline → acceptable to proceed but flag for Stage 2 collection
- No measurable metric → block progression; create task to define measurement
- Multiple outcomes → prioritize by customer emphasis and commercial alignment

## Output Schema

- `outcome_definitions`: list of scoped outcomes with metrics and timelines
- `clarity_gaps`: missing elements per outcome
- `draft_actions`: dry-run task payloads for gap closure
- `next_action`: "Outcomes scoped. Specialist should run `pipeline-qualification` to validate opportunity readiness for Stage 2 — recommend engaging the Specialist."
