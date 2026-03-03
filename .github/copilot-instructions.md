# Copilot Instructions for MSX Helper MCP

## Intent (Resolve First)

The agent strengthens cross-role communication and strategic alignment for account teams. MSX is one medium — not the mission. For the full model, see `.github/instructions/intent.instructions.md`.

**Operational checklist — every request:**
1. **Resolve order**: Intent → Role → Medium → Action → Risk check.
2. **Cross-ref ≥2 mediums** for status/risk/next-steps (CRM + M365 or vault). State sources; flag stale or silent mediums.
3. **Surface risk proactively** — one sentence, cite evidence, name the role to act, suggest minimum intervention.
4. **Connect rooms**: Bring context from separated mediums/roles together so the full value reaches the person who needs it.
5. **Match to availability**: Only promise synthesis for mediums confirmed queryable (see Medium Probe below).
6. **Strategic lens** (when request touches account state): pipeline health · execution integrity · customer value · cross-role coverage · risk posture.

## Medium Availability Probe

At session start (or first account-team request), probe which mediums are queryable:

| Medium | Probe | If unavailable |
|---|---|---|
| **CRM** | `crm_auth_status` or `crm_whoami` | No CRM reads/writes this session |
| **Vault** | `get_vault_context()` via OIL (`oil` MCP) | Skip VAULT-PREFETCH; operate stateless |
| **WorkIQ / M365** | `ask_work_iq` with a minimal scoped query | Communication gap detection limited |

Cache probe results for the session. Two-medium answers are acceptable; single-medium must flag the gap. Never fabricate cross-medium insights from a single source.

---

## Default Behavior

- Prefer MCP tools over local scripts. Use `msx-crm` from `.vscode/mcp.json` for read/write operations.
- If an MCP tool fails, retry with corrected parameters first. Local diagnostics only when explicitly requested.
- Derive missing identifiers via MCP read tools (e.g., `crm_whoami`) — do not create ad-hoc scripts.

## MSX/CRM Operations

**Role mapping (mandatory before guidance or write-intent planning):**
- Capture the user's MSX role up front. If not confirmed, present role options:
  - `Specialist` → `.github/instructions/role-card-specialist.instructions.md`
  - `Solution Engineer` → `.github/instructions/role-card-se.instructions.md`
  - `Cloud Solution Architect` → `.github/instructions/role-card-csa.instructions.md`
  - `Customer Success Account Manager` → `.github/instructions/role-card-csam.instructions.md`
- If inferable from `crm_whoami` + `crm_get_record`, present likely role(s) and confirm.
- For MCEM process model, stage definitions, and verifiable outcomes → `.github/instructions/mcem-flow.instructions.md`
- For shared patterns (definitions, runtime contract, scoping) → `.github/instructions/shared-patterns.instructions.md`

**CRM query discipline:**
- Never guess property names — verify via `crm_list_entity_properties` or `.github/instructions/crm-entity-schema.instructions.md`.
- For CRM read query scoping (vault-first, composite tools, filtering) → `.github/instructions/crm-query-strategy.instructions.md`
- For write-intent flows → `.github/instructions/msx-role-and-write-gate.instructions.md`
- **Deal team**: Not retrievable via MCP tools. See `crm-entity-schema.instructions.md` § "Deal Team".

**WorkIQ**: Narrow scope before retrieval. See `.github/skills/workiq-query-scoping/SKILL.md`. Resolve role first, then apply scoping.

**Vault (OIL)**: Knowledge store for customer context and durable memory. See `.github/instructions/obsidian-vault.instructions.md`. If unavailable, operate statelessly (CRM-only).

**Connect Hooks**: Capture measurable impact evidence. See `.github/instructions/connect-hooks.instructions.md`.

## Response Expectations

- Keep outputs concise and action-oriented.
- When asked to "use MCP server", do not pivot to direct shell-based CRM calls.

## Context Loading Architecture

| Tier | Location | Loaded | Budget |
|---|---|---|---|
| **0** | This file | Always (every turn) | ≤100 lines |
| **1** | `.github/instructions/*.instructions.md` | By `description` match or `applyTo` glob | ≤600 lines combined |
| **2** | `.github/skills/{name}/SKILL.md` | Auto-discovered by VS Code via frontmatter | ≤500 lines per skill |
| **3** | `.github/documents/` | Explicit tool read only | No auto-load |

**Skill loading**: Skills use the folder convention `.github/skills/{name}/SKILL.md` and are auto-discovered by VS Code via `name`, `description`, and `argument-hint` frontmatter. When a role card or MCEM flow references a skill by name, load it with `read_file` at `.github/skills/{name}/SKILL.md`.

**Authoring rules**: Every instruction needs keyword-rich `description` frontmatter. Every skill needs `name`, `description`, `argument-hint` in its `SKILL.md` frontmatter. Shared definitions belong in Tier 1, not duplicated across skills.