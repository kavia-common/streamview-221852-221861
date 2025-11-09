import React, { useMemo, useState } from 'react';
import VideoGrid from '../components/VideoGrid';
import { videos } from '../data/videos';

/**
 * PUBLIC_INTERFACE
 * HomePage shows a curated grid of YouTube videos with a simple search filter.
 */
export default function HomePage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const onlyYouTube = videos.filter((v) => v.sourceType === 'youtube');
    if (!query.trim()) return onlyYouTube;
    const q = query.toLowerCase();
    return onlyYouTube.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.channel.toLowerCase().includes(q)
    );
  }, [query]);

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
