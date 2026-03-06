// Read all LevelDB cache files and parse into structured records
// Handles SSTable format with Snappy compression + WAL .log files
// Processes files one at a time to keep memory bounded

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import snappy from 'snappyjs';
import { extractFieldPairs, groupIntoRecords, classifyRecords } from './record-parser.js';

// ── SSTable parsing primitives ────────────────────────────────

/** Read a LEB128-encoded varint64 from buffer at position. */
function readVarint64(buf, pos) {
  let result = 0, shift = 0;
  while (pos < buf.length && shift < 64) {
    const byte = buf[pos++];
    result += (byte & 0x7f) * Math.pow(2, shift);
    if (!(byte & 0x80)) return [result, pos];
    shift += 7;
  }
  return [-1, pos];
}

/**
 * Parse an SSTable (.ldb) file and return decompressed data block buffers.
 * SSTable layout: [data blocks...] [meta block] [metaindex block] [index block] [footer(48B)]
 * Footer (last 48 bytes): metaindex_handle + index_handle + padding + magic
 */
function parseSSTableBlocks(buf) {
  if (buf.length < 48) return [];

  // Read footer — last 48 bytes
  const footerStart = buf.length - 48;
  // Skip metaindex handle (2 varints)
  let [, p1] = readVarint64(buf, footerStart);
  let [, p2] = readVarint64(buf, p1);
  // Read index block handle
  let [indexOffset, p3] = readVarint64(buf, p2);
  let [indexSize,] = readVarint64(buf, p3);

  if (indexOffset < 0 || indexSize < 0 || indexOffset + indexSize + 5 > buf.length) return [];

  // Decompress index block (type byte follows the block data)
  let indexData;
  try {
    const typeByte = buf[indexOffset + indexSize];
    indexData = typeByte === 1
      ? Buffer.from(snappy.uncompress(buf.slice(indexOffset, indexOffset + indexSize)))
      : buf.slice(indexOffset, indexOffset + indexSize);
  } catch {
    return [];
  }

  // Parse index entries to get data block handles
  // Index block has restart-point trailer: last 4 bytes = number of restarts
  const restartCount = indexData.readUInt32LE(indexData.length - 4);
  const entriesEnd = indexData.length - 4 - (restartCount * 4);

  const handles = [];
  let pos = 0;
  while (pos < entriesEnd) {
    // Each entry: shared_prefix_len(varint) + unshared_len(varint) + value_len(varint) + key_delta + value
    let [shared, p5] = readVarint64(indexData, pos);
    let [unshared, p6] = readVarint64(indexData, p5);
    let [valueLen, p7] = readVarint64(indexData, p6);
    if (shared < 0 || unshared < 0 || valueLen < 0) break;

    const keyEnd = p7 + unshared;
    if (keyEnd > indexData.length) break;

    // Value is a BlockHandle: offset(varint) + size(varint)
    let [blockOffset, p8] = readVarint64(indexData, keyEnd);
    let [blockSize,] = readVarint64(indexData, p8);
    if (blockOffset >= 0 && blockSize >= 0 && blockOffset + blockSize + 5 <= buf.length) {
      handles.push({ offset: blockOffset, size: blockSize });
    }

    pos = keyEnd + valueLen;
  }

  return handles;
}

/**
 * Decompress a single data block using its handle.
 * Each block is followed by a type byte (0=raw, 1=Snappy) and 4-byte CRC.
 */
function decompressBlock(buf, handle) {
  try {
    const typeByte = buf[handle.offset + handle.size];
    if (typeByte === 1) {
      return Buffer.from(snappy.uncompress(buf.slice(handle.offset, handle.offset + handle.size)));
    }
    return buf.slice(handle.offset, handle.offset + handle.size);
  } catch {
    return null;
  }
}

/**
 * Process a single .ldb (SSTable) file: parse structure, decompress blocks,
 * extract and group records per-block to avoid cross-block position collision.
 * Returns { messages, conversations, contacts } arrays.
 */
function processSSTable(buf) {
  const handles = parseSSTableBlocks(buf);
  const allMessages = [];
  const allConversations = [];
  const allContacts = [];

  for (const h of handles) {
    const blockData = decompressBlock(buf, h);
    if (!blockData || blockData.length === 0) continue;

    const pairs = extractFieldPairs(blockData);
    if (pairs.length === 0) continue;

    // Group and classify per-block so positions don't collide across blocks
    const records = groupIntoRecords(pairs);
    const { messages, conversations, contacts } = classifyRecords(records);
    allMessages.push(...messages);
    allConversations.push(...conversations);
    allContacts.push(...contacts);
  }

  return { messages: allMessages, conversations: allConversations, contacts: allContacts };
}

/**
 * Process a .log (WAL) file: not SSTable format, just raw records.
 * WAL files are small and uncompressed — direct V8 extraction works.
 */
function processWAL(buf) {
  const pairs = extractFieldPairs(buf);
  if (pairs.length === 0) return { messages: [], conversations: [], contacts: [] };
  const records = groupIntoRecords(pairs);
  return classifyRecords(records);
}

/**
 * Read and parse all LevelDB cache files from the given directory.
 * .ldb files use SSTable format with Snappy compression.
 * .log files are WAL (write-ahead log) with raw uncompressed data.
 *
 * @param {string} cachePath - Path to the LevelDB directory
 * @returns {{ messages: Array, conversations: Array, contacts: Array }}
 */
export async function readCacheFiles(cachePath) {
  const entries = await readdir(cachePath);
  const dataFiles = entries.filter(f => f.endsWith('.ldb') || f.endsWith('.log'));

  const allMessages = [];
  const allConversations = [];
  const allContacts = [];

  for (const file of dataFiles) {
    const filePath = join(cachePath, file);
    let buf;
    try {
      buf = await readFile(filePath);
    } catch (err) {
      // File may be locked by Teams or rotated by LevelDB compaction — skip gracefully
      if (['EBUSY', 'EACCES', 'EPERM', 'ENOENT'].includes(err.code)) {
        console.error(`[teams-cache] Skipping unavailable file (${err.code}): ${file}`);
        continue;
      }
      throw err;
    }

    if (buf.length === 0) continue;

    // SSTable (.ldb) requires structural parsing + Snappy decompression
    // WAL (.log) is raw uncompressed data
    const { messages, conversations, contacts } = file.endsWith('.ldb')
      ? processSSTable(buf) : processWAL(buf);

    allMessages.push(...messages);
    allConversations.push(...conversations);
    allContacts.push(...contacts);
  }

  return {
    messages: deduplicateMessages(allMessages),
    conversations: deduplicateConversations(allConversations),
    contacts: deduplicateContacts(allContacts)
  };
}

// Export for testing
export { parseSSTableBlocks, decompressBlock, readVarint64 };

// ── Deduplication ─────────────────────────────────────────────

function deduplicateMessages(messages) {
  const seen = new Map();
  for (const msg of messages) {
    const key = msg.clientmessageid ||
      (msg.composetime + '|' + (msg.imdisplayname || '') + '|' + (msg.content || '').slice(0, 80));

    const existing = seen.get(key);
    if (!existing || (msg.content && msg.content.length > (existing.content || '').length)) {
      seen.set(key, msg);
    }
  }
  return Array.from(seen.values());
}

function deduplicateConversations(convs) {
  const seen = new Map();
  for (const conv of convs) {
    const key = conv.id || conv.conversationId || conv.topic || JSON.stringify(conv);
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, conv);
    } else {
      // Merge: fill in missing fields from duplicate
      for (const [k, v] of Object.entries(conv)) {
        if (!existing[k]) existing[k] = v;
      }
    }
  }
  return Array.from(seen.values());
}

function deduplicateContacts(contacts) {
  const seen = new Map();
  for (const c of contacts) {
    const key = (c.imdisplayname || c.displayName || c.mri || '').toLowerCase();
    if (!key) continue;
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, c);
    } else {
      for (const [k, v] of Object.entries(c)) {
        if (!existing[k]) existing[k] = v;
      }
    }
  }
  return Array.from(seen.values());
}
