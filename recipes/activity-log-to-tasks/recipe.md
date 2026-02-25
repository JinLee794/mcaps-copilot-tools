---
name: Activity Log → MSX Tasks
description: Build comprehensive activity table from M365 + MSX sources, then transform to MSX task JSON payload
role: Solution Engineer
tags: [activity-log, tasks, workiq, milestones, m365]
variables_customer: { "required": true, "description": "Customer/account name" }
variables_project: { "required": true, "description": "Project or workload name" }
variables_start_date: { "default": "2025-07-01", "description": "Start date (YYYY-MM-DD)" }
variables_end_date: { "default": "today", "description": "End date (YYYY-MM-DD)" }
variables_milestone_id: { "required": false, "description": "MSX Milestone GUID to bind tasks to" }
---

Generate a complete and comprehensive table that includes every known meeting, email, and Teams chat message related to my work on the {{project}} project with {{customer}} from {{start_date}} through {{end_date}}.

The table should include occurrences of one of these categories:
- Emails
- Teams Chats
- Meetings, including recurring meetings
- Meeting recaps
- MSX Milestones
- Documents

The table fields should include:
- Date
- Category
- Classification
- Description (keep this brief)

For classification, analyze the details already researched and assign a category column aligning with one of the following:
- Technical Close / Win Plan
- Architecture Design Session
- Blocker Escalation
- Consumption Plan
- Demo
- POC/Pilot
- Workshop

Use the table to create a JSON payload.
Translate the data to this schema:

```json
[
  {
    "subject": "SE HoK - POC/Pilot - RM",
    "category": "POC/Pilot",
    "description": "Kickoff meeting with customer to launch the PoC.",
    "scheduledend": "2025-09-05",
    "actualdurationminutes": "60",
    "statuscode": 3,
    "regardingobjectid_msp_engagementmilestone_task@odata.bind": "/msp_engagementmilestones(MILESTONE_ID)"
  }
]
```

Match that data according to the list below:
- **subject**: Use the format `SE HoK - ` + Classification + ` - RM`
- **category**: Use classification
- **description**: Create a one sentence description
- **scheduledend**: Use date
- **regardingobjectid_msp_engagementmilestone_task@odata.bind**: `/msp_engagementmilestones({{milestone_id}})` if milestone is available
- **actualdurationminutes**: 60
- **statuscode**: 3

If context files are attached below, use them as additional evidence when building the activity table.
