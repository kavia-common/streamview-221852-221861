import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import './theme.css';
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';

/**
 * PUBLIC_INTERFACE
 * App shell with top navigation and router for Home and Watch pages.
 */
function App() {
  const [theme] = useState('light'); // Light theme only per style guide
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // Performance: preconnect to YouTube hosts and img CDN
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
    // No-op; search is handled in HomePage. Keep form for semantics.
  };

  return (
    <div className="app">
      <nav className="navbar" role="navigation" aria-label="Top navigation">
        <div className="brand" role="button" onClick={() => navigate('/')} tabIndex={0} onKeyDown={(e)=>e.key==='Enter'&&navigate('/')}>
          <span className="dot" />
          <span>Stream<span className="accent">View</span></span>
        </div>

        <form className="search" onSubmit={onSearchSubmit} role="search" aria-label="Search">
          <input placeholder="Search videos" aria-label="Search videos" />
          <button type="submit" aria-label="Submit search">Search</button>
        </form>

        <div className="actions">
          <Link to="/" className="btn" aria-label="Home">Home</Link>
          <a className="btn" href="https://reactjs.org" target="_blank" rel="noreferrer" aria-label="Open React docs">Docs</a>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/watch/:id" element={<WatchPage />} />
        <Route path="*" element={<div className="container"><p>Not Found</p><Link to="/">Go Home</Link></div>} />
      </Routes>
    </div>
  );
}

export default App;
