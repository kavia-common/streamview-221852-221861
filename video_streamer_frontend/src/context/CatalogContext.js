import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import primaryRaw from '../data/videos';
import backupRaw from '../data/backupVideos';

/**
 * PUBLIC_INTERFACE
 * CatalogContext provides a guaranteed-availability catalog of 30 YouTube kids videos.
 * - At app start, performs a YouTube oEmbed preflight to determine embed_ok for each candidate
 * - Builds a final 30-item list only including items with embed_ok === true
 * - If any primary item fails, automatically pulls from a pre-vetted backup pool until all 30 slots are filled
 * - Strict thumbnails: each item provides `thumbnail` and `altThumbnail` (sddefault/hqdefault)
 * - If both thumbnails fail at runtime, a consumer can call replaceWithBackup to swap the item out
 * - Persists the final resolved set in localStorage for stability across reloads
 * - Preserves user's top-7 ordering via sv:catalog:top7 if present; otherwise uses the primary dataset's top 7
 *
 * Exposed API:
 * - videos: Array<CatalogItem>
 * - ready: boolean indicating the catalog is available
 * - replaceWithBackup(youtubeId: string): replace a single bad item from the backup pool and persist
 * - refreshCatalog(): rebuild the catalog from scratch (oEmbed preflight)
 *
 * Storage keys:
 * - sv:oembed:<id> = { ok: boolean, exp: number }
 * - sv:catalog:final = { items: CatalogItem[], exp: number }
 * - sv:catalog:top7 = string[] of youtubeIds (ordering for lead items)
 * - sv:thumbfail:<id> = "1" if item had two failing thumbnails at runtime (advisory)
 */

// PUBLIC_INTERFACE
export const CatalogContext = createContext({
  videos: [],
  ready: false,
  replaceWithBackup: (_id) => {},
  refreshCatalog: () => {},
});

// Helpers: normalize raw dataset items into catalog format
function normalizeItem(v, idx) {
  // Ensure strict thumbnail fields exist
  // If only one URL was provided, derive an alternate using sd/hq variants
  const yt = v.youtubeId;
  const url = `https://www.youtube.com/watch?v=${yt}`;
  const primary = v.thumbnail || `https://i.ytimg.com/vi/${yt}/sddefault.jpg`;
  const alt =
    v.altThumbnail ||
    (primary.includes('/sddefault')
      ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`
      : `https://i.ytimg.com/vi/${yt}/sddefault.jpg`);

  return {
    id: yt,
    title: v.title,
    sourceType: 'youtube',
    url,
    youtubeId: yt,
    channel: v.channel || 'Official Channel',
    views: v.views || '',
    uploadedAt: v.uploadedAt || '',
    duration: v.duration || '',
    description: v.description || '',
    thumbnail: primary,
    altThumbnail: alt,
    embeddable: v.embeddable === true,
    embed_ok: false, // will be set after preflight
    _rank: idx, // keep an initial rank for deterministic fill
  };
}

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function readEmbedCache(id) {
  try {
    const raw = localStorage.getItem(`sv:oembed:${id}`);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || typeof obj.ok !== 'boolean' || !obj.exp) return null;
    if (Date.now() > obj.exp) {
      localStorage.removeItem(`sv:oembed:${id}`);
      return null;
    }
    return obj.ok;
  } catch {
    return null;
  }
}
function writeEmbedCache(id, ok) {
  try {
    const ttl = 7 * 24 * 60 * 60 * 1000; // 7 days
    const exp = Date.now() + ttl;
    localStorage.setItem(`sv:oembed:${id}`, JSON.stringify({ ok, exp }));
  } catch {
    // ignore
  }
}

async function preflightOEmbed(id, signal) {
  const cached = readEmbedCache(id);
  if (cached !== null) return cached;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 750);
    await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`,
      {
        mode: 'no-cors',
        cache: 'force-cache',
        signal: signal || controller.signal,
      }
    );
    clearTimeout(timer);
    writeEmbedCache(id, true);
    return true;
  } catch {
    writeEmbedCache(id, false);
    return false;
  }
}

function readSavedCatalog() {
  const obj = readJSON('sv:catalog:final');
  if (!obj || !obj.items || !Array.isArray(obj.items) || !obj.exp) return null;
  if (Date.now() > obj.exp) {
    try {
      localStorage.removeItem('sv:catalog:final');
    } catch {}
    return null;
  }
  return obj;
}

function persistCatalog(items) {
  try {
    const ttl = 7 * 24 * 60 * 60 * 1000;
    const exp = Date.now() + ttl;
    writeJSON('sv:catalog:final', { items, exp });
    // save top-7 ordering for next boot
    writeJSON('sv:catalog:top7', items.slice(0, 7).map((i) => i.youtubeId));
  } catch {
    // ignore
  }
}

export function CatalogProvider({ children }) {
  const primary = useMemo(
    () => (Array.isArray(primaryRaw) ? primaryRaw.map(normalizeItem) : []),
    []
  );
  const backup = useMemo(
    () => (Array.isArray(backupRaw) ? backupRaw.map(normalizeItem) : []),
    []
  );

  const [videos, setVideos] = useState([]);
  const [ready, setReady] = useState(false);
  const buildingRef = useRef(false);

  // Build the catalog (with embed_ok filter, backup fulfillment, and top-7 preservation)
  const buildFinal = useCallback(async () => {
    if (buildingRef.current) return;
    buildingRef.current = true;

    const savedTop7 = readJSON('sv:catalog:top7');
    const desiredTop7 = Array.isArray(savedTop7) && savedTop7.length > 0
      ? savedTop7
      : primary.slice(0, 7).map((i) => i.youtubeId);

    // Build embed_ok map for all candidates we might consider
    const allCandidates = [...primary, ...backup];
    const usedIds = new Set();
    const embedOk = {};

    // First pass: use whatever is already cached
    for (const item of allCandidates) {
      const c = readEmbedCache(item.youtubeId);
      if (c !== null) embedOk[item.youtubeId] = c;
    }
    // Second pass: preflight those without cache
    for (const item of allCandidates) {
      if (embedOk[item.youtubeId] !== undefined) continue;
      // eslint-disable-next-line no-await-in-loop
      embedOk[item.youtubeId] = await preflightOEmbed(item.youtubeId);
    }

    // Helper to push item if allowed and not used
    const pushIfOk = (arr, item) => {
      if (!item) return false;
      if (usedIds.has(item.youtubeId)) return false;
      if (embedOk[item.youtubeId] !== true) return false;
      usedIds.add(item.youtubeId);
      arr.push({ ...item, embed_ok: true });
      return true;
    };

    const final = [];

    // Resolve the top-7 in preserved order
    for (const tid of desiredTop7) {
      const item =
        primary.find((i) => i.youtubeId === tid) ||
        backup.find((i) => i.youtubeId === tid) ||
        null;
      if (pushIfOk(final, item)) continue;

      // Fallback: scan primary then backup for next available
      let filled = false;
      for (const p of primary) {
        if (pushIfOk(final, p)) {
          filled = true;
          break;
        }
      }
      if (!filled) {
        for (const b of backup) {
          if (pushIfOk(final, b)) {
            filled = true;
            break;
          }
        }
      }
    }

    // Fill the rest up to 30
    for (const p of primary) {
      if (final.length >= 30) break;
      pushIfOk(final, p);
    }
    for (const b of backup) {
      if (final.length >= 30) break;
      pushIfOk(final, b);
    }

    // Ensure exactly 30 by trimming (shouldn't need but guard)
    const resolved = final.slice(0, 30);

    setVideos(resolved);
    persistCatalog(resolved);
    setReady(true);
    buildingRef.current = false;
  }, [primary, backup]);

  // Verify and repair a saved catalog in the background
  const verifyAndRepair = useCallback(async () => {
    const current = readSavedCatalog();
    if (!current || !Array.isArray(current.items)) {
      await buildFinal();
      return;
    }
    const items = current.items;
    const usedIds = new Set(items.map((i) => i.youtubeId));

    // Check embed_ok for each item; if any false -> replace
    const embedOk = {};
    for (const i of items) {
      // eslint-disable-next-line no-await-in-loop
      embedOk[i.youtubeId] = await preflightOEmbed(i.youtubeId);
    }

    let changed = false;
    const repaired = items.map((i) => ({ ...i, embed_ok: embedOk[i.youtubeId] === true }));

    // Replace any failed items
    const need = [];
    repaired.forEach((i, idx) => {
      if (i.embed_ok !== true) {
        need.push(idx);
        usedIds.delete(i.youtubeId);
      }
    });

    // Pull replacements from backup then primary, respecting embed_ok and not reusing ids
    async function findReplacement() {
      for (const pool of [backup, primary]) {
        for (const cand of pool) {
          if (usedIds.has(cand.youtubeId)) continue;
          // eslint-disable-next-line no-await-in-loop
          const ok = await preflightOEmbed(cand.youtubeId);
          if (ok) {
            usedIds.add(cand.youtubeId);
            return { ...cand, embed_ok: true };
          }
        }
      }
      return null;
    }

    for (const idx of need) {
      // eslint-disable-next-line no-await-in-loop
      const rep = await findReplacement();
      if (rep) {
        repaired[idx] = rep;
        changed = true;
      }
    }

    // Ensure 30 items by topping up if trimmed earlier
    while (repaired.length < 30) {
      // eslint-disable-next-line no-await-in-loop
      const rep = await (async () => {
        for (const pool of [backup, primary]) {
          for (const cand of pool) {
            if (usedIds.has(cand.youtubeId)) continue;
            // eslint-disable-next-line no-await-in-loop
            const ok = await preflightOEmbed(cand.youtubeId);
            if (ok) {
              usedIds.add(cand.youtubeId);
              return { ...cand, embed_ok: true };
            }
          }
        }
        return null;
      })();
      if (!rep) break;
      repaired.push(rep);
      changed = true;
    }

    const final = repaired.slice(0, 30);

    setVideos(final);
    persistCatalog(final);
    setReady(true);

    if (!changed && final.length === 30) {
      // Up-to-date, nothing else to do
    }
  }, [buildFinal, primary, backup]);

  useEffect(() => {
    const saved = readSavedCatalog();
    if (saved && saved.items && Array.isArray(saved.items) && saved.items.length === 30) {
      setVideos(saved.items);
      setReady(true);
      // Background verify without blocking UI
      verifyAndRepair();
    } else {
      buildFinal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // PUBLIC_INTERFACE
  const replaceWithBackup = useCallback(async (youtubeId) => {
    // Mark advisory thumb failure so we do not retry thumbnails for this id
    try { localStorage.setItem(`sv:thumbfail:${youtubeId}`, '1'); } catch {}

    setVideos(async (prev) => {
      const current = Array.isArray(prev) ? prev.slice() : [];
      const idx = current.findIndex((v) => v.youtubeId === youtubeId);
      if (idx < 0) return prev;

      const usedIds = new Set(current.map((i) => i.youtubeId));
      // Find a replacement from backup first
      const pick = async () => {
        for (const pool of [backup, primary]) {
          for (const cand of pool) {
            if (usedIds.has(cand.youtubeId)) continue;
            const okCached = readEmbedCache(cand.youtubeId);
            let ok = okCached;
            if (ok === null) {
              // eslint-disable-next-line no-await-in-loop
              ok = await preflightOEmbed(cand.youtubeId);
            }
            if (ok === true) {
              return { ...cand, embed_ok: true };
            }
          }
        }
        return null;
      };

      const replacement = await pick();
      if (!replacement) return prev;

      current[idx] = replacement;

      // Update top-7 ordering if replacement is within the first 7
      if (idx < 7) {
        try {
          const top7 = current.slice(0, 7).map((i) => i.youtubeId);
          writeJSON('sv:catalog:top7', top7);
        } catch {
          // ignore
        }
      }

      persistCatalog(current);
      return current;
    });
  }, [primary, backup]);

  const refreshCatalog = useCallback(() => {
    // Clear saved catalog (leave oembed cache intact) and rebuild
    try { localStorage.removeItem('sv:catalog:final'); } catch {}
    buildFinal();
  }, [buildFinal]);

  const value = useMemo(() => ({
    videos,
    ready,
    replaceWithBackup,
    refreshCatalog,
  }), [videos, ready, replaceWithBackup, refreshCatalog]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}
