import React, { useMemo, useState } from 'react';
import VideoGrid from '../components/VideoGrid';
import videosRaw from '../data/videos';

/**
 * PUBLIC_INTERFACE
 * HomePage shows a curated grid of YouTube videos with a simple search filter.
 */
export default function HomePage() {
  const [query, setQuery] = useState('');

  // Normalize the new minimal dataset {title,youtubeId,thumbnail} into the app's working shape
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
      thumbnail: v.thumbnail, // explicit override prioritized by useThumbnail
    }));
  }, []);

  const filtered = useMemo(() => {
    const onlyYouTube = normalized.filter((v) => v.sourceType === 'youtube');
    if (!query.trim()) return onlyYouTube;
    const q = query.toLowerCase();
    return onlyYouTube.filter(
      (v) =>
        (v.title || '').toLowerCase().includes(q) ||
        (v.channel || '').toLowerCase().includes(q)
    );
  }, [query, normalized]);

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
