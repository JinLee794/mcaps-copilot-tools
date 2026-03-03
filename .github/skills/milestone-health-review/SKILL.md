---
name: milestone-health-review
description: 'CSAM weekly status report: scans committed work for date drift, blocked items, and overdue completions. Generates internal remediation queue and customer update document with dry-run corrections. Triggers: weekly status, date drift, blocked items, overdue, committed status scan, CSAM report.'
argument-hint: 'Scope by opportunityId(s) or run across all CSAM-governed committed work'
---

## Purpose

Produces a structured health report for committed milestones within CSAM scope, flagging at-risk or blocked milestones that need recovery plans or escalation.

## Freedom Level

**Medium** — Health classification requires judgment; status updates are exact.

## Trigger

- Weekly governance cycle
- User asks "how are my milestones?" or "committed milestone status"
- Pre-customer-meeting preparation

## Flow

1. Call `msx-crm:crm_auth_status`.
2. Call `msx-crm:get_my_active_opportunities` — single call for all active opportunities.
3. Call `msx-crm:get_milestones` with `opportunityId` per opportunity — isolate committed milestones from compact output.
4. Call `msx-crm:get_milestone_activities` only for near-term or risk candidates from step 3.
5. Classify health state per milestone.
6. Generate dry-run corrections:
   - `msx-crm:update_milestone` for date/status/comments
   - `msx-crm:create_task` for mitigation actions

## Health Classification

| State | Criteria |
|---|---|
| **On track** | `msp_milestonestatus = 861980000`, active tasks with owners, date >30 days out |
| **At risk** | `msp_milestonestatus = 861980001` OR date <30 days with incomplete tasks |
| **Blocked** | `msp_milestonestatus = 861980002` OR no active tasks and date <14 days |
| **Complete** | `msp_milestonestatus = 861980003` — include in summary, no action needed |

## Decision Logic

- Flag `at_risk` or `blocked` when due date is near and mitigation activity is absent
- Require explicit recovery owner + date before closing risk
- Separate customer-facing summary from internal action items
- Route technical blockers to CSA; route delivery/resourcing to partner/ISD

## Output Schema

- `health_report`: milestone-level status with classification and reason
- `customer_summary`: customer-safe status bullets
- `internal_summary`: action items with owners and dates
- `dry_run_updates`: update/task preview payloads
- `next_action`: "Health review complete. Would you like to run `delivery-accountability-mapping` for blocked milestones?"
