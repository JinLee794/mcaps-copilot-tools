---
name: commit-gate-enforcement
description: 'Validates milestone readiness before commitment by checking delivery path, capacity, resource alignment, and target dates. Generates remediation tasks as dry-run payloads. Use when CSAM or CSA is evaluating commit readiness at MCEM Stage 3, or when milestone commitment recommendation is proposed for committed. Triggers: commit readiness, commitment gate, ready to commit, commit check, Stage 3 gate.'
argument-hint: 'Provide opportunityId and milestoneId(s) approaching commitment'
---

## Purpose

Prevents premature milestone commitment by validating that delivery readiness evidence exists in CRM before recommending `msp_commitmentrecommendation = 861980001` (Committed).

## Freedom Level

**Low** — Write-intent gate. No commitment recommendation without passing all required checks.

## Trigger

- Milestone status is proposed for committed
- User asks "is this ready to commit?" or "commit gate check"
- Stage 3 exit criteria validation

## Flow

1. Call `msx-crm:get_milestones` with `opportunityId` — isolate milestones transitioning to committed.
2. For each candidate milestone, call `msx-crm:crm_query` on `msp_engagementmilestones` to validate:
   - `msp_commitmentrecommendation` current value
   - `msp_milestonedate` is populated and realistic (not past, not >12 months)
   - Delivery motion is captured (Partner / Unified / ISD / CSA)
   - Owner is a CSU-aligned role (not still STU-owned)
3. Call `msx-crm:get_milestone_activities` for execution evidence — tasks with owners and dates.
4. If gaps found, generate dry-run `msx-crm:create_task` payloads for remediation.

## Decision Logic

- **PASS** (all must be true):
  - Delivery path explicitly named
  - Capacity/resource confirmation exists
  - `msp_milestonedate` is set and realistic
  - At least one active task with owner and due date
  - CSAM execution-readiness confirmation present (or CSA for technical feasibility)
- **FAIL**: Missing any required evidence → block commitment recommendation
- **PARTIAL**: Some evidence present → list specific gaps with remediation tasks

## Role Lens (applied via role cards)

- **CSA focus**: Architectural feasibility, technical delivery risk, environment prerequisites
- **CSAM focus**: Customer orchestration, timeline commitments, success plan alignment, delivery path validation

## Output Schema

- `commit_readiness_result`: pass | fail | partial
- `missing_readiness_evidence`: list of specific gaps
- `gate_remediation_actions`: dry-run task payloads
- `next_action`: If pass → "Commit gate passed. Specialist should run `handoff-readiness-validation` for STU→CSU transition — recommend engaging the Specialist." If fail → name the specific remediation skill or action with owning role.
