import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * VideoPlayer displays a video based on sourceType: 'mp4' | 'youtube' | 'vimeo'.
 * - MP4 uses the native <video> element and the Picture-in-Picture API.
 * - YouTube/Vimeo are embedded via iframe; PiP is attempted using browser-level support (rare) and otherwise a tooltip explains limitations.
 */
export default function VideoPlayer({ video }) {
  const videoRef = useRef(null);
  const [pipSupported, setPipSupported] = useState(false);
  const [pipStatus, setPipStatus] = useState('');

  useEffect(() => {
    // Detect PiP support for MP4
    const el = document.createElement('video');
    setPipSupported('requestPictureInPicture' in el);
  }, []);

  const embed = useMemo(() => {
    if (video.sourceType === 'youtube') {
      // Extract YouTube ID from common URL formats
      const match =
        video.url.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{6,})/) ||
        video.url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/);
      const id = match ? match[1] : '';
      return {
        src: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`,
        allow:
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      };
    }
    if (video.sourceType === 'vimeo') {
      const match = video.url.match(/vimeo\.com\/(\d+)/);
      const id = match ? match[1] : '';
      return {
        src: `https://player.vimeo.com/video/${id}`,
        allow:
          'autoplay; fullscreen; picture-in-picture',
      };
    }
    return null;
  }, [video]);

  const tryEnterPipForIframe = async () => {
    // Most browsers do not support pip for arbitrary iframes.
    // We attempt using documentPictureInPicture if available (experimental).
    try {
      // Experimental API check
      // @ts-ignore
      if (document.pictureInPictureEnabled || document.documentPictureInPicture) {
        setPipStatus('PiP is controlled by the embedded provider; try the player’s own PiP button if visible.');
      } else {
        setPipStatus('Picture-in-Picture is not available for embedded players in this browser.');
      }
    } catch (e) {
      setPipStatus('Unable to activate PiP for embedded players.');
    }
  };

  const handlePip = async () => {
    if (video.sourceType === 'mp4') {
      try {
        const el = videoRef.current;
        if (!el) return;
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await el.requestPictureInPicture();
        }
        setPipStatus('');
      } catch (e) {
        setPipStatus('PiP is not available or was blocked by the browser.');
      }
      return;
    }
    await tryEnterPipForIframe();
  };

  return (
    <div className="player-wrap">
      <div className="player-area" aria-label="Video player area">
        {video.sourceType === 'mp4' ? (
          <video
            ref={videoRef}
            controls
            src={video.url}
            preload="metadata"
            style={{ backgroundColor: 'black' }}
          />
        ) : (
          <iframe
            title={video.title}
            src={embed?.src}
            allow={embed?.allow}
            allowFullScreen
            frameBorder="0"
          />
        )}
      </div>
      <div className="player-controls">
        <button className="btn-primary" onClick={handlePip}>
          ▶ Picture-in-Picture
        </button>
        {video.sourceType === 'mp4' && (
          <span className="pip-tooltip">
            {pipSupported ? 'PiP supported' : 'PiP may not be supported in this browser.'}
          </span>
        )}
        {pipStatus && <span className="pip-tooltip">• {pipStatus}</span>}
      </div>
    </div>
  );
}
