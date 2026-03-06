// Input validation for Outlook MCP server
// Sanitizes email addresses, account names, keywords, and date ranges

// Basic RFC 5322 email check — rejects obviously invalid addresses
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate a single email address format.
 * @param {string} email
 * @returns {{ valid: boolean, reason?: string }}
 */
export function validateEmail(email) {
  if (typeof email !== 'string') return { valid: false, reason: 'Email must be a string' };
  const trimmed = email.trim();
  if (trimmed.length === 0) return { valid: false, reason: 'Email cannot be empty' };
  if (trimmed.length > 254) return { valid: false, reason: 'Email exceeds maximum length (254)' };
  if (!EMAIL_REGEX.test(trimmed)) return { valid: false, reason: `Invalid email format: ${trimmed}` };
  return { valid: true };
}

/**
 * Validate an array of email addresses. Returns first invalid or { valid: true, emails: trimmed[] }.
 * @param {string[]} emails
 * @returns {{ valid: boolean, emails?: string[], reason?: string }}
 */
export function validateEmails(emails) {
  if (!Array.isArray(emails)) return { valid: false, reason: 'Emails must be an array' };
  if (emails.length === 0) return { valid: false, reason: 'At least one email is required' };
  if (emails.length > 100) return { valid: false, reason: 'Too many email addresses (max 100)' };
  const trimmed = [];
  for (const e of emails) {
    const result = validateEmail(e);
    if (!result.valid) return result;
    trimmed.push(e.trim());
  }
  return { valid: true, emails: trimmed };
}

/**
 * Validate and sanitize an account name.
 * Must be non-empty, no shell metacharacters (execFile handles this, but defense-in-depth).
 * @param {string} name
 * @returns {{ valid: boolean, name?: string, reason?: string }}
 */
export function validateAccountName(name) {
  if (typeof name !== 'string') return { valid: false, reason: 'Account name must be a string' };
  const trimmed = name.trim();
  if (trimmed.length === 0) return { valid: false, reason: 'Account name cannot be empty' };
  if (trimmed.length > 200) return { valid: false, reason: 'Account name too long (max 200)' };
  // Reject shell metacharacters as defense-in-depth (execFile prevents injection, but sanitize anyway)
  // Allow & (common in company names like AT&T) — it goes into JSON, not shell args
  if (/[;|`$(){}[\]<>!\\]/.test(trimmed)) {
    return { valid: false, reason: 'Account name contains disallowed characters' };
  }
  return { valid: true, name: trimmed };
}

/**
 * Validate daysBack range.
 * @param {number} daysBack
 * @returns {{ valid: boolean, reason?: string }}
 */
export function validateDaysBack(daysBack) {
  if (typeof daysBack !== 'number' || !Number.isInteger(daysBack)) {
    return { valid: false, reason: 'daysBack must be an integer' };
  }
  if (daysBack < 1 || daysBack > 365) {
    return { valid: false, reason: 'daysBack must be between 1 and 365' };
  }
  return { valid: true };
}

/**
 * Validate keywords array.
 * @param {string[]} keywords
 * @returns {{ valid: boolean, keywords?: string[], reason?: string }}
 */
export function validateKeywords(keywords) {
  if (!Array.isArray(keywords)) return { valid: false, reason: 'Keywords must be an array' };
  if (keywords.length > 20) return { valid: false, reason: 'Too many keywords (max 20)' };
  const sanitized = [];
  for (const kw of keywords) {
    if (typeof kw !== 'string') return { valid: false, reason: 'Each keyword must be a string' };
    const trimmed = kw.trim();
    if (trimmed.length === 0) continue; // skip empties
    if (trimmed.length > 100) return { valid: false, reason: `Keyword too long (max 100): ${trimmed.slice(0, 20)}...` };
    sanitized.push(trimmed);
  }
  return { valid: true, keywords: sanitized };
}

/**
 * Validate a batch search input array.
 * @param {Array} specs - array of { account, contacts, keywords?, daysBack? }
 * @returns {{ valid: boolean, reason?: string }}
 */
export function validateBatchSearchInput(specs) {
  if (!Array.isArray(specs)) return { valid: false, reason: 'Batch input must be an array' };
  if (specs.length === 0) return { valid: false, reason: 'Batch input cannot be empty' };
  if (specs.length > 50) return { valid: false, reason: 'Too many accounts in batch (max 50)' };
  for (let i = 0; i < specs.length; i++) {
    const spec = specs[i];
    const acctResult = validateAccountName(spec.account);
    if (!acctResult.valid) return { valid: false, reason: `Account [${i}]: ${acctResult.reason}` };
    const emailResult = validateEmails(spec.contacts);
    if (!emailResult.valid) return { valid: false, reason: `Account [${i}] contacts: ${emailResult.reason}` };
    if (spec.keywords != null) {
      const kwResult = validateKeywords(spec.keywords);
      if (!kwResult.valid) return { valid: false, reason: `Account [${i}] keywords: ${kwResult.reason}` };
    }
    if (spec.daysBack != null) {
      const dbResult = validateDaysBack(spec.daysBack);
      if (!dbResult.valid) return { valid: false, reason: `Account [${i}] daysBack: ${dbResult.reason}` };
    }
  }
  return { valid: true };
}

/**
 * Validate a batch draft input array.
 * @param {Array} specs - array of { account, to, cc?, bcc?, subject, body, bodyType? }
 * @returns {{ valid: boolean, reason?: string }}
 */
export function validateBatchDraftInput(specs) {
  if (!Array.isArray(specs)) return { valid: false, reason: 'Batch input must be an array' };
  if (specs.length === 0) return { valid: false, reason: 'Batch input cannot be empty' };
  if (specs.length > 50) return { valid: false, reason: 'Too many drafts in batch (max 50)' };
  for (let i = 0; i < specs.length; i++) {
    const spec = specs[i];
    const acctResult = validateAccountName(spec.account);
    if (!acctResult.valid) return { valid: false, reason: `Draft [${i}]: ${acctResult.reason}` };
    const toResult = validateEmails(spec.to);
    if (!toResult.valid) return { valid: false, reason: `Draft [${i}] to: ${toResult.reason}` };
    if (spec.cc != null) {
      const ccResult = validateEmails(spec.cc);
      if (!ccResult.valid) return { valid: false, reason: `Draft [${i}] cc: ${ccResult.reason}` };
    }
    if (spec.bcc != null) {
      const bccResult = validateEmails(spec.bcc);
      if (!bccResult.valid) return { valid: false, reason: `Draft [${i}] bcc: ${bccResult.reason}` };
    }
    if (typeof spec.subject !== 'string' || spec.subject.trim().length === 0) {
      return { valid: false, reason: `Draft [${i}]: subject is required` };
    }
    if (typeof spec.body !== 'string' || spec.body.trim().length === 0) {
      return { valid: false, reason: `Draft [${i}]: body is required` };
    }
    if (spec.bodyType != null && !['HTML', 'Text'].includes(spec.bodyType)) {
      return { valid: false, reason: `Draft [${i}]: bodyType must be "HTML" or "Text"` };
    }
  }
  return { valid: true };
}

/**
 * Validate subject line (for single draft).
 * @param {string} subject
 * @returns {{ valid: boolean, reason?: string }}
 */
export function validateSubject(subject) {
  if (typeof subject !== 'string') return { valid: false, reason: 'Subject must be a string' };
  if (subject.trim().length === 0) return { valid: false, reason: 'Subject cannot be empty' };
  if (subject.length > 998) return { valid: false, reason: 'Subject too long (max 998 chars per RFC 2822)' };
  return { valid: true };
}

/**
 * Validate daysForward / daysBack for calendar searches (0-365).
 * @param {number} days
 * @returns {{ valid: boolean, reason?: string }}
 */
export function validateDaysForward(days) {
  if (typeof days !== 'number' || !Number.isInteger(days)) {
    return { valid: false, reason: 'Days must be an integer' };
  }
  if (days < 0 || days > 365) {
    return { valid: false, reason: 'Days must be between 0 and 365' };
  }
  return { valid: true };
}

/**
 * Validate maxResults for calendar searches (1-200).
 * @param {number} max
 * @returns {{ valid: boolean, reason?: string }}
 */
export function validateMaxResults(max) {
  if (typeof max !== 'number' || !Number.isInteger(max)) {
    return { valid: false, reason: 'maxResults must be an integer' };
  }
  if (max < 1 || max > 200) {
    return { valid: false, reason: 'maxResults must be between 1 and 200' };
  }
  return { valid: true };
}
