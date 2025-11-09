/**
// PUBLIC_INTERFACE
// Utility helpers to compute reliable thumbnail URLs with fallbacks for various providers.
*/
const YT_HOST = 'https://i.ytimg.com';

/**
 * PUBLIC_INTERFACE
 * Get a YouTube thumbnail by quality name for a known video ID.
 */
export function getYouTubeThumbById(videoId, quality = 'hqdefault') {
  if (!videoId) return null;
  return `${YT_HOST}/vi/${videoId}/${quality}.jpg`;
}

/**
 * PUBLIC_INTERFACE
 * Build ordered list of candidate YouTube thumbnails from best to worse, with robust fallbacks:
 * maxresdefault -> sddefault -> hqdefault -> mqdefault -> default
 */
export function buildYouTubeCandidates(videoId) {
  if (!videoId) return [];
  const qualities = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault', 'default'];
  return qualities.map((q) => getYouTubeThumbById(videoId, q));
}

/**
 * PUBLIC_INTERFACE
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
 * PUBLIC_INTERFACE
 * Extract Vimeo numeric ID from URL.
 */
export function getVimeoIdFromUrl(url) {
  if (!url) return null;
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

/**
 * PUBLIC_INTERFACE
 * Build Vimeo oEmbed endpoint URL for a given video URL to retrieve thumbnail_url.
 */
export function getVimeoOembedThumb(videoPageUrl) {
  if (!videoPageUrl) return null;
  // API: https://vimeo.com/api/oembed.json?url=<video_page_url>
  return `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoPageUrl)}`;
}

/**
 * PUBLIC_INTERFACE
 * Derive possible Vimeo thumbnails when oEmbed is blocked or slow.
 * - vumbnail.com (proxy)
 * - i.vimeocdn.com variations with common sizes
 */
export function getVimeoDerivedCandidates(vimeoId) {
  if (!vimeoId) return [];
  const candidates = [
    // vumbnail
    `https://vumbnail.com/${vimeoId}.jpg`,
    // i.vimeocdn known formats
    `https://i.vimeocdn.com/video/${vimeoId}_1280x720.jpg`,
    `https://i.vimeocdn.com/video/${vimeoId}_960x540.jpg`,
    `https://i.vimeocdn.com/video/${vimeoId}_640x360.jpg`,
    // Generic without size (sometimes resolves)
    `https://i.vimeocdn.com/video/${vimeoId}.jpg`,
  ];
  return candidates;
}

/**
 * Build a Vimeo thumbnail if a known thumbnail URL is provided in data. If not, return null.
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
