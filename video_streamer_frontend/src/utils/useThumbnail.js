import { useEffect, useMemo, useRef, useState } from 'react';
import { buildYouTubeCandidates, extractYouTubeId } from './thumbnails';

/**
 * PUBLIC_INTERFACE
 * useThumbnail(video, options): Resolve the best thumbnail URL with robust fallback and caching.
 * - Preflight check (HEAD or lightweight fetch) before attempting to render
 * - Per-video override respected first
 * - LocalStorage memoization with 7-day TTL (sv:thumb:<id>)
 * - Avoids spinner loops; skeleton hides within ~600ms by timing out to best candidate
 * - Returns handlers and explicit width/height hints
 */
export function useThumbnail(video, options = {}) {
  const { fallback = '/assets/thumbnail-fallback.jpg', timeoutMs = 600 } = options;
  const [resolved, setResolved] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isResolving, setIsResolving] = useState(true);
  const triedRef = useRef(new Set());
  const timerRef = useRef(null);

  const videoKey = useMemo(() => {
    if (!video) return null;
    const id = video.id || video.youtubeId || extractYouTubeId(video?.url);
    return id ? String(id) : null;
  }, [video]);

  const initialCandidates = useMemo(() => {
    if (!video) return [fallback];

    const candidates = [];

    // Try explicit thumbnail override first
    if (video.thumbnail && typeof video.thumbnail === 'string') {
      candidates.push(video.thumbnail);
    }

    if (video.sourceType === 'youtube') {
      const ytId = video.youtubeId || video.videoId || extractYouTubeId(video.url);
      // Prefer sddefault/hqdefault over maxres if maxres is known to be grey sometimes.
      // We'll still include maxres but later in order for speed/reliability.
      const ordered = [
        // Some channels have stable sd/hq while maxres can be greyscale; prioritize sd/hq
        `https://i.ytimg.com/vi/${ytId}/sddefault.jpg`,
        `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
        `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`,
        `https://i.ytimg.com/vi/${ytId}/mqdefault.jpg`,
        `https://i.ytimg.com/vi/${ytId}/default.jpg`,
      ];
      candidates.push(...ordered);
    }

    const unique = Array.from(new Set(candidates.filter(Boolean)));
    unique.push(fallback);
    return unique;
  }, [video, fallback]);

  // Storage helpers
  const readCache = () => {
    if (!videoKey) return null;
    try {
      const raw = localStorage.getItem(`sv:thumb:${videoKey}`);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || !obj.url || !obj.exp) return null;
      if (Date.now() > obj.exp) {
        localStorage.removeItem(`sv:thumb:${videoKey}`);
        return null;
      }
      return obj.url;
    } catch {
      return null;
    }
  };
  const writeCache = (url) => {
    if (!videoKey) return;
    try {
      const ttl = 7 * 24 * 60 * 60 * 1000; // 7 days
      const exp = Date.now() + ttl;
      localStorage.setItem(`sv:thumb:${videoKey}`, JSON.stringify({ url, exp }));
    } catch {
      // ignore
    }
  };

  // Preflight check: prefer HEAD; fallback to fetch GET with no-cors
  const preflight = async (url) => {
    if (!url) return false;
    // Quick image dimension check via HTMLImage for final guard
    const quickImageSize = () =>
      new Promise((resolve) => {
        const img = new Image();
        img.loading = 'eager';
        img.decoding = 'sync';
        img.onload = () => {
          const w = img.naturalWidth || 0;
          const h = img.naturalHeight || 0;
          resolve(w >= 200 && h >= 120);
        };
        img.onerror = () => resolve(false);
        img.src = url;
      });

    try {
      // Try HEAD first, but many CDNs block HEAD; ignore errors
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 350);
      const res = await fetch(url, { method: 'HEAD', mode: 'no-cors', cache: 'force-cache', signal: controller.signal });
      clearTimeout(t);
      // With no-cors, status might be 0; proceed to quick image check to be certain
      const okDim = await quickImageSize();
      return okDim;
    } catch {
      // Fallback to quick image check directly
      const okDim = await quickImageSize();
      return okDim;
    }
  };

  useEffect(() => {
    let cancelled = false;
    triedRef.current = new Set();
    setIsResolving(true);
    setLoaded(false);

    // Immediate cache hit
    const cached = readCache();
    if (cached) {
      setResolved(cached);
      setIsResolving(false);
      return () => {};
    }

    // Start a safety timeout to ensure skeleton ends quickly
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (cancelled) return;
      // Use the best first candidate (usually sd/hq) as a fallback if still resolving
      const best = initialCandidates.find(Boolean) || fallback;
      setResolved(best);
      setIsResolving(false);
    }, timeoutMs);

    async function run() {
      for (const url of initialCandidates) {
        if (cancelled) return;
        if (!url || triedRef.current.has(url)) continue;
        triedRef.current.add(url);

        const ok = await preflight(url);
        if (cancelled) return;
        if (ok) {
          setResolved(url);
          setIsResolving(false);
          writeCache(url);
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          return;
        }
      }
      if (!cancelled) {
        setResolved(fallback);
        setIsResolving(false);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }
    }

    run();

    return () => {
      cancelled = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [initialCandidates, videoKey, fallback, timeoutMs]);

  // onError/onLoad for <img> element
  const onError = async () => {
    const remaining = initialCandidates.filter((u) => !triedRef.current.has(u));
    for (const url of remaining) {
      const ok = await preflight(url);
      if (ok) {
        setResolved(url);
        writeCache(url);
        return;
      }
      triedRef.current.add(url);
    }
    setResolved(fallback);
  };

  const onLoad = () => setLoaded(true);

  // Provide explicit width/height to reduce layout shift (16:9 common sizes)
  const width = 1280;
  const height = 720;

  return {
    url: resolved || fallback,
    loaded,
    isResolving,
    onError,
    onLoad,
    width,
    height,
  };
}
