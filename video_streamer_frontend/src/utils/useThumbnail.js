import { useEffect, useMemo, useRef, useState } from 'react';
import { buildYouTubeCandidates, extractYouTubeId, getVimeoIdFromUrl, getVimeoOembedThumb, getVimeoDerivedCandidates } from './thumbnails';

/**
 * PUBLIC_INTERFACE
 * useThumbnail(video, options): Resolve the best thumbnail URL asynchronously for a given video object.
 * - Shows a skeleton state until the first successful image loads
 * - Tries high quality candidates first and cascades on error
 * - Caches Vimeo oEmbed results in localStorage to avoid repeat fetches
 */
export function useThumbnail(video, options = {}) {
  const { fallback = '/assets/thumbnail-fallback.jpg' } = options;
  const [resolved, setResolved] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isResolving, setIsResolving] = useState(true);
  const triedRef = useRef(new Set());

  const initialCandidates = useMemo(() => {
    if (!video) return [fallback];

    // If explicit thumbnail provided, try it first
    const candidates = [];
    if (video.thumbnail && typeof video.thumbnail === 'string') {
      candidates.push(video.thumbnail);
    }

    if (video.sourceType === 'youtube') {
      const ytId = video.youtubeId || video.videoId || extractYouTubeId(video.url);
      candidates.push(...buildYouTubeCandidates(ytId));
    } else if (video.sourceType === 'vimeo') {
      const vimeoId = video.vimeoId || getVimeoIdFromUrl(video.url);
      // Use any provided vimeoThumb directly as first option
      if (video.vimeoThumb) candidates.push(video.vimeoThumb);
      // Will add derived candidates after optional oEmbed fetch
      const derived = getVimeoDerivedCandidates(vimeoId);
      candidates.push(...derived);
    } else if (video.sourceType === 'mp4') {
      if (video.thumbnail) candidates.push(video.thumbnail);
    }

    // Deduplicate and append fallback last
    const unique = Array.from(new Set(candidates.filter(Boolean)));
    unique.push(fallback);
    return unique;
  }, [video, fallback]);

  // Preload image to confirm it's valid and not grey/low-quality by checking dimensions
  const testImage = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Heuristic: YouTube known grey placeholders are often 120x90 (default) or specific grey at high res that fail to load.
        // If very small, consider poor quality and resolve(false)
        const w = img.naturalWidth || 0;
        const h = img.naturalHeight || 0;
        if (w < 200 || h < 120) {
          resolve(false);
          return;
        }
        resolve(true);
      };
      img.onerror = () => resolve(false);
      img.src = url;
    });

  useEffect(() => {
    let cancelled = false;
    triedRef.current = new Set();
    setIsResolving(true);
    setLoaded(false);

    async function resolveVimeoWithOembed(current) {
      if (!video || video.sourceType !== 'vimeo') return current;
      try {
        const key = `oembed:vimeo:${video.vimeoId || getVimeoIdFromUrl(video.url) || video.url}`;
        const cached = localStorage.getItem(key);
        if (cached) {
          const data = JSON.parse(cached);
          if (data?.thumbnail_url) {
            return [data.thumbnail_url, ...current];
          }
        }
        const oembedUrl = getVimeoOembedThumb(video.url);
        if (!oembedUrl) return current;

        const resp = await fetch(oembedUrl, { headers: { Accept: 'application/json' } });
        if (!resp.ok) return current;
        const data = await resp.json();
        if (data?.thumbnail_url) {
          localStorage.setItem(key, JSON.stringify({ thumbnail_url: data.thumbnail_url, ts: Date.now() }));
          return [data.thumbnail_url, ...current];
        }
      } catch {
        // Ignore
      }
      return current;
    }

    async function run() {
      // Insert potential oEmbed ahead of existing vimeo candidates
      let candidates = initialCandidates;
      if (video?.sourceType === 'vimeo') {
        candidates = await resolveVimeoWithOembed(initialCandidates);
      }

      for (const url of candidates) {
        if (cancelled) return;
        if (!url || triedRef.current.has(url)) continue;
        triedRef.current.add(url);

        // Validate by preloading and checking dimensions
        const ok = await testImage(url);
        if (cancelled) return;
        if (ok) {
          setResolved(url);
          setIsResolving(false);
          return;
        }
      }
      if (!cancelled) {
        setResolved(fallback);
        setIsResolving(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [initialCandidates, video, fallback]);

  // onError handler to cascade to next unresolved candidate
  const onError = async () => {
    // Attempt remaining candidates (if any)
    const remaining = initialCandidates.filter((u) => !triedRef.current.has(u));
    for (const url of remaining) {
      const ok = await testImage(url);
      if (ok) {
        setResolved(url);
        return;
      }
      triedRef.current.add(url);
    }
    setResolved(fallback);
  };

  const onLoad = () => setLoaded(true);

  return {
    url: resolved || fallback,
    loaded,
    isResolving,
    onError,
    onLoad,
  };
}
