import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { useThumbnail } from '../utils/useThumbnail';

/**
 * PUBLIC_INTERFACE
 * MiniPlayer docks when main player scrolls out of view.
 * Renders actual media content to avoid black screen.
 * Props:
 * - video: current video object
 * - onClick: called when user clicks body to scroll/focus back to main player
 * - onClose: called when user closes mini player (will hide until main player is back in view)
 * - isMp4: boolean if current is mp4
 */
export default function MiniPlayer({ video, onClick, onClose, isMp4 = false }) {
  const {
    showMini,
    mainVideoRef,
    playing,
    providerType,
    activeHandle,
    currentTime,
  } = useContext(PlayerContext);
  const miniRef = useRef(null);
  const [pendingBlocked, setPendingBlocked] = useState(false);

  // Resolve poster/thumbnail to show until playback starts
  const { url: posterUrl } = useThumbnail(video || {}, { fallback: '/assets/thumbnail-fallback.jpg' });

  // Single element strategy for MP4: operate on the same HTMLVideoElement via context
  const togglePlay = async (e) => {
    e.stopPropagation();
    const el = mainVideoRef?.current;
    if (!el) return;
    try {
      if (el.paused) {
        // muted retry on mini to satisfy autoplay when docking
        el.muted = true;
        await el.play().catch(() => setPendingBlocked(true));
      } else {
        el.pause();
      }
    } catch {
      setPendingBlocked(true);
    }
  };

  const unmuteOnGesture = async (e) => {
    e.stopPropagation();
    const el = mainVideoRef?.current;
    if (!el) return;
    try {
      el.muted = false;
      await el.play();
      setPendingBlocked(false);
    } catch {
      // still blocked, keep overlay
      setPendingBlocked(true);
    }
  };

  const handlePip = async (e) => {
    e.stopPropagation();
    try {
      const el = mainVideoRef?.current;
      if (isMp4 && el) {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await el.requestPictureInPicture();
        }
      } else {
        alert('PiP is controlled by the embedded provider; use the player’s own PiP button if visible.');
      }
    } catch {
      alert('Unable to enter Picture-in-Picture.');
    }
  };

  useEffect(() => {
    // reset overlay when provider changes
    setPendingBlocked(false);
  }, [providerType, video?.id]);

  // For iframe providers, compute iframe data unconditionally to satisfy hooks rules.
  const iframeData = useMemo(() => {
    if (!video || !providerType) return null;
    if (providerType === 'youtube') {
      const match =
        video.url.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{6,})/) ||
        video.url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/);
      const id = match ? match[1] : '';
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
    if (providerType === 'vimeo') {
      const match = video.url.match(/vimeo\.com\/(\d+)/);
      const id = match ? match[1] : '';
      const params = new URLSearchParams({
        autoplay: '0',
        title: '0',
        byline: '0',
        portrait: '0',
        playsinline: '1',
      });
      return {
        src: `https://player.vimeo.com/video/${id}?${params.toString()}`,
        allow: 'autoplay; fullscreen; picture-in-picture',
      };
    }
    return null;
  }, [providerType, video]);

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
        {providerType === 'mp4' ? (
          <>
            {/* Render poster under overlay; actual playback is through the mainVideoRef element outside, but we show poster to avoid black frame */}
            <img
              src={posterUrl}
              alt="Video poster"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: playing ? 'none' : 'block',
              }}
            />
            {/* Control buttons overlay */}
          </>
        ) : providerType === 'youtube' || providerType === 'vimeo' ? (
          // Render provider iframe to avoid black box — single instance per provider type as mini preview
          <iframe
            title={`${video.title} mini`}
            src={iframeData?.src}
            allow={iframeData?.allow}
            allowFullScreen
            frameBorder="0"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          />
        ) : (
          // Fallback poster if provider not recognized
          <img
            src={posterUrl}
            alt="Video poster"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}

        <div className="mini-overlay">
          <div className="mini-title" title={video?.title}>{video?.title}</div>
          <div className="mini-controls">
            <button className="mini-btn" onClick={togglePlay} aria-label="Play/Pause">
              {playing ? '❚❚' : '▶'}
            </button>
            <button className="mini-btn" onClick={handlePip} aria-label="Picture-in-Picture" disabled={providerType !== 'mp4'}>⤢</button>
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

        {/* Inline Play overlay when blocked or when not playing for MP4 */}
        {(pendingBlocked || (providerType === 'mp4' && !playing)) && (
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
            onClick={(e) => { e.stopPropagation(); unmuteOnGesture(e); }}
          >
            <button
              className="btn-primary"
              onClick={(e) => { e.stopPropagation(); unmuteOnGesture(e); }}
              aria-label="Play video"
            >
              ▶ Play
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
