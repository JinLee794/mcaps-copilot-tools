---
name: architecture-execution-handoff
description: 'CSA handoff document generator: produces a structured architecture decision record (decisions, constraints, guardrails, success KPIs) when a proof-of-concept concludes. Output is the written handoff artifact itself. Triggers: write handoff note, architecture decision record, POC concluded, CSA document, proof summary writeup, handoff artifact.'
argument-hint: 'Provide opportunityId with a proof-of-concept reaching conclusion'
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
