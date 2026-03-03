---
name: architecture-execution-handoff
description: 'Produces structured CSA handoff note when proof completes or milestone flips from uncommitted to committed at MCEM Stage 3-4 transition. Documents architecture decisions, constraints, risks, success metrics, and next actions. Use when CSA completes proof, milestone commits, or asks about handoff note, architecture summary, or proof-to-delivery transition. Triggers: architecture handoff, proof complete, CSA handoff note, proof-to-delivery, Stage 3-4 transition, execution handoff.'
argument-hint: 'Provide opportunityId with milestones transitioning from proof to committed delivery'
---

## Purpose

Creates a structured handoff note documenting architecture decisions, constraints, risks, success metrics, and explicit next actions when proof completes or milestones transition from uncommitted to committed.

## Freedom Level

**Low** — Handoff quality gate. Handoff note must contain all required elements before declaring execution-ready.

## Trigger

- Proof complete (POC/Pilot/Demo outcome available)
- Commitment flips uncommitted → committed
- User asks "create handoff note" or "architecture summary for delivery"

## Flow

1. Call `msx-crm:get_milestones` with `opportunityId` — identify milestones transitioning to committed or with completed proof.
2. Call `msx-crm:get_milestone_activities` for proof traces on impacted milestones (targeted only).
3. Call `msx-crm:crm_query` on task entities for broader dependency tracking if needed.
4. Compile handoff note from gathered evidence (see template below).
5. Generate dry-run `msx-crm:create_task` payloads for missing owner/action gaps.

## Handoff Note Template

- **Architecture summary**: Key design decisions and rationale
- **Constraints**: Technical, regulatory, or environmental limitations
- **Deliverables**: What was proven and what remains to build
- **Risks**: Known risks with mitigation plans
- **Success metrics**: Baseline + target measurements agreed with customer
- **Next actions**: Assigned, dated tasks for delivery phase
- **Dependencies**: External/internal prerequisites for execution

## Decision Logic

- Handoff not execution-ready if constraints, dependencies, or success metrics are implicit
- Missing proof artifacts → flag and create task to close gap before handoff
- Route delivery ownership questions to CSAM via `delivery-accountability-mapping`

## Output Schema

- `handoff_note`: structured document per template above
- `completeness_check`: pass | fail with specific gaps
- `dry_run_tasks`: task payloads for gap closure
- `next_action`: "Handoff note prepared. Would you like to run `commit-gate-enforcement` to validate full Stage 3 readiness?"
