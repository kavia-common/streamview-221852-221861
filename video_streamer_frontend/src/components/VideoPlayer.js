import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';

/**
 * PUBLIC_INTERFACE
 * VideoPlayer (YouTube-first) displays a video. Only YouTube is supported in catalog.
 * - Iframe embeds with allowFullScreen and autoplay handling
 * - Fullscreen button tries requestFullscreen on container and relies on iframe allowfullscreen
 * - Autoplay-next overlay and graceful blocked prompt
 * Props:
 * - video: required video object
 * - onEnded: optional callback invoked when "Play now" or countdown completes.
 * - onIntersectChange: optional callback(boolean) when main player visibility changes (for mini-player docking).
 * - nextVideo: optional video object for next up.
 * - shouldAutoplay: boolean indicating initial intent.
 */
export default function VideoPlayer({ video, onEnded, onIntersectChange, nextVideo, shouldAutoplay = false }) {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const {
    autoplay,
    toggleAutoplay,
    setShowMini,
    setProviderType,
  } = useContext(PlayerContext);

  // countdown for autoplay next
  const [countdown, setCountdown] = useState(null);
  const [countdownActive, setCountdownActive] = useState(false);
  const COUNTDOWN_SECS = 3;

  // autoplay UX
  const [autoplayWanted, setAutoplayWanted] = useState(!!shouldAutoplay);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    setCountdown(null);
    setCountdownActive(false);
    setAutoplayBlocked(false);
    setAutoplayWanted(!!shouldAutoplay);
  }, [video?.id, shouldAutoplay]);

  // Intersection observer to manage mini-player docking
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setShowMini(!isVisible);
        if (onIntersectChange) onIntersectChange(isVisible);
      },
      { threshold: 0.4 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [onIntersectChange, setShowMini]);

  // build YouTube embed params and url
  const embed = useMemo(() => {
    const id = video.youtubeId;
    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      autoplay: autoplayWanted ? '1' : '0',
      playsinline: '1',
      fs: '1',
    });
    return {
      src: `https://www.youtube.com/embed/${id}?${params.toString()}`,
      allow:
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen',
      providerId: id,
    };
  }, [video, autoplayWanted]);

  // Mark provider type in context
  useEffect(() => {
    setProviderType('youtube');
  }, [setProviderType, video?.id]);

  // handle autoplay block for iframe
  useEffect(() => {
    if (!shouldAutoplay) {
      setAutoplayBlocked(false);
      return;
    }
    const t = setTimeout(() => setAutoplayBlocked(true), 1000);
    return () => clearTimeout(t);
  }, [video?.id, shouldAutoplay]);

  // Fullscreen handler - use requestFullscreen on container; iframe has allowfullscreen
  const handleFullscreen = async () => {
    try {
      const node = containerRef.current;
      if (!node) return;
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      if (node.requestFullscreen) {
        await node.requestFullscreen();
      } else {
        alert('Fullscreen is not supported by this browser.');
      }
    } catch {
      alert('Fullscreen request was blocked. You may enable it from browser settings.');
    }
  };

  // Autoplay next countdown controls
  useEffect(() => {
    if (!countdownActive) return;
    if (countdown === null) return;
    if (countdown <= 0) {
      setCountdownActive(false);
      if (onEnded) onEnded({ type: 'autoplay' });
      return;
    }
    const t = setTimeout(() => setCountdown((v) => (v != null ? v - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [countdownActive, countdown, onEnded]);

  const cancelAutoplay = () => {
    setCountdownActive(false);
    setCountdown(null);
  };

  const playNow = () => {
    setCountdownActive(false);
    setCountdown(null);
    if (onEnded) onEnded({ type: 'playnow' });
  };

  const handleUserPlayGesture = () => {
    setAutoplayBlocked(false);
    setAutoplayWanted(true);
    // toggle to refresh iframe src
    setTimeout(() => setAutoplayWanted(false), 0);
  };

  // Since we cannot reliably detect end events from generic iframe without API bindings,
  // we rely on explicit user action; however, we still show an "Up next" overlay
  // if the user toggles a control or when integrating with YT Player API in future.

  return (
    <div className="player-wrap" ref={containerRef}>
      <div className="player-area" aria-label="Video player area">
        <iframe
          ref={iframeRef}
          title={video.title}
          src={embed?.src}
          allow={embed?.allow}
          allowFullScreen
          frameBorder="0"
        />

        {shouldAutoplay && autoplayBlocked && (
          <div className="autoplay-overlay" role="dialog" aria-live="polite">
            <div className="autoplay-card">
              <div className="autoplay-title">Autoplay blocked</div>
              <div className="autoplay-next-title">Tap Play to start watching</div>
              <div className="autoplay-cta">
                <button className="btn-primary" onClick={handleUserPlayGesture} aria-label="Play video now">
                  Play
                </button>
              </div>
            </div>
          </div>
        )}

        {autoplay && (countdownActive || countdown !== null) && nextVideo && (
          <div className="autoplay-overlay" role="dialog" aria-live="polite">
            <div className="autoplay-card">
              <div className="autoplay-title">Up next</div>
              <div className="autoplay-next-title">{nextVideo.title}</div>
              <div className="autoplay-cta">
                <button className="btn-secondary" onClick={cancelAutoplay}>Cancel</button>
                <button className="btn-primary" onClick={playNow}>
                  Play now {countdown !== null ? `(${countdown})` : ''}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="player-controls">
        <button className="btn-primary" onClick={handleFullscreen} aria-label="Enter fullscreen">
          ⛶ Fullscreen
        </button>
        <div style={{ flex: 1 }} />
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <input
            type="checkbox"
            checked={autoplay}
            onChange={toggleAutoplay}
            aria-label="Toggle autoplay next"
          />
          Autoplay next
        </label>
      </div>
    </div>
  );
}
