import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCrmClient } from '../crm.js';

function mockAuthService(token = 'test-token') {
  return {
    ensureAuth: vi.fn().mockResolvedValue({ success: true }),
    getToken: vi.fn().mockReturnValue(token),
    getCrmUrl: vi.fn().mockReturnValue('https://test.crm.dynamics.com')
  };
}

describe('createCrmClient', () => {
  let auth;
  let client;
  let fetchMock;

  beforeEach(() => {
    auth = mockAuthService();
    client = createCrmClient(auth);
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock;
  });

  it('request — sends GET with authorization header', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ value: [{ id: 1 }] })
    });

    const result = await client.request('opportunities', {
      query: { $select: 'name', $top: '10' }
    });

    expect(result.ok).toBe(true);
    expect(result.data.value).toHaveLength(1);

    const [urlArg, optsArg] = fetchMock.mock.calls[0];
    expect(urlArg).toContain('/api/data/v9.2/opportunities');
    expect(urlArg).toContain('%24select=name');
    expect(optsArg.headers.Authorization).toBe('Bearer test-token');
  });

  it('request — returns 401 when auth fails', async () => {
    auth.ensureAuth.mockResolvedValue({ success: false, error: 'Need login' });
    const result = await client.request('WhoAmI');
    expect(result.ok).toBe(false);
    expect(result.status).toBe(401);
  });

  it('request — handles PATCH method', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 204,
      headers: new Headers({}),
      json: () => Promise.reject(new Error('no body'))
    });

    const result = await client.request('tasks(abc-123)', {
      method: 'PATCH',
      body: { subject: 'Updated' }
    });

    expect(result.ok).toBe(true);
    expect(result.status).toBe(204);
    const [, optsArg] = fetchMock.mock.calls[0];
    expect(optsArg.method).toBe('PATCH');
    expect(JSON.parse(optsArg.body)).toEqual({ subject: 'Updated' });
  });

  it('request — returns error on non-ok response', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ error: { message: 'Not found' } })
    });

    const result = await client.request('opportunities(bad-id)');
    expect(result.ok).toBe(false);
    expect(result.status).toBe(404);
  });

  it('requestAllPages — follows odata.nextLink', async () => {
    const page1 = { value: [{ id: 1 }], '@odata.nextLink': 'https://test.crm.dynamics.com/page2' };
    const page2 = { value: [{ id: 2 }] };

    fetchMock
      // First call (in request via fetchWithRetry)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve(page1)
      })
      // Paging call
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve(page2)
      });

    const result = await client.requestAllPages('opportunities');
    expect(result.ok).toBe(true);
    expect(result.data.value).toHaveLength(2);
    expect(result.data.value.map(r => r.id)).toEqual([1, 2]);
  });

  it('buildUrl — constructs correct OData URL', () => {
    const url = client.buildUrl('accounts', { $filter: "name eq 'Test'" });
    expect(url.toString()).toContain('/api/data/v9.2/accounts');
    expect(url.searchParams.get('$filter')).toBe("name eq 'Test'");
  });
});
