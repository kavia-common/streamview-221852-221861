import React, { useContext, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CatalogContext } from '../context/CatalogContext';
import VideoGrid from '../components/VideoGrid';

/**
 * PUBLIC_INTERFACE
 * PlaylistDetailsPage lists all items within the selected playlist.
 */
export default function PlaylistDetailsPage() {
  const { id } = useParams();
  const { playlists, getPlaylistItems, ready } = useContext(CatalogContext);

  const playlist = useMemo(() => (Array.isArray(playlists) ? playlists.find(p => p.id === id) : null), [playlists, id]);
  const items = getPlaylistItems(id);

  if (!ready) {
    return (
      <div className="container">
        <div className="section"><p>Loading…</p></div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="container">
        <div className="section">
          <p>Playlist not found.</p>
          <Link to="/playlists">Back to Playlists</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="section" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="chip accent">{playlist.badge}</span>
        <h1 style={{ margin: 0 }}>{playlist.title}</h1>
        <span className="sub">{playlist.description}</span>
      </div>
      <VideoGrid items={items} />
    </div>
  );
}
