import React, { useContext, useMemo } from 'react';
import { CatalogContext } from '../context/CatalogContext';
import { Link } from 'react-router-dom';
import VideoCard from '../components/VideoCard';

/**
 * PUBLIC_INTERFACE
 * DashboardPage summarizes catalog statistics and offers quick navigation.
 * - KPIs: totals by provider and overall
 * - Counts per playlist
 * - Recently added (tail of mixed list)
 * - Quick actions placeholders: continue watching (future), top picks (simple head list)
 */
export default function DashboardPage() {
  const { counts, playlists, mixedVideos, ready } = useContext(CatalogContext);

  const recent = useMemo(() => {
    const list = Array.isArray(mixedVideos) ? mixedVideos.slice(-8) : [];
    return list.reverse();
  }, [mixedVideos]);

  const topPicks = useMemo(() => {
    const list = Array.isArray(mixedVideos) ? mixedVideos.slice(0, 6) : [];
    return list;
  }, [mixedVideos]);

  if (!ready) {
    return (
      <div className="container">
        <div className="section"><p>Building dashboard…</p></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="kpi-grid" role="region" aria-label="Key metrics">
        <div className="kpi-tile">
          <div className="kpi-label">Total</div>
          <div className="kpi-value">{counts.total}</div>
        </div>
        <div className="kpi-tile">
          <div className="kpi-label">YouTube</div>
          <div className="kpi-value">{counts.youtube}</div>
        </div>
        <div className="kpi-tile">
          <div className="kpi-label">MP4</div>
          <div className="kpi-value">{counts.mp4}</div>
        </div>
        <div className="kpi-tile">
          <div className="kpi-label">Vimeo</div>
          <div className="kpi-value">{counts.vimeo}</div>
        </div>
      </div>

      <div className="section">
        <h2 style={{ marginTop: 0 }}>Playlists</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {Array.isArray(playlists) && playlists.filter(p => p.count > 0).map((p) => (
            <Link key={p.id} to={`/playlist/${p.id}`} className="card-interactive" style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: 12, background: 'var(--surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="chip accent">{p.badge}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{p.title}</div>
                  <div className="sub">{p.count} items</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 style={{ marginTop: 0 }}>Recently Added</h2>
        <div className="grid" role="list">
          {recent.map((v) => (
            <div key={v.id} role="listitem">
              <VideoCard video={v} />
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 style={{ marginTop: 0 }}>Top Picks</h2>
        <div className="grid" role="list">
          {topPicks.map((v) => (
            <div key={v.id} role="listitem">
              <VideoCard video={v} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
