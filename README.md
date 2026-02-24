# MCAPS Copilot Tools

MCAPS Copilot Tools is an MCP-first repository for role-aware sales execution in MCAPS. It combines:

- role workflows codified as reusable Copilot skills
- MSX CRM MCP tools for opportunity/milestone/task operations
- WorkIQ MCP tools for Microsoft 365 evidence retrieval
- customization patterns for day-to-day agentic operations

This repo started as an MSX Helper MCP server and has expanded into a broader operational toolkit.

## Project Layout

- `mcp-server/` — Node.js MCP server implementation for MSX CRM tools
- `.github/skills/` — MCAPS role skills and WorkIQ query-scoping skill
- `.github/instructions/` — role/write-gate operational instructions
- `docs/` — architecture and supporting documentation

## Boilerplate Included

This repository is a practical MCAPS Copilot boilerplate for role-driven, MCP-first operations.

It includes:

- role skill definitions for core MCAPS personas:
	- [Solution Engineer](.github/skills/Solution_Engineer_SKILL.md)
	- [Cloud Solution Architect](.github/skills/Cloud_Solution_Architect_SKILL.md)
	- [Customer Success Account Manager](.github/skills/CSAM_SKILL.md)
	- [Specialist](.github/skills/Specialist_SKILL.md)
- MSX role and write confirmation gate instructions to guide safe write-intent workflows:
	- [msx-role-and-write-gate.instructions.md](.github/instructions/msx-role-and-write-gate.instructions.md)

Use this as the default scaffold when you want consistent role routing, approval-gated updates, and repeatable day-to-day sales operations.

## What This Repo Provides

### MSX CRM MCP tools

The server currently includes tools to:

- validate CRM authentication and identity (`crm_whoami`)
- run read-only OData queries (`crm_query`, `crm_get_record`)
- list opportunities and milestones (`list_opportunities`, `get_milestones`)
- return render-ready views for timeline/cost/diff experiences (`view_milestone_timeline`, `view_opportunity_cost_trend`, `view_staged_changes_diff`)
- perform write-oriented task/milestone operations (`create_task`, `update_task`, `close_task`, `update_milestone`)

### Role skills for MCAPS workflows

The following role definitions are maintained as skills:

- `Solution Engineer` → [.github/skills/Solution_Engineer_SKILL.md](.github/skills/Solution_Engineer_SKILL.md)
- `Cloud Solution Architect` → [.github/skills/Cloud_Solution_Architect_SKILL.md](.github/skills/Cloud_Solution_Architect_SKILL.md)
- `Customer Success Account Manager` → [.github/skills/CSAM_SKILL.md](.github/skills/CSAM_SKILL.md)
- `Specialist` → [.github/skills/Specialist_SKILL.md](.github/skills/Specialist_SKILL.md)

These skills define boundaries, workflow expectations, and handoff behavior for agentic operations.

### WorkIQ + CRM automation model

The repo is designed to automate day-to-day sales workflows by combining systems of record:

- MSX CRM MCP for structured sales data and state changes
- WorkIQ MCP for M365 evidence (meetings, chats, email, files)
- role-gated planning and confirmation before write-intent actions

## Quick Start

From the repo root:

```bash
cd mcp-server
npm install
npm test
npm start
```

## Agentic Frontend (Electron MVP)

A local Electron-first frontend now exists under `frontend/` with:

- Electron runtime (main + preload + renderer)
- local orchestration API with AG-UI-compatible SSE at `POST /api/copilot/run`
- role-skill binding to `.github/skills/*.md` with write-intent approval guard
- runtime MCP manager backed by `.vscode/mcp.json` + `.vscode/mcp.runtime.overlay.json`
- WorkIQ Context Explorer and tool-trace/context-stack views in renderer

Run locally:

```bash
cd frontend
npm install
npm run dev
```

This launches the Electron app and starts orchestration APIs on `http://127.0.0.1:3100`.

### Runtime Notes

- The orchestration API emits normalized AG-UI lifecycle/tool/state/activity events.
- `copilotkit` is treated as expected MCP baseline and surfaced in diagnostics if unavailable.
- Run requests support `provider: "copilot-sdk" | "copilot-cli"`.
- `copilot-sdk` is the primary provider. If GitHub Packages auth is unavailable, set:
	- `COPILOT_SDK_ADAPTER_MODULE=./src/main/copilot-sdk-adapter.local.js`
	- this uses a local bridge that executes `copilot chat --message ...`.

## Configuration

Authentication is performed through Azure CLI. Make sure you are signed in first:

```bash
az login
```

## MCP Integration

This server runs on stdio transport and can be wired into MCP-compatible clients/editors by pointing to the Node entrypoint in `mcp-server/src/index.js` (or the `msx-mcp` binary after package install).

For WorkIQ-heavy workflows, Copilot CLI is an ideal integration point to orchestrate role skills + `msx-crm` + `ask_work_iq` in a single agentic loop.

### Startup Flow (Recommended)

1. Open and review the MCP server config: [.vscode/mcp.json](.vscode/mcp.json).
2. In your MCP-capable client/editor, **start** the configured MCP servers from that file.
3. Run your workflow using either:
	- the GitHub Copilot session window in VS Code, or
	- GitHub Copilot CLI (`copilot`) from the repo root.
4. Verify tool routing by using `msx-crm` for CRM facts and `ask_work_iq` for M365 evidence.

## Recommended Copilot Workflow (MCP-first)

- Use the configured workspace MCP server (`.vscode/mcp.json`, server name `msx-crm`) for CRM operations.
- Use the configured WorkIQ MCP server for Microsoft 365 retrieval (`ask_work_iq`) when evidence is in Teams chats/channels, meetings/transcripts, Outlook email/calendar, or SharePoint/OneDrive files.
- Invoke MSX CRM operations through MCP tools, not ad-hoc local scripts.
- Route by system of record:
	- MSX CRM facts (opportunities, milestones, tasks, ownership, status) → `msx-crm` tools.
	- M365 collaboration evidence (conversations, meetings, docs, mail) → WorkIQ MCP.
- Avoid creating one-off files under `mcp-server/.tmp` for standard read/update flows unless explicitly troubleshooting.
- For write-intent changes, use role mapping and explicit confirmation gates before execution.

## Customization Capabilities

The repository is built for high customization in agent behavior:

- role skills can be updated as operating models evolve
- instruction files can enforce workflow gates and safety requirements
- MCP tool composition supports tailored, repeatable sales operations

## WorkIQ Scope Intake Template

For broad WorkIQ requests, use the dedicated skill playbook:

- [.github/skills/WorkIQ_Query_Scoping_SKILL.md](.github/skills/WorkIQ_Query_Scoping_SKILL.md)

This skill defines the fact-map intake contract, clarification rules, safe defaults, and two-pass retrieval strategy to keep query scope focused.

Typical WorkIQ retrieval examples:
- Teams: chat/thread decisions, channel updates, action ownership.
- Meetings: transcript evidence, decisions, blockers, next steps.
- Outlook: stakeholder communication trail, commitments, follow-ups.
- SharePoint/OneDrive: latest proposal/design docs and revision context.

Reference:
- WorkIQ overview: https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/workiq-overview

## Inspiration and Thanks

Big thanks to the original MSX Helper project for the foundation and inspiration that helped shape this into an MCP server:

## License

MIT (see `mcp-server/package.json`)
