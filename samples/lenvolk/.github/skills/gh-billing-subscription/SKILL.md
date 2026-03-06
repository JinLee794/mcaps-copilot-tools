---
name: gh-billing-subscription
description: >-
  Extract Azure subscription IDs where GitHub is billing for a customer account
  from the Power BI General Adoption Health report using Playwright MCP browser tools.
  Handles PBI Service navigation, AAD auth/MFA prompts, TPID slicer input, and
  table data extraction. Use when user asks for Azure subscription ID for GitHub
  billing, which subscription GitHub bills under, GitHub billing subscription,
  adoption health subscription data, or any request linking a customer/TPID to
  an Azure subscription used for GitHub billing. Also use when AccountTracker
  agent needs subscription context for an account.
argument-hint: Provide the customer name or TPID to look up
---

# GitHub Billing Subscription Lookup

Extract Azure subscription IDs (where GitHub bills) from the Power BI **General Adoption Health** report using Playwright MCP browser tools.

**Execution rule**: Do not deliberate — go straight to Step 0. No planning preamble needed.

## When to Use

- User asks "which subscription is GitHub billing under for [customer]?"
- User asks for Azure subscription ID linked to GitHub billing for an account
- Any workflow needing to map a TPID/customer to the Azure subscription backing GitHub services
- AccountTracker needs subscription context for an account response

## Critical: PBI Service vs PBI Embedded

**This report runs on PBI Service (msit.powerbi.com), NOT PBI Embedded (msxinsights.microsoft.com).**

- `window.powerbi.embeds` exists but is **empty** — no JS API access.
- There are **no iframes** — the report renders directly in the page DOM.
- **Never use `browser_evaluate`** for data extraction on this report. It will not work.
- **Always use `browser_snapshot`** to read table data from the accessibility tree.

This is the opposite of the MSXI/gh-stack-browser-extraction skill, which uses PBI Embedded and has full JS API access.

## Step 0 — Resolve TPID and Check Cached Data

**Always start here.**

1. If the user provides a customer name (not a TPID), read `.docs/AccountReference.md` to resolve the customer name → TPID and account folder name.
2. **Read `.docs/_data/<Account>/state.md`** and look for an existing `## GitHub Billing Subscription` section.
3. If a subscription ID is present and was updated within the last 30 days, return it directly — **no browser extraction needed.**
4. If stale or missing, proceed to browser extraction below.

## Prerequisites

- Playwright MCP browser tools must be available — use **only** `vijaynirmal.playwright-mcp-relay/*` tools (NOT VS Code `browser/*` tools)
- User may need to authenticate via AAD/MFA on first navigation — the browser will be visible
- **Do NOT use `vijaynirmal.playwright-mcp-relay/browser_evaluate`** — PBI Service does not expose the PBI JS API
- **Do NOT use VS Code browser tools** (`browser/openBrowserPage`, `browser/navigatePage`, etc.) — the Simple Browser does not support PBI Service

## ⚠️ Tool Selection Rule

All `browser_*` references below mean the **Playwright MCP relay** tools (`vijaynirmal.playwright-mcp-relay/browser_navigate`, `vijaynirmal.playwright-mcp-relay/browser_snapshot`, `vijaynirmal.playwright-mcp-relay/browser_click`, etc.). **Never** use VS Code's integrated browser tools.

## Extraction Workflow

### Step 1 — Navigate to the PBI Report

```
browser_navigate: https://msit.powerbi.com/groups/me/apps/29c3b678-9447-409c-95a5-1304207942e1/reports/08acbcee-0bd4-426c-8d0b-1687294754f8/d1d3bef5d92016a3400e?ctid=72f988bf-86f1-41af-91ab-2d7cd011db47&experience=power-bi
```

Wait for page load. If redirected to a login page, **tell the user** to complete authentication in the browser window. Then re-navigate after auth completes.

### Step 2 — Handle Authentication

If redirected to a login/"Pick an account" page, click the user's `@microsoft.com` account button:
```
browser_click: [ref for "Sign in with <user>@microsoft.com" button]
```
Wait for Power BI to load after auth. If MFA is required, tell the user to complete it in the browser.

### Step 3 — Wait for Report and Click "Fit to Page"

The direct URL opens the General Adoption Health page automatically — **no need to navigate to a separate tab**. The nav sidebar will show "General Adoption Health" as the active/expanded section.

The report initially loads at a very small zoom level (e.g. 14%). **Immediately click "Fit to page"** to ensure all visuals render fully:
```
browser_click: [ref for "Fit to page" button — found at bottom of the page]
```

This triggers a re-render and the returned snapshot will contain the full report data.

### Step 4 — Enter TPID in the Slicer (if not already filtered)

Check the snapshot for the data table. If it already shows rows with the target TPID (e.g. from a previous session), skip to Step 5.

If the table shows all accounts (thousands of rows starting with "0088", "01c", etc.), locate the TPID slicer/filter. In the snapshot, look for a filter panel on the right side or a slicer visual labeled "TPID".

1. Click the TPID slicer input field
2. Type the TPID value
3. If a dropdown appears, click the matching entry
4. Wait 3–5 seconds for the report to refresh

### Step 5 — Extract Subscription Data from Snapshot

The snapshot's accessibility tree contains the full table data. Look for a grid with these column headers:

| Column | Description |
|--------|-------------|
| Row Selection | Checkbox (ignore) |
| TPID | The Top Parent ID |
| MS Account Name | Microsoft CRM account name |
| Salesforce Account ID | Salesforce record ID |
| Salesforce Account Name | Customer name in Salesforce |
| Enterprise Account Name | GitHub Enterprise org/account name |
| **Azure Subscription ID** | The billing subscription GUID |

In the snapshot YAML, each row appears as:
```yaml
- row "Select Row <TPID> <MS Account Name> <SalesforceID> <SF Name> <Enterprise Name> <SubscriptionGUID>":
    - gridcell "Select Row"
    - gridcell "<TPID>" [ref=...]
    - gridcell "<MS Account Name>" [ref=...]
    - gridcell "<SalesforceID>" [ref=...]
    - gridcell "<SF Name>" [ref=...]
    - gridcell "<Enterprise Name>" [ref=...]
    - gridcell "<SubscriptionGUID>" [ref=...]
```

**Important**: A single TPID can have **multiple rows** with **different Azure Subscription IDs** (one per Salesforce account / GitHub Enterprise org). Extract ALL rows for the TPID.

Example — Disney (TPID 642283) has 3 rows:
- Pixar → `7817dbd6-f416-4ba2-b09d-e14785593ff7`
- Disney Media & Entertainment (twdc) → `40e80bc1-6fe8-4c05-928f-3c66bff901db`
- The Walt Disney Company (twdc-non-ghe) → `40e80bc1-6fe8-4c05-928f-3c66bff901db`

### Step 6 — Parse and Return Results

Present ALL subscription rows for the TPID in a table:

```
**GitHub Billing Subscriptions for [MS Account Name] (TPID: [TPID])**

| Salesforce Account | Enterprise Org | Azure Subscription ID |
|---|---|---|
| [SF Name 1] | [Enterprise Name 1] | `<subscription-guid-1>` |
| [SF Name 2] | [Enterprise Name 2] | `<subscription-guid-2>` |

*Extracted: YYYY-MM-DD*
```

Deduplicate subscription GUIDs and highlight if multiple orgs share the same subscription.

### Step 7 — Cache the Result

Persist the subscription data so future lookups don't require browser extraction:

1. **Update `.docs/_data/<Account>/state.md`** — append or update the `## GitHub Billing Subscription` section:
   ```markdown
   ## GitHub Billing Subscription
   | Salesforce Account | Enterprise Org | Azure Subscription ID |
   |---|---|---|
   | Pixar | pixar | `7817dbd6-f416-4ba2-b09d-e14785593ff7` |
   | Disney Media & Entertainment Distribution | twdc | `40e80bc1-6fe8-4c05-928f-3c66bff901db` |
   - **Last Verified**: YYYY-MM-DD
   ```
   Store ALL rows — accounts can have multiple subscriptions.
2. If the account folder doesn't exist in `_data/`, store in `vscode/memory` (`/memories/session/`) as a note with the TPID, account name, subscription IDs, and extraction date.

## Troubleshooting

| Issue | Resolution |
|-------|------------|
| Report doesn't load / spinning | Wait up to 15s, then re-navigate. Click "Fit to page" after load. |
| Pick-an-account page | Click the `@microsoft.com` account. If MFA required, tell user to complete it. |
| Report at tiny zoom (12-14%) | Click "Fit to page" button at bottom-right of the report area. |
| Table data not in snapshot | Click "Fit to page" first — visuals only render in snapshot at proper zoom. |
| TPID slicer not found | The slicer may be on the right side panel. Look for filter/slicer refs in snapshot. |
| No subscription rows for TPID | Account may not have an Azure billing subscription — report this to the user. |
| `browser_evaluate` returns empty/no embeds | **Expected.** PBI Service does not expose the PBI JS API. Never use `browser_evaluate` on this report. Use `browser_snapshot` only. |
| Tried iframe scanning, found 0 iframes | **Expected.** PBI Service renders inline, no iframes. Use `browser_snapshot`. |

## Key Constants

| Item | Value |
|------|-------|
| PBI Report URL | `https://msit.powerbi.com/groups/me/apps/29c3b678-9447-409c-95a5-1304207942e1/reports/08acbcee-0bd4-426c-8d0b-1687294754f8/d1d3bef5d92016a3400e?ctid=72f988bf-86f1-41af-91ab-2d7cd011db47&experience=power-bi` |
| Target Page | "General Adoption Health" |
| Target Data | Azure Subscription ID (GUID) — may be multiple per TPID |
| Extraction Method | `browser_snapshot` only — **never** `browser_evaluate` (PBI Service has no JS API) |
| Report Rendering | Inline DOM (no iframes, no PBI Embedded) |
| Table Columns | Row Selection, TPID, MS Account Name, Salesforce Account ID, Salesforce Account Name, Enterprise Account Name, Azure Subscription ID |
| Per-Account Cache | `.docs/_data/<Account>/state.md` → `## GitHub Billing Subscription` — **check first** before any browser extraction |
| Cache Fallback | `vscode/memory` session scope |
