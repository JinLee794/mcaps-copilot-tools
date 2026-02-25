// Skill definition — parsed from .github/skills/*_SKILL.md YAML frontmatter (§7.1)

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  argumentHint: string;
  filePath: string;
  systemPrompt: string;
  mcpTools: string[];
  flows: SkillFlow[];
}

export interface SkillFlow {
  name: string;
  trigger: string;
  steps: string[];
  outputSchema: string[];
}

export interface SkillContext {
  userPrompt: string;
  accountId?: string;
  accountName?: string;
  opportunityId?: string;
  timeWindow?: string;
  depth?: number;
  outputFormat?: string;
  includeSources?: {
    transcripts: boolean;
    emails: boolean;
    teams: boolean;
    msxActivity: boolean;
    competitorSignals: boolean;
  };
}

export interface SkillTunerParams {
  accountContext: string;
  timeWindow: string;
  depth: 1 | 2 | 3;
  outputFormat: string;
  includeSources: Record<string, boolean>;
}
