import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Validation tests (pure, no mocking needed) ──────────────
import {
  validateEmail, validateEmails, validateAccountName,
  validateDaysBack, validateKeywords, validateBatchSearchInput,
  validateBatchDraftInput, validateSubject
} from '../validation.js';

describe('validateEmail', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('user@example.com')).toEqual({ valid: true });
    expect(validateEmail('a.b+c@sub.domain.org')).toEqual({ valid: true });
  });

  it('rejects non-string', () => {
    expect(validateEmail(123).valid).toBe(false);
    expect(validateEmail(null).valid).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validateEmail('').valid).toBe(false);
    expect(validateEmail('   ').valid).toBe(false);
  });

  it('rejects invalid format', () => {
    expect(validateEmail('no-at-sign').valid).toBe(false);
    expect(validateEmail('@no-local.com').valid).toBe(false);
    expect(validateEmail('no-domain@').valid).toBe(false);
    expect(validateEmail('spaces in@email.com').valid).toBe(false);
  });

  it('rejects overly long emails', () => {
    const long = 'a'.repeat(250) + '@b.com';
    expect(validateEmail(long).valid).toBe(false);
  });

  it('trims whitespace from valid emails', () => {
    expect(validateEmail(' user@example.com ').valid).toBe(true);
  });
});

describe('validateEmails', () => {
  it('accepts valid array', () => {
    const result = validateEmails(['a@b.com', 'c@d.com']);
    expect(result.valid).toBe(true);
    expect(result.emails).toEqual(['a@b.com', 'c@d.com']);
  });

  it('trims emails', () => {
    const result = validateEmails([' a@b.com ']);
    expect(result.emails).toEqual(['a@b.com']);
  });

  it('rejects non-array', () => {
    expect(validateEmails('not-array').valid).toBe(false);
  });

  it('rejects empty array', () => {
    expect(validateEmails([]).valid).toBe(false);
  });

  it('rejects if any email is invalid', () => {
    const result = validateEmails(['a@b.com', 'invalid']);
    expect(result.valid).toBe(false);
  });

  it('rejects too many emails', () => {
    const tooMany = Array.from({ length: 101 }, (_, i) => `u${i}@b.com`);
    expect(validateEmails(tooMany).valid).toBe(false);
  });
});

describe('validateAccountName', () => {
  it('accepts normal names', () => {
    expect(validateAccountName('Contoso').valid).toBe(true);
    expect(validateAccountName('AT&T').valid).toBe(true); // & is allowed
  });

  it('rejects empty', () => {
    expect(validateAccountName('').valid).toBe(false);
    expect(validateAccountName('   ').valid).toBe(false);
  });

  it('rejects shell metacharacters', () => {
    expect(validateAccountName('test;rm').valid).toBe(false);
    expect(validateAccountName('$(whoami)').valid).toBe(false);
    expect(validateAccountName('test`cmd`').valid).toBe(false);
    expect(validateAccountName('a|b').valid).toBe(false);
  });

  it('rejects too long', () => {
    expect(validateAccountName('a'.repeat(201)).valid).toBe(false);
  });

  it('trims whitespace', () => {
    const result = validateAccountName(' Contoso ');
    expect(result.valid).toBe(true);
    expect(result.name).toBe('Contoso');
  });
});

describe('validateDaysBack', () => {
  it('accepts valid range', () => {
    expect(validateDaysBack(1).valid).toBe(true);
    expect(validateDaysBack(30).valid).toBe(true);
    expect(validateDaysBack(365).valid).toBe(true);
  });

  it('rejects out of range', () => {
    expect(validateDaysBack(0).valid).toBe(false);
    expect(validateDaysBack(366).valid).toBe(false);
    expect(validateDaysBack(-1).valid).toBe(false);
  });

  it('rejects non-integer', () => {
    expect(validateDaysBack(3.5).valid).toBe(false);
    expect(validateDaysBack('30').valid).toBe(false);
  });
});

describe('validateKeywords', () => {
  it('accepts valid keywords', () => {
    const result = validateKeywords(['GHAS', 'GHCP']);
    expect(result.valid).toBe(true);
    expect(result.keywords).toEqual(['GHAS', 'GHCP']);
  });

  it('skips empty strings', () => {
    const result = validateKeywords(['GHAS', '', '  ']);
    expect(result.keywords).toEqual(['GHAS']);
  });

  it('rejects non-array', () => {
    expect(validateKeywords('GHAS').valid).toBe(false);
  });

  it('rejects too many', () => {
    const tooMany = Array.from({ length: 21 }, (_, i) => `kw${i}`);
    expect(validateKeywords(tooMany).valid).toBe(false);
  });

  it('rejects overly long keyword', () => {
    const result = validateKeywords(['a'.repeat(101)]);
    expect(result.valid).toBe(false);
  });

  it('accepts empty array', () => {
    const result = validateKeywords([]);
    expect(result.valid).toBe(true);
    expect(result.keywords).toEqual([]);
  });
});

describe('validateBatchSearchInput', () => {
  it('accepts valid batch', () => {
    const result = validateBatchSearchInput([
      { account: 'COX', contacts: ['a@cox.com'], keywords: ['GHAS'], daysBack: 90 },
      { account: 'NIELSEN', contacts: ['b@nielsen.com'] }
    ]);
    expect(result.valid).toBe(true);
  });

  it('rejects non-array', () => {
    expect(validateBatchSearchInput('not-array').valid).toBe(false);
  });

  it('rejects empty array', () => {
    expect(validateBatchSearchInput([]).valid).toBe(false);
  });

  it('rejects invalid account name', () => {
    const result = validateBatchSearchInput([
      { account: '$(evil)', contacts: ['a@b.com'] }
    ]);
    expect(result.valid).toBe(false);
  });

  it('rejects invalid contacts', () => {
    const result = validateBatchSearchInput([
      { account: 'COX', contacts: ['not-email'] }
    ]);
    expect(result.valid).toBe(false);
  });

  it('rejects too many accounts', () => {
    const tooMany = Array.from({ length: 51 }, (_, i) => ({
      account: `Acct${i}`, contacts: [`u${i}@b.com`]
    }));
    expect(validateBatchSearchInput(tooMany).valid).toBe(false);
  });
});

describe('validateBatchDraftInput', () => {
  it('accepts valid batch', () => {
    const result = validateBatchDraftInput([
      { account: 'COX', to: ['a@cox.com'], subject: 'Hello', body: '<p>Hi</p>' }
    ]);
    expect(result.valid).toBe(true);
  });

  it('rejects missing subject', () => {
    const result = validateBatchDraftInput([
      { account: 'COX', to: ['a@cox.com'], subject: '', body: 'Hi' }
    ]);
    expect(result.valid).toBe(false);
  });

  it('rejects missing body', () => {
    const result = validateBatchDraftInput([
      { account: 'COX', to: ['a@cox.com'], subject: 'Hello', body: '' }
    ]);
    expect(result.valid).toBe(false);
  });

  it('rejects invalid bodyType', () => {
    const result = validateBatchDraftInput([
      { account: 'COX', to: ['a@cox.com'], subject: 'Hello', body: 'Hi', bodyType: 'Rich' }
    ]);
    expect(result.valid).toBe(false);
  });

  it('accepts optional cc/bcc', () => {
    const result = validateBatchDraftInput([
      { account: 'COX', to: ['a@cox.com'], cc: ['b@ms.com'], bcc: ['c@ms.com'], subject: 'Hello', body: 'Hi' }
    ]);
    expect(result.valid).toBe(true);
  });
});

describe('validateSubject', () => {
  it('accepts normal subjects', () => {
    expect(validateSubject('Hello World').valid).toBe(true);
  });

  it('rejects empty', () => {
    expect(validateSubject('').valid).toBe(false);
    expect(validateSubject('   ').valid).toBe(false);
  });

  it('rejects non-string', () => {
    expect(validateSubject(123).valid).toBe(false);
  });

  it('rejects overly long subject', () => {
    expect(validateSubject('x'.repeat(999)).valid).toBe(false);
  });
});

// ── Outlook.js spawn wrapper tests (mock execFile) ──────────
// We mock child_process.execFile and fs to test the spawn logic without Outlook

describe('outlook.js — runPowerShell', () => {
  let mockExecFile;
  let mockWriteFile;
  let mockReadFile;
  let mockUnlink;
  let mockAccess;

  beforeEach(async () => {
    // Reset all mocks
    vi.resetModules();

    // Mock child_process
    mockExecFile = vi.fn();
    vi.doMock('node:child_process', () => ({
      execFile: mockExecFile
    }));

    // Mock fs/promises
    mockWriteFile = vi.fn().mockResolvedValue(undefined);
    mockReadFile = vi.fn();
    mockUnlink = vi.fn().mockResolvedValue(undefined);
    mockAccess = vi.fn();
    vi.doMock('node:fs/promises', () => ({
      writeFile: mockWriteFile,
      readFile: mockReadFile,
      unlink: mockUnlink,
      access: mockAccess
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('runPowerShell returns parsed JSON on success', async () => {
    const { runPowerShell } = await import('../outlook.js');
    const outputData = { results: [{ subject: 'Test', from: 'a@b.com' }] };

    mockExecFile.mockImplementation((cmd, args, opts, cb) => {
      cb(null, '', '');
      return { on: vi.fn() };
    });
    mockReadFile.mockResolvedValueOnce(JSON.stringify(outputData));

    const result = await runPowerShell({
      script: 'test.ps1',
      args: ['-OutputPath', 'out.json'],
      timeout: 5000,
      outputPath: 'out.json'
    });

    expect(result.ok).toBe(true);
    expect(result.data).toEqual(outputData);
    // Verify cleanup was called
    expect(mockUnlink).toHaveBeenCalledWith('out.json');
  });

  it('runPowerShell cleans up input file on success', async () => {
    const { runPowerShell } = await import('../outlook.js');

    mockExecFile.mockImplementation((cmd, args, opts, cb) => {
      cb(null, '', '');
      return { on: vi.fn() };
    });
    mockReadFile.mockResolvedValueOnce('{}');

    await runPowerShell({
      script: 'test.ps1',
      args: [],
      timeout: 5000,
      inputPath: 'in.json',
      outputPath: 'out.json'
    });

    expect(mockUnlink).toHaveBeenCalledWith('in.json');
    expect(mockUnlink).toHaveBeenCalledWith('out.json');
  });

  it('runPowerShell returns error on script failure', async () => {
    const { runPowerShell } = await import('../outlook.js');

    const scriptError = new Error('Script exited with code 1');
    scriptError.stderr = 'Outlook is not running';
    mockExecFile.mockImplementation((cmd, args, opts, cb) => {
      cb(scriptError, '', 'Outlook is not running');
      return { on: vi.fn() };
    });
    mockAccess.mockRejectedValueOnce(new Error('ENOENT'));

    const result = await runPowerShell({
      script: 'test.ps1',
      args: [],
      timeout: 5000,
      outputPath: 'out.json'
    });

    expect(result.ok).toBe(false);
    expect(result.error).toContain('Script exited with code 1');
    expect(result.stderr).toBe('Outlook is not running');
  });

  it('runPowerShell returns partial data when output exists despite error', async () => {
    const { runPowerShell } = await import('../outlook.js');
    const partialData = { _errors: { COX: 'COM timeout' }, NIELSEN: { emails: [] } };

    const scriptError = new Error('Exit code 2');
    scriptError.stderr = 'partial failure';
    mockExecFile.mockImplementation((cmd, args, opts, cb) => {
      cb(scriptError, '', 'partial failure');
      return { on: vi.fn() };
    });
    mockAccess.mockResolvedValueOnce(undefined);
    mockReadFile.mockResolvedValueOnce(JSON.stringify(partialData));

    const result = await runPowerShell({
      script: 'test.ps1',
      args: [],
      timeout: 5000,
      outputPath: 'out.json'
    });

    expect(result.ok).toBe(false);
    expect(result.data).toEqual(partialData);
    expect(result.error).toBe('Exit code 2');
  });

  it('runPowerShell reports timeout', async () => {
    const { runPowerShell } = await import('../outlook.js');

    const timeoutError = new Error('Process timed out');
    timeoutError.killed = true;
    timeoutError.signal = 'SIGTERM';
    mockExecFile.mockImplementation((cmd, args, opts, cb) => {
      cb(timeoutError, '', '');
      return { on: vi.fn() };
    });
    mockAccess.mockRejectedValueOnce(new Error('ENOENT'));

    const result = await runPowerShell({
      script: 'test.ps1',
      args: [],
      timeout: 100,
      outputPath: 'out.json'
    });

    expect(result.ok).toBe(false);
    expect(result.error).toContain('timed out');
  });

  it('runPowerShell reports missing PowerShell', async () => {
    const { runPowerShell } = await import('../outlook.js');

    const enoentError = new Error('spawn powershell.exe ENOENT');
    enoentError.code = 'ENOENT';
    enoentError.path = 'powershell.exe';
    mockExecFile.mockImplementation((cmd, args, opts, cb) => {
      cb(enoentError, '', '');
      return { on: vi.fn() };
    });
    mockAccess.mockRejectedValueOnce(new Error('ENOENT'));

    const result = await runPowerShell({
      script: 'test.ps1',
      args: [],
      timeout: 5000,
      outputPath: 'out.json'
    });

    expect(result.ok).toBe(false);
    expect(result.error).toContain('PowerShell is not available');
  });

  it('runPowerShell handles malformed JSON output', async () => {
    const { runPowerShell } = await import('../outlook.js');

    mockExecFile.mockImplementation((cmd, args, opts, cb) => {
      cb(null, '', '');
      return { on: vi.fn() };
    });
    mockReadFile.mockResolvedValueOnce('not valid json{{{');

    const result = await runPowerShell({
      script: 'test.ps1',
      args: [],
      timeout: 5000,
      outputPath: 'out.json'
    });

    // JSON.parse failure should be caught
    expect(result.ok).toBe(false);
  });

  it('runPowerShell cleans up temp files even on failure', async () => {
    const { runPowerShell } = await import('../outlook.js');

    const scriptError = new Error('Failed');
    mockExecFile.mockImplementation((cmd, args, opts, cb) => {
      cb(scriptError, '', '');
      return { on: vi.fn() };
    });
    mockAccess.mockRejectedValueOnce(new Error('ENOENT'));

    await runPowerShell({
      script: 'test.ps1',
      args: [],
      timeout: 5000,
      inputPath: 'in.json',
      outputPath: 'out.json'
    });

    // Both temp files should be cleaned
    expect(mockUnlink).toHaveBeenCalledWith('in.json');
    expect(mockUnlink).toHaveBeenCalledWith('out.json');
  });
});

describe('outlook.js — checkHealth', () => {
  let mockExecFile;

  beforeEach(() => {
    vi.resetModules();
    mockExecFile = vi.fn();
    vi.doMock('node:child_process', () => ({
      execFile: mockExecFile
    }));
    vi.doMock('node:fs/promises', () => ({
      writeFile: vi.fn(),
      readFile: vi.fn(),
      unlink: vi.fn(),
      access: vi.fn()
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns healthy when Outlook is running', async () => {
    const { checkHealth } = await import('../outlook.js');

    mockExecFile.mockImplementation((cmd, args, opts, cb) => {
      cb(null, 'OK:Len Volk', '');
    });

    const result = await checkHealth();
    expect(result.ok).toBe(true);
    expect(result.user).toBe('Len Volk');
  });

  it('returns error when Outlook not running', async () => {
    const { checkHealth } = await import('../outlook.js');

    mockExecFile.mockImplementation((cmd, args, opts, cb) => {
      cb(new Error('exit 1'), 'NOT_RUNNING', '');
    });

    const result = await checkHealth();
    expect(result.ok).toBe(false);
    expect(result.error).toContain('not running');
  });

  it('returns error when COM fails', async () => {
    const { checkHealth } = await import('../outlook.js');

    mockExecFile.mockImplementation((cmd, args, opts, cb) => {
      cb(new Error('exit 1'), 'COM_FAILED:access denied', '');
    });

    const result = await checkHealth();
    expect(result.ok).toBe(false);
    expect(result.error).toContain('COM unavailable');
  });
});

// ── Tools integration tests (mock outlook.js functions) ─────

describe('tools.js — registerTools', () => {
  let registeredTools;

  beforeEach(async () => {
    vi.resetModules();

    // Capture tool registrations instead of running a real MCP server
    registeredTools = {};
    const mockServer = {
      tool: (name, description, schema, handler) => {
        registeredTools[name] = { name, description, schema, handler };
      }
    };

    // Mock outlook.js with controllable test doubles
    vi.doMock('../outlook.js', () => ({
      searchEmailsSingle: vi.fn().mockResolvedValue({ ok: true, data: { emails: [] } }),
      searchEmailsBatch: vi.fn().mockResolvedValue({ ok: true, data: { COX: { emails: [] }, _meta: {} } }),
      createDraftSingle: vi.fn().mockResolvedValue({ ok: true, data: { saved: true } }),
      createDraftBatch: vi.fn().mockResolvedValue({ ok: true, data: { COX: { saved: true }, _meta: {} } }),
      checkHealth: vi.fn().mockResolvedValue({ ok: true, user: 'Test User' })
    }));

    const { registerTools } = await import('../tools.js');
    registerTools(mockServer);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('registers all 6 tools', () => {
    expect(Object.keys(registeredTools)).toEqual([
      'outlook_search_emails',
      'outlook_search_emails_batch',
      'outlook_create_draft',
      'outlook_create_draft_batch',
      'outlook_search_calendar',
      'outlook_check_health'
    ]);
  });

  it('outlook_search_emails rejects invalid contacts', async () => {
    const result = await registeredTools.outlook_search_emails.handler({
      contacts: ['not-an-email'],
      daysBack: 30
    });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Invalid');
  });

  it('outlook_search_emails returns data on success', async () => {
    const result = await registeredTools.outlook_search_emails.handler({
      contacts: ['user@example.com'],
      daysBack: 30
    });
    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain('emails');
  });

  it('outlook_search_emails_batch rejects empty accounts', async () => {
    const result = await registeredTools.outlook_search_emails_batch.handler({
      accounts: []
    });
    expect(result.isError).toBe(true);
  });

  it('outlook_search_emails_batch returns data on success', async () => {
    const result = await registeredTools.outlook_search_emails_batch.handler({
      accounts: [
        { account: 'COX', contacts: ['a@cox.com'] }
      ]
    });
    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain('COX');
  });

  it('outlook_create_draft rejects empty subject', async () => {
    const result = await registeredTools.outlook_create_draft.handler({
      to: ['user@example.com'],
      subject: '',
      body: '<p>Hi</p>',
      bodyType: 'HTML'
    });
    expect(result.isError).toBe(true);
  });

  it('outlook_create_draft rejects empty body', async () => {
    const result = await registeredTools.outlook_create_draft.handler({
      to: ['user@example.com'],
      subject: 'Hello',
      body: '',
      bodyType: 'HTML'
    });
    expect(result.isError).toBe(true);
  });

  it('outlook_create_draft returns data on success', async () => {
    const result = await registeredTools.outlook_create_draft.handler({
      to: ['user@example.com'],
      subject: 'Hello',
      body: '<p>Hi</p>',
      bodyType: 'HTML'
    });
    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain('saved');
  });

  it('outlook_create_draft_batch rejects invalid batch', async () => {
    const result = await registeredTools.outlook_create_draft_batch.handler({
      drafts: []
    });
    expect(result.isError).toBe(true);
  });

  it('outlook_create_draft_batch returns data on success', async () => {
    const result = await registeredTools.outlook_create_draft_batch.handler({
      drafts: [
        { account: 'COX', to: ['a@cox.com'], subject: 'Hello', body: '<p>Hi</p>' }
      ]
    });
    expect(result.isError).toBeUndefined();
  });

  it('outlook_check_health returns status', async () => {
    const result = await registeredTools.outlook_check_health.handler({});
    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain('healthy');
  });
});
