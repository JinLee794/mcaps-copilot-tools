// Azure CLI authentication service
// Extracted from electron/services/auth.js — adapted for standalone Node.js usage

import { spawn } from 'node:child_process';

const DEFAULT_TIMEOUT_MS = 30_000;

const base64UrlDecode = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    '='
  );
  return Buffer.from(padded, 'base64').toString('utf-8');
};

const parseTokenMetadata = (token, crmUrl) => {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const json = JSON.parse(base64UrlDecode(payload));
    const exp = json.exp ? Number(json.exp) * 1000 : null;
    const expiresAt = exp ? new Date(exp) : null;
    const minutesRemaining = expiresAt
      ? Math.max(Math.floor((expiresAt.getTime() - Date.now()) / 60_000), 0)
      : 0;
    return {
      isAuthenticated: true,
      userName: json.name || json.unique_name || json.upn || 'Unknown',
      audience: json.aud || crmUrl,
      expiresAt,
      minutesRemaining,
      isExpired: expiresAt ? expiresAt <= Date.now() : false,
      isExpiringSoon: minutesRemaining > 0 && minutesRemaining <= 10
    };
  } catch {
    return null;
  }
};

const getAzureCliCommand = () =>
  process.platform === 'win32' ? 'az.cmd' : 'az';

export function createAuthService({ crmUrl, tenantId }) {
  const state = { token: null, metadata: null, crmUrl, tenantId };

  const generateAccessToken = (settings = {}) =>
    new Promise((resolve, reject) => {
      const resource = settings.crmUrl || state.crmUrl;
      const tenant = settings.tenantId || state.tenantId;
      const args = [
        'account', 'get-access-token',
        '--resource', resource,
        '--tenant', tenant,
        '--query', 'accessToken',
        '-o', 'tsv'
      ];

      const proc = spawn(getAzureCliCommand(), args, {
        shell: process.platform === 'win32',
        windowsHide: true
      });

      let stdout = '';
      let stderr = '';
      let completed = false;

      const timeoutId = setTimeout(() => {
        if (!completed) {
          completed = true;
          proc.kill();
          reject(new Error('Azure CLI command timed out.'));
        }
      }, DEFAULT_TIMEOUT_MS);

      const cleanup = () => {
        clearTimeout(timeoutId);
        completed = true;
      };

      proc.stdout.on('data', (d) => { stdout += d.toString(); });
      proc.stderr.on('data', (d) => { stderr += d.toString(); });

      proc.on('error', (error) => {
        cleanup();
        if (error.code === 'ENOENT') {
          reject(
            new Error(
              'Azure CLI not found. Install it from https://learn.microsoft.com/cli/azure/install-azure-cli'
            )
          );
        } else {
          reject(new Error(`Failed to run Azure CLI: ${error.message}`));
        }
      });

      proc.on('close', (code) => {
        cleanup();
        if (code === 0) {
          const token = stdout.trim();
          if (token) resolve(token);
          else reject(new Error('Azure CLI returned empty token'));
        } else {
          if (stderr.includes('AADSTS') || stderr.includes('login')) {
            reject(new Error(
              'Azure CLI session expired. Run "az login --tenant ' + tenant + '" in your terminal, then retry.'
            ));
          } else if (stderr.includes('tenant')) {
            reject(new Error(
              'Invalid tenant or no access. Run "az login --tenant ' + tenant + '" to re-authenticate.'
            ));
          } else {
            reject(new Error(`Azure CLI error: ${stderr || 'Unknown error'}`));
          }
        }
      });
    });

  const isTokenUsable = () => {
    if (!state.token || !state.metadata) return false;
    // Re-evaluate expiration against current time (metadata.expiresAt is a Date)
    if (state.metadata.expiresAt) {
      const remainingMs = state.metadata.expiresAt.getTime() - Date.now();
      // Refresh if expired or expiring within 2 minutes
      if (remainingMs < 120_000) return false;
    }
    return true;
  };

  const clearToken = () => {
    state.token = null;
    state.metadata = null;
  };

  const ensureAuth = async (settings = {}) => {
    // If we have a token with sufficient remaining lifetime, reuse it
    if (isTokenUsable()) {
      return { success: true, metadata: { ...state.metadata } };
    }

    const resource = settings.crmUrl || state.crmUrl;
    const tenant = settings.tenantId || state.tenantId;
    try {
      const token = await generateAccessToken({ crmUrl: resource, tenantId: tenant });
      state.token = token;
      state.metadata = parseTokenMetadata(token, resource);
      state.crmUrl = resource;
      state.tenantId = tenant;
      return { success: true, metadata: { ...state.metadata } };
    } catch (error) {
      state.token = null;
      state.metadata = null;
      return { success: false, error: error.message };
    }
  };

  const getToken = () => state.token;
  const getAuthStatus = () =>
    state.metadata ? { ...state.metadata } : { isAuthenticated: false };
  const getCrmUrl = () => state.crmUrl;

  return { ensureAuth, getToken, getAuthStatus, getCrmUrl, clearToken, _state: state };
}
