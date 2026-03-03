# msx-copilot-mcp

MCP server for Dynamics 365 / MSX CRM operations. Gives GitHub Copilot (and any MCP-compatible AI agent) read/write access to opportunities, milestones, tasks, and account data — with a **human-in-the-loop approval queue** for all write operations.

## Features

- **Read tools** — query opportunities, milestones, tasks, accounts, and metadata via OData
- **Write tools** — create/update/close tasks, update milestones — all staged for approval before execution
- **Approval queue** — every CRM write is staged, previewed (before → after diff), and executed only after explicit human confirmation
- **Batch operations** — stage multiple changes, review all at once, execute in one shot
- **Azure CLI auth** — authenticates via `az account get-access-token` (no secrets in config)
- **Composite tools** — higher-level operations like `find_milestones_needing_tasks` chain multiple CRM calls automatically

## Prerequisites

- **Node.js** ≥ 18
- **Azure CLI** — [install](https://learn.microsoft.com/cli/azure/install-azure-cli), then sign in:
  ```bash
  az login
  ```
- **CRM access** — your Azure AD account must have Dynamics 365 API permissions for the target org

## Quick Start

```bash
# Clone
git clone https://github.com/Microsoft/msx-copilot-mcp.git
cd msx-copilot-mcp/mcp-server

# Install dependencies
npm install

# Run the server (stdio transport)
npm start
```

## VS Code / Copilot Configuration

Add the server to `.vscode/mcp.json` in your workspace:

```jsonc
{
  "servers": {
    "msx-crm": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/msx-copilot-mcp/mcp-server/src/index.js"],
      "env": {
        "MSX_CRM_URL": "https://microsoftsales.crm.dynamics.com",
        "MSX_TENANT_ID": "72f988bf-86f1-41af-91ab-2d7cd011db47"
      }
    }
  }
}
```

> **Tip**: Replace the `args` path with the actual path on your machine. If you cloned to `~/Repos/msx-copilot-mcp`, use `["${userHome}/Repos/msx-copilot-mcp/mcp-server/src/index.js"]`.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `MSX_CRM_URL` | `https://microsoftsales.crm.dynamics.com` | Dynamics 365 org URL |
| `MSX_TENANT_ID` | `72f988bf-86f1-41af-91ab-2d7cd011db47` | Azure AD tenant ID |

## Tools Reference

### Read Tools

| Tool | Description |
|---|---|
| `crm_whoami` | Validate CRM access and return current user identity |
| `crm_auth_status` | Check authentication status — user, expiry, CRM URL |
| `crm_query` | Execute read-only OData GET against any Dynamics 365 entity set (supports `$filter`, `$select`, `$orderby`, `$top`, `$expand`, auto-pagination) |
| `crm_get_record` | Retrieve a single record by entity set + GUID |
| `list_opportunities` | List open opportunities by account IDs or customer name keyword |
| `get_my_active_opportunities` | Active opportunities where you're the owner or have milestone ownership |
| `get_milestones` | Milestones by ID, number, opportunity, owner, or "mine" — with status/keyword/task-presence filtering |
| `get_milestone_activities` | Tasks/activities linked to one or more milestones |
| `find_milestones_needing_tasks` | Composite: customer keywords → accounts → opps → milestones → identifies those without tasks |
| `list_accounts_by_tpid` | Find accounts by MS Top Parent ID |
| `get_task_status_options` | Retrieve valid task status/statuscode options from metadata |

### Visualization Tools

| Tool | Description |
|---|---|
| `view_milestone_timeline` | Timeline-friendly milestone events with render hints |
| `view_opportunity_cost_trend` | Monthly cost/consumption trend with chart render hints |
| `view_staged_changes_diff` | Before/after diff table from staged write payloads |

### Write Tools (Staged)

All write tools **stage** the operation and return a preview. Nothing is written to CRM until approved.

| Tool | Description |
|---|---|
| `create_task` | Create a task linked to a milestone |
| `update_task` | Update task fields (subject, due date, description, status) |
| `close_task` | Close a task via CloseTask action |
| `update_milestone` | Update milestone fields (date, monthly use, comments) |

### Approval Queue Tools

| Tool | Description |
|---|---|
| `list_pending_operations` | Show all staged changes awaiting approval |
| `execute_operation` | Execute a single staged operation by ID |
| `execute_all` | Execute all pending operations in sequence |
| `cancel_operation` | Discard a staged operation by ID |
| `cancel_all` | Discard all pending operations |

## Testing the Server

### Verify Authentication

Start with the simplest operation — confirm CRM connectivity:

```
You: "Check my CRM connection"
→ Copilot calls crm_whoami / crm_auth_status
→ Returns your UserId, BusinessUnitId, OrganizationId
```

If this fails, verify:
1. `az login` is current (`az account show`)
2. Your account has Dynamics 365 access
3. The `MSX_CRM_URL` and `MSX_TENANT_ID` are correct

### Basic Read Flow

```
You: "What opportunities do I own?"
→ Copilot calls get_my_active_opportunities
→ Returns your owned + deal-team opportunities

You: "Show milestones for opportunity <name or keyword>"
→ Copilot resolves the opportunity, calls get_milestones(opportunityId: ...)
→ Returns milestones with status, dates, workload

You: "Which of my milestones are missing tasks?"
→ Copilot calls find_milestones_needing_tasks with your customer keywords
→ Returns milestones that have no linked tasks
```

### Write Flow (Stage → Review → Execute)

```
You: "Update milestone 7-503362186 date to 2026-04-15"
→ Copilot calls update_milestone → stages the change, returns preview:
  "Staged OP-1: msp_milestonedate 2026-03-20 → 2026-04-15"

You: "Looks good, execute it"
→ Copilot calls execute_operation(id: "OP-1")
→ PATCH sent to CRM → "Done! Milestone date updated."
```

### Batch Write Flow

```
You: "Push all my Q1 milestones to April 15"
→ Copilot stages multiple operations (OP-1, OP-2, OP-3...)
→ Shows summary of all staged changes

You: "Execute all"
→ Copilot calls execute_all → executes sequentially
→ "All 3 milestones updated."
```

### Cancel Flow

```
You: "Actually, cancel that"
→ Copilot calls cancel_operation(id: "OP-1") or cancel_all
→ "Cancelled. No changes made."
```

## Sample Copilot Prompts

These prompts exercise the full tool surface — good for end-to-end testing:

### Identity & Auth
```
Who am I in CRM?
Check my CRM authentication status.
```

### Discovery & Exploration
```
List my active opportunities.
Show opportunities for customer "Contoso".
Find accounts by TPID 12345.
What are the valid task status codes?
```

### Milestone Workflows
```
Show all milestones for opportunity <GUID>.
Show my active milestones with keyword "Azure".
Which milestones for "Contoso" are missing tasks?
Show me a timeline of my milestones this quarter.
```

### Task Workflows
```
Create a task "Architecture Design Session" on milestone <GUID>.
Update task <GUID> due date to 2026-04-30.
Close task <GUID> as completed.
```

### Approval Queue
```
Show pending operations.
Execute OP-1.
Execute all pending operations.
Cancel OP-2.
Cancel all pending operations.
```

### Visualization
```
Show cost trend for opportunity <GUID>.
Show a diff of the staged changes.
```

## Copilot Instructions (Optional)

For the best experience, add a `copilot-instructions.md` to your repo's `.github/` directory. This teaches Copilot how to use the MCP tools effectively:

```markdown
# Copilot Instructions for MSX CRM MCP

## Default Behavior
- Prefer MCP tools over local scripts — use `msx-crm` from `.vscode/mcp.json` for all CRM operations.
- If an MCP tool fails, retry with corrected parameters first.
- Derive missing identifiers via MCP read tools (e.g., `crm_whoami`) — do not create ad-hoc scripts.

## CRM Query Discipline
- Never guess property names — verify via `crm_query` or `get_task_status_options`.
- Use `crm_query` with `$filter`, `$select`, `$top` for targeted lookups.
- Prefer `get_milestones` with a specific `opportunityId` over unfiltered `mine: true` for large datasets.

## Write Safety
- All write operations (create_task, update_task, close_task, update_milestone) are staged first.
- Always show the user the staged preview before executing.
- Use `execute_operation` for single approvals, `execute_all` for batch.
- Never auto-execute staged operations without user confirmation.

## Response Style
- Keep outputs concise and action-oriented.
- When showing milestones or opportunities, format as readable tables.
- For writes, always show the before → after diff.
```

## Architecture

```
┌─────────────────────────────────────────────────┐
│  AI Agent (GitHub Copilot / any MCP client)     │
│                                                 │
│  "Update milestone 7-503362186 to April 15"     │
└────────────────┬────────────────────────────────┘
                 │ stdio (JSON-RPC)
┌────────────────▼────────────────────────────────┐
│  MCP Server  (index.js)                         │
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ tools.js │ │ crm.js   │ │ approval-queue.js│ │
│  │          │ │          │ │                  │ │
│  │ 22 tools │→│ OData    │ │ Stage → Review   │ │
│  │ (read +  │ │ + retry  │ │ → Execute/Cancel │ │
│  │  write)  │ │ + paging │ │ (EventEmitter)   │ │
│  └──────────┘ └────┬─────┘ └──────────────────┘ │
│                    │                            │
│  ┌──────────┐ ┌────▼─────┐                      │
│  │validation│ │ auth.js  │                      │
│  │  .js     │ │ Azure CLI│                      │
│  └──────────┘ └──────────┘                      │
└────────────────┬────────────────────────────────┘
                 │ HTTPS (OData v9.2)
┌────────────────▼────────────────────────────────┐
│  Dynamics 365 / MSX CRM                         │
│  microsoftsales.crm.dynamics.com                │
└─────────────────────────────────────────────────┘
```

### Module Overview

| File | Purpose |
|---|---|
| `src/index.js` | Entry point — creates McpServer, wires auth → CRM client → tools, connects stdio transport |
| `src/tools.js` | All 22 MCP tool definitions with input validation, OData query construction, and approval queue integration |
| `src/crm.js` | HTTP client for Dynamics 365 OData API — retry logic, pagination, token management |
| `src/auth.js` | Azure CLI token acquisition (`az account get-access-token`) with caching and expiry detection |
| `src/validation.js` | GUID normalization, TPID validation, OData string sanitization |
| `src/approval-queue.js` | EventEmitter-based queue for staged write operations with TTL expiry (10 min default) |

## Running Tests

```bash
cd mcp-server
npm test            # single run
npm run test:watch  # watch mode
```

## License

MIT
