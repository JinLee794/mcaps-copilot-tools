// MCP tool definitions — maps CRM operations to MCP tools
// Each tool receives validated params and calls createCrmClient methods

import { z } from 'zod';
import { isValidGuid, normalizeGuid, isValidTpid, sanitizeODataString } from './validation.js';
import { getApprovalQueue } from './approval-queue.js';

const MILESTONE_SELECT = [
  'msp_engagementmilestoneid',
  'msp_milestonenumber',
  'msp_name',
  '_msp_workloadlkid_value',
  'msp_commitmentrecommendation',
  'msp_milestonecategory',
  'msp_monthlyuse',
  'msp_milestonedate',
  'msp_milestonestatus',
  '_ownerid_value',
  '_msp_opportunityid_value',
  'msp_forecastcommentsjsonfield',
  'msp_forecastcomments',
  'msp_deliveryspecifiedfield'
].join(',');

const OPP_SELECT = [
  'opportunityid', 'name', 'estimatedclosedate',
  'msp_estcompletiondate', 'msp_consumptionconsumedrecurring',
  '_ownerid_value', '_parentaccountid_value', 'msp_salesplay'
].join(',');

const TASK_CATEGORIES = [
  { label: 'Technical Close/Win Plan', value: 606820005 },
  { label: 'Architecture Design Session', value: 861980004 },
  { label: 'Blocker Escalation', value: 861980006 },
  { label: 'Briefing', value: 861980008 },
  { label: 'Consumption Plan', value: 861980007 },
  { label: 'Demo', value: 861980002 },
  { label: 'PoC/Pilot', value: 861980005 },
  { label: 'Workshop', value: 861980001 }
];

const text = (content) => ({ content: [{ type: 'text', text: typeof content === 'string' ? content : JSON.stringify(content, null, 2) }] });
const error = (msg) => ({ content: [{ type: 'text', text: msg }], isError: true });

function monthKey(dateValue) {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 7);
}

function toIsoDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function fv(record, field) {
  return record[`${field}@OData.Community.Display.V1.FormattedValue`] ?? null;
}

/** Returns ISO date string for (today - days). */
function daysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

const ACTIVE_STATUSES = new Set(['Not Started', 'In Progress', 'Blocked', 'At Risk']);

function buildMilestoneSummary(milestones) {
  const byStatus = {};
  const byOpportunity = {};
  for (const m of milestones) {
    const status = fv(m, 'msp_milestonestatus') || 'Unknown';
    byStatus[status] = (byStatus[status] || 0) + 1;
    const opp = fv(m, '_msp_opportunityid_value') || 'Unknown';
    byOpportunity[opp] = (byOpportunity[opp] || 0) + 1;
  }
  return {
    count: milestones.length,
    byStatus,
    byOpportunity,
    milestones: milestones.map(m => ({
      ...m,
      status: fv(m, 'msp_milestonestatus'),
      opportunity: fv(m, '_msp_opportunityid_value')
    }))
  };
}

async function applyTaskFilter(crmClient, milestones, mode) {
  if (!milestones.length) return milestones;
  const msIds = milestones.map(m => m.msp_engagementmilestoneid).filter(Boolean);
  const chunks = [];
  for (let i = 0; i < msIds.length; i += 25) chunks.push(msIds.slice(i, i + 25));
  const taskMatches = new Set();
  for (const chunk of chunks) {
    const tf = chunk.map(id => `_regardingobjectid_value eq '${id}'`).join(' or ');
    const taskResult = await crmClient.requestAllPages('tasks', {
      query: { $filter: tf, $select: '_regardingobjectid_value' }
    });
    if (taskResult.ok && taskResult.data?.value) {
      for (const t of taskResult.data.value) taskMatches.add(t._regardingobjectid_value);
    }
  }
  if (mode === 'without-tasks') {
    return milestones.filter(m => !taskMatches.has(m.msp_engagementmilestoneid));
  }
  return milestones.filter(m => taskMatches.has(m.msp_engagementmilestoneid));
}

/**
 * Execute AddUserToRecordTeam / RemoveUserFromRecordTeam.
 * Strategy: try the CRM unbound action first (handles team creation & privileges internally),
 * then fall back to direct team membership association if the action is unavailable.
 * @returns {Promise<{ok: boolean, status: number, data: object|null}|null>} null if not a record team op
 */
async function executeRecordTeamOp(crmClient, op) {
  const isAdd = op.entitySet === 'AddUserToRecordTeam';
  const isRemove = op.entitySet === 'RemoveUserFromRecordTeam';
  if (!isAdd && !isRemove) return null;

  const { payload } = op;

  // ── Strategy 1: Try unbound action (standard then namespace-qualified) ──
  const actionResult = await crmClient.request(op.entitySet, { method: 'POST', body: payload });
  if (actionResult.ok || actionResult.status === 204) return actionResult;

  const isNotFound = actionResult.data?.message?.includes('Resource not found');
  if (isNotFound) {
    const nsResult = await crmClient.request(
      `Microsoft.Dynamics.CRM.${op.entitySet}`,
      { method: 'POST', body: payload }
    );
    if (nsResult.ok || nsResult.status === 204) return nsResult;
  }

  // ── Strategy 2: Direct team membership manipulation (fallback) ──
  const recordRef = payload.Record?.['@odata.id'];
  const userId = payload.SystemUserId;
  const templateRef = payload.TeamTemplate?.['@odata.id'];
  if (!recordRef || !userId || !templateRef) {
    // Return the original action error if payload can't be parsed for fallback
    return actionResult;
  }

  const templateId = templateRef.match(/\(([^)]+)\)/)?.[1];
  const recordId = recordRef.match(/\(([^)]+)\)/)?.[1];
  const entitySetName = recordRef.match(/^([^(]+)\(/)?.[1];
  if (!templateId || !recordId || !entitySetName) {
    return actionResult;
  }

  // Find existing access team
  const teamResult = await crmClient.requestAllPages('teams', {
    query: {
      $filter: `_regardingobjectid_value eq '${recordId}' and _teamtemplateid_value eq '${templateId}'`,
      $select: 'teamid',
      $top: '1'
    }
  });
  if (!teamResult.ok) {
    return { ok: false, status: teamResult.status, data: { message: `Query teams failed: ${teamResult.data?.message}` } };
  }

  const teams = teamResult.data?.value || [];
  let teamId = teams[0]?.teamid;

  if (isAdd && !teamId) {
    // Create access team — derive entity logical name from the record reference
    const logicalMap = { opportunities: 'opportunity', msp_engagementmilestones: 'msp_engagementmilestone' };
    const entityLogical = logicalMap[entitySetName] || entitySetName.replace(/s$/, '');
    const createBody = {
      name: `${entityLogical} ${recordId}+${templateId}`,
      teamtype: 1,
      'associatedteamtemplateid@odata.bind': `/teamtemplates(${templateId})`,
      [`regardingobjectid_${entityLogical}@odata.bind`]: `/${entitySetName}(${recordId})`
    };
    const createResult = await crmClient.request('teams', { method: 'POST', body: createBody });
    if (!createResult.ok && createResult.status !== 204) {
      return { ok: false, status: createResult.status, data: { message: `Create access team failed: ${createResult.data?.message}` } };
    }
    const requery = await crmClient.requestAllPages('teams', {
      query: {
        $filter: `_regardingobjectid_value eq '${recordId}' and _teamtemplateid_value eq '${templateId}'`,
        $select: 'teamid',
        $top: '1'
      }
    });
    teamId = requery.data?.value?.[0]?.teamid;
    if (!teamId) {
      return { ok: false, status: 500, data: { message: 'Created access team but could not retrieve teamid' } };
    }
  }

  if (!teamId) {
    return { ok: false, status: 404, data: { message: 'No access team found for this record' } };
  }

  if (isAdd) {
    const absUrl = crmClient.buildUrl(`systemusers(${userId})`).href;
    return crmClient.request(`teams(${teamId})/teammembership_association/$ref`, {
      method: 'POST',
      body: { '@odata.id': absUrl }
    });
  }

  // isRemove
  return crmClient.request(`teams(${teamId})/teammembership_association(${userId})/$ref`, {
    method: 'DELETE'
  });
}

/**
 * Register all CRM tools on an McpServer instance.
 */
export function registerTools(server, crmClient, pbiClient) {
  // ── crm_whoami ──────────────────────────────────────────────
  server.tool(
    'crm_whoami',
    'Validate CRM access and return the current user identity (UserId, name).',
    {},
    async () => {
      const result = await crmClient.request('WhoAmI');
      if (!result.ok) return error(`WhoAmI failed: ${result.data?.message || result.status}`);
      return text(result.data);
    }
  );

  // ── crm_query ───────────────────────────────────────────────
  server.tool(
    'crm_query',
    'Execute a read-only OData GET against any Dynamics 365 entity set. Supports $filter, $select, $orderby, $top, $expand. Auto-paginates results.',
    {
      entitySet: z.string().describe('Entity set name, e.g. "opportunities", "accounts", "msp_engagementmilestones"'),
      filter: z.string().optional().describe('OData $filter expression'),
      select: z.string().optional().describe('Comma-separated field names for $select'),
      orderby: z.string().optional().describe('OData $orderby expression'),
      top: z.number().optional().describe('Maximum number of records to return'),
      expand: z.string().optional().describe('OData $expand expression')
    },
    async ({ entitySet, filter, select, orderby, top, expand }) => {
      if (!entitySet) return error('entitySet is required');
      const query = {};
      if (filter) query.$filter = filter;
      if (select) query.$select = select;
      if (orderby) query.$orderby = orderby;
      if (top) query.$top = String(top);
      if (expand) query.$expand = expand;

      const result = await crmClient.requestAllPages(entitySet, { query });
      if (!result.ok) return error(`Query failed (${result.status}): ${result.data?.message}`);

      const records = result.data?.value || (result.data ? [result.data] : []);
      return text({ count: records.length, value: records });
    }
  );

  // ── crm_get_record ──────────────────────────────────────────
  server.tool(
    'crm_get_record',
    'Retrieve a single Dynamics 365 record by entity set and GUID.',
    {
      entitySet: z.string().describe('Entity set name, e.g. "opportunities", "accounts"'),
      id: z.string().describe('Record GUID'),
      select: z.string().optional().describe('Comma-separated field names for $select')
    },
    async ({ entitySet, id, select }) => {
      if (!entitySet) return error('entitySet is required');
      const normalized = normalizeGuid(id);
      if (!isValidGuid(normalized)) return error('Invalid GUID');
      const query = {};
      if (select) query.$select = select;
      const result = await crmClient.request(`${entitySet}(${normalized})`, { query });
      if (!result.ok) return error(`Get record failed (${result.status}): ${result.data?.message}`);
      return text(result.data);
    }
  );

  // ── list_opportunities ──────────────────────────────────────
  server.tool(
    'list_opportunities',
    'List open opportunities for one or more account IDs or by customer name keyword. Returns opportunity name, dates, owner, solution play.',
    {
      accountIds: z.array(z.string()).optional().describe('Array of Dynamics 365 account GUIDs'),
      customerKeyword: z.string().optional().describe('Customer name keyword — resolves matching accounts internally'),
      includeCompleted: z.boolean().optional().default(false).describe('Include opportunities past their estimated completion date (default: false)')
    },
    async ({ accountIds, customerKeyword, includeCompleted }) => {
      let resolvedIds = accountIds ? accountIds.map(normalizeGuid).filter(isValidGuid) : [];

      // Resolve customerKeyword → account GUIDs
      if (!resolvedIds.length && customerKeyword) {
        const sanitized = sanitizeODataString(customerKeyword.trim());
        const acctResult = await crmClient.requestAllPages('accounts', {
          query: { $filter: `contains(name,'${sanitized}')`, $select: 'accountid,name', $top: '50' }
        });
        const matchedAccounts = acctResult.ok ? (acctResult.data?.value || []) : [];
        if (!matchedAccounts.length) {
          return text({ count: 0, opportunities: [], matchedAccounts: [], message: `No accounts found matching '${customerKeyword}'` });
        }
        resolvedIds = matchedAccounts.map(a => a.accountid);
      }

      if (!resolvedIds.length) return error('Provide accountIds array or customerKeyword');

      // Chunk into groups of 25 to keep filter URL manageable
      const chunks = [];
      for (let i = 0; i < resolvedIds.length; i += 25) chunks.push(resolvedIds.slice(i, i + 25));

      const allOpps = [];
      for (const chunk of chunks) {
        let filter = `(${chunk.map(id => `_parentaccountid_value eq '${id}'`).join(' or ')}) and statecode eq 0`;
        if (!includeCompleted) {
          filter += ` and msp_estcompletiondate ge ${daysAgo(30)}`;
        }
        const result = await crmClient.requestAllPages('opportunities', {
          query: { $filter: filter, $select: OPP_SELECT, $orderby: 'name' }
        });
        if (result.ok && result.data?.value) allOpps.push(...result.data.value);
      }

      return text({ count: allOpps.length, opportunities: allOpps });
    }
  );

  // ── get_milestones ──────────────────────────────────────────
  server.tool(
    'get_milestones',
    'Get engagement milestones by milestoneId, milestone number, opportunity, or owner. Supports batch opportunityIds, status/keyword filtering, and task-presence filtering.',
    {
      opportunityId: z.string().optional().describe('Opportunity GUID to list milestones for'),
      opportunityIds: z.array(z.string()).optional().describe('Array of opportunity GUIDs for batch milestone retrieval'),
      milestoneNumber: z.string().optional().describe('Milestone number to search for, e.g. "7-123456789"'),
      milestoneId: z.string().optional().describe('Direct milestone GUID lookup'),
      ownerId: z.string().optional().describe('Owner system user GUID to list milestones for'),
      mine: z.boolean().optional().describe('When true (default), returns milestones owned by the authenticated CRM user if no other filter is provided'),
      statusFilter: z.enum(['active', 'all']).optional().describe('Filter by status: active = Not Started/In Progress/Blocked/At Risk'),
      keyword: z.string().optional().describe('Case-insensitive keyword filter across milestone name, opportunity, and workload'),
      format: z.enum(['full', 'summary']).optional().describe('Response format: full (default) or summary (grouped compact output)'),
      taskFilter: z.enum(['all', 'with-tasks', 'without-tasks']).optional().describe('Filter milestones by task presence')
    },
    async ({ opportunityId, opportunityIds, milestoneNumber, milestoneId, ownerId, mine, statusFilter, keyword, format, taskFilter: taskFilterParam }) => {
      // Direct GUID lookup
      if (milestoneId) {
        const nid = normalizeGuid(milestoneId);
        if (!isValidGuid(nid)) return error('Invalid milestoneId GUID');
        const result = await crmClient.request(`msp_engagementmilestones(${nid})`, {
          query: { $select: MILESTONE_SELECT }
        });
        if (!result.ok) return error(`Milestone lookup failed (${result.status}): ${result.data?.message}`);
        return text(result.data);
      }

      let filter;
      if (milestoneNumber) {
        const sanitized = sanitizeODataString(milestoneNumber.trim());
        filter = `msp_milestonenumber eq '${sanitized}'`;
      } else if (opportunityIds?.length) {
        const validIds = opportunityIds.map(normalizeGuid).filter(isValidGuid);
        if (!validIds.length) return error('No valid opportunity GUIDs in opportunityIds');
        const chunks = [];
        for (let i = 0; i < validIds.length; i += 25) chunks.push(validIds.slice(i, i + 25));
        const allMilestones = [];
        for (const chunk of chunks) {
          const chunkFilter = chunk.map(id => `_msp_opportunityid_value eq '${id}'`).join(' or ');
          const chunkResult = await crmClient.requestAllPages('msp_engagementmilestones', {
            query: { $filter: chunkFilter, $select: MILESTONE_SELECT, $orderby: 'msp_milestonedate' }
          });
          if (chunkResult.ok && chunkResult.data?.value) allMilestones.push(...chunkResult.data.value);
        }
        let milestones = allMilestones;
        if (statusFilter === 'active') {
          milestones = milestones.filter(m => ACTIVE_STATUSES.has(fv(m, 'msp_milestonestatus')));
        }
        if (keyword) {
          const kw = keyword.toLowerCase();
          milestones = milestones.filter(m =>
            (m.msp_name || '').toLowerCase().includes(kw) ||
            (fv(m, '_msp_opportunityid_value') || '').toLowerCase().includes(kw) ||
            (fv(m, '_msp_workloadlkid_value') || '').toLowerCase().includes(kw)
          );
        }
        if (taskFilterParam && taskFilterParam !== 'all') {
          milestones = await applyTaskFilter(crmClient, milestones, taskFilterParam);
        }
        if (format === 'summary') return text(buildMilestoneSummary(milestones));
        return text({ count: milestones.length, milestones });
      } else if (opportunityId) {
        const nid = normalizeGuid(opportunityId);
        if (!isValidGuid(nid)) return error('Invalid opportunityId GUID');
        filter = `_msp_opportunityid_value eq '${nid}'`;
      } else if (ownerId) {
        const nid = normalizeGuid(ownerId);
        if (!isValidGuid(nid)) return error('Invalid ownerId GUID');
        filter = `_ownerid_value eq '${nid}'`;
      } else if (mine !== false) {
        const whoAmI = await crmClient.request('WhoAmI');
        if (!whoAmI.ok || !whoAmI.data?.UserId) {
          return error(`Unable to resolve current CRM user for milestone lookup (${whoAmI.status}): ${whoAmI.data?.message || 'WhoAmI failed'}`);
        }
        const nid = normalizeGuid(whoAmI.data.UserId);
        filter = `_ownerid_value eq '${nid}'`;
      } else {
        return error('Provide opportunityId, milestoneNumber, milestoneId, ownerId, or set mine=true');
      }

      const result = await crmClient.requestAllPages('msp_engagementmilestones', {
        query: { $filter: filter, $select: MILESTONE_SELECT, $orderby: 'msp_milestonedate' }
      });
      if (!result.ok) return error(`Get milestones failed (${result.status}): ${result.data?.message}`);
      let milestones = result.data?.value || [];

      // Post-query filters
      if (statusFilter === 'active') {
        milestones = milestones.filter(m => ACTIVE_STATUSES.has(fv(m, 'msp_milestonestatus')));
      }
      if (keyword) {
        const kw = keyword.toLowerCase();
        milestones = milestones.filter(m =>
          (m.msp_name || '').toLowerCase().includes(kw) ||
          (fv(m, '_msp_opportunityid_value') || '').toLowerCase().includes(kw) ||
          (fv(m, '_msp_workloadlkid_value') || '').toLowerCase().includes(kw)
        );
      }
      if (taskFilterParam && taskFilterParam !== 'all') {
        milestones = await applyTaskFilter(crmClient, milestones, taskFilterParam);
      }
      if (format === 'summary') return text(buildMilestoneSummary(milestones));
      return text({ count: milestones.length, milestones });
    }
  );

  // ── get_my_active_opportunities ─────────────────────────────
  server.tool(
    'get_my_active_opportunities',
    'Returns active opportunities where you are the owner or on the deal team (via milestone ownership). Optionally filter by customer name.',
    {
      customerKeyword: z.string().optional().describe('Case-insensitive customer name filter')
    },
    async ({ customerKeyword }) => {
      const whoAmI = await crmClient.request('WhoAmI');
      if (!whoAmI.ok || !whoAmI.data?.UserId) {
        return error(`Unable to resolve current CRM user (${whoAmI.status}): ${whoAmI.data?.message || 'WhoAmI failed'}`);
      }
      const userId = normalizeGuid(whoAmI.data.UserId);

      // 1. Owned opportunities (exclude completion dates > 30 days ago)
      const cutoff = daysAgo(30);
      const ownedResult = await crmClient.requestAllPages('opportunities', {
        query: { $filter: `_ownerid_value eq '${userId}' and statecode eq 0 and msp_estcompletiondate ge ${cutoff}`, $select: OPP_SELECT, $orderby: 'name' }
      });
      const ownedOpps = (ownedResult.ok ? ownedResult.data?.value : []) || [];
      const ownedIds = new Set(ownedOpps.map(o => o.opportunityid));

      // 2. Discover deal-team opps via milestones owned by user
      const msResult = await crmClient.requestAllPages('msp_engagementmilestones', {
        query: { $filter: `_ownerid_value eq '${userId}'`, $select: '_msp_opportunityid_value' }
      });
      const dealTeamOppIds = [];
      if (msResult.ok && msResult.data?.value) {
        for (const m of msResult.data.value) {
          const oppId = m._msp_opportunityid_value;
          if (oppId && !ownedIds.has(oppId) && !dealTeamOppIds.includes(oppId)) dealTeamOppIds.push(oppId);
        }
      }

      // 3. Fetch deal-team opportunities
      let dealTeamOpps = [];
      if (dealTeamOppIds.length) {
        const dtFilter = dealTeamOppIds.map(id => `opportunityid eq '${id}'`).join(' or ');
        const dtResult = await crmClient.requestAllPages('opportunities', {
          query: { $filter: `(${dtFilter}) and statecode eq 0 and msp_estcompletiondate ge ${cutoff}`, $select: OPP_SELECT, $orderby: 'name' }
        });
        if (dtResult.ok && dtResult.data?.value) dealTeamOpps = dtResult.data.value;
      }

      // 4. Combine and tag
      let opportunities = [
        ...ownedOpps.map(o => ({
          ...o,
          customer: fv(o, '_parentaccountid_value') || null,
          relationship: 'owner'
        })),
        ...dealTeamOpps.map(o => ({
          ...o,
          customer: fv(o, '_parentaccountid_value') || null,
          relationship: 'deal-team'
        }))
      ];

      // 5. Filter by customerKeyword
      if (customerKeyword) {
        const kw = customerKeyword.toLowerCase();
        opportunities = opportunities.filter(o => (o.customer || '').toLowerCase().includes(kw));
      }

      return text({ count: opportunities.length, opportunities });
    }
  );

  // ── create_task ─────────────────────────────────────────────
  server.tool(
    'create_task',
    'Create a task linked to an engagement milestone. Optionally specify category, subject, due date, and owner.',
    {
      milestoneId: z.string().describe('Engagement milestone GUID to link the task to'),
      subject: z.string().describe('Task subject/title'),
      category: z.number().optional().describe(`Task category code. Valid values: ${TASK_CATEGORIES.map(c => `${c.value} (${c.label})`).join(', ')}`),
      dueDate: z.string().optional().describe('Due date in YYYY-MM-DD format'),
      ownerId: z.string().optional().describe('System user GUID to assign as owner'),
      description: z.string().optional().describe('Task description')
    },
    async ({ milestoneId, subject, category, dueDate, ownerId, description }) => {
      const nid = normalizeGuid(milestoneId);
      if (!isValidGuid(nid)) return error('Invalid milestoneId GUID');
      if (!subject) return error('subject is required');

      const payload = {
        subject,
        'regardingobjectid_msp_engagementmilestone@odata.bind': `/msp_engagementmilestones(${nid})`
      };
      if (category !== undefined) payload.msp_taskcategory = category;
      if (dueDate) payload.scheduledend = dueDate;
      if (description) payload.description = description;
      if (ownerId) {
        const ownerNid = normalizeGuid(ownerId);
        if (!isValidGuid(ownerNid)) return error('Invalid ownerId GUID');
        payload['ownerid@odata.bind'] = `/systemusers(${ownerNid})`;
      }

      const queue = getApprovalQueue();
      const op = queue.stage({
        type: 'create_task',
        entitySet: 'tasks',
        method: 'POST',
        payload,
        beforeState: null,
        description: `Create task "${subject}" on milestone ${nid}`
      });
      return text({
        staged: true,
        operationId: op.id,
        description: op.description,
        payload,
        message: `Staged ${op.id}: ${op.description}. Approve via execute_operation or from the approval UI.`
      });
    }
  );

  // ── update_task ─────────────────────────────────────────────
  server.tool(
    'update_task',
    'Update fields on an existing task (subject, due date, description, status).',
    {
      taskId: z.string().describe('Task GUID'),
      subject: z.string().optional().describe('New subject'),
      dueDate: z.string().optional().describe('New due date YYYY-MM-DD'),
      description: z.string().optional().describe('New description'),
      statusCode: z.number().optional().describe('New status code')
    },
    async ({ taskId, subject, dueDate, description, statusCode }) => {
      const nid = normalizeGuid(taskId);
      if (!isValidGuid(nid)) return error('Invalid taskId GUID');
      const payload = {};
      if (subject !== undefined) payload.subject = subject;
      if (dueDate !== undefined) payload.scheduledend = dueDate;
      if (description !== undefined) payload.description = description;
      if (statusCode !== undefined) {
        payload.statuscode = statusCode;
        // CRM requires statecode transition alongside statuscode
        if (statusCode === 5 || statusCode === 6) payload.statecode = 1; // Completed/Cancelled → Closed state
      }
      if (Object.keys(payload).length === 0) return error('No fields to update');

      // Fetch before-state for diff preview
      const before = await crmClient.request(`tasks(${nid})`, {
        query: { $select: Object.keys(payload).join(',') }
      });

      const queue = getApprovalQueue();
      const op = queue.stage({
        type: 'update_task',
        entitySet: `tasks(${nid})`,
        method: 'PATCH',
        payload,
        beforeState: before.ok ? before.data : null,
        description: `Update task ${nid}: ${Object.keys(payload).join(', ')}`
      });
      return text({
        staged: true,
        operationId: op.id,
        description: op.description,
        before: op.beforeState,
        after: payload,
        message: `Staged ${op.id}: ${op.description}. Approve via execute_operation or from the approval UI.`
      });
    }
  );

  // ── close_task ──────────────────────────────────────────────
  server.tool(
    'close_task',
    'Close a task using the CloseTask action (with fallback to bound Close endpoint).',
    {
      taskId: z.string().describe('Task GUID'),
      statusCode: z.number().describe('Status code for the closure (e.g. 5 = Completed, 6 = Cancelled)'),
      subject: z.string().optional().describe('Close subject (defaults to "Task Closed")')
    },
    async ({ taskId, statusCode, subject }) => {
      const nid = normalizeGuid(taskId);
      if (!isValidGuid(nid)) return error('Invalid taskId GUID');
      if (statusCode === undefined) return error('statusCode is required');

      // Fetch before-state
      const before = await crmClient.request(`tasks(${nid})`, {
        query: { $select: 'subject,statuscode,statecode' }
      });

      // Stage with CloseTask action as primary strategy
      const closePayload = {
        TaskClose: {
          subject: subject || 'Task Closed',
          'activityid@odata.bind': `/tasks(${nid})`
        },
        Status: statusCode
      };

      const queue = getApprovalQueue();
      const op = queue.stage({
        type: 'close_task',
        entitySet: 'CloseTask',
        method: 'POST',
        payload: closePayload,
        beforeState: before.ok ? before.data : null,
        description: `Close task ${nid} with status ${statusCode}`
      });
      // Attach fallback info for executor
      op.fallbackEntitySet = `tasks(${nid})/Microsoft.Dynamics.CRM.Close`;
      op.fallbackPayload = { Status: statusCode };

      return text({
        staged: true,
        operationId: op.id,
        description: op.description,
        before: op.beforeState,
        statusCode,
        message: `Staged ${op.id}: ${op.description}. Approve via execute_operation or from the approval UI.`
      });
    }
  );

  // ── update_milestone ────────────────────────────────────────
  server.tool(
    'update_milestone',
    'Update fields on an engagement milestone (name, date, monthly use, comments, workload, status). Use forecastCommentsJson to directly replace all JSON comment entries (for corrections/removals).',
    {
      milestoneId: z.string().describe('Engagement milestone GUID'),
      name: z.string().optional().describe('New milestone name (msp_name)'),
      milestoneDate: z.string().optional().describe('New milestone date YYYY-MM-DD'),
      monthlyUse: z.number().optional().describe('New monthly use value'),
      milestoneStatus: z.number().optional().describe('Milestone status code (861980000=On Track, 861980001=At Risk, 861980002=Blocked, 861980003=Completed, 861980004=Cancelled, 861980005=Not Started)'),
      workloadId: z.string().optional().describe('Workload GUID to set on this milestone'),
      forecastComments: z.string().optional().describe('Forecast comments text — appends a new JSON entry attributed to the current user'),
      forecastCommentsJson: z.string().optional().describe('Direct JSON override for msp_forecastcommentsjsonfield (array of {userId, modifiedOn, comment}). Use for corrections/removals. Also updates plain text field from the latest entry.')
    },
    async ({ milestoneId, name, milestoneDate, monthlyUse, milestoneStatus, workloadId, forecastComments, forecastCommentsJson }) => {
      const nid = normalizeGuid(milestoneId);
      if (!isValidGuid(nid)) return error('Invalid milestoneId GUID');
      const payload = {};
      if (name !== undefined) payload.msp_name = name;
      if (milestoneDate !== undefined) payload.msp_milestonedate = milestoneDate;
      if (monthlyUse !== undefined) payload.msp_monthlyuse = monthlyUse;
      if (milestoneStatus !== undefined) payload.msp_milestonestatus = milestoneStatus;
      if (workloadId) {
        const wNid = normalizeGuid(workloadId);
        if (!isValidGuid(wNid)) return error('Invalid workloadId GUID');
        payload['msp_WorkloadlkId@odata.bind'] = `/msp_workloads(${wNid})`;
      }

      // Direct JSON override — used for corrections/removals
      if (forecastCommentsJson !== undefined) {
        let entries;
        try { entries = JSON.parse(forecastCommentsJson); } catch { return error('forecastCommentsJson must be valid JSON array'); }
        if (!Array.isArray(entries)) return error('forecastCommentsJson must be a JSON array');
        payload.msp_forecastcommentsjsonfield = JSON.stringify(entries);
      } else if (forecastComments !== undefined) {
        // When adding forecast comments, build a proper JSON entry attributed to the current user
        // Resolve current user's display name
        let userName = 'Unknown';
        const whoAmI = await crmClient.request('WhoAmI');
        if (whoAmI.ok && whoAmI.data?.UserId) {
          const uid = normalizeGuid(whoAmI.data.UserId);
          const userResult = await crmClient.request(`systemusers(${uid})`, {
            query: { $select: 'fullname' }
          });
          if (userResult.ok && userResult.data?.fullname) {
            userName = userResult.data.fullname;
          }
        }

        // Read existing JSON comments from the milestone
        const existing = await crmClient.request(`msp_engagementmilestones(${nid})`, {
          query: { $select: 'msp_forecastcommentsjsonfield' }
        });
        let entries = [];
        if (existing.ok && existing.data?.msp_forecastcommentsjsonfield) {
          try { entries = JSON.parse(existing.data.msp_forecastcommentsjsonfield); } catch { entries = []; }
        }

        // Prepend new entry so the user's comment appears first
        entries.unshift({
          userId: userName,
          modifiedOn: new Date().toISOString(),
          comment: forecastComments
        });

        payload.msp_forecastcommentsjsonfield = JSON.stringify(entries);
      }

      if (Object.keys(payload).length === 0) return error('No fields to update');

      // Fetch before-state for diff preview
      const before = await crmClient.request(`msp_engagementmilestones(${nid})`, {
        query: { $select: Object.keys(payload).join(',') }
      });

      const queue = getApprovalQueue();
      const op = queue.stage({
        type: 'update_milestone',
        entitySet: `msp_engagementmilestones(${nid})`,
        method: 'PATCH',
        payload,
        beforeState: before.ok ? before.data : null,
        description: `Update milestone ${nid}: ${Object.keys(payload).join(', ')}`
      });
      return text({
        staged: true,
        operationId: op.id,
        description: op.description,
        before: op.beforeState,
        after: payload,
        message: `Staged ${op.id}: ${op.description}. Approve via execute_operation or from the approval UI.`
      });
    }
  );

  // ── create_milestone ────────────────────────────────────────
  server.tool(
    'create_milestone',
    'Create a new engagement milestone on an opportunity. Stages the operation for approval.',
    {
      opportunityId: z.string().describe('Parent opportunity GUID'),
      name: z.string().describe('Milestone name'),
      workloadId: z.string().optional().describe('Workload GUID (_msp_workloadlkid_value from an existing milestone)'),
      milestoneCategory: z.number().optional().describe('Milestone category code (e.g. 861980000 = POC/Pilot)'),
      monthlyUse: z.number().optional().describe('Monthly use / forecast value'),
      milestoneDate: z.string().optional().describe('Milestone date YYYY-MM-DD'),
      milestoneStatus: z.number().optional().describe('Milestone status code (861980000=On Track, 861980005=Not Started)'),
      commitmentRecommendation: z.number().optional().describe('Commitment recommendation (861980000=Uncommitted, 861980001=Committed)'),
      forecastComments: z.string().optional().describe('Initial forecast comments text'),
      deliveredBy: z.number().optional().describe('Delivered By (606820000=Customer [default], 606820001=Partner, 606820002=ISD, 606820003=Microsoft Support)')
    },
    async ({ opportunityId, name, workloadId, milestoneCategory, monthlyUse, milestoneDate, milestoneStatus, commitmentRecommendation, forecastComments, deliveredBy }) => {
      const oppNid = normalizeGuid(opportunityId);
      if (!isValidGuid(oppNid)) return error('Invalid opportunityId GUID');
      if (!name) return error('name is required');

      const payload = {
        msp_name: name,
        'msp_OpportunityId@odata.bind': `/opportunities(${oppNid})`
      };

      if (workloadId) {
        const wNid = normalizeGuid(workloadId);
        if (!isValidGuid(wNid)) return error('Invalid workloadId GUID');
        payload['msp_WorkloadlkId@odata.bind'] = `/msp_workloads(${wNid})`;
      }
      if (milestoneCategory !== undefined) payload.msp_milestonecategory = milestoneCategory;
      if (monthlyUse !== undefined) payload.msp_monthlyuse = monthlyUse;
      if (milestoneDate !== undefined) payload.msp_milestonedate = milestoneDate;
      if (milestoneStatus !== undefined) payload.msp_milestonestatus = milestoneStatus;
      if (commitmentRecommendation !== undefined) payload.msp_commitmentrecommendation = commitmentRecommendation;
      payload.msp_deliveryspecifiedfield = deliveredBy !== undefined ? deliveredBy : 606820000; // Default: Customer

      if (forecastComments) {
        // Build initial JSON comments entry attributed to the current user
        let userName = 'Unknown';
        const whoAmI = await crmClient.request('WhoAmI');
        if (whoAmI.ok && whoAmI.data?.UserId) {
          const uid = normalizeGuid(whoAmI.data.UserId);
          const userResult = await crmClient.request(`systemusers(${uid})`, {
            query: { $select: 'fullname' }
          });
          if (userResult.ok && userResult.data?.fullname) {
            userName = userResult.data.fullname;
          }
        }
        const entries = [{
          userId: userName,
          modifiedOn: new Date().toISOString(),
          comment: forecastComments
        }];
        payload.msp_forecastcommentsjsonfield = JSON.stringify(entries);
        payload.msp_forecastcomments = forecastComments;
      }

      const queue = getApprovalQueue();
      const op = queue.stage({
        type: 'create_milestone',
        entitySet: 'msp_engagementmilestones',
        method: 'POST',
        payload,
        beforeState: null,
        description: `Create milestone "${name}" on opportunity ${oppNid}`
      });
      return text({
        staged: true,
        operationId: op.id,
        description: op.description,
        payload,
        message: `Staged ${op.id}: ${op.description}. Approve via execute_operation or from the approval UI.`
      });
    }
  );

  // ── list_account_contacts ─────────────────────────────────
  server.tool(
    'list_account_contacts',
    'Get customer contacts for an account, including email domains for search scoping. ' +
      'Accepts accountId, opportunityId, milestoneNumber, or customerKeyword — resolves to account automatically. ' +
      'Returns contacts with email, job title, job role, plus unique email domains.',
    {
      accountId: z.string().optional().describe('Direct account GUID'),
      opportunityId: z.string().optional().describe('Opportunity GUID — resolves to parent account'),
      milestoneNumber: z.string().optional().describe('Milestone number (e.g. "7-503446418") — resolves milestone → opportunity → account'),
      customerKeyword: z.string().optional().describe('Customer name keyword — searches accounts by name'),
      top: z.number().optional().describe('Max contacts to return (default: 200)')
    },
    async ({ accountId, opportunityId, milestoneNumber, customerKeyword, top }) => {
      let resolvedAccountId = null;
      let accountName = null;
      let tpid = null;
      let resolvedOppId = opportunityId || null;

      // Resolution chain: milestoneNumber → opportunityId → accountId
      if (milestoneNumber) {
        const sanitized = sanitizeODataString(milestoneNumber.trim());
        const msResult = await crmClient.requestAllPages('msp_engagementmilestones', {
          query: { $filter: `msp_milestonenumber eq '${sanitized}'`, $select: '_msp_opportunityid_value', $top: '1' }
        });
        const milestones = msResult.ok ? (msResult.data?.value || []) : [];
        if (!milestones.length) return error(`No milestone found with number '${milestoneNumber}'`);
        resolvedOppId = milestones[0]._msp_opportunityid_value;
        if (!resolvedOppId) return error('Milestone has no linked opportunity');
      }

      if (resolvedOppId && !accountId) {
        const oppNid = normalizeGuid(resolvedOppId);
        if (!isValidGuid(oppNid)) return error('Invalid opportunityId GUID');
        const oppResult = await crmClient.request(`opportunities(${oppNid})`, {
          query: { $select: '_parentaccountid_value' }
        });
        if (!oppResult.ok) return error(`Opportunity lookup failed (${oppResult.status}): ${oppResult.data?.message}`);
        resolvedAccountId = oppResult.data?._parentaccountid_value;
        if (!resolvedAccountId) return error('Opportunity has no parent account');
      }

      if (accountId) {
        const nid = normalizeGuid(accountId);
        if (!isValidGuid(nid)) return error('Invalid accountId GUID');
        resolvedAccountId = nid;
      }

      if (!resolvedAccountId && customerKeyword) {
        const sanitized = sanitizeODataString(customerKeyword.trim());
        const acctResult = await crmClient.requestAllPages('accounts', {
          query: { $filter: `contains(name,'${sanitized}')`, $select: 'accountid,name,msp_mstopparentid', $top: '10' }
        });
        const accounts = acctResult.ok ? (acctResult.data?.value || []) : [];
        if (!accounts.length) return error(`No accounts found matching '${customerKeyword}'`);
        resolvedAccountId = accounts[0].accountid;
        accountName = accounts[0].name;
        tpid = accounts[0].msp_mstopparentid;
      }

      if (!resolvedAccountId) return error('Provide accountId, opportunityId, milestoneNumber, or customerKeyword');

      // Fetch account name/TPID if not already resolved
      if (!accountName) {
        const acctResult = await crmClient.request(`accounts(${resolvedAccountId})`, {
          query: { $select: 'name,msp_mstopparentid' }
        });
        if (acctResult.ok && acctResult.data) {
          accountName = acctResult.data.name;
          tpid = acctResult.data.msp_mstopparentid;
        }
      }

      // Query contacts for this account
      const contactResult = await crmClient.requestAllPages('contacts', {
        query: {
          $filter: `_parentcustomerid_value eq '${resolvedAccountId}'`,
          $select: 'contactid,fullname,emailaddress1,jobtitle,accountrolecode',
          $orderby: 'fullname',
          $top: String(top || 200)
        }
      });
      if (!contactResult.ok) return error(`Contacts query failed (${contactResult.status}): ${contactResult.data?.message}`);

      const contacts = (contactResult.data?.value || []).map(c => ({
        id: c.contactid,
        name: c.fullname,
        email: c.emailaddress1 || null,
        jobTitle: c.jobtitle || null,
        jobRole: fv(c, 'accountrolecode') || null,
        _raw: undefined
      }));

      // Extract unique email domains
      const domainSet = new Set();
      for (const c of contacts) {
        if (c.email && c.email.includes('@')) {
          domainSet.add(c.email.split('@')[1].toLowerCase());
        }
      }
      const emailDomains = [...domainSet].sort();

      return text({
        account: { id: resolvedAccountId, name: accountName, tpid },
        contactCount: contacts.length,
        emailDomains,
        contacts
      });
    }
  );

  // ── list_accounts_by_tpid ───────────────────────────────────
  server.tool(
    'list_accounts_by_tpid',
    'Find accounts by MS Top Parent ID (TPID). Returns account GUIDs and names.',
    {
      tpids: z.array(z.string()).describe('Array of TPID values (numeric strings)')
    },
    async ({ tpids }) => {
      if (!tpids?.length) return error('At least one TPID is required');
      const valid = tpids.filter(isValidTpid);
      if (!valid.length) return error('No valid TPIDs provided');

      const filter = valid.map(t => `msp_mstopparentid eq '${sanitizeODataString(t)}'`).join(' or ');
      const result = await crmClient.requestAllPages('accounts', {
        query: {
          $filter: filter,
          $select: 'accountid,name,msp_mstopparentid',
          $orderby: 'name'
        }
      });
      if (!result.ok) return error(`Account lookup failed (${result.status}): ${result.data?.message}`);
      const accounts = result.data?.value || [];
      return text({ count: accounts.length, accounts });
    }
  );

  // ── get_task_status_options ─────────────────────────────────
  server.tool(
    'get_task_status_options',
    'Retrieve available task status/statuscode options from Dynamics 365 metadata.',
    {},
    async () => {
      const result = await crmClient.request(
        "EntityDefinitions(LogicalName='task')/Attributes(LogicalName='statuscode')/Microsoft.Dynamics.CRM.StatusAttributeMetadata",
        { query: { $select: 'LogicalName', $expand: 'OptionSet($select=Options)' } }
      );
      if (!result.ok) return error(`Metadata query failed (${result.status}): ${result.data?.message}`);

      const options = result.data?.OptionSet?.Options || [];
      const parsed = options
        .map(o => ({
          value: o?.Value,
          label: o?.Label?.UserLocalizedLabel?.Label || o?.Label?.LocalizedLabels?.[0]?.Label || '',
          stateCode: o?.State
        }))
        .filter(o => Number.isInteger(o.value) && o.label);
      return text(parsed);
    }
  );

  // ── get_milestone_activities ────────────────────────────────
  server.tool(
    'get_milestone_activities',
    'List tasks/activities linked to one or more engagement milestones. Supports batch retrieval via milestoneIds array.',
    {
      milestoneId: z.string().optional().describe('Single engagement milestone GUID'),
      milestoneIds: z.array(z.string()).optional().describe('Array of milestone GUIDs for batch retrieval')
    },
    async ({ milestoneId, milestoneIds }) => {
      // Batch mode
      if (milestoneIds?.length) {
        const validIds = milestoneIds.map(normalizeGuid).filter(isValidGuid);
        if (!validIds.length) return error('No valid milestone GUIDs in milestoneIds');
        const chunks = [];
        for (let i = 0; i < validIds.length; i += 25) chunks.push(validIds.slice(i, i + 25));
        const allTasks = [];
        for (const chunk of chunks) {
          const batchFilter = chunk.map(id => `_regardingobjectid_value eq '${id}'`).join(' or ');
          const batchResult = await crmClient.requestAllPages('tasks', {
            query: {
              $filter: batchFilter,
              $select: 'activityid,subject,scheduledend,statuscode,statecode,_ownerid_value,description,msp_taskcategory,_regardingobjectid_value',
              $orderby: 'createdon desc'
            }
          });
          if (batchResult.ok && batchResult.data?.value) allTasks.push(...batchResult.data.value);
        }
        // Group by milestone
        const byMilestone = {};
        for (const t of allTasks) {
          const msId = t._regardingobjectid_value;
          if (!byMilestone[msId]) byMilestone[msId] = [];
          byMilestone[msId].push(t);
        }
        return text({ count: allTasks.length, byMilestone });
      }

      // Single mode (backward-compatible)
      if (!milestoneId) return error('Provide milestoneId or milestoneIds');
      const nid = normalizeGuid(milestoneId);
      if (!isValidGuid(nid)) return error('Invalid milestoneId GUID');

      const filter = `_regardingobjectid_value eq '${nid}'`;
      const result = await crmClient.requestAllPages('tasks', {
        query: {
          $filter: filter,
          $select: 'activityid,subject,scheduledend,statuscode,statecode,_ownerid_value,description,msp_taskcategory',
          $orderby: 'createdon desc'
        }
      });
      if (!result.ok) return error(`Get activities failed (${result.status}): ${result.data?.message}`);
      const tasks = result.data?.value || [];
      return text({ count: tasks.length, tasks });
    }
  );

  // ── find_milestones_needing_tasks ───────────────────────────
  server.tool(
    'find_milestones_needing_tasks',
    'Composite tool: resolves customer keywords → accounts → opportunities → milestones, then identifies milestones without linked tasks.',
    {
      customerKeywords: z.array(z.string()).describe('Array of customer name keywords to search'),
      statusFilter: z.enum(['active', 'all']).optional().describe('Milestone status filter (default: active)')
    },
    async ({ customerKeywords, statusFilter = 'active' }) => {
      if (!customerKeywords?.length) return error('At least one customerKeyword is required');

      const customers = [];
      let totalNeedingTasks = 0;

      for (const keyword of customerKeywords) {
        const sanitized = sanitizeODataString(keyword.trim());

        // 1. Resolve accounts
        const acctResult = await crmClient.requestAllPages('accounts', {
          query: { $filter: `contains(name,'${sanitized}')`, $select: 'accountid,name', $top: '50' }
        });
        const accounts = acctResult.ok ? (acctResult.data?.value || []) : [];
        if (!accounts.length) {
          customers.push({ customer: keyword, error: 'No matching accounts found', milestonesNeedingTasks: 0, milestones: [] });
          continue;
        }

        // 2. Get opportunities for matched accounts
        const acctIds = accounts.map(a => a.accountid);
        const acctFilter = acctIds.map(id => `_parentaccountid_value eq '${id}'`).join(' or ');
        const oppResult = await crmClient.requestAllPages('opportunities', {
          query: { $filter: `(${acctFilter}) and statecode eq 0`, $select: OPP_SELECT, $orderby: 'name' }
        });
        const opps = oppResult.ok ? (oppResult.data?.value || []) : [];
        if (!opps.length) {
          customers.push({ customer: keyword, milestonesNeedingTasks: 0, milestones: [], accounts: accounts.map(a => a.name) });
          continue;
        }

        // 3. Get milestones for opportunities
        const oppIds = opps.map(o => o.opportunityid);
        const oppFilter = oppIds.map(id => `_msp_opportunityid_value eq '${id}'`).join(' or ');
        const msResult = await crmClient.requestAllPages('msp_engagementmilestones', {
          query: { $filter: oppFilter, $select: MILESTONE_SELECT, $orderby: 'msp_milestonedate' }
        });
        let milestones = msResult.ok ? (msResult.data?.value || []) : [];

        // Apply status filter
        if (statusFilter === 'active') {
          milestones = milestones.filter(m => ACTIVE_STATUSES.has(fv(m, 'msp_milestonestatus')));
        }

        if (!milestones.length) {
          customers.push({ customer: keyword, milestonesNeedingTasks: 0, milestones: [] });
          continue;
        }

        // 4. Batch task check
        const msIds = milestones.map(m => m.msp_engagementmilestoneid);
        const taskFilter = msIds.map(id => `_regardingobjectid_value eq '${id}'`).join(' or ');
        const taskResult = await crmClient.requestAllPages('tasks', {
          query: { $filter: taskFilter, $select: '_regardingobjectid_value' }
        });
        const taskMsIds = new Set();
        if (taskResult.ok && taskResult.data?.value) {
          for (const t of taskResult.data.value) taskMsIds.add(t._regardingobjectid_value);
        }

        const needingTasks = milestones.filter(m => !taskMsIds.has(m.msp_engagementmilestoneid));
        totalNeedingTasks += needingTasks.length;

        customers.push({
          customer: keyword,
          milestonesNeedingTasks: needingTasks.length,
          totalMilestones: milestones.length,
          milestones: needingTasks.map(m => ({
            id: m.msp_engagementmilestoneid,
            number: m.msp_milestonenumber,
            name: m.msp_name,
            status: fv(m, 'msp_milestonestatus'),
            date: toIsoDate(m.msp_milestonedate),
            opportunity: fv(m, '_msp_opportunityid_value'),
            workload: fv(m, '_msp_workloadlkid_value')
          }))
        });
      }

      return text({ totalMilestonesNeedingTasks: totalNeedingTasks, customers });
    }
  );

  // ── view_milestone_timeline ─────────────────────────────────
  server.tool(
    'view_milestone_timeline',
    'Return timeline-friendly milestone events for a user or opportunity, with render hints for Copilot UI.',
    {
      ownerId: z.string().optional().describe('System user GUID to filter milestone owner'),
      opportunityId: z.string().optional().describe('Opportunity GUID to filter milestones'),
      fromDate: z.string().optional().describe('Start date (YYYY-MM-DD)'),
      toDate: z.string().optional().describe('End date (YYYY-MM-DD)')
    },
    async ({ ownerId, opportunityId, fromDate, toDate }) => {
      if (!ownerId && !opportunityId) {
        return error('Provide ownerId or opportunityId');
      }

      const filters = [];
      if (ownerId) {
        const ownerNid = normalizeGuid(ownerId);
        if (!isValidGuid(ownerNid)) return error('Invalid ownerId GUID');
        filters.push(`_ownerid_value eq '${ownerNid}'`);
      }

      if (opportunityId) {
        const oppNid = normalizeGuid(opportunityId);
        if (!isValidGuid(oppNid)) return error('Invalid opportunityId GUID');
        filters.push(`_msp_opportunityid_value eq '${oppNid}'`);
      }

      if (fromDate) filters.push(`msp_milestonedate ge ${sanitizeODataString(fromDate)}`);
      if (toDate) filters.push(`msp_milestonedate le ${sanitizeODataString(toDate)}`);

      const result = await crmClient.requestAllPages('msp_engagementmilestones', {
        query: {
          $filter: filters.join(' and '),
          $select: 'msp_engagementmilestoneid,msp_milestonenumber,msp_name,msp_milestonestatus,msp_milestonedate,msp_monthlyuse,_msp_opportunityid_value',
          $orderby: 'msp_milestonedate asc'
        }
      });
      if (!result.ok) return error(`Timeline query failed (${result.status}): ${result.data?.message}`);

      const milestones = result.data?.value || [];
      const oppIds = [...new Set(milestones.map(m => m._msp_opportunityid_value).filter(Boolean))];
      const opportunityNames = {};

      for (const id of oppIds) {
        const opp = await crmClient.request(`opportunities(${id})`, { query: { $select: 'name' } });
        if (opp.ok && opp.data?.name) opportunityNames[id] = opp.data.name;
      }

      const events = milestones.map(m => ({
        id: m.msp_engagementmilestoneid,
        date: toIsoDate(m.msp_milestonedate),
        title: m.msp_name,
        milestoneNumber: m.msp_milestonenumber,
        status: m['msp_milestonestatus@OData.Community.Display.V1.FormattedValue'] ?? m.msp_milestonestatus,
        monthlyUse: m.msp_monthlyuse ?? null,
        opportunityId: m._msp_opportunityid_value ?? null,
        opportunityName: opportunityNames[m._msp_opportunityid_value] ?? null
      }));

      return text({
        count: events.length,
        events,
        renderHints: {
          view: 'timeline',
          defaultSort: { field: 'date', direction: 'asc' },
          dateField: 'date',
          titleField: 'title',
          laneField: 'opportunityName',
          statusField: 'status'
        }
      });
    }
  );

  // ── view_opportunity_cost_trend ────────────────────────────
  server.tool(
    'view_opportunity_cost_trend',
    'Return monthly cost/consumption trend points for an opportunity with chart/table render hints.',
    {
      opportunityId: z.string().describe('Opportunity GUID'),
      includeMilestones: z.boolean().optional().describe('Include milestone monthly-use points (default true)')
    },
    async ({ opportunityId, includeMilestones = true }) => {
      const oppNid = normalizeGuid(opportunityId);
      if (!isValidGuid(oppNid)) return error('Invalid opportunityId GUID');

      const opportunityResult = await crmClient.request(`opportunities(${oppNid})`, {
        query: {
          $select: 'opportunityid,name,estimatedclosedate,msp_estcompletiondate,msp_consumptionconsumedrecurring'
        }
      });
      if (!opportunityResult.ok) {
        return error(`Opportunity lookup failed (${opportunityResult.status}): ${opportunityResult.data?.message}`);
      }

      const opportunity = opportunityResult.data || {};
      const byMonth = new Map();

      if (includeMilestones) {
        const milestoneResult = await crmClient.requestAllPages('msp_engagementmilestones', {
          query: {
            $filter: `_msp_opportunityid_value eq '${oppNid}'`,
            $select: 'msp_milestonedate,msp_monthlyuse,msp_name,msp_milestonenumber',
            $orderby: 'msp_milestonedate asc'
          }
        });
        if (!milestoneResult.ok) {
          return error(`Milestone trend query failed (${milestoneResult.status}): ${milestoneResult.data?.message}`);
        }

        for (const milestone of milestoneResult.data?.value || []) {
          const key = monthKey(milestone.msp_milestonedate);
          const amount = Number(milestone.msp_monthlyuse ?? 0);
          if (!key || Number.isNaN(amount)) continue;
          byMonth.set(key, (byMonth.get(key) || 0) + amount);
        }
      }

      const points = [...byMonth.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, planned]) => ({ month, plannedMonthlyUse: planned }));

      const totalPlanned = points.reduce((sum, point) => sum + point.plannedMonthlyUse, 0);
      const consumedRecurring = Number(opportunity.msp_consumptionconsumedrecurring ?? 0);

      return text({
        opportunity: {
          id: opportunity.opportunityid,
          name: opportunity.name,
          estimatedCloseDate: toIsoDate(opportunity.estimatedclosedate),
          estimatedCompletionDate: toIsoDate(opportunity.msp_estcompletiondate),
          consumedRecurring
        },
        points,
        kpis: {
          consumedRecurring,
          totalPlannedMonthlyUse: totalPlanned,
          latestPlannedMonthlyUse: points.length ? points[points.length - 1].plannedMonthlyUse : 0
        },
        renderHints: {
          view: 'timeseries',
          xField: 'month',
          yFields: ['plannedMonthlyUse'],
          currency: 'USD',
          defaultChart: 'line',
          showTable: true
        }
      });
    }
  );

  // ── view_staged_changes_diff ───────────────────────────────
  server.tool(
    'view_staged_changes_diff',
    'Build a render-friendly before/after diff table from staged write payloads.',
    {
      before: z.object({}).passthrough().describe('Current values object (before)'),
      after: z.object({}).passthrough().describe('Proposed values object (after)'),
      context: z.string().optional().describe('Optional context label (e.g. operation ID)')
    },
    async ({ before, after, context }) => {
      const keys = [...new Set([...Object.keys(before || {}), ...Object.keys(after || {})])];
      const rows = keys
        .map((field) => {
          const beforeValue = before?.[field] ?? null;
          const afterValue = after?.[field] ?? null;
          const beforeText = beforeValue === null ? null : String(beforeValue);
          const afterText = afterValue === null ? null : String(afterValue);

          if (beforeText === afterText) return null;

          let changeType = 'updated';
          if (beforeValue === null && afterValue !== null) changeType = 'added';
          if (beforeValue !== null && afterValue === null) changeType = 'removed';

          return {
            field,
            before: beforeValue,
            after: afterValue,
            changeType
          };
        })
        .filter(Boolean);

      return text({
        context: context || null,
        summary: {
          changedFieldCount: rows.length
        },
        rows,
        renderHints: {
          view: 'diffTable',
          columns: ['field', 'before', 'after', 'changeType'],
          emphasisField: 'changeType'
        }
      });
    }
  );

  // ── list_pending_operations ──────────────────────────────────
  server.tool(
    'list_pending_operations',
    'List all staged CRM write operations awaiting human approval.',
    {},
    async () => {
      const queue = getApprovalQueue();
      const pending = queue.listPending();
      return text({
        count: pending.length,
        operations: pending.map(op => ({
          id: op.id,
          type: op.type,
          description: op.description,
          stagedAt: op.stagedAt,
          expiresIn: Math.max(0, Math.round((op.expiresAt - Date.now()) / 1000)) + 's',
          before: op.beforeState,
          after: op.payload,
        })),
      });
    }
  );

  // ── execute_operation ──────────────────────────────────────
  server.tool(
    'execute_operation',
    'Approve and execute a single staged CRM write operation by ID.',
    {
      id: z.string().describe('Operation ID (e.g. "OP-1")')
    },
    async ({ id }) => {
      const queue = getApprovalQueue();
      const op = queue.approve(id);
      if (!op) return error(`Operation ${id} not found, already executed, or expired.`);

      // Execute against CRM
      let result;
      // Record team actions use direct team membership association
      const teamResult = await executeRecordTeamOp(crmClient, op);
      if (teamResult !== null) {
        result = teamResult;
      } else if (op.type === 'close_task') {
        // Try primary CloseTask action, fallback to bound Close
        result = await crmClient.request(op.entitySet, { method: op.method, body: op.payload });
        if (!result.ok && result.status !== 204 && op.fallbackEntitySet) {
          result = await crmClient.request(op.fallbackEntitySet, { method: 'POST', body: op.fallbackPayload });
        }
      } else {
        result = await crmClient.request(op.entitySet, { method: op.method, body: op.payload });
      }

      if (result.ok || result.status === 204) {
        queue.markExecuted(id, result.data);
        return text({ success: true, executed: id, type: op.type, description: op.description });
      }

      queue.markFailed(id, result.data?.message);
      return error(`Execution of ${id} failed (${result.status}): ${result.data?.message}`);
    }
  );

  // ── execute_all ────────────────────────────────────────────
  server.tool(
    'execute_all',
    'Approve and execute ALL pending staged operations in sequence.',
    {},
    async () => {
      const queue = getApprovalQueue();
      const pending = queue.listPending();
      if (!pending.length) return text({ executed: 0, message: 'No pending operations.' });

      const results = [];
      for (const op of pending) {
        const approved = queue.approve(op.id);
        if (!approved) {
          results.push({ id: op.id, success: false, reason: 'expired or missing' });
          continue;
        }

        let result;
        const teamResult = await executeRecordTeamOp(crmClient, op);
        if (teamResult !== null) {
          result = teamResult;
        } else if (op.type === 'close_task') {
          result = await crmClient.request(op.entitySet, { method: op.method, body: op.payload });
          if (!result.ok && result.status !== 204 && op.fallbackEntitySet) {
            result = await crmClient.request(op.fallbackEntitySet, { method: 'POST', body: op.fallbackPayload });
          }
        } else {
          result = await crmClient.request(op.entitySet, { method: op.method, body: op.payload });
        }

        if (result.ok || result.status === 204) {
          queue.markExecuted(op.id, result.data);
          results.push({ id: op.id, success: true });
        } else {
          queue.markFailed(op.id, result.data?.message);
          results.push({ id: op.id, success: false, reason: result.data?.message });
        }
      }

      const executed = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      return text({ executed, failed, results });
    }
  );

  // ── cancel_operation ───────────────────────────────────────
  server.tool(
    'cancel_operation',
    'Cancel/reject a single staged operation by ID. No CRM changes are made.',
    {
      id: z.string().describe('Operation ID (e.g. "OP-1")')
    },
    async ({ id }) => {
      const queue = getApprovalQueue();
      const op = queue.reject(id);
      if (!op) return error(`Operation ${id} not found or already processed.`);
      return text({ cancelled: id, type: op.type, description: op.description });
    }
  );

  // ── cancel_all ─────────────────────────────────────────────
  server.tool(
    'cancel_all',
    'Cancel/reject ALL pending staged operations. No CRM changes are made.',
    {},
    async () => {
      const queue = getApprovalQueue();
      const rejected = queue.rejectAll();
      return text({
        cancelled: rejected.length,
        operations: rejected.map(op => ({ id: op.id, type: op.type, description: op.description })),
      });
    }
  );

  // ── crm_auth_status ─────────────────────────────────────────
  server.tool(
    'crm_auth_status',
    'Check authentication status — shows current user, expiry, CRM URL.',
    {},
    async () => {
      const authResult = await crmClient.request('WhoAmI');
      if (!authResult.ok) return error(`Not authenticated: ${authResult.data?.message || authResult.status}`);
      return text({
        authenticated: true,
        userId: authResult.data?.UserId,
        businessUnitId: authResult.data?.BusinessUnitId,
        organizationId: authResult.data?.OrganizationId
      });
    }
  );

  // ── manage_deal_team ─────────────────────────────────────────
  const OPP_TEAM_TEMPLATE_ID = 'cc923a9d-7651-e311-9405-00155db3ba1e';

  server.tool(
    'manage_deal_team',
    'List, add, or remove deal team members on an opportunity via D365 Access Teams. ' +
      'For "add": resolves a person by email or systemUserId, then calls AddUserToRecordTeam ' +
      'to add them to the opportunity access team (the "Deal Team" tab in MSX). ' +
      'For "list": returns current access team members. ' +
      'For "remove": calls RemoveUserFromRecordTeam to remove a user.',
    {
      action: z.enum(['list', 'add', 'remove']).describe('Action to perform'),
      opportunityId: z.string().describe('Opportunity GUID'),
      email: z.string().optional().describe('Email address of the person to add/remove (used to resolve systemuserid)'),
      systemUserId: z.string().optional().describe('SystemUser GUID (if known — skips email lookup)')
    },
    async ({ action, opportunityId, email, systemUserId }) => {
      const oppNid = normalizeGuid(opportunityId);
      if (!isValidGuid(oppNid)) return error('Invalid opportunityId GUID');

      // ── LIST ──
      if (action === 'list') {
        const teamResult = await crmClient.requestAllPages('teams', {
          query: {
            $filter: `_regardingobjectid_value eq '${oppNid}' and _teamtemplateid_value eq '${OPP_TEAM_TEMPLATE_ID}'`,
            $select: 'teamid,name',
            $expand: 'teammembership_association($select=systemuserid,fullname,title)',
            $top: '1'
          }
        });
        if (!teamResult.ok) return error(`List deal team failed (${teamResult.status}): ${teamResult.data?.message}`);

        const teams = teamResult.data?.value || [];
        if (!teams.length) {
          return text({ opportunityId: oppNid, teamExists: false, count: 0, members: [], message: 'No deal team exists yet (0 members).' });
        }

        const team = teams[0];
        const members = (team.teammembership_association || []).map(m => ({
          systemUserId: m.systemuserid,
          fullName: m.fullname,
          title: m.title
        }));
        return text({ opportunityId: oppNid, teamId: team.teamid, teamExists: true, count: members.length, members });
      }

      // ── Resolve user for add/remove ──
      let resolvedUserId = systemUserId ? normalizeGuid(systemUserId) : null;
      let displayName = null;

      if (!resolvedUserId && email) {
        const sanitizedEmail = sanitizeODataString(email.trim());
        const userResult = await crmClient.requestAllPages('systemusers', {
          query: {
            $filter: `internalemailaddress eq '${sanitizedEmail}'`,
            $select: 'systemuserid,fullname,internalemailaddress',
            $top: '5'
          }
        });
        if (userResult.ok && userResult.data?.value?.length) {
          resolvedUserId = normalizeGuid(userResult.data.value[0].systemuserid);
          displayName = userResult.data.value[0].fullname;
        } else {
          return error(`No systemuser found with email "${email}". Verify the email address is correct.`);
        }
      }

      if (!resolvedUserId || !isValidGuid(resolvedUserId)) {
        return error('Either email or systemUserId is required to add/remove a deal team member.');
      }

      if (!displayName) {
        const userResult = await crmClient.request(`systemusers(${resolvedUserId})`, {
          query: { $select: 'fullname' }
        });
        if (userResult.ok && userResult.data) displayName = userResult.data.fullname;
      }

      // ── ADD ──
      if (action === 'add') {
        const payload = {
          Record: { '@odata.id': `opportunities(${oppNid})` },
          SystemUserId: resolvedUserId,
          TeamTemplate: { '@odata.id': `teamtemplates(${OPP_TEAM_TEMPLATE_ID})` }
        };

        const queue = getApprovalQueue();
        const op = queue.stage({
          type: 'add_deal_team_member',
          entitySet: 'AddUserToRecordTeam',
          method: 'POST',
          payload,
          beforeState: null,
          description: `Add ${displayName || resolvedUserId} to deal team on opportunity ${oppNid}`
        });
        return text({
          staged: true,
          operationId: op.id,
          description: op.description,
          resolvedUserId,
          displayName,
          message: `Staged ${op.id}: ${op.description}. Approve via execute_operation.`
        });
      }

      // ── REMOVE ──
      if (action === 'remove') {
        const payload = {
          Record: { '@odata.id': `opportunities(${oppNid})` },
          SystemUserId: resolvedUserId,
          TeamTemplate: { '@odata.id': `teamtemplates(${OPP_TEAM_TEMPLATE_ID})` }
        };

        const queue = getApprovalQueue();
        const op = queue.stage({
          type: 'remove_deal_team_member',
          entitySet: 'RemoveUserFromRecordTeam',
          method: 'POST',
          payload,
          beforeState: null,
          description: `Remove ${displayName || resolvedUserId} from deal team on opportunity ${oppNid}`
        });
        return text({
          staged: true,
          operationId: op.id,
          description: op.description,
          resolvedUserId,
          displayName,
          message: `Staged ${op.id}: ${op.description}. Approve via execute_operation.`
        });
      }

      return error(`Unknown action: ${action}`);
    }
  );

  // ── manage_milestone_team ──────────────────────────────────
  const MILESTONE_TEAM_TEMPLATE_ID = '316e4735-9e83-eb11-a812-0022481e1be0';

  server.tool(
    'manage_milestone_team',
    'List members on a milestone\'s access team (the "Milestone Team" tab in MSX). ' +
      'Uses Dynamics 365 Access Teams with the "Milestone Team" team template. ' +
      'Only "list" is functional via API — "add" and "remove" are blocked because standard MSX security ' +
      'roles lack prvWriteTeam/prvCreateTeam privileges. The tool will resolve the user and return their ' +
      'name for manual addition via the MSX UI.',
    {
      action: z.enum(['list', 'add', 'remove']).describe('Action to perform'),
      milestoneId: z.string().describe('Engagement milestone GUID'),
      email: z.string().optional().describe('Email address of the person to add/remove (used to resolve systemuserid)'),
      systemUserId: z.string().optional().describe('SystemUser GUID (if known — skips email lookup)')
    },
    async ({ action, milestoneId, email, systemUserId }) => {
      const msNid = normalizeGuid(milestoneId);
      if (!isValidGuid(msNid)) return error('Invalid milestoneId GUID');

      // ── LIST ──
      if (action === 'list') {
        // Find the access team for this milestone
        const teamResult = await crmClient.requestAllPages('teams', {
          query: {
            $filter: `_regardingobjectid_value eq '${msNid}' and _teamtemplateid_value eq '${MILESTONE_TEAM_TEMPLATE_ID}'`,
            $select: 'teamid,name',
            $expand: 'teammembership_association($select=systemuserid,fullname,title)',
            $top: '1'
          }
        });
        if (!teamResult.ok) return error(`List milestone team failed (${teamResult.status}): ${teamResult.data?.message}`);

        const teams = teamResult.data?.value || [];
        if (!teams.length) {
          return text({ milestoneId: msNid, teamExists: false, count: 0, members: [], message: 'No milestone team exists yet (0 members).' });
        }

        const team = teams[0];
        const members = (team.teammembership_association || []).map(m => ({
          systemUserId: m.systemuserid,
          fullName: m.fullname,
          title: m.title
        }));
        return text({ milestoneId: msNid, teamId: team.teamid, teamExists: true, count: members.length, members });
      }

      // ── Resolve user for add/remove ──
      let resolvedUserId = systemUserId ? normalizeGuid(systemUserId) : null;
      let displayName = null;

      if (!resolvedUserId && email) {
        const sanitizedEmail = sanitizeODataString(email.trim());
        const userResult = await crmClient.requestAllPages('systemusers', {
          query: {
            $filter: `internalemailaddress eq '${sanitizedEmail}'`,
            $select: 'systemuserid,fullname,internalemailaddress',
            $top: '5'
          }
        });
        if (userResult.ok && userResult.data?.value?.length) {
          resolvedUserId = normalizeGuid(userResult.data.value[0].systemuserid);
          displayName = userResult.data.value[0].fullname;
        } else {
          return error(`No systemuser found with email "${email}".`);
        }
      }

      if (!resolvedUserId || !isValidGuid(resolvedUserId)) {
        return error('Either email or systemUserId is required to add/remove a milestone team member.');
      }

      // Look up display name if we only have systemUserId
      if (!displayName) {
        const userResult = await crmClient.request(`systemusers(${resolvedUserId})`, {
          query: { $select: 'fullname' }
        });
        if (userResult.ok && userResult.data) displayName = userResult.data.fullname;
      }

      // ── ADD ──
      if (action === 'add') {
        // Check if access team already exists — if not, the API will fail with
        // prvCreateTeam privilege error because team auto-creation requires it.
        const existingTeam = await crmClient.requestAllPages('teams', {
          query: {
            $filter: `_regardingobjectid_value eq '${msNid}' and _teamtemplateid_value eq '${MILESTONE_TEAM_TEMPLATE_ID}'`,
            $select: 'teamid',
            $top: '1'
          }
        });
        const teamExists = existingTeam.ok && existingTeam.data?.value?.length > 0;
        if (!teamExists) {
          return error(
            'No access team exists for this milestone yet. The D365 AddUserToRecordTeam action ' +
            'requires prvCreateTeam and prvWriteTeam privileges on the team entity, which most MSX ' +
            'user roles lack. Please add members via the MSX UI (Milestone Team tab) — the UI uses ' +
            'elevated server-side privileges to manage the team.'
          );
        }

        // Even with an existing team, AddUserToRecordTeam requires prvWriteTeam,
        // which most MSX user roles also lack. Warn proactively.
        return error(
          'Milestone team management via API is not available — the AddUserToRecordTeam action ' +
          'requires prvWriteTeam privilege on the team entity, which your CRM security roles lack. ' +
          'Please add or remove milestone team members via the MSX UI (Milestone Team tab). ' +
          'The UI uses elevated server-side plugins that bypass this restriction. ' +
          `User to add: ${displayName || email || resolvedUserId}`
        );
      }

      // ── REMOVE ──
      if (action === 'remove') {
        // RemoveUserFromRecordTeam also requires prvWriteTeam, which is missing.
        return error(
          'Milestone team management via API is not available — the RemoveUserFromRecordTeam action ' +
          'requires prvWriteTeam privilege on the team entity, which your CRM security roles lack. ' +
          'Please remove milestone team members via the MSX UI (Milestone Team tab). ' +
          `User to remove: ${displayName || email || resolvedUserId}`
        );
      }

      return error(`Unknown action: ${action}`);
    }
  );

  // ══════════════════════════════════════════════════════════════
  // Power BI / GitHub Stack Summary tools
  // ══════════════════════════════════════════════════════════════

  if (pbiClient) {
    // ── get_github_stack_summary ─────────────────────────────
    server.tool(
      'get_github_stack_summary',
      'Get GitHub Stack Summary (ACR, seats, attach rates) for a customer by TPID. ' +
        'Data sourced from MSX Insights Power BI Embedded report. ' +
        'Uses file cache (~/.msxi/cache/gh-stack/) with 30min TTL. ' +
        'If result has needsExtraction=true, use the gh-stack-browser-extraction skill ' +
        'to extract fresh data via Playwright MCP browser tools, then call save_gh_stack_data.',
      {
        tpid: z.string().describe('Top-parent ID (TPID) for the customer, e.g. "34771657"')
      },
      async ({ tpid }) => {
        if (!isValidTpid(tpid)) return error('Invalid TPID — must be a numeric string');
        try {
          const result = await pbiClient.getGitHubStackSummary(tpid);
          return text(result);
        } catch (err) {
          return error(`GitHub Stack Summary failed: ${err.message}`);
        }
      }
    );

    // ── save_gh_stack_data ───────────────────────────────────
    server.tool(
      'save_gh_stack_data',
      'Save GitHub Stack data extracted from the MSX Insights PBI report via ' +
        'Playwright MCP browser tools. Called after the gh-stack-browser-extraction ' +
        'skill exports CSV via the PBI JS API (visual.exportData). ' +
        'Accepts raw CSV strings from the Account Stack Table and optional Summary Table.',
      {
        tpid: z.string().describe('Top-parent ID (TPID) for the customer'),
        accountStackCsv: z.string().describe('CSV data from the Account Stack Table visual (from exportData)'),
        summaryCsv: z.string().optional().describe('CSV data from the Summary Table visual (optional)')
      },
      async ({ tpid, accountStackCsv, summaryCsv }) => {
        if (!isValidTpid(tpid)) return error('Invalid TPID — must be a numeric string');
        try {
          const result = pbiClient.saveExtractedData(tpid, {
            accountStackCsv,
            summaryCsv: summaryCsv || ''
          });
          return text(result);
        } catch (err) {
          return error(`Save failed: ${err.message}`);
        }
      }
    );
  }
}
