import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CatalogContext } from '../context/CatalogContext';
import VideoCard from '../components/VideoCard';

/**
 * PUBLIC_INTERFACE
 * PlaylistsPage renders horizontally scrollable shelves for each playlist with a "View All" link.
 */
export default function PlaylistsPage() {
  const { playlists, playlistsMap, ready } = useContext(CatalogContext);

  const entries = useMemo(() => {
    return Array.isArray(playlists) ? playlists.filter(p => (playlistsMap[p.id] || []).length > 0) : [];
  }, [playlists, playlistsMap]);

  if (!ready) {
    return (
      <div className="container">
        <div className="section">
          <p>Preparing playlists…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {entries.map((pl) => {
        const items = playlistsMap[pl.id] || [];
        const sample = items.slice(0, 8);
        return (
          <div key={pl.id} className="shelf">
            <div className="shelf-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="chip accent">{pl.badge}</span>
                <h2 style={{ margin: 0 }}>{pl.title}</h2>
                <span className="sub">{pl.description}</span>
              </div>
              <Link className="btn-secondary" to={`/playlist/${pl.id}`} aria-label={`View all ${pl.title}`}>View All</Link>
            </div>
            <div className="shelf-row" role="list">
              {sample.map((v) => (
                <div key={v.id} role="listitem">
                  <div className="playlist-card card-interactive" role="button" aria-label={`Open ${v.title}`}>
                    <div className="playlist-poster">
                      <div className="thumb">
                        <img src={v.thumbnail || v.altThumbnail} alt={`${v.title} thumbnail`} loading="lazy" decoding="async" />
                        <span className="badge">{v.duration || '--:--'}</span>
                      </div>
                    </div>
                    <div className="playlist-meta">
                      <div className="playlist-title">{v.title}</div>
                      <div className="playlist-sub">{v.channel || v.attribution}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
