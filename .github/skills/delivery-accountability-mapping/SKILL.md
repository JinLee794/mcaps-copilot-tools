---
name: delivery-accountability-mapping
description: 'RACI mapper: determines who owns hands-on implementation versus who coordinates logistics on committed work. Flags when CSAM is incorrectly tagged as delivery PM without decision rights. Triggers: RACI, who delivers, accountability roster, delivery PM confusion, implementation vs coordination, ownership chart.'
argument-hint: 'Provide opportunityId and milestoneId(s) with unclear RACI'
---

## Purpose

Clarifies delivery accountability on committed milestones by mapping execution ownership (Partner / ISD / Unified / CSA) versus CSAM orchestration responsibility, and flags mismatches.

## Freedom Level

**Medium** — Accountability classification requires judgment; owner corrections are exact.

## Trigger

- CSAM is tagged as owner for delivery execution delays
- User asks "who owns delivery?" or "accountability mapping"
- Milestone has no explicit delivery attribution

## Flow

1. Call `msx-crm:get_milestones` with `opportunityId` — identify at-risk/blocked committed milestones.
2. Call `msx-crm:crm_query` on `msp_engagementmilestones` to inspect owner, assignment, and delivery motion fields.
3. Call `msx-crm:get_milestone_activities` for milestones lacking clear delivery-owner evidence (targeted only).
4. Classify accountability per milestone (see model below).
5. Generate dry-run `msx-crm:update_milestone` recommendations for owner/dependency corrections.

## Accountability Model

| Role | Responsibility |
|---|---|
| **CSAM** | Outcome orchestration, customer expectation management, risk escalation |
| **CSA** | Technical feasibility, architecture guardrails, execution integrity |
| **Partner/ISD/Unified** | Day-to-day delivery execution |
| **Specialist** | Pipeline integrity (Stages 2-3 only) |

## Decision Logic

- **Accountability mismatch**: CSAM listed as milestone owner but delivery motion indicates Partner/ISD/Unified → flag for reassignment
- **Missing attribution**: No delivery owner explicitly named → flag as execution risk
- **Correct alignment**: CSAM owns orchestration with explicit delivery owner → no action
- **Escalation needed**: Delivery owner exists but is not responding/executing → route escalation to delivery org

## Output Schema

- `accountability_map`: per-milestone mapping of orchestration vs execution ownership
- `mismatches`: milestones where CSAM is incorrectly treated as delivery owner
- `missing_attribution`: milestones with no explicit delivery owner
- `recommended_owner_corrections`: dry-run update payloads
- `next_action`: "Accountability mapped. Would you like to run `milestone-health-review` for the flagged milestones?"
