# GitHub Copilot — Q&A Knowledge Base

Curated questions and answers about GitHub Copilot pricing, licensing, features, and operational details. Use this as a reference when customers or internal stakeholders ask GHCP-related questions.

---

## PRU (Premium Request Units)

### Q1: How does the user-level PRU budget private preview work? How are additional PRUs assigned to individual users?

**A:** In the private preview, admins can set per-user PRU budgets via the API — specifically a `POST` call to set the budget allocation for individual users. This allows organizations to give specific developers higher PRU allowances beyond the base included with their seat.

The additional PRU budget **resets monthly** — it is use-it-or-lose-it. Unused PRUs do **not** roll over to the next billing cycle.

### Q2: If an enterprise creates a universal/shared PRU budget and all developers consume PRUs from it, do those developers still need to pay the $19/$39 per-seat license?

**A:** **Yes.** The per-seat license ($19/month for Copilot Business, $39/month for Copilot Enterprise) is **still required** regardless of how PRU consumption is funded.

These are two separate cost layers:
- **Seat license** ($19/$39) — grants access to GitHub Copilot features (code completions, chat, etc.)
- **PRU budget** — governs consumption of premium models (Claude Sonnet, GPT-4o, Gemini, etc.) on top of the base seat

A centralized cost-center PRU budget does **not** replace or include the seat fee. Every user consuming Copilot must have a paid seat, and the PRU budget is an additional allocation on top of that.

---

## Custom Instructions (Organization-Level)

### Q3: Can an organization define custom instructions that apply to all Copilot users across the org?

**A:** **Yes.** Organization owners can add custom instructions that automatically apply to all Copilot Chat conversations for members of the organization. This lets orgs enforce coding standards, preferred frameworks, language conventions, or internal guidelines without each developer configuring them individually.

Setup and details: [Add organization instructions for GitHub Copilot](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/configure-custom-instructions/add-organization-instructions)

---

*Last updated: 2026-03-02*
