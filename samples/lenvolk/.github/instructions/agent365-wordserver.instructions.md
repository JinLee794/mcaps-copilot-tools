---
description: >-
  agent365-wordserver MCP guidance — Word document reading, creation, and comment collaboration.
  Use when resolving document links found in email bodies or Teams messages, retrieving document
  content for summarization, creating new Word documents, or reading existing ones for strategic analysis.
  Loaded by StratTechSalesOrch (document creation + reading), EmailTracker and TeamsTracker
  (cross-link resolution workflows).
applyTo: .github/agents/**
---

# agent365-wordserver — Word Document MCP Server

The `agent365-wordserver` MCP server enables reading and understanding documents, creating new ones, and collaborating through comments.

## Available Tools

| Tool | Purpose |
|---|---|
| `GetDocumentContent` | Retrieve the text content of a Word document by URL or identifier |
| `CreateDocument` | Create a new Word document |
| `AddComment` | Add a comment to a document |
| `ReplyToComment` | Reply to an existing comment |

## Agent Usage

### StratTechSalesOrch — Document Creation + Reading

StratTechSalesOrch uses this MCP server for:
- **Reading**: `GetDocumentContent` to retrieve Word document content from SharePoint/OneDrive links encountered during strategic analysis
- **Creation**: `CreateDocument` for generating `.docx` deliverables (strategic reports, executive briefings, account reviews) — **ONLY when the user explicitly requests a Word document**

For full `.docx` creation with rich formatting (TOC, headers, tables, page numbers), StratTechSalesOrch uses the `docx` skill (`.github/skills/docx/SKILL.md`) which generates documents via `docx-js` locally. The `agent365-wordserver` `CreateDocument` tool is available as an alternative for simpler documents.

**Document storage convention:**
- Account-specific: `.docs/_data/<Account>/Documents/<Type>_<YYYY-MM-DD>.docx`
- Portfolio/TMG-level: `.docs/Documents/<Type>_<YYYY-MM-DD>.docx`

### EmailTracker & TeamsTracker — Cross-Link Resolution

Subagents (EmailTracker, TeamsTracker) use **only `GetDocumentContent`** from this server. The other tools are available but not part of standard tracking workflows.

### When to Invoke

- An email body contains a link to a Word document (`.docx`, SharePoint document library URL, OneDrive link)
- A Teams message contains a link to a Word document
- The orchestrator's delegation prompt explicitly requests document content retrieval

### What It Returns

The full text content of the referenced Word document, suitable for summarization and excerpt inclusion in reports.

### How to Incorporate

1. Detect document links in message bodies (URLs containing `.docx`, `/sites/`, `/personal/`, OneDrive paths)
2. Call `GetDocumentContent` with the document URL or identifier
3. Include a brief relevant excerpt (not the full document) inline with the message in the report
4. Label the excerpt clearly: `📄 Document: [filename] — [excerpt]`

### Limitations

- Only Word documents are supported — PDFs, Excel files, and other formats are not handled by this server
- Large documents may return truncated content — summarize rather than include verbatim
- Requires the user to have read access to the document via Microsoft Entra ID
