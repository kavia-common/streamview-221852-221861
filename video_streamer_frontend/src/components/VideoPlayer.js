import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';

/**
 * PUBLIC_INTERFACE
 * VideoPlayer displays a video based on sourceType: 'mp4' | 'youtube' | 'vimeo'.
 * - MP4 uses the native <video> element and the Picture-in-Picture API.
 * - YouTube/Vimeo are embedded via iframe; PiP is attempted using browser-level support (rare) and otherwise a tooltip explains limitations.
 * Props:
 * - video: required video object
 * - onEnded: optional callback invoked when playback ends (mp4 native end or manual "Play Now" in overlay). Receives event.
 * - onIntersectChange: optional callback(boolean) called when main player visibility changes via IntersectionObserver.
 * - nextVideo: optional video object for next up (used for overlay preview/title).
 */
export default function VideoPlayer({ video, onEnded, onIntersectChange, nextVideo }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [pipSupported, setPipSupported] = useState(false);
  const [pipStatus, setPipStatus] = useState('');
  const { autoplay, toggleAutoplay, setShowMini } = useContext(PlayerContext);

  // countdown state for autoplay
  const [countdown, setCountdown] = useState(null); // number or null
  const [countdownActive, setCountdownActive] = useState(false);
  const COUNTDOWN_SECS = 3;

  useEffect(() => {
    // Detect PiP support for MP4
    const el = document.createElement('video');
    setPipSupported('requestPictureInPicture' in el);
  }, []);

  // Reset countdown when video changes
  useEffect(() => {
    setCountdown(null);
    setCountdownActive(false);
  }, [video?.id]);

  // Setup IntersectionObserver to detect when player scrolls out of view
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setShowMini(!isVisible);
        if (onIntersectChange) onIntersectChange(isVisible);
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [onIntersectChange, setShowMini]);

  const embed = useMemo(() => {
    if (video.sourceType === 'youtube') {
      const match =
        video.url.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{6,})/) ||
        video.url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/);
      const id = match ? match[1] : '';
      return {
        src: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`,
        allow:
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      };
    }
    if (video.sourceType === 'vimeo') {
      const match = video.url.match(/vimeo\.com\/(\d+)/);
      const id = match ? match[1] : '';
      return {
        src: `https://player.vimeo.com/video/${id}`,
        allow: 'autoplay; fullscreen; picture-in-picture',
      };
    }
    return null;
  }, [video]);

  const tryEnterPipForIframe = async () => {
    try {
      // @ts-ignore
      if (document.pictureInPictureEnabled || document.documentPictureInPicture) {
        setPipStatus('PiP is controlled by the embedded provider; try the player’s own PiP button if visible.');
      } else {
        setPipStatus('Picture-in-Picture is not available for embedded players in this browser.');
      }
    } catch (e) {
      setPipStatus('Unable to activate PiP for embedded players.');
    }
  };

  const handlePip = async () => {
    if (video.sourceType === 'mp4') {
      try {
        const el = videoRef.current;
        if (!el) return;
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await el.requestPictureInPicture();
        }
        setPipStatus('');
      } catch (e) {
        setPipStatus('PiP is not available or was blocked by the browser.');
      }
      return;
    }
    await tryEnterPipForIframe();
  };

  // Handle natural end for MP4; for embedded sources we cannot reliably detect end, so overlay is manual
  const onMp4Ended = (e) => {
    if (!autoplay) {
      if (onEnded) onEnded(e);
      return;
    }
    // start countdown then trigger onEnded after COUNTDOWN_SECS unless canceled
    setCountdown(COUNTDOWN_SECS);
    setCountdownActive(true);
  };

  // Countdown effect
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

  return (
    <div className="player-wrap" ref={containerRef}>
      <div className="player-area" aria-label="Video player area">
        {video.sourceType === 'mp4' ? (
          <video
            ref={videoRef}
            controls
            src={video.url}
            preload="metadata"
            style={{ backgroundColor: 'black' }}
            onEnded={onMp4Ended}
          />
        ) : (
          <iframe
            title={video.title}
            src={embed?.src}
            allow={embed?.allow}
            allowFullScreen
            frameBorder="0"
          />
        )}

        {/* Autoplay overlay */}
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
        <button className="btn-primary" onClick={handlePip}>
          ▶ Picture-in-Picture
        </button>
        {video.sourceType === 'mp4' && (
          <span className="pip-tooltip">
            {pipSupported ? 'PiP supported' : 'PiP may not be supported in this browser.'}
          </span>
        )}
        {pipStatus && <span className="pip-tooltip">• {pipStatus}</span>}
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
