# GHCP Growth Framework -- Cohort Classification Logic

Use this reference to classify an account into its growth framework cohort.

## Input Fields Required

From the weekly report row:
- `GHE Total Seats` (or GHE License + GHE Metered)
- `ADO Seats`
- `GHCP Seats`
- `GHCP Attach` (decimal, e.g., 0.341 = 34.1%)
- `ARPU` (dollars)

## Classification Algorithm

```
function classifyCohort(account):
    hasGHE = account.GHE_Total_Seats > 0
    hasADO = account.ADO_Seats > 0
    hasDevPlatform = hasGHE or hasADO
    ghcpSeats = account.GHCP_Seats
    attach = account.GHCP_Attach    # as percentage (0-100)
    arpu = account.ARPU

    if not hasDevPlatform and ghcpSeats == 0:
        return Cohort 0  # No GHE, ADO, or GHCP

    if ghcpSeats < 50:
        return Cohort 1  # GHE/ADO present, limited GHCP

    if attach < 50:
        return Cohort 2  # >50 GHCP, <50% attached

    if arpu < 30:
        return Cohort 3  # >50 GHCP, >50% attach, <$30 ARPU

    return Cohort 4      # >50 GHCP, >50% attach, >$30 ARPU
```

## Cohort Summary

| Cohort | Name | Criteria | Action |
|---|---|---|---|
| 0 | No platform | No GHE, no ADO, no GHCP seats | Land Copilot |
| 1 | Limited GHCP | GHE and/or ADO present, < 50 GHCP seats | Land Copilot |
| 2 | Low attach | > 50 GHCP seats, < 50% developer attachment | Expand Copilot |
| 3 | Low ARPU | > 50 GHCP seats, > 50% attach, ARPU < $30 | Upsell to Enterprise |
| 4 | High value | > 50 GHCP seats, > 50% attach, ARPU > $30 | Nurture & Cross-sell |

## Attach Rate Note

The `GHCP Attach` column in the weekly report is already calculated as:
```
GHCP Attach = GHCP Seats / GHCP Seat Opportunity
```
where `GHCP Seat Opportunity = MAX(GHE License + GHE Metered, ADO Seats)`.

If the report provides attach as a decimal (e.g., 0.341), multiply by 100 for percentage comparison against the 50% threshold.

## Cohort-Driven Recommendations

| Cohort | Recommended Next Steps |
|---|---|
| 0 | Identify developer population, establish GHE/ADO baseline, pitch GHCP proof-of-concept |
| 1 | Drive initial GHCP proof/pilot, target team-level adoption, aim for 50+ seats |
| 2 | Expand across teams, increase attach rate, target 50%+ developer coverage |
| 3 | Upsell from Business to Enterprise tier, drive premium feature adoption (PRU, custom models), target ARPU > $30 |
| 4 | Cross-sell adjacent GitHub/Azure services (GHAS, AI Foundry, AKS), deepen relationship, protect installed base |

## Applying to the "Action" Column

The weekly report already contains an `Action` column (Col G) that maps to these cohorts:
- `1. Land Copilot` = Cohort 0 or 1
- `2. Drive GHCP Expansion` = Cohort 2
- `3. Upsell to Enterprise` = Cohort 3
- `4. Nurture & Cross-sell` = Cohort 4

When the report's Action column is present, validate it against the computed cohort. Flag discrepancies.
