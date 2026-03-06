// MCP tool definitions for Teams local cache reader
// Each tool validates params, queries the ContextEngine, and returns structured results

import { z } from 'zod';
import { ContextEngine } from './context-engine.js';
import { resolveCachePath } from './path-resolver.js';

const text = (content) => ({
  content: [{ type: 'text', text: typeof content === 'string' ? content : JSON.stringify(content, null, 2) }]
});
const error = (msg) => ({
  content: [{ type: 'text', text: msg }], isError: true
});

// Lazy singleton — created on first tool call so server starts fast
let _engine = null;

function getEngine() {
  if (!_engine) {
    const cachePath = resolveCachePath();
    _engine = new ContextEngine(cachePath);
  }
  return _engine;
}

/**
 * Register all Teams cache reader tools on an McpServer instance.
 */
export function registerTools(server) {

  // ── teams_cache_status ────────────────────────────────────────
  server.tool(
    'teams_cache_status',
    'Report Teams local cache health: file counts, total size, record statistics (messages, conversations, contacts), and last modified time. Use to verify cache availability before querying.',
    {},
    async () => {
      try {
        const engine = getEngine();
        const status = await engine.getCacheStatus();
        return text(status);
      } catch (e) {
        return error(`Cache status failed: ${e.message}`);
      }
    }
  );

  // ── teams_reload_cache ────────────────────────────────────────
  server.tool(
    'teams_reload_cache',
    'Force-reload the Teams local cache from disk. Use when messages are known to exist but not appearing in search results, or after the user has opened new chats in Teams.',
    {},
    async () => {
      try {
        const engine = getEngine();
        const stats = await engine.reload();
        return text({ reloaded: true, ...stats });
      } catch (e) {
        return error(`Cache reload failed: ${e.message}`);
      }
    }
  );

  // ── teams_list_conversations ──────────────────────────────────
  server.tool(
    'teams_list_conversations',
    'List conversations (chats, meetings, channels) found in the Teams local cache. Returns thread IDs, topics, and types.',
    {
      type: z.string().optional().describe('Filter by type: chat, meeting, channel'),
      keyword: z.string().optional().describe('Filter by keyword in topic or thread ID'),
      limit: z.number().int().min(1).max(500).default(50).describe('Max results (default 50)')
    },
    async (params) => {
      try {
        const engine = getEngine();
        const convs = await engine.listConversations(params);
        return text({ count: convs.length, conversations: convs });
      } catch (e) {
        return error(`List conversations failed: ${e.message}`);
      }
    }
  );

  // ── teams_search_messages ─────────────────────────────────────
  server.tool(
    'teams_search_messages',
    'Search cached Teams message content. Optionally scoped to a specific conversation thread. Returns messages matching query, filtered by person, thread, or date range.',
    {
      query: z.string().optional().describe('Text to search in message content'),
      person: z.string().optional().describe('Filter by sender display name (partial match)'),
      threadId: z.string().optional().describe('Scope search to a specific conversation thread ID (e.g. 19:abc123@thread.v2)'),
      daysBack: z.number().int().min(1).max(365).optional().describe('Only messages from last N days'),
      limit: z.number().int().min(1).max(100).default(25).describe('Max results (default 25)')
    },
    async (params) => {
      try {
        const engine = getEngine();
        const msgs = await engine.searchMessages(params);
        return text({
          count: msgs.length,
          note: msgs.length === 0
            ? 'No cached messages found. Teams caches primarily metadata (threads, contacts) — most message bodies are fetched on-demand from the server and not stored locally.'
            : undefined,
          messages: msgs
        });
      } catch (e) {
        return error(`Search messages failed: ${e.message}`);
      }
    }
  );

  // ── teams_get_conversation ────────────────────────────────────
  server.tool(
    'teams_get_conversation',
    'Get all cached context for a specific conversation thread: metadata and any cached messages.',
    {
      threadId: z.string().describe('Thread ID (e.g. 19:abc123@thread.tacv2)')
    },
    async (params) => {
      try {
        const engine = getEngine();
        const ctx = await engine.getConversationContext(params.threadId);
        return text(ctx);
      } catch (e) {
        return error(`Get conversation failed: ${e.message}`);
      }
    }
  );

  // ── teams_get_people ──────────────────────────────────────────
  server.tool(
    'teams_get_people',
    'List people (contacts) found in the Teams cache. Returns display names, email, MRI identifiers.',
    {
      keyword: z.string().optional().describe('Filter by name, email, or MRI (partial match)'),
      limit: z.number().int().min(1).max(500).default(50).describe('Max results (default 50)')
    },
    async (params) => {
      try {
        const engine = getEngine();
        const people = await engine.getPeople(params);
        return text({ count: people.length, people });
      } catch (e) {
        return error(`Get people failed: ${e.message}`);
      }
    }
  );

  // ── teams_get_person_activity ─────────────────────────────────
  server.tool(
    'teams_get_person_activity',
    'Get all cached activity for a specific person: messages they sent and conversations they appear in.',
    {
      name: z.string().describe('Person display name to search for (partial match)')
    },
    async (params) => {
      try {
        const engine = getEngine();
        const activity = await engine.getPersonActivity(params.name);
        return text(activity);
      } catch (e) {
        return error(`Get person activity failed: ${e.message}`);
      }
    }
  );

  // ── teams_find_meetings ───────────────────────────────────────
  server.tool(
    'teams_find_meetings',
    'Find meeting threads in the cache. Meeting thread IDs contain "meeting_" or have meeting threadtype.',
    {
      keyword: z.string().optional().describe('Filter meetings by keyword in subject or topic'),
      limit: z.number().int().min(1).max(200).default(25).describe('Max results (default 25)')
    },
    async (params) => {
      try {
        const engine = getEngine();
        // Try by threadtype first
        let meetings = await engine.listConversations({ type: 'meeting', keyword: params.keyword, limit: 500 });

        // Also capture threads with meeting_ in ID
        if (meetings.length === 0) {
          const all = await engine.listConversations({ limit: 2000 });
          meetings = all.filter(c => {
            const id = (c.id || c.conversationId || '');
            return id.includes('meeting_');
          });
          if (params.keyword) {
            const kw = params.keyword.toLowerCase();
            meetings = meetings.filter(m => {
              const hay = [m.topic, m.subject, m.id].filter(Boolean).join(' ').toLowerCase();
              return hay.includes(kw);
            });
          }
        }

        return text({
          count: Math.min(meetings.length, params.limit || 25),
          meetings: meetings.slice(0, params.limit || 25)
        });
      } catch (e) {
        return error(`Find meetings failed: ${e.message}`);
      }
    }
  );
}
