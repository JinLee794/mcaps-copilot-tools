---
name: partner-motion-awareness
description: 'Adjusts agent guidance when partner-led or co-sell motions are present on the opportunity. Modifies ownership assumptions, delivery attribution, and handoff patterns for partner scenarios. Available at any MCEM stage. Use when opportunity involves partner, co-sell, partner-led delivery, ISV, or asks about partner motion, co-sell alignment, or partner delivery attribution. Triggers: partner motion, co-sell, partner-led, ISV partner, partner delivery, partner attribution.'
argument-hint: 'Provide opportunityId with partner involvement'
---

## Purpose

Detects partner involvement on opportunities and adjusts ownership assumptions, delivery attribution, and skill guidance to account for partner-led or co-sell motions — preventing incorrect role assignments.

## Freedom Level

**Medium** — Partner motion detection is rule-based; guidance adjustment requires context judgment.

## Trigger

- Opportunity involves partner or co-sell motion
- User mentions partner delivery, ISV, or co-sell
- Skill output assumes Microsoft-only delivery but partner is involved

## Flow

1. Call `msx-crm:crm_get_record` on opportunity — check for partner linkage, co-sell flags, and deal registration.
2. Call `msx-crm:get_milestones` with `opportunityId` — check delivery attribution on milestones.
3. Classify partner motion type (see below).
4. Produce adjustment guidance for active skills.

## Partner Motion Types

| Motion | Ownership Impact | Delivery Attribution |
|---|---|---|
| **Microsoft-led, partner-assisted** | Microsoft roles lead; partner contributes | Milestone delivery = Microsoft + Partner |
| **Partner-led** | Partner leads delivery; Microsoft advisory | Milestone delivery = Partner; CSAM orchestrates |
| **Co-sell** | Shared pipeline; split accountability | Explicit split per milestone required |
| **ISV solution** | ISV owns solution; Microsoft enables platform | ISV delivery; CSA validates architecture |

## Decision Logic

- Partner-led milestones → do not assign Microsoft roles as delivery owners
- Co-sell → require explicit accountability split per milestone (no implicit shared)
- Partner delivery with no Microsoft contact → flag as `partner_gap_risk`
- Adjust commit-gate and handoff skills to include partner readiness checks

## Adjustment Rules for Other Skills

- `commit-gate-enforcement`: Include partner capacity/readiness in gate checks
- `delivery-accountability-mapping`: Map partner as delivery owner where applicable
- `handoff-readiness-validation`: Include partner handoff artifacts
- `execution-monitoring`: Flag partner execution gaps without absorbing partner PM work

## Output Schema

- `partner_motion_type`: classified motion with evidence
- `ownership_adjustments`: skill-specific guidance modifications
- `attribution_corrections`: dry-run milestone updates for delivery attribution
- `next_action`: returns to the invoking skill with adjusted context
