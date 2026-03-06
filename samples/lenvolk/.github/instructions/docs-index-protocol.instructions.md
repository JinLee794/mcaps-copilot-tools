---
description: "Index-first protocol for .docs/ database operations. Governs how agents read and write the _index.md portfolio index and _data/ per-account files. Use when performing any portfolio operation, account lookup, email/Teams/calendar search, milestone review, weekly plan, or any workflow that reads or writes .docs/ files."
applyTo: ".github/agents/**,.github/prompts/**,.github/skills/**"
---

# .docs/ Index-First Protocol

All agent operations on the `.docs/` database MUST follow this read protocol. The goal is minimum reads for maximum context.

## Read Protocol

### Step 1 — Always read `_index.md` first

For **any** portfolio or account operation, the first read is `.docs/_index.md`. This single file provides:
- All 39 accounts with TPID, Tier, Tranche, seat counts, attach rates, whitespace
- Freshness timestamps for email, Teams, MSX per account
- Active flags and next-action summaries

**One read replaces**: scanning AccountReference.md + looping through per-account files + reading per-account state files individually.

### Step 2 — For single-account operations, read specific data files

After `_index.md` identifies the account, read only the files needed for the operation:

| Operation | Files to Read |
|---|---|
| Email search | `_data/<Account>/contacts.md` → AccountReference.md (for TPID/keywords) |
| Teams search | `_data/<Account>/teams-threads.md` → `contacts.md` |
| Milestone review | `_data/<Account>/state.md` → AccountReference.md (for OppID) |
| Account deep dive | `_data/<Account>/state.md` → `contacts.md` → `insights.md` |
| Meeting prep | `_data/<Account>/state.md` → `contacts.md` → `email-threads.md` |
| Connect hook capture | `_data/<Account>/insights.md` (append) |

### Step 3 — For portfolio operations, use `_index.md` alone

Portfolio snapshot, weekly plan generation, tranche summary, and account ranking should use `_index.md` data directly. Only drill into `_data/<Account>/` for accounts that need detail (flagged, overdue, at-risk).

## Write Protocol

After modifying any `_data/<Account>/` file, update `_index.md` if the change affects dashboard columns:
- **Seats/Attach/Whitespace** → update from GHCP report data
- **Email/Teams/MSX dates** → update freshness timestamp
- **Flags** → update Flag column
- **Next Action** → update if the action changed

## Session Start Reconciliation

On session start (first interaction), compare AccountReference.md against `_index.md`:
- New accounts in AccountReference.md not in `_index.md` → create `_data/<Account>/` folder and add to index
- Accounts removed from AccountReference.md → flag for review (do not auto-delete)

## Anti-Patterns

- **Never loop through `_data/` folders** to build a portfolio view — `_index.md` already has it
- **Never read all 5 data files** for a single operation — read only what's needed
- **Never skip `_index.md`** and go straight to per-account files for portfolio operations
- **Never write to `_data/` without checking** if `_index.md` needs updating
