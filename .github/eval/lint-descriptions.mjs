#!/usr/bin/env node
/**
 * lint-descriptions.mjs — Static quality checks on skill description frontmatter.
 *
 * Checks:
 *   1. Missing or empty description
 *   2. Missing name field
 *   3. Missing argument-hint field
 *   4. Description too short (< 40 chars) — may not route well
 *   5. Description too long (> 350 chars) — semantic dilution risk
 *   6. Low keyword density (description doesn't contain skill name tokens)
 *   7. Duplicate description fragments across skills (>50% token overlap)
 *
 * Usage:
 *   node lint-descriptions.mjs            # lint atomic (branch) skills
 *   node lint-descriptions.mjs --all      # lint atomic + legacy
 */

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { loadSkills } from './lib/loader.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = join(__dirname, '..', 'skills');
const LEGACY_DIR = join(SKILLS_DIR, '_legacy');

const lintAll = process.argv.includes('--all');

function shortName(file) {
  return file.replace(/\/SKILL\.md$/, '').replace(/[-_]SKILL\.md$/, '');
}

/** Tokenize into lowercase words (strip punctuation). */
function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/).filter(Boolean);
}

/** Jaccard similarity between two token sets. */
function jaccard(setA, setB) {
  const intersection = [...setA].filter(t => setB.has(t)).length;
  const union = new Set([...setA, ...setB]).size;
  return union > 0 ? intersection / union : 0;
}

const ISSUES = { error: [], warn: [], info: [] };

function error(file, msg) { ISSUES.error.push({ file: shortName(file), msg }); }
function warn(file, msg) { ISSUES.warn.push({ file: shortName(file), msg }); }
function info(file, msg) { ISSUES.info.push({ file: shortName(file), msg }); }

function lintSkill(skill) {
  const { file, name, description, argumentHint } = skill;

  // 1. Missing description
  if (!description) {
    error(file, 'Missing description — skill will not be routable');
    return; // can't do further checks
  }

  // 2. Missing name
  if (!name || name === file) {
    warn(file, 'Missing name field — using filename as name');
  }

  // 3. Missing argument-hint
  if (!argumentHint) {
    info(file, 'No argument-hint — consider adding for better routing');
  }

  // 4. Description too short
  if (description.length < 40) {
    warn(file, `Description too short (${description.length} chars) — may not match queries well`);
  }

  // 5. Description too long — semantic dilution
  if (description.length > 350) {
    warn(file, `Description is ${description.length} chars — risk of semantic dilution (>350). Consider splitting.`);
  }

  // 6. Keyword density — does description contain words from skill name?
  const nameTokens = tokenize(name.replace(/[-_]/g, ' '));
  const descTokens = new Set(tokenize(description));
  const missing = nameTokens.filter(t => t.length > 3 && !descTokens.has(t));
  if (missing.length > 0 && nameTokens.length > 0) {
    const ratio = missing.length / nameTokens.length;
    if (ratio > 0.5) {
      warn(file, `Low keyword density — name tokens not in description: ${missing.join(', ')}`);
    }
  }
}

function lintDuplicates(skills) {
  const tokenSets = skills.map(s => ({
    file: s.file,
    tokens: new Set(tokenize(s.description)),
  }));

  for (let i = 0; i < tokenSets.length; i++) {
    for (let j = i + 1; j < tokenSets.length; j++) {
      const sim = jaccard(tokenSets[i].tokens, tokenSets[j].tokens);
      if (sim > 0.50) {
        warn(
          tokenSets[i].file,
          `High token overlap (${(sim * 100).toFixed(0)}%) with ${shortName(tokenSets[j].file)} — descriptions may confuse router`,
        );
      }
    }
  }
}

function printIssues() {
  const bar = '═'.repeat(72);
  console.log(`\n${bar}`);
  console.log('  DESCRIPTION LINT REPORT');
  console.log(bar);

  const counts = { error: ISSUES.error.length, warn: ISSUES.warn.length, info: ISSUES.info.length };
  console.log(`\n  Errors: ${counts.error}  |  Warnings: ${counts.warn}  |  Info: ${counts.info}\n`);

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
    console.log('  ✓ All descriptions pass lint checks.\n');
  }

  return counts.error > 0 ? 1 : 0;
}

function main() {
  const branchSkills = loadSkills(SKILLS_DIR);
  const legacySkills = lintAll ? loadSkills(LEGACY_DIR) : [];
  const all = [...branchSkills, ...legacySkills];

  console.log(`\n  Linting ${branchSkills.length} branch skills${lintAll ? ` + ${legacySkills.length} legacy skills` : ''}...`);

  for (const skill of all) lintSkill(skill);
  lintDuplicates(branchSkills);

  const exitCode = printIssues();
  process.exit(exitCode);
}

main();
