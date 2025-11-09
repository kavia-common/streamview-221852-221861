import { useEffect, useMemo, useRef, useState } from 'react';
import { extractYouTubeId } from './thumbnails';

/**
 * PUBLIC_INTERFACE
 * useThumbnail(video, options): Resolve the best thumbnail URL with strict pinned choices and caching.
 * - Uses explicit video.thumbnail first, then video.altThumbnail immediately on error
 * - If both pinned URLs fail, calls options.onThumbnailsExhausted (if provided) to trigger runtime replacement
 * - LocalStorage memoization with 7-day TTL (sv:thumb:<id>) for successful pinned URL only
 * - Returns handlers and explicit width/height hints
 */
export function useThumbnail(video, options = {}) {
  const {
    fallback = '/assets/thumbnail-fallback.jpg',
    timeoutMs = 600,
    onThumbnailsExhausted,
  } = options;
  const [resolved, setResolved] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isResolving, setIsResolving] = useState(true);
  const triedRef = useRef(new Set());
  const timerRef = useRef(null);

  const videoKey = useMemo(() => {
    if (!video) return null;
    const id = video.id || video.youtubeId || extractYouTubeId(video?.url);
    return id ? String(id) : null;
  }, [video && (video.id || video.youtubeId || video.url)]);

  const pinnedCandidates = useMemo(() => {
    if (!video) return [];
    const list = [];
    if (typeof video.thumbnail === 'string' && video.thumbnail.trim().length > 0) {
      list.push(video.thumbnail.trim());
    }
    if (typeof video.altThumbnail === 'string' && video.altThumbnail.trim().length > 0) {
      list.push(video.altThumbnail.trim());
    }
    return Array.from(new Set(list));
  }, [video]);

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
      // Only cache success for pinned URLs (ignore fallback placeholder)
      if (!pinnedCandidates.includes(url)) return;
      const ttl = 7 * 24 * 60 * 60 * 1000; // 7 days
      const exp = Date.now() + ttl;
      localStorage.setItem(`sv:thumb:${videoKey}`, JSON.stringify({ url, exp }));
    } catch {
      // ignore
    }
  };

  // Preflight check: quick image dimension check via HTMLImage; avoids CORS noise
  const preflight = async (url) => {
    if (!url) return false;
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
    const okDim = await quickImageSize();
    return okDim;
  };

  const handleExhausted = () => {
    try {
      if (typeof onThumbnailsExhausted === 'function') {
        onThumbnailsExhausted(video);
      }
    } catch {
      // ignore callback errors
    }
  };

  useEffect(() => {
    let cancelled = false;
    triedRef.current = new Set();
    setIsResolving(true);
    setLoaded(false);

    const cached = readCache();
    if (cached) {
      setResolved(cached);
      setIsResolving(false);
      return () => {};
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (cancelled) return;
      // If still resolving, use the first pinned candidate as a temporary visual
      const best = pinnedCandidates.find(Boolean) || fallback;
      setResolved(best);
      setIsResolving(false);
    }, timeoutMs);

    async function run() {
      // Try pinned explicit urls only (thumbnail then alt)
      for (const url of pinnedCandidates) {
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
      // Both pinned failed - let the catalog know to replace item, then use fallback for now
      if (!cancelled) {
        setResolved(fallback);
        setIsResolving(false);
        handleExhausted();
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
  }, [pinnedCandidates, videoKey, fallback, timeoutMs]); // eslint-disable-line react-hooks/exhaustive-deps

  // onError/onLoad for <img> element
  const onError = async () => {
    const remaining = pinnedCandidates.filter((u) => !triedRef.current.has(u));
    for (const url of remaining) {
      const ok = await preflight(url);
      if (ok) {
        setResolved(url);
        writeCache(url);
        return;
      }
      triedRef.current.add(url);
    }
    // both pinned failed -> notify and fallback
    handleExhausted();
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
