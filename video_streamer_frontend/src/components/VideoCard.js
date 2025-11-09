import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * VideoCard displays a video's thumbnail, title and meta; clicking navigates to watch page.
 */
export default function VideoCard({ video, compact = false }) {
  const navigate = useNavigate();
  const onClick = () => navigate(`/watch/${video.id}`);

  if (compact) {
    return (
      <div className="related-item" role="button" onClick={onClick} onKeyDown={(e)=>e.key==='Enter'&&onClick()} tabIndex={0} aria-label={`Open ${video.title}`}>
        <div className="thumb">
          <img src={video.thumbnail} alt={`${video.title} thumbnail`} />
          <span className="badge">{video.duration || '--:--'}</span>
        </div>
        <div>
          <div className="title">{video.title}</div>
          <div className="sub">{video.channel}</div>
          <div className="sub">{video.views} • {video.uploadedAt}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card" role="button" onClick={onClick} onKeyDown={(e)=>e.key==='Enter'&&onClick()} tabIndex={0} aria-label={`Open ${video.title}`}>
      <div className="thumb">
        <img src={video.thumbnail} alt={`${video.title} thumbnail`} />
        <span className="badge">{video.duration || '--:--'}</span>
      </div>
      <div className="meta">
        <div className="avatar" aria-hidden />
        <div>
          <div className="title">{video.title}</div>
          <div className="sub">{video.channel}</div>
          <div className="sub">{video.views} • {video.uploadedAt}</div>
        </div>
      </div>
    </div>
  );
}
