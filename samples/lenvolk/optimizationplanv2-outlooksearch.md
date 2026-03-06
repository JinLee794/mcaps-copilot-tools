# Optimization Plan v2 — Terminal Prompt Elimination for Fleet Operations

**Status**: Planning (Final review 2026-03-01)  
**Created**: 2026-03-01  
**Branch**: `optimization-v1`  
**Depends on**: `optimizationplan.md` (Phases 1–7 complete), `optimizationplan-v1.md` (All 19 backlog items implemented)

---

## Problem Statement

The AccountTracker portfolio email sweep generates **100+ VS Code "Allow/Skip" terminal prompts** per run, making fleet operations unusable without constant user intervention. This affects **all Outlook COM workflows** — email search, draft composition, and any future COM-based tool.

### Three Prompt Types

| # | Prompt | Cause | Example |
|---|--------|-------|---------|
| 1 | **Allow/Skip** | VS Code terminal safety intercepts every `run_in_terminal` call | Running `.tmp_att_search.ps1` |
| 2 | **Allow/Skip (Remove-Item)** | VS Code blocks cleanup by default rule | `Remove-Item .tmp_att.json` → "Auto approval denied by rule Remove-Item (default)" |
| 3 | **"Terminal is awaiting input"** | Outlook COM hits interactive prompt (mailbox profile, auth) | `Searching for: mahemenw@microsoft.com … Please provide the required input` |

Agent "yolo mode" preferences live in agent instructions — they **cannot override** VS Code's platform-level terminal safety.

### Current Per-Account Flow

For each account in a portfolio sweep, the agent:

1. Writes `.tmp_<account>_search.ps1` → **Allow/Skip**
2. Runs `.tmp_<account>_search.ps1` → **Allow/Skip** → may also trigger **"awaiting input"** from COM
3. Parses `.tmp_<account>.json` via PowerShell → **Allow/Skip**
4. Runs `Remove-Item .tmp_<account>.*` → **Allow/Skip** (denied by default rule)

**For 35 accounts**: ~4 prompts × 35 accounts = **~140 user interventions**

Then a Python post-processor (`.tmp_process_all.py`) runs separately → more prompts.

### Why Not Just Use MCP (agent365-m365copilot)?

- Rate-limits after ~10–15 calls per session (undocumented limit, no Retry-After header)
- Each call takes 5-15 seconds including Graph search + result formatting
- For 35 accounts: minimum 35 calls × ~10s = **6+ minutes** (if no rate limits) — realistically **30+ minutes** with 429 backoff and errors
- Outlook COM batch processes all 35 accounts locally in **~2-3 minutes**, zero API calls

**MCP is for surgical queries. Outlook COM is the fleet workhorse.**

---

## Affected Workflows (Beyond Email Search)

The terminal prompt problem is **not limited to email search**. Every Outlook COM workflow shares the same root cause. This plan must address all three:

| Workflow | Current Script | Agent | Prompt Count (per account) |
|----------|---------------|-------|---------------------------|
| **Email search** | `Search-OutlookEmail.ps1` | EmailTracker | ~4 prompts |
| **Draft composition** | `New-OutlookDraft.ps1` | EmailComposer | ~3 prompts |
| **Email search + draft** | Both scripts | AccountTracker → EmailTracker + EmailComposer | ~7 prompts |

For a portfolio sweep of 35 accounts that includes both search AND follow-up draft composition: **~245 user interventions**.

### Inter-Dependencies

| Component | Depends On | Consumed By |
|-----------|-----------|-------------|
| `Search-OutlookEmail.ps1` | Outlook COM running | EmailTracker agent, `Search-OutlookEmailBatch.ps1` (Phase 1) |
| `New-OutlookDraft.ps1` | Outlook COM running | EmailComposer agent, `outlook-local` MCP (Phase 2) |
| `Search-OutlookEmailBatch.ps1` (Phase 1) | `Search-OutlookEmail.ps1` core logic (inlined) | EmailTracker fleet mode, `outlook-local` MCP (Phase 2) |
| `outlook-local` MCP server (Phase 2) | Phase 1 batch script tested + stable | EmailTracker, EmailComposer, AccountTracker |
| `email-tracker.agent.md` fleet mode | Phase 1 batch script OR Phase 2 MCP server | AccountTracker delegation |
| `AccountTracker.agent.md` delegation | EmailTracker fleet mode defined | All portfolio workflows |
| `outlook-lookup/SKILL.md` | Updated tool hierarchy | EmailTracker (reads skill for fallback rules) |
| `outlook-compose/SKILL.md` | Updated tool hierarchy | EmailComposer (reads skill for draft rules) |
| `copilot-instructions.md` batch rule | Phase 1 batch convention | All agents (Tier 0 instruction) |
| `.vscode/mcp.json` | Phase 2 server built | VS Code MCP discovery |

### Fallback Cascade (Current → Target)

**Current (email search):**
```
agent365-m365copilot MCP → (on error) → run_in_terminal + Search-OutlookEmail.ps1
                                         ↑ triggers Allow/Skip prompts
```

**After Phase 1 (email search):**
```
agent365-m365copilot MCP → (on error) → run_in_terminal + Search-OutlookEmailBatch.ps1
                                         ↑ still triggers ~3 Allow/Skip prompts
```

**After Phase 2 (email search + compose):**
```
agent365-m365copilot MCP → (on error) → outlook-local MCP → outlook_search_emails[_batch]
                                         ↑ zero prompts (MCP tool call, not terminal)

agent365-m365copilot MCP → (on error) → outlook-local MCP → outlook_create_draft
                                         ↑ zero prompts
```

**After Phase 2 (fleet operations — 4+ accounts):**
```
outlook-local MCP → outlook_search_emails_batch  (skip agent365 entirely)
                  → outlook_create_draft_batch    (skip agent365 entirely)
                  ↑ zero prompts, zero API calls
```

---

## Tool Routing Principle

| Operation | Tool | Why |
|---|---|---|
| Single account email search (1-3 accounts) | `agent365-m365copilot` MCP | One call, seconds, rich Graph filtering |
| Single draft composition (1-3 accounts) | `agent365-m365copilot` MCP | One call, seconds, Graph-based draft save |
| Portfolio email sweep (4+ accounts) | Outlook COM batch → `outlook-local` MCP (Phase 2) | Local, no API limits, ~2-3 min for 35 accounts |
| Portfolio draft campaign (4+ accounts) | Outlook COM batch → `outlook-local` MCP (Phase 2) | Local, no API limits, one COM init |
| Single account when MCP unavailable | Outlook COM single → `outlook-local` MCP (Phase 2) | Fallback when MCP rate-limits or errors |

**MCP (agent365) is NOT the primary for fleet operations.** It's too slow and rate-limited. Outlook COM batch is the fleet tool. agent365 MCP is for surgical, ad-hoc queries only.

---

## Phase 1: Single Batch Script (Quick Win)

**Goal**: Reduce terminal prompts from **~100 to ~3** for email search, and from **~75 to ~3** for draft composition.

**Approach**: Instead of per-account `.tmp_<account>.ps1` script generation, create ONE PowerShell batch script that loops ALL accounts internally. One COM init, one loop, one output file. Same pattern for draft composition.

### Design Principles

- **Batch script = data extraction only.** Return structured JSON. Do NOT embed report generation, markdown formatting, or thread cataloging into PowerShell. The agent synthesizes reports from JSON — that's what agents do well.
- **Python post-processor eliminated.** The ad-hoc `.tmp_process_all.py` script that agents currently generate for validation/classification/reporting is unnecessary when the batch script returns well-structured JSON. Agents read the JSON and produce reports directly.
- **COM init once, reuse across all accounts.** The `New-Object -ComObject Outlook.Application` call happens once at script start. Folder handles (`GetDefaultFolder(5)`, `GetDefaultFolder(6)`) are obtained once. Per-account iteration only does Restrict/filter operations.
- **Per-account timeout.** If COM hangs on one account (e.g., DASL filter on a huge folder), skip after 60s and log to `_errors`. Do not let one bad account kill the entire batch.

### Deliverables

1. **`Search-OutlookEmailBatch.ps1`** in `.github/skills/outlook-lookup/scripts/`
   - Accepts a JSON input file (`.tmp_email_batch_input_<runId>.json`) with array of search specs (runId = 6-char hex, e.g. `a3f21c`, prevents collision on concurrent/overlapping runs):
     ```json
     [
       { "account": "COX", "contacts": ["a@cox.com"], "keywords": ["GHAS"], "daysBack": 90 },
       { "account": "NIELSEN", "contacts": ["b@nielseniq.com"], "keywords": ["GHCP"], "daysBack": 90 }
     ]
     ```
   - Loops accounts internally using `Search-OutlookEmail.ps1` core logic (inlined, not per-script calls)
   - Creates ONE Outlook COM object, reuses across all accounts (fixes COM "awaiting input" — profile selection happens once)
   - Outputs ONE `.tmp_email_batch_results_<runId>.json` with all accounts keyed by name:
     ```json
     {
       "COX": { "totalMessages": 3, "messages": [...], "analysis": [...] },
       "NIELSEN": { "totalMessages": 0, "messages": [], "analysis": [] },
       "_meta": { "startedAt": "ISO", "completedAt": "ISO", "accountsProcessed": 2, "accountsFailed": 1 },
       "_errors": { "PARAMOUNT": "COM timeout after 60s" }
     }
     ```
   - Per-account errors logged in `_errors` key — batch continues to next account
   - `_meta` key tracks batch timing and counts for agent diagnostics
   - **No report generation** — JSON output only, agent handles synthesis

2. **`New-OutlookDraftBatch.ps1`** in `.github/skills/outlook-compose/scripts/`
   - Same batch pattern for draft composition
   - Accepts JSON input with array of draft specs:
     ```json
     [
       { "account": "COX", "to": ["a@cox.com"], "cc": ["b@ms.com"], "subject": "...", "body": "<p>...</p>" },
       { "account": "NIELSEN", "to": ["b@nielseniq.com"], "subject": "...", "body": "<p>...</p>" }
     ]
     ```
   - Creates ONE COM object, loops accounts, saves drafts
   - Outputs ONE `.tmp_draft_batch_results_<runId>.json`
   - Per-account errors in `_errors` key
   - Same runId suffix convention as search batch — prevents clobber on concurrent runs

3. **Update `email-tracker.agent.md`** — add "Fleet Mode" section:
   - When delegation includes 4+ accounts → fleet mode
   - Write `.tmp_email_batch_input_<runId>.json` (1 terminal prompt)
   - Run `Search-OutlookEmailBatch.ps1` (1 terminal prompt)
   - Read results JSON (file read, no terminal)
   - Cleanup (1 terminal prompt)
   - **Total: 3 prompts** regardless of account count

4. **Update `email-composer.agent.md`** — add "Fleet Mode" section:
   - When delegation includes 4+ accounts → fleet mode
   - Write `.tmp_draft_batch_input_<runId>.json` (1 terminal prompt)
   - Run `New-OutlookDraftBatch.ps1` (1 terminal prompt)
   - Read results JSON (file read, no terminal)
   - Cleanup (1 terminal prompt)
   - **Total: 3 prompts** regardless of account count

5. **Update `AccountTracker.agent.md`** — modify multi-account delegation:
   - For portfolio email searches, pass ALL accounts to EmailTracker in one delegation
   - Remove per-account delegation loops
   - Include all contacts, keywords, domains for each account in the delegation prompt
   - For portfolio email composition, pass ALL accounts to EmailComposer in one delegation

6. **Update `copilot-instructions.md`** — add batch convention rule:
   - "For multi-account Outlook COM operations, always use batch script pattern"
   - "Never generate per-account `.tmp_*.ps1` files in loops"
   - Fleet mode threshold: 4 accounts (configurable here, not hardcoded in scripts)

7. **Update `outlook-compose/SKILL.md`** — add batch mode:
   - Reference `New-OutlookDraftBatch.ps1` for multi-account drafts
   - Document JSON input/output schema

### Files Changed

| File | Action |
|------|--------|
| `.github/skills/outlook-lookup/scripts/Search-OutlookEmailBatch.ps1` | **NEW** — batch email search |
| `.github/skills/outlook-compose/scripts/New-OutlookDraftBatch.ps1` | **NEW** — batch draft composition |
| `.github/skills/outlook-lookup/scripts/Search-OutlookEmail.ps1` | Unchanged (still used for surgical single-account fallback) |
| `.github/skills/outlook-compose/scripts/New-OutlookDraft.ps1` | Unchanged (still used for surgical single-draft fallback) |
| `.github/agents/email-tracker.agent.md` | Add Fleet Mode section |
| `.github/agents/email-composer.agent.md` | Add Fleet Mode section |
| `.github/agents/AccountTracker.agent.md` | Modify multi-account delegation pattern |
| `.github/skills/outlook-compose/SKILL.md` | Add batch mode section |
| `.github/copilot-instructions.md` | Add batch convention rule |

### Prompt Reduction (Email Search)

| | Before | After |
|---|---|---|
| Script creation | N × `.tmp_<acct>.ps1` → N prompts | 1 × `.tmp_email_batch_input_<runId>.json` → 1 prompt |
| Script execution | N × run → N prompts + COM "awaiting input" per script | 1 × `Search-OutlookEmailBatch.ps1` → 1 prompt, COM init once |
| Post-processing | `python .tmp_process_all.py` → 1 prompt | Eliminated — agent reads JSON directly |
| Cleanup | `Remove-Item` per file → N prompts | 1 × `Remove-Item .tmp_email_batch_*_<runId>.*` → 1 prompt |
| **Total** | **~4N + 1 prompts** (N ≈ 12–25) | **~3 prompts** |

### Prompt Reduction (Draft Composition)

| | Before | After |
|---|---|---|
| Script creation | N × `.tmp_<acct>_draft.ps1` → N prompts | 1 × `.tmp_draft_batch_input_<runId>.json` → 1 prompt |
| Script execution | N × run → N prompts + COM init per script | 1 × `New-OutlookDraftBatch.ps1` → 1 prompt, COM init once |
| Cleanup | `Remove-Item` per file → N prompts | 1 × `Remove-Item .tmp_draft_batch_*` → 1 prompt |
| **Total** | **~3N prompts** | **~3 prompts** |

### Phase 1 Test Plan

Before proceeding to Phase 2, validate Phase 1 with these tests:

1. **Batch search — 3 accounts**: Write input JSON with 3 known accounts → run `Search-OutlookEmailBatch.ps1` → verify output JSON has all 3 keys, verify message counts match individual script runs
2. **Partial failure**: Include 1 account with an invalid contact email → verify `_errors` key populated, other 2 accounts still succeed
3. **Timeout handling**: If feasible, simulate a COM hang → verify script doesn't block indefinitely
4. **Batch draft — 2 accounts**: Write input JSON with 2 drafts → run `New-OutlookDraftBatch.ps1` → verify 2 drafts appear in Outlook Drafts folder
5. **Prompt count**: Manually count Allow/Skip prompts during a 3-account batch run → must be exactly 3 (write, run, cleanup)

### Limitations

- Still requires 3 Allow/Skip clicks per portfolio run (per operation — 3 for search, 3 for compose if both needed)
- COM "awaiting input" prompt type (#3) happens once instead of N times, but can still block the single batch run
- Cleanup `Remove-Item` still blocked by VS Code default rule
- No test framework for PowerShell scripts — testing is manual

---

## Phase 2: Outlook Local MCP Server (Zero Prompts)

**Goal**: Eliminate ALL terminal prompts for email search and draft composition. MCP tool calls bypass VS Code terminal safety entirely.

**Approach**: Build a lightweight Node.js MCP server (`outlook-local`) that wraps the existing PowerShell scripts via `child_process.execFile`. MCP servers run as separate stdio processes — their child process spawns don't trigger VS Code Allow/Skip or "awaiting input" interceptions.

**Prerequisite**: Phase 1 batch scripts tested and working (the MCP server wraps them).

### Architecture

```
Agent → outlook_search_emails_batch (MCP tool call, zero prompts)
  → outlook-local MCP server (Node.js, stdio process)
    → child_process.execFile("powershell.exe", ["-File", "Search-OutlookEmailBatch.ps1", ...])
    → reads JSON from output file
    → returns structured result to agent
  ← zero terminal prompts, zero Allow/Skip, zero "awaiting input"

Agent → outlook_create_draft_batch (MCP tool call, zero prompts)
  → outlook-local MCP server
    → child_process.execFile("powershell.exe", ["-File", "New-OutlookDraftBatch.ps1", ...])
    → reads JSON from output file
    → returns structured result to agent
  ← zero terminal prompts
```

### COM Lifecycle Management

The MCP server does NOT hold a persistent COM object. Each tool call:
1. Writes input JSON to a temp file (server-managed, not VS Code terminal)
2. Spawns `powershell.exe -NoProfile -ExecutionPolicy Bypass -File <script> -InputPath <tmp>` via `execFile`
3. Waits for exit (with timeout — 120s for batch, 30s for single)
4. Reads output JSON from the script's `-OutputPath`
5. Deletes both temp files (server-managed cleanup — no terminal, no `Remove-Item` prompts)
6. Returns parsed JSON to agent

This means COM is created and destroyed per tool call (same as current behavior). The PowerShell process owns COM lifecycle; the MCP server just orchestrates invocation.

### Deliverables

5. **`mcp/outlook/` directory** — new MCP server (same architecture as `mcp/msx/`):
   - `package.json` — deps: `@modelcontextprotocol/sdk`, `zod`. Scripts: `start`, `test`, `test:watch`
   - `vitest.config.mjs` — test configuration (mirrors `mcp/msx/vitest.config.mjs`)
   - `src/index.js` — entry point, wires tools → stdio transport
   - `src/outlook.js` — spawns PowerShell with batch scripts, manages temp files, parses JSON output
   - `src/tools.js` — MCP tool definitions:
     - `outlook_search_emails` — single account search (surgical fallback)
     - `outlook_search_emails_batch` — multi-account batch search (fleet mode)
     - `outlook_create_draft` — compose + save single draft (wraps `New-OutlookDraft.ps1`)
     - `outlook_create_draft_batch` — compose + save drafts for multiple accounts (wraps `New-OutlookDraftBatch.ps1`)
     - `outlook_check_health` — verify Outlook COM is reachable (spawns minimal PS script)
   - `src/validation.js` — input sanitization:
     - Email address format validation (RFC 5322 basic check — reject obviously invalid addresses)
     - Account name escaping (no shell metacharacters in JSON values — `execFile` handles this, but validate anyway)
     - Keyword array length limits (prevent runaway DASL filter construction)
     - `daysBack` range validation (1–365, prevent absurd lookback windows)

6. **Wire into `.vscode/mcp.json`**:
   ```json
   "outlook-local": {
     "type": "stdio",
     "command": "node",
     "args": ["mcp/outlook/src/index.js"]
   }
   ```

7. **Update `email-tracker.agent.md`** — change fallback + fleet routing:
   - Surgical mode: `agent365-m365copilot` MCP → `outlook-local` MCP fallback on error
   - Fleet mode: `outlook-local` MCP `outlook_search_emails_batch` directly
   - Zero terminal involvement in either mode

8. **Update `outlook-lookup/SKILL.md`** — document tool hierarchy:
   - Surgical: `agent365-m365copilot` (primary) → `outlook-local` MCP (fallback)
   - Fleet: `outlook-local` MCP (primary, only option)
   - Direct PowerShell: deprecated, only if MCP server unavailable

9. **Update `outlook-compose/SKILL.md`** — document tool hierarchy:
   - Surgical: `agent365-m365copilot` (primary) → `outlook-local` MCP (fallback)
   - Fleet: `outlook-local` MCP (primary, only option)
   - Direct PowerShell: deprecated

10. **Tests** — `mcp/outlook/src/__tests__/tools.test.js`:
    - Mock `child_process.execFile` to return sample JSON
    - Validate email format sanitization (valid, invalid, edge cases)
    - Validate account name sanitization
    - Verify batch output structure (per-account keys, `_meta`, `_errors`)
    - Verify single-account output structure
    - Verify draft output structure
    - Verify error handling: Outlook not running (exit code 1)
    - Verify error handling: COM timeout (execFile timeout)
    - Verify error handling: malformed JSON output from script
    - Verify temp file cleanup occurs even on script failure

### Files Changed

| File | Action |
|------|--------|
| `mcp/outlook/package.json` | **NEW** |
| `mcp/outlook/vitest.config.mjs` | **NEW** |
| `mcp/outlook/src/index.js` | **NEW** |
| `mcp/outlook/src/outlook.js` | **NEW** |
| `mcp/outlook/src/tools.js` | **NEW** |
| `mcp/outlook/src/validation.js` | **NEW** |
| `mcp/outlook/src/__tests__/tools.test.js` | **NEW** |
| `.vscode/mcp.json` | Add `outlook-local` server entry |
| `.github/agents/email-tracker.agent.md` | Update tool routing (replace `execute/*` with `outlook-local/*`) |
| `.github/agents/email-composer.agent.md` | Update tool routing (replace `execute/*` with `outlook-local/*`) |
| `.github/skills/outlook-lookup/SKILL.md` | Update tool hierarchy |
| `.github/skills/outlook-compose/SKILL.md` | Update tool hierarchy |

### Key Design Decisions

- **Reuse existing PowerShell scripts** — don't rewrite COM logic in Node.js
- **`child_process.execFile`** (not `exec`/shell) for security — prevents command injection
- **Same JSON output schema** — agents don't need to change result parsing
- **COM health check** — `outlook_check_health` tool verifies Outlook is running before batch ops, returns clear error instead of hanging

### Why This Eliminates All Three Prompt Types

| Prompt Type | Why It's Gone |
|---|---|
| Allow/Skip (terminal) | MCP tool calls don't use VS Code terminal |
| Remove-Item denied | No terminal cleanup needed — server manages temp files internally |
| "Awaiting input" (COM) | Server process owns stdin — COM prompts are bounded by timeout with deterministic failure handling (process-tree kill, stderr capture persisted to `_diag.log`, hard return contract: exit code 2 + partial `_meta` + `_errors` entry) |

---

## Phase 3: Smart Routing + Cache Layer (Agent Picks the Right Mode)

**Goal**: Agents automatically select surgical vs fleet mode based on the request — no user direction needed. Cache reduces redundant searches.

**Prerequisite**: Phase 2 MCP server working.

### Deliverables

10. **Update `email-tracker.agent.md`** with explicit routing table:
    - **Surgical** (1–3 accounts, specific thread/contact): `agent365-m365copilot` → `outlook-local` fallback on error
    - **Fleet** (4+ accounts, portfolio sweep): `outlook-local` batch directly (skip `agent365` entirely)
    - Agent determines mode from account count in the delegation prompt
    - MCP is NEVER used for fleet ops — not a fallback question, a performance question

11. **Update `AccountTracker.agent.md`** delegation patterns:
    - Single-account asks → delegate to EmailTracker in "surgical" mode
    - Portfolio/weekly asks → delegate to EmailTracker in "fleet" mode with ALL accounts in one call
    - Never loop per-account delegations for fleet ops
    - Same pattern for EmailComposer: single draft = surgical, portfolio outreach = fleet

12. **Add per-account email cache** in `.docs/Customers/<Account>/cache-email.md`:
    - Written by EmailTracker after each successful search (surgical or fleet)
    - Format: ISO timestamp + thread catalog + participant summary + unanswered flags
    - Freshness rules (enforced by agent, not infrastructure):
      - ≤3 days for weekly reports
      - ≤1 day for targeted asks
      - Always stale for "check now" / "live search" requests
    - Cache is READ context for delegation (not the answer) — agent always states cache age when reporting cached data
    - AccountTracker loads cache in Phase 2 (context loading) to inform delegation prompts, but ALWAYS delegates for live data when freshness rules require it

### Cache Invalidation

Cache files are never "invalidated" — they're overwritten on each successful search. Freshness is determined by the timestamp in the file header:
```markdown
<!-- Cache: account=COX, fetched=2026-03-01T14:30:00Z, mode=fleet, accounts_in_batch=25 -->
```
The agent compares `fetched` timestamp against the current time and freshness rules. If stale, it delegates a live search. The cache file is overwritten with fresh results.

### Files Changed

| File | Action |
|------|--------|
| `.github/agents/email-tracker.agent.md` | Add routing table + cache write behavior |
| `.github/agents/AccountTracker.agent.md` | Add surgical/fleet delegation patterns + cache-aware context loading |
| `.docs/Customers/<Account>/cache-email.md` | **NEW** per account (agent-generated, not committed to git) |

---

## Execution Order

| Phase | Scope | Prompt Count | Fixes Types | Prerequisite |
|-------|-------|-------------|-------------|-------------|
| **Phase 1** | Batch PowerShell scripts (search + compose) + agent instructions | ~3 per operation | #1 (reduced), #2 (reduced), #3 (reduced to 1) | None |
| **Phase 2** | Local MCP server wrapping PowerShell | **0** per run | #1, #2, #3 — all eliminated | Phase 1 batch scripts tested |
| **Phase 3** | Agent routing logic + caching | 0 (uses Phase 2) | N/A — optimization layer | Phase 2 MCP server working |

**Phase 1** can ship immediately (scripts + instruction edits). **Phase 2** is the permanent fix. **Phase 3** is polish.

### Dependency Graph

```
Phase 1a: Search-OutlookEmailBatch.ps1 ──────┐
Phase 1b: New-OutlookDraftBatch.ps1 ──────────┤
Phase 1c: Agent instruction updates ──────────┤
                                              ▼
                                    Phase 1 Test Plan
                                              │
                                              ▼
Phase 2a: mcp/outlook/ server ────────────────┤ (wraps Phase 1 scripts)
Phase 2b: .vscode/mcp.json wiring ────────────┤
Phase 2c: Agent instruction updates ──────────┤
Phase 2d: Skill doc updates ──────────────────┤
Phase 2e: Tests (vitest) ────────────────────┤
                                              ▼
                                    Phase 2 Integration Test
                                              │
                                              ▼
Phase 3a: EmailTracker routing table ─────────┤
Phase 3b: AccountTracker delegation patterns ─┤
Phase 3c: Cache layer ─────────────────────────┤
                                              ▼
                                    Phase 3 Portfolio Sweep Test
```

Within Phase 1, items 1a/1b/1c are independent and can be done in any order.
Within Phase 2, items 2a must be done first (2b-2e depend on it).
Within Phase 3, items 3a-3c are independent.

---

## Verification

1. **Phase 1 — Batch search**: Run `Search-OutlookEmailBatch.ps1` with 3 test accounts → verify single JSON output, verify per-account errors don't halt batch, count terminal prompts (should be exactly 3)
2. **Phase 1 — Batch compose**: Run `New-OutlookDraftBatch.ps1` with 2 test accounts → verify 2 drafts in Outlook, count terminal prompts (should be exactly 3)
3. **Phase 1 — Partial failure**: Include 1 account with invalid contact → verify `_errors` key populated, other accounts succeed
4. **Phase 2 — Zero prompts**: Start `outlook-local` MCP server → call `outlook_search_emails_batch` → verify JSON result, verify ZERO Allow/Skip prompts appeared
5. **Phase 2 — Draft via MCP**: Call `outlook_create_draft_batch` → verify drafts created, zero prompts
6. **Phase 2 — Health check**: Call `outlook_check_health` with Outlook running → pass. Close Outlook → call again → clear error message
7. **Phase 2 — Integration**: Run AccountTracker for one account with `agent365-m365copilot` intentionally unavailable → verify it routes to `outlook-local`, verify zero prompts
8. **Phase 3 — Fleet routing**: Run weekly portfolio sweep → verify fleet mode fires for batch, surgical mode for single asks
9. **Phase 3 — Cache**: Verify cache files created and timestamped, verify stale cache triggers live search
10. **Regression**: `npm test` in `mcp/msx/` (existing tests still pass)
11. **New tests**: `npx vitest run` in `mcp/outlook/` (new server tests pass)

---

## Excluded

- **Rewriting PowerShell COM logic in Node.js** — unnecessary complexity; wrapping is sufficient
- **Waiting for Microsoft to fix MCP rate limits** — out of our control
- **Disabling VS Code terminal safety** — insecure, not recommended
- **Parallel COM instances** — spawn N PowerShell processes for N accounts simultaneously. Possible for Phase 2 via `Promise.all`, but needs COM stability testing with >5 concurrent instances. Defer until single-threaded batch is proven stable.
- **Teams/Calendar local fallback** — agent365-teamsserver and agent365-calendartools don't have the same rate-limit severity as agent365-m365copilot. No local COM fallback exists for Teams/Calendar. If this changes, the `outlook-local` MCP server pattern can be extended with new tools.
- **Pester tests for PowerShell** — Phase 1 batch scripts are tested manually (see Phase 1 Test Plan). Automated PowerShell testing via Pester would be nice but is out of scope. The MCP server layer (Phase 2) has vitest coverage.

---

## Considerations

1. **Outlook desktop dependency**: The MCP server requires Outlook running locally. `outlook_check_health` tool verifies COM is reachable before batch ops — returns clear error (not hang) if Outlook is closed.

2. **MCP rate limit heuristic**: Instead of waiting for a 429 from `agent365-m365copilot`, consider a proactive call counter — after 10 successful MCP calls in one session, switch remaining accounts to `outlook-local` without waiting for a failure. This is a Phase 3 enhancement.

3. **Post-processing eliminated**: The ad-hoc Python post-processor (`.tmp_process_all.py`) that agents currently generate is unnecessary. The batch scripts return structured JSON with per-account messages and analysis. Agents read JSON and produce reports — no intermediate processing step needed. This removes an entire class of temp scripts and terminal prompts.

4. **Compose workflow parity**: The original plan only addressed email search. Draft composition via `New-OutlookDraft.ps1` has the exact same prompt problem for portfolio outreach campaigns. Phase 1 now includes `New-OutlookDraftBatch.ps1` and Phase 2 includes `outlook_create_draft_batch` to achieve full parity.

5. **copilot-instructions.md placement**: The batch convention rule should go in the "Outlook Local Search (outlook-lookup)" section of copilot-instructions.md, alongside the existing fallback documentation. After Phase 2, this section expands to cover the MCP server as the primary fleet tool.

6. **Agent tool declarations**: After Phase 2, `email-tracker.agent.md` and any other agent that uses Outlook COM must add `outlook-local/*` to their YAML `tools:` list. Currently EmailTracker's tools list includes `execute/getTerminalOutput` (for PowerShell) — after Phase 2 this changes to `outlook-local/*` (for MCP).

7. **Temp file location**: Phase 2 MCP server manages its own temp files in a predictable location (e.g., `os.tmpdir()` or alongside the script). These are invisible to VS Code and the agent — the MCP server creates and cleans them up internally. No `.tmp_*` files in the workspace root.

---

## Review — Cross-Cutting Analysis (2026-03-01)

> **Reviewer**: Claude Opus 4.6 logical trace against current codebase
> **Method**: Read all referenced files (`Search-OutlookEmail.ps1`, `New-OutlookDraft.ps1`, `email-tracker.agent.md`, `AccountTracker.agent.md`, `outlook-lookup/SKILL.md`, `outlook-compose/SKILL.md`, `mcp/msx/` architecture, `.vscode/mcp.json`, `copilot-instructions.md`), traced inter-dependencies, identified gaps.

### Finding 1 (High): Original plan scope was too narrow — search only

The original plan only addressed email search (`Search-OutlookEmail.ps1`). Draft composition via `New-OutlookDraft.ps1` has the identical N-prompt problem for portfolio outreach campaigns (EmailComposer agent). Both scripts use the same COM pattern, the same per-account loop, and the same temp file pattern.

**Impact**: For a portfolio sweep that includes both search AND follow-up drafts, the original plan would only fix half the prompts.

**Fix applied**: Phase 1 now includes `New-OutlookDraftBatch.ps1`. Phase 2 now includes `outlook_create_draft_batch` tool. All three phases address both search and compose.

### Finding 2 (High): Post-processing should NOT be embedded in PowerShell

The original plan stated the batch script should "include post-processing logic currently in `.tmp_process_all.py` (validation, participant classification, thread catalog, markdown report generation)." This is a design error:

- `.tmp_process_all.py` is not a permanent repo file — it's generated ad-hoc by agents
- Embedding markdown report generation in PowerShell fights the language — agents are better at synthesis
- The batch script's job is data extraction: search COM, return structured JSON
- The agent's job is synthesis: read JSON, produce reports, update `.docs/` files

**Fix applied**: Phase 1 design principles now explicitly state "batch script = data extraction only" and "Python post-processor eliminated." Phase 1 prompt reduction table shows post-processing as "Eliminated — agent reads JSON directly."

### Finding 3 (Medium): Phase 2 needed COM lifecycle clarity

The original plan didn't specify how the MCP server handles COM lifecycle. Two options:
- **Option A**: Hold persistent COM object in server process (efficient, but COM can go stale)
- **Option B**: Create/destroy COM per tool call (current behavior, proven stable)

**Fix applied**: Plan now explicitly documents Option B — each tool call spawns a fresh PowerShell process. COM is created and destroyed per call. This matches current behavior and avoids COM staleness issues.

### Finding 4 (Medium): Missing test infrastructure for Phase 2

The original plan listed test cases but didn't mention `vitest.config.mjs` or `package.json` scripts, which are required for the test runner to work (see `mcp/msx/` architecture).

**Fix applied**: Phase 2 deliverables now include `vitest.config.mjs` and `package.json` with `test` and `test:watch` scripts.

### Finding 5 (Medium): Agent tool declarations need updating

After Phase 2, agents that currently use `execute/getTerminalOutput` (terminal) for Outlook COM need to switch to `outlook-local/*` (MCP). This affects:
- `email-tracker.agent.md` — tools list
- `email-composer.agent.md` — tools list

Both agents now explicitly listed in Phase 1 (Fleet Mode) and Phase 2 (tool routing) Files Changed tables.

**Fix applied**: Promoted from Consideration #6 to explicit Phase 1 + Phase 2 deliverables.

### Finding 6 (Medium): Temp file hygiene

The original plan has the MCP server writing temp files to the workspace root (`.tmp_email_batch_input.json`). Phase 2 should write temp files to `os.tmpdir()` or a server-managed directory — not the workspace. This:
- Avoids polluting the workspace with temp files
- Avoids `.gitignore` churn
- Makes cleanup invisible to VS Code

**Fix applied**: Added as Consideration #7.

### Finding 7 (Low): Missing dependency arrows between phases

The original plan implied Phase 2 depends on Phase 1, but didn't state it explicitly. Phase 2's MCP server wraps Phase 1's batch scripts — if Phase 1 scripts don't work, Phase 2 is blocked.

**Fix applied**: Each phase now has an explicit "Prerequisite" line. Dependency graph added to Execution Order section.

### Finding 8 (Low): No mention of outlook-compose/SKILL.md in Phase 2

The original plan updated `outlook-lookup/SKILL.md` in Phase 2 but not `outlook-compose/SKILL.md`. Both skills need tool hierarchy updates.

**Fix applied**: Phase 2 now includes `outlook-compose/SKILL.md` update.

### Summary of Changes Made to This Plan

| Area | Original | Updated |
|------|----------|---------|
| Title | "Outlook Email Search Pipeline Refactoring" | "Terminal Prompt Elimination for Fleet Operations" |
| Scope | Email search only | Email search + draft composition |
| Phase 1 scripts | 1 batch script | 2 batch scripts (search + compose) |
| Phase 1 post-processing | Embedded in PowerShell | Eliminated — agent reads JSON |
| Phase 1 test plan | None | 5-step manual test plan |
| Phase 2 COM lifecycle | Unspecified | Explicit per-call spawn model |
| Phase 2 tools | 4 tools | 5 tools (added `outlook_create_draft_batch`) |
| Phase 2 test infrastructure | Tests only | Tests + vitest config + package.json scripts |
| Phase 2 files changed | 9 files | 12 files (added vitest.config, outlook-compose/SKILL.md, email-composer.agent.md) |
| Phase 3 cache | Freshness rules only | Freshness rules + invalidation strategy + header format |
| Inter-dependencies | None documented | Full dependency table + fallback cascade diagrams |
| Phase prerequisites | Implicit | Explicit |
| Dependency graph | None | ASCII dependency graph in Execution Order |
| Agent tool declarations | Not mentioned | Explicit in Phase 1 + Phase 2 (both EmailTracker + EmailComposer) |
| Temp file hygiene | Workspace root | `os.tmpdir()` (Consideration #7) |
| Verification steps | 6 | 11 |

### Acceptance Criteria (All Phases Complete)

**Functional:**
- Zero VS Code terminal prompts during portfolio email sweep (search + compose)
- `outlook-local` MCP server passes all vitest tests
- EmailTracker routes to fleet mode for 4+ accounts without user instruction
- AccountTracker delegates ALL accounts in one call for portfolio operations
- Cache files created with ISO timestamps, stale cache triggers live search
- Existing `mcp/msx/` tests still pass (`npm test`)
- `Search-OutlookEmail.ps1` and `New-OutlookDraft.ps1` still work for direct PowerShell invocation (backward compatibility)
- Agent tool declarations updated in YAML frontmatter
- No `.tmp_*` files left in workspace root after MCP server operations

**Performance SLOs:**
- 35-account fleet search completes in ≤ 5 minutes on baseline machine (current COM sequential: ~2-3 min; 5 min gives 2x headroom)
- ≥ 95% account success rate per fleet run (≤ 1-2 accounts in `_errors` for a 35-account batch)
- Per-account COM timeout: 60s hard cap with deterministic failure (process-tree kill + `_errors` entry)
- MCP server tool call overhead: < 2s per call excluding PowerShell execution time

### Resolved Design Decisions

1. **Concurrent fleet runs**: Serialized via lockfile (`.tmp_fleet_lock` with PID + timestamp). Outlook COM is single-instance; two concurrent COM sessions race on mailbox access. If lock exists and PID is alive → abort with clear error. If PID is dead → stale lock, reclaim.

2. **Outlook precondition**: Phase 2 `outlook_check_health` requires Outlook already open with profile loaded (`Get-Process OUTLOOK`). The MCP server does NOT launch Outlook programmatically — that's where the worst modal states originate (profile picker, first-run wizard, MFA). If health check fails, return clear error; user must open Outlook manually.

3. **Fleet mode threshold**: Configurable in `copilot-instructions.md` (default: 4 accounts). The batch scripts process whatever array they receive — the routing decision lives entirely in agent instructions. Single-line change to adjust from 4 to 3 or 6.
