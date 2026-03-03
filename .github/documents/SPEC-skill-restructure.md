# Spec: Skill & Instruction Restructure

**Status**: Draft  
**Date**: 2026-03-02  
**Branch**: `refactor/mcem-pipeline-prompt-optimizations`

---

## Problem Statement

The current customization layer (~4,500 lines across 12 files) has three structural issues:

1. **Tier 0 overload** — `copilot-instructions.md` is ~400 lines; its own stated budget is <80. It contains operational procedures (CRM scoping steps 0–5, vault phases, WorkIQ references) that belong in Tier 1.

2. **Monolithic role skills** — Each role SKILL.md (430–520 lines) bundles three concerns into one file:
   - Role identity (mission, MCEM stage accountability, boundaries)
   - Shared boilerplate (upfront scoping, runtime contract, WorkIQ companion, shared definitions) — duplicated across all four
   - 10–15 procedural "agent skill" flows (e.g., "Commit Gate Enforcer", "Delivery Accountability Mapper") — each ~30 lines, not individually addressable

3. **No process-centric orientation** — Skills are organized by *role*, but the MSX/MCEM sales process is a *flow* that involves all roles at different stages. There's no artifact that models the end-to-end process and activates skills at the right moments.

---

## Design Goals

| Goal | Rationale |
|---|---|
| **Tier 0 ≤ 100 lines** | Reduce always-loaded cost; Tier 0 should route, not execute |
| **Skills are atomic** | One skill = one capability, 30–80 lines, individually triggerable |
| **Process as the spine** | A single MCEM flow document replaces role-first navigation |
| **DRY shared patterns** | Upfront scoping, runtime contract, shared definitions live in one instruction file |
| **Role context is lightweight** | Role identity = ~50-line instruction card, not a 500-line operating manual |
| **Progressive disclosure** | Agent loads process spine → activates relevant skill → pulls reference only if needed |

---

## Governing Principles (from Skill Authoring Best Practices)

All new and refactored files MUST conform to `skill-authoring-best-practices/SKILL.md`. The following principles are binding constraints on the restructure.

### P1. Description-Driven Routing

The `description` field is the **primary routing mechanism** — it determines whether a skill is selected from 100+ candidates. Every skill and instruction file must have a description that:
- Uses **third person** ("Validates milestone readiness…", not "I validate…" or "You can use this to…")
- States **what** it does AND **when** to trigger it with specific terms a user would say
- Is **≤ 1024 chars** and keyword-rich for semantic matching
- Includes role names and MCEM stage numbers as trigger terms (since custom frontmatter fields like `roles`/`mcem-stage` are not used by VS Code routing — only `description` and `name` drive selection)

### P2. Token Budget Discipline

- Each SKILL.md body **< 500 lines** (hard cap)
- Atomic skills target **30–80 lines** — challenge every paragraph: *"Does this justify its token cost?"*
- Only include context the model does **not** already know (no verbose explanations of well-known concepts)
- Replace prose with **structured tables or bullet lists** wherever possible
- Tier 0 + Tier 1 simultaneously loaded should stay **≤ 600 lines**

### P3. Progressive Disclosure (One Level Deep)

- SKILL.md is the overview; detailed domain content lives in **separate reference files**
- References are **one level deep** from the skill (no `a.md → b.md → c.md` chains)
- Referenced files > 100 lines get a table of contents at the top
- The MCEM flow document is the top-level router → atomic skills are the payload → CRM schema / vault docs are Tier 3 reference

### P4. Degrees of Freedom

Match instruction specificity to task fragility:

| Freedom | When to use | Style in skill |
|---|---|---|
| **High** | Context-dependent judgment (e.g., risk assessment, customer communication) | Text heuristics, decision criteria |
| **Medium** | Preferred pattern exists (e.g., CRM scoping, milestone review) | Numbered steps, parameterized templates |
| **Low** | Fragile/error-prone (e.g., write-gate enforcement, OData filter syntax) | Exact scripts, no deviation allowed |

Each atomic skill must declare which freedom level governs its core workflow. Write-intent operations (create/update/close) are always **low freedom** — exact confirmation gate, no shortcuts.

### P5. Metadata Standards

- `name`: ≤64 chars, **lowercase + hyphens only**, gerund or noun form preferred (e.g., `commit-gate-enforcement`, `pipeline-hygiene-triage`)
- No reserved words (`anthropic`, `claude`) in name
- `argument-hint`: Describes what the user should provide when invoking (opportunity IDs, milestone state, etc.)
- MCP tool references use fully qualified names: `msx-crm:crm_query`, `msx-crm:get_milestones`, `oil:get_customer_context`

### P6. Consistent Terminology

- Pick one term per concept and use it everywhere across all files:
  - "Opportunity" (not "deal", "engagement", "opp")
  - "Milestone" (not "engagement milestone", "msp_engagementmilestone" in prose)
  - "Committed" / "Uncommitted" (not "closed", "signed", "pre-commit")
  - "Stage 1–5" with MCEM names (not "early stage", "late stage")
- **MCEM unit → role mapping** (use consistently across all files):
  - ATU (Account Team Unit) → account-level roles (Account Executive, etc.)
  - STU (Specialist Team Unit) → **Specialist** + **Solution Engineer (SE)**
  - CSU (Customer Success Unit) → **CSAM** + **Cloud Solution Architect (CSA)**
  - Partners → referenced as "Partners" (not "ISV", "SI", or vendor-specific names in instructions)
- No time-sensitive conditionals ("before Q3 2026")
- Forward slashes in all file paths

### P7. Workflows & Validation Loops

- Multi-step operations have **numbered steps**
- Critical workflows (write-gate, commit-gate) include a **copyable checklist** for progress tracking
- Quality-critical tasks include a validation loop: execute → check → fix → repeat
- Decision points use **conditional branching** pattern (determine type → follow branch)

### P8. Iterative Improvement

New skills are validated through real-task usage, not synthetic tests:
1. Author the skill based on patterns observed during manual task completion
2. Use on real MCEM scenarios → observe where agent struggles
3. Diagnose: is the issue discovery (description), clarity (body), or missing context?
4. Targeted edit → retest on failing case + existing passing cases
5. Repeat — each cycle improves from observed behavior

---

## Proposed Architecture

### Layer Map

| Layer | Responsibility | Content Example |
|---|---|---|
| **Tier 0** | **The Traffic Cop** — routes user intent to the MCEM Flow or a Role Card | `copilot-instructions.md` (≤100 lines) |
| **Tier 1** | **The Map** — defines Stages 1–5, accountabilities (ATU/STU/CSU), exit criteria, role lens | `mcem-flow.instructions.md`, `role-card-*.md`, `shared-patterns.instructions.md` |
| **Tier 2** | **The Tools** — atomic skill files, individually triggerable, 30–80 lines each | `commit-gate-enforcement`, `pipeline-qualification`, etc. |
| **Tier 3** | **The Library** — deep reference docs for detailed lookups | `MCEM-stage-reference.md`, `crm-entity-schema.md` |

**Detailed structure**:

```
Tier 0  copilot-instructions.md           ≤100 lines  [THE TRAFFIC COP]
        ├── Intent (1 sentence)
        ├── Resolve order (Intent → Role → Stage → Skill → Risk)
        ├── Medium probe table
        ├── Role selection prompt (4 roles → Tier 1 cards)
        ├── Pointer to MCEM flow (Tier 1)
        └── Response expectations

Tier 1  instructions/                                      [THE MAP]
        ├── mcem-flow.instructions.md       ★ NEW — process spine (stage→skill→exit criteria)
        ├── role-card-specialist.md         ★ NEW — role lens (identity + skill weighting)
        ├── role-card-se.md                 ★ NEW — role lens
        ├── role-card-csa.md                ★ NEW — role lens (includes cross-role skill focus)
        ├── role-card-csam.md               ★ NEW — role lens (includes cross-role skill focus)
        ├── shared-patterns.instructions.md ★ NEW — DRY shared boilerplate
        ├── crm-query-strategy.md           ★ NEW — CRM scoping steps (extracted from Tier 0)
        ├── crm-entity-schema.md            (existing, keep as-is)
        ├── msx-role-and-write-gate.md      (existing, keep as-is)
        ├── intent.md                       (existing, trim ~20%)
        ├── obsidian-vault.md               (existing, consider split later)
        └── connect-hooks.md                (existing, keep as-is)

Tier 2  skills/                                            [THE TOOLS]
        ├── (atomic skill files — see catalog below)
        ├── skill-authoring-best-practices/SKILL.md  (existing, keep)
        └── workiq-query-scoping/SKILL.md              (existing, keep)

Tier 3  documents/                                         [THE LIBRARY]
        ├── MCEM-stage-reference.md         ★ NEW — authoritative MCEM stage definitions, exit criteria, role accountability
        └── (other large reference material, no change)
```

### A. MCEM Flow — The Process Spine (`mcem-flow.instructions.md`)

**Purpose**: Model the end-to-end MSX sales motion as a stage-based flow. Each stage declares: who's accountable, what the objectives and core operations are, which exit criteria gate the next stage, and which atomic skills activate.

**Source authority**: Microsoft Customer Engagement Methodology (MCEM) stage definitions, role accountability, and exit criteria. The flow document is the single canonical reference for MCEM stage context in this agent system.

#### MCEM Unit → Agent Role Mapping

The flow uses our four agent roles but maps them to MCEM organizational units:

| MCEM Unit | Agent Roles | Stage Accountability |
| --- | --- | --- |
| ATU (Account Team Unit) | Account Executive (out of scope for skills) | Stage 1 lead, co-orchestrates Stage 2 |
| STU (Specialist Team Unit) | **Specialist**, **Solution Engineer (SE)** | Stages 2–3 accountable |
| CSU (Customer Success Unit) | **CSAM**, **Cloud Solution Architect (CSA)** | Stages 4–5 accountable |
| Partners | Referenced contextually | Varies by segment and motion |

#### Non-Linear Mechanics

The flow document must encode these MCEM realities (not just a linear waterfall):

- **Stages may iterate or overlap** — activities can loop back to earlier stages based on customer readiness, proof gaps, or capacity constraints
- **Seller Journeys alter sequencing** — different motions (partner-led, co-sell, consumption-first) change which roles lead and when
- **Qualified pipeline typically begins at Stage 2** — Stage 1 is pre-pipeline signal consumption
- **Billed opportunities are often won at end of Stage 3** — the commit gate is the critical financial transition
- **Verifiable Outcomes and Exit Criteria are captured in MSX/D365** — the CRM is the system of record for stage progression
- **Partner involvement varies** by segment, motion, and deal structure

The flow must include non-linear navigation guidance (e.g., "If proof gaps emerge in Stage 3, loop back to Stage 2 skills").

#### Structure (~250–300 lines)

```markdown
# MCEM Sales Process Flow

## How to Use This Flow
- Identify the opportunity's current MCEM stage (use `mcem-stage-identification` skill if unclear)
- Load the matching stage section
- Activate only the skills listed for the user's role at that stage
- Stages are NOT strictly linear — follow non-linear guidance when customer readiness requires iteration

## Stage 1: Listen & Consult
Objective: Understand customer needs, desired outcomes, and qualify whether an opportunity exists.
Accountable: ATU | Contributors: Partners, Support/Services
Our roles active: Specialist (signal intake), CSAM (customer outcome input)

Core operations:
- Consume signals, leads, and insights
- Initial customer outreach and discovery
- Stakeholder mapping and problem definition
- Opportunity qualification
- Confirm initial Solution Play alignment

Skills activated:
- `pipeline-qualification` (Specialist) — qualify opportunity from signals
- `customer-outcome-scoping` (CSAM) — define measurable customer outcomes

Exit criteria → Stage 2:
- [ ] Qualified opportunity exists (`opportunity.statecode = 0` + `activestageid` past qualification)
- [ ] Customer needs and outcomes clearly defined
- [ ] Initial Solution Play selected (`opportunity.msp_salesplay ne null`)

## Stage 2: Inspire & Design
Objective: Shape the solution vision and align customer stakeholders on value and approach.
Accountable: STU | Co-orchestrates: ATU | Partners: solution alignment, co-sell
Our roles active: Specialist (lead), SE (technical shaping), CSA (feasibility)

Core operations:
- Orchestrate Microsoft and partner team
- Conduct envisioning workshops
- Capture customer value (Business Value Assessment)
- Define technical and business proof requirements
- Create or update Customer Success Plan
- Secure programs, funding, or investments

Skills activated:
- `proof-plan-orchestration` (SE + Specialist) — design proof requirements
- `architecture-feasibility-check` (CSA) — validate executability
- `pipeline-hygiene-triage` (Specialist) — stage staleness, field completeness
- `partner-motion-awareness` (cross-role) — adjust for co-sell/partner-led

Exit criteria → Stage 3:
- [ ] Solution Plays confirmed (`opportunity.msp_salesplay` has valid value)
- [ ] Business value reviewed and endorsed by customer (BVA `status = Complete`)
- [ ] Customer Success Plan created (`msp_successplan` linked to opportunity)

## Stage 3: Empower & Achieve
Objective: Prove feasibility, finalize the deal, and secure customer commitment.
Accountable: STU | Engaged: Deal Desk, Legal, Finance, Partners
Our roles active: Specialist (lead → handoff), SE (proof delivery), CSA (commit gate), CSAM (CSU readiness)

Core operations:
- Deliver technical/business proof (POC, MVP, Pilot, Demo)
- Finalize architecture and solution design
- Evaluate deal strategy and capacity
- Create and present proposal
- Engage legal, procurement, and negotiation
- Secure customer agreement

Skills activated:
- `commit-gate-enforcement` (CSA + CSAM) — validate delivery readiness before commitment
- `handoff-readiness-validation` (Specialist → CSAM) — ensure clean STU→CSU transition
- `unified-constraint-check` (CSA/CSAM) — Unified dependency, eligibility, dispatch readiness
- `exit-criteria-validation` (cross-role) — verify formal MCEM exit criteria met

Non-linear: If proof gaps emerge, loop back to Stage 2 (`proof-plan-orchestration`, `architecture-feasibility-check`).

Exit criteria → Stage 4:
- [ ] Customer agreement in place (`opportunity.activestageid` post-commitment)
- [ ] Resources aligned to delivery plan (`msp_engagementmilestone.msp_commitmentrecommendation = 861980001`)
- [ ] Outcomes committed and baseline metrics defined (milestones Committed + `msp_milestonedate` set)

## Stage 4: Realize Value
Objective: Deliver the solution and ensure customer outcomes are achieved.
Accountable: CSU | Delivery: Services, Partners
Our roles active: CSAM (lead), CSA (architecture guardrails)

Core operations:
- Deliver solution against agreed outcomes
- Initiate customer training and change management
- Monitor usage and adoption
- Track business value realization
- Update Customer Success Plan

Skills activated:
- `delivery-accountability-mapping` (CSAM) — who owns execution vs orchestration
- `execution-authority-clarification` (CSAM + CSA) — resolve technical vs customer authority
- `milestone-health-review` (CSAM) — status, blockers, date drift
- `execution-monitoring` (CSA) — architecture guardrails during delivery

Non-linear: If delivery uncovers scope gaps, loop back to Stage 3 (`commit-gate-enforcement`) or Stage 2 (`architecture-feasibility-check`).

Exit criteria → Stage 5:
- [ ] Solution delivered successfully (`msp_engagementmilestone.msp_milestonestatus = 861980003`)
- [ ] Customer health metrics agreed (CSP health fields populated)
- [ ] Business value tracking in place (consumption data recording)

## Stage 5: Manage & Optimize
Objective: Sustain value, drive consumption, and identify expansion opportunities.
Accountable: CSU | Re-engaged: ATU, STU (for expansion)
Our roles active: CSAM (lead), Specialist (expansion signals)

Core operations:
- Monitor usage trends and health signals
- Proactive backlog and success plan reviews
- Identify expansion or renewal signals
- Refresh consumption and success plans
- Ensure customer can operate and maintain solution independently

Skills activated:
- `adoption-excellence-review` (CSAM) — usage/adoption health
- `expansion-signal-routing` (CSAM → Specialist) — route expansion back to STU
- `customer-evidence-pack` (CSAM) — value realization evidence for governance

Non-linear: Expansion signals create new Stage 1–2 opportunities — route via `expansion-signal-routing`.

Exit criteria (opportunity completion):
- [ ] Outcomes met and sustained (ACR trending + milestone completion)
- [ ] Next customer needs identified
- [ ] Opportunity completed with next steps defined

## Cross-Stage Capabilities (any stage)
- `mcem-stage-identification` — determine current stage from CRM data + customer outcomes
- `role-orchestration` — recommend which role should lead next actions based on stage
- `non-linear-progression` — guide stage loopback when readiness/proof gaps exist
- `risk-surfacing` — proactive risk detection across mediums
- `workiq-query-scoping` — M365 evidence retrieval
- `vault-context-assembly` — knowledge layer reads
- `partner-motion-awareness` — adjust for partner-led or co-sell motions
- `exit-criteria-validation` — check opportunity progress against MCEM exit criteria
```

**Key design choices**:
- The flow doesn't contain skill logic — it just *names* the skills and maps them to stages/roles
- The agent loads the flow, identifies the relevant stage, then loads only the 1–3 skills needed
- Exit criteria are copyable checklists (per P7) that map to Verifiable Outcomes in MSX/D365
- Non-linear guidance is explicit at each stage, not buried in a separate mechanic

### B. Role Cards (~50 lines each)

Replace 430–520 line role SKILL.md files with lightweight identity cards.

**Content per card**:
- Mission (1–2 sentences)
- MCEM stage accountability (which stages they lead vs. contribute)
- Ownership scope in MSX (what they own/update)
- Hygiene cadence (1–2 bullets)
- Boundary rules (3–5 bullets — the friction scenarios unique to this role)
- **Cross-role skill lens** (3–5 bullets — how this role should weight shared skills like `commit-gate-enforcement`, `unified-constraint-check`) — the role card is where role-specific interpretation lives, not in the skill itself
- Cross-role communication patterns (3–4 bullets)
- Escalation triggers (3–4 bullets)

**Accountability-based lens override**: When the agent identifies the current MCEM stage, and the **user's role is not the accountable unit** for that stage, the agent must:
1. Load the user's own role card (their perspective)
2. **Also reference the accountable unit's role card** to surface stage leadership context
3. Make explicit who leads vs. who contributes at this stage
4. Gate any skills owned by the accountable unit — present them as "owned by [role], recommend engaging them" rather than executing directly

**Example**: A Specialist asks about Stage 4 operations. Stage 4 is CSU-accountable.
- Load `role-card-specialist.md` (user's role) — shows they contribute expansion signals but don't lead delivery
- Reference `role-card-csam.md` (accountable) — shows CSAM leads delivery accountability, milestone health
- Agent says: "Stage 4 is CSU-led. CSAM owns delivery accountability and milestone health. As a Specialist, your Stage 4 contribution is monitoring for expansion signals. For delivery operations, engage the CSAM."

This ensures **the CSU lens is always applied at Stages 4–5** and **the STU lens at Stages 2–3**, regardless of which role is asking.

**What moves OUT of role cards**:
- Shared definitions → `shared-patterns.instructions.md`
- Runtime contract → `shared-patterns.instructions.md`
- Upfront scoping pattern → `shared-patterns.instructions.md`
- WorkIQ companion → `shared-patterns.instructions.md`
- All "Agent Skill" flows → individual atomic skill files

### C. Atomic Skills Catalog

Extract the ~40 procedural "agent skill" flows currently embedded across four role SKILL.md files into individual skill files. Each is 30–80 lines.

**Naming convention**: `kebab-case/SKILL.md` (folder convention), lowercase + hyphens only, gerund or noun form preferred, ≤64 chars (per P5)

**Frontmatter template** (conforming to P1 + P5):
```yaml
---
name: commit-gate-enforcement
description: 'Validates milestone readiness before commitment by checking delivery path, capacity, and target dates. Generates remediation tasks as dry-run payloads. Use when CSAM or CSA is evaluating commit readiness at MCEM Stage 3, or when milestone status is proposed for committed.'
argument-hint: 'Provide opportunityId and milestoneId(s) approaching commitment'
---
```

**Description field rules** (per P1 — this is the primary routing mechanism):
- Third person, action verb opening ("Validates…", "Surfaces…", "Routes…")
- Includes **role names** as trigger terms ("CSAM", "CSA", "Specialist", "SE")
- Includes **MCEM stage numbers** ("Stage 3", "Stage 4–5")
- Includes **specific user phrases** that should trigger the skill ("commit readiness", "handoff validation", "pipeline hygiene")
- ≤1024 chars

**Note on `roles` / `mcem-stage` frontmatter**: VS Code skill routing only uses `name`, `description`, and `argument-hint` for selection. Custom fields are ignored by the router. Encode role and stage information **in the description text** instead. The MCEM flow document provides the authoritative mapping.

**Atomic skill body structure** (per P2, P3, P4, P7):
```markdown
## Purpose
1–2 sentences. What this skill does and why.

## Freedom Level
Medium | Low (for write-intent)

## Trigger
When this skill activates (1–2 bullets).

## Flow
1. Step 1 — tool call with `msx-crm:tool_name`
2. Step 2 — evaluation logic
3. Step 3 — output generation

## Decision Logic
- Condition → action (bullets, not prose)

## Output Schema
- `field_name` — what it contains
- `next_action` — (REQUIRED for stage-bound skills) names the recommended next skill and why
```

### Contextual Skill Chaining

Every **stage-bound skill** must include a `next_action` field in its output schema. This field names the specific skill the agent should suggest next, grounding the suggestion in observed CRM state.

**Purpose**: Tier 1 (`mcem-flow.instructions.md`) defines the overall stage map, but individual skills drive forward momentum by recommending the logical next step. This creates a pull-based chain where each skill's output triggers awareness of the next skill in the flow.

**Rules**:
1. `next_action` names exactly one skill (the most likely next step) — not a menu of options
2. The recommendation is grounded in the skill's output state (e.g., exit criteria met → suggest next-stage skill)
3. Cross-stage skills and process navigation skills are exempt (they don't drive linear progression)
4. The agent presents `next_action` as a suggestion, not an automatic invocation — the user decides

**Example chain**:
```
pipeline-qualification → output.next_action:
  "Based on these qualification signals, Stage 1 exit criteria are met.
   Would you like to initiate proof-plan-orchestration (Stage 2)?"

proof-plan-orchestration → output.next_action:
  "Proof plan is defined and solution plays confirmed.
   Would you like to run pipeline-hygiene-triage before moving to Stage 3?"

commit-gate-enforcement → output.next_action:
  "Commit gate passed. Resources aligned.
   Would you like to run handoff-readiness-validation for the STU→CSU transition?"
```

**Non-linear chains**: When a skill detects gaps, `next_action` can point backward:
```
commit-gate-enforcement → output.next_action:
  "Capacity gap detected — delivery path incomplete.
   Recommend looping back to architecture-feasibility-check (Stage 2)."
```

**Cross-role chains**: When `next_action` names a skill owned by a different role than the current user, the output must flag the role transition:
```
handoff-readiness-validation (Specialist) → output.next_action:
  "STU→CSU handoff validated. The next step is delivery-accountability-mapping,
   which is owned by CSAM. Recommend notifying the CSAM to initiate Stage 4."
```
The agent must NOT auto-invoke a skill that belongs to a different role — it presents the handoff and names the role to engage.

**Line budget**: 30–80 lines per skill. If a skill exceeds 80 lines, split domain detail into a reference file one level deep (per P3).

**Proposed skill inventory**:

Skills are organized by category: Stage-Bound (activated at specific MCEM stages), Cross-Stage (available at any stage), and Process Navigation (MCEM mechanics).

**Stage-Bound Skills** (extracted from current role SKILL.md files):

| Skill | Roles | Stage(s) | ~Lines | Source |
| --- | --- | --- | --- | --- |
| `pipeline-qualification` | specialist | 1–2 | 40 | Specialist |
| `customer-outcome-scoping` | csam | 1 | 40 | CSAM |
| `proof-plan-orchestration` | se, specialist | 2–3 | 50 | SE + Specialist |
| `architecture-feasibility-check` | csa | 2–3 | 40 | CSA |
| `pipeline-hygiene-triage` | specialist | 2–3 | 50 | Specialist |
| `commit-gate-enforcement` | csa, csam | 3 | 60 | CSA + CSAM |
| `handoff-readiness-validation` | specialist | 3 | 50 | Specialist |
| `unified-constraint-check` | csa, csam | 3–4 | 50 | CSA + CSAM |
| `delivery-accountability-mapping` | csam | 4 | 50 | CSAM |
| `execution-authority-clarification` | csam, csa | 4 | 40 | CSAM + CSA |
| `milestone-health-review` | csam | 4–5 | 50 | CSAM |
| `execution-monitoring` | csa | 4 | 50 | CSA |
| `value-realization-pack` | csa | 4–5 | 50 | CSA |
| `architecture-execution-handoff` | csa | 3–4 | 50 | CSA |
| `adoption-excellence-review` | csam | 5 | 50 | CSAM |
| `expansion-signal-routing` | csam, specialist | 5 | 40 | CSAM → Specialist |
| `customer-evidence-pack` | csam | 4–5 | 50 | CSAM |

**Cross-Stage Skills** (available at any stage):

| Skill | Roles | Purpose | ~Lines |
| --- | --- | --- | --- |
| `risk-surfacing` | all | Proactive risk detection across CRM + M365 + vault | 60 |
| `task-hygiene-flow` | se | Daily milestone task maintenance | 40 |
| `vault-context-assembly` | all | Assemble vault knowledge for CRM prefetch | 40 |
| `workiq-query-scoping` | all | Scope M365 evidence retrieval (existing skill, keep) | ~310 |

**Process Navigation Skills** (NEW — from MCEM plug-in concepts):

| Skill | Roles | Purpose | ~Lines |
| --- | --- | --- | --- |
| `mcem-stage-identification` | all | Determine current MCEM stage from Verifiable Outcomes (CRM entity state) rather than the Stage field or activity volume — see §Verifiable Outcomes below | 60 |
| `role-orchestration` | all | Recommend which role (ATU/STU/CSU/Partner) should lead next actions based on MCEM stage ownership | 40 |
| `exit-criteria-validation` | all | Check whether opportunity progress meets formal MCEM exit criteria for current stage | 50 |
| `non-linear-progression` | all | Guide stage loopback when customer readiness, proof gaps, or capacity constraints require iteration | 40 |
| `partner-motion-awareness` | all | Adjust guidance when partner-led or co-sell motions are present | 40 |

### Verifiable Outcomes (VO) Model

**Problem**: Sellers often move the Stage field in MSX/D365 before the work is done — or leave it lagging behind. Relying on the Stage field for stage identification produces false positives ("You're in Stage 3" when exit criteria aren't met) and false negatives ("You're still in Stage 2" when outcomes are already achieved).

**Principle**: The agent determines MCEM stage from **Verifiable Outcomes** — specific CRM entity states that evidence real progress — not from the opportunity Stage field.

**Exit Criteria → CRM Entity Mapping**:

| Stage Gate | Exit Criteria | CRM Evidence (Verifiable Outcome) | Entity / Field |
|---|---|---|---|
| **1 → 2** | Qualified opportunity exists | Opportunity record in pipeline with status = Open **AND** `activestageid` has transitioned past qualification stage (or Partner Center referral created) | `opportunity.statecode = 0` + `opportunity.activestageid` transition |
| **1 → 2** | Initial Solution Play selected | Sales play / solution area populated on opportunity | `opportunity.msp_salesplay ne null` |
| **2 → 3** | Solution Plays confirmed | Sales play field populated with confirmed alignment (not default/blank) | `opportunity.msp_salesplay` has a valid value |
| **2 → 3** | Business value reviewed | BVA (Business Value Assessment) completed and linked | BVA entity `status = Complete` (verify via linked records) |
| **2 → 3** | Customer Success Plan created | CSP record linked to opportunity | `msp_successplan` exists + linked |
| **3 → 4** | Customer agreement in place | Opportunity committed — `activestageid` shows post-commitment stage, or deal is marked won | `opportunity.activestageid` + `opportunity.statecode` |
| **3 → 4** | Resources aligned to delivery plan | Milestones with commitment recommendation = Committed and target dates set | `msp_engagementmilestone.msp_commitmentrecommendation = 861980001` + `msp_milestonedate` populated |
| **3 → 4** | Outcomes committed / baseline defined | At least one milestone Committed with measurable target | `msp_engagementmilestone.msp_commitmentrecommendation = 861980001` |
| **4 → 5** | Solution delivered | Milestone(s) marked Completed | `msp_engagementmilestone.msp_milestonestatus = 861980003` |
| **4 → 5** | Customer health metrics agreed | Success plan health signals populated | CSP entity health fields |
| **4 → 5** | Business value tracking in place | Consumption data being recorded | Consumption metrics in ACR/Usage data |
| **5 (exit)** | Outcomes met and sustained | Consumption/usage targets met over sustained period | ACR trending data + milestone completion rate |

**Key corrections from CRM schema validation** (P8 first cycle):
- ⚠️ `msp_milestonestatus = 861980001` = **At Risk** (NOT Committed). Commitment lives in `msp_commitmentrecommendation = 861980001`.
- ⚠️ The opportunity Solution Play field is `msp_salesplay` (per CRM schema), not `msp_solutionplay`.
- ✅ `opportunity.activestageid` tracks D365 Business Process Flow stage transitions — use as a secondary signal alongside entity-level VOs.
- ✅ Partner Center referral creation can evidence Stage 1 qualification in partner-led motions.

**How `mcem-stage-identification` uses VOs**:
1. Read `opportunity.activestageid` as the declared BPF stage (fast signal)
2. Read Verifiable Outcomes from CRM entities (milestones `msp_commitmentrecommendation`, success plans, BVAs, `msp_salesplay`)
3. Map achieved VOs against exit criteria for each stage gate
4. Determine the *highest stage whose exit criteria are fully evidenced* (VO-based stage)
5. Compare VO-based stage against `activestageid` — flag discrepancy if they diverge
6. Output: `actual_stage` (VO-based), `declared_stage` (BPF field), `gap_analysis` if mismatched, `next_action`

**Agent communication pattern**: Instead of "You are in Stage 2 because the field says so", the agent says: "The CRM shows a completed Business Value Assessment and linked Success Plan, which means Stage 2 exit criteria are met — ready for Stage 3 (Empower & Achieve)."

If `activestageid` and VO-based stage diverge: "The opportunity BPF stage shows Stage 3, but the milestone commitment recommendation is still Uncommitted and no Customer Success Plan exists — Stage 2 exit criteria are NOT met. Recommend completing Stage 2 VOs before advancing."

**In `mcem-flow.instructions.md`**: Each stage's exit criteria must include the specific CRM entity/field that constitutes the Verifiable Outcome (as shown in the mapping table above). This grounds the checklists in queryable data rather than subjective judgment.

**Totals**:
- Stage-bound: 17 skills × ~47 avg = ~800 lines
- Cross-stage: 4 skills × ~113 avg = ~450 lines (includes existing WorkIQ at ~310)
- Process navigation: 5 skills × ~46 avg = ~230 lines
- **Grand total**: ~26 skills, ~1,480 lines (vs. ~2,410 lines in current 6 skill files, -39%)

Note: The 5 process navigation skills are net-new capabilities that don't exist today — they address the MCEM non-linear mechanics that current role skills don't model.

### D. Shared Patterns Instruction (`shared-patterns.instructions.md`)

**Purpose**: Single source of truth for boilerplate currently duplicated 4×.

**Content** (~80–100 lines):
- Shared definitions (Opportunity, Milestone, Uncommitted, Committed)
- Runtime contract (live read tools, dry-run write tools, no approval-execution yet)
- Upfront scoping pattern (VAULT-PREFETCH → `get_my_active_opportunities` → `get_milestones` → targeted drill)
- WorkIQ MCP companion pattern (when to use, source separation rule)
- Common output schema conventions

### E. CRM Query Strategy Instruction (`crm-query-strategy.instructions.md`)

**Purpose**: Extract the Step 0–5 CRM scoping procedure from Tier 0 into a dedicated Tier 1 file.

**Content** (~120 lines):
- VAULT-PREFETCH step
- Clarify intent step
- Composite/batch tools preference
- `crm_query` filtered lookup patterns
- `get_milestones` simple lookup patterns
- Good vs. bad query examples

**Tier 0 replacement**: 1 sentence + pointer: "For CRM read queries, follow `crm-query-strategy.instructions.md`."

---

## Migration Plan

### Phase 1: Foundation (non-breaking)
1. Create `shared-patterns.instructions.md`
2. Create `crm-query-strategy.instructions.md` (extract from Tier 0)
3. Create `mcem-flow.instructions.md` (process spine)
4. Create 4 role card files
5. Slim Tier 0 to ≤100 lines (replace extracted content with pointers)

### Phase 2: Skill Extraction
6. Extract atomic skills from current role SKILL.md files (start with 5–6 highest-value ones)
7. Update `mcem-flow.instructions.md` to reference real skill names
8. Deprecate old role SKILL.md files (keep as reference in `documents/` temporarily)

### Phase 3: Validation
9. Test each MCEM stage scenario to verify correct skill activation
10. Measure context budget: Tier 0 + Tier 1 loaded simultaneously should be ≤ 600 lines
11. Verify no regression in role-specific workflows

### Phase 4: Cleanup
12. Remove deprecated role SKILL.md files from `skills/`
13. Update Skill_Authoring_Best_Practices to reflect new conventions
14. Update copilot-instructions.md Context Loading Architecture section

---

## Context Budget Projection

| Layer | Current | Proposed | Delta |
| --- | --- | --- | --- |
| **Tier 0** (always loaded) | ~400 | ~100 | -75% |
| **Tier 1** (loaded on match) | ~1,660 | ~1,400* | -16% |
| **Tier 2** (loaded on demand) | ~2,410 | ~1,480 | -39% |
| **Typical request load** | ~1,550 + 500 = 2,050 | ~100 + 300 + 50 + 100 = 550 | **-73%** |

*Tier 1 grows slightly (mcem-flow is ~300 lines with full stage detail) but each file is smaller and only the relevant ones load.

**Typical request load**: The key metric. Currently a CSAM milestone health question loads Tier 0 (400) + intent (350) + vault (600) + write-gate (200) + CSAM skill (520) = **2,050 lines**. Under the new model: Tier 0 (100) + mcem-flow (300, but only stage 4 section ~60) + role-card-csam (50) + shared-patterns (100) + milestone-health-review skill (50) = **~550 lines**.

**New capability cost**: The 5 process navigation skills (~220 lines total) are net-new; they add capability that doesn't exist today (stage identification, non-linear progression, partner motion) without increasing typical load since they're demand-loaded.

---

## Open Questions

1. **~~`roles` and `mcem-stage` frontmatter~~** — **RESOLVED**: VS Code routing only uses `name`, `description`, and `argument-hint`. Custom frontmatter fields are ignored. Per Governing Principle P1, encode role names and MCEM stage numbers directly in the `description` text. Drop `roles`/`mcem-stage` as YAML fields; the MCEM flow document is the authoritative mapping.

2. **Skill granularity sweet spot** — Some current "agent skills" are thin (~20 lines). Should we merge closely related ones (e.g., `unified-constraint-check` into `commit-gate-enforcement`) or keep them separate for composability? Per P2, a skill under 30 lines may not justify its own file — merge into nearest related skill unless it has a distinct trigger phrase.

3. **~~Cross-role skills~~** — **RESOLVED**: Skills remain **atomic and role-agnostic**. The skill defines the technical check (what to verify, which CRM entities to query, what constitutes pass/fail). **Role Cards** (Tier 1) provide the "lens" — role-specific instructions that tell the agent how to weight the skill's output for that role. Example:
   - `commit-gate-enforcement` (skill): checks capacity, delivery path, target dates, resource alignment
   - `role-card-csa.md` adds: "When running `commit-gate-enforcement`, focus on architectural feasibility and technical delivery risk"
   - `role-card-csam.md` adds: "When running `commit-gate-enforcement`, focus on customer orchestration, timeline commitments, and success plan alignment"
   - Efficiency gain: one 60-line skill instead of two ~60-line variants (~50% savings per shared skill)

4. **Vault instruction split** — `obsidian-vault.instructions.md` at ~600 lines is the heaviest Tier 1 file. Split now, or defer until after the role skill extraction proves the model?

5. **~~Flow activation mechanism~~** — **RESOLVED**: Yes. The `mcem-stage-identification` skill determines stage from **Verifiable Outcomes** (CRM entity states evidencing real progress) rather than the opportunity Stage field or activity volume. See §Verifiable Outcomes for the full VO→Exit Criteria→CRM Entity mapping. The skill reads milestone status, success plans, BVAs, and solution play linkages — then maps achieved VOs against exit criteria to determine actual stage. Stage field discrepancies are flagged explicitly.

6. **Backward compatibility during migration** — Keep old role SKILL.md files alongside new atomic skills during Phase 2, or remove immediately to avoid confusion from duplicate routing?

---

## Success Criteria

### Structural
- [x] Tier 0 ≤ 100 lines (72 lines)
- [x] No duplicated boilerplate across skill/instruction files
- [x] Typical request context load ≤ 600 lines (Tier 0 + loaded Tier 1 + loaded Tier 2) — Cycle 2: 258, Cycle 3: 240
- [x] Each atomic skill is 30–80 lines and independently triggerable (49–60 lines)
- [x] MCEM flow document maps every skill to stage + role
- [x] Stage identification uses Verifiable Outcomes (CRM entity state), not just the Stage field
- [x] Every stage-bound skill output includes `next_action` recommending the logical next skill
- [x] Cross-role skills are role-agnostic; role cards provide the role-specific lens
- [x] Accountability-based lens override: agent loads accountable unit's role card when user's role differs from stage owner
- [x] Cross-role `next_action` chains name the owning role and recommend engagement (no auto-invoke) — fixed in Cycle 3
- [x] All current role-specific workflows still function (no regression)

### Best Practices Compliance (per Governing Principles)
- [x] **P1**: Every skill `description` is third person, ≤1024 chars, includes role names + MCEM stage + user trigger phrases
- [x] **P2**: No skill body exceeds 500 lines; atomic skills target 30–80 (49–60 actual)
- [x] **P3**: No reference chain deeper than one level from any SKILL.md
- [x] **P4**: Each skill declares its freedom level; write-intent = low freedom with exact confirmation gate (note: pre-existing `workiq-query-scoping/SKILL.md` lacks freedom level — deferred)
- [x] **P5**: All `name` fields are ≤64 chars, lowercase+hyphens, gerund/noun form; MCP tools use `ServerName:tool_name` (note: pre-existing files use underscores — deferred)
- [x] **P6**: Terminology is consistent across all files (Opportunity, Milestone, Committed/Uncommitted, Stage 1–5)
- [x] **P7**: Multi-step workflows have numbered steps; critical workflows have copyable checklists
- [x] **P8**: At least 3 real-task validation cycles before declaring restructure complete (Cycles 1-3 complete)
- [x] Skill_Authoring_Best_Practices updated to reflect new atomic skill conventions + MCEM flow pattern

---

## P8 Validation Cycle Log

### Cycle 1: Stage 3 → Stage 4 Handoff (Specialist → CSU)

**Scenario**: Specialist says: "I need to hand off the Contoso opportunity to CSU — customer agreement was just signed."

**Trace**: Tier 0 → role-card-specialist + mcem-flow → mcem-stage-identification (VOs) → Stage 3 skills → handoff-readiness-validation → next_action chains to delivery-accountability-mapping (CSAM)

**Bugs found and fixed**:

| # | Issue | Severity | Fix Applied |
|---|---|---|---|
| 1 | VO table mapped "Outcomes committed" to `msp_milestonestatus = 861980001` (**At Risk**). Commitment lives in `msp_commitmentrecommendation = 861980001`. | **Critical** | VO table rewritten with correct field: `msp_commitmentrecommendation` |
| 2 | VO table referenced `msp_solutionplay` but CRM schema shows `msp_salesplay`. | **Medium** | Corrected to `msp_salesplay` throughout |
| 3 | No `activestageid` (D365 BPF stage transition) in VO model. | **Medium** | Added as Step 1 in VO algorithm + included in Stage 1 and Stage 3 gate criteria |

**Gaps found and addressed**:

| # | Gap | Resolution |
|---|---|---|
| 4 | No accountability-based lens override — Specialist asking about Stage 4 only gets Specialist lens, not CSU context | Added "Accountability-based lens override" rule to Role Cards section: agent loads both user's role card + accountable unit's role card when they differ |
| 5 | Cross-role `next_action` doesn't handle role transitions — `handoff-readiness-validation` chains to `delivery-accountability-mapping` (CSAM) but Specialist can't run it | Added "Cross-role chains" rule to Skill Chaining: output names the owning role and recommends engagement rather than auto-invoking |
| 6 | MCEM flow exit criteria are abstract checklists with no CRM entity references | Grounded all 5 stage exit criteria in specific CRM fields (e.g., `opportunity.msp_salesplay`, `msp_commitmentrecommendation`, `msp_milestonestatus = 861980003`) |
| 7 | Stage discrepancy communication only covers VO > BPF case | Added reverse case: BPF advanced but VOs not met — agent recommends completing VOs before advancing |

**Assessment**: The proposed architecture handled the multi-role scenario. The routing (Tier 0 → flow → stage ID → skill → chain) worked as designed. Issues were in **data accuracy** (wrong CRM fields) and **missing cross-role mechanics** (lens override, role-aware chaining). All fixed in this cycle.

---

### Cycle 2: CSAM Milestone Health Review (Stage 4)

**Scenario**: CSAM asks: "What's the milestone health for Contoso?"

**Trace**: Tier 0 (72) → role-card-csam (70, matches "milestone health", "CSAM") + shared-patterns (62, loaded on role skill activation) → milestone-health-review (54, matches "milestone health", "CSAM") → delivery-accountability-mapping (next_action for blocked milestones)

**Context budget**: 72 + 70 + 62 + 54 = **258 lines** (budget: ≤600). Even with mcem-flow: 462.

**Bugs found**: None

**Validation checks passed**:

| # | Check | Result |
|---|---|---|
| 1 | CRM field names in health classification | ✓ Correct: `msp_milestonestatus` values 861980000/001/002/003 |
| 2 | CSAM cross-role skill lens applied | ✓ Role card specifies: "Customer impact, recovery plans, outcome clarity" |
| 3 | Shared patterns runtime contract | ✓ Lists all MCP tools used by the skill |
| 4 | next_action chaining | ✓ Chains to `delivery-accountability-mapping` (same-role: CSAM) |
| 5 | Upfront scoping pattern | ✓ Skill follows crm_auth_status → get_my_active_opportunities → get_milestones → get_milestone_activities |

**Assessment**: Clean trace with no bugs. The CSAM milestone health scenario loads 258 lines — a 87% reduction from the prior architecture's ~2,050 lines. The role card correctly provides the CSAM lens over the generic milestone-health-review skill.

---

### Cycle 3: SE Proof Plan for Stage 2 (cross-role chain to CSA)

**Scenario**: SE says: "I need to plan the proof for the Fabrikam Azure Migration opportunity."

**Trace**: Tier 0 (72) → role-card-se (54, matches "SE", "technical proof") + shared-patterns (62) → proof-plan-orchestration (52, matches "proof plan", "SE") → architecture-feasibility-check (next_action, CSA-owned)

**Context budget**: 72 + 54 + 62 + 52 = **240 lines** (budget: ≤600). Even with mcem-flow: 444.

**Bugs found and fixed**:

| # | Issue | Severity | Fix Applied |
|---|---|---|---|
| 1 | Cross-role next_action in `proof-plan-orchestration` says "Would you like to run `architecture-feasibility-check`" — doesn't name CSA as owning role | **Medium** | Fixed to: "CSA should run `architecture-feasibility-check`...would you like to engage your CSA?" |
| 2 | Same pattern in `customer-outcome-scoping` (CSAM→Specialist), `pipeline-hygiene-triage` (Specialist→CSA/CSAM), `commit-gate-enforcement` (CSA/CSAM→Specialist), `task-hygiene-flow` (SE→Specialist) | **Medium** | Fixed all 4 additional cross-role next_action chains to name owning role |

**Validation checks passed**:

| # | Check | Result |
|---|---|---|
| 1 | SE cross-role skill lens applied | ✓ Role card specifies: "Technical proof requirements, success criteria, milestone plan" |
| 2 | Skill flow correctness | ✓ crm_get_record → get_milestones → get_milestone_activities → define plan → dry-run tasks |
| 3 | Proof plan components complete | ✓ Type, success criteria, scope, timeline, roles, exit conditions |
| 4 | Cross-role chain compliance (post-fix) | ✓ All cross-role next_action chains now name the owning role |

**Total cross-role fixes applied across all skills**: 5 skills updated to comply with shared-patterns cross-role chaining rule.

**Assessment**: The SE proof plan scenario loads 240 lines — lightweight and focused. The primary finding was systematic non-compliance in cross-role next_action messaging (5 skills). All fixed. Post-fix, every cross-role chain in the system names the owning role and recommends engagement rather than offering to auto-invoke.
