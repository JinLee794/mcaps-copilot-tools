---
name: architecture-feasibility-check
description: 'Validates architecture and delivery feasibility for CSA at MCEM Stages 2-3. Checks environment prerequisites, dependency sequencing, capacity constraints, and technical risk before solution commitment. Use when CSA evaluates executability, delivery dependencies, technical risk, or architecture readiness. Triggers: architecture feasibility, delivery dependencies, technical risk, executability check, environment readiness, capacity validation, Stage 2 feasibility.'
argument-hint: 'Provide opportunityId for the opportunity requiring feasibility assessment'
---

## Purpose

Validates that proposed solution architecture is executable by checking environment prerequisites, dependency sequencing, delivery capacity, and technical risk before the opportunity progresses toward commitment.

## Freedom Level

**Medium** — Feasibility assessment requires technical judgment; gap identification is rule-based.

## Trigger

- CSA evaluates execution readiness for Stage 2-3 opportunities
- User asks "is this feasible?" or "architecture readiness check"
- Pre-commitment technical validation

## Flow

1. Call `msx-crm:crm_get_record` on opportunity for solution play, stage, and success plan linkage.
2. Call `msx-crm:get_milestones` with `opportunityId` — identify proof/POC/pilot milestones.
3. Call `msx-crm:get_milestone_activities` for milestones with unclear technical state (targeted only).
4. Evaluate feasibility against checklist (see below).
5. Generate dry-run corrections:
   - `msx-crm:update_milestone` for risk/dependency notes
   - `msx-crm:create_task` for prerequisite actions

## Feasibility Checklist

- [ ] Environment prerequisites identified and achievable
- [ ] Dependency sequencing is realistic (no circular or impossible chains)
- [ ] Delivery capacity exists (people, partner, tooling)
- [ ] Technical risk is documented and mitigatable
- [ ] Architecture aligns with customer's existing estate
- [ ] Success metrics are measurable and technically trackable

## Decision Logic

- **Feasible**: All checklist items satisfied → ready for proof/commitment progression
- **Conditionally feasible**: Some gaps exist but are remediable → list prerequisites with owners
- **Not feasible**: Fundamental blockers exist → recommend Stage 2 loop-back for redesign
- Route capacity/resourcing gaps to CSAM for delivery path validation

## Output Schema

- `feasibility_result`: feasible | conditional | not_feasible
- `prerequisites`: list of required actions before progression
- `technical_risks`: documented risks with mitigation strategy
- `dry_run_updates`: milestone/task payloads
- `next_action`: "Architecture validated. Would you like to run `commit-gate-enforcement` to check full Stage 3 readiness?"
