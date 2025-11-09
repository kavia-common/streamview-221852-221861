//
// PUBLIC_INTERFACE
// Utility helpers to compute reliable thumbnail URLs with fallbacks for various providers.
//
const YT_HOST = 'https://i.ytimg.com';

/**
 * Get a reliable YouTube thumbnail given a known video ID.
 */
export function getYouTubeThumbById(videoId, quality = 'hqdefault') {
  if (!videoId) return null;
  return `${YT_HOST}/vi/${videoId}/${quality}.jpg`;
}

/**
 * Attempt to extract YouTube videoId from a URL if not provided separately.
 */
export function extractYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{6,})/,
    /youtu\.be\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m && m[1]) return m[1];
  }
  return null;
}

/**
 * Build a Vimeo thumbnail if a known thumbnail URL is provided in data. If not, return null.
 * We avoid calling external oEmbed APIs; callers can provide a static vimeoThumb.
 */
export function getVimeoThumbFromData(video) {
  if (video?.vimeoThumb) return video.vimeoThumb;
  if (video?.thumbnail && /vimeocdn\.com/.test(video.thumbnail)) return video.thumbnail;
  return null;
}

/**
 * Build an MP4 thumbnail if provided, else returns null.
 */
export function getMp4ThumbFromData(video) {
  if (video?.thumbnail) return video.thumbnail;
  return null;
}

/**
 * PUBLIC_INTERFACE
 * getBestThumbnail(video): Computes the best thumbnail URL for a given video object.
 * Order:
 * 1) video.thumbnail if present
 * 2) Provider-specific derived thumb:
 *    - YouTube: derive from video.videoId or url
 *    - Vimeo: use provided vimeoThumb (static)
 *    - MP4: use provided thumbnail if any
 * 3) Fallback to local placeholder
 */
export function getBestThumbnail(video, fallbackUrl = '/assets/thumbnail-fallback.jpg') {
  if (!video) return fallbackUrl;

  // Use explicit thumbnail if provided and looks valid
  if (video.thumbnail && typeof video.thumbnail === 'string' && video.thumbnail.startsWith('http')) {
    return video.thumbnail;
  }

  // Provider specifics
  if (video.sourceType === 'youtube') {
    const id = video.videoId || extractYouTubeId(video.url);
    const yt = getYouTubeThumbById(id);
    if (yt) return yt;
  }

  if (video.sourceType === 'vimeo') {
    const v = getVimeoThumbFromData(video);
    if (v) return v;
  }

  if (video.sourceType === 'mp4') {
    const m = getMp4ThumbFromData(video);
    if (m) return m;
  }

  // Final fallback
  return fallbackUrl;
}
