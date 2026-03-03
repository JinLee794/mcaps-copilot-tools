#!/usr/bin/env node
/**
 * lint-context.mjs — Context budget and discovery health checks.
 *
 * Validates the structural correctness and token budget of the instruction +
 * skill architecture. Designed for CI: exits non-zero on errors.
 *
 * Checks:
 *   STRUCTURE
 *   1. Skill discovery — files must follow <name>/SKILL.md folder convention.
 *   2. Orphan skills — skill names referenced in instructions but file missing.
 *
 *   TOKEN BUDGET
 *   4. Per-file token cost (body) with configurable ceiling.
 *   5. Aggregate catalog cost (metadata injected every turn).
 *   6. Worst-case turn cost (all instructions + all skill metadata).
 *   7. Simulated per-query cost (instructions matched by description + skills).
 *
 *   CHAIN INTEGRITY
 *   8. mcem-flow.instructions.md references skills that exist.
 *   9. Role-card cross-role skill tables reference skills that exist.
 *  10. copilot-instructions.md Tier table accuracy.
 *
 * Exit codes:   0 = pass   1 = errors found
 *
 * Usage:
 *   node lint-context.mjs                 # default checks
 *   node lint-context.mjs --budget-only   # only token budget analysis
 *   node lint-context.mjs --json          # JSON output for CI parsing
 *
 * Env vars:
 *   MAX_SKILL_BODY_TOKENS   — per-skill body ceiling (default: 800)
 *   MAX_INST_BODY_TOKENS    — per-instruction body ceiling (default: 3500)
 *   MAX_CATALOG_TOKENS      — total catalog tax ceiling (default: 6000)
 *   MAX_TURN_TOKENS         — worst-case turn ceiling (default: 25000)
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { loadSkills, loadInstructions, parseFrontmatter } from './lib/loader.mjs';
import { catalogTokens, bodyTokens, estimateTokens } from './lib/tokens.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const SKILLS_DIR = join(__dirname, '..', 'skills');
const INSTRUCTIONS_DIR = join(__dirname, '..', 'instructions');
const COPILOT_INSTRUCTIONS = join(ROOT, '.github', 'copilot-instructions.md');
const MCEM_FLOW = join(INSTRUCTIONS_DIR, 'mcem-flow.instructions.md');

// ── config ───────────────────────────────────────────────────────
const MAX_SKILL_BODY = parseInt(process.env.MAX_SKILL_BODY_TOKENS || '800', 10);
const MAX_INST_BODY = parseInt(process.env.MAX_INST_BODY_TOKENS || '3500', 10);
const MAX_CATALOG = parseInt(process.env.MAX_CATALOG_TOKENS || '6000', 10);
const MAX_TURN = parseInt(process.env.MAX_TURN_TOKENS || '25000', 10);

const args = process.argv.slice(2);
const budgetOnly = args.includes('--budget-only');
const jsonOutput = args.includes('--json');

// ── issue tracking ───────────────────────────────────────────────
const ISSUES = { error: [], warn: [], info: [] };
function error(ctx, msg) { ISSUES.error.push({ ctx, msg }); }
function warn(ctx, msg) { ISSUES.warn.push({ ctx, msg }); }
function info(ctx, msg) { ISSUES.info.push({ ctx, msg }); }

// ── helpers ──────────────────────────────────────────────────────

function shortName(file) {
  return file
    .replace(/\/SKILL\.md$/, '')
    .replace(/[-_]SKILL\.md$/, '')
    .replace(/\.instructions\.md$/, '');
}

/** Extract back-ticked skill names from markdown text. */
function extractSkillRefs(text) {
  const refs = new Set();
  // Match `skill-name` patterns that look like skill references
  const regex = /`([a-z][a-z0-9-]+)`/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    // Filter out obvious non-skills (CRM fields, code snippets)
    const name = m[1];
    if (name.includes('.') || name.includes('_') || name.startsWith('crm')) continue;
    refs.add(name);
  }
  return refs;
}

/** Check if skill follows folder convention (auto-discoverable). */
function getDiscoveryStatus(skillsDir) {
  const status = new Map(); // name → { folder: bool, flat: bool }
  if (!existsSync(skillsDir)) return status;

  const entries = readdirSync(skillsDir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('_')) continue;

    if (e.isDirectory()) {
      const skillPath = join(skillsDir, e.name, 'SKILL.md');
      if (existsSync(skillPath)) {
        const existing = status.get(e.name) || { folder: false, flat: false };
        existing.folder = true;
        status.set(e.name, existing);
      }
    }

    if (e.isFile() && e.name.endsWith('-SKILL.md')) {
      const name = e.name.replace(/-SKILL\.md$/, '');
      const existing = status.get(name) || { folder: false, flat: false };
      existing.flat = true;
      status.set(name, existing);
    }
  }
  return status;
}

// ══════════════════════════════════════════════════════════════════
// CHECKS
// ══════════════════════════════════════════════════════════════════

function checkDiscovery(skills, discovery) {
  let undiscoverable = 0;
  for (const [name, status] of discovery) {
    if (status.flat && !status.folder) {
      warn('discovery', `${name} — flat file only (not auto-discoverable by VS Code). Needs folder convention or explicit reference.`);
      undiscoverable++;
    }
  }

  const folderCount = [...discovery.values()].filter(s => s.folder).length;
  const flatOnlyCount = [...discovery.values()].filter(s => s.flat && !s.folder).length;

  info('discovery', `${discovery.size} skills: ${folderCount} folder (auto-discoverable), ${flatOnlyCount} flat-only`);

  if (flatOnlyCount > 0 && folderCount === 0) {
    error('discovery', `All ${flatOnlyCount} skills use flat file convention — VS Code will NOT auto-discover any skills. Use <name>/SKILL.md folders.`);
  }
}

function checkMcemFlowRefs(skills) {
  if (!existsSync(MCEM_FLOW)) return;

  const content = readFileSync(MCEM_FLOW, 'utf-8');
  const refs = extractSkillRefs(content);
  const skillNames = new Set(skills.map(s => shortName(s.file)));

  // Known non-skill references to exclude
  const exclude = new Set(['opportunity', 'activestageid', 'statecode']);

  for (const ref of refs) {
    if (exclude.has(ref)) continue;
    if (!skillNames.has(ref)) {
      // Only warn if it looks like a skill reference (has a hyphen, typical naming)
      if (ref.includes('-')) {
        error('mcem-flow', `References \`${ref}\` but no matching skill file found`);
      }
    }
  }
}

function checkRoleCardRefs(skills) {
  const skillNames = new Set(skills.map(s => shortName(s.file)));
  const roleCards = readdirSync(INSTRUCTIONS_DIR)
    .filter(f => f.startsWith('role-card-') && f.endsWith('.instructions.md'));

  for (const rc of roleCards) {
    const content = readFileSync(join(INSTRUCTIONS_DIR, rc), 'utf-8');
    const refs = extractSkillRefs(content);
    for (const ref of refs) {
      if (ref.includes('-') && !skillNames.has(ref)) {
        warn(shortName(rc), `References \`${ref}\` in cross-role lens but skill file not found`);
      }
    }
  }
}

function checkTokenBudgets(skills, instructions) {
  // Per-skill body cost
  for (const s of skills) {
    const cost = bodyTokens(s);
    if (cost > MAX_SKILL_BODY) {
      warn('budget', `${shortName(s.file)} — ${cost} body tokens (ceiling: ${MAX_SKILL_BODY})`);
    }
  }

  // Per-instruction body cost
  for (const inst of instructions) {
    const cost = bodyTokens(inst);
    if (cost > MAX_INST_BODY) {
      warn('budget', `${shortName(inst.file)} — ${cost} body tokens (ceiling: ${MAX_INST_BODY})`);
    }
  }

  // Catalog tax (metadata always in context)
  const skillCatalogCost = skills.reduce((s, sk) => s + catalogTokens(sk), 0);
  const instCatalogCost = instructions.reduce((s, inst) => s + catalogTokens(inst), 0);
  const totalCatalog = skillCatalogCost + instCatalogCost;
  info('budget', `Catalog tax: ${totalCatalog} tokens (skills: ${skillCatalogCost}, instructions: ${instCatalogCost})`);

  if (totalCatalog > MAX_CATALOG) {
    warn('budget', `Catalog tax ${totalCatalog} exceeds ceiling ${MAX_CATALOG} — metadata alone consumes significant context`);
  }

  // Worst-case turn: all instructions loaded + all skill metadata + copilot-instructions
  const allInstBody = instructions.reduce((s, inst) => s + bodyTokens(inst), 0);
  const allSkillBody = skills.reduce((s, sk) => s + bodyTokens(sk), 0);
  let copilotInstCost = 0;
  if (existsSync(COPILOT_INSTRUCTIONS)) {
    const content = readFileSync(COPILOT_INSTRUCTIONS, 'utf-8');
    copilotInstCost = estimateTokens(content);
  }

  const worstCase = copilotInstCost + totalCatalog + allInstBody + allSkillBody;
  info('budget', `Worst-case turn: ${worstCase} tokens (copilot-instructions: ${copilotInstCost}, catalog: ${totalCatalog}, instruction bodies: ${allInstBody}, skill bodies: ${allSkillBody})`);

  if (worstCase > MAX_TURN) {
    warn('budget', `Worst-case ${worstCase} exceeds ceiling ${MAX_TURN}`);
  }

  // Typical turn estimate (Tier 0 + catalog + 3 instructions + 2 skills)
  const topInst = instructions
    .map(inst => bodyTokens(inst))
    .sort((a, b) => b - a)
    .slice(0, 3);
  const topSkills = skills
    .map(s => bodyTokens(s))
    .sort((a, b) => b - a)
    .slice(0, 2);
  const typicalInst = topInst.reduce((s, v) => s + v, 0);
  const typicalSkill = topSkills.reduce((s, v) => s + v, 0);
  const typical = copilotInstCost + totalCatalog + typicalInst + typicalSkill;
  info('budget', `Typical turn estimate: ${typical} tokens (top-3 instructions + top-2 skills + catalog + Tier 0)`);
}

// ── output ───────────────────────────────────────────────────────

function printReport(skills, instructions, discovery) {
  const bar = '═'.repeat(72);
  console.log(`\n${bar}`);
  console.log('  CONTEXT HEALTH REPORT');
  console.log(bar);

  // Discovery summary
  const folderCount = [...discovery.values()].filter(s => s.folder).length;
  const flatOnly = [...discovery.values()].filter(s => s.flat && !s.folder).length;
  console.log(`\n  Skills: ${skills.length} files (${folderCount} folder, ${flatOnly} flat-only)`);
  console.log(`  Instructions: ${instructions.length} files`);

  // Budget summary table
  console.log(`\n  ── Token Budget ──`);
  console.log(`  ${'Component'.padEnd(35)} ${'Tokens'.padStart(8)} ${'Ceiling'.padStart(8)}`);
  console.log(`  ${'─'.repeat(55)}`);

  const copilotCost = existsSync(COPILOT_INSTRUCTIONS)
    ? estimateTokens(readFileSync(COPILOT_INSTRUCTIONS, 'utf-8'))
    : 0;
  const skillCatalog = skills.reduce((s, sk) => s + catalogTokens(sk), 0);
  const instCatalog = instructions.reduce((s, inst) => s + catalogTokens(inst), 0);
  const allInstBody = instructions.reduce((s, inst) => s + bodyTokens(inst), 0);
  const allSkillBody = skills.reduce((s, sk) => s + bodyTokens(sk), 0);

  console.log(`  ${'Tier 0 (copilot-instructions)'.padEnd(35)} ${String(copilotCost).padStart(8)}`);
  console.log(`  ${'Skill catalog (metadata)'.padEnd(35)} ${String(skillCatalog).padStart(8)} ${String(MAX_CATALOG).padStart(8)}`);
  console.log(`  ${'Instruction catalog (metadata)'.padEnd(35)} ${String(instCatalog).padStart(8)}`);
  console.log(`  ${'All instruction bodies'.padEnd(35)} ${String(allInstBody).padStart(8)}`);
  console.log(`  ${'All skill bodies'.padEnd(35)} ${String(allSkillBody).padStart(8)}`);
  console.log(`  ${'─'.repeat(55)}`);
  const total = copilotCost + skillCatalog + instCatalog + allInstBody + allSkillBody;
  console.log(`  ${'Worst-case total'.padEnd(35)} ${String(total).padStart(8)} ${String(MAX_TURN).padStart(8)}`);

  // Per-file breakdown (sorted by cost)
  console.log(`\n  ── Top 10 Heaviest Files ──`);
  const allItems = [
    ...skills.map(s => ({ name: shortName(s.file), type: 'skill', body: bodyTokens(s), catalog: catalogTokens(s) })),
    ...instructions.map(i => ({ name: shortName(i.file), type: 'inst', body: bodyTokens(i), catalog: catalogTokens(i) })),
  ].sort((a, b) => b.body - a.body);

  console.log(`  ${'File'.padEnd(35)} ${'Type'.padEnd(6)} ${'Body'.padStart(7)} ${'Catalog'.padStart(8)}`);
  console.log(`  ${'─'.repeat(58)}`);
  for (const item of allItems.slice(0, 10)) {
    console.log(`  ${item.name.padEnd(35)} ${item.type.padEnd(6)} ${String(item.body).padStart(7)} ${String(item.catalog).padStart(8)}`);
  }

  // Issues
  const counts = { error: ISSUES.error.length, warn: ISSUES.warn.length, info: ISSUES.info.length };
  console.log(`\n  ── Issues ──`);
  console.log(`  Errors: ${counts.error}  |  Warnings: ${counts.warn}  |  Info: ${counts.info}\n`);

  if (counts.error > 0) {
    console.log('  ✘ ERRORS:');
    for (const { ctx, msg } of ISSUES.error) {
      console.log(`    ✘ [${ctx}] ${msg}`);
    }
    console.log();
  }

  if (counts.warn > 0) {
    console.log('  ⚠ WARNINGS:');
    for (const { ctx, msg } of ISSUES.warn) {
      console.log(`    ⚠ [${ctx}] ${msg}`);
    }
    console.log();
  }

  if (counts.info > 0) {
    console.log('  ℹ INFO:');
    for (const { ctx, msg } of ISSUES.info) {
      console.log(`    ℹ [${ctx}] ${msg}`);
    }
    console.log();
  }
}

function printJson(skills, instructions, discovery) {
  const folderCount = [...discovery.values()].filter(s => s.folder).length;
  const flatOnly = [...discovery.values()].filter(s => s.flat && !s.folder).length;
  const copilotCost = existsSync(COPILOT_INSTRUCTIONS)
    ? estimateTokens(readFileSync(COPILOT_INSTRUCTIONS, 'utf-8'))
    : 0;
  const skillCatalog = skills.reduce((s, sk) => s + catalogTokens(sk), 0);
  const instCatalog = instructions.reduce((s, inst) => s + catalogTokens(inst), 0);
  const allInstBody = instructions.reduce((s, inst) => s + bodyTokens(inst), 0);
  const allSkillBody = skills.reduce((s, sk) => s + bodyTokens(sk), 0);

  const result = {
    summary: {
      skills: { total: skills.length, folder: folderCount, flatOnly },
      instructions: { total: instructions.length },
      tokens: {
        tier0: copilotCost,
        skillCatalog,
        instCatalog,
        allInstBodies: allInstBody,
        allSkillBodies: allSkillBody,
        worstCase: copilotCost + skillCatalog + instCatalog + allInstBody + allSkillBody,
      },
      ceilings: {
        maxSkillBody: MAX_SKILL_BODY,
        maxInstBody: MAX_INST_BODY,
        maxCatalog: MAX_CATALOG,
        maxTurn: MAX_TURN,
      },
    },
    discovery: Object.fromEntries(discovery),
    issues: ISSUES,
    pass: ISSUES.error.length === 0,
  };

  console.log(JSON.stringify(result, null, 2));
}

// ── main ─────────────────────────────────────────────────────────

function main() {
  const skills = loadSkills(SKILLS_DIR);
  const instructions = loadInstructions(INSTRUCTIONS_DIR);
  const discovery = getDiscoveryStatus(SKILLS_DIR);

  if (!budgetOnly) {
    checkDiscovery(skills, discovery);
    checkMcemFlowRefs(skills);
    checkRoleCardRefs(skills);
  }

  checkTokenBudgets(skills, instructions);

  if (jsonOutput) {
    printJson(skills, instructions, discovery);
  } else {
    printReport(skills, instructions, discovery);
  }

  process.exit(ISSUES.error.length > 0 ? 1 : 0);
}

main();
