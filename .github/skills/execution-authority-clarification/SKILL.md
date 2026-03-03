---
name: execution-authority-clarification
description: 'Execution authority clarification: resolves contradictory guidance when CSA and CSAM give conflicting direction on the same work item by assigning explicit decision-owners per disputed area. Triggers: tie-break, conflicting direction, who decides, contradictory guidance, CSA vs CSAM dispute, authority overlap.'
argument-hint: 'Provide opportunityId and milestoneId(s) under disputed direction'
---

## Purpose

Detects overlapping CSAM/CSA authority signals on committed milestones and produces explicit owner-of-decision assignments for each disputed area, eliminating execution paralysis.

## Freedom Level

**Medium** — Authority classification requires judgment; tie-break rules are exact.

## Trigger

- Conflicting guidance appears between CSAM and CSA on execution choices
- User asks "who owns this decision?" or "CSA vs CSAM authority"
- Milestone has mixed technical and customer-facing direction

## Flow

1. Call `msx-crm:get_milestone_activities` for the disputed milestone — detect conflicting direction signals.
2. Call `msx-crm:crm_query` on milestone and task entities to gather role attribution and responsibility metadata.
3. Classify each disputed area using the authority model (see below).
4. Generate dry-run `msx-crm:update_milestone` to record CSA technical decision and CSAM orchestration notes.
5. Generate dry-run `msx-crm:create_task` for follow-up actions assigned to correct owner.

## Authority Model

| Domain | Decision Owner | Communication Owner |
|---|---|---|
| Technical feasibility | CSA | CSA informs CSAM of implications |
| Architecture constraints | CSA | CSA documents, CSAM communicates to customer |
| Customer expectation | CSAM | CSAM manages timeline/scope messaging |
| Delivery resourcing | CSAM (escalation) | CSAM owns partner/ISD coordination |
| Timeline adjustment | CSAM (customer) + CSA (technical) | Joint — CSA provides technical basis, CSAM communicates |

## Decision Logic

- Technical disputes → CSA is final authority
- Customer-facing implications → CSAM communicates adjustments
- Mixed (technical + customer impact) → CSA decides technical path, CSAM communicates customer impact
- If neither role claims decision → flag as `unresolved_authority` requiring explicit assignment

## Output Schema

- `authority_conflicts`: list of disputed areas with current signals
- `tie_break_decisions`: owner-of-decision per area
- `communication_plan`: who communicates what to whom
- `dry_run_updates`: milestone/task payloads
- `next_action`: "Authority clarified. Would you like to run `execution-monitoring` to verify execution is back on track?"
