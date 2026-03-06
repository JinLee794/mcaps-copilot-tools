// V8 structured serialization binary parser for Teams IndexedDB cache
// Extracts field-value pairs from raw LevelDB .ldb and .log files
// Format: V8 OneByteString = 0x22 + LEB128(length) + UTF-8 bytes

// ── Varint / V8 string primitives ─────────────────────────────

/**
 * Read a LEB128 varint from buffer at offset.
 * @returns {[number, number]} [value, newOffset] or [-1, offset] on failure
 */
export function readVarint(buf, pos) {
  let result = 0;
  let shift = 0;
  while (pos < buf.length) {
    const b = buf[pos++];
    result |= (b & 0x7F) << shift;
    if (!(b & 0x80)) return [result, pos];
    shift += 7;
    if (shift > 35) return [-1, pos];
  }
  return [-1, pos];
}

/**
 * Read a V8 OneByteString at position.
 * Expects 0x22 tag, then varint length, then UTF-8 bytes.
 * @returns {[string|null, number]} [string, newOffset] or [null, originalPos]
 */
export function readV8String(buf, pos) {
  if (pos >= buf.length || buf[pos] !== 0x22) return [null, pos];
  const [len, afterLen] = readVarint(buf, pos + 1);
  if (len < 0 || len > 200000 || afterLen + len > buf.length) return [null, pos];
  const str = buf.toString('utf8', afterLen, afterLen + len);
  return [str, afterLen + len];
}

// ── Known field names and fast-lookup structures ──────────────

const KNOWN_FIELDS = new Set([
  // Message fields
  'content', 'composetime', 'messagetype', 'imdisplayname',
  'clientmessageid', 'originalarrivaltime', 'originalArrivalTime',
  'isRead', 'importance', 'subject', 'contentType',
  // Newer message sender fields (Teams v2 uses these instead of imdisplayname)
  'fromDisplayNameInToken', 'fromGivenNameInToken', 'fromFamilyNameInToken',
  'creator', 'imDisplayName',
  // Conversation fields
  'topic', 'threadtype', 'threadType', 'lastMessage', 'createdTime',
  'conversationId', 'conversationid',
  // Contact fields
  'displayName', 'sipAddress', 'mri',
  // Shared fields
  'id', 'from', 'version', 'tenantId', 'organizerId',
  'conversationLink', 'email', 'type'
]);

// Set of byte-lengths of known field names for fast pre-filtering
const KNOWN_LENGTHS = new Set();
for (const name of KNOWN_FIELDS) {
  KNOWN_LENGTHS.add(Buffer.byteLength(name, 'utf8'));
}

// ── Text quality heuristic ────────────────────────────────────

/**
 * Check if a string looks like reasonable text (not binary garbage).
 */
function isReasonableText(str) {
  if (!str || str.length === 0) return false;
  const checkLen = Math.min(str.length, 200);
  let printable = 0;
  for (let i = 0; i < checkLen; i++) {
    const c = str.charCodeAt(i);
    // ASCII printable, common whitespace, or extended Unicode
    if ((c >= 32 && c <= 126) || c === 10 || c === 13 || c === 9 || c > 160) {
      printable++;
    }
  }
  return printable / checkLen > 0.5;
}

// ── Single-pass field extraction ──────────────────────────────

/**
 * Scan a buffer and extract all (fieldName, value, position) triples
 * where fieldName is in KNOWN_FIELDS and value is a readable V8 string.
 *
 * Algorithm: scan for 0x22 bytes → quick-check length byte against
 * KNOWN_LENGTHS → compare full field name → read following value.
 *
 * @param {Buffer} buf
 * @returns {Array<{ name: string, value: string, pos: number }>}
 */
// V8 serialization type tags (non-string values)
const V8_UNDEFINED = 0x5f; // '_'
const V8_NULL      = 0x30; // '0'
const V8_TRUE      = 0x54; // 'T'
const V8_FALSE     = 0x46; // 'F'
const V8_INT       = 0x49; // 'I' + zigzag varint
const V8_DOUBLE    = 0x4e; // 'N' + 8 bytes IEEE 754

/**
 * Try to read a V8 value at position. Handles strings, numbers, booleans, undefined, null.
 * Returns [value, newOffset] or [null, pos] if no valid value found.
 */
function readV8Value(buf, pos) {
  if (pos >= buf.length) return [null, pos];
  const tag = buf[pos];

  // OneByteString
  if (tag === 0x22) {
    const [sLen, afterLen] = readVarint(buf, pos + 1);
    if (sLen < 0 || sLen > 200000 || afterLen + sLen > buf.length) return [null, pos];
    const str = buf.toString('utf8', afterLen, afterLen + sLen);
    return isReasonableText(str) || sLen === 0 ? [str, afterLen + sLen] : [null, pos];
  }
  // Double (IEEE 754, 8 bytes)
  if (tag === V8_DOUBLE && pos + 9 <= buf.length) {
    return [buf.readDoubleLE(pos + 1), pos + 9];
  }
  // Integer (zigzag varint)
  if (tag === V8_INT) {
    const [raw, afterVi] = readVarint(buf, pos + 1);
    if (raw < 0) return [null, pos];
    // zigzag decode
    const val = (raw >>> 1) ^ -(raw & 1);
    return [val, afterVi];
  }
  // Boolean / null / undefined
  if (tag === V8_TRUE) return [true, pos + 1];
  if (tag === V8_FALSE) return [false, pos + 1];
  if (tag === V8_NULL) return [null, pos + 1];
  if (tag === V8_UNDEFINED) return [undefined, pos + 1];

  return [null, pos];
}

export function extractFieldPairs(buf) {
  const pairs = [];
  const len = buf.length;

  for (let i = 0; i < len - 3; i++) {
    if (buf[i] !== 0x22) continue;

    const lenByte = buf[i + 1];

    // Quick filter: all our field names are < 128 bytes, so varint is one byte.
    // If high bit is set, it's a multi-byte varint → not a known field name.
    if (lenByte > 0x7F || lenByte === 0) continue;
    if (!KNOWN_LENGTHS.has(lenByte)) continue;

    // Bounds check
    const nameEnd = i + 2 + lenByte;
    if (nameEnd > len) continue;

    // Read the field name and check against known set
    const fieldName = buf.toString('utf8', i + 2, nameEnd);
    if (!KNOWN_FIELDS.has(fieldName)) continue;

    // Read the value directly after the field name using V8 type-aware reader
    const [val, afterVal] = readV8Value(buf, nameEnd);

    if (val !== null && val !== undefined) {
      // Convert non-string values to strings for record storage
      const strVal = typeof val === 'string' ? val : String(val);
      if (strVal.length > 0) {
        pairs.push({ name: fieldName, value: strVal, pos: i });
      }
    }

    // Skip past the field name to avoid re-scanning its bytes
    i = nameEnd - 1;
  }

  return pairs;
}

// ── Record grouping ───────────────────────────────────────────

const PROXIMITY_THRESHOLD = 4096; // 4 KB — fields within this range are one record

/**
 * Group extracted field pairs into records based on byte proximity.
 * Starts a new record when gap exceeds threshold or a duplicate field appears.
 *
 * @param {Array<{ name: string, value: string, pos: number }>} pairs
 * @returns {Array<Record<string, string>>}
 */
export function groupIntoRecords(pairs) {
  if (pairs.length === 0) return [];

  pairs.sort((a, b) => a.pos - b.pos);

  const records = [];
  let current = new Map();
  let maxPos = pairs[0].pos;
  current.set(pairs[0].name, pairs[0].value);

  for (let i = 1; i < pairs.length; i++) {
    const { name, value, pos } = pairs[i];

    if (pos - maxPos > PROXIMITY_THRESHOLD || current.has(name)) {
      records.push(Object.fromEntries(current));
      current = new Map();
    }

    current.set(name, value);
    maxPos = pos;
  }

  if (current.size > 0) {
    records.push(Object.fromEntries(current));
  }

  return records;
}

// ── Record classification ─────────────────────────────────────

const ISO_DATE_PREFIX = /^\d{4}-\d{2}-\d{2}/;
const THREAD_ID_RE = /^19:[a-f0-9_-]+@/;
const EPOCH_MS_RE = /^\d{13}$/; // 13-digit millisecond timestamps

/**
 * Synthesize composetime from available timestamp sources.
 * Teams v2 stores timestamps as numeric doubles (originalArrivalTime)
 * or embeds them in the message id field (13-digit ms since epoch).
 */
function synthesizeComposetime(rec) {
  // Already has ISO composetime
  if (rec.composetime && ISO_DATE_PREFIX.test(rec.composetime)) return;

  // Try originalArrivalTime (stored as numeric string from V8 double)
  const oat = rec.originalarrivaltime || rec.originalArrivalTime;
  if (oat) {
    const ts = Number(oat);
    if (ts > 1e12 && ts < 2e12) {
      rec.composetime = new Date(ts).toISOString();
      return;
    }
  }

  // Try id field (Teams message IDs are ms timestamps)
  if (rec.id && EPOCH_MS_RE.test(rec.id)) {
    const ts = Number(rec.id);
    if (ts > 1e12 && ts < 2e12) {
      rec.composetime = new Date(ts).toISOString();
      return;
    }
  }

  // Try version field (also ms timestamp)
  if (rec.version && EPOCH_MS_RE.test(rec.version)) {
    const ts = Number(rec.version);
    if (ts > 1e12 && ts < 2e12) {
      rec.composetime = new Date(ts).toISOString();
      return;
    }
  }
}

/**
 * Normalize sender display name: copy fromDisplayNameInToken to imdisplayname
 * if imdisplayname is missing (newer Teams v2 format).
 */
function normalizeSender(rec) {
  if (!rec.imdisplayname && rec.fromDisplayNameInToken) {
    rec.imdisplayname = rec.fromDisplayNameInToken;
  }
}

/**
 * Classify raw records into messages, conversations, and contacts.
 */
export function classifyRecords(records) {
  const messages = [];
  const conversations = [];
  const contacts = [];

  for (const rec of records) {
    // Message: has type=Message, or composetime with ISO date
    const isMessage = rec.type === 'Message' ||
      (rec.composetime && ISO_DATE_PREFIX.test(rec.composetime));

    if (isMessage) {
      synthesizeComposetime(rec);
      normalizeSender(rec);
      messages.push(rec);
    }
    // Conversation: has threadtype/threadType or an id matching thread pattern
    else if (
      rec.threadtype || rec.threadType ||
      (rec.id && THREAD_ID_RE.test(rec.id)) ||
      (rec.conversationId && THREAD_ID_RE.test(rec.conversationId))
    ) {
      conversations.push(rec);
    }
    // Contact: has display name fields
    else if (rec.imdisplayname || rec.displayName || rec.fromDisplayNameInToken) {
      contacts.push(rec);
    }
  }

  return { messages, conversations, contacts };
}
