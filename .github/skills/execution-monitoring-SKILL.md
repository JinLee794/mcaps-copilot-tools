---
name: execution-monitoring
description: 'Monitors committed milestone execution for CSA at MCEM Stage 4 by checking risk state, dependencies, architecture guardrails, and execution blockers. Produces risk dashboard and remediation plan. Use when CSA runs daily or weekly execution sweep, or asks about committed milestone risk, execution blockers, or delivery dependencies. Triggers: execution monitoring, committed risk, execution sweep, delivery blockers, architecture guardrails, Stage 4 monitoring.'
argument-hint: 'Provide opportunityId(s) or run across all CSA-owned committed milestones'
---

## Purpose

Provides CSA with a risk-classified view of committed milestones, surfacing execution blockers, architecture constraint violations, and owner-motion mismatches that threaten delivery.

## Freedom Level

**Medium** — Risk classification requires judgment; corrective actions are role-specific.

## Trigger

- Daily/weekly execution sweep for committed scope
- User asks "what's at risk?" or "execution status"
- Pre-governance preparation

## Flow

1. Call `msx-crm:crm_auth_status`.
2. Call `msx-crm:get_my_active_opportunities` — single call for all active opportunities.
3. Call `msx-crm:get_milestones` with `opportunityId` per opportunity — filter committed milestones from summary.
4. Call `msx-crm:get_milestone_activities` only for at-risk/blocked candidates from step 3.
5. Classify execution state per milestone.
6. Generate dry-run corrections:
   - `msx-crm:update_milestone` for risk/status/comments
   - `msx-crm:create_task` for follow-up actions

## Execution State Classification

| State | Criteria |
|---|---|
| **On track** | Active tasks with owners, no blockers, date >30 days |
| **At risk** | Date <30 days with incomplete tasks OR missing delivery motion |
| **Blocked** | No active tasks, no recovery plan, OR owner-motion mismatch detected |
| **Owner mismatch** | CSA listed as owner but delivery motion is Partner/ISD/Unified |

## Decision Logic

- Owner-motion mismatch → flag for reassignment, do not absorb delivery PM work
- Technical blockers → CSA-actionable, produce remediation plan
- Delivery/resourcing blockers → route to CSAM or delivery owner
- Commercial/scope issues → route to Specialist
- Escalate when no recovery activity exists for near-term committed milestone

## Output Schema

- `risk_dashboard`: milestone-level status with reason codes
- `remediation_plan`: owner + action + due date per item
- `owner_mismatch_flags`: milestones needing ownership clarification
- `dry_run_operations`: update/task preview payloads
- `next_action`: "Execution sweep complete. Would you like to run `value-realization-pack` for milestones approaching delivery completion?"
