import { describe, it, expect, vi, beforeEach } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerTools } from '../tools.js';

// Build a mock CRM client that records calls and returns configurable responses
function mockCrmClient(responses = {}) {
  return {
    request: vi.fn(async (path, opts) => {
      if (responses[path]) return responses[path];
      // Default: success with empty data
      return { ok: true, status: 200, data: {} };
    }),
    requestAllPages: vi.fn(async (path, opts) => {
      if (responses[path]) return responses[path];
      return { ok: true, status: 200, data: { value: [] } };
    }),
    buildUrl: vi.fn()
  };
}

// Helper: call a registered tool by invoking the server's tool handler
async function callTool(server, name, args = {}) {
  const tool = server._registeredTools?.[name];
  if (!tool) throw new Error(`Tool "${name}" not registered`);
  return tool.handler(args);
}

describe('registerTools', () => {
  let server;
  let crm;

  beforeEach(() => {
    server = new McpServer({ name: 'test', version: '0.0.1' });
    crm = mockCrmClient({
      WhoAmI: { ok: true, status: 200, data: { UserId: 'abc-123', BusinessUnitId: 'bu-1' } }
    });
    registerTools(server, crm);
  });

  it('registers all expected tools', () => {
    const toolNames = Object.keys(server._registeredTools);
    expect(toolNames).toContain('crm_whoami');
    expect(toolNames).toContain('crm_query');
    expect(toolNames).toContain('crm_get_record');
    expect(toolNames).toContain('list_opportunities');
    expect(toolNames).toContain('get_milestones');
    expect(toolNames).toContain('create_task');
    expect(toolNames).toContain('update_task');
    expect(toolNames).toContain('close_task');
    expect(toolNames).toContain('update_milestone');
    expect(toolNames).toContain('list_accounts_by_tpid');
    expect(toolNames).toContain('get_task_status_options');
    expect(toolNames).toContain('get_milestone_activities');
    expect(toolNames).toContain('crm_auth_status');
    expect(toolNames).toContain('view_milestone_timeline');
    expect(toolNames).toContain('view_opportunity_cost_trend');
    expect(toolNames).toContain('view_staged_changes_diff');
  });

  describe('crm_whoami', () => {
    it('returns user data on success', async () => {
      const result = await callTool(server, 'crm_whoami');
      expect(result.isError).toBeUndefined();
      const text = result.content[0].text;
      expect(text).toContain('abc-123');
    });

    it('returns error when CRM is unreachable', async () => {
      crm.request.mockResolvedValueOnce({ ok: false, status: 500, data: { message: 'Server error' } });
      const result = await callTool(server, 'crm_whoami');
      expect(result.isError).toBe(true);
    });
  });

  describe('crm_query', () => {
    it('requires entitySet', async () => {
      const result = await callTool(server, 'crm_query', {});
      expect(result.isError).toBe(true);
    });

    it('passes query params to requestAllPages', async () => {
      crm.requestAllPages.mockResolvedValueOnce({
        ok: true, status: 200, data: { value: [{ name: 'Test' }] }
      });
      const result = await callTool(server, 'crm_query', {
        entitySet: 'accounts',
        filter: "name eq 'Test'",
        select: 'name,accountid',
        top: 5
      });
      expect(result.isError).toBeUndefined();
      expect(crm.requestAllPages).toHaveBeenCalledWith('accounts', {
        query: expect.objectContaining({
          $filter: "name eq 'Test'",
          $select: 'name,accountid',
          $top: '5'
        })
      });
    });
  });

  describe('crm_get_record', () => {
    it('rejects invalid GUID', async () => {
      const result = await callTool(server, 'crm_get_record', {
        entitySet: 'accounts',
        id: 'not-a-guid'
      });
      expect(result.isError).toBe(true);
    });

    it('fetches a single record', async () => {
      crm.request.mockResolvedValueOnce({
        ok: true, status: 200, data: { accountid: '12345678-1234-1234-1234-123456789abc', name: 'Contoso' }
      });
      const result = await callTool(server, 'crm_get_record', {
        entitySet: 'accounts',
        id: '12345678-1234-1234-1234-123456789abc'
      });
      expect(result.isError).toBeUndefined();
      expect(result.content[0].text).toContain('Contoso');
    });
  });

  describe('list_opportunities', () => {
    it('rejects empty accountIds', async () => {
      const result = await callTool(server, 'list_opportunities', { accountIds: [] });
      expect(result.isError).toBe(true);
    });

    it('loads opportunities for valid account IDs', async () => {
      crm.requestAllPages.mockResolvedValueOnce({
        ok: true, status: 200, data: { value: [{ opportunityid: 'opp-1', name: 'Deal A' }] }
      });
      const result = await callTool(server, 'list_opportunities', {
        accountIds: ['12345678-1234-1234-1234-123456789abc']
      });
      expect(result.isError).toBeUndefined();
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.count).toBe(1);
    });
  });

  describe('get_milestones', () => {
    it('defaults to current user milestones when no filter is provided', async () => {
      crm.requestAllPages.mockResolvedValueOnce({
        ok: true, status: 200, data: { value: [{ msp_milestonenumber: '7-100000001' }] }
      });
      const result = await callTool(server, 'get_milestones', {});
      expect(result.isError).toBeUndefined();
      expect(crm.request).toHaveBeenCalledWith('WhoAmI');
      expect(crm.requestAllPages).toHaveBeenCalledWith(
        'msp_engagementmilestones',
        {
          query: expect.objectContaining({
            $filter: "_ownerid_value eq 'abc-123'"
          })
        }
      );
    });

    it('returns an error if mine is disabled and no identifiers are provided', async () => {
      const result = await callTool(server, 'get_milestones', { mine: false });
      expect(result.isError).toBe(true);
    });

    it('searches by milestone number', async () => {
      crm.requestAllPages.mockResolvedValueOnce({
        ok: true, status: 200, data: { value: [{ msp_milestonenumber: '7-123456789' }] }
      });
      const result = await callTool(server, 'get_milestones', { milestoneNumber: '7-123456789' });
      expect(result.isError).toBeUndefined();
    });

    it('supports ownerId filter', async () => {
      crm.requestAllPages.mockResolvedValueOnce({
        ok: true, status: 200, data: { value: [{ msp_milestonenumber: '7-123456780' }] }
      });
      const result = await callTool(server, 'get_milestones', {
        ownerId: '12345678-1234-1234-1234-123456789abc'
      });
      expect(result.isError).toBeUndefined();
      expect(crm.requestAllPages).toHaveBeenCalledWith(
        'msp_engagementmilestones',
        {
          query: expect.objectContaining({
            $filter: "_ownerid_value eq '12345678-1234-1234-1234-123456789abc'"
          })
        }
      );
    });
  });

  describe('create_task', () => {
    it('validates milestoneId', async () => {
      const result = await callTool(server, 'create_task', { milestoneId: 'bad', subject: 'Test' });
      expect(result.isError).toBe(true);
    });

    it('requires subject', async () => {
      const result = await callTool(server, 'create_task', {
        milestoneId: '12345678-1234-1234-1234-123456789abc'
      });
      expect(result.isError).toBe(true);
    });

    it('creates a task with valid params (dry run)', async () => {
      const result = await callTool(server, 'create_task', {
        milestoneId: '12345678-1234-1234-1234-123456789abc',
        subject: 'Architecture Design Session',
        category: 861980004
      });
      expect(result.isError).toBeUndefined();
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.mock).toBe(true);
      expect(parsed.payload.subject).toBe('Architecture Design Session');
      expect(parsed.payload.msp_taskcategory).toBe(861980004);
    });
  });

  describe('update_task', () => {
    it('rejects empty update', async () => {
      const result = await callTool(server, 'update_task', {
        taskId: '12345678-1234-1234-1234-123456789abc'
      });
      expect(result.isError).toBe(true);
    });
  });

  describe('close_task', () => {
    it('requires statusCode', async () => {
      const result = await callTool(server, 'close_task', {
        taskId: '12345678-1234-1234-1234-123456789abc'
      });
      expect(result.isError).toBe(true);
    });
  });

  describe('list_accounts_by_tpid', () => {
    it('rejects non-numeric TPIDs', async () => {
      const result = await callTool(server, 'list_accounts_by_tpid', { tpids: ['abc'] });
      expect(result.isError).toBe(true);
    });

    it('looks up accounts by valid TPID', async () => {
      crm.requestAllPages.mockResolvedValueOnce({
        ok: true, status: 200, data: { value: [{ accountid: 'a-1', name: 'Contoso' }] }
      });
      const result = await callTool(server, 'list_accounts_by_tpid', { tpids: ['12345'] });
      expect(result.isError).toBeUndefined();
    });
  });

  describe('view_milestone_timeline', () => {
    it('requires ownerId or opportunityId', async () => {
      const result = await callTool(server, 'view_milestone_timeline', {});
      expect(result.isError).toBe(true);
    });

    it('returns timeline events with render hints', async () => {
      crm.requestAllPages.mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: {
          value: [{
            msp_engagementmilestoneid: '11111111-1111-1111-1111-111111111111',
            msp_name: 'Kickoff',
            msp_milestonenumber: '7-100000001',
            msp_milestonedate: '2026-03-01',
            msp_milestonestatus: 1,
            _msp_opportunityid_value: '22222222-2222-2222-2222-222222222222'
          }]
        }
      });
      crm.request.mockResolvedValueOnce({ ok: true, status: 200, data: { name: 'Deal A' } });

      const result = await callTool(server, 'view_milestone_timeline', {
        ownerId: '12345678-1234-1234-1234-123456789abc'
      });

      expect(result.isError).toBeUndefined();
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.count).toBe(1);
      expect(parsed.renderHints.view).toBe('timeline');
    });
  });

  describe('view_opportunity_cost_trend', () => {
    it('requires valid opportunityId', async () => {
      const result = await callTool(server, 'view_opportunity_cost_trend', { opportunityId: 'bad-id' });
      expect(result.isError).toBe(true);
    });

    it('returns points and KPI values', async () => {
      crm.request.mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: {
          opportunityid: '12345678-1234-1234-1234-123456789abc',
          name: 'Deal A',
          msp_consumptionconsumedrecurring: 500
        }
      });
      crm.requestAllPages.mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: {
          value: [
            { msp_milestonedate: '2026-03-01', msp_monthlyuse: 100 },
            { msp_milestonedate: '2026-03-15', msp_monthlyuse: 200 },
            { msp_milestonedate: '2026-04-01', msp_monthlyuse: 300 }
          ]
        }
      });

      const result = await callTool(server, 'view_opportunity_cost_trend', {
        opportunityId: '12345678-1234-1234-1234-123456789abc'
      });
      expect(result.isError).toBeUndefined();
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.points.length).toBe(2);
      expect(parsed.kpis.totalPlannedMonthlyUse).toBe(600);
      expect(parsed.renderHints.view).toBe('timeseries');
    });
  });

  describe('view_staged_changes_diff', () => {
    it('returns changed fields in diff rows', async () => {
      const result = await callTool(server, 'view_staged_changes_diff', {
        before: { subject: 'Old', due: '2026-03-10', unchanged: 'x' },
        after: { subject: 'New', due: null, unchanged: 'x', owner: 'me' },
        context: 'OP-1'
      });

      expect(result.isError).toBeUndefined();
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.context).toBe('OP-1');
      expect(parsed.summary.changedFieldCount).toBe(3);
      expect(parsed.renderHints.view).toBe('diffTable');
    });
  });
});
