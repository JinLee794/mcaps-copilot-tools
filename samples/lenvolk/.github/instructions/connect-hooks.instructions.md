---
applyTo: ".connect/hooks/**"
description: "Connect hook formatting + evidence schema, .docs/ routing for Connect evidence capture"
---
# Connect Hook Writing Guide

When writing Connect hooks:

- Use the schema below for every hook entry.
- Each hook must map to at least one of the **3 circles of impact**.
- Include concrete evidence and a source pointer (PR / Issue / Doc / Thread).
- Keep each hook to **3–6 lines**.

## Storage Routing

Connect hooks follow the notes-first storage pattern defined in `.github/instructions/local-notes.instructions.md`.

**Summary:**
1. **`.docs/` available**: Append to `.docs/_data/<Account>/insights.md` under `## Connect Hooks` (use `replace_string_in_file` to insert below the heading). Create the section if it doesn't exist.
2. **Always**: Write to `.connect/hooks/hooks.md` as a repo-tracked backup, regardless of `.docs/` availability.
3. **`.docs/` unavailable**: `.connect/hooks/hooks.md` is the sole destination.

## Schema

```yaml
- Date:
- Circle(s): Individual | Team/Org | Customer/Business
- Hook:
- Evidence:
- Source:
- Next step:
```

## Circle of Impact Definitions

| Circle | What counts |
|---|---|
| **Individual** | Personal growth, skill development, learning, certifications |
| **Team/Org** | Improving team processes, mentoring, tooling, documentation |
| **Customer/Business** | Direct customer impact, revenue, adoption, satisfaction |

## Example

```yaml
- Date: 2026-02-24
- Circle(s): Team/Org, Customer/Business
- Hook: Built MCP-based CRM tooling that reduced milestone hygiene prep from ~45 min to <5 min per account
- Evidence: Weekly milestone review now automated; 3 CSAMs onboarded to the workflow
- Source: PR #42, recipe weekly-milestone-hygiene.md
- Next step: Expand to cover task-gap detection across full SE portfolio
```
