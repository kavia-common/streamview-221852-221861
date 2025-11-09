export const videos = [
  {
    id: 'mp4-1',
    title: 'Big Buck Bunny (MP4)',
    sourceType: 'mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg',
    channel: 'Open Movies',
    views: '12M views',
    uploadedAt: '3 years ago',
    duration: '9:56',
    description:
      'Big Buck Bunny is a short computer-animated comedy film by the Blender Institute.',
  },
  {
    id: 'mp4-2',
    title: 'Sintel (MP4)',
    sourceType: 'mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail: 'https://i.ytimg.com/vi/eRsGyueVLvQ/hqdefault.jpg',
    channel: 'Blender Foundation',
    views: '8.1M views',
    uploadedAt: '5 years ago',
    duration: '14:48',
    description:
      'Sintel is an independently produced short film, initiated by the Blender Foundation.',
  },
  {
    id: 'yt-1',
    title: 'NASA: Earth From Space (YouTube)',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=DDU-rZs-Ic4',
    thumbnail: 'https://i.ytimg.com/vi/DDU-rZs-Ic4/hqdefault.jpg',
    channel: 'NASA',
    views: '25M views',
    uploadedAt: '8 years ago',
    duration: '1:01:41',
    description:
      'A relaxing 4K video tour of the Earth as seen from the International Space Station.',
  },
  {
    id: 'yt-2',
    title: 'React Conf Keynote (YouTube)',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=1LkO3nY9oC4',
    thumbnail: 'https://i.ytimg.com/vi/1LkO3nY9oC4/hqdefault.jpg',
    channel: 'React',
    views: '1.2M views',
    uploadedAt: '2 years ago',
    duration: '42:30',
    description:
      'Keynote session from React Conf showcasing new features and ecosystem updates.',
  },
  {
    id: 'vimeo-1',
    title: 'The New Vimeo Player (Vimeo)',
    sourceType: 'vimeo',
    url: 'https://vimeo.com/76979871',
    thumbnail: 'https://i.vimeocdn.com/video/452001751-640.jpg',
    channel: 'Vimeo Staff',
    views: '2.4M views',
    uploadedAt: '10 years ago',
    duration: '1:28',
    description:
      'Introducing the new Vimeo player: faster, more reliable, and more beautiful.',
  },
  {
    id: 'vimeo-2',
    title: 'Tears of Steel (Vimeo)',
    sourceType: 'vimeo',
    url: 'https://vimeo.com/53588182',
    thumbnail: 'https://i.vimeocdn.com/video/381867812_640.jpg',
    channel: 'Blender Foundation',
    views: '5.7M views',
    uploadedAt: '10 years ago',
    duration: '12:14',
    description:
      'Science fiction short film by the Blender Foundation, demonstrating open movie production.',
  },
  {
    id: 'mp4-3',
    title: 'For Bigger Blazes (MP4)',
    sourceType: 'mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://i.ytimg.com/vi/l7H1__iKc2Y/hqdefault.jpg',
    channel: 'Chromecast',
    views: '3.5M views',
    uploadedAt: '6 years ago',
    duration: '0:15',
    description:
      'Short Chromecast demo clip showcasing dynamic visuals.',
  },
  {
    id: 'mp4-4',
    title: 'For Bigger Fun (MP4)',
    sourceType: 'mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://i.ytimg.com/vi/ZaI2IlHwmgQ/hqdefault.jpg',
    channel: 'Chromecast',
    views: '2.1M views',
    uploadedAt: '6 years ago',
    duration: '0:15',
    description:
      'Another short Chromecast demo clip with playful visuals.',
  },
];

export function getVideoById(id) {
  return videos.find((v) => v.id === id);
}
