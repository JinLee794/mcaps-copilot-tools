---
name: handoff-readiness-validation
description: 'Validates STU-to-CSU handoff completeness when Specialist transitions committed milestones to CSAM/CSA at MCEM Stage 3. Checks owner assignment, outcome clarity, proof artifacts, and next actions. Use when Specialist is handing off, customer agreement is reached, or commitment flips to committed. Triggers: handoff readiness, STU to CSU, handoff check, transition validation, Stage 3 handoff.'
argument-hint: 'Provide opportunityId for the handoff-candidate opportunity'
---

## Purpose

Ensures clean STU→CSU handoff by validating that committed milestones have explicit owners, measurable outcomes, proof artifacts, and documented next actions before Specialist disengages.

## Freedom Level

**Low** — Handoff quality gate. No handoff-ready declaration without passing all checks.

## Trigger

- Customer agreement reached or commitment flips to committed
- Specialist asks "is this ready to hand off?" or "handoff check"
- Stage 3 exit criteria include clean STU→CSU transition

## Flow

1. Call `msx-crm:get_milestones` with `opportunityId` — isolate committed or commitment-candidate milestones.
2. For each milestone, call `msx-crm:get_milestone_activities` to verify task hygiene:
   - Owner is CSU-aligned (CSAM or CSA), not still STU
   - Due dates are realistic and set
   - Measurable outcome signal exists (`msp_monthlyuse` or task completion criteria)
3. Call `msx-crm:crm_get_record` on opportunity for stage alignment and success plan linkage.
4. Validate handoff artifact completeness (see checklist below).
5. If gaps found, generate dry-run `msx-crm:create_task` payloads for remediation.

## Handoff Checklist

- [ ] Why customer bought (business case summary)
- [ ] What success looks like (measurable outcomes)
- [ ] What was promised and explicitly out of scope
- [ ] Proof artifacts and customer agreement evidence are findable
- [ ] CSU-aligned owner assigned to each committed milestone
- [ ] Next 2–3 actions are assigned and dated
- [ ] Clear cadence: next meeting, stakeholders, escalation path

## Decision Logic

- **Ready**: All checklist items satisfied → handoff-ready
- **Not ready**: Any checklist gap → block handoff, list specific gaps
- **Owner mismatch**: Milestone still STU-owned post-commitment → flag for reassignment

## Output Schema

- `ready`: boolean
- `blocking_gaps`: list of missing items from checklist
- `handoff_note`: structured Specialist → CSAM/CSA summary
- `draft_tasks`: dry-run task payloads for gap closure
- `next_action`: If ready → "STU→CSU handoff validated. Next step is `delivery-accountability-mapping`, owned by CSAM. Recommend notifying the CSAM to initiate Stage 4."
