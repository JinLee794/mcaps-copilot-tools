import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
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
 * Supports both conventions:
 *   - Folder: <name>/SKILL.md  (auto-discoverable by VS Code, primary)
 *   - Flat:   <name>-SKILL.md  (legacy, fallback)
 *
 * Internal `file` identifier uses `<name>/SKILL.md` for folder-based skills
 * and `<name>-SKILL.md` for legacy flat files.
 */
export function loadSkills(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const seen = new Set();
  const skills = [];

  // Folder convention (primary): <name>/SKILL.md
  for (const e of entries) {
    if (!e.isDirectory() || e.name.startsWith('_')) continue;
    const skillPath = join(dir, e.name, 'SKILL.md');
    if (!existsSync(skillPath)) continue;
    const canonName = `${e.name}/SKILL.md`;
    seen.add(canonName);
    const content = readFileSync(skillPath, 'utf-8');
    const fm = parseFrontmatter(content);
    const lines = content.split('\n').length;
    const searchText = [fm.name, fm.description, fm['argument-hint']]
      .filter(Boolean)
      .join(' ');
    skills.push({
      file: canonName,
      name: fm.name || e.name,
      description: fm.description || '',
      argumentHint: fm['argument-hint'] || '',
      lines,
      searchText,
    });
  }

  // Flat convention (legacy fallback): <name>-SKILL.md
  for (const e of entries) {
    if (!e.isFile() || !(e.name.endsWith('-SKILL.md') || e.name.endsWith('_SKILL.md'))) continue;
    // Skip if folder version already loaded
    const baseName = e.name.replace(/[-_]SKILL\.md$/, '');
    if (seen.has(`${baseName}/SKILL.md`)) continue;
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

  return skills;
}

/**
 * Load all instruction files from `dir`, returning:
 *   { file, description, applyTo, lines, searchText }
 */
export function loadInstructions(dir) {
  if (!existsSync(dir)) return [];
  const entries = readdirSync(dir).filter(f => f.endsWith('.instructions.md'));
  return entries.map(file => {
    const content = readFileSync(join(dir, file), 'utf-8');
    const fm = parseFrontmatter(content);
    const lines = content.split('\n').length;
    return {
      file,
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

// ── Git-ref helpers ──────────────────────────────────────────────

/** Resolve git repo root so commands work from any CWD. */
function gitRoot() {
  return execSync('git rev-parse --show-toplevel', {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim();
}

/**
 * Read a file from a git ref (branch/tag/commit).
 * Returns the file content as a string, or null if the file doesn't exist.
 */
function gitShow(ref, repoRelPath) {
  try {
    return execSync(`git show ${ref}:${repoRelPath}`, {
      encoding: 'utf-8',
      cwd: gitRoot(),
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch {
    return null;
  }
}

/**
 * List files under a directory in a git ref.
 * Returns an array of repo-relative paths.
 */
function gitLsTree(ref, repoRelPath) {
  try {
    const out = execSync(
      `git ls-tree -r --name-only ${ref} -- ${repoRelPath}`,
      { encoding: 'utf-8', cwd: gitRoot(), stdio: ['pipe', 'pipe', 'pipe'] },
    );
    return out.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Load skills from a git ref. Handles both layouts:
 *   - Nested: <skillsPath>/<name>/SKILL.md
 *   - Flat:   <skillsPath>/<name>-SKILL.md
 *
 * `skillsPath` is repo-relative (e.g. ".github/skills").
 */
export function loadSkillsFromRef(ref, skillsPath) {
  const files = gitLsTree(ref, skillsPath);
  const skills = [];
  const seen = new Set();

  for (const filePath of files) {
    // Skip _legacy dir
    if (filePath.includes('/_legacy/')) continue;

    const basename = filePath.split('/').pop();

    // Flat: *-SKILL.md or *_SKILL.md directly in skillsPath
    if (basename.endsWith('-SKILL.md') || basename.endsWith('_SKILL.md')) {
      // Skip if folder version already loaded
      const base = basename.replace(/[-_]SKILL\.md$/, '');
      const content = gitShow(ref, filePath);
      if (!content || seen.has(basename) || seen.has(`${base}/SKILL.md`)) continue;
      seen.add(basename);
      const fm = parseFrontmatter(content);
      const lines = content.split('\n').length;
      const searchText = [fm.name, fm.description, fm['argument-hint']]
        .filter(Boolean)
        .join(' ');
      skills.push({
        file: basename,
        name: fm.name || basename,
        description: fm.description || '',
        argumentHint: fm['argument-hint'] || '',
        lines,
        searchText,
      });
    }

    // Nested: <dir>/SKILL.md
    if (basename === 'SKILL.md') {
      const parts = filePath.split('/');
      const dirName = parts[parts.length - 2];
      const canonName = `${dirName}/SKILL.md`;
      if (seen.has(canonName)) continue;
      seen.add(canonName);
      const content = gitShow(ref, filePath);
      if (!content) continue;
      const fm = parseFrontmatter(content);
      const lines = content.split('\n').length;
      const searchText = [fm.name, fm.description, fm['argument-hint']]
        .filter(Boolean)
        .join(' ');
      skills.push({
        file: canonName,
        name: fm.name || dirName,
        description: fm.description || '',
        argumentHint: fm['argument-hint'] || '',
        lines,
        searchText,
      });
    }
  }

  return skills;
}

/**
 * Load instruction files from a git ref.
 * `instPath` is repo-relative (e.g. ".github/instructions").
 */
export function loadInstructionsFromRef(ref, instPath) {
  const files = gitLsTree(ref, instPath);
  return files
    .filter(f => f.endsWith('.instructions.md'))
    .map(filePath => {
      const content = gitShow(ref, filePath);
      if (!content) return null;
      const basename = filePath.split('/').pop();
      const fm = parseFrontmatter(content);
      const lines = content.split('\n').length;
      return {
        file: basename,
        description: fm.description || '',
        applyTo: fm.applyTo || null,
        lines,
        searchText: fm.description || '',
      };
    })
    .filter(Boolean);
}

/**
 * Load tool catalog from a git ref.
 * `catalogPath` is repo-relative (e.g. ".github/eval/tool-catalog.yaml").
 */
export function loadToolsFromRef(ref, catalogPath) {
  const content = gitShow(ref, catalogPath);
  if (!content) return [];
  const { tools } = yaml.load(content);
  if (!Array.isArray(tools)) return [];
  return tools.map(t => ({
    server: t.server,
    name: t.name,
    id: `${t.server}:${t.name}`,
    description: t.description || '',
    searchText: t.description || '',
  }));
}

/**
 * Load a single file's content from a git ref.
 * Returns the content as a string, or null if the file doesn't exist.
 */
export function loadFileFromRef(ref, repoRelPath) {
  return gitShow(ref, repoRelPath);
}
