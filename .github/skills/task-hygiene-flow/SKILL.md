---
name: task-hygiene-flow
description: 'SE CRM-task-record inspector: reads each task row for correct owner, due date, status, and blocker notes. Patches stale or orphaned entries via dry-run. Operates at individual task-row level, not parent milestone. Triggers: task record inspector, SE daily check, stale tasks, orphaned tasks, task owner, task due date, CRM task row.'
argument-hint: 'Scope by opportunityId(s) or sweep all SE-owned active task records'
---

## Purpose

Keeps milestone tasks current and actionable by detecting missing owners, stale dates, incomplete status, and absent completion conditions on SE-scoped milestones.

## Freedom Level

**Medium** — Task classification requires judgment; field corrections are exact.

## Trigger

- Daily/weekly SE operating cadence
- User asks "what tasks need updating?" or "task hygiene check"
- Milestone activities appear stale or incomplete

## Flow

1. Call `msx-crm:get_my_active_opportunities` — single call for all active opportunities.
2. Call `msx-crm:get_milestones` with `opportunityId` per opportunity — filter milestones where SE is contributing.
3. Call `msx-crm:get_milestone_activities` for milestones with unclear task state (targeted only).
4. Apply task completeness checks (see below).
5. Generate dry-run corrections:
   - `msx-crm:create_task` for missing tasks
   - `msx-crm:update_task` for stale fields
   - `msx-crm:close_task` for completed actions

## Task Completeness Checks

| Check | Pass | Fail Action |
|---|---|---|
| Owner assigned | Task has named owner | Flag for assignment |
| Due date set | Realistic future date | Flag for date update |
| Status current | Reflects actual progress | Flag for status refresh |
| Blocker documented | If blocked, reason is stated | Flag for blocker text |
| Completion condition | Clear done-criteria exist | Flag for criteria addition |

## Decision Logic

- Prioritize tasks on near-term milestones (due within 30 days)
- For uncommitted milestones: focus on BANT gap closure tasks
- For committed milestones where SE influenced: ensure continuity until CSU execution is stable
- Skip milestones where SE has no active contribution

## Output Schema

- `task_report`: milestone-level task hygiene status
- `stale_tasks`: tasks needing update with specific gap
- `proposed_corrections`: dry-run create/update/close payloads
- `next_action`: context-dependent — "Specialist should run `handoff-readiness-validation` for milestones approaching commitment — recommend engaging the Specialist." or "Task hygiene complete — no escalation needed."
