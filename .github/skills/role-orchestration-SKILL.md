---
name: role-orchestration
description: 'Recommends which role (ATU/STU/CSU/Partner) should lead next actions based on MCEM stage ownership and current opportunity state. Prevents action paralysis when multiple roles are involved. Available at any MCEM stage. Use when user asks who should lead, who owns next steps, role coordination, or asks about role handoff across stages. Triggers: role orchestration, who leads, who owns, role handoff, stage ownership, role coordination.'
argument-hint: 'Provide opportunityId and the action or decision needing role clarity'
---

## Purpose

Determines which role should lead the next action based on MCEM stage accountability model, current opportunity state, and the nature of the pending decision — eliminating multi-role paralysis.

## Freedom Level

**Medium** — Role recommendation requires stage and context judgment.

## Trigger

- Multiple roles involved and leadership is unclear
- User asks "who should own this?" or "who leads next?"
- Stage transition requires explicit role handoff

## Flow

1. Determine current MCEM stage — use `mcem-stage-identification` skill if needed.
2. Map stage to accountable unit using MCEM accountability model.
3. Identify the nature of the pending action (see classification below).
4. Recommend lead role with explicit ownership statement.

## MCEM Accountability Model

| Stage | Accountable Unit | Lead Role |
|---|---|---|
| Stage 1: Listen & Consult | ATU | Specialist (signal intake), CSAM (outcome input) |
| Stage 2: Inspire & Design | STU | Specialist (lead), SE (technical), CSA (feasibility) |
| Stage 3: Empower & Achieve | STU | Specialist (lead → handoff), SE (proof), CSA+CSAM (commit gate) |
| Stage 4: Realize Value | CSU | CSAM (lead), CSA (architecture guardrails) |
| Stage 5: Manage & Optimize | CSU | CSAM (lead), Specialist (expansion signals) |

## Action Classification

| Action Type | Default Lead |
|---|---|
| Technical feasibility | CSA |
| Customer communication | CSAM |
| Pipeline/opportunity structure | Specialist |
| Proof execution | SE |
| Delivery coordination | CSAM (orchestration), Partner/ISD (execution) |
| Expansion evaluation | Specialist (pipeline), CSAM (timing) |

## Decision Logic

- Stage accountability overrides action type when there's ambiguity
- Cross-stage actions → lead role is determined by where the opportunity currently sits
- If user's role differs from recommended lead → present handoff recommendation

## Output Schema

- `recommended_lead`: role name + rationale
- `contributing_roles`: other roles with specific asks
- `handoff_needed`: boolean + direction if user is not the lead role
- `next_action`: names the skill the lead role should invoke next
