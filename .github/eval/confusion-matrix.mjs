#!/usr/bin/env node
/**
 * confusion-matrix.mjs — Compute pairwise cosine similarity between all
 * skill descriptions in the atomic (branch) architecture.
 *
 * High-similarity pairs are confusion risks — both skills will fire for
 * the same queries. Outputs a ranked list of pairs and an ASCII heatmap.
 *
 * Usage:
 *   node confusion-matrix.mjs              # defaults
 *   node confusion-matrix.mjs --warn 0.55  # custom confusion threshold
 */

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initEmbedder, embedText, cosineSimilarity } from './lib/embeddings.mjs';
import { loadSkills } from './lib/loader.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = join(__dirname, '..', 'skills');

const args = process.argv.slice(2);
let WARN_THRESHOLD = 0.55;
let ciMode = false;
const MAX_CONFUSION_PAIRS = parseInt(process.env.MAX_CONFUSION_PAIRS || '5', 10);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--warn' && args[i + 1]) WARN_THRESHOLD = parseFloat(args[i + 1]);
  if (args[i].startsWith('--warn=')) WARN_THRESHOLD = parseFloat(args[i].split('=')[1]);
  if (args[i] === '--ci') ciMode = true;
}

function shortName(file) {
  return file.replace(/\/SKILL\.md$/, '').replace(/[-_]SKILL\.md$/, '');
}

const heatChar = sim => {
  if (sim >= 0.8) return '█';
  if (sim >= 0.7) return '▓';
  if (sim >= 0.6) return '▒';
  if (sim >= 0.5) return '░';
  if (sim >= 0.4) return '·';
  return ' ';
};

async function main() {
  const skills = loadSkills(SKILLS_DIR);
  console.log(`\n  Loading model...`);
  await initEmbedder();
  console.log(`  Model ready. ${skills.length} skills loaded.\n`);

  // Compute embeddings
  const embs = [];
  for (const s of skills) embs.push(await embedText(s.searchText));

  // Compute pairwise similarity matrix
  const n = skills.length;
  const matrix = Array.from({ length: n }, () => new Float32Array(n));
  const pairs = [];

  for (let i = 0; i < n; i++) {
    matrix[i][i] = 1.0;
    for (let j = i + 1; j < n; j++) {
      const sim = cosineSimilarity(embs[i], embs[j]);
      matrix[i][j] = sim;
      matrix[j][i] = sim;
      pairs.push({ i, j, sim });
    }
  }

  // Sort pairs by descending similarity
  pairs.sort((a, b) => b.sim - a.sim);

  // ── Confusion risks ─────────────────────────────────────────
  const warnings = pairs.filter(p => p.sim >= WARN_THRESHOLD);

  console.log('┌─────────────────────────────────────────────────────────────────────┐');
  console.log('│  Skill Description Confusion Matrix                                  │');
  console.log('└─────────────────────────────────────────────────────────────────────┘');
  console.log(`  Warn threshold : ${WARN_THRESHOLD}`);
  console.log(`  Total pairs    : ${pairs.length}`);
  console.log(`  Confusion risks: ${warnings.length}\n`);

  if (warnings.length > 0) {
    console.log('  ⚠ HIGH-SIMILARITY PAIRS (may confuse router):');
    console.log('  ─'.repeat(38));
    for (const { i, j, sim } of warnings) {
      const a = shortName(skills[i].file).padEnd(30);
      const b = shortName(skills[j].file).padEnd(30);
      console.log(`  ${sim.toFixed(3)}  ${a}  ↔  ${b}`);
    }
    console.log();
  } else {
    console.log('  ✓ No high-similarity pairs found above threshold.\n');
  }

  // ── Top 15 pairs ────────────────────────────────────────────
  console.log('  TOP 15 MOST SIMILAR PAIRS:');
  console.log('  ─'.repeat(38));
  for (const { i, j, sim } of pairs.slice(0, 15)) {
    const mark = sim >= WARN_THRESHOLD ? '⚠' : ' ';
    const a = shortName(skills[i].file).padEnd(30);
    const b = shortName(skills[j].file).padEnd(30);
    console.log(`  ${mark} ${sim.toFixed(3)}  ${a}  ↔  ${b}`);
  }

  // ── ASCII heatmap (abbreviated if >15 skills) ───────────────
  if (n <= 30) {
    console.log('\n  HEATMAP (█≥.8  ▓≥.7  ▒≥.6  ░≥.5  ·≥.4):');
    // Column header — use indices
    const labelW = 25;
    let header = ' '.repeat(labelW + 2);
    for (let j = 0; j < n; j++) header += String(j).padStart(2);
    console.log(header);

    for (let i = 0; i < n; i++) {
      const label = shortName(skills[i].file).slice(0, labelW).padEnd(labelW);
      let row = `  ${label} `;
      for (let j = 0; j < n; j++) {
        row += i === j ? '■ ' : `${heatChar(matrix[i][j])} `;
      }
      console.log(row);
    }

    // Legend
    console.log();
    for (let idx = 0; idx < n; idx++) {
      console.log(`  ${String(idx).padStart(2)}: ${shortName(skills[idx].file)}`);
    }
  }

  // ── Per-skill max confusion ─────────────────────────────────
  console.log('\n  PER-SKILL MAX SIMILARITY (to nearest neighbor):');
  console.log('  ─'.repeat(38));
  const perSkill = skills.map((s, i) => {
    let maxSim = 0, maxJ = -1;
    for (let j = 0; j < n; j++) {
      if (j !== i && matrix[i][j] > maxSim) { maxSim = matrix[i][j]; maxJ = j; }
    }
    return { skill: shortName(s.file), maxSim, neighbor: maxJ >= 0 ? shortName(skills[maxJ].file) : '—' };
  });
  perSkill.sort((a, b) => b.maxSim - a.maxSim);
  for (const { skill, maxSim, neighbor } of perSkill) {
    const mark = maxSim >= WARN_THRESHOLD ? '⚠' : ' ';
    console.log(`  ${mark} ${maxSim.toFixed(3)}  ${skill.padEnd(30)}  ← ${neighbor}`);
  }

  console.log();

  return warnings.length;
}

main().then(warningCount => {
  if (!ciMode) process.exit(0);
  if (warningCount > MAX_CONFUSION_PAIRS) {
    console.error(`  ✗ CI FAILED: ${warningCount} confusion pairs exceed limit of ${MAX_CONFUSION_PAIRS}`);
    process.exit(1);
  }
  console.log(`  ✓ CI PASSED: ${warningCount} confusion pairs within limit of ${MAX_CONFUSION_PAIRS}`);
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
