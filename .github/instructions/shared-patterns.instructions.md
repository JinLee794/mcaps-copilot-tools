---
description: "Shared definitions, runtime contract, upfront scoping pattern, WorkIQ companion, and output conventions used across all MSX/MCEM role workflows. Loaded when any role skill or MCEM flow skill activates. Prevents duplication across Specialist, SE, CSA, CSAM skills."
---

# Shared Patterns for MSX/MCEM Operations

## Shared Definitions

| Term | Definition |
|---|---|
| **Opportunity** | Customer engagement container aligned to MCEM stages |
| **Milestone** | Execution unit (`msp_engagementmilestones`) for commitment, delivery, and usage/consumption outcomes |
| **Uncommitted** | Still shaping; not fully resourced for delivery (`msp_commitmentrecommendation ≠ 861980001`) |
| **Committed** | Customer agreement + internal readiness for execution (`msp_commitmentrecommendation = 861980001`) |
| **Stage 1–5** | MCEM stages: Listen & Consult → Inspire & Design → Empower & Achieve → Realize Value → Manage & Optimize |

## MCEM Unit → Agent Role Mapping

| MCEM Unit | Agent Roles | Stage Accountability |
|---|---|---|
| ATU (Account Team Unit) | Account Executive (out of scope for skills) | Stage 1 lead, co-orchestrates Stage 2 |
| STU (Specialist Team Unit) | **Specialist**, **Solution Engineer (SE)** | Stages 2–3 accountable |
| CSU (Customer Success Unit) | **CSAM**, **Cloud Solution Architect (CSA)** | Stages 4–5 accountable |
| Partners | Referenced contextually | Varies by segment and motion |

## Runtime Contract

- **Read tools are live**: `msx-crm:crm_auth_status`, `msx-crm:crm_whoami`, `msx-crm:get_my_active_opportunities`, `msx-crm:list_accounts_by_tpid`, `msx-crm:list_opportunities`, `msx-crm:get_milestones`, `msx-crm:get_milestone_activities`, `msx-crm:crm_get_record`, `msx-crm:crm_query`, `msx-crm:get_task_status_options`.
- **Write-intent tools are dry-run**: `msx-crm:create_task`, `msx-crm:update_task`, `msx-crm:close_task`, `msx-crm:update_milestone` return `mock: true` preview payloads.
- **No approval-execution tools exposed yet**: treat write outputs as recommended operations pending future staged execution.
- Follow `msx-role-and-write-gate.instructions.md` for mandatory human confirmation before any write-intent operation.

## Upfront Scoping Pattern

Collect scope in minimal calls before per-milestone workflows:

0. **VAULT-PREFETCH** — call `oil:get_customer_context({ customer })` for opportunity GUIDs and context. Skip if OIL unavailable. See `obsidian-vault.instructions.md`.
1. `msx-crm:get_my_active_opportunities()` — returns all active opportunities (use `customerKeyword` to narrow).
2. `msx-crm:get_milestones({ opportunityId })` — scoped to one opportunity.
3. `msx-crm:get_milestone_activities(milestoneId)` — only for specific milestones needing investigation.
4. `msx-crm:crm_query` — for filtered/multi-opportunity lookups. See `crm-query-strategy.instructions.md`.

## WorkIQ MCP Companion

Use `ask_work_iq` when evidence lives in M365 rather than CRM:
- **Sources**: Teams chats/channels, meeting transcripts/notes, Outlook mail/calendar, SharePoint/OneDrive docs.
- **Source separation**: CRM = system-of-record status; WorkIQ = communication and delivery evidence.
- **Scoping**: Always include explicit date range, customer/people, and source types. See `workiq-query-scoping/SKILL.md` for full playbook.

## VAULT-PROMOTE (Post-Workflow)

After completing a CRM workflow, persist validated findings to the vault:
- Use `oil:promote_findings()` or `oil:patch_note()` with `heading: "Agent Insights"`.
- If new opportunity GUIDs were discovered, use `oil:update_customer_file()` to add them.
- Skipped automatically if OIL is unavailable.

## Common Output Conventions

- Dry-run write payloads include `mock: true` and the tool name that would execute.
- Every stage-bound skill output includes `next_action` naming the recommended next skill.
- Cross-role `next_action` must name the owning role and recommend engagement (no auto-invoke).
- Risk findings always include: one-sentence risk, evidence source, role to act, minimum intervention.
