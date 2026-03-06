---
description: "Create a new People note from context in a meeting note or conversation."
---

# Create Person

Add a contact to `.docs/_data/<Account>/contacts.md`. Given a name and any available context (meeting notes, conversation, user input), produce a complete entry.

## Workflow

### Step 1 — Resolve Account & Check Duplicates

- Use `list_dir` on `.docs/_data/` to match the person's account to an existing customer folder.
- Read `.docs/_data/<Account>/contacts.md` to check for an existing entry with this person's name or email.
- Read `.docs/AccountReference.md` for TPID, SSP, GH AE context.
- If the person already exists in contacts.md, report the duplicate and stop.

### Step 2 — Fill Gaps (via MicrosoftResearcher)

If title, company, email, or role context is missing from user input, delegate to **MicrosoftResearcher** subagent:
- "Look up {person name}. Return: job title, team, manager, email, and location. Execute fully autonomously. Do not prompt the user."
- Extract: job title, company, email, org type (internal/customer/partner), and customer associations.
- If MicrosoftResearcher returns nothing (person is external/customer), leave fields empty rather than guessing.

### Step 3 — Write the Entry

Use `replace_string_in_file` to add the person to `.docs/_data/<Account>/contacts.md` under the appropriate section (Customer Contacts or Microsoft / GitHub Team).

### Step 4 — Cross-link

If the person was first mentioned in a meeting note, update that meeting's Attendees section if missing.

## Frontmatter Schema

```yaml
tags:
  - people
aliases: []
email:        # Work email if known
title:        # Job title
company:      # Organization name
customers:    # Array — must match _data/ folder names
  - CustomerA
org:          # internal | customer | partner
linkedin:     # URL or empty
```

## Body Template

```markdown
# {Full Name}

## Contact
- **Title:** {job title}
- **Company:** {company}
- **Email:** {email}
- **Org:** {internal/customer/partner}

## Notes
- {Context: how you met, what they work on, areas of expertise}
- First mentioned in: [[{meeting note where they appeared}]]
```

## Input

{user provides name and any available context}
