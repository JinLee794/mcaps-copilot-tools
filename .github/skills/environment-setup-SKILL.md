---
name: environment-setup
description: >
  Diagnoses and guides local environment setup for mcaps-copilot-tools MCP servers.
  Use when MCP servers fail to start, tools are unavailable, npm dependencies are missing,
  build output is absent, or the user asks how to set up, install, or onboard.
  Triggers: setup, install, init, onboard, MCP not connected, server not started,
  tools unavailable, npm install, build failed, environment check, getting started.
argument-hint: Describe your setup issue or ask to initialize the environment.
---

# Environment Setup Skill

## Purpose

Help users initialize, verify, and troubleshoot the local development environment for **mcaps-copilot-tools** MCP servers (`msx-crm` and `oil`).

---

## When to Activate

- User mentions: setup, install, init, onboard, getting started
- MCP server connection failures or "tools unavailable" errors
- Missing `node_modules/` or build artifacts (`dist/`)
- Questions about prerequisites (Node.js, Azure CLI, npm)

---

## Diagnostic Steps

Run the automated check first:

```bash
node scripts/init.js --check
```

This validates:
1. **Node.js ≥ 18** is installed
2. **npm** is available
3. **Azure CLI** is installed (optional but needed for CRM auth)
4. **mcp/msx** — `node_modules/` exists
5. **mcp/oil** — `node_modules/` exists AND `dist/index.js` is built

### Interpreting Results

| Symbol | Meaning |
|--------|---------|
| ✔ | Passing |
| ⚠ | Warning — works but may limit functionality |
| ✖ | Failure — must fix before servers will run |

---

## Fix: Full Initialization

If the check reports issues, run:

```bash
node scripts/init.js
```

This will:
1. Verify prerequisites
2. `npm install` in `mcp/msx`
3. `npm install` + `npm run build` in `mcp/oil`

Cross-platform alternatives:
- **macOS/Linux**: `./scripts/init.sh`
- **Windows PowerShell**: `.\scripts\init.ps1`

---

## Fix: Individual MCP Servers

### msx-crm (Dynamics 365 CRM)

```bash
cd mcp/msx
npm install
```

- Entry point: `src/index.js` (plain JavaScript, no build step)
- Configured in `.vscode/mcp.json` as `msx-crm`
- Requires `az login` for authentication at runtime

### oil (Obsidian Intelligence Layer)

```bash
cd mcp/oil
npm install
npm run build
```

- Entry point: `dist/index.js` (TypeScript — must build first)
- Configured in `.vscode/mcp.json` as `oil`
- Requires `OBSIDIAN_VAULT_PATH` env var pointing to your vault

---

## Common Issues

### "Cannot find module" or "MODULE_NOT_FOUND"
→ Run `node scripts/init.js` — dependencies are not installed.

### oil server fails with "dist/index.js not found"
→ Run `cd mcp/oil && npm run build` — TypeScript needs compilation.

### CRM tools return authentication errors
→ Run `az login` and ensure you are on the Microsoft corporate VPN.
→ Verify with `az account show` that you're signed in with your corp account.

### MCP server shows as "not connected" in VS Code
1. Open the Command Palette → "MCP: List Servers" to check status.
2. Run `node scripts/init.js --check` to verify the environment.
3. Restart the MCP server from the Command Palette → "MCP: Restart Server".

### Node.js version too old
→ Install Node.js 20+ from https://nodejs.org/ (LTS recommended).

---

## Prerequisites Reference

| Prerequisite | Required | Purpose |
|---|---|---|
| Node.js ≥ 18 | Yes | Runtime for MCP servers |
| npm | Yes | Package management |
| Azure CLI | For CRM | `az login` authentication |
| Obsidian vault | For OIL | Local knowledge store |
| Microsoft VPN | For CRM | Access to internal CRM endpoints |

---

## Post-Setup Verification

After initialization, verify everything works:

```bash
# Check environment
node scripts/init.js --check

# Test msx-crm
cd mcp/msx && npm test

# Test oil
cd mcp/oil && npm run bench
```

Then open the workspace in VS Code — MCP servers will auto-start via `.vscode/mcp.json`.
