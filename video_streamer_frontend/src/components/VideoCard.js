import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThumbnail } from '../utils/useThumbnail';
import { CatalogContext } from '../context/CatalogContext';

/**
 * PUBLIC_INTERFACE
 * VideoCard displays a video's thumbnail, title and meta; clicking navigates to watch page.
 * - Mobile-first responsive card with hover/press animations
 * - Thumbnails lazy-load with async decoding and strict two-pinned fallback
 * - If both thumbnails fail, CatalogProvider replaces the item from backup at runtime
 * - Accessibility: alt text and keyboard navigation
 */
export default function VideoCard({ video, compact = false }) {
  const navigate = useNavigate();
  const { replaceWithBackup } = useContext(CatalogContext);

  const onClick = () => navigate(`/watch/${video.id}?autoplay=1`, { state: { autoplay: true } });

  const { url, loaded, isResolving, onError, onLoad } = useThumbnail(video, {
    fallback: '/assets/thumbnail-fallback.jpg',
    onThumbnailsExhausted: () => {
      // Only replace curated YouTube items via backup; MP4 posters should not trigger catalog swap
      if (video?.sourceType === 'youtube') {
        replaceWithBackup(video?.youtubeId || video?.id);
      }
    },
  });

  useEffect(() => {
    // Hint connection for image host to improve LCP
    const pre = document.createElement('link');
    pre.rel = 'preconnect';
    pre.href = 'https://i.ytimg.com';
    pre.crossOrigin = 'anonymous';
    document.head.appendChild(pre);
    return () => {
      try { document.head.removeChild(pre); } catch {}
    };
  }, []);

  const Img = (
    <img
      src={url}
      alt={`${video.title} thumbnail`}
      onError={onError}
      onLoad={onLoad}
      loading="lazy"
      decoding="async"
      width={1280}
      height={720}
      style={{
        background:
          'linear-gradient(135deg, rgba(0,0,0,0.06), rgba(0,0,0,0.02))',
      }}
    />
  );

  if (compact) {
    return (
      <div
        className="related-item card-interactive"
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
      className="card card-interactive"
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
          <div className="sub" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span className="chip" title="Channel or source">{video.channel || 'Channel'}</span>
            {video.attribution && <span className="chip" title="Attribution">{video.attribution}</span>}
          </div>
          {(video.description || (video.tags && video.tags.length)) && (
            <div className="sub" style={{ marginTop: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {video.description || (Array.isArray(video.tags) ? video.tags.join(', ') : '')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
