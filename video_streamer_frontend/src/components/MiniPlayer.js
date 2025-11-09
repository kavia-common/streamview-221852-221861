import React, { useContext, useRef } from 'react';
import { PlayerContext } from '../context/PlayerContext';

/**
 * PUBLIC_INTERFACE
 * MiniPlayer docks when main player scrolls out of view.
 * Props:
 * - video: current video object
 * - onClick: called when user clicks body to scroll/focus back to main player
 * - onClose: called when user closes mini player (will hide until main player is back in view)
 * - isMp4: boolean if current is mp4
 */
export default function MiniPlayer({ video, onClick, onClose, isMp4 = false }) {
  const { showMini, mainVideoRef, playing } = useContext(PlayerContext);
  const miniRef = useRef(null);

  const togglePlay = async (e) => {
    e.stopPropagation();
    const el = mainVideoRef?.current;
    if (!el) return;
    try {
      if (el.paused) {
        // Attempt to play; if blocked, no-op (main overlay handles prompts)
        await el.play();
      } else {
        el.pause();
      }
    } catch {
      // ignore; user can press Play on main or overlay
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
        {/* Single-element strategy: no secondary video, just controls mirroring the main element */}
        <div className="mini-overlay">
          <div className="mini-title" title={video?.title}>{video?.title}</div>
          <div className="mini-controls">
            <button className="mini-btn" onClick={togglePlay} aria-label="Play/Pause">
              {playing ? '❚❚' : '▶'}
            </button>
            <button className="mini-btn" onClick={handlePip} aria-label="Picture-in-Picture" disabled={!isMp4}>⤢</button>
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
