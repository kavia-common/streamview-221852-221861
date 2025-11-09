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
export default function VideoPlayer({ video, onEnded, onIntersectChange, nextVideo, shouldAutoplay = false }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [pipSupported, setPipSupported] = useState(false);
  const [pipStatus, setPipStatus] = useState('');
  const { autoplay, toggleAutoplay, setShowMini, mainVideoRef, setPlaying } = useContext(PlayerContext);

  // countdown state for autoplay
  const [countdown, setCountdown] = useState(null); // number or null
  const [countdownActive, setCountdownActive] = useState(false);
  const COUNTDOWN_SECS = 3;

  // autoplay UX state
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplayWanted, setAutoplayWanted] = useState(!!shouldAutoplay);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    // Detect PiP support for MP4
    const el = document.createElement('video');
    setPipSupported('requestPictureInPicture' in el);
  }, []);

  // Reset countdown and autoplay flags when video changes
  useEffect(() => {
    setCountdown(null);
    setCountdownActive(false);
    setIsPlaying(false);
    setAutoplayBlocked(false);
    setAutoplayWanted(!!shouldAutoplay);
  }, [video?.id, shouldAutoplay]);

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
      // Add autoplay=1 but rely on policies; mute is often required. We do not force mute, we show prompt if blocked.
      const params = new URLSearchParams({
        rel: '0',
        modestbranding: '1',
        autoplay: autoplayWanted ? '1' : '0',
        playsinline: '1',
      });
      return {
        src: `https://www.youtube.com/embed/${id}?${params.toString()}`,
        allow:
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      };
    }
    if (video.sourceType === 'vimeo') {
      const match = video.url.match(/vimeo\.com\/(\d+)/);
      const id = match ? match[1] : '';
      const params = new URLSearchParams({
        autoplay: autoplayWanted ? '1' : '0',
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
  }, [video, autoplayWanted]);

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

  // Attempt autoplay for MP4 on mount/src change and bind shared ref/state
  useEffect(() => {
    if (video.sourceType !== 'mp4') {
      // For embeds, clear shared ref and playing state
      if (mainVideoRef) mainVideoRef.current = null;
      setPlaying(false);
      return;
    }
    const el = videoRef.current;
    if (!el) return;

    // Expose this element to MiniPlayer via context (single element strategy)
    if (mainVideoRef) {
      mainVideoRef.current = el;
    }

    const onPlay = () => { setIsPlaying(true); setPlaying(true); };
    const onPause = () => { setIsPlaying(false); setPlaying(false); };
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);

    // robust autoplay attempt
    const tryPlay = async () => {
      try {
        if (!autoplayWanted) return;
        const p = el.play();
        if (p && typeof p.then === 'function') {
          await p;
        }
        setIsPlaying(true);
        setPlaying(true);
        setAutoplayBlocked(false);
      } catch {
        // If blocked, expose small inline prompt; do not force mute automatically
        setIsPlaying(false);
        setPlaying(false);
        setAutoplayBlocked(true);
      }
    };

    // Reset states and try
    setIsPlaying(false);
    setPlaying(false);
    setAutoplayBlocked(false);
    let to = null;
    if (shouldAutoplay) {
      to = setTimeout(tryPlay, 50);
    }

    return () => {
      if (to) clearTimeout(to);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      // Do not null shared ref here if still same component; leave as is
    };
  }, [video?.url, video?.id, video?.sourceType, shouldAutoplay, autoplayWanted, mainVideoRef, setPlaying]);

  // Attempt autoplay for embeds by toggling src with autoplay param; also prepare a manual prompt
  useEffect(() => {
    if (video.sourceType === 'youtube' || video.sourceType === 'vimeo') {
      // We rely on autoplay param in embed URL. If blocked, show manual prompt.
      if (shouldAutoplay) {
        // We cannot detect reliably if iframe started playing, so we optimistically do not show blocked state immediately.
        // Show prompt after a short delay if user still hasn't interacted.
        const t = setTimeout(() => {
          // Show prompt if still autoplayWanted and not yet interacted
          setAutoplayBlocked(true);
        }, 1000);
        return () => clearTimeout(t);
      } else {
        setAutoplayBlocked(false);
      }
    }
    return undefined;
  }, [video?.id, video?.sourceType, shouldAutoplay]);

  const handleUserPlayGesture = () => {
    // User clicked Play button to bypass autoplay block
    setAutoplayBlocked(false);
    setAutoplayWanted(false);
    try {
      if (video.sourceType === 'mp4' && videoRef.current) {
        videoRef.current.play().catch(() => {});
      } else if (video.sourceType === 'youtube' || video.sourceType === 'vimeo') {
        // Reload iframe with autoplay=1 to ensure it starts after user gesture
        setAutoplayWanted(true);
        // Toggling state will rebuild embed src with autoplay=1 which should now be allowed due to gesture
        // Force a micro re-render by briefly toggling and resetting
        setTimeout(() => setAutoplayWanted(false), 0);
      }
    } catch {
      // ignore
    }
  };

  // Track play/pause for native video to update isPlaying and context.playing
  useEffect(() => {
    if (video.sourceType !== 'mp4') return;
    const el = videoRef.current;
    if (!el) return;
    const onPlay = () => { setIsPlaying(true); setPlaying(true); };
    const onPause = () => { setIsPlaying(false); setPlaying(false); };
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    return () => {
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
    };
  }, [video?.id, video?.sourceType, setPlaying]);

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
            // Keep poster/thumbnail visible until playback starts by relying on controls and preload behavior
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

        {/* Inline prompt when browser blocks autoplay */}
        {shouldAutoplay && autoplayBlocked && (
          <div className="autoplay-overlay" role="dialog" aria-live="polite">
            <div className="autoplay-card">
              <div className="autoplay-title">Autoplay blocked</div>
              <div className="autoplay-next-title">
                Tap Play to start watching
              </div>
              <div className="autoplay-cta">
                <button className="btn-primary" onClick={handleUserPlayGesture} aria-label="Play video now">Play</button>
              </div>
            </div>
          </div>
        )}

        {/* Autoplay next overlay */}
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
