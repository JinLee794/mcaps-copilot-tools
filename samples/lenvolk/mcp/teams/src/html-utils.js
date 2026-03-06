// HTML stripping and content cleaning for Teams message bodies

const ENTITY_MAP = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&#39;': "'", '&apos;': "'", '&nbsp;': ' ', '&#160;': ' '
};

const ENTITY_RE = /&(?:amp|lt|gt|quot|apos|nbsp|#\d{1,5}|#x[0-9a-fA-F]{1,4});/g;

function decodeEntities(text) {
  return text.replace(ENTITY_RE, match => {
    if (ENTITY_MAP[match]) return ENTITY_MAP[match];
    if (match.startsWith('&#x')) return String.fromCodePoint(parseInt(match.slice(3, -1), 16));
    if (match.startsWith('&#')) return String.fromCodePoint(parseInt(match.slice(2, -1), 10));
    return match;
  });
}

/**
 * Strip HTML tags and clean message content.
 * @param {string} html - Raw HTML content
 * @param {{ compact?: boolean, maxLength?: number }} options
 * @returns {string} Cleaned plain text
 */
export function stripHtml(html, { compact = false, maxLength = 0 } = {}) {
  if (!html || typeof html !== 'string') return '';

  let text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]*>/g, '');

  text = decodeEntities(text);
  text = text.replace(/[ \t]+/g, ' ');
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.trim();

  if (compact) {
    text = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  }

  if (maxLength > 0 && text.length > maxLength) {
    text = text.slice(0, maxLength) + '…';
  }

  return text;
}
