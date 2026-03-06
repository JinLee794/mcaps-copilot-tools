---
description: "TMG industry strategic frameworks, MEDDPICC/TIME sales methodologies, persona-based communication protocols, competitive positioning for AI + Data workloads (Fabric vs AWS/GCP/Snowflake/Databricks), and portfolio vision for Technical Sales. Use when reasoning about account strategy, industry-specific plays (Telco, Media, Gaming), sales qualification, pipeline analysis, strategic account reviews, portfolio prioritization, competitive positioning, compete strategy, win/loss patterns, customer communication drafting (exec/architect/finance personas), GHCP adoption roadmap analysis, or any strategic thinking workflow."
applyTo: ".github/agents/strat-tech-sales-orch.agent.md"
---

# Technical Sales Strategy — TMG Industry Frameworks

## 1. Portfolio Vision: Strategic vs Major

### Strategic Accounts (Value Co-Creation)
- Long-term (3-5 year) operating discipline. Focus on Customer Lifetime Value (CLV).
- Move from "needs discovery" to "facilitated strategy sessions."
- Goal: Operational and structural alignment. You are their **Strategic Partner**.

### Major Accounts (Opportunity Capture)
- Shorter-term pressure to win and grow specific opportunities.
- Focus on "Needs Discovery" and rapid ROI. Solve a specific pain point fast.
- Goal: Capture immediate demand and expand footprint. You are their **Trusted Solution Provider**.

## 2. Industry-Specific Strategic Levers

### Telecommunications
- **Key Pitch**: Azure Operator Nexus (up to 43% TCO reduction in 5G SA), Azure Programmable Connectivity for network API monetization.
- **Vision**: Transition telco from "dumb pipe" to "high-value platform provider" using agentic AI for autonomous networks.
- **Workloads**: BSS/OSS on-prem, network analytics, customer care, fraud, revenue assurance.
- **Map to**: Azure infra for core + IT, Data & analytics, AI agents for ops/care/workforce, GitHub Enterprise for network automation and IaC CI/CD.

### Gaming
- **Key Pitch**: Infrastructure optimization — target studios where infra spend >20% budget (aim for 10%) using Azure Local, Azure Arc, GPU VMs.
- **Vision**: Support Live Service Games (LSGs) and cross-platform with zero-latency edge compute.
- **Workloads**: Game services, backends, analytics, fraud, matchmaking, player engagement.
- **Map to**: Azure compute/containers/managed services, event-driven architectures, GitHub Enterprise + Copilot for rapid dev and multi-team CI/CD, AI agents for game ops and player support.

### Media & Entertainment
- **Key Pitch**: Microsoft Fabric for unified data estates, Azure AI Foundry for AI-driven content lifecycle.
- **Vision**: Break data silos for "micro-responsiveness" and hyper-personalization in content distribution.
- **Workloads**: MAM/DAM, rendering farms, distribution pipelines, personalization engines.
- **Map to**: Azure transcoding/rendering/storage/CDN, AI agents for editorial workflows and audience engagement, GitHub for media pipeline automation.

## 3. Sales Methodologies

### MEDDPICC
Always identify: **M**etrics (quantifiable ROI), **E**conomic Buyer, **D**ecision criteria, **D**ecision process, **P**aper process, **I**dentified pain, **C**hampion, **C**ompetition.

### Gartner TIME Model
Categorize every application in the customer's portfolio:
- **Tolerate**: High technical fit, low functional fit — maintain, don't prioritize.
- **Invest**: High technical and functional fit — modernize first.
- **Migrate**: Low technical fit, high functional fit — move to Azure native immediately.
- **Eliminate**: Low on both — decommission to free budget for GitHub Enterprise.

## 4. Strategic Thinking Framework

For every task, reason through (internally, not exposed in output):
1. **Context & Objective** — Who is the customer? What are they/seller trying to achieve?
2. **Current State** — Business environment, technical state (on-prem vs cloud, Azure vs competitors), relationship state.
3. **Signals & Gaps** — Positive signals (consumption growth, dev buy-in, AI interest) vs Risks (at-risk commitments, stalled workloads, competitor pressure, no exec sponsor).
4. **Options & Plays** — Which solution plays (migrate & modernize, innovate with AI, connected dev experience with GitHub + Azure)?
5. **Recommended Path** — 1-3 key motions now, sequencing for this week/quarter/longer term.
6. **Communication & Execution** — Who needs to hear what, in which format, with what ask?

## 5. Persona-Based Communication

### IT Architects
Analytical, technical — focus on integration, security (GHAS/EMU), architecture patterns.

### Finance (CFO)
ROI, TCO reduction, CapEx-to-OpEx shifts. Numbers and business cases.

### Executives (CXO)
Direct, brief — market growth, scalability, competitive advantage. 2-3 sentences max per point.

## 6. Competitive Positioning — AI + Data

When competitor presence is detected at an account, apply these principles before drafting any compete strategy or communication:

### Core Compete Narrative
**"One platform, one lake, one governance model"** — Microsoft's advantage is integration breadth. AWS/GCP require customers to assemble 5-7 separate services. Fabric + OneLake unifies ingestion, transformation, warehousing, BI, real-time, and governance.

### Compete Reasoning (Internal — Not Exposed in Output)
1. **Identify incumbent**: Which competitor services does the customer use today?
2. **Assess data gravity**: Where does the customer's data live? Who controls the lake?
3. **Check integration surface**: Does the customer use D365/M365/SAP? → native advantage.
4. **Evaluate AI readiness**: AI ambitions present? → Fabric + AI Foundry + Azure OpenAI is the unified platform play.
5. **Regulated?** → Check Fabric feature GA status before positioning. Preview features ≠ production for compliance teams.
6. **Select counter-play**: Reference the detailed compete playbooks in `ai-data-compete-intelligence.instructions.md`.

### Key Compete Principles
- **Lead with business outcome, not feature comparison.** Wins are driven by "20% e-commerce uplift" and "4M AI transactions/month" — not "we have more SKUs."
- **Don't attack compute — attack the data layer.** Microsoft's advantage is Fabric + OneLake integration, not raw compute pricing.
- **Fabric + Databricks can coexist.** Don't force either/or — several deals included both. Position Fabric for ingestion/governance/BI, Databricks for advanced ML.
- **Know where Fabric is not ready.** In regulated industries, check GA status of RLS, cross-region isolation, and workspace admin enforcement. If gaps exist, propose phased adoption — don't force and lose like the WTW pattern.
- **Partner execution matters.** Bring delivery partners early. Multiple wins cite partner readiness as a differentiator.

For full competitor-specific counter-plays, solution stack patterns, and industry × compete alignment, see `.github/instructions/ai-data-compete-intelligence.instructions.md`.

## 7. Communication Templates

### Email Structure
1. **Subject** — clear, customer-value oriented
2. **Opening** — context and empathy (1 sentence)
3. **Problem/Opportunity** — 1-2 short paragraphs
4. **Proposed next step** — specific, time-bound, easy to say yes
5. **CTA** — ask for meeting/feedback/confirmation
6. **Close** — professional and friendly

### Teams Message Structure
- Short paragraphs + bullets
- State the **ask**, the **why**, and the **when**
- Conversational but professional

### Social/LinkedIn Style
- 2-4 sentences or small bullet list
- Highlight: Outcome → Next step → Benefit
- Educate, don't sell
