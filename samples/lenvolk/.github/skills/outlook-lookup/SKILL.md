---
name: outlook-lookup
description: Primary tool for email search and account email tracking. Searches local Outlook mailbox via COM automation — zero API calls, no rate limits, no auth tokens. Returns full email bodies (plain text, up to 4000 chars), complete metadata, and unanswered thread analysis. Supports finding emails sent to or received from specific contacts, checking for unanswered threads, flagging no-response situations, generating follow-up reports, and weekly email tracking. Outlook is always running locally. Triggers on email search, mailbox search, account email tracking, unanswered thread detection. Requires Outlook desktop running on Windows.
argument-hint: 'Provide contact email addresses, account name, keywords, and lookback days'
---

# Outlook Lookup

Search the local Outlook mailbox via COM automation. No Graph API calls, no rate limits.

## Tool Hierarchy

| Priority | Tool | When |
|----------|------|------|
| 1 (Primary) | `outlook-local` MCP (`outlook_search_emails`, `outlook_search_emails_batch`) | Always use first for email search. Returns full bodies, metadata, unanswered thread analysis. Zero terminal prompts. |
| 2 (Link resolution only) | `agent365-wordserver` MCP | ONLY for resolving Word document links found inside email bodies. Use `agent365-wordserver/GetDocumentContent`. |
| 3 (Deprecated) | Direct PowerShell (`Search-OutlookEmail.ps1`) | Only if `outlook-local` MCP server is unavailable. Requires terminal access. |

**Preferred path**: Agents should call `outlook-local` MCP tools, which wrap the PowerShell scripts internally via `child_process.execFile`. This eliminates all VS Code terminal prompts (Allow/Skip, Remove-Item, awaiting input).

## Prerequisites

- Windows OS with Outlook desktop running
- PowerShell 5.1+
- The user's mailbox must be synced locally (standard for enterprise Outlook)

## Core Script

`scripts/Search-OutlookEmail.ps1` -- the single entry point for all email lookups.

### Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `-Contacts` | Yes | -- | Array of email addresses to search |
| `-DaysBack` | No | 30 | Lookback window in days |
| `-AccountName` | No | "" | Label for output grouping |
| `-Keywords` | No | @() | Subject-line keyword filter |
| `-OutputPath` | No | "" | Write JSON to file (stdout if omitted) |

### Usage

```powershell
# Single account, participant-first
.\.github\skills\outlook-lookup\scripts\Search-OutlookEmail.ps1 `
  -Contacts "robfreud@github.com","mojabbar@github.com","davcastillo@microsoft.com" `
  -DaysBack 30 -AccountName "MILLENNIUM PARTNERS" `
  -Keywords "GHAS","GHCP","milestone" `
  -OutputPath ".tmp_millennium.json"

# Quick check, one contact
.\.github\skills\outlook-lookup\scripts\Search-OutlookEmail.ps1 `
  -Contacts "kabolger@microsoft.com" -DaysBack 14
```

## Workflow

1. **Read `.docs/_data/<Account>/contacts.md`** first for the FULL contact roster — customer contacts, Microsoft team members, GitHub participants, email domains, and v-team roles. Then read `AccountReference.md` for TPID, OppID, MilestoneID, and any SSP/GH AE not already captured.
2. **Run the script** with ALL collected email addresses as `-Contacts` (not just SSP + GH AE — include customer emails, broader Microsoft team, GitHub contacts)
3. **Read JSON output** -- the `analysis` array contains flagged items
4. **Report** using the output contract below

## Output Structure

The script returns JSON with:

```json
{
  "account": "MILLENNIUM PARTNERS",
  "totalMessages": 12,
  "sentCount": 7,
  "inboxCount": 5,
  "flaggedCount": 2,
  "messages": [ /* all messages sorted by date desc */ ],
  "analysis": [
    {
      "Subject": "RE: GHAS opportunity",
      "SentOn": "2026-02-27T08:51:00",
      "To": "Mo Jabbar <mojabbar@github.com>",
      "HasReply": false,
      "DaysWaiting": 0.5,
      "Status": "NO_RESPONSE"
    }
  ]
}
```

Key fields in `analysis`:
- `Status`: `NO_RESPONSE` or `REPLIED`
- `DaysWaiting`: elapsed days since send
- `HasReply`: boolean -- whether any inbox message on the same conversation topic arrived after the send
- `LatestReply` / `ReplyFrom`: populated only when `HasReply` is true

## Account-Scoped Keyword Search

When `-Contacts` and `-Keywords` are both provided, keyword-matched messages are **filtered to only include messages where at least one known contact appears in From/To/CC, or the `-AccountName` appears in the subject**. This prevents generic keywords (GHAS, GHCP, milestone, etc.) from pulling in emails about unrelated accounts.

This means the script enforces participant-first search for keyword results too — not just contact-based results.

## Agent Reporting Contract

After running the script, report:

1. **Latest message**: timestamp, folder, subject, from, to/cc
2. **Response status**: replied / not-replied for each sent message
3. **Response lag**: elapsed time from latest unanswered send to now
4. **Flagged items**: list all `NO_RESPONSE` entries with days waiting
5. **Follow-up buddy email**: draft for each flagged item (see AccountTracker agent rules)

## Multi-Account Batch (Fleet Mode)

For 4+ accounts, use `Search-OutlookEmailBatch.ps1` — one COM init, one loop, one output file. Eliminates per-account terminal prompts.

### Batch Script

`scripts/Search-OutlookEmailBatch.ps1` — batch entry point for fleet operations.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `-InputPath` | Yes | Path to JSON input file with array of search specs |
| `-OutputPath` | Yes | Path to write JSON results file |

### Input Schema

```json
[
  { "account": "COX", "contacts": ["a@cox.com"], "keywords": ["GHAS"], "daysBack": 90 },
  { "account": "NIELSEN", "contacts": ["b@nielseniq.com"], "keywords": ["GHCP"], "daysBack": 90 }
]
```

### Output Schema

```json
{
  "COX": { "account": "COX", "totalMessages": 3, "messages": [...], "analysis": [...] },
  "NIELSEN": { "account": "NIELSEN", "totalMessages": 0, "messages": [], "analysis": [] },
  "_meta": { "startedAt": "ISO", "completedAt": "ISO", "accountsProcessed": 2, "accountsFailed": 0, "totalAccounts": 2 },
  "_errors": { "PARAMOUNT": "COM timeout after 60s" }
}
```

### Usage (Fleet Mode — 3 terminal prompts total)

```powershell
# 1. Agent writes input JSON (1 prompt)
$inputJson | Set-Content ".tmp_email_batch_input_a3f21c.json"

# 2. Agent runs batch script (1 prompt)
.\.github\skills\outlook-lookup\scripts\Search-OutlookEmailBatch.ps1 `
  -InputPath ".tmp_email_batch_input_a3f21c.json" `
  -OutputPath ".tmp_email_batch_results_a3f21c.json"

# 3. Agent reads results via read_file (no prompt)
# 4. Agent cleans up (1 prompt)
Remove-Item ".tmp_email_batch_*_a3f21c.json"
```

### Single-Account Mode (< 4 accounts)

For 1–3 accounts, use `Search-OutlookEmail.ps1` directly (existing behavior).

```powershell
.\.github\skills\outlook-lookup\scripts\Search-OutlookEmail.ps1 `
  -Contacts "robfreud@github.com","mojabbar@github.com" `
  -DaysBack 30 -AccountName "MILLENNIUM PARTNERS" `
  -Keywords "GHAS","GHCP" `
  -OutputPath ".tmp_millennium.json"
```

## Limitations

- Searches only the local Outlook cache. If a message hasn't synced, it won't appear.
- COM automation can be slow for very large mailboxes. Use `-DaysBack` to narrow the window.
- Outlook must be running -- the script does not launch it.
- Does not search shared mailboxes or delegate folders (only the default profile).
