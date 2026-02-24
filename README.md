# MSX Helper MCP

MSX Helper MCP is a lightweight Model Context Protocol (MCP) server that exposes read and write-oriented Microsoft Dynamics 365 (MSX CRM) operations as MCP tools over stdio.

## Project Layout

- `mcp-server/` — Node.js MCP server implementation

## What This Server Provides

The server currently includes tools to:

- validate CRM authentication and identity (`crm_whoami`)
- run read-only OData queries (`crm_query`, `crm_get_record`)
- list opportunities and milestones (`list_opportunities`, `get_milestones`)
- return render-ready views for timeline/cost/diff experiences (`view_milestone_timeline`, `view_opportunity_cost_trend`, `view_staged_changes_diff`)
- stage write-oriented task/milestone operations (`create_task`, `update_task`, `close_task`, `update_milestone`)

> Note: write tools are currently configured as dry-run responses in code while testing is in progress.

## Quick Start

From the repo root:

```bash
cd mcp-server
npm install
npm test
npm start
```

## Configuration

The server reads configuration from environment variables:

- `MSX_CRM_URL` (default: `https://microsoftsales.crm.dynamics.com`)
- `MSX_TENANT_ID` (default: `72f988bf-86f1-41af-91ab-2d7cd011db47`)

Authentication is performed through Azure CLI. Make sure you are signed in first:

```bash
az login
```

## MCP Integration

This server runs on stdio transport and can be wired into MCP-compatible clients/editors by pointing to the Node entrypoint in `mcp-server/src/index.js` (or the `msx-mcp` binary after package install).

## Recommended Copilot Workflow (MCP-first)

- Use the configured workspace MCP server (`.vscode/mcp.json`, server name `msx-crm`) for CRM operations.
- Use the configured WorkIQ MCP server for Microsoft 365 retrieval (`ask_work_iq`) when evidence is in Teams chats/channels, meetings/transcripts, Outlook email/calendar, or SharePoint/OneDrive files.
- Invoke MSX CRM operations through MCP tools, not ad-hoc local scripts.
- Route by system of record:
	- MSX CRM facts (opportunities, milestones, tasks, ownership, status) → `msx-crm` tools.
	- M365 collaboration evidence (conversations, meetings, docs, mail) → WorkIQ MCP.
- Avoid creating one-off files under `mcp-server/.tmp` for standard read/update flows unless explicitly troubleshooting.
- For write-intent changes, use role mapping and explicit confirmation gates before execution.

## WorkIQ Scope Intake Template

For broad WorkIQ requests, use the dedicated skill playbook:

- `.github/skills/WorkIQ_Query_Scoping_SKILL.md`

This skill defines the fact-map intake contract, clarification rules, safe defaults, and two-pass retrieval strategy to keep query scope focused.

Typical WorkIQ retrieval examples:
- Teams: chat/thread decisions, channel updates, action ownership.
- Meetings: transcript evidence, decisions, blockers, next steps.
- Outlook: stakeholder communication trail, commitments, follow-ups.
- SharePoint/OneDrive: latest proposal/design docs and revision context.

## Inspiration and Thanks

Big thanks to the original MSX Helper project for the foundation and inspiration that helped shape this into an MCP server:

- Source repo releases: [https://github.com/mitulashah/msx-helper/releases/latest](https://github.com/mitulashah/msx-helper/releases/latest)

## License

MIT (see `mcp-server/package.json`)
