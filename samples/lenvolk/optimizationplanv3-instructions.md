# Optimization Plan v3 — Instruction Architecture

**Status**: Draft — v3 review 2026-03-02, line counts corrected, OPT-3 rationale revised  
**Created**: 2026-03-02  
**v2 Review**: 2026-03-02 (risk assessment, validation gates, corrected OPT-2/4/6)  
**v3 Review**: 2026-03-02 (verified all line counts against actual files, corrected inventory totals, revised OPT-3 urgency)  
**Source**: Teams channel "Copilot in VS Code" (GitHub Copilot at Microsoft) — Andrei Birjukov's post (2026-03-02) + 5 related discussion threads  
**Related issue**: [vscode#255196 — Copilot instructions in multi-root should apply per folder](https://github.com/microsoft/vscode/issues/255196)

---

## Context

Andrei Birjukov posted today (2026-03-02) about Copilot eagerly discovering and pulling in instruction files from **all folders** in a multi-root VS Code workspace. Even though content isn't loaded (just file references), it creates cross-repo contamination and burns enumeration tokens. This is confirmed **by design** per vscode#255196.

Additional channel threads surfaced:
1. **Repo-level instructions not picked up** — `.github/custom-instructions.md` ignored without explicit `chat.instructionsFilesLocations` in settings
2. **Multi-root eager discovery** — instructions from unrelated repos bleed into context
3. **Canonical location confirmed** — `.github/copilot-instructions.md` (hyphenated, exact name)
4. **Precedence confusion** — repo instructions can override personal VS Code instructions with no merge behavior
5. **Workarounds** — `chat.instructionsFilesLocations` in settings.json and `github.copilot.chat.codeGeneration.instructions` as mitigations

---

## Current Architecture Audit

### File Inventory

| Category | Count | Actual Lines | Notes |
|----------|-------|------------|-------|
| **Instruction files** (`.github/instructions/`) | 7 | **1,136** | Tier 1 — matched by description/applyTo |
| **Agent files** (`.github/agents/`) | 9 | **1,858** | 1 orchestrator + 8 subagents |
| **Skills** (`.github/skills/`) | 16 active + 1 empty stub + 1 shared ref | **3,592** | Tier 2 — matched by name/description |
| **Root docs** | 2 | **~328** | copilot-instructions.md (278) + AGENTS.md (~50) (Tier 0) |
| **.github/documents/** | 2 | varies | Tier 3 — ag-ui.txt, QA-GHCP.md (already exists) |
| **Total discoverable** | **36+** | **~6,914** | Maximum potential context surface |

### Instruction Files Detail

| File | Lines (v2 est.) | Lines (v3 actual) | `applyTo` | Scoped? |
|------|-----------------|-------------------|-----------|---------||
| agent365-wordserver.instructions.md | 46 | **48** | `.github/agents/**` | ✅ |
| connect-hooks.instructions.md | 44 | **51** | `.connect/hooks/**` | ✅ |
| crm-entity-schema.instructions.md | 280 | **213** | `mcp-server/**` | ✅ |
| GHCP_Seat_Opportunity.instructions.md | **520** | **334** | *(none)* | ❌ |
| intent.instructions.md | **365** | **189** | *(none)* | ❌ (intentionally global) |
| local-notes.instructions.md | **480** | **206** | *(none)* | ❌ |
| msx-role-and-write-gate.instructions.md | 165 | **95** | `mcp-server/**` | ✅ |
| **TOTAL** | **~2,200** | **1,136** | — | 4/7 scoped |

### Current settings.json

```json
{
  "chat.tools.global.autoApprove": true,
  "chat.agent.autoApprove": true,
  "github.copilot.chat.agent.autoApprove": true
}
```

No `chat.instructionsFilesLocations` — relies entirely on default discovery + semantic matching.

---

## What We're Already Doing Right

- **Tiered context model** (Tier 0-3) with explicit budget discipline ("keep Tier 0 under ~80 lines")
- **Frontmatter routing** — all 7 instruction files have `description` keywords for semantic matching
- **`applyTo` scoping** on 4/7 instruction files — limits when content loads
- **Agent isolation** — 9 agents with explicit tool arrays, not "everything available"
- **Single-root workspace** — Andrei's exact cross-repo contamination doesn't hit us today
- **Role-bound skills** — 4 MSX role skills only load on explicit role mapping
- **No duplicate instructions** — each file has a distinct domain

---

## Optimization Opportunities

### OPT-1: Add `chat.instructionsFilesLocations` to settings.json
**Priority**: High | **Effort**: Trivial | **Risk**: None

Without explicit config, Copilot uses default discovery which enumerates all instruction/agent/skill files on every turn. Adding explicit paths gives control over what gets discovered.

**Change**:
```json
{
  "chat.instructionsFilesLocations": {
    ".github/instructions": true,
    ".github/agents": true,
    ".github/skills": true
  }
}
```

**Why**: Defensive — explicit is better than implicit. Also prepares for multi-root scenarios.

---

### OPT-2: ~~Add `applyTo` scoping to GHCP_Seat_Opportunity.instructions.md~~ → Defer to OPT-3
**Priority**: ~~High~~ Deferred | **Effort**: Trivial | **Risk**: **HIGH — scope too restrictive**

At **334 lines** (v2 estimated 520 — corrected in v3), this is the heaviest instruction file and has no `applyTo` — it loads whenever description keywords match, even in unrelated contexts.

**Original change**: Add `applyTo: ".docs/Weekly/**"` to YAML frontmatter.

**⚠️ REVIEW FINDING — DO NOT IMPLEMENT AS WRITTEN**:

`applyTo: ".docs/Weekly/**"` is too restrictive. GHCP logic is needed from contexts not tied to Weekly active files:
- **GHCPAnalyst agent** (`ghcp-analyst.agent.md` L47) declares this instruction as a required dependency
- **AccountTracker orchestrator** (`AccountTracker.agent.md` L35) lists it in its instruction table for GHCPAnalyst delegations
- **3 prompts** (`account-deep-dive`, `portfolio-snapshot`, `generate-weekly-plan`) reference GHCP seat concepts — none have active files in `.docs/Weekly/`
- The instruction's `description` triggers on keywords ("seat whitespace," "attach rate," "TAM") that appear in agent files, skill files, and prompt output templates

**Failure mode**: Instruction only loads when editing a Weekly report file, but needed during *reasoning about* seat data from agent/prompt/chat contexts with no active file.

**Revised approach**: Do NOT add `applyTo`. Instead, use **OPT-3** to split formula/glossary reference into `.github/documents/ghcp-metric-formulas.md`, reducing the instruction further. The description-based semantic matching is doing the right thing — it just loads too much content when it matches.

---

### OPT-3: Split heavy instruction files — move reference content to Tier 3
**Priority**: Medium → **LOW** (revised in v3) | **Effort**: Moderate | **Risk**: Low

**⚠️ v3 CORRECTION**: The v2 line counts were significantly inflated. Actual measurements:
- `GHCP_Seat_Opportunity.instructions.md` — v2 said **520**, actual is **334** (36% smaller)
- `local-notes.instructions.md` — v2 said **480**, actual is **206** (57% smaller)
- `intent.instructions.md` — v2 said **365**, actual is **189** (48% smaller)

**None of these files exceed 350 lines.** The urgency of content splitting is much lower than v2 estimated. At 334 lines, GHCP is the only file that *might* benefit from extraction, and even that is within reasonable bounds.

**Revised change**: Content splitting remains a valid optimization but is now **LOW priority** — the files are already reasonably sized. If pursued:
- `.github/documents/ghcp-metric-formulas.md` — extract ~100-150 lines of formula definitions from GHCP (reducing it to ~180-230 lines)
- `.github/documents/docs-folder-structure.md` — **SKIP** — local-notes is only 206 lines, not worth splitting

`.github/documents/` folder **already exists** with 2 files (ag-ui.txt, QA-GHCP.md), so no folder creation needed.

Keep routing stubs in the instruction files that say "For formula details, read `.github/documents/ghcp-metric-formulas.md`".

**Why**: Per the Context Loading Architecture rules: "Do not put actionable instructions in documents. Keep instructions in Tier 1/2; use documents for lookup." The extracted content IS lookup/reference material.

---

### OPT-4: Clean up orphaned skill folders
**Priority**: Low | **Effort**: Trivial | **Risk**: None

**⚠️ REVIEW CORRECTION**: Only ONE folder is orphaned — not two.

- `.github/skills/linkedin-content/` — **genuinely empty**, safe to remove ✅
- `.github/skills/references/` — **NOT orphaned** ❌ Contains `msx-role-shared-runtime.md`, actively referenced by all 4 role skills (csam, csa, specialist, solution-engineer via `../references/msx-role-shared-runtime.md`). Deleting it would break those skills.

**Change**: Remove `linkedin-content/` only. Keep `references/`.

**Why**: Empty folders get enumerated in skill discovery, burning enumeration tokens. But `references/` is shared infrastructure, not dead weight.

---

### OPT-5: Multi-root workspace readiness
**Priority**: Low (future-proofing) | **Effort**: Low | **Risk**: None

If this repo is ever opened alongside other repos in a multi-root workspace, all 34+ files bleed into other projects' context.

**Change**: No immediate action needed. OPT-1 (explicit `instructionsFilesLocations`) + OPT-2 (`applyTo` scoping) provide the foundation. If multi-root becomes a reality:
- Consider moving agent-specific instructions into the agent files themselves (AGENTS.md nesting)
- Monitor vscode#255196 for per-folder instruction scoping support

---

### OPT-6: Add `applyTo` scoping to local-notes.instructions.md
**Priority**: Medium | **Effort**: Trivial | **Risk**: **HIGH — behavior regression risk**

**Status**: EXPERIMENT-ONLY with mandatory rollback gate.

At **206 lines** (v2 estimated 480 — corrected in v3), local-notes loads whenever the description matches (notes, customer roster, storage, etc.). It's relevant for `.docs/**` operations but not for MCP server development or pure code tasks.

**Original change**: Add `applyTo: ".docs/**"` to YAML frontmatter.

**⚠️ REVIEW FINDING — DO NOT IMPLEMENT WITHOUT VALIDATION**:

Scoping to `.docs/**` would break notes-first behavior during agent orchestration, where the active file is an agent/prompt file or there is no active file (pure chat):
- **AccountTracker** (`AccountTracker.agent.md` L39) declares `local-notes.instructions.md` as a dependency for **ALL** subagents
- The instruction defines `.docs/` folder structure, contact resolution hierarchy, and notes-first principles that agents reference during *delegation prompt construction*
- **4 role skills** (csam, csa, specialist, solution-engineer) reference `.docs/` paths for CRM prefetch context
- `copilot-instructions.md` (Tier 0) explicitly routes to local-notes for storage conventions

**Failure mode**: With `applyTo: ".docs/**"`, local-notes would NOT load when the active file is an agent `.md`, a prompt `.md`, or during pure chat turns — exactly when agents need it most for delegation.

**Revised approach**: Keep local-notes global (no `applyTo`). At 206 lines actual, this file is **already right-sized** — no content splitting needed (v2 estimated 480 lines, which would have justified OPT-3 extraction). If `applyTo` is ever attempted, it must be behind a manual validation gate with rollback.

---

## What NOT to Change

| Don't | Why |
|-------|-----|
| Migrate from `.github/instructions/*.md` to `AGENTS.md` | Andrei's suggestion is a multi-root workaround. Our frontmatter routing is the recommended pattern for single-root. |
| Add `applyTo` to `intent.instructions.md` | Intentionally global — resolves before everything else per the tiered context model. |
| Consolidate agents | 1-orchestrator + 8-subagent delegation is clean and matches the concern about lean per-agent context. |
| Add `applyTo` to `GHCP_Seat_Opportunity.instructions.md` | Too restrictive — instruction needed from agent/prompt/chat contexts with no `.docs/Weekly/` active file. Use OPT-3 (content split) instead. |
| Add `applyTo` to `local-notes.instructions.md` without validation gate | Agents reference it during delegation even when not editing `.docs/` files. Regression risk confirmed in review. |
| Delete `.github/skills/references/` | Contains `msx-role-shared-runtime.md` referenced by all 4 role skills. NOT orphaned. |
| Remove the tiered context model | It's already best practice and matches what the channel recommends. |

---

## Execution Order (Revised)

| Phase | Items | Acceptance Criteria | Rollback Trigger |
|-------|-------|--------------------|-----------------|
| **Phase 1** — Quick wins | OPT-1 (settings.json) + OPT-4 (remove `linkedin-content/` only) | Spot-check 3 prompts: GHCP query, CRM milestone update, email search — all produce expected instruction activation | Any instruction that loaded before no longer loads |
| **Phase 2** — Content split (optional optimization) | OPT-3: extract formula reference from GHCP (→ `ghcp-metric-formulas.md`) into `.github/documents/` — local-notes split SKIPPED (already 206 lines) | GHCPAnalyst correctly cites formulas; GHCP instruction reduced by ~100-150 lines | GHCPAnalyst fails to find metric formulas |
| **Phase 3** — Experiment only | OPT-6 (local-notes `applyTo` test — manual toggle, not committed) | Full AccountTracker orchestration cycle succeeds with scoped local-notes | Any delegation prompt fails to include `.docs/` conventions → immediate revert |
| **Phase 4** — Future | OPT-5 (multi-root prep if workspace structure changes) | N/A — monitor only | N/A |

### Validation Framework

There is no built-in "show loaded instructions" diagnostic in Copilot. Use this practical proxy:

**Before each phase**: Record baseline by running 5-10 representative prompts/agent invocations:
1. GHCP seat query ("analyze seat whitespace for account X") → expect GHCP metric formulas cited
2. CRM milestone update ("update milestone tasks for opportunity Y") → expect role-write-gate loaded
3. Email search ("find latest email from account Z") → expect local-notes contact resolution hierarchy
4. AccountTracker delegation ("deep dive on account W") → expect `.docs/` paths in delegation prompts
5. Portfolio snapshot prompt → expect GHCP + local-notes content both present

**After each phase**: Re-run the same 5 scenarios. Compare outputs for:
- Instruction content presence (formulas cited, `.docs/` paths referenced, role gates applied)
- No new errors or missing context in agent outputs
- Directional token trend (responses should not be significantly longer or shorter)

**Rollback**: If any scenario regresses, revert the phase changes immediately. Phases are independent — a Phase 2 rollback does not require rolling back Phase 1.

### Key Adjustments from Review (2026-03-02)

1. **OPT-2 deferred** — `applyTo: ".docs/Weekly/**"` is too restrictive. GHCP instruction needed from agent/prompt/chat contexts. Content splitting (OPT-3) is the correct approach.
2. **OPT-4 corrected** — `references/` folder is NOT orphaned (contains `msx-role-shared-runtime.md` used by 4 role skills). Only `linkedin-content/` should be removed.
3. **OPT-6 downgraded to experiment** — Scoping local-notes to `.docs/**` would break agent orchestration delegation. Must validate with full agent cycle before committing.
4. **Validation framework added** — Each phase now has acceptance criteria and rollback triggers.
5. **OPT-1 confirmed safe** — Additive change (explicit config), can't break existing behavior. No before/after proof needed, but note the benefit is defensive.
6. **OPT-3 elevated to primary strategy** — Content splitting reduces heavy files without risking activation regression. This is now the main optimization lever.
7. **Residual risk if unchanged**: accidental instruction under-loading in core GHCP/local-notes workflows if `applyTo` scoping is applied without content splitting first.

### Key Adjustments from v3 Review (2026-03-02)

8. **Line counts corrected** — v2 estimates were significantly inflated for all 3 "heavy" files:
   - GHCP_Seat_Opportunity: 520 → **334** (36% smaller)
   - local-notes: 480 → **206** (57% smaller)
   - intent: 365 → **189** (48% smaller)
   - Total instructions: ~2,200 → **1,136** (48% smaller)
9. **OPT-3 priority downgraded** — With actual line counts, no file exceeds 350 lines. Content splitting remains valid but is LOW priority, not the "primary strategy" v2 claimed.
10. **local-notes split CANCELLED** — At 206 lines, extracting folder structure reference is not justified. Only GHCP (334 lines) might benefit from formula extraction.
11. **Skills are the heaviest category** — 3,592 lines across 16 SKILL.md files (v2 estimated ~2,000). However, skills only load on explicit match, so this is not an optimization concern.
12. **`.github/documents/` already exists** — Contains ag-ui.txt and QA-GHCP.md. No folder creation needed for OPT-3.
13. **`applyTo` scoping is 4/7** (not 5/7 as v2 stated) — agent365-wordserver, connect-hooks, crm-entity-schema, msx-role-and-write-gate have `applyTo`. GHCP, intent, local-notes do not.
14. **Agent line counts higher than estimated** — 1,858 actual vs ~1,500 v2 estimate. AccountTracker (432) and TeamsTracker (309) are the heaviest. This is expected given their orchestration/tracking complexity.
15. **`references/msx-role-shared-runtime.md` confirmed active** — All 4 role skills (SE, CSA, CSAM, Specialist) reference it on line 9. At 54 lines, this shared contract is well-scoped.
16. **Copilot-instructions.md is 278 lines** — v2 included it in "~500 Root docs" estimate. It's within the Tier 0 budget but exceeds the stated "~80 lines" target. This is a known tradeoff — it contains routing logic, MCP defaults, and operational rules that can't be moved to Tier 1 without losing always-on behavior.

---

## Channel Threads Reference

| Thread | Author | Date | Key Insight |
|--------|--------|------|-------------|
| Multi-root instruction discovery | Andrei Birjukov | 2026-03-02 | Eager discovery is by design; `applyTo` + `AGENTS.md` nesting as workarounds |
| Custom instructions not picked up | (multiple) | 2026-02 | Needs `chat.instructionsFilesLocations` in settings for non-standard paths |
| Instruction precedence | (multiple) | 2025-12 | Repo instructions override personal — no merge behavior |
| Canonical location | (multiple) | 2025-06 | `.github/copilot-instructions.md` (hyphenated, exact name) |
| Settings-based workarounds | (multiple) | 2025-03 | `github.copilot.chat.codeGeneration.instructions` as alternative |
