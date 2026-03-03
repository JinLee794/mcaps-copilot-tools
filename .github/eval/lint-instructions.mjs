#!/usr/bin/env node
/**
 * lint-instructions.mjs — Static quality checks on instruction file frontmatter.
 *
 * Checks:
 *   1. Missing or empty description
 *   2. Description too short (< 40 chars)
 *   3. Description too long (> 400 chars) — semantic dilution
 *   4. Missing applyTo when file is domain-specific
 *   5. Keyword overlap between instruction descriptions (routing confusion)
 *   6. Instruction ↔ skill description overlap (ambiguous routing)
 *
 * Usage:
 *   node lint-instructions.mjs              # lint instructions only
 *   node lint-instructions.mjs --cross      # also check skill ↔ instruction overlap
 */

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { loadInstructions, loadSkills } from './lib/loader.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const INSTRUCTIONS_DIR = join(__dirname, '..', 'instructions');
const SKILLS_DIR = join(__dirname, '..', 'skills');

const crossCheck = process.argv.includes('--cross');

function shortName(file) {
  return file.replace(/\.instructions\.md$/, '').replace(/\/SKILL\.md$/, '').replace(/[-_]SKILL\.md$/, '');
}

function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/).filter(Boolean);
}

function jaccard(setA, setB) {
  const intersection = [...setA].filter(t => setB.has(t)).length;
  const union = new Set([...setA, ...setB]).size;
  return union > 0 ? intersection / union : 0;
}

const ISSUES = { error: [], warn: [], info: [] };
function error(file, msg) { ISSUES.error.push({ file: shortName(file), msg }); }
function warn(file, msg) { ISSUES.warn.push({ file: shortName(file), msg }); }
function info(file, msg) { ISSUES.info.push({ file: shortName(file), msg }); }

function lintInstruction(inst) {
  const { file, description, applyTo } = inst;

  if (!description) {
    error(file, 'Missing description — instruction will not be routable by description match');
    return;
  }

  if (description.length < 40) {
    warn(file, `Description too short (${description.length} chars) — may not match queries well`);
  }

  if (description.length > 400) {
    warn(file, `Description is ${description.length} chars — risk of semantic dilution (>400)`);
  }

  // Domain-specific files that probably should have applyTo
  const domainHints = ['crm', 'msx', 'vault', 'connect', 'role-card'];
  const isDomainSpecific = domainHints.some(h => file.includes(h));
  if (isDomainSpecific && !applyTo) {
    info(file, 'Domain-specific file without applyTo — consider adding glob pattern for targeted loading');
  }

  // Check for overly generic trigger words that inflate false-positive matching
  const genericWords = new Set(['use', 'when', 'for', 'the', 'and', 'any', 'all', 'loaded']);
  const descTokens = tokenize(description);
  const genericRatio = descTokens.filter(t => genericWords.has(t)).length / descTokens.length;
  if (genericRatio > 0.3) {
    info(file, `High generic-word ratio (${(genericRatio * 100).toFixed(0)}%) — description may match too broadly`);
  }
}

function lintInstructionOverlap(instructions) {
  const tokenSets = instructions.map(inst => ({
    file: inst.file,
    tokens: new Set(tokenize(inst.description)),
  }));

  for (let i = 0; i < tokenSets.length; i++) {
    for (let j = i + 1; j < tokenSets.length; j++) {
      const sim = jaccard(tokenSets[i].tokens, tokenSets[j].tokens);
      if (sim > 0.40) {
        warn(
          tokenSets[i].file,
          `High token overlap (${(sim * 100).toFixed(0)}%) with ${shortName(tokenSets[j].file)} — may confuse description-based matching`,
        );
      }
    }
  }
}

function lintCrossOverlap(instructions, skills) {
  const instSets = instructions.map(i => ({
    file: i.file,
    tokens: new Set(tokenize(i.description)),
    type: 'instruction',
  }));
  const skillSets = skills.map(s => ({
    file: s.file,
    tokens: new Set(tokenize(s.description)),
    type: 'skill',
  }));

  for (const inst of instSets) {
    for (const skill of skillSets) {
      const sim = jaccard(inst.tokens, skill.tokens);
      if (sim > 0.35) {
        warn(
          inst.file,
          `Cross-type overlap (${(sim * 100).toFixed(0)}%) with skill ${shortName(skill.file)} — ` +
          `queries may trigger instruction instead of skill or vice versa`,
        );
      }
    }
  }
}

function printIssues(instCount) {
  const bar = '═'.repeat(72);
  console.log(`\n${bar}`);
  console.log('  INSTRUCTION DESCRIPTION LINT REPORT');
  console.log(bar);

  const counts = { error: ISSUES.error.length, warn: ISSUES.warn.length, info: ISSUES.info.length };
  console.log(`\n  Files: ${instCount}  |  Errors: ${counts.error}  |  Warnings: ${counts.warn}  |  Info: ${counts.info}\n`);

  if (counts.error > 0) {
    console.log('  ✘ ERRORS:');
    for (const { file, msg } of ISSUES.error) {
      console.log(`    ✘ ${file.padEnd(30)} ${msg}`);
    }
    console.log();
  }

  if (counts.warn > 0) {
    console.log('  ⚠ WARNINGS:');
    for (const { file, msg } of ISSUES.warn) {
      console.log(`    ⚠ ${file.padEnd(30)} ${msg}`);
    }
    console.log();
  }

  if (counts.info > 0) {
    console.log('  ℹ INFO:');
    for (const { file, msg } of ISSUES.info) {
      console.log(`    ℹ ${file.padEnd(30)} ${msg}`);
    }
    console.log();
  }

  if (counts.error === 0 && counts.warn === 0) {
    console.log('  ✓ All instruction descriptions pass lint checks.\n');
  }

  return counts.error > 0 ? 1 : 0;
}

function main() {
  const instructions = loadInstructions(INSTRUCTIONS_DIR);
  const skills = crossCheck ? loadSkills(SKILLS_DIR) : [];

  console.log(`\n  Linting ${instructions.length} instruction files${crossCheck ? ` + cross-checking ${skills.length} skills` : ''}...`);

  for (const inst of instructions) lintInstruction(inst);
  lintInstructionOverlap(instructions);
  if (crossCheck) lintCrossOverlap(instructions, skills);

  const exitCode = printIssues(instructions.length);
  process.exit(exitCode);
}

main();
