import React, { useMemo, useState, useContext } from 'react';
import VideoGrid from '../components/VideoGrid';
import { CatalogContext } from '../context/CatalogContext';

/**
 * PUBLIC_INTERFACE
 * HomePage shows a curated grid of videos (YouTube + MP4 + Vimeo) with KAVIA search and filters.
 * - Search across title, channel, and tags
 * - Filters by provider and playlist
 */
export default function HomePage() {
  const [query, setQuery] = useState('');
  const [provider, setProvider] = useState('all'); // all | youtube | mp4 | vimeo
  const [playlistFilter, setPlaylistFilter] = useState('all'); // all or playlist id
  const { mixedVideos, ready, counts, playlists } = useContext(CatalogContext);

  const filtered = useMemo(() => {
    const list = Array.isArray(mixedVideos) ? mixedVideos : [];
    const q = (query || '').trim().toLowerCase();
    return list.filter((v) => {
      if (provider !== 'all' && v.sourceType !== provider) return false;
      if (playlistFilter !== 'all') {
        const arr = Array.isArray(v.playlistIds) ? v.playlistIds : [];
        if (!arr.includes(playlistFilter)) return false;
      }
      if (!q) return true;
      const inTitle = (v.title || '').toLowerCase().includes(q);
      const inChannel = (v.channel || '').toLowerCase().includes(q);
      const inTags = Array.isArray(v.tags) ? v.tags.some(t => String(t).toLowerCase().includes(q)) : false;
      return inTitle || inChannel || inTags;
    });
  }, [query, mixedVideos, provider, playlistFilter, playlists]);

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
      <div className="section" style={{ display: 'grid', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, channel, or tags"
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
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <label className="chip" htmlFor="provider-select">Provider</label>
          <select
            id="provider-select"
            aria-label="Filter by provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid var(--border)' }}
          >
            <option value="all">All</option>
            <option value="youtube">YouTube</option>
            <option value="mp4">MP4</option>
            <option value="vimeo">Vimeo</option>
          </select>

          <label className="chip" htmlFor="playlist-select">Playlist</label>
          <select
            id="playlist-select"
            aria-label="Filter by playlist"
            value={playlistFilter}
            onChange={(e) => setPlaylistFilter(e.target.value)}
            style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid var(--border)' }}
          >
            <option value="all">All</option>
            {Array.isArray(playlists) && playlists.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>
      {!ready ? renderSkeletonGrid() : <VideoGrid items={filtered} />}
    </div>
  );
}
