---
name: proof-plan-orchestration
description: 'POC/Pilot/Demo blueprint builder: defines trial scope, acceptance criteria, timeline, environment needs, and role assignments for a technical proof. Outputs a structured plan ready for SE and Specialist execution. Triggers: POC design, pilot blueprint, demo plan, trial scope, proof requirements, technical win plan.'
argument-hint: 'Provide opportunityId and proof format (POC, Pilot, or Demo)'
---

## Purpose

Defines the technical proof plan by scoping proof type (POC/Pilot/Demo), success criteria, milestone structure, and role assignments — ensuring SE and Specialist alignment on what proves customer value.

## Freedom Level

**Medium** — Proof scoping requires judgment; milestone structure recommendations are exact.

## Trigger

- Opportunity entering proof phase (Stage 2-3)
- User asks "what should the POC cover?" or "proof plan"
- SE and Specialist need alignment on proof requirements

## Flow

1. Call `msx-crm:crm_get_record` on opportunity for solution play, stage, and customer context.
2. Call `msx-crm:get_milestones` with `opportunityId` — check for existing proof milestones (POC/Pilot/Demo).
3. If proof milestones exist, call `msx-crm:get_milestone_activities` to assess current task state.
4. Define proof plan components (see below).
5. Generate dry-run actions:
   - `msx-crm:update_milestone` for scope/criteria updates on existing proof milestones
   - `msx-crm:create_task` for proof execution tasks with owners and dates

## Proof Plan Components

- **Proof type**: POC (technical feasibility) | Pilot (business value in production-like) | Demo (capability showcase)
- **Success criteria**: Measurable outcomes customer agrees prove value
- **Scope boundaries**: What is in scope and explicitly out of scope
- **Timeline**: Realistic duration with checkpoints
- **Role assignments**: SE (technical execution), Specialist (customer relationship + scope), CSA (architecture review)
- **Exit conditions**: What outcome triggers progression vs redesign

## Decision Logic

- If proof milestones already exist with tasks → validate completeness, update gaps
- If no proof milestones → recommend creation with minimum viable structure
- Proof scope should match solution play and customer stated needs
- Route architecture concerns to CSA via `architecture-feasibility-check`

## Output Schema

- `proof_plan`: type, scope, success criteria, timeline, roles
- `milestone_structure`: recommended milestones with tasks
- `dry_run_actions`: milestone/task payloads
- `next_action`: "Proof plan defined. CSA should run `architecture-feasibility-check` to validate technical executability — would you like to engage your CSA?"
