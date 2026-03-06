---
description: "Sync project notes with the linked GitHub repo — pull recent commits, PRs, issues, and README updates into .docs/."
---

# Sync Project from GitHub

Keep a `.docs/` project note in sync with its linked GitHub repository. Read-only — pulls repo activity into the notes, never pushes.

## Workflow

### Step 1 — Read Project Note

- `read_file` on `.docs/_data/<Account>/state.md` → get the `repo` field from frontmatter.
- If no `repo` field, ask the user for the repo URL.

### Step 2 — Query GitHub

Use the VS Code GitHub extension tools (not MCP — no GitHub MCP server is configured):

- **Open PRs**: Use `github-pull-request_doSearch` with query `is:pr is:open repo:{owner}/{repo}` to find open pull requests.
- **Open Issues**: Use `github-pull-request_doSearch` with query `is:issue is:open repo:{owner}/{repo}` to find open issues.
- **PR/Issue details**: Use `github-pull-request_issue_fetch` with `issueNumber` and `repo` for individual PR or issue details.
- **Recent commits & README changes**: Use `github_repo` with a search query like `recent changes` against `{owner}/{repo}` for notable code and documentation updates.

> **Note**: This prompt operates outside the AccountTracker orchestration model — it uses GitHub extension tools directly because no GitHub-domain subagent exists. This is an explicit exemption, not a violation of the delegation architecture.

### Step 3 — Update Notes

Use `replace_string_in_file` to append or update the `## GitHub Activity` section on the project note.
- If the section already exists with a previous sync, replace its content.
- If the section doesn't exist, append it at the end of the file.
- Update `last_synced` in the YAML frontmatter.

## Output Format

Append to the project note:

```markdown
## GitHub Activity

*Last synced: {YYYY-MM-DD}*

### Recent Commits (Last 14 Days)

- `{short hash}` {commit message} — @{author} ({date})
- `{short hash}` {commit message} — @{author} ({date})

### Open Pull Requests

- **#{num}** {title} — @{author} ({status})

### Open Issues

- **#{num}** {title} — {labels} ({assignee})

### Documentation Changes

- {summary of README or docs changes, or "No changes"}
```

## Input

{user provides project name or repo URL}
