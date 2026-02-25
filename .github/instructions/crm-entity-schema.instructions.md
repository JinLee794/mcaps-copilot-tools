# CRM Entity Schema Reference

Use this reference when constructing `crm_query` calls against Dynamics 365 entities.
Incorrect entity set names or field names will return 404 or 400 errors.

## Milestone Entity

- **Entity set**: `msp_engagementmilestones`
- **Primary key**: `msp_engagementmilestoneid`

### Valid Fields ($select)

```
msp_engagementmilestoneid, msp_milestonenumber, msp_name,
_msp_workloadlkid_value, msp_commitmentrecommendation,
msp_milestonecategory, msp_monthlyuse, msp_milestonedate,
msp_milestonestatus, _ownerid_value, _msp_opportunityid_value,
msp_forecastcommentsjsonfield, msp_forecastcomments
```

### Known Invalid Entity Sets (DO NOT USE)

| Attempted | Error | Correct |
|-----------|-------|---------|
| `msp_milestones` | 404 | `msp_engagementmilestones` |
| `msp_milestoneses` | 404 | `msp_engagementmilestones` |

### Known Invalid Fields (DO NOT USE)

| Field | Error | Notes |
|-------|-------|-------|
| `msp_forecastedconsumptionrecurring` | 400 — not a valid property | Does not exist on `msp_engagementmilestone` |
| `msp_committedconsumptionrecurring` | 400 — not a valid property | Does not exist on `msp_engagementmilestone` |

### Milestone Status Codes

| Label | Value |
|-------|-------|
| On Track | `861980000` |
| At Risk | `861980001` |
| Blocked | `861980002` |
| Completed | `861980003` |
| Cancelled | `861980004` |
| Not Started | `861980005` |
| Closed as Incomplete | `861980007` |

### Commitment Recommendation Codes

| Label | Value |
|-------|-------|
| Uncommitted | `861980000` |
| Committed | `861980001` |

### Milestone Category Codes

| Label | Value |
|-------|-------|
| POC/Pilot | `861980000` |

## Opportunity Entity

- **Entity set**: `opportunities`
- **Primary key**: `opportunityid`

### Valid Fields ($select)

```
opportunityid, name, estimatedclosedate,
msp_estcompletiondate, msp_consumptionconsumedrecurring,
_ownerid_value, _parentaccountid_value, msp_salesplay
```

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
