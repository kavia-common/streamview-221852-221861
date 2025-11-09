import React, { useMemo, useState, useContext } from 'react';
import VideoGrid from '../components/VideoGrid';
import { CatalogContext } from '../context/CatalogContext';

/**
 * PUBLIC_INTERFACE
 * HomePage shows a curated grid of videos (YouTube + MP4) with a simple search filter.
 * Uses CatalogContext to ensure items are finalized and persisted.
 */
export default function HomePage() {
  const [query, setQuery] = useState('');
  const { mixedVideos, ready, counts } = useContext(CatalogContext);

  const filtered = useMemo(() => {
    const list = Array.isArray(mixedVideos) ? mixedVideos : [];
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(
      (v) =>
        (v.title || '').toLowerCase().includes(q) ||
        (v.channel || '').toLowerCase().includes(q)
    );
  }, [query, mixedVideos]);

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search videos"
          aria-label="Search videos"
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: 12,
            border: '1px solid var(--border)',
            outline: 'none',
            background: '#fff',
          }}
        />
        {ready && (
          <div className="sub" aria-live="polite" title="Catalog counts">
            Total: {counts?.total || filtered.length} • YT: {counts?.youtube || 0} • MP4: {counts?.mp4 || 0} • Vimeo: {counts?.vimeo || 0}
          </div>
        )}
      </div>
      {!ready ? renderSkeletonGrid() : <VideoGrid items={filtered} />}
    </div>
  );
}
