# Recipes

Pre-canned prompt templates for common MSX/CRM workflows. Each recipe is either:

- **A single `.md` file** — for simple prompts with no attached context
- **A directory with `recipe.md`** — for prompts that accept drag-and-drop context files

## Quick start

1. Pick a recipe from the **Recipe** dropdown in the UI, or use the API directly
2. Fill in the variable prompts (customer name, project, dates, etc.)
3. The hydrated prompt lands in your chat input — review/edit, then send

## Creating a new recipe

### Simple recipe (single file)

```
recipes/my-recipe.md
```

### Recipe with context (directory)

```
recipes/my-recipe/
  recipe.md          # frontmatter + prompt template
  context/           # drop files here — they're auto-loaded as evidence
    meeting-notes.md
    email-export.txt
```

### Frontmatter format

```yaml
---
name: Human-readable Name
description: One-line description shown in picker tooltip
role: Solution Engineer           # optional default role
tags: [activity-log, tasks]       # for future filtering
variables_customer: { "required": true, "description": "Customer name" }
variables_project: { "required": true, "description": "Project name" }
variables_start_date: { "default": "2025-07-01", "description": "Start date" }
---
```

### Template variables

Use `{{variable_name}}` in the prompt body. These are replaced at hydration time.

Special default value `"today"` is expanded to the current date (YYYY-MM-DD).

## Context files

Drop any supporting documents into `recipes/<name>/context/`:

- Meeting notes (`.md`, `.txt`)
- Email exports (`.eml`, `.txt`)
- Spreadsheets/CSVs (`.csv`)
- Screenshots or diagrams (referenced by name in prompt)

Files over 512 KB are flagged as truncated. The loader reads all files in the
directory and injects their content alongside the prompt for the Copilot session.

## API

| Endpoint | Method | Description |
|---|---|---|
| `/api/recipes` | GET | List all available recipes with metadata |
| `/api/recipes/:id/hydrate` | POST | Hydrate a recipe with `{ variables: { ... } }` |
