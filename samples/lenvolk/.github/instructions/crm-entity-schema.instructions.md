---
description: "CRM entity schema reference for Dynamics 365 OData queries. Use when constructing crm_query, crm_get_record, or any OData filter/select expressions to avoid property name guessing."
applyTo: "mcp-server/**"
---
# CRM Entity Schema Reference

Use this reference when constructing `crm_query` calls against Dynamics 365 entities.
Incorrect entity set names or field names will return 404 or 400 errors.

## Rules
- **Never guess property names.** Use only the property names listed in this document.
- If a needed property is not listed here, ask the user or check Dynamics 365 metadata documentation before querying.
- Lookup/reference fields always use the pattern `_<fieldname>_value` (e.g. `_ownerid_value`, `_parentaccountid_value`).
- Entity set names are **plural** (e.g. `accounts`, `opportunities`). Entity logical names for metadata are **singular** (e.g. `account`, `opportunity`).

## Common Entities

### accounts (logical name: account)
| Property | Type | Description |
|---|---|---|
| accountid | Uniqueidentifier | Primary key |
| name | String | Account name |
| msp_mstopparentid | String | MS Top Parent ID (TPID) — **NOT** `msp_accounttpid` |
| _ownerid_value | Lookup | Owner system user |
| _parentaccountid_value | Lookup | Parent account |

### opportunities (logical name: opportunity)
| Property | Type | Description |
|---|---|---|
| opportunityid | Uniqueidentifier | Primary key |
| name | String | Opportunity name |
| estimatedclosedate | DateTime | Estimated close date |
| msp_estcompletiondate | DateTime | Estimated completion date |
| msp_consumptionconsumedrecurring | Decimal | Consumed recurring consumption |
| _ownerid_value | Lookup | Owner system user |
| _parentaccountid_value | Lookup | Parent account |
| msp_salesplay | Picklist | Sales play / solution area |
| statecode | State | Record state (0 = Open) |

### msp_engagementmilestones (logical name: msp_engagementmilestone)
| Property | Type | Description |
|---|---|---|
| msp_engagementmilestoneid | Uniqueidentifier | Primary key |
| msp_milestonenumber | String | Milestone number (e.g. "7-123456789") |
| msp_name | String | Milestone name |
| _msp_workloadlkid_value | Lookup | Workload |
| msp_commitmentrecommendation | Picklist | Commitment recommendation |
| msp_milestonecategory | Picklist | Milestone category |
| msp_monthlyuse | Decimal | Monthly use value |
| msp_milestonedate | DateTime | Milestone date |
| msp_milestonestatus | Picklist | Milestone status |
| _ownerid_value | Lookup | Owner system user |
| _msp_opportunityid_value | Lookup | Parent opportunity |
| msp_forecastcomments | String | Forecast comments |
| msp_forecastcommentsjsonfield | String | Forecast comments (JSON) |
| msp_deliveryspecifiedfield | Picklist | Delivered By (606820000=Customer, 606820001=Partner, 606820002=ISD, 606820003=Microsoft Support) |

### tasks (logical name: task)
| Property | Type | Description |
|---|---|---|
| activityid | Uniqueidentifier | Primary key |
| subject | String | Task subject/title |
| description | String | Task description |
| scheduledend | DateTime | Due date |
| statuscode | Status | Status code (5=Completed, 6=Cancelled) |
| statecode | State | Record state |
| _ownerid_value | Lookup | Owner system user |
| _regardingobjectid_value | Lookup | Regarding record |
| msp_taskcategory | Picklist | Task category |
| createdon | DateTime | Created timestamp |

### contacts (logical name: contact)
| Property | Type | Description |
|---|---|---|
| contactid | Uniqueidentifier | Primary key |
| fullname | String | Full name |
| emailaddress1 | String | Primary email address |
| jobtitle | String | Job title |
| accountrolecode | Picklist | Job role (formatted value gives display name) |
| _parentcustomerid_value | Lookup | Parent account (account the contact belongs to) |
| telephone1 | String | Business phone |

### systemusers (logical name: systemuser)
| Property | Type | Description |
|---|---|---|
| systemuserid | Uniqueidentifier | Primary key |
| fullname | String | Full name |
| internalemailaddress | String | Email address |
| title | String | Job title |
| businessunitid | Lookup | Business unit |

### connections (logical name: connection)
Used for deal team / sales team membership on opportunities. The `manage_deal_team` MCP tool wraps this entity.
| Property | Type | Description |
|---|---|---|
| connectionid | Uniqueidentifier | Primary key |
| _record1id_value | Lookup | Record 1 (typically the opportunity) |
| _record2id_value | Lookup | Record 2 (typically the systemuser being added) |
| _record2roleid_value | Lookup | Connection role for record 2 (e.g. Delivery Professional) |
| description | String | Description / display name |
| record1id_opportunity | Navigation | Navigation property when record1 is an opportunity |
| record2id_systemuser | Navigation | Navigation property when record2 is a systemuser |

#### Creating a connection (deal team add)
```json
{
  "record1id_opportunity@odata.bind": "/opportunities(<OPP_GUID>)",
  "record2id_systemuser@odata.bind": "/systemusers(<USER_GUID>)",
  "record2roleid@odata.bind": "/connectionroles(<ROLE_GUID>)"
}
```

### connectionroles (logical name: connectionrole)
| Property | Type | Description |
|---|---|---|
| connectionroleid | Uniqueidentifier | Primary key |
| name | String | Role name (e.g. "Delivery Professional", "Sales Team Member") |

## Milestone Naming Convention

All milestones **must** follow this naming format:

```
<Company Name> | FY26 | GitHub Copilot Expansion
```

**Rules:**
- **Company Name**: Use the CRM account name (e.g., `COMCAST`, `AT&T`, `NIELSEN CONSUMER LLC`). Apply display name overrides if they exist (e.g., use `NIQ` instead of `NIELSEN CONSUMER LLC`).
- **Fiscal Year**: Use the current fiscal year (e.g., `FY26`).
- **Description**: Concise description of the milestone purpose (e.g., `GitHub Copilot Expansion`, `GHAS Adoption`, `GHE Migration`).
- Pipe separators (`|`) with spaces on both sides.

**Examples:**
- ✅ `COMCAST | FY26 | GitHub Copilot Expansion`
- ✅ `AT&T | FY26 | GitHub Copilot Expansion`
- ✅ `NIQ | FY26 | GitHub Copilot Expansion`
- ❌ `$1k/Mo` — no company name, no fiscal year, not descriptive
- ❌ `GitHub Copilot` — missing company name and fiscal year

When renaming milestones, use `update_milestone` with the `name` field set to the corrected format.

## Known Invalid Entity Sets (DO NOT USE)

| Attempted | Error | Correct |
|-----------|-------|---------|
| `msp_milestones` | 404 | `msp_engagementmilestones` |
| `msp_milestoneses` | 404 | `msp_engagementmilestones` |

## Known Invalid Fields (DO NOT USE)

| Field | Error | Notes |
|-------|-------|-------|
| `msp_forecastedconsumptionrecurring` | 400 — not a valid property | Does not exist on `msp_engagementmilestone` |
| `msp_committedconsumptionrecurring` | 400 — not a valid property | Does not exist on `msp_engagementmilestone` |
| `msp_estimatedcompletiondate` | 400 — not a valid property | Does not exist on `msp_engagementmilestone`; use `msp_milestonedate` instead |

## OData Navigation Properties for @odata.bind (Writes)

When creating/updating records with lookup fields, use the **navigation property name** (not the logical attribute name) with `@odata.bind`:

| Entity | Lookup Field | Navigation Property | Target Entity Set |
|--------|-------------|--------------------|--------------------|
| `msp_engagementmilestone` | `msp_opportunityid` | `msp_OpportunityId` | `opportunities` |
| `msp_engagementmilestone` | `msp_workloadlkid` | `msp_WorkloadlkId` | `msp_workloads` |
| `task` | `regardingobjectid` | `regardingobjectid_msp_engagementmilestone` | `msp_engagementmilestones` |

**Example**: `"msp_WorkloadlkId@odata.bind": "/msp_workloads(<GUID>)"` — note lowercase `l` in `lkId`.

## Common Mistakes to Avoid
- ❌ `msp_accounttpid` → ✅ `msp_mstopparentid` (TPID on accounts)
- ❌ `ownerid` in $filter → ✅ `_ownerid_value` (lookup pattern)
- ❌ `parentaccountid` in $filter → ✅ `_parentaccountid_value`
- ❌ `opportunityid` in milestone filter → ✅ `_msp_opportunityid_value`
- ❌ `taskid` → ✅ `activityid` (tasks use activity primary key)
- ❌ `msp_engagementmilestone` as entity set → ✅ `msp_engagementmilestones` (plural)
- ❌ `msp_estimatedcompletiondate` on milestone → ✅ `msp_milestonedate` (correct date field)

## Milestone Status Codes

| Label | Value |
|-------|-------|
| On Track | `861980000` |
| At Risk | `861980001` |
| Blocked | `861980002` |
| Completed | `861980003` |
| Cancelled | `861980004` |
| Not Started | `861980005` |
| Closed as Incomplete | `861980007` |

## Commitment Recommendation Codes

| Label | Value |
|-------|-------|
| Uncommitted | `861980000` |
| Committed | `861980001` |

## Milestone Category Codes

| Label | Value |
|-------|-------|
| POC/Pilot | `861980000` |

## Filtering Milestones via `crm_query`

Prefer `crm_query` with `entitySet: "msp_engagementmilestones"` over `get_milestones` when you need:
- Status filtering (e.g., only active milestones)
- Multi-opportunity queries (OR filters)
- Date range scoping
- Minimal field selection

### Example: Milestones for one opportunity (active only)

```
crm_query({
  entitySet: "msp_engagementmilestones",
  filter: "_msp_opportunityid_value eq '<GUID>' and msp_milestonestatus eq 861980000",
  select: "msp_milestonenumber,msp_name,msp_milestonestatus,msp_milestonedate,msp_monthlyuse,msp_commitmentrecommendation",
  orderby: "msp_milestonedate asc",
  top: 25
})
```

### Example: Milestones across multiple opportunities

```
crm_query({
  entitySet: "msp_engagementmilestones",
  filter: "(_msp_opportunityid_value eq '<GUID1>' or _msp_opportunityid_value eq '<GUID2>') and msp_milestonestatus ne 861980003 and msp_milestonestatus ne 861980004",
  select: "msp_milestonenumber,msp_name,msp_milestonestatus,msp_milestonedate,msp_monthlyuse,_msp_opportunityid_value",
  orderby: "msp_milestonedate asc",
  top: 50
})
```

## `get_milestones` Tool — Actual Parameters

The `get_milestones` tool only accepts these parameters (defined in `mcp-server/src/tools.js`):

| Parameter | Type | Description |
|-----------|------|-------------|
| `opportunityId` | string (GUID) | Filter by single opportunity |
| `milestoneNumber` | string | Filter by milestone number |
| `milestoneId` | string (GUID) | Get single milestone by ID |
| `ownerId` | string (GUID) | Filter by owner |
| `mine` | boolean | Get all milestones owned by current user |

**Parameters that DO NOT EXIST** (despite appearing in some documentation):
- `opportunityIds` (plural array) — use `crm_query` with OR filters instead
- `statusFilter` — use `crm_query` with `msp_milestonestatus` filter instead
- `taskFilter` — not supported; use `get_milestone_activities` after retrieving milestones
- `format` — not supported

## Querying Account Contacts

To get customer contacts for an account, query the `contacts` entity set filtered by `_parentcustomerid_value`:

```
crm_query({
  entitySet: "contacts",
  filter: "_parentcustomerid_value eq '<ACCOUNT_GUID>'",
  select: "contactid,fullname,emailaddress1,jobtitle,accountrolecode",
  orderby: "fullname",
  top: 200
})
```

To extract unique email domains from contacts, parse the domain part of `emailaddress1` values.
This is useful for scoping email/Teams/calendar searches to customer communication.

### Navigation Patterns
- **From milestone** → `get_milestones(milestoneNumber)` → `_msp_opportunityid_value` → opportunity → `_parentaccountid_value` → account → contacts
- **From opportunity** → `crm_get_record(entitySet: 'opportunities', id)` → `_parentaccountid_value` → account → contacts
- **From account name** → `crm_query(entitySet: 'accounts', filter: "contains(name,'...')")` → accountid → contacts

## Dynamic Schema Discovery
When a property is not listed above, consult the Dynamics 365 entity metadata documentation or ask the user to verify the field name. Do not guess property names — incorrect names will return 400 errors from the OData API.

## Milestone Team (Access Teams) — Known Constraints

The "Milestone Team" tab on milestone records uses **Dynamics 365 Access Teams** (not connections). Key facts:

- **Team template**: `316e4735-9e83-eb11-a812-0022481e1be0` (objecttypecode 10099 = `msp_engagementmilestone`)
- **API actions**: `AddUserToRecordTeam` (add member), `RemoveUserFromRecordTeam` (remove member)
- **Query access team members**: `teams?$filter=_regardingobjectid_value eq '<milestoneId>' and _teamtemplateid_value eq '<templateId>'&$expand=teammembership_association($select=systemuserid,fullname,title)`

### prvCreateTeam / prvWriteTeam Privilege Constraint

**Root cause**: The `AddUserToRecordTeam` and `RemoveUserFromRecordTeam` D365 actions require `prvWriteTeam` privilege on the team entity. When no access team exists yet, `prvCreateTeam` is also required. Most MSX user security roles lack **both** privileges.

**Impact**: Milestone team add/remove operations via API are **fully blocked** for standard MSX user roles. The `manage_milestone_team` tool's "add" and "remove" actions will immediately return an error directing the user to the MSX UI.

**The "list" action still works** — reading team membership only requires read privileges.

**Workaround**: All milestone team member changes must be done via the **MSX UI** (Milestone Team tab), which uses elevated server-side plugins that bypass these privilege requirements.
