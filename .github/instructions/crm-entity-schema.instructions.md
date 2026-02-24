---
description: "CRM entity schema reference for Dynamics 365 OData queries. Use when constructing crm_query, crm_get_record, or any OData filter/select expressions to avoid property name guessing."
applyTo: "mcp-server/**"
---
# CRM Entity Schema Quick Reference

## Rules
- **Never guess property names.** Use only the property names listed below or discovered via `crm_list_entity_properties`.
- If a needed property is not listed here, call `crm_list_entity_properties` with the entity logical name before querying.
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

### systemusers (logical name: systemuser)
| Property | Type | Description |
|---|---|---|
| systemuserid | Uniqueidentifier | Primary key |
| fullname | String | Full name |
| internalemailaddress | String | Email address |
| title | String | Job title |
| businessunitid | Lookup | Business unit |

## Common Mistakes to Avoid
- ❌ `msp_accounttpid` → ✅ `msp_mstopparentid` (TPID on accounts)
- ❌ `ownerid` in $filter → ✅ `_ownerid_value` (lookup pattern)
- ❌ `parentaccountid` in $filter → ✅ `_parentaccountid_value`
- ❌ `opportunityid` in milestone filter → ✅ `_msp_opportunityid_value`
- ❌ `taskid` → ✅ `activityid` (tasks use activity primary key)
- ❌ `msp_engagementmilestone` as entity set → ✅ `msp_engagementmilestones` (plural)

## Dynamic Schema Discovery
When a property is not listed above, use the `crm_list_entity_properties` MCP tool:
```
crm_list_entity_properties({ entityLogicalName: "account", filter: "tpid" })
```
This returns all matching properties with their logical names and types.
