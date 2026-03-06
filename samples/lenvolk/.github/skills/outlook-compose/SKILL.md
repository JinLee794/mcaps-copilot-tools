---
name: outlook-compose
description: >-
  Primary tool for email composition via Outlook COM automation.
  Composes and saves email drafts in Outlook — zero API calls, no Graph tokens,
  no rate limits. Renders email templates from .docs/Email-Templates/ with account data from
  AccountReference.md and weekly seat reports, then saves as draft for human review.
  Outlook is always running locally. Drafts appear immediately and are verifiable.
  Triggers on: email draft creation, Outlook draft save, email composition, template rendering.
  Requires Outlook desktop running on Windows.
argument-hint: 'Provide TPID(s), template name, and optionally override TO/CC addresses'
---

# Outlook Compose

Primary tool for email composition. Composes templated emails and saves as drafts in local Outlook via COM automation. No Graph API, no tokens, no rate limits. Drafts appear immediately and are verifiable.

## Tool Hierarchy

| Priority | Tool | When |
|----------|------|------|
| 1 (Primary) | `outlook-local` MCP (`outlook_create_draft`, `outlook_create_draft_batch`) | Always use first for email composition. Zero terminal prompts. |
| 2 (Fallback) | Report error to orchestrator | Only when Outlook COM fails (Outlook not running, COM error). No cloud MCP fallback. |
| 3 (Deprecated) | Direct PowerShell (`New-OutlookDraft.ps1`) | Only if `outlook-local` MCP server is unavailable. Requires terminal access. |

**Preferred path**: Agents should call `outlook-local` MCP tools, which wrap the PowerShell scripts internally via `child_process.execFile`. This eliminates all VS Code terminal prompts (Allow/Skip, Remove-Item, awaiting input).

## Prerequisites

- Windows OS with Outlook desktop running
- PowerShell 5.1+
- The user's mailbox must be synced locally

## Core Script

`scripts/New-OutlookDraft.ps1` — creates a draft mail item in Outlook's Drafts folder.

### Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `-To` | Yes | — | Array of TO recipient email addresses |
| `-Cc` | No | @() | Array of CC recipient email addresses |
| `-Bcc` | No | @() | Array of BCC recipient email addresses |
| `-Subject` | Yes | — | Email subject line |
| `-Body` | Yes | — | Email body content (HTML or plain text) |
| `-BodyType` | No | `"HTML"` | `"HTML"` or `"Text"` |
| `-OutputPath` | No | "" | Write JSON result to file (stdout if omitted) |

### Usage

```powershell
# Single draft
.\.github\skills\outlook-compose\scripts\New-OutlookDraft.ps1 `
  -To "alice@microsoft.com","bob@github.com" `
  -Cc "sbounds@microsoft.com","ccarper@microsoft.com" `
  -Subject "GitHub Copilot whitespace & milestone – CONTOSO" `
  -Body "<p>Hi Alice, Bob, ...</p>" `
  -OutputPath ".tmp_draft_contoso.json"
```

## Workflow — Template-Based Composition

### Step 1 — Resolve Template

Read the requested template from `.docs/Email-Templates/<TemplateName>.md`. Each template defines:
- **Addressing rules** (TO, CC, Subject patterns)
- **HTML body** with `{{placeholders}}`
- **Placeholder reference** mapping each placeholder to a data source

### Step 2 — Resolve Account Data

For each TPID:

1. **Read `.docs/AccountReference.md`** — extract:
   - Account Name
   - MilestoneID, OppID
   - SSP Aliases → extract email addresses only (strip names)
   - GH AE Aliases → extract email addresses only (strip names, skip "N/A")

2. **Read latest `.docs/Weekly/*_GHCP-Seat-Opp.md`** — match by TPID to get:
   - GHCP Seats
   - QP Seats
   - Remaining Whitespace

### Step 3 — Render Template

Replace all `{{placeholders}}` with resolved values:
- `{{Account Name}}` → account name from AccountReference
- `{{First Names (all TO recipients)}}` → first names of all TO recipients, comma-separated with "and" before last
- `{{GHCP Seats}}` → formatted with comma thousands (e.g., `16,528`)
- `{{QP Seats}}` → formatted with comma thousands
- `{{Remaining Whitespace}}` → formatted with comma thousands
- `{{MilestoneID}}` → milestone ID from AccountReference

### Step 4 — Save as Draft

Run the script to create the draft in Outlook:

```powershell
.\.github\skills\outlook-compose\scripts\New-OutlookDraft.ps1 `
  -To $toEmails `
  -Cc $ccEmails `
  -Subject $renderedSubject `
  -Body $renderedHtmlBody `
  -OutputPath ".tmp_draft_<account>.json"
```

### Step 5 — Report and Cleanup

Read the JSON output. Report:
- Draft status (created / error)
- Subject line
- Recipient count (TO + CC)
- Instruction: "Open Outlook Drafts to review and send"

Delete temp JSON:
```powershell
Remove-Item ".tmp_draft_<account>.json"
```

## Batch Mode — Multiple TPIDs

When the user says "all TPIDs" or provides multiple TPIDs:

1. Read all TPIDs from `.docs/AccountReference.md`
2. Read seat data from the latest weekly report once (avoid re-reading per account)
3. Loop through each TPID, render template, create draft
4. Report summary table:

| Account | Status | TO Count | CC Count | Subject |
|---|---|---|---|---|
| CONTOSO | ✅ Draft created | 4 | 2 | GitHub Copilot whitespace... |
| FABRIKAM | ✅ Draft created | 2 | 2 | GitHub Copilot whitespace... |

## Batch Mode (Fleet Mode — 4+ Accounts)

For 4+ accounts, use `New-OutlookDraftBatch.ps1` — one COM init, one loop, one output file.

### Batch Script

`scripts/New-OutlookDraftBatch.ps1` — batch entry point for fleet draft composition.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `-InputPath` | Yes | Path to JSON input file with array of draft specs |
| `-OutputPath` | Yes | Path to write JSON results file |

### Input Schema

```json
[
  { "account": "COX", "to": ["a@cox.com"], "cc": ["b@ms.com"], "subject": "...", "body": "<p>...</p>", "bodyType": "HTML" },
  { "account": "NIELSEN", "to": ["b@nielseniq.com"], "subject": "...", "body": "<p>...</p>" }
]
```

### Output Schema

```json
{
  "COX": { "status": "draft_created", "entryId": "...", "subject": "...", "to": "...", "cc": "..." },
  "NIELSEN": { "status": "draft_created", "entryId": "...", "subject": "..." },
  "_meta": { "startedAt": "ISO", "completedAt": "ISO", "draftsCreated": 2, "draftsFailed": 0, "totalDrafts": 2 },
  "_errors": {}
}
```

### Usage (Fleet Mode — 3 terminal prompts total)

```powershell
# 1. Agent writes input JSON (1 prompt)
$inputJson | Set-Content ".tmp_draft_batch_input_a3f21c.json"

# 2. Agent runs batch script (1 prompt)
.\.github\skills\outlook-compose\scripts\New-OutlookDraftBatch.ps1 `
  -InputPath ".tmp_draft_batch_input_a3f21c.json" `
  -OutputPath ".tmp_draft_batch_results_a3f21c.json"

# 3. Agent reads results via read_file (no prompt)
# 4. Agent cleans up (1 prompt)
Remove-Item ".tmp_draft_batch_*_a3f21c.json"
```

## Email Extraction Helpers

When extracting emails from AccountReference.md alias fields:

- **SSP Aliases format**: `Name1 email1@microsoft.com; Name2 email2@microsoft.com`
- **GH AE Aliases format**: `Name1 email1@github.com; Name2 email2@github.com`
- Extract pattern: split by `;`, then extract the email address (word containing `@`)
- Skip entries that are `N/A` or empty
- First names: take the first word before the email in each alias entry

## Output Structure

```json
{
  "status": "draft_created",
  "entryId": "00000000...",
  "subject": "GitHub Copilot whitespace & milestone – CONTOSO",
  "to": "alice@microsoft.com; bob@github.com",
  "cc": "sbounds@microsoft.com; ccarper@microsoft.com",
  "bcc": "",
  "bodyType": "HTML",
  "createdOn": "2026-02-28T14:30:00",
  "message": "Draft saved to Outlook Drafts folder. Open Outlook to review and send."
}
```

## Limitations

- Outlook must be running — the script does not launch it.
- Drafts appear in the default Drafts folder only.
- Does not support attachments in v1.
- COM automation is single-threaded — batch drafts are created sequentially.
