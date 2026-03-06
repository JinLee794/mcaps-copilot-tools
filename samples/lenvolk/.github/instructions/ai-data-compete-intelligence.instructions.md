---
description: "AI + Data competitive intelligence: Fabric vs AWS (Redshift, Glue, Lambda, SageMaker), Fabric vs GCP (BigQuery, Vertex AI), Fabric vs Snowflake, Fabric vs Databricks. Win/loss patterns, OneLake data gravity, compete playbooks, enterprise readiness gaps, solution stack patterns. Use when reasoning about competitive positioning, compete strategy, win/loss analysis, Fabric adoption, data platform modernization, AWS displacement, GCP takeout, Snowflake/Databricks counter-positioning, or any strategic account analysis where competitor presence is detected."
applyTo: ".github/agents/strat-tech-sales-orch.agent.md"
---

# AI + Data Compete Intelligence — Field-Proven Win/Loss Patterns

Source: Microsoft AI + Data "Go Big" Win/Loss Collection (Dec 2025). 15 compete wins + 1 critical loss across Enterprise, SME&C, and SMB segments.

## 1. Winning Themes (Ranked by Frequency)

Apply these when building compete narratives or positioning Microsoft's data + AI stack:

| # | Theme | What It Means | When to Lead With |
|---|---|---|---|
| 1 | **OneLake Data Gravity** | Single-copy data model — once data lands in OneLake, compute, AI, and BI attach naturally. Eliminates data movement, duplication, and egress fees. | Customer has data scattered across multiple services (S3 + Redshift + Glue, or BigQuery + GCS). Lead with "one copy, governed once." |
| 2 | **Fabric as Unified Platform** | Replaces 5-7 fragmented AWS/GCP services (ETL + warehouse + lake + BI + ML) with one E2E platform. Reduces operational complexity and vendor sprawl. | Customer is managing multiple disconnected services and complaining about integration overhead, skill gaps, or operational cost. |
| 3 | **Native Ecosystem Integration** | Fabric + D365, Fabric + M365 Copilot, SAP RISE on Azure, Azure AI Foundry — competitors can't match breadth of "One Microsoft." | Customer already uses D365, M365, or SAP on Azure. The competitor stack requires custom integration where Microsoft has native connectors. |
| 4 | **AI-Readiness Path** | Fabric + AI Foundry + Azure OpenAI as the agentic AI foundation. Position data modernization as the prerequisite for AI transformation — "you can't do AI without clean, unified data." | Customer has AI ambitions but fragmented data. Use: "Fabric is the data foundation; AI Foundry is the intelligence layer — they're designed together." |
| 5 | **Lower TCO** | Platform consolidation math — fewer services, fewer skills, fewer integrations = lower total cost. Dual-cloud customers pay double for governance, security, and networking. | Customer is cost-sensitive, facing renewal pressure, or running dual-cloud with visible waste. Quantify the consolidation savings. |
| 6 | **Real-Time Intelligence (RTI)** | Fabric RTI for time-series, IoT, and streaming workloads. Replaces purpose-built real-time tools. | Customer has real-time/IoT workloads: telco network data, industrial sensors, utility monitoring, gaming telemetry. |
| 7 | **One Microsoft Motion** | Azure + M365 + Security + Fabric vs. fragmented competitor stacks where data, apps, and identity live in separate ecosystems. | Selling to execs who value vendor consolidation and unified governance. The CEO/CFO play. |
| 8 | **Partner Execution** | Strong partners (Hexaware, Accenture, Rackspace, InCycle, etc.) de-risk delivery. Field teams brought partners into deals as co-sellers and implementers. | Customer lacks internal cloud/data skills or needs accelerated timeline. "We bring both the platform and the delivery capability." |
| 9 | **Azure Accelerate/Innovate Funding** | Microsoft incentive programs reduce customer risk and accelerate migration/POC. | Customer is budget-constrained or needs proof before commitment. Use funding to lower the "first step" barrier. |
| 10 | **Executive Sponsorship & Cross-Team** | Wins required sustained engagement: SE + SSP + CSA + Partner + sometimes GH AE working together. Not single-threaded. | Complex deals. Ensure you have multi-thread coverage. If you're single-threaded, flag it as a risk. |

## 2. Competitor-Specific Counter-Plays

### vs GCP BigQuery

**Pattern**: Fabric wins on unified governance, OneLake, native AI integration, and lower cost. BigQuery is strong in analytics but creates data silos when combined with GCS, Vertex AI, and Looker.

| Customer | Segment | ACR | What Won | Key Argument |
|---|---|---|---|---|
| MEO (Altice Portugal) | Enterprise | $3M/yr | Fabric replacing BigQuery | Consolidating Oracle/IBM/SAS/Cloudera + SAP RISE. One platform > 6 vendors. |
| AGRANA & Südzucker | Enterprise | €10M MACC | SAP RISE + Fabric | Full Google takeout. SAP RISE native on Azure + Fabric = no GCP needed. |
| Neoway Tecnologia | Enterprise Strategic | $10.8M MACC | Fabric + Databricks + M365 | One Microsoft strategy. Full Google takeout — customer valued unified ecosystem. |
| Breitling | SME&C | $100K | Fabric + Databricks + AI Foundry | 20% e-commerce uplift in 3 months. Fabric + AI delivered measurable business outcome fast. |
| Veolia | Enterprise | $266K | Fabric RTI | Time-series data from 7K+ water plants, 800 waste sites. RTI purpose-built for this. |
| Mystifly | SMB | $45K | Azure + Fabric | Displacing BigQuery. CAF-aligned landing zone + Fabric = enterprise-grade for SMB price. |

**Playbook**:
1. Quantify GCP service sprawl (BigQuery + GCS + Dataflow + Vertex AI + Looker = 5 SKUs, 5 bills, 5 skill sets).
2. Position OneLake as "one lake, one governance model, one security boundary."
3. If customer uses SAP: SAP RISE on Azure is the anchor — once SAP moves, data follows, and BigQuery loses its gravity.
4. If customer has AI ambitions: "BigQuery gives you analytics. Fabric + AI Foundry gives you analytics AND agents AND Copilot."
5. TCO: model the dual-cloud tax (networking, security, identity, governance duplication).

### vs AWS (Redshift / Glue / Lambda / SageMaker)

**Pattern**: Fabric wins on simplicity — single platform replaces the AWS multi-service puzzle. AWS customers often manage Redshift + Glue + Lambda + S3 + SageMaker + QuickSight as separate products. Fabric provides all of this in one.

| Customer | Segment | ACR | What Won | Key Argument |
|---|---|---|---|---|
| DLR | Enterprise | $768K | Fabric RTI, Event Stream, IoT Hub | Real-time operational data platform (OpDaaS). RTI purpose-built for sensor/IoT. |
| PGIM (Prudential) | Enterprise Strategic | — | Fabric notebooks + pipelines | Metadata-driven ingestion rehost from AWS. Fabric matched AWs capability with less complexity. |
| McGraw Hill | Enterprise Major | $111K | Azure AI Foundry + Azure OpenAI + GHCP | 4M AI transactions in first month. AI Foundry + GitHub Copilot = developer productivity + AI. |
| Costa Coffee | Enterprise Strategic | $55K | Fabric + D365 native integration | Replacing AWS Redshift. D365 native connector = no custom ETL for CRM data. |
| Sela Sports | SME&C | $43K | Fabric replacing Redshift | Multi-cloud visibility (Azure + AWS + GCP data in one Fabric lakehouse). |
| InEight/Kiewit | Enterprise Major | $150K | AI-First Agentic Platform | Fabric + Foundry + CosmosDB. Beat AWS and Palantir on agentic architecture. |

**Playbook**:
1. Map the customer's AWS service inventory: how many services are they managing? (Redshift + Glue + Lambda + S3 + SageMaker + QuickSight = 6 SKUs).
2. Position Fabric as "all six in one platform, one bill, one skill set, one security model."
3. If customer uses D365: highlight native Fabric-D365 connectors (no ETL needed — Costa Coffee pattern).
4. If customer has IoT/real-time: Fabric RTI replaces Kinesis + Lambda + custom pipelines (DLR pattern).
5. If customer has AI interest: AI Foundry + GitHub Copilot is the developer-to-production AI pipeline that SageMaker can't match for breadth.
6. Don't attack AWS head-on for compute — focus on the data & AI layer where Fabric's integration advantage is strongest.

### vs Snowflake & Databricks

**Pattern**: More nuanced. Databricks is sometimes a partner (Fabric + Databricks coexist in several wins). Snowflake is a direct competitor.

**Where we win**: Breadth. Fabric + AI Foundry + M365 integration + D365 connectors + security (Purview) is a platform play Snowflake/Databricks can't match alone.

**Where we lose**: Enterprise readiness in regulated workloads. See WTW loss below.

**Playbook**:
1. Don't position Fabric vs Databricks as either/or — many winning deals included both. Fabric for ingestion/governance/BI + Databricks for advanced ML/Spark workloads.
2. Against Snowflake: lead with governance (OneLake, Purview), native integrations (D365, M365), and AI path (AI Foundry). Snowflake's ecosystem requires third-party connectors for everything outside analytics.
3. Against Databricks-only: Fabric's advantage is the full stack — ingestion, transformation, warehouse, BI, real-time, AND governance in one. Databricks requires Delta Lake + Unity Catalog + custom orchestration.
4. In regulated industries: **check Fabric's GA status for required security features** before positioning. If RLS/cross-region security is still preview, acknowledge the gap and propose a timeline-based adoption plan.

## 3. Enterprise Readiness Gaps — Lessons from the WTW Loss

**Willis Towers Watson (WTW)** — Enterprise, Insurance (regulated), Americas

WTW chose Databricks/Snowflake over Fabric because:
- **Row-Level Security (RLS)** was preview-grade — missing cross-region RLS, multi-table predicates, enforcement against workspace admins
- RLS couldn't prevent offshore access to U.S. client data (legal hard requirement for insurance)
- Delivery timelines for GA RLS were unclear or marked "TBD"
- Databricks entered the conversation at the exact moment Fabric's security blockers became visible — was perceived as enterprise-ready with enforceable controls

**Strategic Lessons**:
1. **Never position Fabric features that are in preview for regulated workloads** (insurance, financial services, healthcare, government). Preview ≠ production for compliance teams.
2. **Check feature GA status early** in the engagement — before the customer's security/compliance team evaluates. If a required feature is preview, disclose proactively and propose a phased adoption plan with a clear GA timeline.
3. **Executive sponsorship and vision alignment don't override enterprise-readiness gaps.** WTW had both — and still chose the competitor because the technical validation failed.
4. **Watch for competitor timing.** Databricks and Snowflake monitor Microsoft announcements and position themselves as the "enterprise-ready alternative" when Fabric features are in preview. Anticipate this counter-move.
5. **Regulated industries require**: enforceable isolation (cross-region, cross-workspace), auditable access controls, and GA-level SLA on security features. If Fabric can't deliver these today, don't force the deal — plan for re-engagement when GA lands.

## 4. Solution Stack Patterns That Win

Use these as reference architectures when building account strategies:

### Data Platform Modernization (Analytics + BI)
`Fabric (OneLake + Data Factory + Warehouse + Power BI)` — replaces Redshift/BigQuery + ETL tools + BI tools
- Best for: customers with fragmented analytics stacks, dual-cloud data costs, or skill gaps across multiple tools.

### Real-Time / IoT Operations
`Fabric RTI + Event Stream + IoT Hub` — replaces Kinesis/Dataflow + Lambda + custom dashboards
- Best for: telco network ops, industrial IoT, utility monitoring, data center operations, gaming telemetry.

### AI-First Agentic Platform
`Fabric + Azure AI Foundry + Azure OpenAI + CosmosDB` — replaces SageMaker/Vertex AI + custom agent frameworks
- Best for: customers with agent/AI ambitions. Position: "Fabric is the data foundation, AI Foundry is the intelligence layer."
- Reference: Sky Corporation (100+ agents), InEight/Kiewit (agentic construction platform), McGraw Hill (4M AI transactions/month).

### SAP + Data Consolidation
`SAP RISE on Azure + Fabric` — replaces SAP on-prem/GCP + BigQuery
- Best for: SAP customers evaluating RISE. Once SAP moves to Azure, data naturally flows to Fabric instead of BigQuery.
- Reference: AGRANA/Südzucker (€10M MACC), MEO ($3M/yr).

### Full Ecosystem Play ("One Microsoft")
`Azure + Fabric + M365 + D365 + Security (Purview) + GitHub` — replaces multi-vendor fragmented stack
- Best for: strategic accounts where the CIO/CFO values vendor consolidation. The TCO + governance + security argument.
- Reference: Neoway ($10.8M MACC full Google takeout), Costa Coffee (D365 + Fabric native).

### Developer Productivity + AI
`GitHub Copilot + Azure AI Foundry + Azure OpenAI` — replaces ad-hoc AI dev tooling
- Best for: accounts with developer populations. Links GHCP adoption to AI platform consumption.
- Reference: McGraw Hill (GHCP + AI Foundry = 4M transactions first month).

## 5. Compete Analysis Checklist

When analyzing an account for compete strategy, run through this checklist:

1. **Current competitor footprint**: Which AWS/GCP/Snowflake/Databricks services is the customer using today?
2. **Data gravity**: Where does most of the customer's data live? Who controls the lake/warehouse?
3. **Integration surface**: Does the customer use D365, M365, SAP, or other Microsoft workloads that create native integration advantage?
4. **AI ambitions**: Is the customer exploring agents, copilots, or AI transformation? Position Fabric + AI Foundry as the unified path.
5. **Regulated?**: If yes — check Fabric feature GA status for all required security/compliance capabilities before positioning. Don't repeat the WTW pattern.
6. **SAP presence**: If SAP customer — SAP RISE on Azure is the anchor that pulls data workloads from GCP.
7. **Real-time needs**: If IoT/streaming — Fabric RTI is purpose-built and displaces custom AWS/GCP pipelines.
8. **Partner readiness**: Does the account have a partner who can deliver? If not, engage one early (Hexaware, Accenture, Rackspace, InCycle are proven).
9. **Funding available**: Can Azure Accelerate/Innovate reduce the customer's first-step risk?
10. **Multi-thread coverage**: Are SE + SSP + CSA + Partner all engaged, or is this single-threaded? Single-threaded deals are high-risk.

## 6. Industry × Compete Alignment

Map compete patterns to TMG industries for targeted plays:

### Telecommunications
- **Primary competitor**: GCP BigQuery (analytics), AWS (infra)
- **Winning stack**: Fabric RTI + OneLake + SAP RISE (for BSS/OSS data) + AI Foundry (network agents)
- **Reference wins**: MEO ($3M/yr GCP displacement), DLR ($768K real-time ops)
- **Play**: "Your network generates real-time data. Fabric RTI was built for this — not retrofitted like BigQuery/Kinesis."

### Media & Entertainment
- **Primary competitor**: AWS (Redshift + S3 + Lambda), GCP (BigQuery for audience analytics)
- **Winning stack**: Fabric (unified analytics) + AI Foundry (content personalization) + Azure compute (rendering/transcoding)
- **Reference wins**: LiveArena ($110K, unified analytics replacing AWS), LA Clippers ($20K, Fabric + AI agents)
- **Play**: "Content companies need speed-to-insight. Fabric unifies your audience data, content metadata, and ad performance in one place — AWS makes you build that from 6 separate services."

### Gaming
- **Primary competitor**: AWS (game backends, analytics), GCP (BigQuery for player analytics)
- **Winning stack**: Fabric (player analytics + ops) + Azure compute (game services) + AI Foundry (player engagement agents) + GitHub (multi-team CI/CD)
- **Play**: "Your player data is your moat. OneLake gives you one unified player data lake — matchmaking, engagement, fraud, monetization all from one source."

### Financial Services (Regulated)
- **Primary competitor**: Snowflake, Databricks (perceived "enterprise-ready")
- **Winning stack**: Fabric + Purview + Entra ID — but **only where GA security features meet requirements**
- **Reference loss**: WTW (Fabric RLS preview gap)
- **Play**: Assess compliance requirements FIRST. If Fabric GA features meet them, lead with Purview + governance. If gaps exist, propose phased adoption with clear GA timeline — don't force the deal.

### Consumer Goods / Retail
- **Primary competitor**: AWS Redshift, Snowflake
- **Winning stack**: Fabric + D365 native connectors + AI Foundry (customer personalization)
- **Reference wins**: Costa Coffee ($55K, D365 + Fabric native), Breitling ($100K, 20% e-commerce uplift)
- **Play**: "Your CRM data in D365 connects natively to Fabric — no ETL, no middleware. That's a week-one insight your Redshift/Snowflake setup takes months to build."

### Industrial / Utilities / Construction
- **Primary competitor**: GCP (analytics), AWS (IoT), Palantir (AI/ops)
- **Winning stack**: Fabric RTI + AI Foundry + CosmosDB (for edge/real-time)
- **Reference wins**: Veolia ($266K, 7K+ water plants), InEight/Kiewit ($150K, beat Palantir on agentic platform)
- **Play**: "Your operations generate time-series data at massive scale. Fabric RTI handles ingestion, analytics, and alerting in one platform — replacing the Kinesis + Lambda + Palantir patchwork."
