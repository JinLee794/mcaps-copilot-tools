import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventEmitter } from 'node:events';

// Mock child_process.spawn
vi.mock('node:child_process', () => ({
  spawn: vi.fn(() => {
    const proc = new EventEmitter();
    proc.stdout = new EventEmitter();
    proc.stderr = new EventEmitter();
    proc.kill = vi.fn();
    return proc;
  })
}));

const { spawn } = await import('node:child_process');
const { createAuthService } = await import('../auth.js');

// Helper: create a fake JWT with a given exp
function fakeJwt(exp) {
  const header = Buffer.from(JSON.stringify({ alg: 'RS256' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    name: 'Test User',
    upn: 'test@microsoft.com',
    aud: 'https://test.crm.dynamics.com',
    exp
  })).toString('base64url');
  return `${header}.${payload}.sig`;
}

describe('createAuthService', () => {
  let svc;

  beforeEach(() => {
    vi.clearAllMocks();
    svc = createAuthService({
      crmUrl: 'https://test.crm.dynamics.com',
      tenantId: '00000000-0000-0000-0000-000000000000'
    });
  });

  it('exposes expected methods', () => {
    expect(typeof svc.ensureAuth).toBe('function');
    expect(typeof svc.getToken).toBe('function');
    expect(typeof svc.getAuthStatus).toBe('function');
    expect(typeof svc.getCrmUrl).toBe('function');
  });

  it('getAuthStatus returns unauthenticated when no token', () => {
    expect(svc.getAuthStatus()).toEqual({ isAuthenticated: false });
  });

  it('ensureAuth obtains a token via az CLI', async () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    const token = fakeJwt(futureExp);

    spawn.mockImplementationOnce(() => {
      const proc = new EventEmitter();
      proc.stdout = new EventEmitter();
      proc.stderr = new EventEmitter();
      proc.kill = vi.fn();
      setTimeout(() => {
        proc.stdout.emit('data', token);
        proc.emit('close', 0);
      }, 0);
      return proc;
    });

    const result = await svc.ensureAuth();
    expect(result.success).toBe(true);
    expect(result.metadata.userName).toBe('Test User');
    expect(svc.getToken()).toBe(token);
  });

  it('ensureAuth reuses cached non-expired token', async () => {
    // Manually inject a token into state with sufficient remaining lifetime
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    const token = fakeJwt(futureExp);
    svc._state.token = token;
    svc._state.metadata = {
      isAuthenticated: true,
      userName: 'Cached User',
      isExpired: false,
      expiresAt: new Date(futureExp * 1000)
    };

    const result = await svc.ensureAuth();
    expect(result.success).toBe(true);
    expect(result.metadata.userName).toBe('Cached User');
    // spawn should not have been called
    expect(spawn).not.toHaveBeenCalled();
  });

  it('ensureAuth refreshes token that is expiring soon (< 2 min)', async () => {
    // Token expires in 60 seconds — should be refreshed proactively
    const soonExp = Math.floor(Date.now() / 1000) + 60;
    const oldToken = fakeJwt(soonExp);
    svc._state.token = oldToken;
    svc._state.metadata = {
      isAuthenticated: true,
      userName: 'Old User',
      isExpired: false,
      expiresAt: new Date(soonExp * 1000)
    };

    const freshExp = Math.floor(Date.now() / 1000) + 3600;
    const freshToken = fakeJwt(freshExp);

    spawn.mockImplementationOnce(() => {
      const proc = new EventEmitter();
      proc.stdout = new EventEmitter();
      proc.stderr = new EventEmitter();
      proc.kill = vi.fn();
      setTimeout(() => {
        proc.stdout.emit('data', freshToken);
        proc.emit('close', 0);
      }, 0);
      return proc;
    });

    const result = await svc.ensureAuth();
    expect(result.success).toBe(true);
    expect(spawn).toHaveBeenCalled();
    expect(svc.getToken()).toBe(freshToken);
  });

  it('clearToken invalidates cached credentials', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    svc._state.token = fakeJwt(futureExp);
    svc._state.metadata = { isAuthenticated: true, userName: 'Test' };

    svc.clearToken();
    expect(svc.getToken()).toBeNull();
    expect(svc.getAuthStatus()).toEqual({ isAuthenticated: false });
  });

  it('returns error when az CLI is not found', async () => {
    spawn.mockImplementationOnce(() => {
      const proc = new EventEmitter();
      proc.stdout = new EventEmitter();
      proc.stderr = new EventEmitter();
      proc.kill = vi.fn();
      setTimeout(() => {
        const err = new Error('spawn ENOENT');
        err.code = 'ENOENT';
        proc.emit('error', err);
      }, 0);
      return proc;
    });

    const result = await svc.ensureAuth();
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Azure CLI not found/);
  });

  it('returns error when not logged in', async () => {
    spawn.mockImplementationOnce(() => {
      const proc = new EventEmitter();
      proc.stdout = new EventEmitter();
      proc.stderr = new EventEmitter();
      proc.kill = vi.fn();
      setTimeout(() => {
        proc.stderr.emit('data', 'AADSTS700027: login required');
        proc.emit('close', 1);
      }, 0);
      return proc;
    });

    const result = await svc.ensureAuth();
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/az login/i);
  });
});
