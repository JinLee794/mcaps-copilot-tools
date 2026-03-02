---
description: "MCEM sales process flow — the process spine mapping Stages 1–5, role accountability (ATU/STU/CSU), exit criteria, and atomic skill activation. Use when reasoning about opportunity stage progression, MCEM exit criteria, stage identification, role orchestration, pipeline health, commit gates, handoff readiness, delivery accountability, value realization, or expansion routing. Loaded for Specialist, SE, CSA, CSAM workflows."
---

# MCEM Sales Process Flow

## How to Use This Flow

1. Identify the opportunity's current MCEM stage — use `mcem-stage-identification` skill if unclear.
2. Load the matching stage section below.
3. Activate only the skills listed for the user's confirmed role at that stage.
4. Stages are NOT strictly linear — follow non-linear guidance when customer readiness requires iteration.

**Accountability-based lens override**: When the user's role differs from the stage-accountable unit, load BOTH role cards (user's + accountable unit's). Make explicit who leads vs. contributes. Do NOT auto-invoke skills owned by a different role — present the handoff and name the role to engage.

## Stage 1: Listen & Consult

**Objective**: Understand customer needs, desired outcomes, and qualify whether an opportunity exists.
**Accountable**: ATU | **Contributors**: Partners, Support/Services
**Our roles active**: Specialist (signal intake), CSAM (customer outcome input)

**Core operations**:
- Consume signals, leads, and insights
- Initial customer outreach and discovery
- Stakeholder mapping and problem definition
- Opportunity qualification
- Confirm initial Solution Play alignment

**Skills activated**:
- `pipeline-qualification` (Specialist) — qualify opportunity from signals
- `customer-outcome-scoping` (CSAM) — define measurable customer outcomes

**Exit criteria → Stage 2** (Verifiable Outcomes):
- [ ] Qualified opportunity exists — `opportunity.statecode = 0` + `activestageid` past qualification
- [ ] Customer needs and outcomes clearly defined
- [ ] Initial Solution Play selected — `opportunity.msp_salesplay ne null`

---

## Stage 2: Inspire & Design

**Objective**: Shape the solution vision and align customer stakeholders on value and approach.
**Accountable**: STU | **Co-orchestrates**: ATU | **Partners**: solution alignment, co-sell
**Our roles active**: Specialist (lead), SE (technical shaping), CSA (feasibility)

**Core operations**:
- Orchestrate Microsoft and partner team
- Conduct envisioning workshops
- Capture customer value (Business Value Assessment)
- Define technical and business proof requirements
- Create or update Customer Success Plan
- Secure programs, funding, or investments

**Skills activated**:
- `proof-plan-orchestration` (SE + Specialist) — design proof requirements
- `architecture-feasibility-check` (CSA) — validate executability
- `pipeline-hygiene-triage` (Specialist) — stage staleness, field completeness
- `partner-motion-awareness` (cross-role) — adjust for co-sell/partner-led

**Exit criteria → Stage 3** (Verifiable Outcomes):
- [ ] Solution Plays confirmed — `opportunity.msp_salesplay` has valid value
- [ ] Business value reviewed and endorsed — BVA entity `status = Complete`
- [ ] Customer Success Plan created — `msp_successplan` linked to opportunity

---

## Stage 3: Empower & Achieve

**Objective**: Prove feasibility, finalize the deal, and secure customer commitment.
**Accountable**: STU | **Engaged**: Deal Desk, Legal, Finance, Partners
**Our roles active**: Specialist (lead → handoff), SE (proof delivery), CSA (commit gate), CSAM (CSU readiness)

**Core operations**:
- Deliver technical/business proof (POC, MVP, Pilot, Demo)
- Finalize architecture and solution design
- Evaluate deal strategy and capacity
- Create and present proposal
- Engage legal, procurement, and negotiation
- Secure customer agreement

**Skills activated**:
- `commit-gate-enforcement` (CSA + CSAM) — validate delivery readiness before commitment
- `handoff-readiness-validation` (Specialist → CSAM) — ensure clean STU→CSU transition
- `unified-constraint-check` (CSA/CSAM) — dependency, eligibility, dispatch readiness
- `exit-criteria-validation` (cross-role) — verify formal MCEM exit criteria met

**Non-linear**: If proof gaps emerge, loop back to Stage 2 (`proof-plan-orchestration`, `architecture-feasibility-check`).

**Exit criteria → Stage 4** (Verifiable Outcomes):
- [ ] Customer agreement in place — `opportunity.activestageid` post-commitment
- [ ] Resources aligned to delivery plan — `msp_engagementmilestone.msp_commitmentrecommendation = 861980001`
- [ ] Outcomes committed and baseline metrics defined — milestones Committed + `msp_milestonedate` set

---

## Stage 4: Realize Value

**Objective**: Deliver the solution and ensure customer outcomes are achieved.
**Accountable**: CSU | **Delivery**: Services, Partners
**Our roles active**: CSAM (lead), CSA (architecture guardrails)

**Core operations**:
- Deliver solution against agreed outcomes
- Initiate customer training and change management
- Monitor usage and adoption
- Track business value realization
- Update Customer Success Plan

**Skills activated**:
- `delivery-accountability-mapping` (CSAM) — who owns execution vs orchestration
- `execution-authority-clarification` (CSAM + CSA) — resolve technical vs customer authority
- `milestone-health-review` (CSAM) — status, blockers, date drift
- `execution-monitoring` (CSA) — architecture guardrails during delivery

**Non-linear**: If delivery uncovers scope gaps, loop back to Stage 3 (`commit-gate-enforcement`) or Stage 2 (`architecture-feasibility-check`).

**Exit criteria → Stage 5** (Verifiable Outcomes):
- [ ] Solution delivered — `msp_engagementmilestone.msp_milestonestatus = 861980003`
- [ ] Customer health metrics agreed — CSP health fields populated
- [ ] Business value tracking in place — consumption data recording

---

## Stage 5: Manage & Optimize

**Objective**: Sustain value, drive consumption, and identify expansion opportunities.
**Accountable**: CSU | **Re-engaged**: ATU, STU (for expansion)
**Our roles active**: CSAM (lead), Specialist (expansion signals)

**Core operations**:
- Monitor usage trends and health signals
- Proactive backlog and success plan reviews
- Identify expansion or renewal signals
- Refresh consumption and success plans
- Ensure customer can operate and maintain solution independently

**Skills activated**:
- `adoption-excellence-review` (CSAM) — usage/adoption health
- `expansion-signal-routing` (CSAM → Specialist) — route expansion back to STU
- `customer-evidence-pack` (CSAM) — value realization evidence for governance

**Non-linear**: Expansion signals create new Stage 1–2 opportunities — route via `expansion-signal-routing`.

**Exit criteria** (opportunity completion):
- [ ] Outcomes met and sustained — ACR trending + milestone completion
- [ ] Next customer needs identified
- [ ] Opportunity completed with next steps defined

---

## Cross-Stage Capabilities (any stage)

These skills are available at any MCEM stage, not bound to a specific stage gate:

| Skill | Purpose |
|---|---|
| `mcem-stage-identification` | Determine current stage from Verifiable Outcomes (CRM entity state) |
| `role-orchestration` | Recommend which role should lead next actions based on stage ownership |
| `exit-criteria-validation` | Check opportunity progress against MCEM exit criteria for current stage |
| `non-linear-progression` | Guide stage loopback when readiness/proof gaps exist |
| `partner-motion-awareness` | Adjust guidance for partner-led or co-sell motions |
| `risk-surfacing` | Proactive risk detection across CRM + M365 + vault |
| `task-hygiene-flow` | Daily milestone task maintenance (SE) |
| `vault-context-assembly` | Assemble vault knowledge for CRM prefetch |
| `workiq-query-scoping` | Scope M365 evidence retrieval |

---

## Verifiable Outcomes (VO) Model

The agent determines MCEM stage from **Verifiable Outcomes** — CRM entity states that evidence real progress — not from the opportunity Stage field alone.

### VO → Exit Criteria → CRM Entity Mapping

| Stage Gate | Exit Criteria | CRM Evidence | Entity / Field |
|---|---|---|---|
| 1 → 2 | Qualified opportunity | Open opportunity past qualification | `opportunity.statecode = 0` + `activestageid` transition |
| 1 → 2 | Solution Play selected | Sales play populated | `opportunity.msp_salesplay ne null` |
| 2 → 3 | Plays confirmed | Sales play with confirmed alignment | `opportunity.msp_salesplay` valid value |
| 2 → 3 | Business value reviewed | BVA completed and linked | BVA entity `status = Complete` |
| 2 → 3 | CSP created | Success plan linked | `msp_successplan` exists + linked |
| 3 → 4 | Customer agreement | Opportunity committed | `opportunity.activestageid` + `statecode` |
| 3 → 4 | Resources aligned | Milestones committed with dates | `msp_commitmentrecommendation = 861980001` + `msp_milestonedate` populated |
| 4 → 5 | Solution delivered | Milestones completed | `msp_milestonestatus = 861980003` |
| 4 → 5 | Health metrics agreed | CSP health fields populated | CSP entity health fields |
| 5 (exit) | Outcomes sustained | Consumption targets met | ACR trending + milestone completion rate |

**Critical field corrections**:
- `msp_milestonestatus = 861980001` = **At Risk** (NOT Committed). Commitment is `msp_commitmentrecommendation = 861980001`.
- Solution Play field is `msp_salesplay` (not `msp_solutionplay`).
- Use `msp_milestonedate` (not `msp_estimatedcompletiondate` — does not exist).

### Stage Identification Algorithm

1. Read `opportunity.activestageid` as declared BPF stage (fast signal)
2. Read Verifiable Outcomes from CRM entities (milestones, success plans, BVAs, sales play)
3. Map achieved VOs against exit criteria for each stage gate
4. Determine highest stage whose exit criteria are fully evidenced (VO-based stage)
5. Compare VO-based stage against `activestageid` — flag discrepancy if they diverge
6. Output: `actual_stage` (VO-based), `declared_stage` (BPF field), `gap_analysis` if mismatched

**Communication pattern**: "The CRM shows a completed BVA and linked CSP — Stage 2 exit criteria are met, ready for Stage 3."

**Discrepancy pattern**: "The BPF stage shows Stage 3, but milestone commitment recommendation is still Uncommitted and no CSP exists — Stage 2 exit criteria are NOT met."
