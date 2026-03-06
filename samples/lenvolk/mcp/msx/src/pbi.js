// GitHub Stack Summary — data extraction from MSX Insights PBI Embedded report.
//
// Architecture: The MSX Insights report uses PBI Embedded (app-owns-data).
// Standard PBI REST API returns 401/403 because the user is not in the workspace.
// The PBI JS API (exportData) works inside the browser and is the proven extraction path.
//
// This module provides:
//   1. In-memory + file-based cache (30min TTL — data is dynamic)
//   2. CSV parsing for the PBI exportData format
//   3. Structured JSON output with saveExtractedData() for agent-driven extraction
//
// Data flow:
//   Agent uses Playwright MCP browser tools → MSXI → PBI embed → exportData CSV
//   → save_gh_stack_data MCP tool → parseCsv → structured JSON → cache
//
// The agent (not this module) handles browser navigation and MFA auth.
// See .github/skills/gh-stack-browser-extraction/SKILL.md for the extraction workflow.

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes — MSXI data is dynamic
const CACHE_MAX_ENTRIES = 100;

// ── MSXI Report Constants ─────────────────────────────────────
export const MSXI_REPORT = {
  url: 'https://msxinsights.microsoft.com/User/report/1e2a0d7a-1c19-4a7a-b8db-15b39197ac22',
  pbiReportId: '0d5f46d6-5d27-4f78-82d6-8be082dd6c9b',
  groupId: '824003d8-7e9b-4d4a-aa2a-fe295b23549e',
  datasetId: 'a0239518-1109-45a3-a3eb-1872dc10ac15',
  capacityId: '4a9c4178-9c1a-4bc0-9dce-81b7d39370f1',
  slicerTable: 'Dim_Account',
  slicerColumn: 'TPID_Text',
  accountStackVisualTitle: 'Account Stack Table',
  summaryVisualTitle: 'Summary Table',
  activePageName: 'Acc. View'
};

// ── In-process TTL cache ──────────────────────────────────────
function createCache(ttlMs = CACHE_TTL_MS, maxEntries = CACHE_MAX_ENTRIES) {
  const store = new Map();

  const evictExpired = () => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now - entry.ts > ttlMs) store.delete(key);
    }
  };

  return {
    get(key) {
      const entry = store.get(key);
      if (!entry) return undefined;
      if (Date.now() - entry.ts > ttlMs) {
        store.delete(key);
        return undefined;
      }
      return entry.value;
    },
    set(key, value) {
      evictExpired();
      if (store.size >= maxEntries) {
        const oldest = store.keys().next().value;
        store.delete(oldest);
      }
      store.set(key, { value, ts: Date.now() });
    },
    clear() { store.clear(); },
    get size() { return store.size; }
  };
}

// ── File-based cache ──────────────────────────────────────────
function getCacheDir() {
  const dir = join(homedir(), '.msxi', 'cache', 'gh-stack');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

function readFileCache(tpid) {
  try {
    const filePath = join(getCacheDir(), `${tpid}.json`);
    if (!existsSync(filePath)) return undefined;
    const stat = statSync(filePath);
    if (Date.now() - stat.mtimeMs > CACHE_TTL_MS) return undefined;
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return undefined;
  }
}

function writeFileCache(tpid, data) {
  try {
    const filePath = join(getCacheDir(), `${tpid}.json`);
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch {
    // silently fail — file cache is best-effort
  }
}

// ── CSV Parser ────────────────────────────────────────────────
// Parses CSV from PBI exportData() — handles quoted fields with commas/newlines

export function parseCsvRows(csv) {
  if (!csv || typeof csv !== 'string') return [];

  // Stage 1: Split into lines, respecting quoted fields that may contain newlines.
  // Preserves raw content (including quotes) for parsing in stage 2.
  const lines = [];
  let current = '';
  let inQuote = false;

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    if (ch === '"') {
      inQuote = !inQuote;
      current += ch;
    } else if (ch === '\n' && !inQuote) {
      if (current.length > 0 || lines.length > 0) lines.push(current);
      current = '';
    } else if (ch === '\r' && !inQuote) {
      // skip \r
    } else {
      current += ch;
    }
  }
  if (current.length > 0) lines.push(current);

  if (lines.length < 2) return [];

  const parseRow = (line) => {
    const fields = [];
    let field = '';
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (q && line[i + 1] === '"') { field += '"'; i++; }
        else q = !q;
      } else if (ch === ',' && !q) {
        fields.push(field);
        field = '';
      } else {
        field += ch;
      }
    }
    fields.push(field);
    return fields;
  };

  const headers = parseRow(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const fields = parseRow(lines[i]);
    if (fields.length === 0 || (fields.length === 1 && fields[0] === '')) continue;
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j].trim()] = (fields[j] ?? '').trim();
    }
    rows.push(obj);
  }
  return rows;
}

// ── Parse formatted ACR values ────────────────────────────────
// PBI exports formatted strings like "$181,744 YTD - $30,371 LCM" or "$29,265"

function parseAmount(str) {
  if (!str || str === '') return null;
  const cleaned = str.replace(/[$,]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function parseAcrPair(str) {
  if (!str || str === '') return { ytd: null, lcm: null };
  // Format: "$181,744 YTD - $30,371 LCM"
  const ytdMatch = str.match(/\$([\d,.]+)\s*YTD/i);
  const lcmMatch = str.match(/\$([\d,.]+)\s*LCM/i);
  if (ytdMatch || lcmMatch) {
    return {
      ytd: ytdMatch ? parseAmount(ytdMatch[1]) : null,
      lcm: lcmMatch ? parseAmount(lcmMatch[1]) : null
    };
  }
  // Single value: "$29,265"
  return { ytd: null, lcm: null, value: parseAmount(str) };
}

function parsePct(str) {
  if (!str || str === '') return null;
  const cleaned = str.replace(/%/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function parseIntSafe(str) {
  if (!str || str === '') return null;
  const cleaned = str.replace(/,/g, '');
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
}

// ── Transform Account Stack CSV row → structured JSON ─────────
export function parseAccountStackRow(row) {
  return {
    tpid: row['TPID'] || null,
    topParent: row['TopParent'] || null,
    timeZone: row['TimeZone'] || null,
    fieldAccountabilityUnit: row['FieldAccountabilityUnit'] || null,
    segment: row['STB Mid Segment'] || null,
    macc: row['MACC'] || null,
    unifiedSupport: row['Unified Support'] || null,
    action: row['Action'] || null,
    newLogoIncPotentialWin: row['New Logo Inc. Potential Win'] || null,
    ghcp: {
      seats: parseIntSafe(row['GHCP Seats']),
      entSeats: parseIntSafe(row['GHCP Ent Seats']),
      businessSeats: parseIntSafe(row['GHCP Business Seats']),
      standaloneSeats: parseIntSafe(row['GHCP Standalone Seats']),
      acr: parseAmount(row['GHCP ACR ($)']),
      entAcr: parseAmount(row['GHCP Ent ACR ($)']),
      businessAcr: parseAmount(row['GHCP Business ACR ($)']),
      standaloneAcr: parseAmount(row['GHCP Standalone ACR ($)']),
      arpu: parseAmount(row['ARPU']),
      attach: parsePct(row['GHCP Attach']),
      seatOppty: parseIntSafe(row['GHCP Seat Oppty']),
      remainingSeatOpp: parseIntSafe(row['Remaining GHCP Seat Opp'])
    },
    usage: {
      wauPct: parsePct(row['WAU %']),
      weuPct: parsePct(row['WEU %'])
    },
    ghe: {
      totalSeats: parseIntSafe(row['GHE Total Seats']),
      licenseSeats: parseIntSafe(row['GHE License Seats']),
      meteredSeats: parseIntSafe(row['GHE Metered Seats']),
      meteredAcr: parseAmount(row['GHE Metered ACR ($)'])
    },
    ado: {
      seats: parseIntSafe(row['ADO Seats'])
    },
    pru: {
      units: parseIntSafe(row['PRU Units']),
      acr: parseAmount(row['PRU ACR ($)'])
    },
    ghas: {
      totalSeats: parseIntSafe(row['GHAS Total Seats']),
      licenseSeats: parseIntSafe(row['GHAS License Seats']),
      meteredSeats: parseIntSafe(row['GHAS Metered Seats']),
      acr: parseAmount(row['GHAS ACR ($)'])
    },
    ghazdo: { seats: parseIntSafe(row['GHAzDO Seats']) },
    visualStudio: { seats: parseIntSafe(row['Visual Studio Seats']) },
    azureAcr: {
      sre: parseAmount(row['SRE ACR ($)']),
      aiFoundry: parseAmount(row['AI Foundry ACR ($)']),
      aks: parseAmount(row['AKS ACR ($)']),
      fabric: parseAmount(row['Fabric ACR ($)']),
      pgsql: parseAmount(row['PGSQL ACR ($)']),
      cspm: parseAmount(row['CSPM ACR ($)'])
    },
    team: {
      atu: row['ATU Aliases'] || null,
      ats: row['ATS Aliases'] || null,
      ssp: row['SSP Aliases'] || null,
      se: row['SE Aliases'] || null,
      seSoftware: row['SE Software Aliases'] || null,
      ghAe: row['GH AE Aliases'] || null
    }
  };
}

// ── Transform Summary CSV row → structured JSON ───────────────
export function parseSummaryRow(row) {
  return {
    acr: {
      totalGitHub: parseAcrPair(row['Total GH ACR']),
      ghcp: parseAcrPair(row['GHCP ACR']),
      pru: parseAcrPair(row['PRU ACR']),
      gheMetered: parseAcrPair(row['GHE met. ACR']),
      ghas: parseAcrPair(row['GHAS ACR'])
    },
    seats: {
      ghe: parseIntSafe(row['GHE Seats (LCM)']),
      ado: parseIntSafe(row['ADO Seats (LCM)']),
      ghcp: parseIntSafe(row['GHCP Seats (LCM)']),
      ghcpSeatOppty: parseIntSafe(row['GHCP Seat Oppty']),
      ghcpAttach: parsePct(row['GHCP Attach']),
      ghas: parseIntSafe(row['GHAS Seats (LCM)']),
      vss: parseIntSafe(row['VSS Lic. (LCM)'])
    },
    accounts: {
      unified: parseIntSafe(row['# Acc Unified']),
      macc: parseIntSafe(row['# Acc MACC'])
    }
  };
}

// ── PBI Client ────────────────────────────────────────────────
export function createPbiClient(options = {}) {
  const memCache = createCache(options.cacheTtlMs, options.cacheMaxEntries);

  // ── Public: get GitHub Stack Summary ──────────────────────
  const getGitHubStackSummary = async (tpid) => {
    const cacheKey = `gh-stack:${tpid}`;

    // Check memory cache
    const memHit = memCache.get(cacheKey);
    if (memHit) return memHit;

    // Check file cache
    const fileHit = readFileCache(tpid);
    if (fileHit) {
      memCache.set(cacheKey, fileHit);
      return fileHit;
    }

    // No cache — agent must extract via Playwright MCP browser tools
    return {
      tpid,
      retrievedAt: null,
      data: null,
      needsExtraction: true,
      message: `No cached data for TPID ${tpid}. ` +
        'Use the gh-stack-browser-extraction skill to extract fresh data ' +
        'from the MSX Insights report via Playwright MCP browser tools, ' +
        'then call save_gh_stack_data with the exported CSV.'
    };
  };

  // ── Public: save data from external extraction ────────────
  const saveExtractedData = (tpid, { accountStackCsv, summaryCsv }) => {
    const accountRows = parseCsvRows(accountStackCsv);
    const summaryRows = parseCsvRows(summaryCsv);

    const accountData = accountRows
      .filter(r => r.TPID === tpid || accountRows.length === 1)
      .map(parseAccountStackRow);

    const summaryData = summaryRows.length > 0 ? parseSummaryRow(summaryRows[0]) : null;

    const result = {
      tpid,
      retrievedAt: new Date().toISOString(),
      summary: summaryData,
      accounts: accountData,
      accountCount: accountData.length
    };

    const cacheKey = `gh-stack:${tpid}`;
    memCache.set(cacheKey, result);
    writeFileCache(tpid, result);
    return result;
  };

  // ── Public: clear cache ───────────────────────────────────
  const clearCache = () => memCache.clear();

  return {
    getGitHubStackSummary,
    saveExtractedData,
    clearCache,
    // Exported for testing
    _parseCsvRows: parseCsvRows,
    _parseAccountStackRow: parseAccountStackRow,
    _parseSummaryRow: parseSummaryRow,
    cache: memCache
  };
}
