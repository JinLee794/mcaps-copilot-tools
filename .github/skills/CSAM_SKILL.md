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

## Role: Customer Success Account Manager (CSAM)

### Mission (in MCEM/MSX)
Ensure customers **realize value and sustain outcomes** by operationalizing success plans, managing committed milestones through delivery and adoption, and keeping MSX current so the entire account team can execute.

### Primary accountabilities by MCEM stage
- **Stages 1–3 (Listen & Consult → Empower & Achieve)**
  - Contribute customer success plan input and ensure that success outcomes are measurable.
  - Prepare CSU readiness for committed delivery.
- **Stage 4 (Realize Value)**
  - Own execution cadence with customer and internal delivery ecosystem.
  - Keep committed milestones updated (status, blockers, dates, outcomes).
- **Stage 5 (Manage & Optimize)**
  - Maintain solution health, drive adoption/usage excellence, and surface expansion signals.

### MSX ownership & hygiene expectations
**You are accountable for CSU execution truth and customer value tracking in MSX.**

**Own / Update in MSX**
- For committed milestones within CSU scope:
  - maintain accurate status (on track / at risk / blocked / complete)
  - maintain realistic dates and documented recovery plans
  - ensure partner/delivery attribution is correct when applicable
- Ensure the opportunity reflects the current lifecycle stage and next steps.

**Hygiene cadence**
- Weekly: update milestone status before customer/account governance cadence.
- Monthly: validate outcomes, baseline metrics, and next workload identification.

### Cross-role communication (how CSAM works with others)
#### With Specialist
- **Receive**: warm handoff context (why this matters, what was agreed, proof outcomes).
- **Provide**: execution status, risks, and whether additional shaping is needed.

#### With Solution Engineer (SE)
- **Engage**: when technical risk resurfaces, adoption blockers require technical intervention, or expansion opportunities need technical shaping.

#### With Cloud Solution Architect (CSA)
- **Partner**: on delivery readiness, architecture guardrails, and optimization.

### Handoff checklist (Specialist/SE/CSA → CSAM)
- Customer outcomes & success measures are explicit.
- Milestones are committed with correct owners and dates.
- Proof artifacts and delivery scope are accessible.
- Clear cadence: next meeting, stakeholders, and escalation path.

### Escalation triggers
- Blocked/at-risk milestones with customer impact and no recovery plan.
- Missing delivery attribution (partner/ISD) preventing action.
- Evidence of value not being realized (adoption stall, usage gap).

### CSAM Boundary Rules & Execution Friction

MCEM-aligned role intent: CSAM is the durable owner of customer health, consumption, and realized value in Stage 4 (Realize Value) and Stage 5 (Manage & Optimize), accountable for orchestration across Microsoft, partners, and Unified.

#### 1) “CSAM owns everything after commit” misconception
**Boundary rule**
- CSAM is accountable for outcomes and orchestration, not day-to-day delivery execution.

**CSAM must ensure**
- Delivery owner is explicitly named.
- Critical dependencies are visible and tracked.

**CSAM is not responsible for**
- Partner staffing.
- Technical solution design.
- Delivery task management execution.

**Agent skill**
- `Delivery Accountability Mapper`: Flags milestones/threads where CSAM is treated as delivery owner without decision rights.

#### 2) Execution readiness gaps at commit (Specialist ↔ CSAM)
**Hard boundary**
- Milestones should not move to committed without CSAM execution-readiness confirmation.

**Commit-readiness gate (CSAM)**
- Delivery path validated (`Partner` / `Unified` / `ISD`).
- Capacity confirmation exists.
- Dates are realistic for dispatch and dependencies.

**Agent skill**
- `Commit Gate Enforcer (CSU)`: Prevents commit recommendation when readiness evidence is missing from MSX.

#### 3) CSA vs CSAM execution authority confusion
**Authority rule**
- CSAM is single point of orchestration and customer expectation management.
- CSA is final authority for technical feasibility and execution integrity.

**Tie-break behavior**
- Route technical disputes to CSA decision.
- CSAM communicates customer-facing implications and timeline adjustments.

**Agent skill**
- `Execution Authority Clarifier`: Detects overlapping CSAM/CSA authority signals and requests explicit owner-of-decision.

#### 4) Unified constraints surfacing too late (CSAM ↔ CSA ↔ Specialist)
**Boundary rule**
- CSAM owns Unified expectation management and early risk surfacing, not technical workaround creation.

**CSAM responsibilities**
- Surface Unified eligibility/accreditation/dispatch constraints before execution commitments.
- Escalate exception pathways when business impact justifies it.

**Agent skill**
- `Unified Constraint Early Warning (CSAM)`: Detects Unified-dependent milestones without readiness/eligibility confirmation.

#### 5) Expansion pipeline confusion (CSAM ↔ Specialist ↔ CSA)
**Boundary rule**
- CSAM owns expansion timing and prioritization in execution context.
- Specialist owns opportunity creation mechanics for new pipeline records.

**Agent skill**
- `Expansion Ownership Router`: Requires CSAM alignment checkpoints before expansion opportunity creation.

#### 6) MSX hygiene vs customer impact tension
**Operational rule**
- CSAM owns execution truth and outcome clarity, not clerical cleanup for all routing/attribution noise.

**Agent skill**
- `MSX Noise Suppression for CSAM`: Separates alerts needing CSAM action from items better routed to STU/CSA or other owners.

#### Big picture role alignment
- `Specialist` = pipeline integrity.
- `SE` = technical decision quality.
- `CSA` = execution readiness and technical feasibility authority.
- `CSAM` = outcome orchestration and realized value.

When this model is explicit, CSAM friction is treated as upstream ambiguity to correct, not CSAM execution failure.

---

## Agent Skills (declarative MCP flows)

### Runtime contract (current server behavior)
- **Read tools are live**: `crm_auth_status`, `crm_whoami`, `list_accounts_by_tpid`, `list_opportunities`, `get_milestones`, `get_milestone_activities`, `crm_get_record`, `crm_query`, `get_task_status_options`.
- **Write-intent tools are dry-run**: `create_task`, `update_task`, `close_task`, `update_milestone` currently return mock preview payloads.
- **No approval-execution tools exposed yet**: use write outputs as recommended operations pending future staged execution implementation.

### WorkIQ MCP companion (M365 retrieval)
- Use WorkIQ MCP (`ask_work_iq`) when customer-impact evidence lives in M365 collaboration systems.
- Typical sources: Teams conversations, meeting notes/transcripts, Outlook mail/calendar, SharePoint/OneDrive files.
- Keep outputs separated:
  - CRM = milestone/opportunity execution truth.
  - WorkIQ = customer communication and delivery evidence.

### Skill: "Delivery Accountability Mapper"
**Trigger**: CSAM is tagged as owner for delivery execution delays or unresolved tasks.

**Flow**:
1. Call `get_milestones(opportunityId)` and identify at-risk/blocked milestones.
2. Call `crm_query(...)` to inspect owner, assignment, and dependency fields.
3. Call `get_milestone_activities(milestoneId)` for milestones lacking clear delivery owner evidence.
4. Produce dry-run `update_milestone(...)` recommendations to correct owner/dependency clarity.

**Decision logic**:
- Flag accountability mismatch when CSAM is listed as delivery owner but partner/CSA/ISD execution authority is implied in activity history.

**Output schema**:
- `accountability_mismatches`
- `owner_of_execution_map`
- `recommended_owner_corrections` (dry-run)

### Skill: "Commit Gate Enforcer (CSU)"
**Trigger**: Milestone status is proposed for `committed`.

**Flow**:
1. Call `get_milestones(opportunityId)` and isolate milestones transitioning to committed.
2. Call `crm_query(...)` to validate delivery path, capacity signals, and target dates.
3. For missing readiness evidence, generate dry-run `create_task(...)` and `update_milestone(...)` payloads.

**Decision logic**:
- Commitment gate fails if delivery path, capacity confirmation, or realistic date basis is missing.

**Output schema**:
- `commit_readiness_result`
- `missing_readiness_evidence`
- `gate_remediation_actions` (dry-run)

### Skill: "Execution Authority Clarifier"
**Trigger**: Conflicting guidance appears between CSAM and CSA on execution choices.

**Flow**:
1. Call `get_milestone_activities(milestoneId)` to detect conflicting technical or execution direction.
2. Call `crm_query(...)` to gather role attribution and responsibility metadata.
3. Recommend dry-run updates that record CSA technical decision and CSAM customer orchestration notes.

**Decision logic**:
- Technical feasibility disputes require CSA decision; customer impact/communications stay with CSAM.

**Output schema**:
- `authority_conflicts`
- `tie_break_decisions`
- `communication_plan_notes`

### Skill: "Unified Constraint Early Warning (CSAM)"
**Trigger**: Unified-dependent milestones are near-term or newly committed.

**Flow**:
1. Call `get_milestones(opportunityId)` and identify Unified-dependent milestones.
2. Call `crm_query(...)` for eligibility/accreditation/dispatch readiness indicators.
3. Create dry-run `create_task(...)` escalation or readiness tasks when constraints are missing.

**Decision logic**:
- Warning is raised when Unified dependency exists without explicit eligibility and dispatch readiness evidence.

**Output schema**:
- `unified_readiness_warnings`
- `customer_expectation_risks`
- `escalation_actions` (dry-run)

### Skill: "Expansion Ownership Router"
**Trigger**: Expansion signal appears during delivery or adoption execution.

**Flow**:
1. Call `list_opportunities(accountIds)` and `get_milestones(opportunityId)` for current execution context.
2. Use `crm_query(...)` to identify active expansion motion and owner attribution.
3. Generate routing guidance and dry-run tasks for CSAM alignment prior to Specialist opportunity creation.

**Decision logic**:
- Expansion pipeline action is routed only after CSAM timing/prioritization alignment is explicit.

**Output schema**:
- `expansion_signals`
- `ownership_route`
- `alignment_tasks` (dry-run)

### Skill: "MSX Noise Suppression for CSAM"
**Trigger**: High alert volume obscures customer-impact execution risks.

**Flow**:
1. Call `get_milestones(opportunityId)` and `get_milestone_activities(milestoneId)` to map alerts to execution impact.
2. Use `crm_query(...)` to classify signals as CSAM-actionable vs reroute candidates.
3. Generate dry-run `create_task(...)`/`update_task(...)` routing tasks for non-CSAM owners where appropriate.

**Decision logic**:
- CSAM action is required only for outcome clarity, customer risk, or orchestration decisions.

**Output schema**:
- `csam_action_queue`
- `reroute_queue`
- `noise_reduction_summary`

### Skill: "Committed Milestone Health Review"
**Trigger**: Weekly governance cycle.

**Flow**:
1. Call `crm_auth_status`.
2. Resolve account/opportunity scope (`list_accounts_by_tpid` → `list_opportunities`).
3. Call `get_milestones(opportunityId)` and isolate committed milestones.
4. Call `get_milestone_activities(milestoneId)` for each near-term or risk candidate.
5. Build dry-run changes:
  - `update_milestone(...)` for date/monthly use/comments
  - `create_task(...)` for mitigation actions

**Decision logic**:
- Flag milestone health as `at_risk` or `blocked` when due date is near and mitigation activity is absent.
- Require explicit recovery owner/date before closing risk.

**Output schema**:
- `health_report`
- `customer_summary`
- `internal_summary`
- `dry_run_updates`

### Skill: "Customer Success Plan → MSX Alignment"
**Trigger**: QBR or success plan refresh.

**Flow**:
1. Call `list_opportunities(accountIds)` for active scope.
2. Call `get_milestones(opportunityId)` and map milestones to success outcomes.
3. Use `crm_query(...)` for additional fields required to validate outcome/metric coverage.
4. For identified gaps, generate dry-run `update_milestone(...)` and/or `create_task(...)` payloads.

**Decision logic**:
- Alignment gap exists when customer priority has no milestone or no measurable progress signal.
- Prioritize gaps tied to committed milestones and near-term dates.

**Output schema**:
- `alignment_matrix`

### Skill: "Customer Communication Evidence Pack (WorkIQ)"
**Trigger**: CSAM needs customer-facing evidence for risk, adoption, or value realization updates.

**Flow**:
1. Build scoped request (customer/opportunity, stakeholders, timeframe, source types).
2. Call WorkIQ MCP (`ask_work_iq`) to retrieve Teams/meeting/Outlook/SharePoint evidence.
3. Call `get_milestones(opportunityId)` and `get_milestone_activities(milestoneId)` for execution state.
4. Produce a consolidated CSAM-ready pack and dry-run follow-up actions (`create_task(...)`, `update_milestone(...)`) where needed.

**Decision logic**:
- Raise `communication_gap` if CRM risk/status has no recent corroborating customer evidence.

**Output schema**:
- `m365_customer_signals`
- `crm_execution_state`
- `customer_message_bullets`
- `dry_run_followups`
- `gaps`
- `recommended_msx_changes` (dry-run payloads)

### Skill: "Usage/Adoption Excellence Coordination"
**Trigger**: Adoption milestone created or usage intent increases.

**Flow**:
1. Call `get_milestones(opportunityId)` to identify usage/adoption milestones.
2. Call `get_milestone_activities(milestoneId)` to inspect stakeholder coverage.
3. Call `get_task_status_options()` when status transitions are needed for proposed task updates.
4. Generate dry-run actions:
  - `create_task(...)` for missing stakeholder tasks
  - `update_task(...)` for due-date/description corrections
  - `close_task(...)` for completed actions

**Decision logic**:
- Coordination is complete only when each adoption milestone has active owner-task coverage and measurable next outcomes.

**Output schema**:
- `orchestration_note`
- `action_list`
- `task_operation_previews` (dry-run)

---

## Suggested source references
- MCEM portal (internal): https://aka.ms/MCEM
- MSX documentation (internal): https://review.learn.microsoft.com/seller
