# Copilot Instructions for MSX Helper MCP

Use this repository as an MCP-first workflow.

## Default Behavior

- Prefer invoking MCP tools over creating/running local one-off scripts.
- Do not generate or execute ad-hoc CRM query scripts under `mcp-server/.tmp` for normal workflows.
- Use the configured MCP server `msx-crm` from `.vscode/mcp.json` for read and write-intent operations.
- If an MCP read tool fails (for example `get_milestones`), do not auto-fallback to shell/Node scripts. First retry with corrected MCP parameters and only use local diagnostics when the user explicitly asks.
- When an MCP tool requires identifiers, ask for or derive missing parameters via other MCP read tools (for example `crm_whoami`) instead of creating script files.

## MSX/CRM Operations

- Capture the user's MSX role up front for every MSX/CRM workflow (before guidance, reads that drive workflow decisions, or any write-intent planning).
- If role is not already confirmed, present these role workflow options and ask the user to select one:
	- `Solution Engineer` → `.github/skills/Solution_Engineer_SKILL.md`
	- `Cloud Solution Architect` → `.github/skills/Cloud_Solution_Architect_SKILL.md`
	- `Customer Success Account Manager` → `.github/skills/CSAM_SKILL.md`
	- `Specialist` → `.github/skills/Specialist_SKILL.md`
- If you can infer role from `crm_auth_status`/`crm_whoami` + `crm_get_record`, present the top likely role(s) and ask the user to confirm before proceeding.
- If role mapping is ambiguous or unknown, do not assume; require explicit user role selection first.
- For read flows, use MCP tools such as `crm_auth_status`, `crm_whoami`, `crm_query`, `crm_get_record`, `get_milestones`, and `get_milestone_activities`.
- For write-intent flows, follow role mapping + confirmation gate from `.github/instructions/msx-role-and-write-gate.instructions.md` before any create/update/close operation.
- Treat local Node scripts as last-resort diagnostics only when MCP tooling is unavailable or explicitly requested by the user.

## WorkIQ Query Scoping

- For broad WorkIQ asks (emails/meetings/chats/files/transcripts), always narrow scope before retrieval.
- Use `.github/skills/WorkIQ_Query_Scoping_SKILL.md` as the canonical execution playbook for fact mapping, clarifying questions, defaults, two-pass retrieval, and sensitivity boundaries.
- If role mapping and WorkIQ scoping both apply, resolve role first, then apply WorkIQ scoping before retrieval.

## Local Agent Memory Retrieval

- Use local structured memory at `.agent-memory/` for context recall when relevant to the user request.
- Retrieve in this order: `session` → `working` → `durable`.
- Apply hard filters before ranking when available (`scope`, `kind`, `tags`, `entities`).
- Prefer lexical retrieval first; only use semantic fallback if lexical results are weak.
- Keep retrieval context token-efficient by using limit + token budget packing.
- Promote only validated/stable `fact` or `decision` memories to `durable`; avoid promoting tentative notes.
- Do not store secrets, tokens, or credentials in agent memory.
- Use local scripts from `mcp-server` for memory operations:
	- `npm run memory:add -- --scope working --kind fact --summary "..." --content "..."`
	- `npm run memory:find -- --query "..." --scope working --limit 8 --tokenBudget 1200`
	- `npm run memory:promote -- --id <memoryId> --fromScope session`
	- `npm run memory:weekly` (weekly dry-run compaction report)
	- `npm run memory:weekly:apply` (weekly apply-mode compaction)

## Response Expectations

- Keep outputs concise and action-oriented.
- When asked to "use MCP server", do not pivot to direct shell-based CRM calls.