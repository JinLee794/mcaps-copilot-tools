// CRM request execution layer
// Adapted from electron/main.js fetch + ipcHandlers patterns

const API_VERSION = 'v9.2';
const DEFAULT_TIMEOUT_MS = 20_000;
const DEFAULT_RETRIES = 3;
const DEFAULT_BACKOFF_MS = 500;
const MAX_RETRY_AFTER_MS = 60_000;
const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);
const WRITE_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const getRetryAfterMs = (response) => {
  const val = response.headers.get('Retry-After');
  if (!val) return null;
  const seconds = parseInt(val, 10);
  if (!isNaN(seconds)) return Math.min(Math.max(seconds * 1000, 0), MAX_RETRY_AFTER_MS);
  const date = Date.parse(val);
  if (!isNaN(date)) return Math.min(Math.max(0, date - Date.now()), MAX_RETRY_AFTER_MS);
  return null;
};

const parseErrorBody = async (response) => {
  try {
    const data = await response.json();
    return data?.error?.message || data?.message || `HTTP ${response.status}`;
  } catch {
    try { return (await response.text()) || `HTTP ${response.status}`; }
    catch { return `HTTP ${response.status}`; }
  }
};

export function createCrmClient(authService) {
  const buildUrl = (entityPath, query) => {
    const base = authService.getCrmUrl();
    const url = new URL(`${base}/api/data/${API_VERSION}/${entityPath}`);
    if (query && typeof query === 'object') {
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
      }
    }
    return url;
  };

  const getHeaders = (token, contentType) => ({
    Authorization: `Bearer ${token}`,
    'OData-MaxVersion': '4.0',
    'OData-Version': '4.0',
    'Content-Type': contentType || 'application/json',
    Accept: 'application/json',
    Prefer: 'odata.include-annotations="*"',
    'Cache-Control': 'no-cache',
    'If-None-Match': ''
  });

  const fetchWithRetry = async (url, options, { timeoutMs = DEFAULT_TIMEOUT_MS, retries = DEFAULT_RETRIES, backoffMs = DEFAULT_BACKOFF_MS } = {}) => {
    const method = (options.method || 'GET').toUpperCase();
    const isWrite = WRITE_METHODS.has(method);
    let attempt = 0;
    let lastError = null;

    while (attempt <= retries) {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url.toString(), { ...options, signal: controller.signal });
        clearTimeout(tid);

        if (response.ok) return response;

        if (response.status === 429) {
          const retryMs = getRetryAfterMs(response);
          if (retryMs !== null && attempt < retries) {
            await delay(retryMs);
            attempt++;
            continue;
          }
        }

        if (isWrite && RETRYABLE_STATUS.has(response.status) && attempt < retries) {
          await delay(backoffMs * 2 ** attempt);
          attempt++;
          continue;
        }

        const msg = await parseErrorBody(response);
        const err = new Error(msg);
        err.status = response.status;
        throw err;
      } catch (err) {
        clearTimeout(tid);
        lastError = err;
        if (attempt < retries && (err?.name === 'AbortError' || err instanceof TypeError)) {
          await delay(backoffMs * 2 ** attempt);
          attempt++;
          continue;
        }
        throw err;
      }
    }
    throw lastError || new Error('Request failed');
  };

  /**
   * Execute a CRM request.
   * @param {string} entityPath - e.g. "opportunities" or "tasks(guid)"
   * @param {object} opts
   * @param {string} opts.method - HTTP method (default GET)
   * @param {object} opts.query  - OData query params ($filter, $select, etc.)
   * @param {object|string} opts.body - Request body
   * @param {number} opts.timeoutMs
   * @param {number} opts.retries
   * @returns {Promise<{ok: boolean, status: number, data: object|null}>}
   */
  const request = async (entityPath, opts = {}) => {
    const authResult = await authService.ensureAuth();
    if (!authResult.success) {
      return { ok: false, status: 401, data: { message: authResult.error || 'Not authenticated' } };
    }

    const token = authService.getToken();
    const url = buildUrl(entityPath, opts.query);
    const method = (opts.method || 'GET').toUpperCase();
    const headers = getHeaders(token, opts.contentType);
    const fetchOpts = { method, headers };

    if (opts.body !== undefined && opts.body !== null) {
      fetchOpts.body = typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body);
    }

    try {
      const response = await fetchWithRetry(url, fetchOpts, {
        timeoutMs: opts.timeoutMs ?? DEFAULT_TIMEOUT_MS,
        retries: opts.retries ?? (WRITE_METHODS.has(method) ? DEFAULT_RETRIES : 0),
        backoffMs: opts.backoffMs ?? DEFAULT_BACKOFF_MS
      });

      let data = null;
      const ct = response.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        try { data = await response.json(); } catch { /* empty 204 */ }
      }

      return { ok: true, status: response.status, data };
    } catch (err) {
      return {
        ok: false,
        status: err.status || 500,
        data: { message: err.message }
      };
    }
  };

  /**
   * Execute a request and auto-paginate if @odata.nextLink is present.
   */
  const requestAllPages = async (entityPath, opts = {}) => {
    const first = await request(entityPath, opts);
    if (!first.ok || !first.data?.value) return first;

    const allValues = [...first.data.value];
    let nextLink = first.data['@odata.nextLink'];

    while (nextLink) {
      const authResult = await authService.ensureAuth();
      if (!authResult.success) break;

      const token = authService.getToken();
      try {
        const resp = await fetch(nextLink, {
          headers: getHeaders(token)
        });
        if (!resp.ok) break;
        const page = await resp.json();
        if (page?.value) allValues.push(...page.value);
        nextLink = page['@odata.nextLink'];
      } catch {
        break;
      }
    }

    return { ok: true, status: 200, data: { ...first.data, value: allValues } };
  };

  return { request, requestAllPages, buildUrl };
}
