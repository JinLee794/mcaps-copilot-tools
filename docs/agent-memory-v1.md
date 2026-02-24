# Agent Memory v1 (Local, Structured, Context-Efficient)

## Goals

- Keep memory local and fast with no external dependency.
- Support selective retrieval with structured filters first.
- Keep context packing token-efficient.
- Serve as a local orchestration substrate for Copilot CLI session continuity and UI hydration.

## Directory Layout

Memory root is a local, gitignored folder at `.agent-memory/`:

- `.agent-memory/session/` — ephemeral short-lived context
- `.agent-memory/working/` — active repo knowledge
- `.agent-memory/durable/` — promoted durable memory
- `.agent-memory/_archive/` — archived duplicates from compact apply mode
- `.agent-memory/_compactions/` — compaction reports

## Orchestration Responsibilities

- `session` scope is the run continuity store used by UI session history and restore actions.
- `working` scope stores in-progress operational context that can influence near-term runs.
- `durable` scope stores promoted, validated facts/decisions only.
- Memory files are local-only and workspace-scoped; they are not a cross-repo global state store.

## Record Schema

Each memory is a JSON file with:

- `id` (UUID)
- `scope` (`session|working|durable`)
- `kind` (`fact|decision|procedure|note`)
- `summary` (short text)
- `content` (full memory body)
- `tags` (string array)
- `entities` (string array)
- `confidence` (0..1)
- `source` (where this came from)
- `created_at`, `updated_at`, `last_used_at` (ISO timestamps)
- `schemaVersion` (required for migration-safe evolution)

## File IO Safety Contract

- Use atomic JSON writes (temp file + rename in same directory).
- Use per-scope lock files for mutating operations (`add`, `promote`, `compact`).
- Reject any `memoryRoot` that resolves outside intended workspace boundaries.
- On malformed JSON read, skip record and include a diagnostic count in command output.

## Degraded/Recovery Behavior

- If write path is unavailable, retrieval remains read-only and callers receive explicit degraded status.
- If index/list artifacts are missing or corrupt, rebuild from existing scope files.
- Move unrecoverable malformed records to `_archive/<scope>-invalid/` during maintenance.

## Retrieval Pipeline

1. Hard filters (`scope`, `kind`, `tags`, `entities`).
2. Lexical ranking (summary/content/tag/entity matches).
3. Confidence + recency scoring bonuses.
4. Token-budget packing (`limit` + `tokenBudget`) for final context payload.

Scoring defaults:

- full query match in summary: +30
- full query match in content: +15
- per-term summary match: +10
- per-term content match: +4
- per-term tag/entity match: +8
- confidence bonus: up to +10
- recency bonus: up to +10

## Commands

Run from `mcp-server/`:

- `npm run memory:add -- --scope working --kind fact --summary "..." --content "..." --tags crm,odata --entities opportunity --confidence 0.9`
- `npm run memory:find -- --query "owner guid filter" --scope working --limit 8 --tokenBudget 1200`
- `npm run memory:promote -- --id <memoryId> --fromScope session`
- `npm run memory:compact -- --scope working`
- `npm run memory:compact -- --scope working --apply true`
- `npm run memory:weekly`
- `npm run memory:weekly -- --scope working --apply true`
- `npm run memory:weekly:apply`

Optional for all commands:

- `--memoryRoot <path>` to override `.agent-memory/`.

## Suggested Operating Rhythm

- Capture raw findings in `session` or `working`.
- Promote only stable facts/decisions to `durable`.
- Run compact weekly in report mode first, then apply mode.

## Operational Boundaries

- Do not store secrets, tokens, or credentials in memory content.
- Keep summaries concise and queryable to preserve ranking quality and token budget efficiency.
- Prefer lexical retrieval with hard filters before semantic expansion.
