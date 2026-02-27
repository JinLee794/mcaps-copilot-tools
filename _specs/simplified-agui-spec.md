# Copilot-Style Electron UI (Reset Spec)

## 1) Layout Wireframe (Clean + Minimal)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Copilot Chat                                     🟢 Copilot  🔵 Azure [↻] │
│                                                   [Run az login] [Settings]│
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                             Conversation Stream                            │
│         (assistant output + AG-UI cards rendered inline as results)       │
│                                                                            │
│                     ┌───────────────────────────────────┐                  │
│                     │ Ask Copilot CLI anything...      │                  │
│                     └───────────────────────────────────┘                  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ Obsidian Notes ▸ (collapsed titles)                                        │
└────────────────────────────────────────────────────────────────────────────┘
```

### UX Direction
- Single centered prompt box (Copilot CLI-like focus).
- Toolbar holds status + quick actions (not inside chat body).
- Main canvas prioritizes streamed response readability.

## 2) AG-UI Result Components

### Milestone Result Row (reactive list row)
Render each milestone as a compact row with:
- Milestone number/name
- Status badge
- Due date
- Owner
- Commitment/monthly use (if present)
- Actions: `Update Task`, `Edit Milestone`, `View Tasks`

### Opportunity Card (rich, dedicated card)
Render each opportunity in a larger card with sections:
- Header: name, stage/state, owner
- Timeline: estimated close + completion dates
- Value: recurring consumption + key forecast fields
- Linked milestones summary
- Actions: `Open Milestones`, `Edit Opportunity`, `Refresh`

### Person Card (pre-rendered contact card)
Render person results with:
- Full name + title
- Email
- Org/company
- Associated customer(s) if available
- Actions: `Copy Contact`, `Open Related Records`

## 3) Obsidian Notes Sidebar

### Default State
- Collapsed strip showing note titles only.

### Expanded State
- Selecting a title opens a right-side panel.
- Panel shows markdown-rendered note content.
- Keep markdown read-only with scroll and close control.

## 4) Interaction Notes

- Streaming text and AG-UI components can appear in the same response thread.
- Component actions trigger existing tool workflows (no inline direct writes without confirmation flow).
- `Run az login` is always available in toolbar for credential refresh.
