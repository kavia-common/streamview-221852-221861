import { useEffect, useMemo, useRef, useState } from 'react';
import { buildYouTubeCandidates, extractYouTubeId } from './thumbnails';

/**
 * PUBLIC_INTERFACE
 * useThumbnail(video, options): Resolve the best thumbnail URL asynchronously for a given video object.
 * - Shows a skeleton state until the first successful image loads
 * - Tries high quality candidates first and cascades on error
 * - Mobile-first perf: async decoding, robust onError fallback
 */
export function useThumbnail(video, options = {}) {
  const { fallback = '/assets/thumbnail-fallback.jpg' } = options;
  const [resolved, setResolved] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isResolving, setIsResolving] = useState(true);
  const triedRef = useRef(new Set());

  const initialCandidates = useMemo(() => {
    if (!video) return [fallback];

    const candidates = [];

    // Try explicit data thumbnail first (if any)
    if (video.thumbnail && typeof video.thumbnail === 'string') {
      candidates.push(video.thumbnail);
    }

    if (video.sourceType === 'youtube') {
      const ytId = video.youtubeId || video.videoId || extractYouTubeId(video.url);
      candidates.push(...buildYouTubeCandidates(ytId));
    }

    const unique = Array.from(new Set(candidates.filter(Boolean)));
    unique.push(fallback);
    return unique;
  }, [video, fallback]);

  const testImage = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
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

    async function run() {
      const candidates = initialCandidates;

      for (const url of candidates) {
        if (cancelled) return;
        if (!url || triedRef.current.has(url)) continue;
        triedRef.current.add(url);

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

  const onError = async () => {
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
