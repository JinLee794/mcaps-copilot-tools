// Resolve Teams cache directory based on OS and configuration
// Supports Windows (MSIX & classic), macOS, and TEAMS_CACHE_PATH env override

import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

// Windows new Teams (MSIX package)
const WIN_MSIX = join(
  process.env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local'),
  'Packages', 'MSTeams_8wekyb3d8bbwe', 'LocalCache', 'Microsoft', 'MSTeams',
  'EBWebView', 'WV2Profile_tfw', 'IndexedDB',
  'https_teams.microsoft.com_0.indexeddb.leveldb'
);

// Windows classic Teams (rare, older installs)
const WIN_CLASSIC = join(
  process.env.APPDATA || join(homedir(), 'AppData', 'Roaming'),
  'Microsoft', 'Teams', 'IndexedDB',
  'https_teams.microsoft.com_0.indexeddb.leveldb'
);

// macOS new Teams
const MAC_PATH = join(
  homedir(),
  'Library', 'Containers', 'com.microsoft.teams2', 'Data',
  'Library', 'Application Support', 'Microsoft', 'MSTeams',
  'EBWebView', 'WV2Profile_tfw', 'IndexedDB',
  'https_teams.microsoft.com_0.indexeddb.leveldb'
);

const CANDIDATES = process.platform === 'darwin'
  ? [MAC_PATH]
  : [WIN_MSIX, WIN_CLASSIC];

/**
 * Resolve the Teams IndexedDB LevelDB cache directory.
 * Priority: TEAMS_CACHE_PATH env → platform-specific candidates.
 * @returns {string} Absolute path to the LevelDB directory
 */
export function resolveCachePath() {
  if (process.env.TEAMS_CACHE_PATH) {
    if (!existsSync(process.env.TEAMS_CACHE_PATH)) {
      throw new Error(`TEAMS_CACHE_PATH not found: ${process.env.TEAMS_CACHE_PATH}`);
    }
    return process.env.TEAMS_CACHE_PATH;
  }

  for (const candidate of CANDIDATES) {
    if (existsSync(candidate)) return candidate;
  }

  throw new Error(
    `Teams cache not found. Checked:\n${CANDIDATES.join('\n')}\n` +
    'Set TEAMS_CACHE_PATH environment variable to override.'
  );
}

/**
 * Get cache directory statistics (file counts, sizes, freshness).
 * @param {string} cachePath
 * @returns {{ path, ldbCount, logCount, totalSizeBytes, totalSizeMB, lastModified }}
 */
export function getCacheStats(cachePath) {
  const files = readdirSync(cachePath);
  const ldbFiles = files.filter(f => f.endsWith('.ldb'));
  const logFiles = files.filter(f => f.endsWith('.log'));

  let totalSize = 0;
  let latestMtime = 0;

  for (const f of [...ldbFiles, ...logFiles]) {
    const st = statSync(join(cachePath, f));
    totalSize += st.size;
    if (st.mtimeMs > latestMtime) latestMtime = st.mtimeMs;
  }

  return {
    path: cachePath,
    ldbCount: ldbFiles.length,
    logCount: logFiles.length,
    totalSizeBytes: totalSize,
    totalSizeMB: +(totalSize / (1024 * 1024)).toFixed(1),
    lastModified: latestMtime ? new Date(latestMtime).toISOString() : null
  };
}
