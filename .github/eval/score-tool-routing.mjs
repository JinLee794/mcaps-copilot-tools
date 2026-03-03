#!/usr/bin/env node
/**
 * score-tool-routing.mjs — Evaluate MCP tool routing accuracy via embedding similarity.
 *
 * Tests whether README-documented scenario prompts route to the correct
 * MCP tools AND co-activate the right skills/instructions.
 *
 * Usage:
 *   node score-tool-routing.mjs              # all tool-invocation cases
 *   node score-tool-routing.mjs --server msx # MSX tools only
 *   node score-tool-routing.mjs --server oil # OIL tools only
 *   node score-tool-routing.mjs --brief      # summary only, skip per-case detail
 *
 * Env vars:
 *   THRESHOLD  — similarity cutoff (default 0.35)
 *   TOP_K      — max items shown per category per case (default 5)
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { initEmbedder, embedText, cosineSimilarity } from './lib/embeddings.mjs';
import { loadTools, loadSkills, loadInstructions } from './lib/loader.mjs';

// ── paths ────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = join(__dirname, 'tool-catalog.yaml');
const CASES_PATH = join(__dirname, 'test-cases.yaml');
const SKILLS_DIR = join(__dirname, '..', 'skills');
const INST_DIR = join(__dirname, '..', 'instructions');

// ── config ───────────────────────────────────────────────────────
const THRESHOLD = parseFloat(process.env.THRESHOLD || '0.35');
const TOP_K = parseInt(process.env.TOP_K || '5', 10);

// ── arg parsing ──────────────────────────────────────────────────
const args = process.argv.slice(2);
let serverFilter = null; // null = all servers
let briefMode = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--server' && args[i + 1]) serverFilter = args[i + 1];
  if (args[i].startsWith('--server=')) serverFilter = args[i].split('=')[1];
  if (args[i] === '--brief') briefMode = true;
}

// ── helpers ──────────────────────────────────────────────────────

function rankTools(queryEmb, tools, toolEmbs) {
  return tools
    .map((t, i) => ({
      id: t.id,
      name: t.name,
      server: t.server,
      sim: cosineSimilarity(queryEmb, toolEmbs[i]),
    }))
    .sort((a, b) => b.sim - a.sim);
}

function rankItems(queryEmb, items, itemEmbs) {
  return items
    .map((item, i) => ({
      file: item.file,
      sim: cosineSimilarity(queryEmb, itemEmbs[i]),
    }))
    .sort((a, b) => b.sim - a.sim);
}

function computeMetrics(ranked, expected) {
  const selected = ranked.filter(r => r.sim >= THRESHOLD);
  const selectedIds = new Set(selected.map(r => r.id));
  const expectedSet = new Set(expected);

  // Negative case: empty expected → precision = 1 if nothing selected, 0 otherwise
  if (expected.length === 0) {
    const precision = selected.length === 0 ? 1 : 0;
    const recall = 1; // vacuously true
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
    return { precision, recall, f1, mrr: 1, tp: 0, selectedCount: selected.length };
  }

  const tp = expected.filter(id => selectedIds.has(id)).length;
  const precision = selected.length > 0 ? tp / selected.length : 0;
  const recall = expected.length > 0 ? tp / expected.length : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  // Mean Reciprocal Rank — rank of first expected hit
  let mrr = 0;
  for (let i = 0; i < ranked.length; i++) {
    if (expectedSet.has(ranked[i].id)) {
      mrr = 1 / (i + 1);
      break;
    }
  }

  return { precision, recall, f1, mrr, tp, selectedCount: selected.length };
}

function fmtSim(v) { return v.toFixed(3); }
function fmtPct(v) { return v.toFixed(2); }

// ── output ───────────────────────────────────────────────────────

function shortSkill(file) {
  return file.replace(/[-_]SKILL\.md$/, '').replace(/\.instructions\.md$/, '');
}

function printCase(tc, topRanked, metrics, skillRanked, instRanked) {
  const bar = '─'.repeat(72);
  const exp = new Set(tc.expected_tools);
  const expSkills = new Set(tc.expected_skills || []);
  console.log(`\n${bar}`);
  console.log(`  ${tc.id}`);
  console.log(`  "${tc.query}"`);
  console.log(`  Expected tools  : ${tc.expected_tools.length === 0 ? '(none)' : tc.expected_tools.join(', ')}`);
  if (tc.expected_skills && tc.expected_skills.length > 0) {
    console.log(`  Expected skills : ${tc.expected_skills.join(', ')}`);
  }
  console.log();

  // ── Tool matches ──
  console.log(`  Tools (top ${TOP_K}):`);
  for (let i = 0; i < topRanked.length; i++) {
    const r = topRanked[i];
    const mark = exp.has(r.id) ? '✓' : r.sim >= THRESHOLD ? '●' : ' ';
    const serverTag = `[${r.server}]`.padEnd(9);
    console.log(`  ${mark} ${(i + 1).toString().padStart(2)}. ${serverTag} ${r.name.padEnd(30)} ${fmtSim(r.sim)}`);
  }

  console.log(`  Tool P: ${fmtPct(metrics.precision)}  R: ${fmtPct(metrics.recall)}  F1: ${fmtPct(metrics.f1)}  MRR: ${fmtPct(metrics.mrr)}`);

  // ── Skill co-activation ──
  const activeSkills = skillRanked.filter(r => r.sim >= THRESHOLD).slice(0, TOP_K);
  const activeInsts = instRanked.filter(r => r.sim >= THRESHOLD).slice(0, 3);

  if (activeSkills.length > 0 || activeInsts.length > 0) {
    console.log();
    console.log(`  Co-activated context:`);
    for (const s of activeSkills) {
      const mark = expSkills.has(s.file) ? '✓' : '●';
      console.log(`    ${mark} [skill] ${shortSkill(s.file).padEnd(35)} ${fmtSim(s.sim)}`);
    }
    for (const s of activeInsts) {
      const mark = expSkills.has(s.file) ? '✓' : '●';
      console.log(`    ${mark} [inst]  ${shortSkill(s.file).padEnd(35)} ${fmtSim(s.sim)}`);
    }
  } else {
    console.log(`  Co-activated context: (none above threshold)`);
  }

  // ── Warnings ──
  if (tc.expected_tools.length > 0) {
    const fps = topRanked.filter(r => r.sim >= THRESHOLD && !exp.has(r.id));
    if (fps.length > 0) {
      console.log(`  ⚠ Tool FP: ${fps.map(r => `${r.id} (${fmtSim(r.sim)})`).join(', ')}`);
    }
  }
  const misses = tc.expected_tools.filter(id => {
    const entry = topRanked.find(r => r.id === id);
    return !entry || entry.sim < THRESHOLD;
  });
  if (misses.length > 0) {
    console.log(`  ✗ Missed tools: ${misses.join(', ')}`);
  }
  if (tc.expected_skills && tc.expected_skills.length > 0) {
    const allActive = [...activeSkills, ...activeInsts].map(s => s.file);
    const skillMisses = tc.expected_skills.filter(f => !allActive.includes(f));
    if (skillMisses.length > 0) {
      console.log(`  ✗ Missed skills: ${skillMisses.join(', ')}`);
    }
  }
}

function printSummary(results, tools) {
  const bar = '═'.repeat(72);
  console.log(`\n${bar}`);
  console.log('  TOOL ROUTING — AGGREGATE SUMMARY');
  console.log(bar);

  const n = results.length;
  const avg = (fn) => results.reduce((s, r) => s + fn(r), 0) / n;

  console.log(`\n  Cases     : ${n}`);
  console.log(`  Tools     : ${tools.length}`);
  console.log(`  Threshold : ${THRESHOLD}`);
  console.log();
  console.log(`  ── Tool Accuracy ──`);
  console.log(`  Avg Precision : ${fmtPct(avg(r => r.metrics.precision))}`);
  console.log(`  Avg Recall    : ${fmtPct(avg(r => r.metrics.recall))}`);
  console.log(`  Avg F1        : ${fmtPct(avg(r => r.metrics.f1))}`);
  console.log(`  Avg MRR       : ${fmtPct(avg(r => r.metrics.mrr))}`);

  // Skill co-activation stats
  const skillStats = results.map(r => ({
    activeSkills: r.skillRanked.filter(s => s.sim >= THRESHOLD).length,
    activeInsts: r.instRanked.filter(s => s.sim >= THRESHOLD).length,
  }));
  const avgSkills = skillStats.reduce((s, r) => s + r.activeSkills, 0) / n;
  const avgInsts = skillStats.reduce((s, r) => s + r.activeInsts, 0) / n;
  console.log();
  console.log(`  ── Skill Co-activation ──`);
  console.log(`  Avg skills fired  : ${avgSkills.toFixed(1)}`);
  console.log(`  Avg instr. fired  : ${avgInsts.toFixed(1)}`);

  // Skill accuracy (for cases that have expected_skills)
  const withExpSkills = results.filter(r => r.tc.expected_skills && r.tc.expected_skills.length > 0);
  if (withExpSkills.length > 0) {
    const sn = withExpSkills.length;
    let totalHits = 0, totalExpected = 0, totalFired = 0;
    for (const r of withExpSkills) {
      const active = new Set([
        ...r.skillRanked.filter(s => s.sim >= THRESHOLD).map(s => s.file),
        ...r.instRanked.filter(s => s.sim >= THRESHOLD).map(s => s.file),
      ]);
      const hits = r.tc.expected_skills.filter(f => active.has(f)).length;
      totalHits += hits;
      totalExpected += r.tc.expected_skills.length;
      totalFired += active.size;
    }
    const skillP = totalFired > 0 ? totalHits / totalFired : 0;
    const skillR = totalExpected > 0 ? totalHits / totalExpected : 0;
    const skillF1 = (skillP + skillR > 0) ? (2 * skillP * skillR) / (skillP + skillR) : 0;
    console.log(`  Cases with expected_skills : ${sn}`);
    console.log(`  Skill Precision : ${fmtPct(skillP)}`);
    console.log(`  Skill Recall    : ${fmtPct(skillR)}`);
    console.log(`  Skill F1        : ${fmtPct(skillF1)}`);
  }

  // Per-server breakdown
  const servers = [...new Set(tools.map(t => t.server))];
  for (const srv of servers) {
    const srvCases = results.filter(r =>
      r.tc.expected_tools.some(id => id.startsWith(`${srv}:`))
    );
    if (srvCases.length === 0) continue;
    const sn = srvCases.length;
    const sAvg = (fn) => srvCases.reduce((s, r) => s + fn(r), 0) / sn;
    console.log(`\n  ── ${srv.toUpperCase()} (${sn} cases) ──`);
    console.log(`  Avg F1  : ${fmtPct(sAvg(r => r.metrics.f1))}`);
    console.log(`  Avg MRR : ${fmtPct(sAvg(r => r.metrics.mrr))}`);
  }

  // Cross-MCP cases
  const crossCases = results.filter(r => {
    const srvs = new Set(r.tc.expected_tools.map(id => id.split(':')[0]));
    return srvs.size > 1;
  });
  if (crossCases.length > 0) {
    const cn = crossCases.length;
    const cAvg = (fn) => crossCases.reduce((s, r) => s + fn(r), 0) / cn;
    console.log(`\n  ── CROSS-MCP (${cn} cases) ──`);
    console.log(`  Avg F1  : ${fmtPct(cAvg(r => r.metrics.f1))}`);
    console.log(`  Avg MRR : ${fmtPct(cAvg(r => r.metrics.mrr))}`);
  }

  // Negative cases
  const negCases = results.filter(r => r.tc.expected_tools.length === 0);
  if (negCases.length > 0) {
    const nn = negCases.length;
    const nAvg = (fn) => negCases.reduce((s, r) => s + fn(r), 0) / nn;
    console.log(`\n  ── NEGATIVE (${nn} cases) ──`);
    console.log(`  Avg Precision : ${fmtPct(nAvg(r => r.metrics.precision))}`);
    const fpCount = negCases.filter(r => r.metrics.selectedCount > 0).length;
    console.log(`  False-trigger : ${fpCount}/${nn}`);
  }

  // Worst cases by F1
  const sorted = [...results]
    .filter(r => r.tc.expected_tools.length > 0)
    .sort((a, b) => a.metrics.f1 - b.metrics.f1);
  const worst = sorted.slice(0, 5);
  if (worst.length > 0) {
    console.log(`\n  Worst 5 cases (by tool F1):`);
    for (const r of worst) {
      const skillNames = r.skillRanked
        .filter(s => s.sim >= THRESHOLD)
        .slice(0, 2)
        .map(s => shortSkill(s.file));
      const skillStr = skillNames.length > 0 ? `  skills: ${skillNames.join(', ')}` : '';
      console.log(`    ${r.tc.id.padEnd(35)} F1: ${fmtPct(r.metrics.f1)}  MRR: ${fmtPct(r.metrics.mrr)}${skillStr}`);
    }
  }

  // Most-activated skills across all cases
  const skillFreq = new Map();
  for (const r of results) {
    for (const s of r.skillRanked.filter(s => s.sim >= THRESHOLD)) {
      skillFreq.set(s.file, (skillFreq.get(s.file) || 0) + 1);
    }
  }
  const topSkills = [...skillFreq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  if (topSkills.length > 0) {
    console.log(`\n  Most co-activated skills (across all cases):`);
    for (const [file, count] of topSkills) {
      console.log(`    ${shortSkill(file).padEnd(40)} ${count}/${n} cases`);
    }
  }

  console.log();
}

// ── main ─────────────────────────────────────────────────────────

async function main() {
  // Load tool catalog
  let tools = loadTools(CATALOG_PATH);
  if (tools.length === 0) {
    console.error('Error: No tools loaded from', CATALOG_PATH);
    process.exit(1);
  }

  // Apply server filter
  if (serverFilter) {
    tools = tools.filter(t => t.server === serverFilter);
  }

  // Load test cases — only tool-invocation category
  const { cases } = yaml.load(readFileSync(CASES_PATH, 'utf-8'));
  const toolCases = cases.filter(c => c.category === 'tool-invocation');
  if (toolCases.length === 0) {
    console.error('Error: No tool-invocation test cases found');
    process.exit(1);
  }

  // Load skills and instructions for co-activation analysis
  const skills = loadSkills(SKILLS_DIR);
  const instructions = loadInstructions(INST_DIR);

  console.log('\n┌────────────────────────────────────────────────────────────────┐');
  console.log('│  Tool Routing Eval — Embedding Similarity + Skill Co-activation│');
  console.log('└────────────────────────────────────────────────────────────────┘');
  console.log(`  Model     : Xenova/all-MiniLM-L6-v2`);
  console.log(`  Threshold : ${THRESHOLD}  |  Top-K : ${TOP_K}`);
  console.log(`  Tools     : ${tools.length}${serverFilter ? ` (filtered: ${serverFilter})` : ''}`);
  console.log(`  Skills    : ${skills.length}`);
  console.log(`  Instruct. : ${instructions.length}`);
  console.log(`  Cases     : ${toolCases.length}`);

  // Initialize model
  console.log('\n  Loading embedding model...');
  await initEmbedder();
  console.log('  Model ready.');

  // Pre-compute embeddings
  const toolEmbs = [];
  for (const t of tools) toolEmbs.push(await embedText(t.searchText));
  const skillEmbs = [];
  for (const s of skills) skillEmbs.push(await embedText(s.searchText));
  const instEmbs = [];
  for (const s of instructions) instEmbs.push(await embedText(s.searchText));

  // Evaluate
  const results = [];
  for (const tc of toolCases) {
    const qEmb = await embedText(tc.query);
    const ranked = rankTools(qEmb, tools, toolEmbs);
    const metrics = computeMetrics(ranked, tc.expected_tools);
    const skillRanked = rankItems(qEmb, skills, skillEmbs);
    const instRanked = rankItems(qEmb, instructions, instEmbs);

    results.push({ tc, ranked, metrics, skillRanked, instRanked });
    if (!briefMode) {
      printCase(tc, ranked.slice(0, TOP_K), metrics, skillRanked, instRanked);
    }
  }

  printSummary(results, tools);
}

main().catch(err => {
  console.error('\nError:', err.message);
  process.exit(1);
});
