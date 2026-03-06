---
name: gh-stack-browser-extraction
description: >-
  Extract GitHub Stack Summary data from MSX Insights Power BI Embedded report
  using Playwright MCP browser tools. Handles MSXI navigation, AAD auth/MFA prompts,
  TPID slicer filtering, and PBI JS API data export. Use when user asks for
  GHCP matrix, GHCP seats, GitHub stack summary, GitHub stack data, seat counts,
  attach rates, ACR data, WAU/WEU, GHE seats, GHAS seats, PRU data, or any
  MSXI account-level GitHub metrics for one or more TPIDs. Also triggers on
  get_github_stack_summary returning needsExtraction=true, milestone note updates
  with GitHub data, or account reviews needing live MSXI numbers.
argument-hint: Provide one or more TPIDs to extract data for
---

# GitHub Stack Browser Extraction

Extract GitHub Stack Summary data from the MSX Insights PBI Embedded report using Playwright MCP browser tools.

**Execution rule**: Do not deliberate — go straight to Step 1. No planning preamble needed.

## When to Use

- User asks for GHCP matrix, GHCP seats, GitHub stack, seat counts, attach rates, ACR, WAU/WEU
- User asks to update milestone notes with GitHub stack data
- User asks for fresh/current GitHub stack summary for an account (by TPID or customer name)
- `get_github_stack_summary(tpid)` returns `needsExtraction: true`
- Any workflow requiring live ACR, seat, or attach rate data from MSXI

## Template & Weekly Workflow

The account roster lives in the **template** file at `.docs/Weekly/Template GHCP-Seats-report.xlsx`.
- The template is the extraction-specific TPID list. The master account roster (with contacts, keywords, and identifiers) is `.docs/AccountReference.md`. Both must stay in sync.
- Column A: Account Name, Column B: TPID, Column C: OppID, Column D: MileStoneID, Columns E+: MSXI data columns (populated during extraction).
- **To generate a weekly report**: read all TPIDs from column B of the template, extract data via MSXI, and write the results to `.docs/Weekly/<YYYY-MM-DD>_GHCP-Seats-report.xlsx` (copy of template with data populated).
- The template itself is never overwritten with data — it is the source of truth for which accounts to extract.
- Only generate the weekly report when explicitly asked by the user.

## Multi-TPID Support

Set **all TPIDs at once** in the slicer `values` array (Step 3) instead of looping one by one. The PBI slicer accepts multiple values in a single `setSlicerState` call, and `exportData` returns all matching rows.

## Prerequisites

- Playwright MCP browser tools must be available — use **only** `vijaynirmal.playwright-mcp-relay/*` tools (NOT VS Code `browser/*` tools)
- User may need to authenticate via AAD/MFA on first navigation — the browser will be visible

## ⚠️ Tool Selection Rule

All `browser_*` references below mean the **Playwright MCP relay** tools (`vijaynirmal.playwright-mcp-relay/browser_navigate`, `vijaynirmal.playwright-mcp-relay/browser_evaluate`, `vijaynirmal.playwright-mcp-relay/browser_snapshot`, etc.). **Never** use VS Code's integrated browser tools (`browser/openBrowserPage`, `browser/navigatePage`, `browser/readPage`). The VS Code Simple Browser does not support MSXI 2.0 or PBI Embedded JS API.

## Extraction Workflow

### Step 1 — Navigate to MSXI Report

```
browser_navigate: https://aka.ms/ghinsights
```

Wait for page load. If redirected to a login page, **tell the user** to complete authentication in the browser window. Then re-navigate after auth completes.

### Step 2 — Wait for PBI Embed to Load

```javascript
browser_evaluate:
  // Check if PBI embed is ready
  !!window.powerbi?.embeds?.length
```

If `false`, wait a few seconds and retry (the report takes time to render). Use `browser_snapshot` to check visual state if needed.

### Step 3 — Navigate to "Acc. View" Page and Set TPID Filter

The report defaults to "Exec. View" which does NOT have the TPID slicer. You must switch to "Acc. View" first.

```javascript
browser_evaluate:
  (async () => {
    const embed = window.powerbi.embeds[0];
    const pages = await embed.getPages();
    const accView = pages.find(p => p.displayName === 'Acc. View');
    if (!accView) return { error: 'Acc. View page not found', pages: pages.map(p => p.displayName) };
    await accView.setActive();
    await new Promise(r => setTimeout(r, 5000));
    const visuals = await accView.getVisuals();

    const slicer = visuals.find(v => v.title === 'TPID');
    if (!slicer) return { error: 'TPID slicer not found', visualTitles: visuals.map(v => v.title).filter(Boolean) };

    await slicer.setSlicerState({
      filters: [{
        $schema: 'http://powerbi.com/product/schema#basic',
        target: { table: 'Dim_Account', column: 'TPID_Text' },
        operator: 'In',
        values: ['<TPID1>', '<TPID2>', ...],  // ALL TPIDs at once
        filterType: 1
      }]
    });

    return { success: true };
  })()
```

Replace `['<TPID1>', '<TPID2>', ...]` with the actual TPID strings. For template-based runs, read all TPIDs from column B of the template file.

### Step 4 — Wait and Export Account Stack Table

Combine the wait and export into a single `browser_evaluate` call to avoid extra round-trips:

```javascript
browser_evaluate:
  (async () => {
    await new Promise(r => setTimeout(r, 6000));

    const embed = window.powerbi.embeds[0];
    const pages = await embed.getPages();
    const activePage = pages.find(p => p.isActive) || pages[0];
    const visuals = await activePage.getVisuals();

    const stackTable = visuals.find(v =>
      v.title && v.title.toLowerCase().includes('account stack')
    );
    if (!stackTable) return {
      error: 'Account Stack Table not found',
      visualTitles: visuals.map(v => ({ title: v.title, type: v.type })).filter(v => v.title)
    };

    const result = await stackTable.exportData(0);
    return { csv: result.data };
  })()
```

The returned `csv` string is the Account Stack Table data (~48 columns).

**CSV escape format**: The `csv` value in the JSON result uses literal `\r\n` (4-char escape sequences, not actual newlines) as row delimiters and `\"` for embedded quotes. When parsing:
```python
csv_raw = csv_raw.replace('\\r\\n', '\n').replace('\\"', '"')
```

### Step 5 — Export Summary Table (Optional)

```javascript
browser_evaluate:
  (async () => {
    const embed = window.powerbi.embeds[0];
    const pages = await embed.getPages();
    const activePage = pages.find(p => p.isActive) || pages[0];
    const visuals = await activePage.getVisuals();

    const summaryTable = visuals.find(v =>
      v.title && v.title.toLowerCase().includes('summary') && !v.title.toLowerCase().includes('account')
    );
    if (!summaryTable) return { error: 'Summary Table not found' };

    const result = await summaryTable.exportData(0);
    return { csv: result.data };
  })()
```

### Step 6 — Save Extracted Data

Call the `save_gh_stack_data` MCP tool with the extracted CSV:

```
save_gh_stack_data({
  tpid: "<TPID>",
  accountStackCsv: "<CSV from Step 4>",
  summaryCsv: "<CSV from Step 5>"  // optional
})
```

This parses the CSV into structured JSON, caches it (memory + file at `~/.msxi/cache/gh-stack/<tpid>.json`), and returns the structured result.

### Step 7 — Generate Weekly Excel Report

**Use `openpyxl` (always available)** — do NOT use pandas or pip install any packages.

**Write one self-contained `.tmp_generate_report.py` script** that does everything in a single run — do not split into multiple scripts or debug iterations:

1. **Parse the exported CSV**: Extract the `csv` value from the browser result JSON. Unescape `\r\n` → newline and `\"` → `"`. Use Python's `csv.DictReader` to parse into rows keyed by TPID.
2. **Read the template**: Open `.docs/Weekly/Template GHCP-Seats-report.xlsx` with `openpyxl.load_workbook()`. Copy to `.docs/Weekly/<YYYY-MM-DD>_GHCP-Seats-report.xlsx`.
3. **Match & populate**: For each template row, match TPID (column B) against parsed CSV. Populate columns E+ by matching template header names to CSV column names. Parse values by type:
   - Dollar columns (`ACR ($)` in name): strip `$` and `,`, store as int
   - Percentage columns (`Attach`, `WAU %`, `WEU %`): strip `%`, divide by 100, store as float
   - Seat/unit columns: strip `,`, store as int
   - Text columns (aliases, MACC, Action): store as string
4. **Formatting**: TPID → `0`, dollars → `$#,##0`, percentages → `0.0%`, ARPU → `#,##0.00`, seats → `#,##0`.
5. **Styling**: Arial 10pt, dark blue headers (`#2F5496`, white text), thin gray borders (`#D9D9D9`). Freeze pane A2, auto-filter, column widths auto-sized (cap 30).
6. **Clean up**: Delete the temp script after successful execution.

The template file is **never modified** — only the weekly copy gets data.

### Step 8 — Present Results

Show the user:
1. A markdown table with all extracted data (as done previously)
2. Confirm the Excel file path

Do NOT ask follow-up questions. If the user wants more, they'll ask.

## Troubleshooting

| Issue | Resolution |
|-------|------------|
| `powerbi.embeds` is empty | Report still loading — wait and retry |
| TPID slicer not found | Page may not be "Acc. View" — check `activePage.displayName` |
| exportData returns empty/null | Filter may not have applied — wait longer, verify slicer state |
| Login redirect | Tell user to authenticate in the visible browser, then re-navigate |
| Browser not available | Playwright MCP tools not configured — user needs to enable them |

## Key Constants

| Item | Value |
|------|-------|
| MSXI Report URL | `https://aka.ms/ghinsights` |
| PBI Report ID | `0d5f46d6-5d27-4f78-82d6-8be082dd6c9b` |
| Slicer Target | `Dim_Account.TPID_Text` |
| Active Page | "Acc. View" |
| Cache Location | `~/.msxi/cache/gh-stack/<tpid>.json` |
| Cache TTL | 30 minutes |
