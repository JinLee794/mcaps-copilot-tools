---
name: expansion-signal-routing
description: 'Routes expansion signals from CSAM delivery/adoption context to Specialist for pipeline creation at MCEM Stage 5. Requires CSAM timing alignment before opportunity creation. Use when CSAM or CSA identifies expansion potential during delivery or optimization, or when expansion signals appear without owner routing. Triggers: expansion signal, expansion routing, growth opportunity, new pipeline from delivery, Stage 5 expansion, upsell signal.'
argument-hint: 'Provide opportunityId where expansion signal was detected'
---

## Purpose

Captures expansion signals identified during Stage 5 delivery or optimization and routes them to Specialist/ATU with CSAM timing and prioritization alignment, preventing premature or duplicate pipeline creation.

## Freedom Level

**Medium** — Signal detection requires judgment; routing rules are exact.

## Trigger

- Expansion signal appears during delivery or adoption execution
- Optimization insight implies business scope change
- User asks "should this be a new opportunity?" or "expansion routing"

## Flow

1. Call `msx-crm:get_milestones` with `opportunityId` — isolate optimize/adoption milestones.
2. Call `msx-crm:get_milestone_activities` for evidence of unmet potential or extension patterns (targeted only).
3. Call `msx-crm:get_my_active_opportunities` to check for existing expansion opportunities (avoid duplicates).
4. Classify signal and determine routing (see below).
5. Generate dry-run actions:
   - `msx-crm:create_task` to route signal to Specialist/ATU
   - `msx-crm:update_milestone` to preserve signal context in current milestone

## Signal Classification

| Signal Type | Example | Route |
|---|---|---|
| Workload expansion | Customer wants to extend to new business unit | Specialist — new Stage 1-2 opportunity |
| Usage growth | Consumption exceeding targets, new use cases emerging | CSAM documents, Specialist evaluates |
| Technology uplift | Architecture modernization or migration need | CSA captures signal, Specialist creates pipeline |
| Renewal with scope change | Renewal includes new workloads or services | Specialist — linked opportunity |

## Decision Logic

- Expansion pipeline action is routed **only after CSAM timing/prioritization alignment is explicit**
- Do not treat signal capture as automatic opportunity creation
- Check for existing expansion opportunities to avoid duplicates
- Preserve signal evidence in current milestone comments before routing

## Output Schema

- `expansion_signals`: detected signals with classification and evidence
- `ownership_route`: CSAM → Specialist routing with timing recommendation
- `duplicate_check`: existing opportunities that may cover this signal
- `dry_run_tasks`: signal routing and preservation payloads
- `next_action`: "Expansion signal routed. Specialist/ATU to evaluate for Stage 1-2 pipeline creation."
