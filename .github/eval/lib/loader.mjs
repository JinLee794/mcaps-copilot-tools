import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

/**
 * Parse YAML frontmatter from a markdown file.
 * Returns an object with frontmatter keys (empty object if none found).
 */
export function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  try {
    return yaml.load(match[1]) || {};
  } catch {
    return {};
  }
}

/**
 * Load all skill files from `dir`, returning:
 *   { file, name, description, argumentHint, lines, searchText }
 *
 * Supports two layouts:
 *   - Flat: dir contains *-SKILL.md or *_SKILL.md files directly
 *   - Nested: dir contains subdirs, each with a SKILL.md inside
 */
export function loadSkills(dir) {
  if (!existsSync(dir)) return [];
  const entries = readdirSync(dir, { withFileTypes: true });

  const skills = [];

  // Flat layout — legacy files like CSAM_SKILL.md
  for (const e of entries) {
    if (e.isFile() && (e.name.endsWith('-SKILL.md') || e.name.endsWith('_SKILL.md'))) {
      const content = readFileSync(join(dir, e.name), 'utf-8');
      const fm = parseFrontmatter(content);
      const lines = content.split('\n').length;
      const searchText = [fm.name, fm.description, fm['argument-hint']]
        .filter(Boolean)
        .join(' ');
      skills.push({
        file: e.name,
        name: fm.name || e.name,
        description: fm.description || '',
        argumentHint: fm['argument-hint'] || '',
        lines,
        searchText,
      });
    }
  }

  // Nested layout — subdirs with SKILL.md (e.g. risk-surfacing/SKILL.md)
  for (const e of entries) {
    if (!e.isDirectory() || e.name.startsWith('_')) continue;
    const skillPath = join(dir, e.name, 'SKILL.md');
    if (!existsSync(skillPath)) continue;
    const content = readFileSync(skillPath, 'utf-8');
    const fm = parseFrontmatter(content);
    const lines = content.split('\n').length;
    const searchText = [fm.name, fm.description, fm['argument-hint']]
      .filter(Boolean)
      .join(' ');
    // Canonical file name matches the convention used in test-cases.yaml
    const fileName = `${e.name}-SKILL.md`;
    skills.push({
      file: fileName,
      name: fm.name || e.name,
      description: fm.description || '',
      argumentHint: fm['argument-hint'] || '',
      lines,
      searchText,
    });
  }

  return skills;
}

/**
 * Load instruction files from `dir`, returning:
 *   { file, description, applyTo, lines, searchText }
 *
 * Expects files named *.instructions.md with YAML frontmatter containing
 * `description` and optionally `applyTo`.
 */
export function loadInstructions(dir) {
  if (!existsSync(dir)) return [];
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries
    .filter(e => e.isFile() && e.name.endsWith('.instructions.md'))
    .map(e => {
      const content = readFileSync(join(dir, e.name), 'utf-8');
      const fm = parseFrontmatter(content);
      const lines = content.split('\n').length;
      return {
        file: e.name,
        description: fm.description || '',
        applyTo: fm.applyTo || null,
        lines,
        searchText: fm.description || '',
      };
    });
}

/**
 * Load MCP tool catalog from a YAML file.
 * Returns: [{ server, name, id, description, searchText }]
 *
 * `id` is "server:name" (e.g. "msx:crm_whoami").
 * `searchText` is the description used for embedding similarity.
 */
export function loadTools(catalogPath) {
  if (!existsSync(catalogPath)) return [];
  const raw = readFileSync(catalogPath, 'utf-8');
  const { tools } = yaml.load(raw);
  if (!Array.isArray(tools)) return [];
  return tools.map(t => ({
    server: t.server,
    name: t.name,
    id: `${t.server}:${t.name}`,
    description: t.description || '',
    searchText: t.description || '',
  }));
}
