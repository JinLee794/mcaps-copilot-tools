# Welcome to the Agentic Era — Presentation Prompt

> **Prompt for AI presentation generators** (Gamma, Beautiful.ai, Copilot in PowerPoint, etc.)
>
> Paste everything between `PROMPT START` and `PROMPT END` as a single prompt.

## Table of Contents

- [PROMPT START](#prompt-start)
  - [Slide 1 — Title](#slide-1--title)
  - [Slide 2 — The Moment We're In](#slide-2--the-moment-were-in)
  - [Slide 3 — What Changed](#slide-3--what-changed)
  - [Slide 4 — The Big Idea](#slide-4--the-big-idea)
  - [Slide 5 — How This Project Demonstrates It](#slide-5--how-this-project-demonstrates-it)
  - [Slide 6 — The Pattern (Not the Product)](#slide-6--the-pattern-not-the-product)
  - [Slide 7 — Natural Language Configuration](#slide-7--natural-language-configuration)
  - [Slide 8 — MCP: The Universal Connector](#slide-8--mcp-the-universal-connector)
  - [Slide 9 — Your Knowledge, Compounding](#slide-9--your-knowledge-compounding)
  - [Slide 10 — Safe by Design](#slide-10--safe-by-design)
  - [Slide 11 — Guardrails for Builders](#slide-11--guardrails-for-builders)
  - [Slide 12 — The Interfaces](#slide-12--the-interfaces)
  - [Slide 13 — What This Looks Like in Practice](#slide-13--what-this-looks-like-in-practice)
  - [Slide 14 — The Skills You'll Build](#slide-14--the-skills-youll-build)
  - [Slide 15 — Why Now](#slide-15--why-now)
  - [Slide 16 — The Invitation](#slide-16--the-invitation)
  - [Slide 17 — The Moment Is Yours](#slide-17--the-moment-is-yours)
  - [Slide 18 — Get Started](#slide-18--get-started)
- [PROMPT END](#prompt-end)
- [Usage Notes](#usage-notes)

---

## PROMPT START

Create a **Microsoft-branded executive presentation** (16:9, dark theme with Fluent Design accents — Microsoft Blue `#0078D4`, accent teal `#00B7C3`, warm gray `#E6E6E6` on charcoal `#1B1B1B` backgrounds). Use clean sans-serif typography (Segoe UI or equivalent). Every slide should be **visual-first** — big imagery, one idea per slide, minimal text, bold callouts. Target **16–18 slides**. Tone: **inspiring, accessible, human**. This is not a product demo — it's an invitation to explore what's now possible.

---

### SLIDE 1 — TITLE

**Welcome to the Agentic Era**

Subtitle: *The tools are here. The skills are learnable. The impact is personal.*

Visual: Wide gradient from midnight blue to teal. A single glowing cursor blinking next to the words "How can I help?" — evoking a conversation, not a dashboard. Microsoft logo bottom-right, small.

---

### SLIDE 2 — THE MOMENT WE'RE IN

**AI just became something you can talk to — and it talks back to your systems**

Visual: Timeline showing three eras, each as a glowing node on a horizontal line:

```
  2015              2023              NOW
  ●─────────────────●─────────────────●
  Cloud-first       Copilot arrives    Agents act
  "Move to the      "AI assists        "AI connects
   cloud"            your writing"      your work"
```

One-line insight: *We went from cloud infrastructure → AI assistance → AI that understands your context and takes action on your behalf.*

Tagline at bottom: *"This repo is a working example of that third era."*

---

### SLIDE 3 — WHAT CHANGED

**Three technologies converged — and they're all available to you right now**

Three large icon columns, connected by faint lines:

| GitHub Copilot | Model Context Protocol (MCP) | Natural Language Configuration |
|---|---|---|
| The interface | The bridge | The brain |
| Chat in VS Code or terminal. Ask questions. Give instructions. The AI reasons and acts. | An open standard that lets AI connect to *any* system — CRM, email, knowledge bases, APIs — through lightweight servers. | Markdown files that tell the agent *who you are*, *what matters*, and *how to behave*. No code required. |

Tagline: *"A conversational interface. A universal connector. Instructions written in plain English. That's it."*

---

### SLIDE 4 — THE BIG IDEA

**You can now build a second brain — one that actually does things**

Visual: Split metaphor. Left side: a human brain (organic, warm tones). Right side: a structured knowledge graph (cool tones, connected nodes). They overlap in the center, glowing.

Three attributes radiating from center:
- **Remembers** — A personal vault that grows with every conversation and meeting note
- **Connects** — Pulls context from CRM, email, chat, and documents into one response
- **Acts** — Stages updates, surfaces risks, prepares reviews — then waits for your approval

Tagline: *"Not a tool you learn. A partner that learns you."*

---

### SLIDE 5 — HOW THIS PROJECT DEMONSTRATES IT

**A real, working agent system — built with technologies any team can adopt**

Visual: Simple layered diagram, three rows, clean and minimal:

```
┌──────────────────────────────────────────────────┐
│  YOU  →  Copilot Chat / Copilot CLI              │
│          Natural language — just ask              │
├──────────────────────────────────────────────────┤
│  PROMPTS  →  Instructions & Skills (markdown)    │
│              Tell the agent your role, your       │
│              process, your priorities             │
├──────────────────────────────────────────────────┤
│  MCP SERVERS  →  Domain context & action         │
│   Sales CRM  ·  M365 evidence  ·  Knowledge vault│
│   (any system you want to connect)               │
└──────────────────────────────────────────────────┘
```

Callout: *"This project connects to sales data and M365 — but the pattern works for any domain. Your team, your systems, your workflows."*

---

### SLIDE 6 — THE PATTERN (NOT THE PRODUCT)

**What you're really looking at**

Four concentric rings expanding outward. This is the reusable pattern, not the specific implementation:

| Ring | What It Is | In This Project | In Your World |
|---|---|---|---|
| **Interface** | How you talk to the agent | Copilot Chat + Copilot CLI | Same — already available to you |
| **Instructions** | How the agent knows your context | Markdown files describing sales roles & processes | Your team's playbook, written in plain English |
| **Skills** | What the agent can do when asked | 27 skills for sales workflows | Whatever your team repeats weekly |
| **Connectors** | Where the agent gets/puts data | MCP servers for CRM, M365, Obsidian vault | Any API, any database, any system |

Tagline: *"The technologies are the platform. What you build on them is yours."*

---

### SLIDE 7 — NATURAL LANGUAGE CONFIGURATION

**Teaching an agent is as simple as writing a document**

Visual: Side-by-side. Left: a short markdown file (styled as a code editor screenshot). Right: the agent responding intelligently based on that file.

Left panel (simplified):
```markdown
# Role: Customer Success Manager
You help track customer health, adoption milestones,
and relationship continuity. When reviewing milestones,
flag anything overdue or at risk. Always check vault
notes for prior context before responding.
```

Right panel (agent response):
```
"Your Contoso review shows 4 active milestones,
 1 overdue. Vault notes from last month mention
 an exec sponsor change — worth confirming before
 Thursday's meeting."
```

Insight callout: *"No Python. No YAML. No API schemas. Just a markdown file that says 'here's who I am and here's how I work.'"*

---

### SLIDE 8 — MCP: THE UNIVERSAL CONNECTOR

**Model Context Protocol turns any system into an AI-native data source**

Visual: Hub-and-spoke diagram. Center: "Your Agent." Spokes radiating to icons representing different systems:

- CRM / Sales data
- Email & Calendar
- Chat & Meetings
- Knowledge bases & Notes
- Any REST API
- Databases
- Internal tools

Callout: MCP is an **open standard** — not proprietary to any vendor. One protocol, infinite connections.

Key insight: *"In this project, we connected three systems. But the protocol supports anything. Your IT ticketing system. Your design tool. Your internal wiki. If it has an API, it can speak MCP."*

---

### SLIDE 9 — YOUR KNOWLEDGE, COMPOUNDING

**The vault: a second brain that grows smarter over time**

Visual: Growth curve. X-axis = weeks. Y-axis = "Context richness."

- **Week 1**: Agent reads CRM. Basic answers. *(flat)*
- **Week 4**: You've captured meeting notes, customer profiles, relationship maps. Agent cross-references them. *(rising)*
- **Week 8**: Patterns emerge. Agent proactively surfaces risks, connections, opportunities you hadn't noticed. *(steep)*
- **Week 12+**: The agent knows your accounts better than any single handoff doc ever could. *(exponential)*

Annotation: *"Every note you write, every meeting you capture — it all feeds forward. This isn't a tool you use and forget. It compounds."*

---

### SLIDE 10 — SAFE BY DESIGN

**Agents that act responsibly — because you're always in the loop**

Visual: Three-step flow, clean and large:

```
  ASK          →       PREVIEW        →       APPROVE
  "Update the          Agent stages            You see the diff.
   milestone"          the change.             Say yes — or don't.
```

Key principles as icon badges below:
- **No surprise writes** — Every mutation is staged and shown before execution
- **Auto-expire** — Staged changes disappear if ignored (no stale queues)
- **Audit trail** — Everything the agent does is logged

Tagline: *"The agent proposes. You decide. That's the trust model."*

---

### SLIDE 11 — GUARDRAILS FOR BUILDERS

**Built-in evaluators keep your agent sharp**

Visual: Quality dashboard mockup showing green/yellow/red checks:

```
✅  Skill descriptions: Clear, keyword-rich, discoverable
✅  Context budget: Under token ceiling (no bloated prompts)
⚠️  Confusion risk: 2 skills with overlapping descriptions
✅  Instruction routing: All files pass quality lint
✅  Regression check: No accuracy drop from last change
```

Explanation: This project includes an **evaluation framework** that:
- **Lints** skill and instruction files for quality (description length, keywords, structure)
- **Detects confusion** between overlapping skills so the agent routes to the right one
- **Measures regression** — catches when a change makes routing worse
- **Enforces token budgets** — prevents context from growing uncontrollably

Tagline: *"You're not flying blind. The evaluators teach you best practices as you build."*

---

### SLIDE 12 — THE INTERFACES

**Multiple ways in. Same intelligence underneath.**

Three panels side by side:

| VS Code Chat | Copilot CLI | Agent Mode |
|---|---|---|
| Chat panel inside your editor. Ask questions, get answers with full tool access. | Terminal-native. `copilot "review my pipeline"` — no IDE required. | Autonomous mode: agent reads files, runs tools, proposes edits — you review. |

Visual: Screenshots or mockups of each interface, dark-themed, showing a natural language prompt and the agent responding.

Tagline: *"Pick the interface that fits your flow. The agent adapts."*

---

### SLIDE 13 — WHAT THIS LOOKS LIKE IN PRACTICE

**A conversation, not a workflow**

Chat transcript mockup (dark theme, simple):

```
👤  "I have a customer meeting Thursday with Contoso.
     Help me prepare."

🤖  Pulling from your vault and CRM...

    📊  3 active milestones — 1 overdue (Azure POC).
    📝  Your last meeting note flagged a new CTO who
        hasn't attended since onboarding.
    💬  Teams shows a licensing concern raised Tuesday.

    ⚠️  Recommendation: Request a 1:1 with the new CTO
        before Thursday. The overdue POC milestone and
        the licensing concern are connected — worth
        addressing together.

    Want me to draft an agenda and stage a milestone
    update?
```

Tagline: *"Five minutes. Full preparation. Zero tab-switching."*

---

### SLIDE 14 — THE SKILLS YOU'LL BUILD

**Working with agents is the new literacy**

Visual: Skill tree / progression path, left to right:

```
CONFIGURE            CUSTOMIZE             CREATE
─────────────────────────────────────────────────────
Write an instruction  Add a skill           Build an MCP server
file for your role    for your workflow      for your systems

"Here's who I am      "When I say 'weekly    "Connect my team's
 and how I work"       review', do this"      ticketing system"
```

Below: Callout box:

> **You don't need to be a developer.** The first step is a markdown file. The second step is a conversation. The third step is optional — and that's where it gets really fun.

Tagline: *"The learning curve is a conversation."*

---

### SLIDE 15 — WHY NOW

**This wasn't possible 12 months ago**

Timeline with capability unlocks:

| When | What Became Available | What It Enables |
|---|---|---|
| 2024 | **MCP** — open standard for tool connectivity | Any system can be AI-accessible |
| 2024 | **Copilot Extensions** — custom agent modes | Domain-specific AI in your editor |
| 2025 | **Copilot CLI** — terminal-native AI | No IDE needed, works anywhere |
| 2025 | **Agent Mode** — autonomous multi-step execution | Agent reads, reasons, acts, and iterates |
| Now | **This project** — all of the above, wired together | A working proof that *you can build this too* |

Tagline: *"Every piece exists. This project just shows how they fit together."*

---

### SLIDE 16 — THE INVITATION

**Learn. Experiment. Build your second brain.**

The Agentic Flywheel — circular diagram, three arcs:

```
         ┌───────────┐
         │   LEARN   │  ← Explore what's possible.
         │           │     Read the skills. Ask the agent.
         └─────┬─────┘
               │
      ┌────────▼────────┐
      │   EXPERIMENT    │  ← Try a workflow. Stage a change.
      │                 │     See what the agent can do.
      └────────┬────────┘
               │
      ┌────────▼────────┐
      │     BUILD       │  ← Write your own instructions.
      │                 │     Capture your knowledge. Create skills.
      └────────┬────────┘
               │
               └───────▶ (back to LEARN — each loop makes you better)
```

Tagline: *"No certification. No course. Start a conversation and see what happens."*

---

### SLIDE 17 — THE MOMENT IS YOURS

**This is the most exciting time to learn how to work with AI**

Visual: Dark background. Single spotlight on a large, clean quote:

> *"The agentic era isn't about AI replacing what you do.*
> *It's about AI amplifying who you are —*
> *your knowledge, your judgment, your relationships.*
> *The tools are here. The only question is: what will you build?"*

Small text below: *MCAPS Copilot Tools — an open-source starting point for your journey.*

---

### SLIDE 18 — GET STARTED

**Five minutes. No prerequisites beyond curiosity.**

Three CTAs, large and visual:

1. **Clone & explore** — Open the repo. Read the prompts. See how instructions shape behavior.
2. **Start a conversation** — Ask the agent "Who am I?" and follow the thread.
3. **Make it yours** — Write one instruction file. Capture one meeting note. Watch the agent get smarter.

Repo URL centered and prominent.

Bottom: *"Share this with a colleague. Learn together. The agentic era is a team sport."*

---

## PROMPT END

---

## USAGE NOTES

**For Gamma / Beautiful.ai**: Paste everything between `PROMPT START` and `PROMPT END` as a single prompt.

**For Copilot in PowerPoint**: Paste each `### SLIDE N` section individually, then assemble.

**For manual deck creation**: Use the descriptions as content blueprints. ASCII diagrams map to SmartArt or Mermaid visuals.

**Audience calibration**:
- **Executive / leadership**: Slides 1-4, 9, 15, 17-18 — the "why now" and vision story.
- **Peers / account teams**: Full deck — the demos (13) and flywheel (16) are the heart.
- **Technical / builders**: Emphasize slides 5-8, 11, 14 — the pattern and the evaluators.
- **Skeptics**: Lead with slides 2, 10, 11 — the "what changed," safety, and guardrails.
