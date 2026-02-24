# Staged Operations — Human-in-the-Loop Write Flow

## Problem

CRM is sensitive production data. Users need to update milestones, tasks, and other records as part of their daily workflow, but accidental or incorrect writes could be costly. We need a pattern that is **easy to use** while ensuring **every write is explicitly approved**.

## Solution: Stage → Review → Execute

Write tools don't touch CRM immediately. Instead they **validate + stage** the change, return a preview, and wait for the user to approve before executing.

```
User  →  "update milestone 7-503362186 date to 2026-04-15"
  ↓
AI calls update_milestone  →  stages the change, returns preview
  ↓
User sees:  "Staged OP-1: update msp_milestonedate 2026-03-20 → 2026-04-15"
  ↓
User  →  "looks good, execute it"   (or "cancel that")
  ↓
AI calls execute_operation(id: "OP-1")  →  PATCH sent to CRM
```

## Sequence Diagram — Single Operation

```mermaid
sequenceDiagram
    participant User
    participant AI as AI Agent (Copilot)
    participant MCP as MCP Server
    participant Store as Pending Ops Store
    participant CRM as Dynamics 365

    Note over User,CRM: 1. User requests a write operation

    User->>AI: "Update milestone 7-503362186 date to 2026-04-15"
    AI->>MCP: update_milestone(milestoneId, milestoneDate)
    MCP->>CRM: GET current record (before-state)
    CRM-->>MCP: { msp_milestonedate: "2026-03-20", ... }
    MCP->>Store: Stage OP-1 with payload + before-state
    MCP-->>AI: { staged: true, id: "OP-1",<br/>before: "2026-03-20", after: "2026-04-15" }
    AI-->>User: "Staged OP-1: date 2026-03-20 → 2026-04-15.<br/>Say 'execute' to apply or 'cancel' to discard."

    Note over User,CRM: 2. User reviews and approves

    alt User approves
        User->>AI: "looks good, execute it"
        AI->>MCP: execute_operation(id: "OP-1")
        MCP->>Store: Retrieve & remove OP-1
        MCP->>CRM: PATCH msp_engagementmilestones(guid)<br/>{ msp_milestonedate: "2026-04-15" }
        CRM-->>MCP: 204 No Content
        MCP-->>AI: { success: true, executed: "OP-1" }
        AI-->>User: "Done! Milestone date updated to 2026-04-15."
    else User cancels
        User->>AI: "cancel that"
        AI->>MCP: cancel_operation(id: "OP-1")
        MCP->>Store: Remove OP-1
        MCP-->>AI: { cancelled: "OP-1" }
        AI-->>User: "Cancelled. No changes made."
    end
```

## Sequence Diagram — Batch Operations

```mermaid
sequenceDiagram
    participant User
    participant AI as AI Agent
    participant MCP as MCP Server
    participant Store as Pending Ops Store
    participant CRM as Dynamics 365

    Note over User,CRM: Batch: stage multiple, review once, execute all

    User->>AI: "Push all my Q1 milestones to April 15"

    loop For each matching milestone
        AI->>MCP: update_milestone(id, date)
        MCP->>Store: Stage OP-N
        MCP-->>AI: { staged: true, id: "OP-N" }
    end

    AI-->>User: "Staged 3 operations:<br/>OP-1: AI Gateway → 2026-04-15<br/>OP-2: AI Foundry Eval → 2026-04-15<br/>OP-3: Voice Live API → 2026-04-15"

    User->>AI: "execute all"
    AI->>MCP: execute_all()

    loop For each pending op
        MCP->>CRM: PATCH ...
        CRM-->>MCP: 204
    end

    MCP-->>AI: { executed: 3, failed: 0 }
    AI-->>User: "All 3 milestones updated."
```

## Architecture

### Pending Operations Store

In-memory `Map` scoped to the MCP server process lifetime. Operations expire after a configurable TTL (default: 10 minutes).

```
pendingOps: Map<string, {
  id:          string       // "OP-1", "OP-2", ...
  type:        string       // "update_milestone", "create_task", etc.
  path:        string       // CRM entity path for the request
  method:      string       // "POST" | "PATCH"
  payload:     object       // Request body to send
  beforeState: object|null  // Snapshot of current record (for diff preview)
  description: string       // Human-readable summary
  stagedAt:    string       // ISO timestamp
}>
```

### New MCP Tools

| Tool | Purpose |
|------|---------|
| `list_pending_operations` | Show all staged changes awaiting approval |
| `execute_operation` | Execute a single staged operation by ID |
| `execute_all` | Execute all pending operations in sequence |
| `cancel_operation` | Discard a staged operation by ID |
| `cancel_all` | Discard all pending operations |

### Modified Write Tools

Existing write tools (`create_task`, `update_task`, `close_task`, `update_milestone`) change behavior:

1. **Validate** inputs (same as today)
2. **Fetch before-state** from CRM (GET the current record)
3. **Stage** the operation in the pending store
4. **Return preview** with before → after diff and the operation ID

No CRM writes happen until `execute_operation` or `execute_all` is called.

## Why This Works for MCP

| Concern | How it's addressed |
|---------|-------------------|
| Accidental writes | Nothing writes until `execute_operation` is called |
| Human-in-the-loop | AI shows the staged preview; user says "go" or "cancel" |
| Batch updates | User stages multiple changes, reviews all, executes in one shot |
| Audit trail | Easy to add logging in `execute_operation` |
| Day-to-day ease | Natural conversation flow — no extra forms or UI |
| Undo window | Staged ops sit until reviewed; `cancel_operation` discards |
| Stale writes | TTL expiry auto-discards operations after 10 minutes |

## Future Enhancements

- **Before-state diff**: Show old → new values in the preview for every field
- **Audit log**: Persist executed operations to a local file for traceability
- **Undo**: After `execute_operation`, store the before-state so a follow-up "undo" can revert
- **Configurable TTL**: Allow users to set expiry via environment variable
