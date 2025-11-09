import React, { useContext, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import { getVideoById, videos } from '../data/videos';
import VideoCard from '../components/VideoCard';
import MiniPlayer from '../components/MiniPlayer';
import { PlayerContext } from '../context/PlayerContext';

/**
 * PUBLIC_INTERFACE
 * WatchPage renders the selected video, metadata, and a related list.
 * It also:
 * - Computes the ordered playlist from the curated set and current index
 * - Handles autoplay-next navigation with a countdown overlay via VideoPlayer
 * - Shows a scroll-docked mini-player when the main player leaves the viewport
 */
export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowMini } = useContext(PlayerContext);
  const video = getVideoById(id);
  const mainVideoRef = useRef(null); // pass through to MiniPlayer for play/pause control (mp4 only)

  // Compute playlist and next/prev indices
  const { ordered, currentIndex, nextItem } = useMemo(() => {
    const orderedList = videos.slice(); // already curated order
    const idx = orderedList.findIndex((v) => v.id === id);
    const next = idx >= 0 && idx + 1 < orderedList.length ? orderedList[idx + 1] : null;
    return { ordered: orderedList, currentIndex: idx, nextItem: next };
  }, [id]);

  const related = useMemo(() => {
    const rest = videos.filter((v) => v.id !== id);
    return rest.slice(0, 8);
  }, [id]);

  if (!video) {
    return (
      <div className="container">
        <p>Video not found.</p>
        <Link to="/">Go Home</Link>
      </div>
    );
  }

  const handleEnded = () => {
    if (nextItem) {
      navigate(`/watch/${nextItem.id}`);
      // after navigation, hide mini until intersection updates again
      setShowMini(false);
    }
  };

  const onIntersectChange = (isVisible) => {
    // If user scrolled back to main player, hide mini
    if (isVisible) setShowMini(false);
  };

  // Determine initial autoplay intent from route state or query param
  const shouldAutoplay = (() => {
    const stateFlag = location?.state && (location.state.autoplay === true || location.state.autoplay === 1);
    const searchParams = new URLSearchParams(location.search || '');
    const queryFlag = ['1', 'true', 'yes'].includes((searchParams.get('autoplay') || '').toLowerCase());
    return !!(stateFlag || queryFlag);
  })();

  // Pass a ref to VideoPlayer's video element for mp4 to control from MiniPlayer
  const playerProps = {
    video,
    onEnded: handleEnded,
    onIntersectChange,
    nextVideo: nextItem || null,
    shouldAutoplay,
  };

  return (
    <div className="container">
      <div className="watch-layout">
        <div>
          {/* Attach ref for mp4 access via prop injection by cloning in VideoPlayer not implemented; use data-attr to query later if needed */}
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

      {/* Mini player: clicking scrolls back to main player */}
      <MiniPlayer
        video={video}
        isMp4={video.sourceType === 'mp4'}
        mainVideoEl={mainVideoRef /* currently unused due to VideoPlayer encapsulation */}
        onClick={() => {
          // Scroll to top of the main player
          const el = document.querySelector('.player-wrap');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        onClose={() => {
          // Hide until the main player is back in view (IntersectionObserver will re-open)
          setShowMini(false);
        }}
      />
    </div>
  );
}
