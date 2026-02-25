---
name: Weekly Milestone Hygiene
description: Check milestone status and surface overdue/at-risk items
role: Solution Engineer
tags: [milestones, hygiene, weekly]
variables_customer: { "required": false, "description": "Optional customer name to scope" }
---

Review all milestones I own and produce a status report. For each milestone:

1. Check if the milestone date is overdue or coming up within 14 days
2. Check if there are any tasks with status "Not Started" that should be in progress
3. Flag any milestones with no tasks at all as needing attention
4. Show consumption vs. forecast variance where available

{{customer}}

Format the output as a markdown table with columns: Milestone Name | Status | Date | Tasks | Risk Level | Notes

Highlight anything that needs immediate action.
