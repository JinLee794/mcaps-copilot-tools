---
name: risk-surfacing
description: 'Proactive risk detection across CRM, M365, and vault mediums for any role at any MCEM stage. Synthesizes signals from multiple sources to surface execution, relationship, and delivery risks before they escalate. Use when any role asks about risks, wants risk review, checks account health, or performs proactive risk analysis. Triggers: risk surfacing, risk detection, risk review, account health, risk signals, proactive risk, what risks, deal risks.'
argument-hint: 'Provide opportunityId or accountId for risk analysis scope'
---

## Purpose

Synthesizes signals from CRM, M365 (WorkIQ), and vault to surface execution, relationship, and delivery risks proactively — before they escalate into pipeline or customer impact.

## Freedom Level

**Medium** — Risk classification requires multi-source judgment; signal collection is tool-based.

## Trigger

- Any role requests risk review or account health check
- Scheduled hygiene cadence for proactive risk surfacing
- Pre-commit or pre-governance risk preparation

## Flow

1. **CRM signals** — Call `msx-crm:crm_get_record` on opportunity + `msx-crm:get_milestones` for milestone state.
2. **M365 signals** — Call `ask_work_iq` with scoped query (apply WorkIQ scoping skill) for communication recency, engagement frequency, and sentiment.
3. **Vault signals** — If vault is available, call `oil:get_vault_context()` for customer notes, prior risk flags, and relationship history.
4. Classify risks by type and severity (see taxonomy below).
5. Generate risk summary with recommended mitigations.

## Risk Taxonomy

| Risk Type | Signal Sources | Example |
|---|---|---|
| **Execution** | CRM milestone dates vs today; task completion rate | Milestone overdue by >14 days |
| **Relationship** | M365 communication gap; sentiment shift | No customer contact in 30+ days |
| **Pipeline** | Opportunity age vs stage; stalled progression | Stage 2 for >60 days |
| **Delivery** | Milestone status distribution; at-risk count | >30% milestones at `msp_milestonestatus = 861980001` |
| **Commitment** | Commit recommendation vs evidence | Committed without delivery date |
| **Cross-role** | Missing role engagement per stage model | No CSAM activity on Stage 4 opp |

## Severity Classification

- **Critical**: Evidence of active customer impact or imminent deadline miss
- **High**: Structural gap that will escalate without intervention within 2 weeks
- **Medium**: Pattern suggests risk but no immediate trigger
- **Low**: Informational — monitor in next cadence

## Decision Logic

- Cross-reference ≥2 mediums for each risk (CRM confirms signal, M365 provides evidence, or vault provides history)
- Single-medium risk → flag medium gap, present with lower confidence
- Route each risk to the accountable role for the current stage
- Critical risks → escalation recommendation with minimum intervention

## Output Schema

- `risk_items`: list of risks with type, severity, evidence_sources, accountable_role
- `medium_coverage`: which mediums were queryable and which were not
- `recommended_mitigations`: specific actions per risk with skill references
- `next_action`: names role-appropriate skill for highest-severity risk
