// Tests for the V8 binary record parser

import { describe, it, expect } from 'vitest';
import {
  readVarint,
  readV8String,
  extractFieldPairs,
  groupIntoRecords,
  classifyRecords
} from '../record-parser.js';

// ── Helper: build a V8 OneByteString buffer (0x22 + varint + bytes) ──

function v8str(str) {
  const bytes = Buffer.from(str, 'utf8');
  const len = bytes.length;
  const varint = [];
  let v = len;
  while (v > 0x7F) { varint.push((v & 0x7F) | 0x80); v >>>= 7; }
  varint.push(v & 0x7F);
  return Buffer.concat([Buffer.from([0x22, ...varint]), bytes]);
}

function fieldValue(name, value) {
  return Buffer.concat([v8str(name), v8str(value)]);
}

// ── readVarint ────────────────────────────────────────────────

describe('readVarint', () => {
  it('reads single-byte values (0–127)', () => {
    expect(readVarint(Buffer.from([0x00]), 0)).toEqual([0, 1]);
    expect(readVarint(Buffer.from([0x07]), 0)).toEqual([7, 1]);
    expect(readVarint(Buffer.from([0x7F]), 0)).toEqual([127, 1]);
  });

  it('reads multi-byte varint (128)', () => {
    // 128 = 0x80 0x01
    expect(readVarint(Buffer.from([0x80, 0x01]), 0)).toEqual([128, 2]);
  });

  it('reads multi-byte varint (300)', () => {
    // 300 = 0xAC 0x02
    expect(readVarint(Buffer.from([0xAC, 0x02]), 0)).toEqual([300, 2]);
  });

  it('reads from offset', () => {
    const buf = Buffer.from([0xFF, 0xFF, 0x0B]);
    expect(readVarint(buf, 2)).toEqual([11, 3]);
  });

  it('returns -1 on empty buffer', () => {
    expect(readVarint(Buffer.alloc(0), 0)).toEqual([-1, 0]);
  });
});

// ── readV8String ──────────────────────────────────────────────

describe('readV8String', () => {
  it('reads "hello"', () => {
    const buf = v8str('hello');
    expect(readV8String(buf, 0)).toEqual(['hello', 7]);
  });

  it('reads empty string', () => {
    const buf = Buffer.from([0x22, 0x00]);
    expect(readV8String(buf, 0)).toEqual(['', 2]);
  });

  it('returns null for non-0x22 tag', () => {
    const buf = Buffer.from([0x00, 0x05, 0x68, 0x65, 0x6c, 0x6c, 0x6f]);
    expect(readV8String(buf, 0)).toEqual([null, 0]);
  });

  it('returns null when buffer too short', () => {
    const buf = Buffer.from([0x22, 0x0A, 0x68]); // claims 10 bytes, only 1
    expect(readV8String(buf, 0)).toEqual([null, 0]);
  });

  it('reads from offset', () => {
    const padding = Buffer.alloc(10);
    const str = v8str('world');
    const buf = Buffer.concat([padding, str]);
    expect(readV8String(buf, 10)).toEqual(['world', 17]);
  });
});

// ── extractFieldPairs ─────────────────────────────────────────

describe('extractFieldPairs', () => {
  it('extracts composetime field', () => {
    const fv = fieldValue('composetime', '2024-01-15T10:30:00.000Z');
    const buf = Buffer.concat([Buffer.alloc(50), fv, Buffer.alloc(50)]);

    const pairs = extractFieldPairs(buf);
    const ct = pairs.find(p => p.name === 'composetime');
    expect(ct).toBeDefined();
    expect(ct.value).toBe('2024-01-15T10:30:00.000Z');
  });

  it('extracts imdisplayname field', () => {
    const fv = fieldValue('imdisplayname', 'Jin Lee (HLS US SE)');
    const buf = Buffer.concat([Buffer.alloc(20), fv, Buffer.alloc(20)]);

    const pairs = extractFieldPairs(buf);
    const dn = pairs.find(p => p.name === 'imdisplayname');
    expect(dn).toBeDefined();
    expect(dn.value).toBe('Jin Lee (HLS US SE)');
  });

  it('extracts content field with HTML', () => {
    const html = '<div><p>Hello world &amp; welcome</p></div>';
    const fv = fieldValue('content', html);
    const buf = Buffer.concat([Buffer.alloc(10), fv, Buffer.alloc(10)]);

    const pairs = extractFieldPairs(buf);
    const c = pairs.find(p => p.name === 'content');
    expect(c).toBeDefined();
    expect(c.value).toBe(html);
  });

  it('extracts multiple fields from same buffer', () => {
    const buf = Buffer.concat([
      Buffer.alloc(10),
      fieldValue('composetime', '2024-03-01T09:00:00Z'),
      fieldValue('imdisplayname', 'Alice Smith'),
      fieldValue('content', 'Hello team!'),
      Buffer.alloc(10)
    ]);

    const pairs = extractFieldPairs(buf);
    expect(pairs.length).toBeGreaterThanOrEqual(3);
    expect(pairs.find(p => p.name === 'composetime').value).toBe('2024-03-01T09:00:00Z');
    expect(pairs.find(p => p.name === 'imdisplayname').value).toBe('Alice Smith');
    expect(pairs.find(p => p.name === 'content').value).toBe('Hello team!');
  });

  it('returns empty array for buffer with no known fields', () => {
    const buf = Buffer.alloc(1000);
    expect(extractFieldPairs(buf)).toEqual([]);
  });
});

// ── groupIntoRecords ──────────────────────────────────────────

describe('groupIntoRecords', () => {
  it('groups adjacent pairs into one record', () => {
    const pairs = [
      { name: 'composetime', value: '2024-01-01T00:00:00Z', pos: 100 },
      { name: 'imdisplayname', value: 'Bob', pos: 150 },
      { name: 'content', value: 'Hi!', pos: 200 }
    ];

    const records = groupIntoRecords(pairs);
    expect(records).toHaveLength(1);
    expect(records[0]).toEqual({
      composetime: '2024-01-01T00:00:00Z',
      imdisplayname: 'Bob',
      content: 'Hi!'
    });
  });

  it('splits records when gap exceeds threshold', () => {
    const pairs = [
      { name: 'composetime', value: '2024-01-01', pos: 100 },
      { name: 'content', value: 'msg1', pos: 200 },
      { name: 'composetime', value: '2024-02-01', pos: 10000 },
      { name: 'content', value: 'msg2', pos: 10100 }
    ];

    const records = groupIntoRecords(pairs);
    expect(records).toHaveLength(2);
    expect(records[0].content).toBe('msg1');
    expect(records[1].content).toBe('msg2');
  });

  it('splits on duplicate field name', () => {
    const pairs = [
      { name: 'composetime', value: '2024-01-01', pos: 100 },
      { name: 'composetime', value: '2024-02-01', pos: 200 }
    ];

    const records = groupIntoRecords(pairs);
    expect(records).toHaveLength(2);
  });

  it('returns empty for empty input', () => {
    expect(groupIntoRecords([])).toEqual([]);
  });
});

// ── classifyRecords ───────────────────────────────────────────

describe('classifyRecords', () => {
  it('classifies message by composetime', () => {
    const records = [{ composetime: '2024-01-15T10:30:00Z', content: 'Hello' }];
    const { messages, conversations, contacts } = classifyRecords(records);
    expect(messages).toHaveLength(1);
    expect(conversations).toHaveLength(0);
    expect(contacts).toHaveLength(0);
  });

  it('classifies conversation by threadtype', () => {
    const records = [{ threadtype: 'chat', topic: 'Project sync' }];
    const { messages, conversations, contacts } = classifyRecords(records);
    expect(messages).toHaveLength(0);
    expect(conversations).toHaveLength(1);
  });

  it('classifies conversation by thread ID pattern', () => {
    const records = [{ id: '19:abc123def456@thread.tacv2', topic: 'My Chat' }];
    const { conversations } = classifyRecords(records);
    expect(conversations).toHaveLength(1);
  });

  it('classifies contact by imdisplayname', () => {
    const records = [{ imdisplayname: 'Jin Lee', mri: '8:orgid:abc123' }];
    const { contacts } = classifyRecords(records);
    expect(contacts).toHaveLength(1);
  });

  it('ignores unrecognized records', () => {
    const records = [{ version: '1.0', type: 'unknown' }];
    const { messages, conversations, contacts } = classifyRecords(records);
    expect(messages).toHaveLength(0);
    expect(conversations).toHaveLength(0);
    expect(contacts).toHaveLength(0);
  });
});
