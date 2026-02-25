// Skills Loader — watches .github/skills/*_SKILL.md and parses YAML frontmatter (§7.1, §11)
import { readFile, readdir, writeFile } from 'fs/promises';
import { join, basename } from 'path';
import { existsSync } from 'fs';

export interface SkillInfo {
  id: string;
  name: string;
  description: string;
  argumentHint: string;
  filePath: string;
  rawContent: string;
}

export class SkillsLoader {
  private skills: Map<string, SkillInfo> = new Map();
  private skillsDir: string;

  constructor(workspaceRoot?: string) {
    const root = workspaceRoot ?? this.findWorkspaceRoot();
    this.skillsDir = join(root, '.github', 'skills');
  }

  private findWorkspaceRoot(): string {
    let dir = process.cwd();
    while (dir !== '/') {
      if (existsSync(join(dir, '.vscode', 'mcp.json'))) return dir;
      dir = join(dir, '..');
    }
    return process.cwd();
  }

  async load(): Promise<void> {
    this.skills.clear();

    if (!existsSync(this.skillsDir)) {
      console.warn(`[Skills Loader] Skills directory not found: ${this.skillsDir}`);
      return;
    }

    const files = await readdir(this.skillsDir);
    const skillFiles = files.filter((f) => f.endsWith('_SKILL.md') || f.endsWith('SKILL.md'));

    for (const file of skillFiles) {
      const filePath = join(this.skillsDir, file);
      const content = await readFile(filePath, 'utf-8');
      const parsed = this.parseFrontmatter(content, filePath);
      if (parsed) {
        this.skills.set(parsed.id, parsed);
      }
    }
  }

  private parseFrontmatter(content: string, filePath: string): SkillInfo | null {
    const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!match) return null;

    const frontmatter = match[1];
    const name = this.extractField(frontmatter, 'name') ?? basename(filePath, '.md');
    const description = this.extractField(frontmatter, 'description') ?? '';
    const argumentHint = this.extractField(frontmatter, 'argument-hint') ?? '';

    return {
      id: name,
      name,
      description,
      argumentHint,
      filePath,
      rawContent: content,
    };
  }

  private extractField(frontmatter: string, field: string): string | null {
    // Handle multi-line YAML values (indented continuation lines)
    const regex = new RegExp(`^${field}:\\s*(.+(?:\\n(?:  |\\t).+)*)`, 'm');
    const match = frontmatter.match(regex);
    if (!match) return null;
    return match[1].replace(/\n\s+/g, ' ').trim();
  }

  getSkills(): Array<{ id: string; name: string; description: string }> {
    return Array.from(this.skills.values()).map(({ id, name, description }) => ({
      id,
      name,
      description,
    }));
  }

  getSkill(skillId: string): SkillInfo | undefined {
    return this.skills.get(skillId);
  }

  async saveSkill(skillId: string, content: string): Promise<void> {
    const skill = this.skills.get(skillId);
    if (!skill) throw new Error(`Skill not found: ${skillId}`);

    await writeFile(skill.filePath, content, 'utf-8');
    // Re-parse the updated content
    const parsed = this.parseFrontmatter(content, skill.filePath);
    if (parsed) {
      this.skills.set(parsed.id, parsed);
    }
  }
}
