import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { useThumbnail } from '../utils/useThumbnail';

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
  const {
    autoplay,
    toggleAutoplay,
    setShowMini,
    mainVideoRef,
    setPlaying,
    setProviderType,
    setCurrentTime,
    setActiveHandle,
  } = useContext(PlayerContext);

  // countdown state for autoplay
  const [countdown, setCountdown] = useState(null); // number or null
  const [countdownActive, setCountdownActive] = useState(false);
  const COUNTDOWN_SECS = 3;

  // autoplay UX state
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplayWanted, setAutoplayWanted] = useState(!!shouldAutoplay);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  // Poster/thumbnail resolver for MP4
  const { url: posterUrl } = useThumbnail(video || {}, { fallback: '/assets/thumbnail-fallback.jpg' });

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
        providerId: id,
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
        providerId: id,
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

  // Handle natural end for MP4; for embedded sources we cannot reliably detect end
  const onMp4Ended = (e) => {
    if (!autoplay) {
      if (onEnded) onEnded(e);
      return;
    }
    setCountdown(COUNTDOWN_SECS);
    setCountdownActive(true);
  };

  // Countdown for autoplay next
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

  // Sync provider type, active handle, and currentTime
  useEffect(() => {
    setProviderType(video?.sourceType || null);
    if (video?.sourceType === 'mp4') {
      const el = videoRef.current;
      setActiveHandle(el || null);
    } else {
      setActiveHandle(null); // iframe is created in render; we don't hold SDK instances in this template
    }
    setCurrentTime(0);
  }, [video?.id, video?.sourceType, setProviderType, setActiveHandle, setCurrentTime]);

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
    const onTime = () => {
      try {
        setCurrentTime(el.currentTime || 0);
      } catch { /* noop */ }
    };
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('timeupdate', onTime);

    // robust autoplay attempt with safety timeout and muted retry
    const tryPlay = async (mutedFirst = false) => {
      try {
        if (!autoplayWanted) return;
        if (mutedFirst) el.muted = true;
        const p = el.play();
        if (p && typeof p.then === 'function') {
          await p;
        }
        setIsPlaying(true);
        setPlaying(true);
        setAutoplayBlocked(false);
        return true;
      } catch {
        setIsPlaying(false);
        setPlaying(false);
        setAutoplayBlocked(true);
        return false;
      }
    };

    // initial try
    setIsPlaying(false);
    setPlaying(false);
    setAutoplayBlocked(false);
    let safetyTimer = null;
    let started = false;

    const kickoff = async () => {
      started = await tryPlay(false);
      // Safety: if not started within 800ms, retry muted and show overlay
      safetyTimer = setTimeout(async () => {
        if (!started) {
          const ok = await tryPlay(true);
          if (!ok) setAutoplayBlocked(true);
        }
      }, 800);
    };

    if (shouldAutoplay) {
      kickoff();
    }

    return () => {
      if (safetyTimer) clearTimeout(safetyTimer);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('timeupdate', onTime);
    };
  }, [video?.url, video?.id, video?.sourceType, shouldAutoplay, autoplayWanted, mainVideoRef, setPlaying, setCurrentTime]);

  // Attempt autoplay for embeds by toggling src with autoplay param; also prepare a manual prompt
  useEffect(() => {
    if (video.sourceType === 'youtube' || video.sourceType === 'vimeo') {
      // We rely on autoplay param in embed URL. If blocked, show manual prompt later.
      if (shouldAutoplay) {
        const t = setTimeout(() => {
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
    // User clicked Play to bypass autoplay block
    setAutoplayBlocked(false);
    setAutoplayWanted(false);
    try {
      if (video.sourceType === 'mp4' && videoRef.current) {
        // unmute as it's a gesture; play directly
        videoRef.current.muted = false;
        videoRef.current.play().catch(() => {});
      } else if (video.sourceType === 'youtube' || video.sourceType === 'vimeo') {
        // Reload iframe with autoplay=1 to ensure it starts after user gesture
        setAutoplayWanted(true);
        setTimeout(() => setAutoplayWanted(false), 0);
      }
    } catch {
      // ignore
    }
  };

  // Track play/pause for native video and keep currentTime
  useEffect(() => {
    if (video.sourceType !== 'mp4') return;
    const el = videoRef.current;
    if (!el) return;
    const onPlay = () => { setIsPlaying(true); setPlaying(true); };
    const onPause = () => { setIsPlaying(false); setPlaying(false); };
    const onTime = () => {
      try { setCurrentTime(el.currentTime || 0); } catch {}
    };
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('timeupdate', onTime);
    return () => {
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('timeupdate', onTime);
    };
  }, [video?.id, video?.sourceType, setPlaying, setCurrentTime]);

  return (
    <div className="player-wrap" ref={containerRef}>
      <div className="player-area" aria-label="Video player area">
        {video.sourceType === 'mp4' ? (
          <video
            ref={videoRef}
            controls
            src={video.url}
            preload="metadata"
            poster={posterUrl}
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

        {/* Inline prompt when browser blocks autoplay or on safety retry */}
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
