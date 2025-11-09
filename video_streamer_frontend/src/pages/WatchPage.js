import React, { useContext, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import videosRaw from '../data/videos';
import VideoCard from '../components/VideoCard';
import MiniPlayer from '../components/MiniPlayer';
import { PlayerContext } from '../context/PlayerContext';

/**
 * PUBLIC_INTERFACE
 * WatchPage renders the selected video, metadata, and a related list.
 * - Computes the ordered playlist from the curated set and current index
 * - Handles autoplay-next navigation with a countdown overlay via VideoPlayer
 * - Shows a scroll-docked mini-player when the main player leaves the viewport
 * - Mobile-first: player and related list stack; mini-player docks on small screens
 */
export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowMini } = useContext(PlayerContext);

  // Normalize dataset
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
      thumbnail: v.thumbnail,
    }));
  }, []);

  const video = useMemo(() => normalized.find((v) => v.id === id) || null, [normalized, id]);

  const ytOnly = normalized;
  const { nextItem } = useMemo(() => {
    const idx = ytOnly.findIndex((v) => v.id === id);
    const next = idx >= 0 && idx + 1 < ytOnly.length ? ytOnly[idx + 1] : null;
    return { nextItem: next };
  }, [id, ytOnly]);

  const related = useMemo(() => {
    const rest = ytOnly.filter((v) => v.id !== id);
    return rest.slice(0, 10);
  }, [id, ytOnly]);

  if (!video || video.sourceType !== 'youtube') {
    return (
      <div className="container">
        <p>Video not found or unsupported. Only YouTube videos are available.</p>
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
            <div className="sub" style={{ marginBottom: 8 }}>
              {video.channel} • {video.views} • {video.uploadedAt}
            </div>
            <p style={{ margin: 0 }}>{video.description}</p>
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
        isMp4={false}
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
