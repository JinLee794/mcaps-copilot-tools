#!/usr/bin/env node
/**
 * score-cross-branch.mjs — Compare skill/instruction/tool routing across git branches.
 *
 * Loads skills, instructions, and tools from two git refs (branches, tags, or
 * commits) via `git show`, then evaluates embedding similarity side-by-side.
 *
 * Usage:
 *   node score-cross-branch.mjs                              # main vs HEAD
 *   node score-cross-branch.mjs --source main --target HEAD
 *   node score-cross-branch.mjs --source main --target feature/ag-ui
 *   node score-cross-branch.mjs --brief                      # summary only
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
import {
  loadSkillsFromRef,
  loadInstructionsFromRef,
  loadToolsFromRef,
  loadFileFromRef,
  parseFrontmatter,
} from './lib/loader.mjs';
import { catalogTokens, bodyTokens, estimateTokens } from './lib/tokens.mjs';

// ── paths ────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const CASES_PATH = join(__dirname, 'test-cases.yaml');

// Repo-relative paths (used with git show)
const SKILLS_REL = '.github/skills';
const INST_REL = '.github/instructions';
const TOOL_CATALOG_REL = '.github/eval/tool-catalog.yaml';

// ── config ───────────────────────────────────────────────────────
const THRESHOLD = parseFloat(process.env.THRESHOLD || '0.35');
const TOP_K = parseInt(process.env.TOP_K || '5', 10);
const F1_REGRESSION_LIMIT = parseFloat(process.env.F1_REGRESSION_LIMIT || '0.05');

// ── arg parsing ──────────────────────────────────────────────────
const args = process.argv.slice(2);
let source = 'main';
let target = 'HEAD';
let briefMode = false;
let ciMode = false;
let filterCategory = null; // null = all, 'skills' or 'tools'

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--source' && args[i + 1]) { source = args[++i]; continue; }
  if (args[i].startsWith('--source=')) { source = args[i].split('=')[1]; continue; }
  if (args[i] === '--target' && args[i + 1]) { target = args[++i]; continue; }
  if (args[i].startsWith('--target=')) { target = args[i].split('=')[1]; continue; }
  if (args[i] === '--brief') { briefMode = true; continue; }
  if (args[i] === '--ci') { ciMode = true; briefMode = true; continue; }
  if (args[i] === '--skills') { filterCategory = 'skills'; continue; }
  if (args[i] === '--tools') { filterCategory = 'tools'; continue; }
}

// ── helpers ──────────────────────────────────────────────────────

function rankItems(queryEmb, items, itemEmbs) {
  return items
    .map((item, i) => ({
      file: item.file || item.id,
      name: item.name || item.file,
      sim: cosineSimilarity(queryEmb, itemEmbs[i]),
    }))
    .sort((a, b) => b.sim - a.sim);
}

function computeMetrics(ranked, expected) {
  const selected = ranked.filter(r => r.sim >= THRESHOLD);
  const selectedFiles = new Set(selected.map(r => r.file));
  const expectedSet = new Set(expected);

  if (expected.length === 0) {
    const precision = selected.length === 0 ? 1 : 0;
    return { precision, recall: 1, f1: precision, mrr: 1, tp: 0, selectedCount: selected.length };
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

  return { precision, recall, f1, mrr, tp, selectedCount: selected.length };
}

function fmtSim(v) { return v.toFixed(3); }
function fmtPct(v) { return v.toFixed(2); }
function shortName(file) {
  return file
    .replace(/\/SKILL\.md$/, '')
    .replace(/[-_]SKILL\.md$/, '')
    .replace(/\.instructions\.md$/, '');
}

function delta(a, b) {
  const d = b - a;
  const sign = d > 0 ? '+' : '';
  return `${sign}${d.toFixed(2)}`;
}

// ── context composition ──────────────────────────────────────────

function computeContextProfile(skills, instructions, skillRanked, instRanked, t0Tokens) {
  const firedSkills = skillRanked.filter(r => r.sim >= THRESHOLD);
  const firedInst = instRanked.filter(r => r.sim >= THRESHOLD);

  const skillCat = skills.reduce((s, sk) => s + catalogTokens(sk), 0);
  const instCat = instructions.reduce((s, inst) => s + catalogTokens(inst), 0);

  const skillBody = firedSkills.reduce((s, r) => {
    const sk = skills.find(sk => sk.file === r.file);
    return s + (sk ? bodyTokens(sk) : 0);
  }, 0);

  const instBody = firedInst.reduce((s, r) => {
    const inst = instructions.find(i => i.file === r.file);
    return s + (inst ? bodyTokens(inst) : 0);
  }, 0);

  const disc = t0Tokens + skillCat + instCat + skillBody + instBody;
  const instRouted = t0Tokens + instCat + instBody + skillBody; // no skill catalog
  const instOnly = t0Tokens + instCat + instBody;               // no skills at all

  return {
    t0Tokens,
    skills: {
      count: skills.length, firedCount: firedSkills.length,
      catalogTokens: skillCat, bodyTokens: skillBody,
      firedNames: firedSkills.map(r => r.file),
    },
    instructions: {
      count: instructions.length, firedCount: firedInst.length,
      catalogTokens: instCat, bodyTokens: instBody,
      firedNames: firedInst.map(r => r.file),
    },
    discoverable: disc,
    instructionRouted: instRouted,
    instructionOnly: instOnly,
    catalogSavings: skillCat,
  };
}

function printContextBreakdown(srcCtx, tgtCtx) {
  console.log();
  console.log(`  CONTEXT COMPOSITION (estimated tokens)`);
  console.log(`  ${''.padEnd(26)}Source    Target      Δ`);
  const rows = [
    ['T0 (copilot-instr.md)', srcCtx.t0Tokens, tgtCtx.t0Tokens],
    ['T1 catalog (inst desc)', srcCtx.instructions.catalogTokens, tgtCtx.instructions.catalogTokens],
    ['T1 body (inst fired)', srcCtx.instructions.bodyTokens, tgtCtx.instructions.bodyTokens],
    ['T2 catalog (skill desc)', srcCtx.skills.catalogTokens, tgtCtx.skills.catalogTokens],
    ['T2 body (skills fired)', srcCtx.skills.bodyTokens, tgtCtx.skills.bodyTokens],
    ['── discoverable total', srcCtx.discoverable, tgtCtx.discoverable],
    ['── inst-routed total', srcCtx.instructionRouted, tgtCtx.instructionRouted],
    ['── inst-only total', srcCtx.instructionOnly, tgtCtx.instructionOnly],
    ['   catalog savings', srcCtx.catalogSavings, tgtCtx.catalogSavings],
  ];
  for (const [label, s, t] of rows) {
    console.log(`  ${label.padEnd(26)}${String(Math.round(s)).padStart(6)}    ${String(Math.round(t)).padStart(6)}    ${delta(s, t)}`);
  }
  console.log(`  Skills fired: ${srcCtx.skills.firedCount} → ${tgtCtx.skills.firedCount}  |  Inst fired: ${srcCtx.instructions.firedCount} → ${tgtCtx.instructions.firedCount}`);
}

// ── per-case output ──────────────────────────────────────────────

function printSkillCase(tc, srcTop, tgtTop, srcM, tgtM, srcExpected, tgtExpected) {
  const bar = '─'.repeat(76);
  const srcExpectedSet = new Set(srcExpected);
  const tgtExpectedSet = new Set(tgtExpected);

  console.log(`\n${bar}`);
  console.log(`  ${tc.id}  |  ${tc.role || ''}  |  ${tc.stage ? `Stage ${tc.stage}` : ''}`);
  console.log(`  "${tc.query}"`);
  console.log(`  Expected (source): ${srcExpected.join(', ') || '(none)'}`);
  console.log(`  Expected (target): ${tgtExpected.join(', ') || '(none)'}`);
  console.log();

  // Side-by-side
  const rows = Math.max(srcTop.length, tgtTop.length);
  const srcLabel = `SOURCE (${source})`;
  const tgtLabel = `TARGET (${target})`;
  console.log(`  ${srcLabel.padEnd(40)}${tgtLabel}`);
  console.log(`  ${'─'.repeat(38)}  ${'─'.repeat(38)}`);

  for (let i = 0; i < rows; i++) {
    const s = srcTop[i];
    const t = tgtTop[i];
    const sMark = s ? (srcExpectedSet.has(s.file) ? '✓' : s.sim >= THRESHOLD ? '●' : ' ') : ' ';
    const tMark = t ? (tgtExpectedSet.has(t.file) ? '✓' : t.sim >= THRESHOLD ? '●' : ' ') : ' ';
    const sStr = s ? `${sMark} ${(i + 1)}. ${shortName(s.file).slice(0, 24).padEnd(24)} ${fmtSim(s.sim)}` : '';
    const tStr = t ? `${tMark} ${(i + 1)}. ${shortName(t.file).slice(0, 24).padEnd(24)} ${fmtSim(t.sim)}` : '';
    console.log(`  ${sStr.padEnd(40)}${tStr}`);
  }

  console.log();
  console.log(`  ${''.padEnd(18)}Source    Target     Δ`);
  console.log(`  Precision       ${fmtPct(srcM.precision).padEnd(10)}${fmtPct(tgtM.precision).padEnd(11)}${delta(srcM.precision, tgtM.precision)}`);
  console.log(`  Recall          ${fmtPct(srcM.recall).padEnd(10)}${fmtPct(tgtM.recall).padEnd(11)}${delta(srcM.recall, tgtM.recall)}`);
  console.log(`  F1              ${fmtPct(srcM.f1).padEnd(10)}${fmtPct(tgtM.f1).padEnd(11)}${delta(srcM.f1, tgtM.f1)}`);
  console.log(`  MRR             ${fmtPct(srcM.mrr).padEnd(10)}${fmtPct(tgtM.mrr).padEnd(11)}${delta(srcM.mrr, tgtM.mrr)}`);
}

function printToolCase(tc, srcToolTop, tgtToolTop, srcTM, tgtTM,
                       srcSkillTop, tgtSkillTop, srcInstTop, tgtInstTop) {
  const bar = '─'.repeat(76);
  const exp = new Set(tc.expected_tools);
  const expSkills = new Set(tc.expected_skills || []);

  console.log(`\n${bar}`);
  console.log(`  ${tc.id}`);
  console.log(`  "${tc.query}"`);
  console.log(`  Expected tools: ${tc.expected_tools.length === 0 ? '(none)' : tc.expected_tools.join(', ')}`);
  if (tc.expected_skills?.length > 0) {
    console.log(`  Expected skills: ${tc.expected_skills.join(', ')}`);
  }
  console.log();

  // Tool comparison
  const rows = Math.max(srcToolTop.length, tgtToolTop.length);
  console.log(`  ${'TOOLS'.padEnd(40)}`);
  console.log(`  ${`Source (${source})`.padEnd(40)}Target (${target})`);
  console.log(`  ${'─'.repeat(38)}  ${'─'.repeat(38)}`);

  for (let i = 0; i < rows; i++) {
    const s = srcToolTop[i];
    const t = tgtToolTop[i];
    const sMark = s ? (exp.has(s.file) ? '✓' : s.sim >= THRESHOLD ? '●' : ' ') : ' ';
    const tMark = t ? (exp.has(t.file) ? '✓' : t.sim >= THRESHOLD ? '●' : ' ') : ' ';
    const sStr = s ? `${sMark} ${(i + 1)}. ${s.name.slice(0, 24).padEnd(24)} ${fmtSim(s.sim)}` : '';
    const tStr = t ? `${tMark} ${(i + 1)}. ${t.name.slice(0, 24).padEnd(24)} ${fmtSim(t.sim)}` : '';
    console.log(`  ${sStr.padEnd(40)}${tStr}`);
  }

  console.log(`  Tool P/R/F1/MRR: ${fmtPct(srcTM.f1)}/${fmtPct(srcTM.mrr)} → ${fmtPct(tgtTM.f1)}/${fmtPct(tgtTM.mrr)}  Δ F1: ${delta(srcTM.f1, tgtTM.f1)}`);

  // Skill co-activation comparison
  const srcActive = srcSkillTop.filter(r => r.sim >= THRESHOLD).slice(0, 3);
  const tgtActive = tgtSkillTop.filter(r => r.sim >= THRESHOLD).slice(0, 3);
  const srcInstActive = srcInstTop.filter(r => r.sim >= THRESHOLD).slice(0, 2);
  const tgtInstActive = tgtInstTop.filter(r => r.sim >= THRESHOLD).slice(0, 2);

  if (srcActive.length > 0 || tgtActive.length > 0) {
    console.log();
    const sRows = Math.max(srcActive.length + srcInstActive.length,
                           tgtActive.length + tgtInstActive.length);
    const srcAll = [...srcActive.map(s => ({...s, type: 'skill'})), ...srcInstActive.map(s => ({...s, type: 'inst'}))];
    const tgtAll = [...tgtActive.map(s => ({...s, type: 'skill'})), ...tgtInstActive.map(s => ({...s, type: 'inst'}))];
    console.log(`  ${'CO-ACTIVATED CONTEXT'.padEnd(40)}`);
    console.log(`  ${`Source (${source})`.padEnd(40)}Target (${target})`);

    for (let i = 0; i < Math.max(srcAll.length, tgtAll.length); i++) {
      const s = srcAll[i];
      const t = tgtAll[i];
      const sStr = s ? `[${s.type}] ${shortName(s.file).slice(0, 24).padEnd(24)} ${fmtSim(s.sim)}` : '';
      const tStr = t ? `[${t.type}] ${shortName(t.file).slice(0, 24).padEnd(24)} ${fmtSim(t.sim)}` : '';
      console.log(`    ${sStr.padEnd(38)}${tStr}`);
    }
  }
}

// ── summary ──────────────────────────────────────────────────────

function printSummary(skillResults, toolResults) {
  const bar = '═'.repeat(76);
  console.log(`\n${bar}`);
  console.log(`  CROSS-BRANCH COMPARISON — ${source} → ${target}`);
  console.log(bar);

  // Skill routing summary
  if (skillResults.length > 0) {
    const n = skillResults.length;
    const avg = (fn) => skillResults.reduce((s, r) => s + fn(r), 0) / n;

    console.log(`\n  ── Skill Routing (${n} cases) ──`);
    console.log(`  ${'Metric'.padEnd(18)}${'Source'.padEnd(10)}${'Target'.padEnd(10)}Δ`);
    console.log(`  ${'─'.repeat(48)}`);
    const rows = [
      ['Avg Precision', avg(r => r.srcM.precision), avg(r => r.tgtM.precision)],
      ['Avg Recall', avg(r => r.srcM.recall), avg(r => r.tgtM.recall)],
      ['Avg F1', avg(r => r.srcM.f1), avg(r => r.tgtM.f1)],
      ['Avg MRR', avg(r => r.srcM.mrr), avg(r => r.tgtM.mrr)],
    ];
    for (const [label, s, t] of rows) {
      console.log(`  ${label.padEnd(18)}${fmtPct(s).padEnd(10)}${fmtPct(t).padEnd(10)}${delta(s, t)}`);
    }

    // Skill count diff
    const srcSkillCount = skillResults[0]?.srcSkillCount ?? 0;
    const tgtSkillCount = skillResults[0]?.tgtSkillCount ?? 0;
    console.log(`  ${'Skills loaded'.padEnd(18)}${String(srcSkillCount).padEnd(10)}${String(tgtSkillCount).padEnd(10)}${delta(srcSkillCount, tgtSkillCount)}`);

    // Instruction count diff
    const srcInstCount = skillResults[0]?.srcInstCount ?? 0;
    const tgtInstCount = skillResults[0]?.tgtInstCount ?? 0;
    console.log(`  ${'Instructions'.padEnd(18)}${String(srcInstCount).padEnd(10)}${String(tgtInstCount).padEnd(10)}${delta(srcInstCount, tgtInstCount)}`);
  }

  // Tool routing summary
  if (toolResults.length > 0) {
    const n = toolResults.length;
    const avg = (fn) => toolResults.reduce((s, r) => s + fn(r), 0) / n;

    console.log(`\n  ── Tool Routing (${n} cases) ──`);
    console.log(`  ${'Metric'.padEnd(18)}${'Source'.padEnd(10)}${'Target'.padEnd(10)}Δ`);
    console.log(`  ${'─'.repeat(48)}`);
    const rows = [
      ['Avg Precision', avg(r => r.srcTM.precision), avg(r => r.tgtTM.precision)],
      ['Avg Recall', avg(r => r.srcTM.recall), avg(r => r.tgtTM.recall)],
      ['Avg F1', avg(r => r.srcTM.f1), avg(r => r.tgtTM.f1)],
      ['Avg MRR', avg(r => r.srcTM.mrr), avg(r => r.tgtTM.mrr)],
    ];
    for (const [label, s, t] of rows) {
      console.log(`  ${label.padEnd(18)}${fmtPct(s).padEnd(10)}${fmtPct(t).padEnd(10)}${delta(s, t)}`);
    }

    // Skill co-activation comparison
    const srcAvgSkills = toolResults.reduce((s, r) =>
      s + r.srcSkillRanked.filter(x => x.sim >= THRESHOLD).length, 0) / n;
    const tgtAvgSkills = toolResults.reduce((s, r) =>
      s + r.tgtSkillRanked.filter(x => x.sim >= THRESHOLD).length, 0) / n;
    const srcAvgInst = toolResults.reduce((s, r) =>
      s + r.srcInstRanked.filter(x => x.sim >= THRESHOLD).length, 0) / n;
    const tgtAvgInst = toolResults.reduce((s, r) =>
      s + r.tgtInstRanked.filter(x => x.sim >= THRESHOLD).length, 0) / n;

    console.log(`\n  ── Skill Co-activation (per tool case) ──`);
    console.log(`  ${'Avg skills fired'.padEnd(18)}${srcAvgSkills.toFixed(1).padEnd(10)}${tgtAvgSkills.toFixed(1).padEnd(10)}${delta(srcAvgSkills, tgtAvgSkills)}`);
    console.log(`  ${'Avg instr. fired'.padEnd(18)}${srcAvgInst.toFixed(1).padEnd(10)}${tgtAvgInst.toFixed(1).padEnd(10)}${delta(srcAvgInst, tgtAvgInst)}`);

    // Skill frequency diff
    const srcFreq = new Map();
    const tgtFreq = new Map();
    for (const r of toolResults) {
      for (const s of r.srcSkillRanked.filter(x => x.sim >= THRESHOLD))
        srcFreq.set(s.file, (srcFreq.get(s.file) || 0) + 1);
      for (const s of r.tgtSkillRanked.filter(x => x.sim >= THRESHOLD))
        tgtFreq.set(s.file, (tgtFreq.get(s.file) || 0) + 1);
    }
    const allSkillFiles = new Set([...srcFreq.keys(), ...tgtFreq.keys()]);
    const diffs = [...allSkillFiles]
      .map(f => ({ file: f, src: srcFreq.get(f) || 0, tgt: tgtFreq.get(f) || 0 }))
      .map(d => ({ ...d, delta: d.tgt - d.src }))
      .filter(d => d.delta !== 0)
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

    if (diffs.length > 0) {
      console.log(`\n  Skill activation changes (source → target):`);
      for (const d of diffs.slice(0, 8)) {
        const sign = d.delta > 0 ? '+' : '';
        console.log(`    ${shortName(d.file).padEnd(35)} ${d.src}→${d.tgt} (${sign}${d.delta})`);
      }
    }
  }

  // ── Context Strategy Comparison ──
  const allCtxResults = [...skillResults, ...toolResults].filter(r => r.srcCtx && r.tgtCtx);
  if (allCtxResults.length > 0) {
    const cn = allCtxResults.length;
    const avg = (fn) => allCtxResults.reduce((s, r) => s + fn(r), 0) / cn;

    const avgSrcDisc = avg(r => r.srcCtx.discoverable);
    const avgTgtDisc = avg(r => r.tgtCtx.discoverable);
    const avgSrcInstR = avg(r => r.srcCtx.instructionRouted);
    const avgTgtInstR = avg(r => r.tgtCtx.instructionRouted);
    const avgSrcInstOnly = avg(r => r.srcCtx.instructionOnly);
    const avgTgtInstOnly = avg(r => r.tgtCtx.instructionOnly);
    const avgSrcCatSave = avg(r => r.srcCtx.catalogSavings);
    const avgTgtCatSave = avg(r => r.tgtCtx.catalogSavings);
    const avgSrcSkillsFired = avg(r => r.srcCtx.skills.firedCount);
    const avgTgtSkillsFired = avg(r => r.tgtCtx.skills.firedCount);
    const avgSrcInstFired = avg(r => r.srcCtx.instructions.firedCount);
    const avgTgtInstFired = avg(r => r.tgtCtx.instructions.firedCount);

    console.log(`\n  ── Context Strategy Comparison (${cn} cases) ──`);
    console.log(`  Three loading strategies evaluated per invocation:`);
    console.log(`    discoverable   = T0 + skill catalog + inst catalog + fired bodies`);
    console.log(`    inst-routed    = T0 + inst catalog + fired bodies (no skill catalog)`);
    console.log(`    inst-only      = T0 + inst catalog + inst bodies (no skills at all)`);
    console.log();
    console.log(`  ${'Metric'.padEnd(26)}${'Source'.padEnd(10)}${'Target'.padEnd(10)}Δ`);
    console.log(`  ${'─'.repeat(56)}`);
    const ctxRows = [
      ['T0 (copilot-instr.md)', allCtxResults[0].srcCtx.t0Tokens, allCtxResults[0].tgtCtx.t0Tokens],
      ['Avg discoverable tok', avgSrcDisc, avgTgtDisc],
      ['Avg inst-routed tok', avgSrcInstR, avgTgtInstR],
      ['Avg inst-only tok', avgSrcInstOnly, avgTgtInstOnly],
      ['Avg catalog savings', avgSrcCatSave, avgTgtCatSave],
      ['Avg skills fired', avgSrcSkillsFired, avgTgtSkillsFired],
      ['Avg instructions fired', avgSrcInstFired, avgTgtInstFired],
    ];
    for (const [label, s, t] of ctxRows) {
      console.log(`  ${label.padEnd(26)}${String(Math.round(s)).padEnd(10)}${String(Math.round(t)).padEnd(10)}${delta(s, t)}`);
    }

    // Break down token budget proportions for target
    const tgtSkillCat = avg(r => r.tgtCtx.skills.catalogTokens);
    const tgtInstCat = avg(r => r.tgtCtx.instructions.catalogTokens);
    const tgtSkillBody = avg(r => r.tgtCtx.skills.bodyTokens);
    const tgtInstBody = avg(r => r.tgtCtx.instructions.bodyTokens);
    const tgtT0 = allCtxResults[0].tgtCtx.t0Tokens;
    const tgtTotal = avgTgtDisc || 1;

    console.log(`\n  Token budget breakdown (target ${target}, discoverable):`);
    console.log(`    T0 (always loaded)        ${String(Math.round(tgtT0)).padStart(6)} tok  (${(tgtT0 / tgtTotal * 100).toFixed(1)}%)`);
    console.log(`    T1 inst catalog           ${String(Math.round(tgtInstCat)).padStart(6)} tok  (${(tgtInstCat / tgtTotal * 100).toFixed(1)}%)`);
    console.log(`    T1 inst body (avg fired)  ${String(Math.round(tgtInstBody)).padStart(6)} tok  (${(tgtInstBody / tgtTotal * 100).toFixed(1)}%)`);
    console.log(`    T2 skill catalog          ${String(Math.round(tgtSkillCat)).padStart(6)} tok  (${(tgtSkillCat / tgtTotal * 100).toFixed(1)}%)`);
    console.log(`    T2 skill body (avg fired) ${String(Math.round(tgtSkillBody)).padStart(6)} tok  (${(tgtSkillBody / tgtTotal * 100).toFixed(1)}%)`);
    console.log(`    ─────────────────────────────────`);
    console.log(`    Total (discoverable)      ${String(Math.round(tgtTotal)).padStart(6)} tok`);

    if (avgTgtCatSave > 100) {
      console.log(`\n  → Removing skill catalog from T0 saves ~${Math.round(avgTgtCatSave)} tok/turn (${(avgTgtCatSave / tgtTotal * 100).toFixed(1)}%)`);
      console.log(`    Instruction-routed cost: ~${Math.round(avgTgtInstR)} tok/turn`);
      console.log(`    Instruction-only cost:   ~${Math.round(avgTgtInstOnly)} tok/turn`);
      console.log(`    Trade-off: accuracy depends on instruction descriptions covering skill routing.`);
    }
  }

  // Regressions / improvements
  const allResults = [...skillResults, ...toolResults];
  if (allResults.length > 0) {
    const regressions = [];
    const improvements = [];
    for (const r of skillResults) {
      const d = r.tgtM.f1 - r.srcM.f1;
      if (d < -0.05) regressions.push({ id: r.tc.id, srcF1: r.srcM.f1, tgtF1: r.tgtM.f1, d });
      if (d > 0.05) improvements.push({ id: r.tc.id, srcF1: r.srcM.f1, tgtF1: r.tgtM.f1, d });
    }
    for (const r of toolResults) {
      const d = r.tgtTM.f1 - r.srcTM.f1;
      if (d < -0.05) regressions.push({ id: r.tc.id, srcF1: r.srcTM.f1, tgtF1: r.tgtTM.f1, d });
      if (d > 0.05) improvements.push({ id: r.tc.id, srcF1: r.srcTM.f1, tgtF1: r.tgtTM.f1, d });
    }

    if (regressions.length > 0) {
      regressions.sort((a, b) => a.d - b.d);
      console.log(`\n  ⚠ Regressions (F1 dropped >5%): ${regressions.length}`);
      for (const r of regressions.slice(0, 5)) {
        console.log(`    ${r.id.padEnd(35)} ${fmtPct(r.srcF1)} → ${fmtPct(r.tgtF1)}  (${delta(r.srcF1, r.tgtF1)})`);
      }
    }

    if (improvements.length > 0) {
      improvements.sort((a, b) => b.d - a.d);
      console.log(`\n  ✓ Improvements (F1 gained >5%): ${improvements.length}`);
      for (const r of improvements.slice(0, 5)) {
        console.log(`    ${r.id.padEnd(35)} ${fmtPct(r.srcF1)} → ${fmtPct(r.tgtF1)}  (${delta(r.srcF1, r.tgtF1)})`);
      }
    }

    if (regressions.length === 0 && improvements.length === 0) {
      console.log(`\n  No significant changes (±5% F1 threshold).`);
    }
  }

  console.log();
}

// ── main ─────────────────────────────────────────────────────────

async function main() {
  // Load test cases
  const { cases } = yaml.load(readFileSync(CASES_PATH, 'utf-8'));
  const skillCases = cases.filter(c => c.category !== 'tool-invocation');
  const toolCases = cases.filter(c => c.category === 'tool-invocation');

  // Load from both refs
  console.log(`\n  Loading context from source: ${source}`);
  const srcSkills = loadSkillsFromRef(source, SKILLS_REL);
  const srcInst = loadInstructionsFromRef(source, INST_REL);
  const srcTools = loadToolsFromRef(source, TOOL_CATALOG_REL);

  console.log(`  Loading context from target: ${target}`);
  const tgtSkills = loadSkillsFromRef(target, SKILLS_REL);
  const tgtInst = loadInstructionsFromRef(target, INST_REL);
  const tgtTools = loadToolsFromRef(target, TOOL_CATALOG_REL);

  // Tier 0 context (copilot-instructions.md — always loaded)
  const COPILOT_INST_REL = '.github/copilot-instructions.md';
  const srcT0Content = loadFileFromRef(source, COPILOT_INST_REL) || '';
  const tgtT0Content = loadFileFromRef(target, COPILOT_INST_REL) || '';
  const srcT0Tokens = estimateTokens(srcT0Content);
  const tgtT0Tokens = estimateTokens(tgtT0Content);

  // Header
  console.log('\n┌────────────────────────────────────────────────────────────────────────────┐');
  console.log('│  Cross-Branch Eval — Skill, Instruction & Tool Routing Comparison          │');
  console.log('└────────────────────────────────────────────────────────────────────────────────┘');
  console.log(`  Model      : Xenova/all-MiniLM-L6-v2`);
  console.log(`  Threshold  : ${THRESHOLD}  |  Top-K : ${TOP_K}`);
  console.log(`  Source     : ${source}  (${srcSkills.length} skills, ${srcInst.length} inst, ${srcTools.length} tools, T0: ~${srcT0Tokens} tok)`);
  console.log(`  Target     : ${target}  (${tgtSkills.length} skills, ${tgtInst.length} inst, ${tgtTools.length} tools, T0: ~${tgtT0Tokens} tok)`);

  const runSkills = filterCategory !== 'tools' && skillCases.length > 0;
  const runTools = filterCategory !== 'skills' && toolCases.length > 0;

  if (runSkills) console.log(`  Skill cases: ${skillCases.length}`);
  if (runTools) console.log(`  Tool cases : ${toolCases.length}`);

  // Initialize model
  console.log('\n  Loading embedding model...');
  await initEmbedder();
  console.log('  Model ready.\n');

  // Pre-compute embeddings
  const srcSkillEmbs = [];
  for (const s of srcSkills) srcSkillEmbs.push(await embedText(s.searchText));
  const tgtSkillEmbs = [];
  for (const s of tgtSkills) tgtSkillEmbs.push(await embedText(s.searchText));

  const srcInstEmbs = [];
  for (const s of srcInst) srcInstEmbs.push(await embedText(s.searchText));
  const tgtInstEmbs = [];
  for (const s of tgtInst) tgtInstEmbs.push(await embedText(s.searchText));

  const srcToolEmbs = [];
  for (const t of srcTools) srcToolEmbs.push(await embedText(t.searchText));
  const tgtToolEmbs = [];
  for (const t of tgtTools) tgtToolEmbs.push(await embedText(t.searchText));

  // ── Evaluate skill-routing cases ──
  const skillResults = [];
  if (runSkills) {
    console.log('  ─── Skill Routing Cases ───');
    for (const tc of skillCases) {
      const qEmb = await embedText(tc.query);

      const srcRanked = rankItems(qEmb, srcSkills, srcSkillEmbs);
      const tgtRanked = rankItems(qEmb, tgtSkills, tgtSkillEmbs);

      // Instruction rankings for context composition tracking
      const srcInstRanked = rankItems(qEmb, srcInst, srcInstEmbs);
      const tgtInstRanked = rankItems(qEmb, tgtInst, tgtInstEmbs);

      // Both refs evaluated against the same ground truth (flat expected array)
      const expected = Array.isArray(tc.expected) ? tc.expected : [];
      const srcExpected = expected;
      const tgtExpected = expected;
      const srcM = computeMetrics(srcRanked, srcExpected);
      const tgtM = computeMetrics(tgtRanked, tgtExpected);

      // Context composition profiles
      const srcCtx = computeContextProfile(srcSkills, srcInst, srcRanked, srcInstRanked, srcT0Tokens);
      const tgtCtx = computeContextProfile(tgtSkills, tgtInst, tgtRanked, tgtInstRanked, tgtT0Tokens);

      skillResults.push({
        tc, srcM, tgtM, srcCtx, tgtCtx,
        srcSkillCount: srcSkills.length,
        tgtSkillCount: tgtSkills.length,
        srcInstCount: srcInst.length,
        tgtInstCount: tgtInst.length,
      });

      if (!briefMode) {
        printSkillCase(tc, srcRanked.slice(0, TOP_K), tgtRanked.slice(0, TOP_K), srcM, tgtM, srcExpected, tgtExpected);
        printContextBreakdown(srcCtx, tgtCtx);
      }
    }
  }

  // ── Evaluate tool-routing cases ──
  const toolResults = [];
  if (runTools && srcTools.length > 0 && tgtTools.length > 0) {
    console.log('\n  ─── Tool Routing Cases ───');
    for (const tc of toolCases) {
      const qEmb = await embedText(tc.query);

      const srcToolRanked = rankItems(qEmb, srcTools, srcToolEmbs);
      const tgtToolRanked = rankItems(qEmb, tgtTools, tgtToolEmbs);
      const srcTM = computeMetrics(srcToolRanked, tc.expected_tools);
      const tgtTM = computeMetrics(tgtToolRanked, tc.expected_tools);

      const srcSkillRanked = rankItems(qEmb, srcSkills, srcSkillEmbs);
      const tgtSkillRanked = rankItems(qEmb, tgtSkills, tgtSkillEmbs);
      const srcInstRanked = rankItems(qEmb, srcInst, srcInstEmbs);
      const tgtInstRanked = rankItems(qEmb, tgtInst, tgtInstEmbs);

      // Context composition profiles
      const srcCtx = computeContextProfile(srcSkills, srcInst, srcSkillRanked, srcInstRanked, srcT0Tokens);
      const tgtCtx = computeContextProfile(tgtSkills, tgtInst, tgtSkillRanked, tgtInstRanked, tgtT0Tokens);

      toolResults.push({
        tc, srcTM, tgtTM,
        srcSkillRanked, tgtSkillRanked,
        srcInstRanked, tgtInstRanked,
        srcCtx, tgtCtx,
      });

      if (!briefMode) {
        printToolCase(
          tc,
          srcToolRanked.slice(0, TOP_K), tgtToolRanked.slice(0, TOP_K),
          srcTM, tgtTM,
          srcSkillRanked, tgtSkillRanked,
          srcInstRanked, tgtInstRanked,
        );
        printContextBreakdown(srcCtx, tgtCtx);
      }
    }
  } else if (runTools && (srcTools.length === 0 || tgtTools.length === 0)) {
    console.log(`\n  ⚠ Tool catalog not available on ${srcTools.length === 0 ? source : target} — skipping tool comparison.`);
  }

  printSummary(skillResults, toolResults);

  return { skillResults, toolResults };
}

main().then(({ skillResults, toolResults }) => {
  if (!ciMode) process.exit(0);

  // CI gate: check for aggregate F1 regression
  const allResults = [...skillResults, ...toolResults];
  if (allResults.length === 0) process.exit(0);

  const avgSrcF1 = skillResults.reduce((s, r) => s + r.srcM.f1, 0) / (skillResults.length || 1);
  const avgTgtF1 = skillResults.reduce((s, r) => s + r.tgtM.f1, 0) / (skillResults.length || 1);
  const f1Drop = avgSrcF1 - avgTgtF1;

  const regressions = skillResults.filter(r => (r.srcM.f1 - r.tgtM.f1) > F1_REGRESSION_LIMIT);

  if (f1Drop > F1_REGRESSION_LIMIT) {
    console.error(`\n  ✗ CI FAILED: Avg F1 regressed by ${f1Drop.toFixed(3)} (limit: ${F1_REGRESSION_LIMIT})`);
    console.error(`    ${regressions.length} case(s) regressed beyond threshold.`);
    process.exit(1);
  }

  console.log(`\n  ✓ CI PASSED: Avg F1 delta ${(avgTgtF1 - avgSrcF1).toFixed(3)} (limit: -${F1_REGRESSION_LIMIT})`);
  process.exit(0);
}).catch(err => {
  console.error('\nError:', err.message);
  process.exit(1);
});
