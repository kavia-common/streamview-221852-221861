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
  const { videos, ready } = useContext(CatalogContext);

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

  const renderSkeletonGrid = () => {
    const placeholders = Array.from({ length: 30 });
    return (
      <div className="grid" role="list" aria-busy="true" aria-live="polite">
        {placeholders.map((_, i) => (
          <div key={`skeleton-${i}`} role="listitem" className="card">
            <div className="thumb" aria-label="Loading thumbnail">
              <div className="skeleton" aria-hidden />
            </div>
            <div className="meta" style={{ marginTop: 8 }}>
              <div className="avatar" aria-hidden />
              <div>
                <div className="title" style={{ background: 'rgba(0,0,0,0.05)', height: 16, borderRadius: 6, marginBottom: 8 }} />
                <div className="sub" style={{ background: 'rgba(0,0,0,0.05)', height: 12, borderRadius: 6, width: '70%' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

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
      {!ready ? renderSkeletonGrid() : <VideoGrid items={filtered} />}
    </div>
  );
}
