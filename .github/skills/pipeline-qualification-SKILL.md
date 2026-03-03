---
name: pipeline-qualification
description: 'Qualifies new opportunities for Specialist at MCEM Stages 1-2 by checking customer priority alignment, commercial fit, solution play validity, and pipeline creation requirements. Generates draft opportunity and milestone structures. Use when Specialist qualifies new signals, creates Stage 2 pipeline, or asks about opportunity qualification, pipeline creation, or new customer signals. Triggers: pipeline qualification, new opportunity, qualify signal, Stage 2 pipeline, create opportunity, customer signal.'
argument-hint: 'Provide account identifier (TPID or GUID) and customer signal context'
---

## Purpose

Qualifies incoming customer signals into actionable Stage 2 pipeline by validating customer priority alignment, commercial fit, and solution play — then producing draft opportunity and milestone structures.

## Freedom Level

**Medium** — Qualification scoring requires judgment; pipeline structure recommendations are exact.

## Trigger

- New customer signal or net-new project in Specialist scope
- User asks "should I create an opportunity?" or "qualify this signal"
- ATU-originated lead requires Specialist evaluation

## Flow

1. Call `msx-crm:crm_auth_status`.
2. Resolve account scope — if TPID: call `msx-crm:list_accounts_by_tpid`; if GUID known: skip.
3. Call `msx-crm:get_my_active_opportunities` to check for existing opportunities (avoid duplicates).
4. For existing opportunities, call `msx-crm:get_milestones` with `opportunityId` to classify milestone state.
5. Apply qualification criteria (see below).
6. If qualified, output draft opportunity + minimum milestone set as recommendations.

## Qualification Criteria

| Signal | Required | Evidence |
|---|---|---|
| Customer priority alignment | Yes | Customer has stated need or business problem |
| Commercial fit | Yes | Budget indication or project funding path |
| Solution play match | Yes | `msp_salesplay` maps to a valid solution area |
| No duplicate opportunity | Yes | No existing active opportunity covers same scope |
| Stakeholder access | Recommended | Named decision maker or champion identified |

## Decision Logic

- **Qualified**: All required criteria met → output draft opportunity + milestone structure
- **Not qualified**: Missing required criteria → list specific gaps, do not recommend creation
- **Duplicate detected**: Existing opportunity covers scope → recommend updating existing vs creating new
- Quality over volume — stop low-quality opportunities early

## Output Schema

- `qualification_result`: qualified | not_qualified | duplicate_detected
- `qualification_gaps`: missing criteria with specific evidence needed
- `draft_opportunity`: recommended field values for new opportunity (if qualified)
- `draft_milestones`: minimum milestone set with owners and dates
- `next_action`: "Opportunity qualified. Would you like to initiate `proof-plan-orchestration` for Stage 2 technical shaping?"
