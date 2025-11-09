import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * PlayerContext provides global state for autoplay preference and mini-player visibility.
 * Exposed fields:
 * - autoplay: boolean (persisted in localStorage, default true)
 * - toggleAutoplay(): toggle autoplay pref
 * - showMini: boolean controlling mini-player dock visibility
 * - setShowMini(): setter to toggle mini-player
 * - playing: boolean reflecting current play/pause of active media
 * - setPlaying(): setter used by VideoPlayer to update playing state
 * - mainVideoRef: React ref to the active HTMLVideoElement (MP4) OR null
 * - providerType: 'mp4' | 'youtube' | 'vimeo' | null
 * - setProviderType(): setter to update provider type
 * - currentTime: number (seconds) best-effort for MP4 (from video) and embeds (stored when updated)
 * - setCurrentTime(): setter to update currentTime
 * - activeHandle: the active player handle (HTMLVideoElement for mp4; iframe for providers) for internal controls
 * - setActiveHandle(): setter to update handle
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
  providerType: null,
  setProviderType: (_t) => {},
  currentTime: 0,
  setCurrentTime: (_t) => {},
  activeHandle: null,
  setActiveHandle: (_h) => {},
});

/**
 * PUBLIC_INTERFACE
 * PlayerProvider wraps the app and provides PlayerContext values.
 */
export function PlayerProvider({ children }) {
  const [autoplay, setAutoplay] = useState(true);
  const [showMini, setShowMini] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [providerType, setProviderType] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  // Single shared ref to the active native video element (used by VideoPlayer)
  const mainVideoRef = useRef(null);
  const [activeHandle, setActiveHandle] = useState(null);

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
    () => ({
      autoplay,
      toggleAutoplay,
      showMini,
      setShowMini,
      mainVideoRef,
      playing,
      setPlaying,
      providerType,
      setProviderType,
      currentTime,
      setCurrentTime,
      activeHandle,
      setActiveHandle,
    }),
    [autoplay, toggleAutoplay, showMini, playing, providerType, currentTime, activeHandle]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
