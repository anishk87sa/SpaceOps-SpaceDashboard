/**
 * Safe local storage utility to prevent JSON parse exceptions,
 * handle corrupted keys like "[object Object]", and manage favorites/preferences.
 */

export function safeGetJson(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw || typeof raw !== 'string') return fallback;
    const trimmed = raw.trim();
    if (trimmed === '[object Object]' || trimmed === 'undefined' || trimmed === 'null' || trimmed === '') {
      try {
        localStorage.removeItem(key);
      } catch {}
      return fallback;
    }
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      return fallback;
    }
    return JSON.parse(trimmed);
  } catch (err) {
    console.warn(`[storage] Cleared invalid JSON key "${key}":`, err?.message);
    try {
      localStorage.removeItem(key);
    } catch {}
    return fallback;
  }
}

export function safeSetJson(key, value) {
  try {
    if (value === undefined) {
      localStorage.removeItem(key);
      return;
    }
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (err) {
    console.warn(`[storage] Failed to write key "${key}":`, err?.message);
  }
}

export function getLocalBookmarks() {
  const primary = safeGetJson('spaceops_bookmarks', null);
  if (Array.isArray(primary)) return primary;
  const legacy = safeGetJson('orbitron_bookmarks', null);
  if (Array.isArray(legacy)) {
    // Migrate to spaceops_bookmarks
    safeSetJson('spaceops_bookmarks', legacy);
    try {
      localStorage.removeItem('orbitron_bookmarks');
    } catch {}
    return legacy;
  }
  return [];
}

export function setLocalBookmarks(bookmarks) {
  safeSetJson('spaceops_bookmarks', Array.isArray(bookmarks) ? bookmarks : []);
}
