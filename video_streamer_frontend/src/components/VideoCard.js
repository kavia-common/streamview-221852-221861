import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useThumbnail } from '../utils/useThumbnail';

/**
 * PUBLIC_INTERFACE
 * VideoCard displays a video's thumbnail, title and meta; clicking navigates to watch page.
 */
export default function VideoCard({ video, compact = false }) {
  const navigate = useNavigate();
  const onClick = () => navigate(`/watch/${video.id}`);

  // Async thumbnail resolver with fallback (no blur-up)
  const { url, loaded, isResolving, onError, onLoad } = useThumbnail(video, {
    fallback: '/assets/thumbnail-fallback.jpg',
  });

  const Img = (
    <img
      src={url}
      alt={`${video.title} thumbnail`}
      onError={onError}
      onLoad={onLoad}
      // No blur or transitional scaling — render crisp immediately
      style={{
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
          {(!loaded || isResolving) && <div className="skeleton" aria-hidden />}
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
        {(!loaded || isResolving) && <div className="skeleton" aria-hidden />}
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
