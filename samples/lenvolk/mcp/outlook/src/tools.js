// MCP tool definitions — maps Outlook COM operations to MCP tools
// Each tool validates params, delegates to outlook.js, and returns structured results

import { z } from 'zod';
import {
  validateEmails, validateAccountName, validateDaysBack,
  validateKeywords, validateBatchSearchInput, validateBatchDraftInput,
  validateSubject, validateDaysForward, validateMaxResults
} from './validation.js';
import {
  searchEmailsSingle, searchEmailsBatch,
  createDraftSingle, createDraftBatch,
  getRecentEmails,
  searchCalendarEvents,
  checkHealth
} from './outlook.js';

const text = (content) => ({
  content: [{ type: 'text', text: typeof content === 'string' ? content : JSON.stringify(content, null, 2) }]
});
const error = (msg) => ({
  content: [{ type: 'text', text: msg }], isError: true
});

/**
 * Register all Outlook tools on an McpServer instance.
 */
export function registerTools(server) {
  // ── outlook_search_emails ───────────────────────────────────
  server.tool(
    'outlook_search_emails',
    'Search local Outlook mailbox for emails matching contacts, keywords, and date range. Single-account surgical mode. Uses COM automation — zero API calls, no rate limits.',
    {
      contacts: z.array(z.string()).describe('Email addresses to search for (To/From/CC match)'),
      daysBack: z.number().int().min(1).max(365).default(30).describe('How many days back to search (1-365, default 30)'),
      accountName: z.string().optional().describe('Account name for result scoping and labeling'),
      keywords: z.array(z.string()).optional().describe('Optional keywords to filter results (subject/body match)')
    },
    async (params) => {
      // Validate contacts
      const emailResult = validateEmails(params.contacts);
      if (!emailResult.valid) return error(`Invalid contacts: ${emailResult.reason}`);

      // Validate daysBack
      const dbResult = validateDaysBack(params.daysBack);
      if (!dbResult.valid) return error(dbResult.reason);

      // Validate keywords if provided
      let keywords = [];
      if (params.keywords) {
        const kwResult = validateKeywords(params.keywords);
        if (!kwResult.valid) return error(kwResult.reason);
        keywords = kwResult.keywords;
      }

      // Validate accountName if provided
      let accountName = '';
      if (params.accountName) {
        const acctResult = validateAccountName(params.accountName);
        if (!acctResult.valid) return error(acctResult.reason);
        accountName = acctResult.name;
      }

      const result = await searchEmailsSingle({
        contacts: emailResult.emails,
        daysBack: params.daysBack,
        accountName,
        keywords
      });

      if (!result.ok) {
        const msg = result.data
          ? `Search completed with errors: ${result.error}\nPartial results:\n${JSON.stringify(result.data, null, 2)}`
          : `Search failed: ${result.error}`;
        return error(msg);
      }

      return text(result.data);
    }
  );

  // ── outlook_search_emails_batch ─────────────────────────────
  server.tool(
    'outlook_search_emails_batch',
    'Batch search local Outlook mailbox for multiple accounts in a single COM session. Fleet mode — 4+ accounts. Returns per-account results keyed by account name.',
    {
      accounts: z.array(z.object({
        account: z.string().describe('Account name (used as result key)'),
        contacts: z.array(z.string()).describe('Email addresses for this account'),
        keywords: z.array(z.string()).optional().describe('Optional keywords for this account'),
        daysBack: z.number().int().min(1).max(365).optional().describe('Days back for this account (default 90)')
      })).describe('Array of account search specs')
    },
    async (params) => {
      const valResult = validateBatchSearchInput(params.accounts);
      if (!valResult.valid) return error(`Invalid batch input: ${valResult.reason}`);

      // Normalize: ensure each spec has daysBack default
      const specs = params.accounts.map(a => ({
        account: a.account.trim(),
        contacts: a.contacts.map(c => c.trim()),
        keywords: a.keywords || [],
        daysBack: a.daysBack || 90
      }));

      const result = await searchEmailsBatch(specs);

      if (!result.ok && !result.data) {
        return error(`Batch search failed: ${result.error}`);
      }

      // Even partial results are useful — return them with error flag
      if (!result.ok && result.data) {
        return text({
          _warning: `Batch completed with errors: ${result.error}`,
          ...result.data
        });
      }

      return text(result.data);
    }
  );

  // ── outlook_create_draft ────────────────────────────────────
  server.tool(
    'outlook_create_draft',
    'Create and save a single email draft in Outlook. Uses COM automation — zero API calls. Draft is saved in Drafts folder for human review before sending.',
    {
      to: z.array(z.string()).describe('Recipient email addresses'),
      cc: z.array(z.string()).optional().describe('CC email addresses'),
      bcc: z.array(z.string()).optional().describe('BCC email addresses'),
      subject: z.string().describe('Email subject line'),
      body: z.string().describe('Email body (HTML or plain text)'),
      bodyType: z.enum(['HTML', 'Text']).default('HTML').describe('Body format: HTML or Text')
    },
    async (params) => {
      // Validate To
      const toResult = validateEmails(params.to);
      if (!toResult.valid) return error(`Invalid To: ${toResult.reason}`);

      // Validate CC/BCC if provided
      if (params.cc) {
        const ccResult = validateEmails(params.cc);
        if (!ccResult.valid) return error(`Invalid CC: ${ccResult.reason}`);
      }
      if (params.bcc) {
        const bccResult = validateEmails(params.bcc);
        if (!bccResult.valid) return error(`Invalid BCC: ${bccResult.reason}`);
      }

      // Validate subject
      const subResult = validateSubject(params.subject);
      if (!subResult.valid) return error(subResult.reason);

      if (!params.body || params.body.trim().length === 0) {
        return error('Body cannot be empty');
      }

      const result = await createDraftSingle({
        to: toResult.emails,
        cc: params.cc ? params.cc.map(e => e.trim()) : [],
        bcc: params.bcc ? params.bcc.map(e => e.trim()) : [],
        subject: params.subject,
        body: params.body,
        bodyType: params.bodyType
      });

      if (!result.ok) return error(`Draft creation failed: ${result.error}`);
      return text(result.data);
    }
  );

  // ── outlook_create_draft_batch ──────────────────────────────
  server.tool(
    'outlook_create_draft_batch',
    'Create and save email drafts for multiple accounts in a single COM session. Fleet mode. Each draft is saved in Drafts folder for human review.',
    {
      drafts: z.array(z.object({
        account: z.string().describe('Account name (used as result key)'),
        to: z.array(z.string()).describe('Recipient email addresses'),
        cc: z.array(z.string()).optional().describe('CC email addresses'),
        bcc: z.array(z.string()).optional().describe('BCC email addresses'),
        subject: z.string().describe('Email subject line'),
        body: z.string().describe('Email body (HTML or plain text)'),
        bodyType: z.enum(['HTML', 'Text']).optional().describe('Body format (default: HTML)')
      })).describe('Array of draft specs')
    },
    async (params) => {
      const valResult = validateBatchDraftInput(params.drafts);
      if (!valResult.valid) return error(`Invalid batch input: ${valResult.reason}`);

      // Normalize specs
      const specs = params.drafts.map(d => ({
        account: d.account.trim(),
        to: d.to.map(e => e.trim()),
        cc: d.cc ? d.cc.map(e => e.trim()) : [],
        bcc: d.bcc ? d.bcc.map(e => e.trim()) : [],
        subject: d.subject,
        body: d.body,
        bodyType: d.bodyType || 'HTML'
      }));

      const result = await createDraftBatch(specs);

      if (!result.ok && !result.data) {
        return error(`Batch draft creation failed: ${result.error}`);
      }

      if (!result.ok && result.data) {
        return text({
          _warning: `Batch completed with errors: ${result.error}`,
          ...result.data
        });
      }

      return text(result.data);
    }
  );

  // ── outlook_get_recent_emails ───────────────────────────────
  server.tool(
    'outlook_get_recent_emails',
    'Get the N most recent emails from Inbox and/or Sent Items without requiring contact addresses. Use when you need to see what just arrived or find recent correspondence regardless of sender. Uses COM automation — zero API calls.',
    {
      maxResults: z.number().int().min(1).max(100).default(10).describe('Maximum emails to return (1-100, default 10)'),
      daysBack: z.number().int().min(1).max(365).default(7).describe('How many days back to search (1-365, default 7)'),
      folders: z.enum(['Inbox', 'SentItems', 'Both']).default('Both').describe('Which folders to search (default: Both)'),
      keywords: z.array(z.string()).optional().describe('Optional keywords to filter by subject match')
    },
    async (params) => {
      // Validate daysBack
      const dbResult = validateDaysBack(params.daysBack);
      if (!dbResult.valid) return error(dbResult.reason);

      // Validate maxResults
      if (params.maxResults != null) {
        const mrResult = validateMaxResults(params.maxResults);
        if (!mrResult.valid) return error(mrResult.reason);
      }

      // Validate keywords if provided
      let keywords = [];
      if (params.keywords) {
        const kwResult = validateKeywords(params.keywords);
        if (!kwResult.valid) return error(kwResult.reason);
        keywords = kwResult.keywords;
      }

      const result = await getRecentEmails({
        maxResults: params.maxResults ?? 10,
        daysBack: params.daysBack ?? 7,
        folders: params.folders ?? 'Both',
        keywords
      });

      if (!result.ok) {
        const msg = result.data
          ? `Recent emails fetch completed with errors: ${result.error}\nPartial results:\n${JSON.stringify(result.data, null, 2)}`
          : `Recent emails fetch failed: ${result.error}`;
        return error(msg);
      }

      return text(result.data);
    }
  );

  // ── outlook_search_calendar ──────────────────────────────────
  server.tool(
    'outlook_search_calendar',
    'Search local Outlook calendar for meetings/events by date range, keywords, and attendees. Uses COM automation — zero API calls, no rate limits. Returns event details including attendees with acceptance status.',
    {
      daysBack: z.number().int().min(0).max(365).default(14).describe('How many days back to search for past events (0-365, default 14)'),
      daysForward: z.number().int().min(0).max(365).default(14).describe('How many days forward to search for future events (0-365, default 14)'),
      keywords: z.array(z.string()).optional().describe('Optional keywords to filter by Subject match'),
      attendees: z.array(z.string()).optional().describe('Optional attendee email addresses to filter by'),
      accountName: z.string().optional().describe('Account name for result labeling'),
      maxResults: z.number().int().min(1).max(200).default(50).describe('Maximum events to return (1-200, default 50)')
    },
    async (params) => {
      // Validate daysBack
      if (params.daysBack != null) {
        const dbResult = validateDaysForward(params.daysBack);
        if (!dbResult.valid) return error(`Invalid daysBack: ${dbResult.reason}`);
      }

      // Validate daysForward
      if (params.daysForward != null) {
        const dfResult = validateDaysForward(params.daysForward);
        if (!dfResult.valid) return error(`Invalid daysForward: ${dfResult.reason}`);
      }

      // Validate keywords if provided
      let keywords = [];
      if (params.keywords) {
        const kwResult = validateKeywords(params.keywords);
        if (!kwResult.valid) return error(kwResult.reason);
        keywords = kwResult.keywords;
      }

      // Validate attendees if provided
      let attendees = [];
      if (params.attendees) {
        const attResult = validateEmails(params.attendees);
        if (!attResult.valid) return error(`Invalid attendees: ${attResult.reason}`);
        attendees = attResult.emails;
      }

      // Validate accountName if provided
      let accountName = '';
      if (params.accountName) {
        const acctResult = validateAccountName(params.accountName);
        if (!acctResult.valid) return error(acctResult.reason);
        accountName = acctResult.name;
      }

      // Validate maxResults
      if (params.maxResults != null) {
        const mrResult = validateMaxResults(params.maxResults);
        if (!mrResult.valid) return error(mrResult.reason);
      }

      const result = await searchCalendarEvents({
        daysBack: params.daysBack ?? 14,
        daysForward: params.daysForward ?? 14,
        keywords,
        attendees,
        accountName,
        maxResults: params.maxResults ?? 50
      });

      if (!result.ok) {
        const msg = result.data
          ? `Calendar search completed with errors: ${result.error}\nPartial results:\n${JSON.stringify(result.data, null, 2)}`
          : `Calendar search failed: ${result.error}`;
        return error(msg);
      }

      return text(result.data);
    }
  );

  // ── outlook_check_health ────────────────────────────────────
  server.tool(
    'outlook_check_health',
    'Verify Outlook COM is reachable. Returns current user name if healthy, or clear error if Outlook is not running or COM is unavailable. Call before batch operations.',
    {},
    async () => {
      const result = await checkHealth();
      if (!result.ok) return error(`Outlook health check failed: ${result.error}`);
      return text({ status: 'healthy', user: result.user });
    }
  );
}
