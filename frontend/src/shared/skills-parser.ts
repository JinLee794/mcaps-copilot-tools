// Skills Parser — parses SKILLS.md YAML frontmatter + body into SkillDefinition (§7.1)
//
// Shared module usable from both main process (SkillsLoader) and
// renderer (SkillEditor preview).

import type { SkillDefinition, SkillFlow } from './types/SkillDefinition';

/**
 * Parse a skill markdown file into a SkillDefinition.
 * Handles the YAML frontmatter (name, description, argument-hint) and
 * optional body sections (## Workflow, ## Workflow Auto-Promote, flows).
 */
export function parseSkillFile(content: string, filePath: string): SkillDefinition | null {
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;

  const frontmatter = frontmatterMatch[1];
  const body = content.slice(frontmatterMatch[0].length).trim();

  const name = extractField(frontmatter, 'name');
  if (!name) return null;

  const description = extractField(frontmatter, 'description') ?? '';
  const argumentHint = extractField(frontmatter, 'argument-hint') ?? '';

  // Extract MCP tools mentioned in the body
  const mcpTools = extractMcpTools(body);

  // Extract flows from body sections
  const flows = extractFlows(body);

  // Build system prompt from the full body content
  const systemPrompt = body;

  return {
    id: name,
    name,
    description,
    argumentHint,
    filePath,
    systemPrompt,
    mcpTools,
    flows,
  };
}

/**
 * Extract a YAML field value from frontmatter text.
 * Handles multi-line values with indented continuation lines.
 */
function extractField(frontmatter: string, field: string): string | null {
  const regex = new RegExp(`^${field}:\\s*(.+(?:\\n(?:  |\\t).+)*)`, 'm');
  const match = frontmatter.match(regex);
  if (!match) return null;
  return match[1].replace(/\n\s+/g, ' ').trim();
}

/**
 * Extract MCP tool names referenced in the skill body.
 * Looks for backticked tool names that match known patterns.
 */
function extractMcpTools(body: string): string[] {
  const toolPattern = /`(crm_auth_status|crm_whoami|crm_login|list_accounts_by_tpid|list_opportunities|get_milestones|get_milestone_activities|crm_get_record|crm_query|crm_list_entity_properties|get_task_status_options|view_milestone_timeline|view_opportunity_cost_trend|view_staged_changes_diff|create_task|update_task|close_task|update_milestone|ask_work_iq|find_milestones_needing_tasks)`/g;

  const tools = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = toolPattern.exec(body)) !== null) {
    tools.add(match[1]);
  }
  return Array.from(tools);
}

/**
 * Extract named flows from body sections (## headings).
 */
function extractFlows(body: string): SkillFlow[] {
  const flows: SkillFlow[] = [];
  const sections = body.split(/^## /m).slice(1); // Split by ## headings

  for (const section of sections) {
    const lines = section.split('\n');
    const heading = lines[0].trim();
    const content = lines.slice(1).join('\n').trim();

    // Skip metadata sections
    if (['Workflow', 'Workflow Auto-Promote'].includes(heading)) continue;

    flows.push({
      name: heading,
      trigger: '',
      steps: extractFlowSteps(content),
      outputSchema: [],
    });
  }

  return flows;
}

/**
 * Extract numbered steps from a flow section.
 */
function extractFlowSteps(content: string): string[] {
  const steps: string[] = [];
  const stepPattern = /^\d+\.\s+(.+)$/gm;

  let match: RegExpExecArray | null;
  while ((match = stepPattern.exec(content)) !== null) {
    steps.push(match[1].trim());
  }
  return steps;
}

/**
 * Serialize a SkillDefinition back to SKILLS.md format.
 */
export function serializeSkillFile(skill: SkillDefinition): string {
  const lines: string[] = [];

  lines.push('---');
  lines.push(`name: ${skill.name}`);
  lines.push(`description: ${skill.description}`);
  if (skill.argumentHint) {
    lines.push(`argument-hint: ${skill.argumentHint}`);
  }
  lines.push('---');
  lines.push('');

  if (skill.systemPrompt) {
    lines.push(skill.systemPrompt);
  }

  return lines.join('\n');
}
