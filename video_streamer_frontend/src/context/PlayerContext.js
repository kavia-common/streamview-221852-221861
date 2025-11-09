import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * PlayerContext provides global state for autoplay preference and mini-player visibility.
 * - autoplay: boolean (persisted in localStorage, default true)
 * - showMini: boolean controlling mini-player dock visibility
 * - setShowMini: setter to toggle mini-player
 * - toggleAutoplay: function to toggle autoplay and persist
 */
// PUBLIC_INTERFACE
export const PlayerContext = createContext({
  autoplay: true,
  toggleAutoplay: () => {},
  showMini: false,
  setShowMini: (_v) => {},
});

/**
 * PUBLIC_INTERFACE
 * PlayerProvider wraps the app and provides PlayerContext values.
 */
export function PlayerProvider({ children }) {
  const [autoplay, setAutoplay] = useState(true);
  const [showMini, setShowMini] = useState(false);

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
    () => ({ autoplay, toggleAutoplay, showMini, setShowMini }),
    [autoplay, toggleAutoplay, showMini]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
