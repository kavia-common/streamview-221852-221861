import React, { useContext, useEffect, useRef, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';

/**
 * PUBLIC_INTERFACE
 * MiniPlayer docks when main player scrolls out of view.
 * Props:
 * - video: current video object
 * - onClick: called when user clicks body to scroll/focus back to main player
 * - onClose: called when user closes mini player (will hide until main player is back in view)
 * - onPlayPause: optional handler to toggle play/pause for mp4
 * - isMp4: boolean if current is mp4
 * - mainVideoEl: optional ref to main video for play/pause sync
 */
export default function MiniPlayer({ video, onClick, onClose, isMp4 = false, mainVideoEl }) {
  const { showMini } = useContext(PlayerContext);
  const miniRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Attempt to mirror play state for mp4 by listening to main element (if provided)
  useEffect(() => {
    if (!mainVideoEl?.current) return;
    const el = mainVideoEl.current;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    return () => {
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
    };
  }, [mainVideoEl]);

  const togglePlay = async (e) => {
    e.stopPropagation();
    if (!mainVideoEl?.current) return;
    try {
      if (mainVideoEl.current.paused) {
        await mainVideoEl.current.play();
      } else {
        mainVideoEl.current.pause();
      }
    } catch {
      // ignore
    }
  };

  const handlePip = async (e) => {
    e.stopPropagation();
    // For mp4 try PiP on main element, for iframes fallback message
    try {
      if (isMp4 && mainVideoEl?.current) {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await mainVideoEl.current.requestPictureInPicture();
        }
      } else {
        alert('PiP is controlled by the embedded provider; use the player’s own PiP button if visible.');
      }
    } catch {
      alert('Unable to enter Picture-in-Picture.');
    }
  };

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
      <div className="mini-video">
        {/* visual placeholder; actual playback remains in main element */}
        <div className="mini-overlay">
          <div className="mini-title" title={video?.title}>{video?.title}</div>
          <div className="mini-controls">
            <button className="mini-btn" onClick={togglePlay} aria-label="Play/Pause">
              {isPlaying ? '❚❚' : '▶'}
            </button>
            <button className="mini-btn" onClick={handlePip} aria-label="Picture-in-Picture">⤢</button>
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
      </div>
    </div>
  );
}
