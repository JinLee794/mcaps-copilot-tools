---
description: "Use for MSX/MCEM CRM operations, milestone/task updates, role-based workflow routing, and any create/update/close action via MCP tools. Enforces role mapping from CRM user profile and human-in-the-loop confirmation before write operations."
applyTo: "mcp-server/**"
---
# MSX Role Mapping + Write Confirmation Gate

## Scope
- Applies when working with MSX/MCEM CRM workflows, especially when using:
  - `crm_auth_status`, `crm_whoami`, `crm_get_record`, `crm_query`, `get_milestones`, `get_milestone_activities`
  - `create_task`, `update_task`, `close_task`, `update_milestone`

## 0) CRM Read Scoping (Required before bulk reads)
Before calling any CRM read tool that may return large result sets (especially `get_milestones` with `mine: true`):
1. **Confirm the user's role** (see §1 below).
2. **Ask at least one scoping question**: which opportunity/customer, which status, what time range, or what specific data is needed.
3. **Prefer `crm_query`** with `$filter`, `$select`, `$top` for targeted lookups over bulk `get_milestones(mine: true)`.
4. **Use `get_milestones` with a specific `opportunityId` or `milestoneId`/`milestoneNumber`** when you have the identifier.
5. Only use `get_milestones(mine: true)` (unfiltered) if the user explicitly requests all milestones and you have warned about volume.

## 1) Role Resolution (Required before workflow guidance)
1. Identify current user via `crm_auth_status` (or `crm_whoami`).
2. Fetch profile data using `crm_get_record` for `systemusers(<userId>)` with available identity fields (for example: name/title/email/business unit).
3. Map the user to one of these role workflows:
   - `Solution Engineer` → `.github/skills/solution-engineer/SKILL.md`
   - `Cloud Solution Architect` → `.github/skills/cloud-solution-architect/SKILL.md`
   - `Customer Success Account Manager` → `.github/skills/csam/SKILL.md`
   - `Specialist` → `.github/skills/specialist/SKILL.md`
4. If mapping is ambiguous or multiple roles match:
   - Present top 1–2 likely role mappings with reasons.
   - Ask the user to confirm role before proceeding.
5. If mapping is unknown:
   - Do not invent a role.
   - Ask the user which role workflow to apply.

## 2) Role-Bound Execution Rules
- Use the selected role skill as the primary workflow contract for:
  - boundary decisions,
  - stage/ownership checks,
  - handoff format,
  - escalation triggers.
- If a requested action conflicts with the selected role boundary, call out the conflict and propose the correct owner/route.

## 3) Mandatory Plan Mode for Write-Intent Actions
Before calling any write-intent tool (`create_task`, `update_task`, `close_task`, `update_milestone`), always run a confirmation step.

### Required confirmation packet (must be shown to user)
- Role being applied (SE/CSA/CSAM/Specialist)
- Customer/account name
- Opportunity name + ID
- Milestone/task name + ID
- Current values relevant to the change
- Proposed new values
- Why the change is needed (business intent)
- Expected impact and any risk

### Confirmation language
Ask for explicit approval in a separate step, for example:
- "Please confirm this update is correct. Reply: `approve` to proceed or `revise` to change details."

Rules:
- Do not perform write-intent calls in the same response that first proposes changes.
- If any identity field (customer/opportunity/milestone/task) is missing, stop and ask for it.
- For multi-record changes, list each record and require clear approval for the full set.

## 4) CRM Token Recovery (All Agents)

If any CRM tool call returns **401**, **auth expired**, or **"Not logged in"** during a read or write workflow:

1. **Stop** the current operation. Staged writes survive in the approval queue — nothing is lost.
2. **Run** `az login --tenant 72f988bf-86f1-41af-91ab-2d7cd011db47` in the integrated terminal yourself (use `execute/runInTerminal` or `run_in_terminal`). Do NOT instruct the user to run it — run it directly.
3. **Notify the user**: "Please complete the browser authentication (AAD/MFA) that just opened, then tell me when done." **Pause and wait** for user confirmation.
4. After user confirms, **run** `az account get-access-token --resource https://microsoftsales.crm.dynamics.com` in the terminal to verify the token.
5. **Notify the user**: "Token refreshed. Please restart the `msx-crm` MCP server in VS Code (click the restart button in the MCP server list), then tell me when done."
6. **Retry** the failed operation after user confirms the MCP server is restarted.

Do NOT loop retries against an expired token.

## 5) Safety and Auditability
- Re-state identifiers before executing write-intent operations.
- Prefer smallest possible change set.
- After each write-intent operation, return a concise result summary and any follow-up verification read.
- If write tools are currently dry-run/mock, still require the same confirmation flow.

## 6) Output Style for MSX Operations
When producing action recommendations or preflight checks, use this order:
1. Role selected + confidence
2. Workflow checks (pass/fail)
3. Proposed action plan
4. Confirmation packet
5. Await approval
