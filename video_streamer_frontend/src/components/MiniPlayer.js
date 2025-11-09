import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { useThumbnail } from '../utils/useThumbnail';

/**
 * PUBLIC_INTERFACE
 * MiniPlayer docks when main player scrolls out of view.
 * YouTube-only: renders a lightweight iframe preview; click returns to main player.
 * Props:
 * - video: current video object
 * - onClick: called when user clicks body to scroll/focus back to main player
 * - onClose: called when user closes mini player (will hide until main player is back in view)
 */
export default function MiniPlayer({ video, onClick, onClose }) {
  const {
    showMini,
    providerType,
    playing,
  } = useContext(PlayerContext);
  const miniRef = useRef(null);
  const [pendingBlocked, setPendingBlocked] = useState(false);

  const { url: posterUrl } = useThumbnail(video || {}, { fallback: '/assets/thumbnail-fallback.jpg' });

  useEffect(() => {
    setPendingBlocked(false);
  }, [providerType, video?.id]);

  const iframeData = useMemo(() => {
    if (!video) return null;
    if (video.sourceType === 'youtube') {
      const id = video.youtubeId;
      const params = new URLSearchParams({
        rel: '0',
        modestbranding: '1',
        autoplay: '0',
        playsinline: '1',
      });
      return {
        src: `https://www.youtube.com/embed/${id}?${params.toString()}`,
        allow:
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      };
    }
    return null;
  }, [video]);

  if (!showMini) return null;

  return (
    <div
      className="mini-player"
      ref={miniRef}
      role="button"
      aria-label="Mini player"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="mini-video" style={{ position: 'relative' }}>
        {video?.sourceType === 'youtube' ? (
          <iframe
            title={`${video.title} mini`}
            src={iframeData?.src}
            allow={iframeData?.allow}
            allowFullScreen
            frameBorder="0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          />
        ) : (
          <img
            src={posterUrl}
            alt="Video poster"
            loading="lazy"
            decoding="async"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}

        <div className="mini-overlay">
          <div className="mini-title" title={video?.title}>{video?.title}</div>
          <div className="mini-controls">
            <button
              className="mini-btn close"
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }}
              aria-label="Close mini player"
            >
              ✕
            </button>
          </div>
        </div>

        {pendingBlocked && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(180deg, rgba(0,0,0,.2), rgba(0,0,0,.5))',
            }}
            role="dialog"
            aria-live="polite"
          >
            <button className="btn-primary" aria-label="Play video">
              ▶ Play
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
