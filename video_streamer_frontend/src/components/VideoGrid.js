import React from 'react';
import VideoCard from './VideoCard';

/**
 * PUBLIC_INTERFACE
 * VideoGrid renders a responsive grid of VideoCard items.
 * Supports mixed providers (YouTube + MP4); no provider-specific filtering here.
 */
export default function VideoGrid({ items }) {
  // Accept both YouTube and MP4, ignore unknown/invalid items
  const list = Array.isArray(items)
    ? items.filter((v) => v && (v.sourceType === 'youtube' || v.sourceType === 'mp4'))
    : [];

  // Stable keys: prefer explicit id; fall back to youtubeId
  const getKey = (v) => v?.id || v?.youtubeId;

  return (
    <div className="grid" role="list">
      {list.map((v) => (
        <div key={getKey(v)} role="listitem">
          <VideoCard video={v} />
        </div>
      ))}
    </div>
  );
}
