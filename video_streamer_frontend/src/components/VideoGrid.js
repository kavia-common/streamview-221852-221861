import React from 'react';
import VideoCard from './VideoCard';

/**
 * PUBLIC_INTERFACE
 * VideoGrid renders a responsive grid of VideoCard items.
 */
export default function VideoGrid({ items }) {
  return (
    <div className="grid" role="list">
      {items.map((v) => (
        <div key={v.id} role="listitem">
          <VideoCard video={v} />
        </div>
      ))}
    </div>
  );
}
