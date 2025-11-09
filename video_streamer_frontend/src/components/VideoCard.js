import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBestThumbnail } from '../utils/thumbnails';

/**
 * PUBLIC_INTERFACE
 * VideoCard displays a video's thumbnail, title and meta; clicking navigates to watch page.
 */
export default function VideoCard({ video, compact = false }) {
  const navigate = useNavigate();
  const onClick = () => navigate(`/watch/${video.id}`);

  // Manage image loading and error fallback
  const fallback = '/assets/thumbnail-fallback.jpg';
  const initialSrc = useMemo(() => getBestThumbnail(video, fallback), [video]);
  const [src, setSrc] = useState(initialSrc);
  const [loaded, setLoaded] = useState(false);
  const erroredRef = useRef(false);

  const handleError = () => {
    if (!erroredRef.current) {
      erroredRef.current = true;
      setSrc(fallback);
    }
  };

  const Img = (
    <img
      src={src}
      alt={`${video.title} thumbnail`}
      onError={handleError}
      onLoad={() => setLoaded(true)}
      style={{
        filter: loaded ? 'none' : 'blur(12px)',
        transform: loaded ? 'none' : 'scale(1.05)',
        transition: 'filter 200ms ease, transform 200ms ease',
        background:
          'linear-gradient(135deg, rgba(0,0,0,0.06), rgba(0,0,0,0.02))',
      }}
    />
  );

  if (compact) {
    return (
      <div
        className="related-item"
        role="button"
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        tabIndex={0}
        aria-label={`Open ${video.title}`}
      >
        <div className="thumb" aria-label="Video thumbnail">
          {!loaded && <div className="skeleton" aria-hidden />}
          {Img}
          <span className="badge">{video.duration || '--:--'}</span>
        </div>
        <div>
          <div className="title">{video.title}</div>
          <div className="sub">{video.channel}</div>
          <div className="sub">
            {video.views} • {video.uploadedAt}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card"
      role="button"
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      tabIndex={0}
      aria-label={`Open ${video.title}`}
    >
      <div className="thumb" aria-label="Video thumbnail">
        {!loaded && <div className="skeleton" aria-hidden />}
        {Img}
        <span className="badge">{video.duration || '--:--'}</span>
      </div>
      <div className="meta">
        <div className="avatar" aria-hidden />
        <div>
          <div className="title">{video.title}</div>
          <div className="sub">{video.channel}</div>
          <div className="sub">
            {video.views} • {video.uploadedAt}
          </div>
        </div>
      </div>
    </div>
  );
}
