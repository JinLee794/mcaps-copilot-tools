// PowerShell spawn wrapper — executes Outlook COM scripts via child_process.execFile
// Manages temp files internally (no VS Code terminal involvement)

import { execFile } from 'node:child_process';
import { writeFile, readFile, unlink, access } from 'node:fs/promises';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

// Script paths relative to repo root
// Fix Windows path: fileURLToPath may produce \c:\... or \\c:\... — strip ALL leading separators before drive letter
let REPO_ROOT = process.env.REPO_ROOT || fileURLToPath(new URL('../../../', import.meta.url));
REPO_ROOT = REPO_ROOT.replace(/^[\\/]+(?=[A-Za-z]:)/, '');
const SCRIPTS = {
  searchSingle: join(REPO_ROOT, '.github/skills/outlook-lookup/scripts/Search-OutlookEmail.ps1'),
  searchBatch: join(REPO_ROOT, '.github/skills/outlook-lookup/scripts/Search-OutlookEmailBatch.ps1'),
  recentEmails: join(REPO_ROOT, '.github/skills/outlook-lookup/scripts/Get-RecentOutlookEmails.ps1'),
  draftSingle: join(REPO_ROOT, '.github/skills/outlook-compose/scripts/New-OutlookDraft.ps1'),
  draftBatch: join(REPO_ROOT, '.github/skills/outlook-compose/scripts/New-OutlookDraftBatch.ps1'),
  calendarSearch: join(REPO_ROOT, '.github/skills/outlook-lookup/scripts/Search-OutlookCalendar.ps1')
};

const TIMEOUTS = {
  single: 30_000,   // 30s for single-account operations
  batch: 120_000,   // 120s for batch operations
  health: 10_000    // 10s for health check
};

/**
 * Generate a unique temp file path in OS temp directory.
 * @param {string} prefix
 * @param {string} ext
 * @returns {string}
 */
function tempPath(prefix, ext) {
  const id = randomBytes(6).toString('hex');
  return join(tmpdir(), `${prefix}_${id}.${ext}`);
}

/**
 * Silently delete a file if it exists.
 * @param {string} filePath
 */
async function safeDelete(filePath) {
  try {
    await unlink(filePath);
  } catch {
    // ignore — file may not exist
  }
}

/**
 * Execute a PowerShell script via execFile and return parsed JSON output.
 * @param {object} opts
 * @param {string} opts.script - Path to .ps1 file
 * @param {string[]} opts.args - Additional PowerShell arguments
 * @param {number} opts.timeout - Timeout in ms
 * @param {string} [opts.inputPath] - Temp input file to clean up
 * @param {string} opts.outputPath - Temp output file to read and clean up
 * @returns {Promise<{ ok: boolean, data?: any, error?: string, stderr?: string }>}
 */
export async function runPowerShell({ script, args, timeout, inputPath, outputPath }) {
  const psArgs = [
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-File', script,
    ...args
  ];

  try {
    await new Promise((resolve, reject) => {
      const proc = execFile('powershell.exe', psArgs, {
        timeout,
        windowsHide: true,
        maxBuffer: 10 * 1024 * 1024 // 10MB
      }, (err, stdout, stderr) => {
        if (err) {
          // Attach stderr for diagnostics
          err.stderr = stderr;
          reject(err);
        } else {
          resolve({ stdout, stderr });
        }
      });

      // Kill entire process tree on timeout
      proc.on('error', reject);
    });

    // Read and parse output JSON (strip BOM if present)
    const raw = (await readFile(outputPath, 'utf-8')).replace(/^\uFEFF/, '');
    const data = JSON.parse(raw);
    return { ok: true, data };
  } catch (err) {
    if (err.killed || err.signal === 'SIGTERM') {
      return { ok: false, error: `Script timed out after ${timeout}ms`, stderr: err.stderr || '' };
    }
    if (err.code === 'ENOENT' && err.path === 'powershell.exe') {
      return { ok: false, error: 'PowerShell is not available on this system' };
    }
    // Check if output file exists despite error (partial results)
    try {
      await access(outputPath);
      const raw = (await readFile(outputPath, 'utf-8')).replace(/^\uFEFF/, '');
      const data = JSON.parse(raw);
      return { ok: false, data, error: err.message, stderr: err.stderr || '' };
    } catch {
      return { ok: false, error: err.message, stderr: err.stderr || '' };
    }
  } finally {
    // Always clean up temp files
    if (inputPath) await safeDelete(inputPath);
    await safeDelete(outputPath);
  }
}

/**
 * Search emails for a single account.
 * @param {object} params - { contacts, daysBack, accountName, keywords }
 * @returns {Promise<{ ok: boolean, data?: any, error?: string }>}
 */
export async function searchEmailsSingle({ contacts, daysBack = 30, accountName = '', keywords = [] }) {
  const outputPath = tempPath('outlook_search', 'json');
  const args = [
    '-Contacts', ...contacts,
    '-DaysBack', String(daysBack),
    '-OutputPath', outputPath
  ];
  if (accountName) args.push('-AccountName', accountName);
  if (keywords.length > 0) args.push('-Keywords', ...keywords);

  return runPowerShell({
    script: SCRIPTS.searchSingle,
    args,
    timeout: TIMEOUTS.single,
    outputPath
  });
}

/**
 * Search emails for multiple accounts (batch mode).
 * @param {Array} specs - [{ account, contacts, keywords?, daysBack? }]
 * @returns {Promise<{ ok: boolean, data?: any, error?: string }>}
 */
export async function searchEmailsBatch(specs) {
  const inputPath = tempPath('outlook_batch_in', 'json');
  const outputPath = tempPath('outlook_batch_out', 'json');

  await writeFile(inputPath, JSON.stringify(specs), 'utf-8');

  return runPowerShell({
    script: SCRIPTS.searchBatch,
    args: ['-InputPath', inputPath, '-OutputPath', outputPath],
    timeout: TIMEOUTS.batch,
    inputPath,
    outputPath
  });
}

/**
 * Create a single email draft.
 * @param {object} params - { to, cc?, bcc?, subject, body, bodyType? }
 * @returns {Promise<{ ok: boolean, data?: any, error?: string }>}
 */
export async function createDraftSingle({ to, cc = [], bcc = [], subject, body, bodyType = 'HTML' }) {
  const outputPath = tempPath('outlook_draft', 'json');
  const bodyFile = tempPath('outlook_draft_body', 'html');
  await writeFile(bodyFile, body, 'utf-8');
  const args = [
    '-To', to.join('; '),
    '-Subject', subject,
    '-BodyFile', bodyFile,
    '-BodyType', bodyType,
    '-OutputPath', outputPath
  ];
  if (cc.length > 0) args.push('-Cc', cc.join('; '));
  if (bcc.length > 0) args.push('-Bcc', bcc.join('; '));

  return runPowerShell({
    script: SCRIPTS.draftSingle,
    args,
    timeout: TIMEOUTS.single,
    inputPath: bodyFile,
    outputPath
  });
}

/**
 * Create email drafts for multiple accounts (batch mode).
 * @param {Array} specs - [{ account, to, cc?, bcc?, subject, body, bodyType? }]
 * @returns {Promise<{ ok: boolean, data?: any, error?: string }>}
 */
export async function createDraftBatch(specs) {
  const inputPath = tempPath('outlook_draftbatch_in', 'json');
  const outputPath = tempPath('outlook_draftbatch_out', 'json');

  await writeFile(inputPath, JSON.stringify(specs), 'utf-8');

  return runPowerShell({
    script: SCRIPTS.draftBatch,
    args: ['-InputPath', inputPath, '-OutputPath', outputPath],
    timeout: TIMEOUTS.batch,
    inputPath,
    outputPath
  });
}

/**
 * Get the N most recent emails without requiring contact filtering.
 * @param {object} params - { maxResults, daysBack, folders, keywords }
 * @returns {Promise<{ ok: boolean, data?: any, error?: string }>}
 */
export async function getRecentEmails({ maxResults = 10, daysBack = 7, folders = 'Both', keywords = [] } = {}) {
  const outputPath = tempPath('outlook_recent', 'json');
  const args = [
    '-MaxResults', String(maxResults),
    '-DaysBack', String(daysBack),
    '-Folders', folders,
    '-OutputPath', outputPath
  ];
  if (keywords.length > 0) args.push('-Keywords', ...keywords);

  return runPowerShell({
    script: SCRIPTS.recentEmails,
    args,
    timeout: TIMEOUTS.single,
    outputPath
  });
}

/**
 * Search calendar events.
 * @param {object} params - { daysBack, daysForward, keywords, attendees, accountName, maxResults }
 * @returns {Promise<{ ok: boolean, data?: any, error?: string }>}
 */
export async function searchCalendarEvents({ daysBack = 14, daysForward = 14, keywords = [], attendees = [], accountName = '', maxResults = 50 } = {}) {
  const outputPath = tempPath('outlook_calendar', 'json');
  const args = [
    '-DaysBack', String(daysBack),
    '-DaysForward', String(daysForward),
    '-MaxResults', String(maxResults),
    '-OutputPath', outputPath
  ];
  if (accountName) args.push('-AccountName', accountName);
  if (keywords.length > 0) args.push('-Keywords', keywords.join(','));
  if (attendees.length > 0) args.push('-Attendees', attendees.join(','));

  return runPowerShell({
    script: SCRIPTS.calendarSearch,
    args,
    timeout: TIMEOUTS.single,
    outputPath
  });
}

/**
 * Health check — verify Outlook COM is reachable.
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function checkHealth() {
  const psArgs = [
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-Command',
    '$p = Get-Process -Name OUTLOOK -ErrorAction SilentlyContinue; if (-not $p) { Write-Output "NOT_RUNNING"; exit 1 }; try { $o = New-Object -ComObject Outlook.Application; $ns = $o.GetNamespace("MAPI"); Write-Output "OK:$($ns.CurrentUser.Name)" } catch { Write-Output "COM_FAILED:$_"; exit 1 }'
  ];

  return new Promise((resolve) => {
    execFile('powershell.exe', psArgs, {
      timeout: TIMEOUTS.health,
      windowsHide: true
    }, (err, stdout, stderr) => {
      const output = (stdout || '').trim();
      if (err) {
        if (output.startsWith('NOT_RUNNING')) {
          resolve({ ok: false, error: 'Outlook is not running' });
        } else if (output.startsWith('COM_FAILED')) {
          resolve({ ok: false, error: `Outlook COM unavailable: ${output.slice(11)}` });
        } else {
          resolve({ ok: false, error: err.message });
        }
      } else if (output.startsWith('OK:')) {
        resolve({ ok: true, user: output.slice(3) });
      } else {
        resolve({ ok: false, error: `Unexpected output: ${output}` });
      }
    });
  });
}

// Export for testing
export { SCRIPTS, TIMEOUTS, tempPath, safeDelete };
