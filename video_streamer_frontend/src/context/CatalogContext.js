import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import primaryRaw from '../data/videos';
import backupRaw from '../data/backupVideos';
import playlistsSource from '../data/playlists';

/**
 * PUBLIC_INTERFACE
 * CatalogContext provides a guaranteed-availability catalog of 30 YouTube kids videos plus mixed public MP4 and Vimeo items.
 *
 * Resilience & Stability details:
 * - Atomic resolution: builds the full 30-item YouTube array in memory before publishing to state; mixed list appends MP4 and Vimeo.
 * - oEmbed preflight with tri-state: true | false | 'u' (unknown).
 *   - YouTube: https://www.youtube.com/oembed?url=...
 *   - Vimeo: https://vimeo.com/api/oembed.json?url=https://vimeo.com/<id>
 *   Timeouts/network errors => 'u' (allowed). Only explicit false are excluded/replaced.
 * - Backup fulfillment: if a primary YouTube item is unembeddable, pull from the vetted backup pool until all 30 slots are filled.
 * - Runtime replacement: consumers can call replaceWithBackup(youtubeId) for YouTube items on thumb exhaustion.
 * - Persistence: writes once when a stable 30-item list is finalized. Uses versioned keys to safely bust stale caches.
 * - Top-7 ordering: preserves last known top-7 ordering for YouTube (if present) otherwise uses dataset’s first 7.
 *
 * Exposed API:
 * - videos: Array<CatalogItem>
 * - ready: boolean indicating the catalog is finalized and stable
 * - replaceWithBackup(youtubeId: string): replace a single bad item from the backup pool and persist
 * - refreshCatalog(): rebuild the catalog from scratch (oEmbed preflight)
 *
 * Storage keys (v2):
 * - sv:catalog:final:v2 = { items: CatalogItem[], exp: number }
 * - sv:catalog:top7:v2 = string[] of youtubeIds (ordering for lead items)
 * - sv:oembed:<id>:v2 = { ok: true | false | 'u', exp: number }
 * - sv:thumbfail:<id> = "1" if item had two failing thumbnails at runtime (advisory)
 */

// PUBLIC_INTERFACE
export const CatalogContext = createContext({
  videos: [],              // curated YouTube set (exactly 30 when ready)
  mixedVideos: [],         // curated YouTube + public MP4 + Vimeo set
  counts: { youtube: 0, mp4: 0, vimeo: 0, total: 0 },
  playlists: [],           // playlist definitions with counts
  playlistsMap: {},        // id -> array of items
  ready: false,
  replaceWithBackup: (_id) => {},
  refreshCatalog: () => {},
  // PUBLIC_INTERFACE
  getPlaylistItems: (_id) => [],  // returns items by playlist id
});

// Versioned keys
const STORAGE_VERSION = 'v2';
const KEYS = {
  catalogFinalV2: `sv:catalog:final:${STORAGE_VERSION}`,
  catalogTop7V2: `sv:catalog:top7:${STORAGE_VERSION}`,
  catalogFinalV1: 'sv:catalog:final', // legacy (read-only fallback)
  catalogTop7V1: 'sv:catalog:top7',   // legacy (read-only fallback)
  oembedV2: (id) => `sv:oembed:${id}:${STORAGE_VERSION}`,
  oembedV1: (id) => `sv:oembed:${id}`, // legacy (read-only fallback)
  thumbFail: (id) => `sv:thumbfail:${id}`,
  vimeoOEmbedV2: (id) => `sv:oembed:vimeo:${id}:${STORAGE_VERSION}`,
};

// Dev logging gate
const DEBUG =
  process.env.NODE_ENV !== 'production' &&
  String(process.env.REACT_APP_LOG_LEVEL || '').toLowerCase() !== 'silent';

function dlog(...args) {
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.log('[Catalog]', ...args);
  }
}

// Helpers: normalize raw dataset items into catalog format
function normalizeItem(v, idx) {
  // integrate new fields with backward compatibility
  const description = v.description || '';
  const tags = Array.isArray(v.tags) ? v.tags : [];
  const playlistIds = Array.isArray(v.playlistIds) ? v.playlistIds : [];
  const channelName = v.channelName || v.channel || 'Official Channel';
  // YouTube item normalization
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
    channel: channelName,
    views: v.views || '',
    uploadedAt: v.uploadedAt || '',
    duration: v.duration || '',
    description,
    tags,
    playlistIds,
    thumbnail: primary,
    altThumbnail: alt,
    embeddable: v.embeddable === true,
    embed_ok: false, // will be set after preflight/acceptance
    _rank: idx, // deterministic fill ordering
  };
}

// Normalize Vimeo items from dataset
function normalizeVimeoItem(v, idx) {
  const id = v.vimeoId || v.id || '';
  return {
    id: v.id || `vimeo-${id}`,
    title: v.title,
    sourceType: 'vimeo',
    url: `https://vimeo.com/${id}`,
    vimeoId: id,
    channel: v.channelName || v.channel || 'Vimeo',
    views: v.views || '',
    uploadedAt: v.uploadedAt || '',
    duration: v.duration || '',
    description: v.description || '',
    tags: Array.isArray(v.tags) ? v.tags : [],
    playlistIds: Array.isArray(v.playlistIds) ? v.playlistIds : [],
    thumbnail: v.thumbnail || v.altThumbnail || '',
    altThumbnail: v.altThumbnail || v.thumbnail || '',
    embeddable: v.embeddable === true,
    embed_ok: true, // will be set/confirmed via Vimeo oEmbed if needed
    _rank: idx,
  };
}

// Normalize MP4 public clips (Pexels/Pixabay) from the same dataset
function normalizeMp4Item(v, idx) {
  // v.id is already present and unique in data/videos.js for mp4 items
  return {
    id: v.id,
    title: v.title,
    sourceType: 'mp4',
    url: v.mp4Url,
    mp4Url: v.mp4Url,
    youtubeId: undefined,
    channel: v.channelName || v.channel || 'Public Clip',
    views: v.views || '',
    uploadedAt: v.uploadedAt || '',
    duration: v.duration || '',
    description: v.description || '',
    attribution: v.attribution || '',
    tags: Array.isArray(v.tags) ? v.tags : [],
    playlistIds: Array.isArray(v.playlistIds) ? v.playlistIds : [],
    // Respect provided poster thumbnails; no YT fallback here
    thumbnail: v.thumbnail || v.altThumbnail || '',
    altThumbnail: v.altThumbnail || v.thumbnail || '',
    // MP4 clips do not require oEmbed preflight
    embeddable: true,
    embed_ok: true,
    _rank: idx,
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

// oEmbed cache: tri-state boolean | 'u' (unknown)
function readEmbedCache(id) {
  try {
    // v2 first
    const rawV2 = localStorage.getItem(KEYS.oembedV2(id));
    if (rawV2) {
      const obj = JSON.parse(rawV2);
      if (!obj || obj.exp == null) return null;
      if (Date.now() > obj.exp) {
        localStorage.removeItem(KEYS.oembedV2(id));
        return null;
      }
      if (obj.ok === true) return true;
      if (obj.ok === false) return false;
      if (obj.ok === 'u') return 'u';
      return null;
    }
    // legacy v1 fallback (boolean only)
    const rawV1 = localStorage.getItem(KEYS.oembedV1(id));
    if (rawV1) {
      const obj1 = JSON.parse(rawV1);
      if (!obj1 || obj1.exp == null) return null;
      if (Date.now() > obj1.exp) {
        localStorage.removeItem(KEYS.oembedV1(id));
        return null;
      }
      // v1 false might have been a timeout mis-flag; treat as 'unknown'
      if (obj1.ok === true) return true;
      if (obj1.ok === false) return 'u';
      return null;
    }
    return null;
  } catch {
    return null;
  }
}
function writeEmbedCache(id, ok) {
  try {
    // TTL: true/false -> 7 days; unknown 'u' -> 6 hours (retry sooner)
    const ttl =
      ok === 'u' ? 6 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    const exp = Date.now() + ttl;
    localStorage.setItem(KEYS.oembedV2(id), JSON.stringify({ ok, exp, v: STORAGE_VERSION }));
  } catch {
    // ignore
  }
}

/**
 * PUBLIC_INTERFACE
 * Perform a YouTube oEmbed preflight with a timeout.
 * Returns one of: true | false | 'u' (unknown).
 * - Timeout or network/CORS errors => 'u'
 * - HTTP 4xx/5xx => false (explicit invalid)
 * - 2xx => true
 */
async function preflightOEmbed(id, externalSignal) {
  const cached = readEmbedCache(id);
  if (cached !== null) return cached;

  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), 1200);
  try {
    const resp = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`,
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: externalSignal || controller.signal,
        cache: 'default',
      }
    );
    clearTimeout(to);
    if (resp.ok) {
      writeEmbedCache(id, true);
      return true;
    }
    // If we can see a real HTTP status and it's not ok, consider it explicitly unembeddable
    writeEmbedCache(id, false);
    return false;
  } catch (err) {
    clearTimeout(to);
    // Treat abort/timeouts and network errors as unknown
    writeEmbedCache(id, 'u');
    return 'u';
  }
}

// Vimeo oEmbed cache helpers
function readVimeoEmbedCache(id) {
  try {
    const raw = localStorage.getItem(KEYS.vimeoOEmbedV2(id));
    if (raw) {
      const obj = JSON.parse(raw);
      if (!obj || obj.exp == null) return null;
      if (Date.now() > obj.exp) {
        localStorage.removeItem(KEYS.vimeoOEmbedV2(id));
        return null;
      }
      if (obj.ok === true) return true;
      if (obj.ok === false) return false;
      if (obj.ok === 'u') return 'u';
      return null;
    }
    return null;
  } catch {
    return null;
  }
}
function writeVimeoEmbedCache(id, ok) {
  try {
    const ttl = ok === 'u' ? 6 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    const exp = Date.now() + ttl;
    localStorage.setItem(KEYS.vimeoOEmbedV2(id), JSON.stringify({ ok, exp, v: STORAGE_VERSION }));
  } catch {
    // ignore
  }
}

/**
 * PUBLIC_INTERFACE
 * Perform a Vimeo oEmbed preflight with a timeout.
 * Returns true | false | 'u'.
 */
async function preflightVimeoOEmbed(id, externalSignal) {
  const cached = readVimeoEmbedCache(id);
  if (cached !== null) return cached;

  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), 1200);
  try {
    const url = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(`https://vimeo.com/${id}`)}`;
    const resp = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: externalSignal || controller.signal,
      cache: 'default',
    });
    clearTimeout(to);
    if (resp.ok) {
      writeVimeoEmbedCache(id, true);
      return true;
    }
    writeVimeoEmbedCache(id, false);
    return false;
  } catch {
    clearTimeout(to);
    writeVimeoEmbedCache(id, 'u');
    return 'u';
  }
}

function readSavedCatalog() {
  const objV2 = readJSON(KEYS.catalogFinalV2);
  if (objV2 && Array.isArray(objV2.items) && objV2.exp && Date.now() <= objV2.exp) {
    return objV2;
  }
  // fallback to v1 only when valid and complete
  const objV1 = readJSON(KEYS.catalogFinalV1);
  if (objV1 && Array.isArray(objV1.items) && objV1.exp && Date.now() <= objV1.exp) {
    return objV1;
  }
  return null;
}

function readSavedTop7() {
  const v2 = readJSON(KEYS.catalogTop7V2);
  if (Array.isArray(v2) && v2.length > 0) return v2;
  const v1 = readJSON(KEYS.catalogTop7V1);
  if (Array.isArray(v1) && v1.length > 0) return v1;
  return null;
}

function persistCatalog(items) {
  if (!Array.isArray(items) || items.length !== 30) {
    // Never persist partial/unstable lists
    dlog('persistCatalog skipped (not 30 items)');
    return;
  }
  try {
    const ttl = 7 * 24 * 60 * 60 * 1000;
    const exp = Date.now() + ttl;
    writeJSON(KEYS.catalogFinalV2, { items, exp, v: STORAGE_VERSION });
    // save top-7 ordering for next boot (versioned)
    writeJSON(KEYS.catalogTop7V2, items.slice(0, 7).map((i) => i.youtubeId));
  } catch {
    // ignore
  }
}

export function CatalogProvider({ children }) {
  // Split primaryRaw into two: YouTube curated and MP4/Vimeo public clips
  const primaryYouTubeRaw = useMemo(
    () =>
      Array.isArray(primaryRaw)
        ? primaryRaw.filter(
            (v) =>
              v &&
              (v.sourceType === undefined ||
                v.sourceType === null ||
                v.sourceType === 'youtube')
          )
        : [],
    []
  );
  const mp4Raw = useMemo(
    () => (Array.isArray(primaryRaw) ? primaryRaw.filter((v) => v && v.sourceType === 'mp4') : []),
    []
  );
  const vimeoRaw = useMemo(
    () => (Array.isArray(primaryRaw) ? primaryRaw.filter((v) => v && v.sourceType === 'vimeo') : []),
    []
  );

  const primary = useMemo(
    () => primaryYouTubeRaw.map(normalizeItem),
    [primaryYouTubeRaw]
  );
  const publicMp4 = useMemo(
    () => mp4Raw.map(normalizeMp4Item),
    [mp4Raw]
  );
  const publicVimeo = useMemo(
    () => vimeoRaw.map(normalizeVimeoItem),
    [vimeoRaw]
  );
  const backup = useMemo(
    () => (Array.isArray(backupRaw) ? backupRaw.map(normalizeItem) : []),
    []
  );

  const [videos, setVideos] = useState([]); // curated 30 YouTube catalog
  const [mixedVideos, setMixedVideos] = useState([]); // curated + mp4 + vimeo
  const [counts, setCounts] = useState({ youtube: 0, mp4: 0, vimeo: 0, total: 0 }); // counts
  const [ready, setReady] = useState(false);
  const [playlists, setPlaylists] = useState(playlistsSource);
  const [playlistsMap, setPlaylistsMap] = useState({});
  const buildingRef = useRef(false);

  // Track latest videos for async replacement logic
  const videosRef = useRef([]);
  useEffect(() => {
    videosRef.current = videos;
  }, [videos]);

  // Build the catalog (with embed tri-state, backup fulfillment, and top-7 preservation)
  const buildFinal = useCallback(async () => {
    if (buildingRef.current) return;
    buildingRef.current = true;

    const savedTop7 = readSavedTop7();
    const desiredTop7 =
      Array.isArray(savedTop7) && savedTop7.length > 0
        ? savedTop7
        : primary.slice(0, 7).map((i) => i.youtubeId);

    const allCandidates = [...primary, ...backup];
    const usedIds = new Set();
    const embedOk = {};

    // First pass: cached values
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

    // Helper: allow unless explicitly false; ensure no duplicates
    const pushIfAllowed = (arr, item) => {
      if (!item) return false;
      if (usedIds.has(item.youtubeId)) return false;
      if (embedOk[item.youtubeId] === false) return false; // only exclude explicit false
      usedIds.add(item.youtubeId);
      arr.push({ ...item, embed_ok: embedOk[item.youtubeId] !== false });
      return true;
    };

    const final = [];

    // Resolve the top-7 in preserved order
    for (const tid of desiredTop7) {
      const item =
        primary.find((i) => i.youtubeId === tid) ||
        backup.find((i) => i.youtubeId === tid) ||
        null;
      if (pushIfAllowed(final, item)) continue;

      // Fallback: scan primary then backup for next allowed
      let filled = false;
      for (const p of primary) {
        if (pushIfAllowed(final, p)) {
          filled = true;
          break;
        }
      }
      if (!filled) {
        for (const b of backup) {
          if (pushIfAllowed(final, b)) {
            filled = true;
            break;
          }
        }
      }
    }

    // Fill the rest up to 30
    for (const p of primary) {
      if (final.length >= 30) break;
      pushIfAllowed(final, p);
    }
    for (const b of backup) {
      if (final.length >= 30) break;
      pushIfAllowed(final, b);
    }

    const countsDbg = {
      true: Object.values(embedOk).filter((v) => v === true).length,
      false: Object.values(embedOk).filter((v) => v === false).length,
      unknown: Object.values(embedOk).filter((v) => v === 'u').length,
    };
    dlog('oEmbed preflight counts =>', countsDbg, 'final length', final.length);

    if (final.length === 30) {
      // Publish atomically after reaching 30
      const curated = final.slice(0, 30);
      setVideos(curated);
      persistCatalog(curated);
      // Build mixed list (curated + public MP4 + Vimeo)
      const mp4List = publicMp4;
      const vimeoList = publicVimeo;
      const mixed = [...curated, ...mp4List, ...vimeoList];
      setMixedVideos(mixed);
      const counts = { youtube: curated.length, mp4: mp4List.length, vimeo: vimeoList.length, total: mixed.length };
      setCounts(counts);
      // Build playlists map
      const pmap = {};
      for (const pl of playlistsSource) pmap[pl.id] = [];
      for (const item of mixed) {
        const ids = Array.isArray(item.playlistIds) ? item.playlistIds : [];
        ids.forEach((pid) => {
          if (!pmap[pid]) pmap[pid] = [];
          pmap[pid].push(item);
        });
      }
      setPlaylistsMap(pmap);
      // Enrich playlists with counts for dashboard
      setPlaylists(playlistsSource.map((p) => ({ ...p, count: (pmap[p.id] || []).length })));
      setReady(true);
    } else {
      // Never publish partial lists
      dlog('Atomic build produced < 30 items; deferring publish');
    }

    buildingRef.current = false;

    // Background retry: settle unknowns to improve future cold-starts
    setTimeout(() => {
      (async () => {
        for (const item of allCandidates) {
          if (embedOk[item.youtubeId] === 'u') {
            // eslint-disable-next-line no-await-in-loop
            await preflightOEmbed(item.youtubeId);
          }
        }
        // Kick off light cache warm for Vimeo items (non-blocking)
        for (const v of publicVimeo) {
          const cached = readVimeoEmbedCache(v.vimeoId);
          if (cached === null || cached === 'u') {
            // eslint-disable-next-line no-await-in-loop
            await preflightVimeoOEmbed(v.vimeoId);
          }
        }
      })();
    }, 0);
  }, [primary, backup]); // publicMp4/publicVimeo are constant from dataset; safe to omit

  // Verify and repair a saved catalog in the background without reducing count
  const verifyAndRepair = useCallback(async () => {
    const current = readSavedCatalog();
    if (!current || !Array.isArray(current.items)) {
      await buildFinal();
      return;
    }
    const items = current.items;
    const usedIds = new Set(items.map((i) => i.youtubeId));

    // Check oEmbed for each item
    const embedOk = {};
    for (const i of items) {
      // eslint-disable-next-line no-await-in-loop
      embedOk[i.youtubeId] = await preflightOEmbed(i.youtubeId);
    }

    let changed = false;
    const repaired = items.map((i) => ({
      ...i,
      embed_ok: embedOk[i.youtubeId] !== false,
    }));

    // Identify positions needing replacement (explicit false only)
    const need = [];
    repaired.forEach((i, idx) => {
      if (embedOk[i.youtubeId] === false) {
        need.push(idx);
        usedIds.delete(i.youtubeId);
      }
    });

    // Replacement finder: prefer backup, then primary; allow unless explicitly false
    async function findReplacement() {
      for (const pool of [backup, primary]) {
        for (const cand of pool) {
          if (usedIds.has(cand.youtubeId)) continue;
          const cached = readEmbedCache(cand.youtubeId);
          let ok = cached;
          if (ok === null) {
            // eslint-disable-next-line no-await-in-loop
            ok = await preflightOEmbed(cand.youtubeId);
          }
          if (ok !== false) {
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

    // Ensure we still present exactly 30; if not, try to top-up
    while (repaired.length < 30) {
      // eslint-disable-next-line no-await-in-loop
      const rep = await (async () => {
        for (const pool of [backup, primary]) {
          for (const cand of pool) {
            if (usedIds.has(cand.youtubeId)) continue;
            // eslint-disable-next-line no-await-in-loop
            const ok = await preflightOEmbed(cand.youtubeId);
            if (ok !== false) {
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

    if (final.length === 30) {
      const curated = final;
      setVideos(curated);
      persistCatalog(curated);
      // Refresh mixed list alongside curated updates
      const mp4List = publicMp4;
      const vimeoList = publicVimeo;
      const mixed = [...curated, ...mp4List, ...vimeoList];
      setMixedVideos(mixed);
      const counts = { youtube: curated.length, mp4: mp4List.length, vimeo: vimeoList.length, total: mixed.length };
      setCounts(counts);
      const pmap = {};
      for (const pl of playlistsSource) pmap[pl.id] = [];
      for (const item of mixed) {
        const ids = Array.isArray(item.playlistIds) ? item.playlistIds : [];
        ids.forEach((pid) => {
          if (!pmap[pid]) pmap[pid] = [];
          pmap[pid].push(item);
        });
      }
      setPlaylistsMap(pmap);
      setPlaylists(playlistsSource.map((p) => ({ ...p, count: (pmap[p.id] || []).length })));
      setReady(true);
      dlog('verifyAndRepair applied:', { changed, length: curated.length });
    } else {
      dlog('verifyAndRepair could not maintain 30 items; deferring publish and triggering full rebuild');
      // Keep the current published list as-is; do not reduce count
      buildFinal();
    }
  }, [buildFinal, primary, backup]); // public lists safe to omit

  useEffect(() => {
    const saved = readSavedCatalog();
    if (saved && saved.items && Array.isArray(saved.items) && saved.items.length === 30) {
      const curated = saved.items;
      setVideos(curated);
      const mixed = [...curated, ...publicMp4, ...publicVimeo];
      setMixedVideos(mixed);
      setCounts({ youtube: curated.length, mp4: publicMp4.length, vimeo: publicVimeo.length, total: mixed.length });
      setReady(true);
      // Verify in background without disrupting UI
      verifyAndRepair();
    } else {
      buildFinal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // PUBLIC_INTERFACE
  const replaceWithBackup = useCallback((youtubeId) => {
    if (!youtubeId) return;
    // Advisory mark to avoid re-trying thumbnails on this id
    try {
      localStorage.setItem(KEYS.thumbFail(youtubeId), '1');
    } catch {}

    // Compute and apply replacement asynchronously without ever reducing list size
    (async () => {
      const current = Array.isArray(videosRef.current) ? videosRef.current.slice() : [];
      const idx = current.findIndex((v) => v.youtubeId === youtubeId || v.id === youtubeId);
      if (idx < 0) return;

      const usedIds = new Set(current.map((i) => i.youtubeId));

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
            if (ok !== false) {
              return { ...cand, embed_ok: true };
            }
          }
        }
        return null;
      };

      const replacement = await pick();
      if (!replacement) {
        dlog('replaceWithBackup: no viable replacement found; keeping current item', youtubeId);
        return;
      }

      current[idx] = replacement;

      // Update top-7 ordering if replacement is within the first 7
      if (idx < 7) {
        try {
          const top7 = current.slice(0, 7).map((i) => i.youtubeId);
          writeJSON(KEYS.catalogTop7V2, top7);
        } catch {
          // ignore
        }
      }

      // Publish and persist (30 items guaranteed)
      if (current.length === 30) {
        setVideos(current);
        persistCatalog(current);
        dlog('replaceWithBackup: replaced', youtubeId, '->', replacement.youtubeId);
      }
    })();
  }, [primary, backup]);

  const refreshCatalog = useCallback(() => {
    // Clear saved catalog (leave oEmbed cache intact) and rebuild atomically
    try {
      localStorage.removeItem(KEYS.catalogFinalV2);
    } catch {}
    setReady(false);
    buildFinal();
  }, [buildFinal]);

  // PUBLIC_INTERFACE
  const getPlaylistItems = useCallback((pid) => {
    if (!pid) return [];
    const list = playlistsMap[pid] || [];
    return list;
  }, [playlistsMap]);

  const value = useMemo(
    () => ({
      videos,
      mixedVideos,
      counts,
      playlists,
      playlistsMap,
      ready,
      replaceWithBackup,
      refreshCatalog,
      getPlaylistItems,
    }),
    [videos, mixedVideos, counts, playlists, playlistsMap, ready, replaceWithBackup, refreshCatalog, getPlaylistItems]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}
