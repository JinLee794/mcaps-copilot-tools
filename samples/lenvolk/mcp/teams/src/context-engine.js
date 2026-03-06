// Context engine — lazily-loaded cache with in-memory indexes for fast queries
// Reads the Teams LevelDB cache on first access, auto-reloads when LDB files change

import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { readCacheFiles } from './cache-reader.js';
import { resolveCachePath, getCacheStats } from './path-resolver.js';
import { stripHtml } from './html-utils.js';

/** Minimum seconds between file-system checks for cache freshness. */
const STALENESS_CHECK_INTERVAL_MS = 30_000; // 30 seconds

/**
 * Convert an ISO/UTC composetime string to US Eastern (ET) display string.
 * Handles EST/EDT automatically via Intl.
 */
function toEastern(isoStr) {
  if (!isoStr) return isoStr;
  try {
    const d = new Date(isoStr);
    if (isNaN(d)) return isoStr;
    return d.toLocaleString('en-US', { timeZone: 'America/New_York',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    }) + ' ET';
  } catch { return isoStr; }
}

export class ContextEngine {
  constructor(cachePath) {
    this.cachePath = cachePath;
    this._loaded = false;
    this._lastCheckedAt = 0;   // epoch ms of last staleness check
    this._cacheFingerprint = null; // { ldbCount, latestMtimeMs }
    this.messages = [];
    this.conversations = [];
    this.contacts = [];
    this._personIndex = new Map(); // lowered name → contact object
    this._threadIndex = new Map(); // thread ID → conversation object
  }

  /**
   * Snapshot the LDB file count and latest mtime — cheap fs stat call.
   * Returns { ldbCount, latestMtimeMs }.
   */
  _snapshotFingerprint() {
    try {
      const files = readdirSync(this.cachePath);
      const ldbFiles = files.filter(f => f.endsWith('.ldb') || f.endsWith('.log'));
      let latestMtimeMs = 0;
      for (const f of ldbFiles) {
        try {
          const st = statSync(join(this.cachePath, f));
          if (st.mtimeMs > latestMtimeMs) latestMtimeMs = st.mtimeMs;
        } catch { /* file may have been compacted away */ }
      }
      return { ldbCount: ldbFiles.length, latestMtimeMs };
    } catch {
      return null;
    }
  }

  /**
   * Check if the on-disk cache has changed since last load.
   */
  _isCacheStale() {
    const now = Date.now();
    if (now - this._lastCheckedAt < STALENESS_CHECK_INTERVAL_MS) return false;
    this._lastCheckedAt = now;

    const current = this._snapshotFingerprint();
    if (!current || !this._cacheFingerprint) return true;
    return current.ldbCount !== this._cacheFingerprint.ldbCount ||
           current.latestMtimeMs !== this._cacheFingerprint.latestMtimeMs;
  }

  async ensureLoaded() {
    if (this._loaded && !this._isCacheStale()) return;

    const isReload = this._loaded;
    console.error(`[teams-cache] ${isReload ? 'Reloading (files changed)' : 'Loading cache'} from ${this.cachePath} …`);
    const t0 = Date.now();

    const data = await readCacheFiles(this.cachePath);
    this.messages = data.messages;
    this.conversations = data.conversations;
    this.contacts = data.contacts;
    this._buildIndexes();
    this._loaded = true;
    this._cacheFingerprint = this._snapshotFingerprint();
    this._lastCheckedAt = Date.now();

    console.error(
      `[teams-cache] ${isReload ? 'Reloaded' : 'Loaded'} in ${Date.now() - t0}ms — ` +
      `${this.messages.length} messages, ${this.conversations.length} conversations, ` +
      `${this.contacts.length} contacts`
    );
  }

  /**
   * Force-reload the cache regardless of staleness.
   * Returns load stats for the caller.
   */
  async reload() {
    this._loaded = false;
    this._cacheFingerprint = null;
    await this.ensureLoaded();
    return {
      messageCount: this.messages.length,
      conversationCount: this.conversations.length,
      contactCount: this.contacts.length
    };
  }

  _buildIndexes() {
    // Person index from contacts
    for (const c of this.contacts) {
      const name = (c.imdisplayname || c.displayName || '').toLowerCase().trim();
      if (name) this._personIndex.set(name, c);
    }

    // Thread index from conversations
    for (const conv of this.conversations) {
      const id = conv.id || conv.conversationId;
      if (id) this._threadIndex.set(id, conv);
    }

    // Backfill person index from message senders
    for (const msg of this.messages) {
      const name = (msg.imdisplayname || msg.fromDisplayNameInToken || '').toLowerCase().trim();
      if (name && !this._personIndex.has(name)) {
        this._personIndex.set(name, {
          imdisplayname: msg.imdisplayname || msg.fromDisplayNameInToken,
          mri: msg.creator || undefined
        });
      }
    }
  }

  // ── Query methods ───────────────────────────────────────────

  async getCacheStatus() {
    const stats = getCacheStats(this.cachePath);
    await this.ensureLoaded();
    return {
      ...stats,
      messageCount: this.messages.length,
      conversationCount: this.conversations.length,
      contactCount: this.contacts.length,
      personIndexSize: this._personIndex.size,
      threadIndexSize: this._threadIndex.size,
      indexed: true
    };
  }

  async listConversations({ type, keyword, limit = 50 } = {}) {
    await this.ensureLoaded();
    let results = [...this.conversations];

    if (type) {
      const t = type.toLowerCase();
      results = results.filter(c => {
        const cType = (c.threadtype || '').toLowerCase();
        const cId = (c.id || c.conversationId || '').toLowerCase();
        return cType.includes(t) || (t === 'meeting' && cId.includes('meeting_'));
      });
    }

    if (keyword) {
      const kw = keyword.toLowerCase();
      results = results.filter(c => {
        const haystack = [c.topic, c.subject, c.id, c.conversationId]
          .filter(Boolean).join(' ').toLowerCase();
        return haystack.includes(kw);
      });
    }

    return results.slice(0, limit).map(c => ({
      id: c.id || c.conversationId || null,
      topic: c.topic || c.subject || null,
      type: c.threadtype || null,
      ...c
    }));
  }

  async searchMessages({ query, person, daysBack, limit = 25, threadId } = {}) {
    await this.ensureLoaded();
    let results = [...this.messages];

    if (threadId) {
      const tid = threadId.toLowerCase();
      results = results.filter(m =>
        (m.conversationId || m.conversationid || m.id || '').toLowerCase() === tid
      );
    }

    if (person) {
      const p = person.toLowerCase();
      results = results.filter(m =>
        (m.imdisplayname || '').toLowerCase().includes(p) ||
        (m.fromDisplayNameInToken || '').toLowerCase().includes(p) ||
        (m.from || '').toLowerCase().includes(p) ||
        (m.creator || '').toLowerCase().includes(p)
      );
    }

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(m => {
        const plain = stripHtml(m.content || '', { compact: true });
        return plain.toLowerCase().includes(q) ||
               (m.imdisplayname || '').toLowerCase().includes(q) ||
               (m.subject || '').toLowerCase().includes(q);
      });
    }

    if (daysBack) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - daysBack);
      const cutoffStr = cutoff.toISOString();
      results = results.filter(m => m.composetime >= cutoffStr);
    }

    results.sort((a, b) => (b.composetime || '').localeCompare(a.composetime || ''));

    return results.slice(0, limit).map(m => ({
      ...m,
      composetime: toEastern(m.composetime),
      content: stripHtml(m.content || ''),
      contentCompact: stripHtml(m.content || '', { compact: true, maxLength: 300 })
    }));
  }

  async getConversationContext(threadId) {
    await this.ensureLoaded();
    const conv = this._threadIndex.get(threadId);

    const messages = this.messages.filter(m =>
      (m.conversationId || m.conversationid || m.id || '') === threadId
    );

    messages.sort((a, b) => (a.composetime || '').localeCompare(b.composetime || ''));

    return {
      conversation: conv || null,
      messageCount: messages.length,
      messages: messages.map(m => ({
        ...m,
        composetime: toEastern(m.composetime),
        content: stripHtml(m.content || '')
      }))
    };
  }

  async getPeople({ keyword, limit = 50 } = {}) {
    await this.ensureLoaded();
    let results = Array.from(this._personIndex.values());

    if (keyword) {
      const kw = keyword.toLowerCase();
      results = results.filter(c => {
        const haystack = [c.imdisplayname, c.displayName, c.email, c.mri, c.sipAddress]
          .filter(Boolean).join(' ').toLowerCase();
        return haystack.includes(kw);
      });
    }

    return results.slice(0, limit);
  }

  async getPersonActivity(name) {
    await this.ensureLoaded();
    const n = name.toLowerCase();

    const contact = Array.from(this._personIndex.values()).find(c =>
      (c.imdisplayname || '').toLowerCase().includes(n) ||
      (c.displayName || '').toLowerCase().includes(n)
    );

    const messages = this.messages.filter(m =>
      (m.imdisplayname || '').toLowerCase().includes(n) ||
      (m.fromDisplayNameInToken || '').toLowerCase().includes(n) ||
      (m.from || '').toLowerCase().includes(n) ||
      (m.creator || '').toLowerCase().includes(n)
    );

    messages.sort((a, b) => (b.composetime || '').localeCompare(a.composetime || ''));

    const threadIds = new Set();
    for (const m of messages) {
      const tid = m.conversationId || m.conversationid;
      if (tid) threadIds.add(tid);
    }

    const relatedConversations = this.conversations.filter(c => {
      const id = c.id || c.conversationId;
      if (id && threadIds.has(id)) return true;
      // Also match by name appearing in conversation data
      const text = JSON.stringify(c).toLowerCase();
      return text.includes(n);
    });

    return {
      contact: contact || null,
      messageCount: messages.length,
      conversationCount: relatedConversations.length,
      messages: messages.map(m => ({
        ...m,
        composetime: toEastern(m.composetime),
        content: stripHtml(m.content || ''),
        contentCompact: stripHtml(m.content || '', { compact: true, maxLength: 300 })
      })),
      conversations: relatedConversations.slice(0, 20)
    };
  }
}
