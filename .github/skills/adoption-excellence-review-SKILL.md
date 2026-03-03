---
name: adoption-excellence-review
description: 'Reviews usage and adoption health for CSAM at MCEM Stage 5. Checks adoption milestone progress, stakeholder coverage, consumption targets, and success plan alignment. Generates coordination actions for adoption gaps. Use when CSAM reviews adoption milestones, usage trends, consumption targets, or asks about adoption health, usage gaps, or Stage 5 optimization. Triggers: adoption review, usage health, consumption targets, adoption milestones, Stage 5 health, optimization review.'
argument-hint: 'Provide opportunityId(s) or run across all CSAM-owned adoption milestones'
---

## Purpose

Ensures adoption and usage milestones have active owner-task coverage, measurable consumption targets, and stakeholder alignment — driving sustained value realization in Stage 5.

## Freedom Level

**Medium** — Adoption assessment requires judgment; task corrections are exact.

## Trigger

- Adoption milestone created or usage intent increases
- Weekly/monthly Stage 5 health review
- User asks "how is adoption going?" or "usage health check"

## Flow

1. Call `msx-crm:get_milestones` with `opportunityId` and keyword `adoption` — identify usage/adoption milestones.
2. Call `msx-crm:get_milestone_activities` for milestones with unclear stakeholder coverage (targeted only).
3. Call `msx-crm:get_task_status_options` when status transitions are needed for proposed updates.
4. Evaluate adoption health (see below).
5. Generate dry-run corrections:
   - `msx-crm:create_task` for missing stakeholder tasks
   - `msx-crm:update_task` for date/description corrections
   - `msx-crm:close_task` for completed actions

## Adoption Health Criteria

| Signal | Healthy | Unhealthy |
|---|---|---|
| Consumption trend | Tracking toward or above target | Flat or declining |
| Stakeholder coverage | Named owners on adoption tasks | No owner or generic assignment |
| Success plan alignment | Milestone outcomes match CSP priorities | Disconnected from success plan |
| Activity cadence | Recent tasks with progress | No activity in 30+ days |
| Measurable targets | `msp_monthlyuse` or equivalent populated | No consumption metric defined |

## Decision Logic

- Coordination is complete when each adoption milestone has active owner-task coverage and measurable next outcomes
- Flag adoption stalls when consumption is flat with no active mitigation
- Route optimization insights that imply scope expansion to `expansion-signal-routing`
- Surface value evidence for governance via `customer-evidence-pack`

## Output Schema

- `adoption_health_report`: per-milestone status with health criteria assessment
- `orchestration_actions`: tasks to close stakeholder and measurement gaps
- `task_previews`: dry-run create/update/close payloads
- `next_action`: "Adoption reviewed. Would you like to run `expansion-signal-routing` for opportunities with growth signals?"
