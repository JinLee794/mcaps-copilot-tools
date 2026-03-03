---
name: pipeline-hygiene-triage
description: 'Triages pipeline exceptions for Specialist at MCEM Stages 2-3 by detecting stage staleness, date drift, missing required fields, and low-quality opportunities. Generates prioritized exception list and dry-run corrections. Use when Specialist runs weekly pipeline review, pre-forecast hygiene check, or asks about pipeline health, stale opportunities, or field completeness. Triggers: pipeline hygiene, stage staleness, pipeline review, forecast prep, field completeness.'
argument-hint: 'Provide opportunityId(s) or run across all active Specialist opportunities'
---

## Purpose

Detects and prioritizes pipeline hygiene exceptions across active Stage 2–3 opportunities, enabling Specialist to maintain pipeline quality and forecast accuracy.

## Freedom Level

**Medium** — Prioritization involves judgment; field corrections are exact.

## Trigger

- Weekly pipeline review cadence
- Pre-forecast hygiene pass
- User asks "what needs cleanup?" or "pipeline health check"

## Flow

1. Call `msx-crm:get_my_active_opportunities` — single call for all active opportunities.
2. For each opportunity, call `msx-crm:get_milestones` with `opportunityId` — compact summary of active milestones.
3. For milestones with unclear status, call `msx-crm:get_milestone_activities` (targeted only).
4. Score and rank exceptions by severity.
5. Generate dry-run `msx-crm:update_milestone` and `msx-crm:update_task` payloads for top exceptions.

## Exception Detection Rules

| Exception | Detection | Severity |
|---|---|---|
| Stage staleness | Opportunity in Stage 2–3 for >governance threshold with no recent activity | High |
| Date drift | `msp_milestonedate` is past or within 14 days with no active tasks | High |
| Missing required fields | `msp_salesplay` is null, `msp_monthlyuse` empty on active milestones | Medium |
| Owner mismatch | Milestone owner does not match expected role for stage | Medium |
| Low qualification signals | Stage 2 opportunity lacks customer priority alignment or commercial fit | Medium |
| Stale forecast comments | Forecast comments older than current period | Low |

## Decision Logic

- Rank by: proximity (`msp_milestonedate`) × severity × governance threshold
- Escalate when milestone is within governance threshold and has no mitigation activity
- Route to SE when exception involves technical proof gaps
- Route to CSA/CSAM when exception involves commitment readiness

## Output Schema

- `exceptions`: prioritized list with severity, reason, and affected milestone
- `proposed_field_updates`: dry-run payloads for corrections
- `escalation_path`: who to engage (SE, CSA, CSAM, partner) per exception
- `next_action`: "Pipeline reviewed. CSA/CSAM should run `commit-gate-enforcement` for milestones approaching commitment — recommend engaging the CSU team."
