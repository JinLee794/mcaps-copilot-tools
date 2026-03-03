#!/usr/bin/env node
/**
 * score-loading.mjs — Evaluate context loading strategies.
 *
 * Compares three strategies for loading skills + instructions:
 *
 *   preloaded  — All skill/instruction metadata AND bodies always in context.
 *                Simulates: Tier 0 everything (worst case, current CLI behavior).
 *
 *   lazy       — Only items whose description matches query above threshold
 *                get their body loaded. Metadata is NOT in context unless matched.
 *                Simulates: ideal lazy system where nothing is pre-injected.
 *
 *   hybrid     — All skill/instruction descriptions always in context (catalog
 *                tax), but bodies only loaded when description matches query.
 *                Simulates: current VS Code Copilot Chat behavior.
 *
 * For each test case and strategy, measures:
 *   - Catalog tokens (always-loaded metadata)
 *   - Body tokens (loaded file content)
 *   - Total tokens
 *   - Routing accuracy (P / R / F1 / MRR)
 *   - False activations (bodies loaded that weren't needed)
 *
 * Usage:
 *   node score-loading.mjs                  # all strategies, default threshold
 *   node score-loading.mjs --strategy lazy  # single strategy
 *   THRESHOLD=0.40 node score-loading.mjs   # custom threshold
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { initEmbedder, embedText, cosineSimilarity } from './lib/embeddings.mjs';
import { loadSkills, loadInstructions } from './lib/loader.mjs';
import { catalogTokens, bodyTokens } from './lib/tokens.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = join(__dirname, '..', 'skills');
const INSTRUCTIONS_DIR = join(__dirname, '..', 'instructions');

const THRESHOLD = parseFloat(process.env.THRESHOLD || '0.35');
const TOP_K = parseInt(process.env.TOP_K || '5', 10);

// ── arg parsing ──────────────────────────────────────────────────
const args = process.argv.slice(2);
let strategyFilter = 'all'; // preloaded | lazy | hybrid | all
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--strategy' && args[i + 1]) strategyFilter = args[i + 1];
  if (args[i].startsWith('--strategy=')) strategyFilter = args[i].split('=')[1];
}
const STRATEGIES = strategyFilter === 'all'
  ? ['preloaded', 'lazy', 'hybrid']
  : [strategyFilter];

// ── helpers ──────────────────────────────────────────────────────

function rank(queryEmb, items, itemEmbs) {
  return items
    .map((item, i) => ({
      file: item.file,
      lines: item.lines,
      type: item.argumentHint !== undefined ? 'skill' : 'instruction',
      catalogCost: catalogTokens(item),
      bodyCost: bodyTokens(item),
      sim: cosineSimilarity(queryEmb, itemEmbs[i]),
    }))
    .sort((a, b) => b.sim - a.sim);
}

/**
 * Compute context budget for a given strategy.
 *
 * Returns { catalogTok, bodyTok, totalTok, selectedCount, falseActivations }
 */
function computeBudget(ranked, expected, strategy, allItems) {
  const expectedSet = new Set(expected);
  const matched = ranked.filter(r => r.sim >= THRESHOLD);

  let catalogTok = 0;
  let bodyTok = 0;

  if (strategy === 'preloaded') {
    // All metadata + all bodies always loaded
    catalogTok = allItems.reduce((s, item) => s + catalogTokens(item), 0);
    bodyTok = allItems.reduce((s, item) => s + bodyTokens(item), 0);
  } else if (strategy === 'hybrid') {
    // All metadata always loaded, bodies only for matched items
    catalogTok = allItems.reduce((s, item) => s + catalogTokens(item), 0);
    bodyTok = matched.reduce((s, r) => s + r.bodyCost, 0);
  } else if (strategy === 'lazy') {
    // Only matched items' metadata + bodies loaded
    catalogTok = matched.reduce((s, r) => s + r.catalogCost, 0);
    bodyTok = matched.reduce((s, r) => s + r.bodyCost, 0);
  }

  const falseActivations = matched.filter(r => !expectedSet.has(r.file)).length;

  return {
    catalogTok,
    bodyTok,
    totalTok: catalogTok + bodyTok,
    selectedCount: matched.length,
    falseActivations,
  };
}

function computeMetrics(ranked, expected) {
  const selected = ranked.filter(r => r.sim >= THRESHOLD);
  const selectedFiles = new Set(selected.map(r => r.file));
  const expectedSet = new Set(expected);

  if (expected.length === 0) {
    const precision = selected.length === 0 ? 1 : 0;
    return { precision, recall: 1, f1: precision, mrr: 1 };
  }

  const tp = expected.filter(f => selectedFiles.has(f)).length;
  const precision = selected.length > 0 ? tp / selected.length : 0;
  const recall = expected.length > 0 ? tp / expected.length : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  let mrr = 0;
  for (let i = 0; i < ranked.length; i++) {
    if (expectedSet.has(ranked[i].file)) {
      mrr = 1 / (i + 1);
      break;
    }
  }

  return { precision, recall, f1, mrr };
}

function shortName(file) {
  return file
    .replace(/\/SKILL\.md$/, '')
    .replace(/[-_]SKILL\.md$/, '')
    .replace(/\.instructions\.md$/, '');
}

const fmt = v => v.toFixed(3);
const fmtTok = v => String(Math.round(v)).padStart(6);

// ── output ───────────────────────────────────────────────────────

function printCase(tc, ranked, allItems, expected) {
  const bar = '─'.repeat(80);
  console.log(`\n${bar}`);
  console.log(`  ${tc.id}  |  role: ${tc.role || 'any'}  |  stage: ${tc.stage || 'any'}  |  category: ${tc.category || '-'}`);
  console.log(`  "${tc.query}"`);
  console.log();

  const top = ranked.slice(0, TOP_K);
  const expSet = new Set(expected);
  for (let i = 0; i < top.length; i++) {
    const r = top[i];
    const mark = expSet.has(r.file) ? '✓' : r.sim >= THRESHOLD ? '●' : ' ';
    const typeTag = r.type === 'instruction' ? ' [inst]' : '';
    console.log(`  ${mark} ${(i + 1)}. ${shortName(r.file).slice(0, 28).padEnd(28)} ${fmt(r.sim)}${typeTag}`);
  }

  // Strategy comparison table
  console.log();
  console.log(`  ${'Strategy'.padEnd(12)} Catalog   Body    Total    Sel  FalseAct  P     R     F1`);
  console.log(`  ${'─'.repeat(12)} ${'─'.repeat(7)} ${'─'.repeat(7)} ${'─'.repeat(7)}  ${'─'.repeat(3)}  ${'─'.repeat(8)}  ${'─'.repeat(5)} ${'─'.repeat(5)} ${'─'.repeat(5)}`);
  const metrics = computeMetrics(ranked, expected);
  for (const strategy of STRATEGIES) {
    const budget = computeBudget(ranked, expected, strategy, allItems);
    console.log(
      `  ${strategy.padEnd(12)} ${fmtTok(budget.catalogTok)} ${fmtTok(budget.bodyTok)} ${fmtTok(budget.totalTok)}  ` +
      `${String(budget.selectedCount).padStart(3)}  ${String(budget.falseActivations).padStart(8)}  ` +
      `${fmt(metrics.precision)} ${fmt(metrics.recall)} ${fmt(metrics.f1)}`
    );
  }
}

function printSummary(results, allItems) {
  const bar = '═'.repeat(80);
  console.log(`\n${bar}`);
  console.log('  CONTEXT LOADING STRATEGY COMPARISON — AGGREGATE');
  console.log(bar);

  const n = results.length;

  // Compute per-strategy averages
  console.log();
  console.log(
    `  ${'Strategy'.padEnd(12)} Avg Catalog  Avg Body  Avg Total  Avg FalseAct  ` +
    `Avg P   Avg R   Avg F1  Avg MRR`
  );
  console.log(`  ${'─'.repeat(100)}`);

  for (const strategy of STRATEGIES) {
    let catSum = 0, bodySum = 0, totSum = 0, faSum = 0;
    let pSum = 0, rSum = 0, f1Sum = 0, mrrSum = 0;

    for (const { ranked, expected, allItems: ai } of results) {
      const budget = computeBudget(ranked, expected, strategy, ai);
      const metrics = computeMetrics(ranked, expected);
      catSum += budget.catalogTok;
      bodySum += budget.bodyTok;
      totSum += budget.totalTok;
      faSum += budget.falseActivations;
      pSum += metrics.precision;
      rSum += metrics.recall;
      f1Sum += metrics.f1;
      mrrSum += metrics.mrr;
    }

    console.log(
      `  ${strategy.padEnd(12)} ${fmtTok(catSum / n)}      ${fmtTok(bodySum / n)}   ${fmtTok(totSum / n)}     ` +
      `${fmt(faSum / n).padStart(8)}      ` +
      `${fmt(pSum / n)}  ${fmt(rSum / n)}  ${fmt(f1Sum / n)}   ${fmt(mrrSum / n)}`
    );
  }

  // Savings comparison
  if (STRATEGIES.length >= 2) {
    console.log();
    console.log('  TOKEN SAVINGS vs PRELOADED:');
    console.log(`  ${'─'.repeat(60)}`);

    const preloadedAvg = results.reduce((s, r) => {
      const b = computeBudget(r.ranked, r.expected, 'preloaded', r.allItems);
      return s + b.totalTok;
    }, 0) / n;

    for (const strategy of STRATEGIES) {
      if (strategy === 'preloaded') continue;
      const avg = results.reduce((s, r) => {
        const b = computeBudget(r.ranked, r.expected, strategy, r.allItems);
        return s + b.totalTok;
      }, 0) / n;
      const saved = preloadedAvg - avg;
      const pct = preloadedAvg > 0 ? (saved / preloadedAvg * 100).toFixed(1) : '0';
      console.log(`  ${strategy.padEnd(12)} saves ~${Math.round(saved)} tokens/turn (${pct}% reduction)`);
    }
  }

  // Category breakdown
  const categories = [...new Set(results.map(r => r.tc.category).filter(Boolean))];
  if (categories.length > 0) {
    console.log();
    console.log('  PER-CATEGORY BREAKDOWN (hybrid strategy):');
    console.log(`  ${'─'.repeat(70)}`);
    console.log(`  ${'Category'.padEnd(20)} Cases  Avg Total  Avg F1   Avg FalseAct`);
    for (const cat of categories) {
      const catResults = results.filter(r => r.tc.category === cat);
      const cn = catResults.length;
      let totSum = 0, f1Sum = 0, faSum = 0;
      for (const r of catResults) {
        const budget = computeBudget(r.ranked, r.expected, 'hybrid', r.allItems);
        const metrics = computeMetrics(r.ranked, r.expected);
        totSum += budget.totalTok;
        f1Sum += metrics.f1;
        faSum += budget.falseActivations;
      }
      console.log(
        `  ${cat.padEnd(20)} ${String(cn).padStart(3)}   ${fmtTok(totSum / cn)}     ${fmt(f1Sum / cn)}    ${fmt(faSum / cn)}`
      );
    }
  }

  console.log();
}

// ── main ─────────────────────────────────────────────────────────

async function main() {
  const data = yaml.load(readFileSync(join(__dirname, 'test-cases.yaml'), 'utf-8'));
  const cases = data.cases;

  // Load all content items (skills + instructions)
  const skills = loadSkills(SKILLS_DIR);
  const instructions = loadInstructions(INSTRUCTIONS_DIR);
  const allItems = [...skills, ...instructions];

  console.log('\n┌────────────────────────────────────────────────────────────────────────────┐');
  console.log('│  Context Loading Eval — Strategy Comparison                                │');
  console.log('└────────────────────────────────────────────────────────────────────────────┘');
  console.log(`  Model     : Xenova/all-MiniLM-L6-v2`);
  console.log(`  Threshold : ${THRESHOLD}  |  Top-K : ${TOP_K}`);
  console.log(`  Strategies: ${STRATEGIES.join(', ')}`);
  console.log(`  Skills    : ${skills.length}`);
  console.log(`  Instructions: ${instructions.length}`);
  console.log(`  Total items : ${allItems.length}`);
  console.log(`  Cases     : ${cases.length}`);

  console.log('\n  Loading embedding model...');
  await initEmbedder();
  console.log('  Model ready.');

  // Pre-compute embeddings for all items
  const itemEmbs = [];
  for (const item of allItems) itemEmbs.push(await embedText(item.searchText));

  // Evaluate each test case
  const results = [];
  for (const tc of cases) {
    const qEmb = await embedText(tc.query);
    const ranked = rank(qEmb, allItems, itemEmbs);

    // Resolve expected list — support both old format and new unified format
    const expected = tc.expected_unified || tc.expected?.branch || [];

    results.push({ tc, ranked, expected, allItems });
    printCase(tc, ranked, allItems, expected);
  }

  printSummary(results, allItems);
}

main().catch(err => {
  console.error('\nError:', err.message);
  process.exit(1);
});
