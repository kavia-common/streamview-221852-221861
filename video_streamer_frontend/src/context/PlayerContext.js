import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * PlayerContext provides global state for autoplay preference and mini-player visibility.
 * - autoplay: boolean (persisted in localStorage, default true)
 * - showMini: boolean controlling mini-player dock visibility
 * - setShowMini: setter to toggle mini-player
 * - toggleAutoplay: function to toggle autoplay and persist
 * - mainVideoRef: React ref to the active HTMLVideoElement (for MP4 sources)
 * - playing: boolean reflecting current play/pause of active video (MP4 only)
 * - setPlaying: setter used by VideoPlayer to update playing state
 */
// PUBLIC_INTERFACE
export const PlayerContext = createContext({
  autoplay: true,
  toggleAutoplay: () => {},
  showMini: false,
  setShowMini: (_v) => {},
  mainVideoRef: { current: null },
  playing: false,
  setPlaying: (_v) => {},
});

/**
 * PUBLIC_INTERFACE
 * PlayerProvider wraps the app and provides PlayerContext values.
 */
export function PlayerProvider({ children }) {
  const [autoplay, setAutoplay] = useState(true);
  const [showMini, setShowMini] = useState(false);
  const [playing, setPlaying] = useState(false);
  // Single shared ref to the active native video element (used by VideoPlayer)
  const mainVideoRef = useRef(null);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sv:autoplay');
      if (saved != null) {
        setAutoplay(saved === 'true');
      } else {
        // default ON
        localStorage.setItem('sv:autoplay', 'true');
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleAutoplay = useCallback(() => {
    setAutoplay((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sv:autoplay', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ autoplay, toggleAutoplay, showMini, setShowMini, mainVideoRef, playing, setPlaying }),
    [autoplay, toggleAutoplay, showMini, playing]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
