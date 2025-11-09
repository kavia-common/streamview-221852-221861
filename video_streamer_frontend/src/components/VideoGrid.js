import React from 'react';
import VideoCard from './VideoCard';

/**
 * PUBLIC_INTERFACE
 * VideoGrid renders a responsive grid of VideoCard items.
 * Only YouTube items are shown (safety filter).
 */
export default function VideoGrid({ items }) {
  const list = Array.isArray(items) ? items.filter((v) => v && v.sourceType === 'youtube') : [];
  return (
    <div className="grid" role="list">
      {list.map((v) => (
        <div key={v.id} role="listitem">
          <VideoCard video={v} />
        </div>
      ))}
    </div>
  );
}
