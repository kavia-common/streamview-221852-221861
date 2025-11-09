/**
// PUBLIC_INTERFACE
// Utility helpers to compute reliable YouTube thumbnail URLs with fallbacks.
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
