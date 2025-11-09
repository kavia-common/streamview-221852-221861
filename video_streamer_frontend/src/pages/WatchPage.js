import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import { getVideoById, videos } from '../data/videos';
import VideoCard from '../components/VideoCard';

/**
 * PUBLIC_INTERFACE
 * WatchPage renders the selected video, metadata, and a related list.
 */
export default function WatchPage() {
  const { id } = useParams();
  const video = getVideoById(id);

  const related = useMemo(() => {
    const rest = videos.filter((v) => v.id !== id);
    return rest.slice(0, 8);
  }, [id]);

  if (!video) {
    return (
      <div className="container">
        <p>Video not found.</p>
        <Link to="/">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="watch-layout">
        <div>
          <VideoPlayer video={video} />
          <div className="section">
            <h2 style={{ margin: '4px 0 8px 0' }}>{video.title}</h2>
            <div className="sub" style={{ marginBottom: 8 }}>
              {video.channel} • {video.views} • {video.uploadedAt}
            </div>
            <p style={{ margin: 0 }}>{video.description}</p>
          </div>
        </div>
        <aside>
          <div className="section">
            <h3 style={{ marginTop: 0 }}>Related</h3>
            <div className="related">
              {related.map((v) => (
                <VideoCard key={v.id} video={v} compact />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
