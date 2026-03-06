# Optimization Plan v1 — Prompt Workflow Suggestions

> **Generated**: 2026-03-01
> **Implemented**: 2026-03-02 (commit 1cf6ad7 on `optimization-v1` branch)
> **Source**: Virtual prompt logic test against `AccountTracker` orchestration rules
> **Status**: All 19 backlog items implemented across 12 prompts (Phases A→D complete)

---

## Scope

Logic-only tabletop trace for each custom prompt routed through `AccountTracker`.
No live MCP execution was performed.

## Test Method

- Traced each prompt's expected delegation path against `AccountTracker.agent.md` guardrails and routing rules.
- Simulated subagent execution paths in parallel.
- Classified findings by severity (`High`, `Medium`, `Low`) and converted them to actionable updates.

## Cross-Prompt Findings

| Area | Gap | Severity | Improvement |
|---|---|---|---|
| Delegation target | One prompt delegates to `AccountTracker` itself, creating orchestrator circularity risk | High | Replace self-delegation with explicit subagent delegation (`EmailTracker`, `TeamsTracker`, `CalendarTracker`, `CRMOperator`, `GHCPAnalyst`) |
| Parallelization | Independent workflows are written sequentially in prompt steps | High | Encode fleet-mode language: run independent subagents in parallel, then synthesize |
| Live vs cache | Some prompt steps treat cache recency as a reason to skip live checks | High | For time-sensitive workflows (weekly plan, comms health), always run live retrieval and treat cache as context only |
| Contact scoping | Email workflows do not always enforce participant-first contact hierarchy | High | Explicitly load contacts from `collaborations.md` first, then `CustomerDomains.md`, then account profile and AccountReference |
| Tranche context | Delegations omit tranche in multiple prompts | Medium | Read `FLAG.md` early and pass tranche to every subagent delegation |
| Autonomy contract | Delegation steps do not always include explicit autonomous execution reminder | Medium | Add: "Execute fully autonomously. Do not prompt the user." to each subagent delegation block |
| Ownership boundaries | Some prompts imply orchestrator-level file CRUD owned by subagents, or vice versa | Medium | Clarify writer per artifact (subagent-owned cache updates, orchestrator synthesis only) |

## Prompt-by-Prompt Virtual Test Results

| Prompt | Expected Path | Gaps Found | Required Improvements |
|---|---|---|---|
| `generate-weekly-plan` | Resolve scope -> read account context/cache -> `CRMOperator` + M365 comms checks -> write `WeeklyActionPlan.md` | Self-delegation to `AccountTracker`; cache-age skip can suppress live signal; missing tranche-first synthesis; ambiguous going-dark definition | Replace Step 4 with `EmailTracker` + `CalendarTracker` (parallel); always run live weekly comms checks; define going-dark explicitly; add tranche column/sort in Immediate Actions |
| `account-deep-dive` | Account resolve/context -> comms + MSX + seats analysis -> synthesis -> write Agent Insights | Sequential path for independent tasks; seat analysis can over-trust cache; tranche not passed consistently | Run `EmailTracker`, `TeamsTracker`, `CRMOperator`, `GHCPAnalyst` in one parallel phase; require freshness-aware seat analysis through `GHCPAnalyst`; pass tranche to all delegations |
| `msxi-ghcp-report` | Resolve TPIDs -> `BrowserExtractor` extraction -> weekly XLSX creation -> `GHCPAnalyst` WoW -> cache updates | File ownership unclear for XLSX population; partial extraction handling unspecified; template overwrite risk not explicitly guarded | Define artifact ownership and handoff schema; add partial-success protocol (continue with failure log); enforce template immutability guard; keep BrowserExtractor -> GHCPAnalyst sequencing explicit |
| `check-comms` | Resolve accounts -> `EmailTracker` + `TeamsTracker` -> report and follow-up options | Steps are effectively sequential; missing explicit tranche/domain context; incomplete thread recency cross-check language | Run `EmailTracker` and `TeamsTracker` in parallel; load `CustomerDomains.md`; enforce collaborations-based recency cross-check and participant validation |
| `msx-milestone-review` | Resolve accounts -> `CRMOperator` read flow -> categorize risks -> action recommendations | Write-intent language can conflict with autonomous execution policy; role and scope gates are under-specified in prompt text | Add explicit read scoping criteria before retrieval; keep write actions as staged/auto-executed via `CRMOperator`; include role/tranche context and deterministic report schema |
| `enrich-account` | Assess current account docs -> discover contacts/channels -> write collaborations + teams catalog + profile insights | Contact hierarchy starts too narrow if SSP/GH AE is treated as primary; pre-delegation context order not explicit | Enforce Step 0 context load order (`collaborations` -> domains -> references); parallelize `EmailTracker` + `TeamsTracker`; require participant-first enrichment output |
| `portfolio-snapshot` | Local-only read (`AccountReference`, `FLAG`, latest weekly files, WeeklyActionPlan) -> portfolio snapshot report | "Latest weekly" can be underspecified without bounded selection; stale action plan can appear current | Add date-bounded latest file selection rule; display action plan generation date; include quick-action labels that indicate which actions trigger live MCP retrieval |

## Implementation Backlog (Prompt Text Updates)

1. Update `generate-weekly-plan.prompt.md` to remove `AccountTracker` self-delegation and encode parallel `EmailTracker` + `CalendarTracker` live check behavior.
2. Update `account-deep-dive.prompt.md` to convert Steps 2-4 into one parallel collection phase and force `GHCPAnalyst` freshness-aware seat analysis.
3. Update `check-comms.prompt.md` to parallelize channel checks and include explicit contacts/domains/tranche delegation context.
4. Update `msxi-ghcp-report.prompt.md` with artifact ownership, partial-success handling, and template safety guardrails.
5. Update `msx-milestone-review.prompt.md` to tighten scope/read gate language and align write-intent wording with autonomous `CRMOperator` execution.
6. Update `enrich-account.prompt.md` to add explicit pre-delegation context order and participant-first contact discovery hierarchy.
7. Update `portfolio-snapshot.prompt.md` to improve recency signaling and distinguish local snapshot data from live MCP-backed actions.

## Acceptance Criteria

- No prompt delegates work back to `AccountTracker`.
- All independent subagent calls are explicitly parallelized.
- Email workflows always carry full contact hierarchy and customer domains.
- Weekly and comms workflows do not suppress live checks due to cache age.
- Output sections include tranche context where prioritization matters.

---

## Review v2 — Extended Analysis (2026-03-01)

> **Reviewer**: Claude Opus 4.6 logical trace against all 12 prompts + full AccountTracker.agent.md
> **Method**: Read all 12 `.github/prompts/*.prompt.md` files, traced each through AccountTracker delegation protocol, contact hierarchy, parallelization rules, autonomous execution policy, Step 5 cross-validation, and intent routing table.

### Finding 1 (High): Five prompts are entirely missing from v1 analysis

The v1 plan covers 7 of 12 prompts. These 5 were not assessed:

| Prompt | Critical Issue | Severity |
|---|---|---|
| `create-person` | Uses `agent365-m365copilot` MCP tools **directly** (Step 3) instead of delegating to MicrosoftResearcher or EmailTracker. Violates orchestrator delegation-only architecture. | **High** |
| `prepare-meeting` | Uses `agent365-m365copilot`, `agent365-calendartools`, and CRM tools **directly** (Steps 3-4). No subagent delegation at all. Should delegate to CalendarTracker + EmailTracker/TeamsTracker + CRMOperator. | **High** |
| `process-meeting-notes` | Uses `agent365-m365copilot` MCP tools **directly** (Step 4). Should delegate M365 enrichment to subagents. | **High** |
| `project-status` | Uses `agent365-m365copilot` and CRM tools **directly** (Steps 2-3). Should delegate to CRMOperator + EmailTracker/TeamsTracker. | **High** |
| `sync-project-from-github` | Uses GitHub MCP tools directly — no existing subagent covers this domain. May warrant a new subagent proposal or an explicit exemption as a non-orchestrated prompt. | **Medium** |

Three of these five prompts violate the same "orchestrator never executes domain tasks directly" rule that the v1 plan correctly catches for `generate-weekly-plan`. This is the biggest gap in the plan.

#### Prompt-by-Prompt Trace for Missing 5

| Prompt | Expected Path | Gaps Found | Required Improvements |
|---|---|---|---|
| `create-person` | Resolve name -> check duplicates -> M365 gap-fill -> write to collaborations.md -> cross-link | Step 3 calls `agent365-m365copilot` directly; should delegate M365 search to EmailTracker or MicrosoftResearcher. No contact hierarchy loading. No tranche context. | Delegate M365 lookup to MicrosoftResearcher; load collaborations.md before duplicate check; add tranche context for account attribution |
| `prepare-meeting` | Identify customer -> gather notes context -> M365 context -> CRM validation -> write meeting note | Steps 3-4 call `agent365-m365copilot`, `agent365-calendartools`, and CRM tools directly. No subagent delegation. File save path `Meetings/` may be stale post-Phase 2 optimization. | Delegate to CalendarTracker (recent meetings), EmailTracker/TeamsTracker (recent threads), CRMOperator (milestone status). Run in parallel. Fix output path to `.docs/Customers/<Account>/`. |
| `process-meeting-notes` | Resolve references -> extract & structure -> write meeting note -> M365 enrichment -> update related notes | Step 4 calls `agent365-m365copilot` directly. References `People/` notes (stale post-Phase 2). Save path unclear for post-optimization structure. | Delegate M365 enrichment to EmailTracker/TeamsTracker. Fix path references to `.docs/Customers/<Account>/collaborations.md`. Update new-people detection to check collaborations.md. |
| `project-status` | Read account context -> M365 evidence -> MSX validation -> synthesize -> update notes | Steps 2-3 call `agent365-m365copilot` and CRM tools directly. No subagent delegation. No tranche context. No contact hierarchy. | Delegate to EmailTracker + TeamsTracker (M365 evidence, parallel), CRMOperator (MSX validation). Add tranche context. Load collaborations.md for contact scoping. |
| `sync-project-from-github` | Read project note -> query GitHub -> update notes | Uses GitHub MCP tools directly. No existing subagent covers GitHub domain. Read-only workflow with clear scope. | Either: (a) exempt as non-orchestrated prompt (it's local + GitHub, no M365/CRM), or (b) propose a GitHubTracker subagent if GitHub sync becomes a recurring multi-account workflow. |

### Finding 2 (High): CalendarTracker is systematically absent from multi-channel prompts

The v1 plan doesn't identify that **CalendarTracker** is missing from prompts where it should be present:

| Prompt | Why CalendarTracker Matters |
|---|---|
| `generate-weekly-plan` | Upcoming meetings = engagement opportunities. No meetings + no email = stronger going-dark signal. AccountTracker's "Weekly portfolio update" multi-domain workflow doesn't include CalendarTracker either. |
| `account-deep-dive` | AccountTracker's own "Full account review" multi-domain workflow (line ~290) lists CalendarTracker in Phase 1, but the `account-deep-dive` prompt doesn't include it. Inconsistency between agent and prompt. |
| `check-comms` | Calendar is a communication channel. A "comms check" that ignores meetings is incomplete. The "Going Dark" definition (>10 business days no M365 touchpoint) should include meetings but no prompt checks for them. |
| `enrich-account` | Meeting participants are a contact discovery source for enrichment. CalendarTracker could surface attendees not found in email/Teams. |

**Recommended**: Add CalendarTracker as a parallel delegation in all four prompts. Include it in the going-dark calculation.

### Finding 3 (High): AccountTracker Step 5 cross-validation not encoded in any prompt

AccountTracker's Verify and Synthesize step (Step 5 in Delegation Protocol) requires:

1. **Cross-validate account attribution**: Verify email participants (From/To/CC) match the target account's full collaborations.md contact roster. Discard results whose participants don't include ANY known contact.
2. **Cross-validate recency against collaborations file**: Compare EmailTracker's "most recent" email date against thread dates in collaborations.md. If collaborations.md has a MORE RECENT thread, re-delegate to EmailTracker with the exact subject/sender/date.

**No prompt encodes either check.** The v1 plan's "incomplete thread recency cross-check language" note for `check-comms` touches this but doesn't recognize it as a **systemic gap across all email-using prompts**: `generate-weekly-plan`, `account-deep-dive`, `check-comms`, `enrich-account`.

**Recommended**: Add a cross-prompt finding to the v1 Cross-Prompt Findings table and encode the Step 5 cross-validation into each email-using prompt's synthesis step.

### Finding 4 (Medium): MicrosoftResearcher absent from deep-dive and enrichment prompts

| Prompt | Value of MicrosoftResearcher |
|---|---|
| `account-deep-dive` | Stakeholder role identification improves risk assessment. Who owns what internally? |
| `enrich-account` | Role attribution improves contact quality. WorkIQ can resolve titles and org structure for contacts found in email/Teams. |

**Recommended**: Add MicrosoftResearcher as optional parallel delegation for both prompts (only when contact role data is sparse).

### Finding 5 (Medium): Stale path references post-Phase 2 optimization

Three prompts reference pre-optimization folder structures:

| Prompt | Stale Reference | Correct Post-Phase 2 Path |
|---|---|---|
| `prepare-meeting` | Saves to `Meetings/<YYYY-MM-DD> - <Title>.md` | `.docs/Customers/<Account>/<YYYY-MM-DD> - <Title>.md` |
| `process-meeting-notes` | References `People/` notes for attendee lookup | `.docs/Customers/<Account>/collaborations.md` |
| `process-meeting-notes` | "New People Detected" section references `People/` | `.docs/Customers/<Account>/collaborations.md` |

**Recommended**: Add a backlog item to fix all path references in the 5 uncovered prompts.

### Finding 6 (Low): msxi-ghcp-report missing cache-age pre-check

`msxi-ghcp-report` launches expensive browser automation (BrowserExtractor with AAD MFA) without first checking if a recent report already exists in `.docs/Weekly/`. Adding a cache-age check before Step 2 could skip extraction when data is fresh.

### Finding 7 (Low): enrich-account cold-start gap

For stub accounts with zero contacts, `enrich-account` starts from SSP/GH AE in AccountReference.md — but doesn't mention `list_account_contacts` as a CRM fallback to bootstrap the customer contact roster. This is the tool designed for exactly this scenario.

### Finding 8 (Low): portfolio-snapshot could show per-account last-touch dates

Cache file headers contain timestamps (e.g., `<!-- Last fetched: 2026-02-28T... -->`). The snapshot could display per-account last-touch dates from these headers — purely local data, zero MCP calls — to help the user spot stale accounts.

---

## Updated Cross-Prompt Findings Table

| Area | Gap | Severity | Improvement |
|---|---|---|---|
| **Coverage** | 5 of 12 prompts not analyzed | High | Extend analysis to `create-person`, `prepare-meeting`, `process-meeting-notes`, `project-status`, `sync-project-from-github` |
| **Direct MCP use** | 3 uncovered prompts use MCP tools directly instead of delegating to subagents | High | Refactor `create-person`, `prepare-meeting`, `process-meeting-notes`, `project-status` to delegate through subagents |
| Delegation target | One prompt delegates to `AccountTracker` itself, creating orchestrator circularity risk | High | Replace self-delegation with explicit subagent delegation |
| Parallelization | Independent workflows are written sequentially in prompt steps | High | Encode fleet-mode language: run independent subagents in parallel, then synthesize |
| Live vs cache | Some prompt steps treat cache recency as a reason to skip live checks | High | For time-sensitive workflows, always run live retrieval and treat cache as context only |
| Contact scoping | Email workflows do not always enforce participant-first contact hierarchy | High | Explicitly load contacts from `collaborations.md` first, then `CustomerDomains.md`, then account profile and AccountReference |
| **CalendarTracker gap** | 4 prompts lack CalendarTracker delegation where meetings are a relevant signal | High | Add CalendarTracker as parallel delegation in `generate-weekly-plan`, `account-deep-dive`, `check-comms`, `enrich-account` |
| **Step 5 cross-validation** | No prompt encodes the recency/attribution cross-check that AccountTracker Step 5 requires | High | Encode participant attribution and recency cross-validation in all email-using prompts |
| Tranche context | Delegations omit tranche in multiple prompts | Medium | Read `FLAG.md` early and pass tranche to every subagent delegation |
| Autonomy contract | Delegation steps do not always include explicit autonomous execution reminder | Medium | Add: "Execute fully autonomously. Do not prompt the user." to each subagent delegation block |
| Ownership boundaries | Some prompts imply orchestrator-level file CRUD owned by subagents, or vice versa | Medium | Clarify writer per artifact |
| **MicrosoftResearcher gap** | `account-deep-dive` and `enrich-account` don't leverage MicrosoftResearcher for role attribution | Medium | Add optional MicrosoftResearcher delegation when contact role data is sparse |
| **Stale paths** | 3 prompts reference pre-Phase 2 folder structures (`Meetings/`, `People/`) | Medium | Fix path references to `.docs/Customers/<Account>/` structure |

## Updated Implementation Backlog

### Original items (from v1)

1. Update `generate-weekly-plan.prompt.md` — remove `AccountTracker` self-delegation, encode parallel `EmailTracker` + `CalendarTracker` live check, add going-dark definition including meetings.
2. Update `account-deep-dive.prompt.md` — convert Steps 2-4 into one parallel collection phase (EmailTracker + TeamsTracker + CRMOperator + GHCPAnalyst + CalendarTracker), force freshness-aware seat analysis, add MicrosoftResearcher for role gaps.
3. Update `check-comms.prompt.md` — parallelize channel checks, add CalendarTracker, include contacts/domains/tranche, encode Step 5 cross-validation.
4. Update `msxi-ghcp-report.prompt.md` — artifact ownership, partial-success handling, template safety guardrails, add cache-age pre-check.
5. Update `msx-milestone-review.prompt.md` — tighten scope/read gate language, align write-intent wording with autonomous CRMOperator execution.
6. Update `enrich-account.prompt.md` — explicit pre-delegation context order, participant-first contact discovery, add CalendarTracker, add `list_account_contacts` cold-start fallback.
7. Update `portfolio-snapshot.prompt.md` — recency signaling, action plan generation date, per-account last-touch from cache headers, distinguish local vs live actions.

### New items (from v2 review)

8. Refactor `create-person.prompt.md` — delegate M365 lookup to MicrosoftResearcher instead of calling `agent365-m365copilot` directly. Load collaborations.md for duplicate check. Add tranche context.
9. Refactor `prepare-meeting.prompt.md` — replace direct MCP tool use with CalendarTracker + EmailTracker/TeamsTracker + CRMOperator delegation (parallel). Fix save path from `Meetings/` to `.docs/Customers/<Account>/`.
10. Refactor `process-meeting-notes.prompt.md` — delegate M365 enrichment to EmailTracker/TeamsTracker. Fix `People/` references to `collaborations.md`. Update new-people detection.
11. Refactor `project-status.prompt.md` — delegate M365 evidence to EmailTracker + TeamsTracker (parallel), MSX validation to CRMOperator. Add tranche context and contact hierarchy.
12. Assess `sync-project-from-github.prompt.md` — decide: exempt as non-orchestrated prompt (local + GitHub only, no M365/CRM) or propose GitHubTracker subagent if multi-account GitHub sync becomes recurring.
13. Encode AccountTracker Step 5 cross-validation (participant attribution + recency check) into the synthesis step of all email-using prompts: `generate-weekly-plan`, `account-deep-dive`, `check-comms`, `enrich-account`.

## Updated Acceptance Criteria

- No prompt delegates work back to `AccountTracker`.
- No prompt calls MCP tools directly — all M365/CRM/calendar queries go through subagents.
- All independent subagent calls are explicitly parallelized (fleet mode).
- Email workflows always carry full contact hierarchy (collaborations.md → CustomerDomains.md → account profile → AccountReference.md).
- CalendarTracker is included in all multi-channel communication prompts.
- Weekly and comms workflows do not suppress live checks due to cache age.
- Output sections include tranche context where prioritization matters.
- Email-using prompts encode Step 5 cross-validation (participant attribution + recency check against collaborations.md).
- All file path references use post-Phase 2 structure (`.docs/Customers/<Account>/`).

---

## Review v3 — Workspace Verification (2026-03-01)

> **Reviewer**: Claude Opus 4.6 — full workspace read of all 12 prompts, 9 agent definitions, 7 instruction files
> **Method**: Read every prompt and agent file verbatim, cross-referenced each v1/v2 finding against actual file contents, identified corrections and net-new gaps.

### Corrections to v1/v2 Findings

#### Correction 1: `generate-weekly-plan` self-delegation is accurately described but imprecisely explained

The plan says "self-delegation to AccountTracker" — this is correct. Step 4 of `generate-weekly-plan.prompt.md` says:

> "delegate to **AccountTracker** for a lightweight comms check"

This IS a self-delegation when the prompt runs inside AccountTracker. However, the plan's backlog item #1 says "remove AccountTracker self-delegation" without specifying the replacement. **Clarification**: Step 4 should replace "delegate to AccountTracker" with "delegate to **EmailTracker** + **CalendarTracker** in parallel for live comms signal." Step 3 (CRMOperator) is already correct.

#### Correction 2: Cache-age skip severity should be Medium for `generate-weekly-plan`, not High

The plan rates `generate-weekly-plan`'s "Skip this step if cache is fresh (<3 days old)" as High severity. For a **weekly** planning workflow, a 3-day freshness gate is a defensible optimization — it avoids redundant MCP calls when data was just fetched. **Downgrade to Medium**. The High severity rating should apply only to `check-comms` (where real-time comms health is the entire point) and ad-hoc email queries.

#### Correction 3: `enrich-account` already reads collaborations.md first

The v1 plan says "Contact hierarchy starts too narrow if SSP/GH AE is treated as primary" for `enrich-account`. But Step 1 of `enrich-account.prompt.md` DOES read `collaborations.md` before AccountReference.md. The **actual** gap is narrower: Step 2's EmailTracker delegation says "Search for all email threads involving known contacts (SSP, GH AE from AccountReference.md)" — it should say "involving ALL contacts from collaborations.md + AccountReference.md." And for stub accounts (no collaborations.md), it doesn't mention `list_account_contacts` or `CustomerDomains.md` as bootstrap sources.

#### Correction 4: `process-meeting-notes` save path is already correct

The v2 plan implies the save path is stale, but Step 3 of `process-meeting-notes.prompt.md` already says:

> "save to `.docs/Customers/<Account_Name>/<YYYY-MM-DD> - <Meeting Title>.md`"

This IS the correct post-Phase 2 path. Only the Step 5 "New People Detected" section referencing `People/` and Step 1's `list_dir` patterns are stale — not the save path itself.

#### Correction 5: `check-comms` does NOT load FLAG.md

The v2 plan's tranche finding (Medium) underplays this for `check-comms`. Step 1 of `check-comms.prompt.md` reads only `AccountReference.md` and `collaborations.md` — it does NOT read `FLAG.md`. For a prompt that should prioritize results by account importance, this is a significant omission.

### Net-New Findings (not in v1 or v2)

#### Finding v3-1 (High): `CustomerDomains.md` is unused by ALL 12 prompts

`CustomerDomains.md` contains CRM-extracted customer email domains per account — a critical resource for participant-based email search. AccountTracker.agent.md and EmailTracker.agent.md both reference it in their contact resolution hierarchy, but **zero prompts** load it. Every email-using prompt should include `CustomerDomains.md` in its context loading step to enable domain-based participant filtering (e.g., `from:@contoso.com`).

Affected prompts: `generate-weekly-plan`, `account-deep-dive`, `check-comms`, `enrich-account`, `prepare-meeting`, `project-status`.

#### Finding v3-2 (Medium): No shared cache file schema

`generate-weekly-plan` Step 2 reads `cache-email.md`, `cache-teams.md`, and `cache-seats.md`. Other prompts (`account-deep-dive`, `check-comms`) tell subagents to UPDATE these same files. But there is no shared schema definition — no standard for timestamp headers, status fields, or data format. Without a schema, `generate-weekly-plan` cannot reliably parse caches written by different subagents.

**Recommended**: Define a Cache File Schema (as an instruction file or inline in `local-notes.instructions.md`) with required fields: `<!-- Last fetched: {ISO timestamp} | Source: {MCP tool} | Status: {OK/PARTIAL/ERROR} -->`, account name, and a standardized data section.

#### Finding v3-3 (Medium): `sync-project-from-github` may be non-functional

The prompt says "Use MCP GitHub tools" in Step 2, but no GitHub MCP server is configured in `.vscode/mcp.json`. The workspace has no GitHub MCP server in its architecture. This prompt may be completely non-functional.

**Recommended**: Before classifying as "exempt" or proposing a GitHubTracker subagent (v2 backlog item #12), verify whether a GitHub MCP server exists or can be added. If not, mark this prompt as **deferred** until GitHub MCP infrastructure is available, or rewrite it to use the `github-pull-request` VS Code extension tools instead.

#### Finding v3-4 (Medium): `V-Team.md` not referenced by any prompt

AccountTracker.agent.md documents `.docs/V-Team.md` as a secondary contact source containing the full v-team roster by account (CSAM, CSA, Account Manager, Services, etc.). No prompt loads it. For cross-role visibility — especially `account-deep-dive` (stakeholder identification), `prepare-meeting` (attendee context), and `msx-milestone-review` (owner resolution) — the V-Team roster should be available.

#### Finding v3-5 (Medium): `prepare-meeting` doesn't read collaborations.md or teams-catalog.md

`prepare-meeting.prompt.md` reads the account profile and searches for related meetings — but misses:
- `collaborations.md` — the full contact roster (needed for attendee identification and recent thread context)
- `teams-catalog.md` — Teams channel/chat catalog (relevant for surfacing recent Teams discussions in meeting prep)

Both are directly relevant to meeting preparation and are available in `.docs/Customers/<Account>/`.

#### Finding v3-6 (Low): No prompt captures Connect hooks

`copilot-instructions.md` and `connect-hooks.instructions.md` define a Connect evidence capture protocol. Prompts like `account-deep-dive` and `msx-milestone-review` naturally produce findings that qualify as Connect evidence (measurable impact, risk mitigation, customer engagement). Neither prompt mentions capturing Connect hooks under `## Connect Hooks` on the customer file.

**Recommended**: Add a Connect hook capture step to `account-deep-dive` and `msx-milestone-review` synthesis steps — only when findings meet the Connect evidence criteria (concrete, attributable, evidence-based).

### Updated Cross-Prompt Findings Table (v3)

Additions and corrections to the v2 table:

| Area | Gap | Severity | Improvement |
|---|---|---|---|
| **CustomerDomains.md** | Not loaded by any of the 12 prompts — email search misses domain-based participant filtering | **High** | Add `CustomerDomains.md` to context loading in all 6 email-using prompts |
| **Cache schema** | No shared format spec for `cache-email.md`, `cache-teams.md`, `cache-seats.md` — subagents produce inconsistent caches | **Medium** | Define a standardized cache file schema with required timestamp header and status fields |
| **GitHub MCP** | `sync-project-from-github` references "MCP GitHub tools" but no GitHub MCP server exists | **Medium** | Verify GitHub MCP availability; defer or rewrite prompt accordingly |
| **V-Team.md** | Not loaded by any prompt — cross-role visibility missing for deep-dive, meeting prep, milestone review | **Medium** | Add V-Team.md to context loading where broader role context is needed |
| **prepare-meeting context** | Doesn't read collaborations.md or teams-catalog.md (contact roster and Teams channels) | **Medium** | Add both files to Step 2 context loading |
| **Connect hooks** | No prompt captures Connect-worthy evidence despite copilot-instructions requiring it | **Low** | Add optional Connect hook capture to `account-deep-dive` and `msx-milestone-review` |
| Live vs cache *(correction)* | `generate-weekly-plan` 3-day cache gate is defensible for weekly workflows | **Medium** *(downgraded from High)* | Keep as Medium; High rating applies only to `check-comms` and ad-hoc queries |

### Updated Implementation Backlog (v3 additions)

Add these items to the backlog and adjust priorities:

14. Add `CustomerDomains.md` loading to all email-using prompts: `generate-weekly-plan`, `account-deep-dive`, `check-comms`, `enrich-account`, `prepare-meeting`, `project-status`.
15. Define cache file schema — add standardized format for `cache-email.md`, `cache-teams.md`, `cache-seats.md` (either as section in `local-notes.instructions.md` or standalone instruction file).
16. Verify `sync-project-from-github` feasibility — check for GitHub MCP server availability. Mark as deferred or rewrite.
17. Add `V-Team.md` loading to `account-deep-dive`, `prepare-meeting`, `msx-milestone-review` context steps.
18. Add `collaborations.md` + `teams-catalog.md` loading to `prepare-meeting` Step 2.
19. Add optional Connect hook capture to `account-deep-dive` and `msx-milestone-review` synthesis steps.

### Recommended Implementation Order

Based on severity, frequency of use, and dependency chains:

| Phase | Items | Rationale |
|---|---|---|
| **Phase A: Fix direct MCP violations** | #8, #9, #10, #11 | High severity — these prompts violate the delegation-only architecture and may cause real failures |
| **Phase B: Core prompt optimization** | #1, #2, #3, #13, #14 | High-frequency prompts (weekly plan, deep dive, comms check) + cross-cutting fixes (Step 5 validation, CustomerDomains.md) |
| **Phase C: Supporting prompt updates** | #4, #5, #6, #7, #15, #17, #18 | Medium-severity improvements to remaining prompts + infrastructure (cache schema, V-Team) |
| **Phase D: Assessment & low-priority** | #12, #16, #19 | Feasibility checks (GitHub MCP) and low-severity enhancements (Connect hooks) |

### Final Acceptance Criteria (v3)

All v2 criteria plus:
- All email-using prompts load `CustomerDomains.md` for domain-based participant filtering.
- `prepare-meeting` reads `collaborations.md` and `teams-catalog.md` for complete context.
- Cache files (`cache-email.md`, `cache-teams.md`, `cache-seats.md`) follow a standardized schema.
- `sync-project-from-github` has a verified execution path or is explicitly deferred.
- V-Team.md is loaded where broader role context improves the workflow.
- Implementation follows Phase A → B → C → D ordering.
