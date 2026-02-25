# MCAPS Copilot Tools

> **Your AI-powered sales operations toolkit for MCAPS.**
> Talk to Copilot in plain English to manage MSX opportunities, milestones, and tasks — no coding required.

MCAPS Copilot Tools connects GitHub Copilot (in VS Code) to your MSX CRM and Microsoft 365 data through [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) servers. Instead of clicking through MSX screens, you describe what you need in the Copilot chat window and the tools do it for you.

**What can it do?**

- **Read MSX data** — look up opportunities, milestones, tasks, and ownership.
- **Update MSX records** — create tasks, close milestones, update statuses (with confirmation before any write).
- **Search M365 evidence** — find relevant Teams chats, meeting transcripts, emails, and documents via WorkIQ.
- **Role-aware guidance** — the system knows MCAPS roles (SE, CSA, CSAM, Specialist) and tailors its behavior accordingly.

---

## Quick Start (5 Minutes)

> **Prerequisites:** [VS Code](https://code.visualstudio.com/) (or VS Code Insiders) with the [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) installed, [Node.js 18+](https://nodejs.org/), and [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli).

### Step 1: Clone and install

```bash
git clone https://github.com/JinLee794/mcaps-copilot-tools.git
cd mcaps-copilot-tools/mcp/msx
npm install
```

### Step 2: Sign in to Azure

The MSX CRM tools authenticate through Azure CLI. Sign in with your Microsoft corp account:

```bash
az login
```

### Step 3: Open the repo in VS Code

```bash
# from the repo root
code .
```

### Step 4: Start the MCP servers

1. Open the file `.vscode/mcp.json` in VS Code. You should see a **"Start"** button above each server definition.
2. Click **Start** on `msx-crm` (required) and `workiq` (optional, for M365 searches).
3. That's it — the tools are now available inside Copilot chat.

### Step 5: Open Copilot and start chatting

Open the GitHub Copilot chat panel (`Ctrl+Shift+I` / `Cmd+Shift+I`) and try one of the example prompts below.

---

## Example Prompts to Get Started

Copy-paste any of these into the Copilot chat window after you've started the MCP servers.

### Getting oriented

| What you want | Prompt to try |
|---|---|
| Check your CRM identity | `Who am I in MSX? Use crm_whoami to check.` |
| See your role | `What's my MSX role?` |
| Understand what tools are available | `What MCP tools do I have available for MSX?` |

### Reading CRM data

| What you want | Prompt to try |
|---|---|
| List your opportunities | `Show me my active opportunities for Contoso.` |
| Check milestones for an opportunity | `What milestones are on the Contoso Azure Migration opportunity?` |
| Find milestones that need tasks | `Which of my milestones across Contoso and Fabrikam are missing tasks?` |
| View a milestone timeline | `Show me a timeline view of milestones for Contoso.` |

### Writing CRM data (with confirmation)

| What you want | Prompt to try |
|---|---|
| Create a task | `Create a task under the "Cloud Assessment" milestone for Contoso: "Schedule architecture review with customer" due next Friday.` |
| Close a task | `Close the "Schedule architecture review" task for Contoso — it's done.` |
| Update a milestone | `Update the Cloud Assessment milestone status to "On Track".` |

> **Note:** All write operations will ask you to confirm before anything is changed. You always get a chance to review and approve.

### Searching M365 evidence (WorkIQ)

| What you want | Prompt to try |
|---|---|
| Find meeting notes | `What was discussed in my last meeting with the Contoso team?` |
| Search Teams chats | `Find recent Teams messages about the Fabrikam deal.` |
| Look up emails | `Show me recent emails from the Contoso stakeholders about the migration timeline.` |

### Role-based workflows

| What you want | Prompt to try |
|---|---|
| Work as a Solution Engineer | `I'm a Solution Engineer. What milestones should I focus on for Contoso this week?` |
| Work as a CSAM | `As a CSAM, walk me through my milestone hygiene for this quarter.` |
| Weekly milestone review | `Run a weekly milestone hygiene check across all my active customers.` |

---

## Optional: Enable Obsidian Vault Integration

If you use [Obsidian](https://obsidian.md/) as a local knowledge base, you can connect it as an additional MCP server. This gives Copilot read/write access to your vault for durable customer notes, prior findings, and session context.

### How to enable it

1. Open `.vscode/mcp.json` in your editor.
2. Find the commented-out `"mcp-obsidian"` block (around line 23).
3. Uncomment the entire block so it looks like this:

```jsonc
"mcp-obsidian": {
    "command": "npx",
    "args": [
        "@mauricio.wolff/mcp-obsidian@latest",
        "${input:obsidianVaultPath}"
    ]
},
```

4. When prompted, enter the absolute path to your Obsidian vault (e.g., `/Users/yourname/Documents/MyVault`).
   - Alternatively, set the `OBSIDIAN_VAULT_PATH` environment variable and it will use that as the default.
5. Click **Start** on `mcp-obsidian` in VS Code just like the other servers.

> **Don't use Obsidian?** No worries — everything works without it. The system falls back to `.agent-memory/` for local context storage automatically.

---

## Project Layout

| Folder | What's inside |
|---|---|
| `mcp/msx/` | Node.js MCP server for MSX CRM tools (the main engine) |
| `.github/skills/` | Role-specific Copilot skills (SE, CSA, CSAM, Specialist, WorkIQ scoping) |
| `.github/instructions/` | Operational instructions (role/write gates, CRM schema, intent resolution) |
| `docs/` | Architecture docs and supporting documentation |
| `recipes/` | Reusable workflow recipes (e.g., weekly milestone hygiene) |

## What's Included

### MSX CRM MCP Tools

These tools let Copilot interact with MSX CRM on your behalf:

| Tool | What it does |
|---|---|
| `crm_whoami` | Checks who you are in MSX (validates authentication) |
| `crm_query` | Runs read-only OData queries against CRM |
| `crm_get_record` | Fetches a specific CRM record by ID |
| `list_opportunities` | Lists opportunities, filterable by customer |
| `get_milestones` | Lists milestones for an opportunity or owner |
| `find_milestones_needing_tasks` | Finds milestones across customers that need task attention |
| `create_task` | Creates a new task under a milestone |
| `update_task` / `close_task` | Updates or closes an existing task |
| `update_milestone` | Updates milestone status or details |
| `view_milestone_timeline` | Returns a timeline view of milestones |
| `view_opportunity_cost_trend` | Returns cost trend data for an opportunity |

### Role Skills

The system includes pre-built role definitions that shape how Copilot approaches your workflows:

- **[Solution Engineer](.github/skills/Solution_Engineer_SKILL.md)** — technical win execution, architecture reviews, proof-of-concept work
- **[Cloud Solution Architect](.github/skills/Cloud_Solution_Architect_SKILL.md)** — cloud architecture, migration planning, technical design
- **[Customer Success Account Manager](.github/skills/CSAM_SKILL.md)** — milestone delivery, consumption tracking, customer health
- **[Specialist](.github/skills/Specialist_SKILL.md)** — deal qualification, pipeline support, solution area depth

You don't need to memorize these — just tell Copilot your role and it will apply the right behavior.

### WorkIQ (M365 Evidence Retrieval)

WorkIQ connects Copilot to your Microsoft 365 data. It can search across:

- **Teams** — chat/thread decisions, channel updates, action ownership
- **Meetings** — transcript evidence, decisions, blockers, next steps
- **Outlook** — stakeholder communication trail, commitments, follow-ups
- **SharePoint/OneDrive** — latest proposal/design docs and revision context

Learn more: [WorkIQ overview (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/workiq-overview)

---

## How It Works (Under the Hood)

```
You (Copilot Chat)
  │
  ├── asks about CRM data ──→ msx-crm MCP server ──→ MSX Dynamics 365
  ├── asks about M365 data ──→ workiq MCP server  ──→ Teams / Outlook / SharePoint
  └── asks about notes     ──→ mcp-obsidian (optional) ──→ Your Obsidian Vault
```

1. You type a question or action in Copilot chat.
2. Copilot reads the role skills and instruction files in this repo to understand how to behave.
3. It routes your request to the right MCP server (CRM, WorkIQ, or Obsidian).
4. For read operations, it returns the results directly.
5. For write operations, it shows you what it plans to change and waits for your approval.

---

## Configuration

### Authentication

All CRM operations authenticate through Azure CLI:

```bash
az login
```

Make sure you're signed in with your Microsoft corp account before starting the MCP servers.

### MCP Server Config

The file [.vscode/mcp.json](.vscode/mcp.json) defines which MCP servers are available. Out of the box, it includes:

| Server | Status | Purpose |
|---|---|---|
| `msx-crm` | **Enabled** | MSX CRM operations (opportunities, milestones, tasks) |
| `workiq` | **Enabled** | Microsoft 365 evidence retrieval (Teams, Outlook, SharePoint) |
| `mcp-obsidian` | Commented out | Optional Obsidian vault integration for local knowledge |
| `CopilotKit MCP` | **Enabled** | CopilotKit baseline for agent diagnostics |

## Customization

This repo is designed to be forked and customized for your team:

- **Role skills** — edit the files in `.github/skills/` to match your team's operating model
- **Instruction files** — update `.github/instructions/` to enforce workflow gates or add safety checks
- **Recipes** — add reusable workflows in `recipes/` for common cadences (weekly reviews, quarterly planning)
- **MCP composition** — add or swap MCP servers in `.vscode/mcp.json` to connect new data sources

---

## Frequently Asked Questions

**Do I need to know how to code?**
No. The primary interface is the Copilot chat window — you type in plain English and Copilot does the rest. The code in this repo powers the tools behind the scenes.

**Is it safe to use? Will it change my CRM data without asking?**
No write operation happens without your explicit approval. Every create, update, or close action shows you a confirmation prompt first.

**What if I don't have an Obsidian vault?**
Everything works fine without it. Obsidian integration is entirely optional.

**Can I use this outside VS Code?**
The MCP servers can work with any MCP-compatible client, but VS Code with GitHub Copilot is the recommended and best-supported experience.

**What if `az login` fails or my token expires?**
Run `az login` again. The MCP server uses Azure CLI tokens, so keeping your session active is all you need.

---

## Inspiration and Thanks

Big thanks to the original MSX Helper project for the foundation and inspiration that helped shape this into an MCP server.

## License

MIT (see `mcp/msx/package.json`)
