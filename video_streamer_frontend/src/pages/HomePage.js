import React, { useEffect, useMemo, useState } from 'react';
import VideoGrid from '../components/VideoGrid';
import videosRaw from '../data/videos';

/**
 * PUBLIC_INTERFACE
 * HomePage shows a curated grid of YouTube videos with a simple search filter.
 */
export default function HomePage() {
  const [query, setQuery] = useState('');
  const [embedOkMap, setEmbedOkMap] = useState({});

  // Cache key helpers
  const readEmbedCache = (id) => {
    try {
      const raw = localStorage.getItem(`sv:oembed:${id}`);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || !obj.ok || !obj.exp) return null;
      if (Date.now() > obj.exp) {
        localStorage.removeItem(`sv:oembed:${id}`);
        return null;
      }
      return obj.ok === true;
    } catch {
      return null;
    }
  };
  const writeEmbedCache = (id, ok) => {
    try {
      const ttl = 7 * 24 * 60 * 60 * 1000;
      const exp = Date.now() + ttl;
      localStorage.setItem(`sv:oembed:${id}`, JSON.stringify({ ok, exp }));
    } catch {
      // ignore
    }
  };

  // Normalize dataset
  const normalized = useMemo(() => {
    if (!Array.isArray(videosRaw)) return [];
    return videosRaw.map((v, idx) => ({
      id: v.youtubeId || String(idx),
      title: v.title,
      sourceType: 'youtube',
      url: v.youtubeId ? `https://www.youtube.com/watch?v=${v.youtubeId}` : undefined,
      youtubeId: v.youtubeId,
      channel: v.channel || 'Official Channel',
      views: v.views || '',
      uploadedAt: v.uploadedAt || '',
      duration: v.duration || '',
      description: v.description || '',
      thumbnail: v.thumbnail,
      embeddable: v.embeddable === true,
    }));
  }, []);

  // Preflight availability via oEmbed (no-cors)
  useEffect(() => {
    let cancelled = false;
    const doCheck = async () => {
      const entries = normalized;
      const map = {};
      for (const v of entries) {
        const id = v.youtubeId;
        if (!id) continue;
        const cached = readEmbedCache(id);
        if (cached !== null) {
          map[id] = cached;
          continue;
        }
        try {
          const controller = new AbortController();
          const t = setTimeout(() => controller.abort(), 750);
          // No-cors fetch; even if opaque, we proceed to assume ok if no network error
          await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, {
            mode: 'no-cors',
            cache: 'force-cache',
            signal: controller.signal,
          });
          clearTimeout(t);
          map[id] = true;
          writeEmbedCache(id, true);
        } catch {
          map[id] = false;
          writeEmbedCache(id, false);
        }
      }
      if (!cancelled) setEmbedOkMap(map);
    };
    doCheck();
    return () => { cancelled = true; };
  }, [normalized]);

  const filtered = useMemo(() => {
    const onlyYouTube = normalized
      .filter((v) => v.sourceType === 'youtube' && v.embeddable !== false)
      .filter((v) => {
        const ok = embedOkMap[v.youtubeId];
        // If we don't have a verdict yet, show optimistically; once preflight marks false, it will disappear
        return ok !== false;
      });

    if (!query.trim()) return onlyYouTube;
    const q = query.toLowerCase();
    return onlyYouTube.filter(
      (v) =>
        (v.title || '').toLowerCase().includes(q) ||
        (v.channel || '').toLowerCase().includes(q)
    );
  }, [query, normalized, embedOkMap]);

  return (
    <div className="container">
      <div style={{ marginBottom: 12 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search videos"
          aria-label="Search videos"
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 12,
            border: '1px solid var(--border)',
            outline: 'none',
            background: '#fff',
          }}
        />
      </div>
      <VideoGrid items={filtered} />
    </div>
  );
}
