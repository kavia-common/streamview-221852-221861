import React, { useContext, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import VideoCard from '../components/VideoCard';
import MiniPlayer from '../components/MiniPlayer';
import { PlayerContext } from '../context/PlayerContext';
import { CatalogContext } from '../context/CatalogContext';

/**
 * PUBLIC_INTERFACE
 * WatchPage renders the selected video, metadata, and a related list.
 * Uses CatalogContext to ensure items are embed_ok and persisted.
 */
export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowMini } = useContext(PlayerContext);
  const { videos } = useContext(CatalogContext);

  const list = Array.isArray(videos) ? videos : [];
  const video = useMemo(() => list.find((v) => v.id === id) || null, [list, id]);

  const { nextItem } = useMemo(() => {
    const idx = list.findIndex((v) => v.id === id);
    const next = idx >= 0 && idx + 1 < list.length ? list[idx + 1] : null;
    return { nextItem: next };
  }, [id, list]);

  const related = useMemo(() => {
    const rest = list.filter((v) => v.id !== id);
    return rest.slice(0, 10);
  }, [id, list]);

  if (!video) {
    return (
      <div className="container">
        <p>Video not found or unavailable to embed.</p>
        <Link to="/">Go Home</Link>
      </div>
    );
  }

  const handleEnded = () => {
    if (nextItem) {
      navigate(`/watch/${nextItem.id}`);
      setShowMini(false);
    }
  };

  const onIntersectChange = (isVisible) => {
    if (isVisible) setShowMini(false);
  };

  const shouldAutoplay = (() => {
    const stateFlag = location?.state && (location.state.autoplay === true || location.state.autoplay === 1);
    const searchParams = new URLSearchParams(location.search || '');
    const queryFlag = ['1', 'true', 'yes'].includes((searchParams.get('autoplay') || '').toLowerCase());
    return !!(stateFlag || queryFlag);
  })();

  const playerProps = {
    video,
    onEnded: handleEnded,
    onIntersectChange,
    nextVideo: nextItem || null,
    shouldAutoplay,
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <button
          className="btn-secondary back-btn"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate('/');
            }
          }}
          aria-label="Go back"
        >
          ← Back
        </button>
        <div className="sub" aria-hidden style={{ marginLeft: 4 }}>
          {video.title}
        </div>
      </div>

      <div className="watch-layout">
        <div>
          <VideoPlayer {...playerProps} />
          <div className="section">
            <h2 style={{ margin: '4px 0 8px 0' }}>{video.title}</h2>
            {video.channel && (
              <div className="sub" style={{ marginBottom: 8 }}>
                {video.channel} • {video.views} • {video.uploadedAt}
              </div>
            )}
            {video.attribution && (
              <div className="sub" style={{ marginBottom: 8, fontSize: 12, opacity: 0.85 }}>
                {video.attribution}
              </div>
            )}
            {video.description && <p style={{ margin: 0 }}>{video.description}</p>}
          </div>
        </div>
        <aside>
          <div className="section">
            <h3 style={{ marginTop: 0 }}>Related</h3>
            <div className="related">
              {related.map((v) => (
                <VideoCard key={v.id} video={v} compact />
              ))}
            </div>
          </div>
        </aside>
      </div>

      <MiniPlayer
        video={video}
        onClick={() => {
          const el = document.querySelector('.player-wrap');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        onClose={() => {
          setShowMini(false);
        }}
      />
    </div>
  );
}
