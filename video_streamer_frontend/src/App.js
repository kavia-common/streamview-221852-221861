import React, { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import './theme.css';
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import PlaylistsPage from './pages/PlaylistsPage';
import PlaylistDetailsPage from './pages/PlaylistDetailsPage';
import DashboardPage from './pages/DashboardPage';

/**
 * PUBLIC_INTERFACE
 * App shell with KAVIA-themed top navigation and router for Home, Watch, Playlists, and Dashboard pages.
 */
function App() {
  const [theme] = useState('light'); // Light theme default; variables include dark-ready tokens
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // Performance: preconnect to external hosts (YouTube, Vimeo, images)
    const configs = [
      { rel: 'preconnect', href: 'https://www.youtube.com' },
      { rel: 'preconnect', href: 'https://i.ytimg.com' },
      { rel: 'preconnect', href: 'https://img.youtube.com' },
      { rel: 'dns-prefetch', href: 'https://i.ytimg.com' },
      { rel: 'dns-prefetch', href: 'https://img.youtube.com' },

      { rel: 'preconnect', href: 'https://player.vimeo.com' },
      { rel: 'preconnect', href: 'https://i.vimeocdn.com' },
      { rel: 'dns-prefetch', href: 'https://player.vimeo.com' },
      { rel: 'dns-prefetch', href: 'https://i.vimeocdn.com' },
    ];
    const links = configs.map(({ rel, href }) => {
      const l = document.createElement('link');
      l.rel = rel;
      l.href = href;
      l.crossOrigin = 'anonymous';
      document.head.appendChild(l);
      return l;
    });
    return () => {
      links.forEach((l) => {
        try { document.head.removeChild(l); } catch {}
      });
    };
  }, [theme]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    // Search handled in pages; this preserves semantics and keyboard access.
  };

  return (
    <div className="app">
      <nav className="navbar" role="navigation" aria-label="Top navigation">
        <div
          className="brand"
          role="button"
          onClick={() => navigate('/')}
          tabIndex={0}
          onKeyDown={(e)=>e.key==='Enter'&&navigate('/')}
          aria-label="KAVIA Streamer Home"
        >
          <span className="dot" />
          <span>KAVIA<span className="accent">Stream</span></span>
        </div>

        <form className="search" onSubmit={onSearchSubmit} role="search" aria-label="Search">
          <input placeholder="Search videos, channels, tags" aria-label="Search videos" />
          <button type="submit" aria-label="Submit search">Search</button>
        </form>

        <div className="actions tabs" role="tablist" aria-label="Primary navigation">
          <NavLink to="/" end className={({isActive}) => `btn tab ${isActive ? 'active' : ''}`} role="tab" aria-selected={({isActive}) => isActive}>Home</NavLink>
          <NavLink to="/playlists" className={({isActive}) => `btn tab ${isActive ? 'active' : ''}`} role="tab" aria-selected={({isActive}) => isActive}>Playlists</NavLink>
          <NavLink to="/dashboard" className={({isActive}) => `btn tab ${isActive ? 'active' : ''}`} role="tab" aria-selected={({isActive}) => isActive}>Dashboard</NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/watch/:id" element={<WatchPage />} />
        <Route path="/playlists" element={<PlaylistsPage />} />
        <Route path="/playlist/:id" element={<PlaylistDetailsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<div className="container"><p>Not Found</p><Link to="/">Go Home</Link></div>} />
      </Routes>
    </div>
  );
}

export default App;
