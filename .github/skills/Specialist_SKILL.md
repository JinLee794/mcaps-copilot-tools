---
name: specialist-msx-ops
description: 'Specialist (STU) operating skill for MSX/MCEM focused on pipeline creation, stage 2-3 opportunity progression, uncommitted milestone ownership, and warm handoff to CSU.'
argument-hint: 'Provide opportunity/milestone IDs, pipeline stage, commitment state, and the outcome needed'
---

# Agent Skill Profile

> **Purpose**: This SKILL.md defines role-specific responsibilities and communication patterns for managing **Microsoft Sales Experience (MSX)** in alignment with the **Microsoft Customer Engagement Methodology (MCEM)**.
>
> **Audience**: Field roles and copilots/agents supporting those roles.
>
> **Scope**: Opportunity & milestone management, pipeline hygiene, role-to-role handoffs, and cross-role orchestration.

---

## Shared definitions (applies to all roles)

- **MSX record types**
  - **Opportunity**: The customer engagement container aligned to MCEM stages and exit criteria.
  - **Milestone**: The execution unit for commitment, delivery, and usage/consumption outcomes.
  - **Account / Customer Priority / Plan**: The planning context that informs what the opportunity should achieve.

- **Commitment language**
  - **Uncommitted**: Still shaping; not fully resourced/approved for delivery.
  - **Committed**: Customer agreement + internal readiness; handoff to execution & value realization.

- **Handoff goals**
  - Preserve continuity (no “reset” of customer context)
  - Maintain data integrity (MSX is the system of record)
  - Make next steps explicit (who does what by when)

---

## Role: Specialist (STU Specialist)

### Mission (in MCEM/MSX)
Own **pipeline creation and progression** through MCEM stages 2–3 for the solution area, and ensure clean handoffs to CSU once customer commitment is achieved.

### Primary accountabilities by MCEM stage
- **Stage 1 (Listen & Consult)**
  - Support opportunity qualification and scenario shaping when pulled in.
- **Stages 2–3 (Inspire & Design → Empower & Achieve)**
  - Typically **create and own opportunities** in your domain and drive them to customer agreement.
  - Create and own **uncommitted milestones**, right-size them, and manage proof/investment.
- **Stage 4+ (Realize Value → Manage & Optimize)**
  - Transition committed production milestones to CSU and remain engaged for expansion/usage motions.

### MSX ownership & hygiene expectations
**You are accountable for opportunity/milestone truth in MSX during stages 2–3.**

**Own / Update in MSX**
- Create/update opportunity fields that drive pipeline insights and orchestration.
- Create milestones that:
  - reflect executable projects
  - have correct owner and monthly usage / value signal
  - include meaningful project comments
- Ensure commitment and stage reflect verifiable outcomes.

**Hygiene cadence**
- Weekly: pipeline review for stage staleness, date drift, missing required fields.
- Before forecast calls: verify that forecast comments and milestone status are current.

### Cross-role communication (how Specialist works with others)
#### With Solution Engineer (SE)
- **Purpose**: drive technical win and proof execution.
- **Pattern**: agree on proof plan, success criteria, and the milestone plan.

#### With Cloud Solution Architect (CSA)
- **Purpose**: validate executability and readiness to commit.
- **Pattern**: engage CSA early for delivery dependencies and late for commitment readiness.

#### With CSAM
- **Purpose**: warm handoff for committed milestones and customer success plan alignment.
- **Pattern**: provide context + explicit asks; keep CSAM informed of major changes.

### Handoff checklist (Specialist → CSAM/CSA)
- Opportunity stage matches exit criteria.
- Committed milestones have:
  - CSU-aligned owner, dates, risk status, and measurable outcomes
- Proof artifacts and customer agreement evidence are findable.
- Next 2–3 actions are assigned and dated.

### Escalation triggers
- Opportunity stalled in stage 2–3 beyond governance thresholds.
- Milestones at-risk/blocked within 60 days without clear help path.
- Missing required fields impacting pipeline hygiene.

### Specialist Boundary Rules & Common Friction Scenarios
MCEM makes Specialist (STU) accountable for stage 2–3 opportunity progression, uncommitted milestone ownership, and transition of committed milestones to CSU.

#### Boundary model (default)
- **Opportunity ownership**: Specialist owns stage progression when Specialist creates stage 2–3 opportunities.
- **Milestone ownership split**: Specialist owns milestone existence/structure; SE owns technical completion signals for proof execution.
- **Commitment gate**: Specialist does not set milestone to committed without CSA/CSAM execution readiness confirmation.
- **Handoff completion**: Specialist responsibility ends only after a warm, documented STU → CSU handoff.
- **Quality over volume**: Stage 2 pipeline must meet qualification quality signals, not just coverage quantity.

#### Scenario 1: Opportunity ownership conflict (ATU ↔ Specialist)
**Common friction**
- ATU originates qualified signal; Specialist creates stage 2 opportunity; ownership remains implicitly shared.
- Leads to conflicting MSX edits, forecast drift, and unclear stage advancement accountability.

**Boundary rule**
- If Specialist creates stage 2–3 opportunity, Specialist is the single accountable owner for stage movement and milestone structure.

**Specialist obligations**
- Control stage movement (2 ↔ 3) and milestone right-sizing.
- Collaborate with ATU on account strategy and with SE on technical win.

**Agent guardrail skill**
- `Opportunity Ownership Clarifier`: detects mixed ownership signals and recommends one accountable opportunity owner in MSX.

#### Scenario 2: Milestone creation vs execution confusion (Specialist ↔ SE)
**Common friction**
- Specialist creates POC/Pilot or Production milestones; SE executes technical work; closeout ownership is assumed rather than explicit.
- Results in stale milestones and duplicated follow-ups.

**Boundary rule**
- Specialist owns milestone structure and assignment; SE owns technical completion evidence.

**Specialist obligations**
- Ensure milestone scope, explicit owner assignment, and category correctness (POC/Pilot vs Production).

**Agent guardrail skill**
- `Milestone Accountability Split Checker`: flags milestones where creator, owner, and execution accountability are misaligned.

#### Scenario 3: Commitment pressure vs execution readiness (Specialist ↔ CSA/CSAM)
**Common friction**
- Verbal customer agreement drives early commitment flips before delivery readiness is confirmed.
- Causes rollback, CSU trust erosion, and rework.

**Hard boundary**
- No commitment flip without explicit CSA/CSAM execution-readiness signal.

**Specialist obligations**
- Validate delivery motion (Partner/ISD/Unified/CSA), environment readiness, and staffing path before commitment.
- Engage CSAM before commitment, not after.

**Agent guardrail skill**
- `Commit Readiness Validator (STU)`: blocks commitment recommendation unless required readiness signals are present in MSX.

#### Scenario 4: STU → CSU handoff ambiguity (Specialist ↔ CSAM)
**Common friction**
- Milestone becomes committed; Specialist disengages before CSU has reusable context.
- CSAM re-discovers requirements and customer confidence drops.

**Exit condition**
- Specialist responsibility closes only after warm handoff is completed and documented.

**Minimum handoff artifact**
- Why customer bought.
- What success looks like.
- What was promised and explicitly out of scope.

**Agent guardrail skill**
- `STU → CSU Handoff Pack Generator`: creates structured handoff summary at commitment transition.

#### Scenario 5: Pipeline inflation vs quality (Specialist internal tension)
**Common friction**
- Pipeline creation incentives drive low-quality stage 2 opportunities.
- SE/CSA/CSU spend cycles on weakly qualified opportunities.

**Quality rule**
- Stage 2 opportunity must pass qualification considerations before specialist-led technical orchestration.

**Specialist obligations**
- Document customer priority alignment and commercial fit explicitly.
- Stop low-quality opportunities early.

**Agent guardrail skill**
- `Stage 2 Qualification Smell Test`: scores opportunities for missing qualification signals before SE/CSA engagement.

#### Scenario 6: Expansion vs origination confusion (Specialist ↔ CSA/CSAM)
**Common friction**
- CSA identifies expansion path; Specialist opens new opportunity without CSAM timing alignment.
- Produces duplicates, ownership conflict, and forecast noise.

**Boundary rule**
- Specialist owns new pipeline creation after explicit CSAM alignment on expansion timing and motion.

**Agent guardrail skill**
- `Expansion Opportunity Alignment Check`: requires CSAM confirmation before expansion opportunity creation recommendation.

#### Orchestration principle
If SE is accountable for technical win and CSA/CSAM are accountable for execution readiness/value realization, Specialist is accountable for orchestration integrity across ownership, commitment, and handoff boundaries.

---

## Agent Skills (declarative MCP flows)

### Runtime contract (current server behavior)
- **Read tools are live**: `crm_auth_status`, `crm_whoami`, `list_accounts_by_tpid`, `list_opportunities`, `get_milestones`, `get_milestone_activities`, `crm_get_record`, `crm_query`, `get_task_status_options`.
- **Write-intent tools are dry-run**: `create_task`, `update_task`, `close_task`, `update_milestone` return `mock: true` preview payloads in current implementation.
- **Stage/execute tools are not implemented yet**: `STAGED_OPERATIONS.md` describes target pattern, but `execute_operation` / `cancel_operation` are not currently exposed.

### WorkIQ MCP companion (M365 retrieval)
- Use WorkIQ MCP (`ask_work_iq`) when opportunity shaping depends on M365 collaboration evidence.
- Primary evidence sources: Teams chats/channels, meeting transcripts/notes, Outlook mail/calendar, SharePoint/OneDrive docs.
- Use CRM + WorkIQ jointly:
  - CRM tools establish opportunity and milestone structure.
  - WorkIQ surfaces proof context, stakeholder alignment, and documented commitments.

### Skill: "Stage 2–3 Pipeline Builder"
**Trigger**: New customer signal or net-new project in Specialist scope.

**Flow**:
1. Call `crm_auth_status`.
2. Resolve account scope:
  - If TPID provided: call `list_accounts_by_tpid(tpids)`.
  - If account GUID already known: skip lookup.
3. Call `list_opportunities(accountIds)` to identify open opportunities.
4. For each target opportunity, call `get_milestones(opportunityId)` and classify milestones by:
  - commitment (`msp_commitmentrecommendation`)
  - date drift (`msp_milestonedate`)
  - usage/value signal (`msp_monthlyuse`)
5. Optionally call `crm_query(entitySet='opportunities', filter=..., select=...)` for extra pipeline context when required fields are missing from default projection.

**Decision logic**:
- If no active opportunity exists, output a draft opportunity + minimum milestone set (declarative recommendation only).
- If uncommitted milestones are missing or stale, output exact field updates required.

**Output schema**:
- `scope`: account/opportunity IDs used
- `findings`: gaps grouped by data quality, ownership, date risk
- `recommended_actions`: prioritized list with owner + due date

### Skill: "Handoff Readiness Check"
**Trigger**: Customer agreement reached or commitment flips to committed.

**Flow**:
1. Call `get_milestones(opportunityId | milestoneNumber | milestoneId)`.
2. For each committed or commitment-candidate milestone, call `get_milestone_activities(milestoneId)`.
3. For missing owner/accountability context, call `crm_get_record(entitySet='msp_engagementmilestones', id=milestoneId, select=...)`.
4. If remediation tasks are needed, call `create_task(...)` to generate dry-run task payloads for review.

**Decision logic**:
- Block handoff when owner/date/risk/outcome fields are missing.
- Mark handoff ready only when milestones have explicit owner, realistic date, and measurable outcome signal.

**Output schema**:
- `ready`: boolean
- `blocking_gaps`: list
- `handoff_note`: Specialist → CSA/CSAM summary
- `draft_tasks`: dry-run outputs from `create_task`

### Skill: "Pipeline Hygiene Exceptions Triage"
**Trigger**: Weekly cadence or hygiene alert.

**Flow**:
1. Call `list_opportunities(accountIds)` for in-scope accounts.
2. Call `get_milestones(opportunityId)` for each opportunity.
3. For each milestone with unclear execution, call `get_milestone_activities(milestoneId)`.
4. For proposed corrections, call `update_milestone(...)` and/or `update_task(...)` as dry-run previews.

**Decision logic**:
- Rank exceptions by proximity (`msp_milestonedate`) and risk/status signals.
- Escalate when milestone is within governance threshold and has no mitigation activity.

**Output schema**:
- `exceptions`: prioritized top list
- `proposed_field_updates`: dry-run payloads
- `escalation_path`: who to engage (SE, CSA, CSAM, partner/ISD)

### Skill: "Stage 2 Signal Intake (WorkIQ)"
**Trigger**: Net-new opportunity signal is scattered across meetings/chats/docs instead of CRM fields.

**Flow**:
1. Build scoped query (customer, timeframe, people, source types, topic keywords).
2. Call WorkIQ MCP (`ask_work_iq`) to retrieve relevant Teams/meeting/Outlook/SharePoint evidence.
3. Call `list_opportunities(accountIds)` and `get_milestones(opportunityId)` for current CRM state.
4. Produce Specialist routing guidance and dry-run action proposals where evidence suggests missing/stale CRM structure.

**Output schema**:
- `signal_summary`
- `crm_gap_map`
- `recommended_orchestration_actions`

---

## Suggested source references
- MCEM portal (internal): https://aka.ms/MCEM
- MSX documentation (internal): https://review.learn.microsoft.com/seller
