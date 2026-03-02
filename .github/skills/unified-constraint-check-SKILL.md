---
name: unified-constraint-check
description: 'Detects Unified-dependent milestones without eligibility, accreditation, or dispatch readiness evidence at MCEM Stages 3-4. Surfaces constraints before execution commitments. Use when CSA or CSAM encounters Unified delivery dependencies, dispatch blockers, eligibility gaps, or accreditation requirements. Triggers: Unified constraints, dispatch readiness, eligibility check, Unified blocker, accreditation gap, Unified dependency.'
argument-hint: 'Provide opportunityId for milestones with Unified delivery dependencies'
---

## Purpose

Prevents Unified constraints from surfacing after commitment by detecting Unified-dependent milestones that lack eligibility, accreditation, or dispatch readiness evidence.

## Freedom Level

**Medium** — Constraint detection is rule-based; customer impact assessment requires judgment.

## Trigger

- Unified-dependent milestones are near-term or newly committed
- User asks "are there Unified blockers?" or "dispatch readiness check"
- Pre-commitment readiness validation for Unified-path milestones

## Flow

1. Call `msx-crm:get_milestones` with `opportunityId` and keyword `unified` — isolate Unified-dependent milestones.
2. Call `msx-crm:crm_query` for eligibility, accreditation, and dispatch readiness indicators on those milestones.
3. Call `msx-crm:get_milestone_activities` for milestones lacking readiness evidence (targeted only).
4. Classify constraint severity (see below).
5. Generate dry-run corrections:
   - `msx-crm:create_task` for escalation or readiness tasks
   - `msx-crm:update_milestone` for risk/status updates

## Constraint Classification

| Constraint | Severity | Action |
|---|---|---|
| No eligibility evidence | High | Block commitment; create eligibility verification task |
| Accreditation gap | High | Escalate to delivery org |
| Dispatch not confirmed | Medium | Create dispatch readiness task with timeline |
| Customer timeline depends on Unified, no contingency | Critical | Flag as `schedule_impact_high`; require contingency plan |
| Unified dependency exists with full readiness | Low | Document for tracking, no action needed |

## Role Lens (applied via role cards)

- **CSA focus**: Technical feasibility constraints, architecture prerequisites, environment readiness
- **CSAM focus**: Customer expectation management, timeline impact communication, exception escalation

## Output Schema

- `unified_dependency_report`: milestones with Unified path and readiness state
- `constraint_warnings`: gaps classified by severity
- `timeline_impact`: estimated schedule effect per constraint
- `dry_run_actions`: escalation/readiness task payloads
- `next_action`: "Unified constraints assessed. Would you like to run `commit-gate-enforcement` to validate full commitment readiness?"
