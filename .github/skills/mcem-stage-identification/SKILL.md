---
name: mcem-stage-identification
description: 'Diagnostic triage: pinpoints which MCEM process step (1-5) an opportunity actually occupies by reading CRM entity state, not just the recorded field label. Detects when labeled step and functional reality diverge. Use when triaging a stalled deal or confirming where an opportunity truly sits. Triggers: which stage, what stage, stage mismatch, triage stalled, diagnose position, identify step.'
argument-hint: 'Provide opportunityId to diagnose'
---

## Purpose

Analyzes CRM signals and customer outcomes to pinpoint the functional MCEM stage and identify readiness gaps.

## Freedom Level

**Medium** — Requires contextual judgment of CRM artifacts (Business Value Assessments, CSPs, Agreements) against MCEM exit criteria.

## Trigger

* User asks "What stage is this deal actually in?" or "Are we ready for the next stage?".
* Triage of stalled opportunities where activity doesn't match the CRM Stage field.

## Flow

1. **Retrieve Context**: Call `msx-crm:get_opportunity_details` and `msx-crm:get_milestones`.
2. **Evaluate Outcomes**: Compare findings against the **Exit Criteria** defined in `MCEM-stage-reference.md`.
3. **Cross-Reference**: Check if the active **Role Accountability** (ATU/STU/CSU) aligns with the functional stage.
4. **Identify Gaps**: Flag missing Verifiable Outcomes (VOs) that are required to exit the current stage.

## Decision Logic

* **Stage 1 → 2**: Confirm "Qualified opportunity" exists and a "Solution Play" is selected.
* **Stage 2 → 3**: Confirm "Customer Success Plan" (CSP) is created and "Business Value" is reviewed.
* **Stage 3 → 4**: Confirm "Customer agreement" is signed and "Outcomes committed".
* **Stage 4 → 5**: Confirm "Solution delivered" and "Health metrics agreed".
* **Non-Linear Rule**: If CRM Stage is "Stage 3" but no CSP or Business Value Assessment is found, label as **Functional Stage 2 (At Risk)**.

## Output Schema

* `current_crm_stage`: The stage currently reflected in MSX/D365.
* `functional_mcem_stage`: The stage supported by verifiable outcomes.
* `outcome_gaps`: Numbered list of missing exit criteria.
* `recommended_lead`: Which role (Specialist, SE, CSA, or CSAM) should lead next steps based on the functional stage.

---

### Why this works:

* **Routing Accuracy**: The description includes all four agent roles and the "1–5" stage numbers, ensuring it's selected when those terms are used.
* **Context Efficiency**: It references `MCEM-stage-reference.md` as the "Source Authority," keeping the skill body under the 80-line target.
* **Non-Linear Handling**: It explicitly includes a "Regression" logic rule to catch deals that have been moved forward in the CRM without completing the necessary work.

**Would you like me to draft the `shared-patterns.instructions.md` next to establish the "VAULT-PREFETCH" and scoping standards used by these skills?**