---
description: "Structure raw meeting notes, transcripts, or screenshots into a formatted meeting note with frontmatter, action items, and links. Updates related .docs/ notes."
---

# Process Meeting Notes

Structure raw meeting input (transcript, pasted notes, screenshot text, or Copilot recap) into a complete meeting note and update related `.docs/` notes.

## Workflow

### Step 1 — Resolve References

Before processing content, resolve names against `.docs/`:
- `list_dir` on `.docs/_data/` → match any mentioned customer to an account folder.
- Read `.docs/_data/<Account>/contacts.md` → identify which attendees already have entries.
- Read `.docs/AccountReference.md` for TPID, SSP, GH AE context.
- Read `.docs/_data/<Account>/state.md` for tranche classification.

### Step 2 — Extract & Structure

From the raw input, extract:
- **Date** → `date` frontmatter field (YYYY-MM-DD)
- **Customer** → match to `Customers/` filename for `customer` field
- **Project** → match to `Customers/<Account>/` project files for `project` field
- **Summary** → one sentence capturing the core outcome
- **Attendees** → `[[wiki-links]]` to People notes
- **Action items** → checkboxes with `([[Owner]])` attribution
- **Key decisions** → bullet list with rationale
- **Technologies** → Azure services, frameworks, tools mentioned

### Step 3 — Write the Meeting Note

Use `create_file` to save to `.docs/_data/<Account_Name>/<YYYY-MM-DD> - <Meeting Title>.md`.

### Step 4 — Enrich with M365 Context (via subagents, parallel)

If the meeting involved a tracked customer or project, delegate to subagents in **parallel**:

**CalendarTracker** — meeting transcript/recording:
- "Find the transcript or Copilot recap for the meeting on {date} with {attendees or customer}. Extract any action items, decisions, or follow-ups not captured in the raw notes. Account: {account}, TPID: {TPID}, Tranche: {tranche}. Execute fully autonomously. Do not prompt the user."

**EmailTracker** — related email threads:
- "Find email threads about {topic/customer} from the past 7 days that provide context for decisions made in this meeting. Use ALL contacts from contacts.md: {contacts list}. Execute fully autonomously. Do not prompt the user."

**TeamsTracker** — related Teams threads:
- "Find Teams messages about {topic/customer} from the past 7 days that provide context for this meeting. Use chat thread IDs from teams-threads.md. Execute fully autonomously. Do not prompt the user."

**What to enrich:**
- Fill in action items or decisions that were in the transcript but missing from raw notes.
- Add context for decisions by referencing prior email/chat threads.
- Flag any commitments made in the meeting that contradict or update prior email/chat agreements.

### Step 5 — Update Related Notes

After writing the meeting note:
1. **Customer file**: If a tracked customer was discussed, use `replace_string_in_file` to append a brief entry under a dated section on `.docs/_data/<Account>/insights.md` with the meeting date and key takeaways.
2. **New contacts**: List any attendees without a `.docs/_data/<Account>/contacts.md` entry. Offer to add them to contacts.md (Customer Contacts or Microsoft / GitHub Team section).
3. **Action items**: If action items reference a project, append them to the relevant section in `.docs/_data/<Account>/insights.md`.

## Frontmatter Schema

```yaml
tags:
  - meeting
date: YYYY-MM-DD
customer:        # Matches Customers/ filename — empty if internal-only
project:         # Matches Projects/ filename — empty if N/A
summary:         # One sentence
status: open     # open if unresolved action items, closed otherwise
action_owners:   # Array of people with action items
  - Person Name
```

## Body Template

```markdown
# {Meeting Title}

**Date:** [[{YYYY-MM-DD}]]
**Customer:** [[{Customer}]]
**Project:** [[{Project}]]

## Attendees

- [[Person 1]] — {role/company}
- [[Person 2]]

## Agenda

- {topic 1}
- {topic 2}

## Notes

**{Topic 1}**
- Key point
- Key point
- *Technologies:* {Azure services, frameworks}

**{Topic 2}**
- Key point

## Action Items

- [ ] {Action} ([[{Owner}]])
- [ ] {Action} ([[{Owner}]])

## Key Decisions

- {Decision 1}: {rationale}
- {Decision 2}
```

## New Contacts Detected

If attendees don't have an entry in `.docs/_data/<Account>/contacts.md`, list them:

```
> **New contacts to add to contacts.md:**
> - {Name} — {Title}, {Company} → {Customer Contacts / Microsoft / GitHub Team}
```

## Input

{user provides raw notes, transcript, or screenshot text}
