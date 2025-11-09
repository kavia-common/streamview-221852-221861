import React, { useMemo, useState, useContext } from 'react';
import VideoGrid from '../components/VideoGrid';
import { CatalogContext } from '../context/CatalogContext';

/**
 * PUBLIC_INTERFACE
 * HomePage shows a curated grid of YouTube videos with a simple search filter.
 * Uses CatalogContext to ensure items are embed_ok and persisted.
 */
export default function HomePage() {
  const [query, setQuery] = useState('');
  const { videos } = useContext(CatalogContext);

  const filtered = useMemo(() => {
    const list = Array.isArray(videos) ? videos : [];
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(
      (v) =>
        (v.title || '').toLowerCase().includes(q) ||
        (v.channel || '').toLowerCase().includes(q)
    );
  }, [query, videos]);

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
