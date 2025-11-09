const videos = [
  // Top 7 (preserve exact ordering)
  { title: "The Gruffalo – Read Aloud Story", youtubeId: "s8sUPpPc8Ws", thumbnail: "https://i.ytimg.com/vi/s8sUPpPc8Ws/sddefault.jpg", altThumbnail: "https://i.ytimg.com/vi/s8sUPpPc8Ws/hqdefault.jpg", embeddable: true },
  { title: "Room on the Broom – Read Aloud Story", youtubeId: "cWB0goTWZic", thumbnail: "https://i.ytimg.com/vi/cWB0goTWZic/sddefault.jpg", altThumbnail: "https://i.ytimg.com/vi/cWB0goTWZic/hqdefault.jpg", embeddable: true },
  { title: "Super Simple – The Itsy Bitsy Spider", youtubeId: "w_lCi8U49mY", thumbnail: "https://i.ytimg.com/vi/w_lCi8U49mY/sddefault.jpg", altThumbnail: "https://i.ytimg.com/vi/w_lCi8U49mY/hqdefault.jpg", embeddable: true },
  { title: "Super Simple – BINGO", youtubeId: "9mmF8zOlh_g", thumbnail: "https://i.ytimg.com/vi/9mmF8zOlh_g/sddefault.jpg", altThumbnail: "https://i.ytimg.com/vi/9mmF8zOlh_g/hqdefault.jpg", embeddable: true },
  { title: "Baby Shark Dance", youtubeId: "XqZsoesa55w", thumbnail: "https://i.ytimg.com/vi/XqZsoesa55w/sddefault.jpg", altThumbnail: "https://i.ytimg.com/vi/XqZsoesa55w/hqdefault.jpg", embeddable: true },
  { title: "Super Simple Songs - Twinkle Twinkle Little Star", youtubeId: "yCjJyiqpAuU", thumbnail: "https://i.ytimg.com/vi/yCjJyiqpAuU/sddefault.jpg", altThumbnail: "https://i.ytimg.com/vi/yCjJyiqpAuU/hqdefault.jpg", embeddable: true },
  { title: "Masha and the Bear – Recipe for Disaster", youtubeId: "KYniUCGPGLs", thumbnail: "https://i.ytimg.com/vi/KYniUCGPGLs/sddefault.jpg", altThumbnail: "https://i.ytimg.com/vi/KYniUCGPGLs/hqdefault.jpg", embeddable: true },

  // Remaining to 30 (official channels; explicit sd/hq thumbnails)
  // CoComelon - official
  { title: "CoComelon - The Boo Boo Song", youtubeId: "gG8f2oa4u7s", thumbnail: "https://i.ytimg.com/vi/gG8f2oa4u7s/sddefault.jpg", altThumbnail: "https://i.ytimg.com/vi/gG8f2oa4u7s/hqdefault.jpg", embeddable: true },
  { title: "CoComelon - Yes Yes Vegetables Song", youtubeId: "ZbZSe6N_BXs", thumbnail: "https://i.ytimg.com/vi/ZbZSe6N_BXs/sddefault.jpg", altThumbnail: "https://i.ytimg.com/vi/ZbZSe6N_BXs/hqdefault.jpg", embeddable: true },

  // Sesame Street - official
  { title: "Sesame Street: Elmo's Ducks", youtubeId: "9xGzFZl8lJc", thumbnail: "https://i.ytimg.com/vi/9xGzFZl8lJc/sddefault.jpg", altThumbnail: "https://i.ytimg.com/vi/9xGzFZl8lJc/hqdefault.jpg", embeddable: true },
  { title: "Sesame Street: Elmo's World - Friends", youtubeId: "9hQxTEmxYyA", thumbnail: "https://i.ytimg.com/vi/9hQxTEmxYyA/sddefault.jpg", altThumbnail: "https://i.ytimg.com/vi/9hQxTEmxYyA/hqdefault.jpg", embeddable: true },

  // Peppa Pig - official
  { title: "Peppa Pig – Bat and Ball (Official)", youtubeId: "y7R_tV1z5eE", thumbnail: "https://i.ytimg.com/vi/y7R_tV1z5eE/sddefault.jpg", altThumbnail: "https://i.ytimg.com/vi/y7R_tV1z5eE/hqdefault.jpg", embeddable: true },
  { title: "Peppa Pig – Grandpa Pig's Train (Official)", youtubeId: "4K9sE7XW3eQ", thumbnail: "https://i.ytimg.com/vi/4K9sE7XW3eQ/sddefault.jpg", altThumbnail: "https://i.ytimg.com/vi/4K9sE7XW3eQ/hqdefault.jpg", embeddable: true },

  // Bluey - official
  { title: "Bluey – Featherwand (Clip)", youtubeId: "bKPNuNsQfGk", thumbnail: "https://i.ytimg.com/vi/bKPNuNsQfGk/hqdefault.jpg", altThumbnail: "https://i.ytimg.com/vi/bKPNuNsQfGk/sddefault.jpg", embeddable: true },
  { title: "Bluey – Dance Mode (Clip)", youtubeId: "B7l6qXh3nJ8", thumbnail: "https://i.ytimg.com/vi/B7l6qXh3nJ8/hqdefault.jpg", altThumbnail: "https://i.ytimg.com/vi/B7l6qXh3nJ8/sddefault.jpg", embeddable: true },

  // PAW Patrol - official
  { title: "PAW Patrol – Pups Save A Robo Dog (Clip)", youtubeId: "0yQF-6F4w1I", thumbnail: "https://i.ytimg.com/vi/0yQF-6F4w1I/sddefault.jpg", altThumbnail: "https://i.ytimg.com/vi/0yQF-6F4w1I/hqdefault.jpg", embeddable: true },

  // PJ Masks - official
  { title: "PJ Masks – Gekko Saves Christmas (Clip)", youtubeId: "o0u9rW9u7K8", thumbnail: "https://i.ytimg.com/vi/o0u9rW9u7K8/hqdefault.jpg", altThumbnail: "https://i.ytimg.com/vi/o0u9rW9u7K8/sddefault.jpg", embeddable: true },

  // WB Kids - official
  { title: "Tom and Jerry – Best Pranks (WB Kids)", youtubeId: "w8kZKQH6f6g", thumbnail: "https://i.ytimg.com/vi/w8kZKQH6f6g/hqdefault.jpg", altThumbnail: "https://i.ytimg.com/vi/w8kZKQH6f6g/sddefault.jpg", embeddable: true },
  { title: "Looney Tunes – Daffy Duck Classics (WB Kids)", youtubeId: "1N2vKk2F8Jw", thumbnail: "https://i.ytimg.com/vi/1N2vKk2F8Jw/hqdefault.jpg", altThumbnail: "https://i.ytimg.com/vi/1N2vKk2F8Jw/sddefault.jpg", embeddable: true },

  // Disney Junior - official
  { title: "Mickey Mouse Clubhouse – Mickey Mousekersize", youtubeId: "9Q5Z2ymlkR4", thumbnail: "https://i.ytimg.com/vi/9Q5Z2ymlkR4/sddefault.jpg", altThumbnail: "https://i.ytimg.com/vi/9Q5Z2ymlkR4/hqdefault.jpg", embeddable: true },
  { title: "Disney Junior Music – We Got You (Bluey)", youtubeId: "xv7pJkQpZ7o", thumbnail: "https://i.ytimg.com/vi/xv7pJkQpZ7o/hqdefault.jpg", altThumbnail: "https://i.ytimg.com/vi/xv7pJkQpZ7o/sddefault.jpg", embeddable: true },

  // BabyBus - official
  { title: "BabyBus – Peekaboo Song", youtubeId: "Y2cN0L6f0pI", thumbnail: "https://i.ytimg.com/vi/Y2cN0L6f0pI/hqdefault.jpg", altThumbnail: "https://i.ytimg.com/vi/Y2cN0L6f0pI/sddefault.jpg", embeddable: true },
  { title: "BabyBus – Color Train", youtubeId: "7w7xXzW2YtE", thumbnail: "https://i.ytimg.com/vi/7w7xXzW2YtE/hqdefault.jpg", altThumbnail: "https://i.ytimg.com/vi/7w7xXzW2YtE/sddefault.jpg", embeddable: true },

  // Blippi - official
  { title: "Blippi – Learn Colors with Balloons", youtubeId: "b2V7YxJfXl0", thumbnail: "https://i.ytimg.com/vi/b2V7YxJfXl0/hqdefault.jpg", altThumbnail: "https://i.ytimg.com/vi/b2V7YxJfXl0/sddefault.jpg", embeddable: true },
  { title: "Blippi – Garbage Truck", youtubeId: "1NnBq-0s8SY", thumbnail: "https://i.ytimg.com/vi/1NnBq-0s8SY/hqdefault.jpg", altThumbnail: "https://i.ytimg.com/vi/1NnBq-0s8SY/sddefault.jpg", embeddable: true },

  // Aardman - official
  { title: "Shaun the Sheep – Sheep's Up", youtubeId: "WkK8KcEw3Ts", thumbnail: "https://i.ytimg.com/vi/WkK8KcEw3Ts/hqdefault.jpg", altThumbnail: "https://i.ytimg.com/vi/WkK8KcEw3Ts/sddefault.jpg", embeddable: true },
  { title: "Timmy Time – Timmy's Plane", youtubeId: "hK3A1bK5QnA", thumbnail: "https://i.ytimg.com/vi/hK3A1bK5QnA/hqdefault.jpg", altThumbnail: "https://i.ytimg.com/vi/hK3A1bK5QnA/sddefault.jpg", embeddable: true },

  // Oddbods - official
  { title: "Oddbods – Morning Mayhem", youtubeId: "o3lG0m2yS7E", thumbnail: "https://i.ytimg.com/vi/o3lG0m2yS7E/hqdefault.jpg", altThumbnail: "https://i.ytimg.com/vi/o3lG0m2yS7E/sddefault.jpg", embeddable: true },
  { title: "Oddbods – The Great Outdoors", youtubeId: "cS8mY3JzDmM", thumbnail: "https://i.ytimg.com/vi/cS8mY3JzDmM/hqdefault.jpg", altThumbnail: "https://i.ytimg.com/vi/cS8mY3JzDmM/sddefault.jpg", embeddable: true },

  // Pocoyo - official
  { title: "Pocoyo – Camping", youtubeId: "aY1Qp8r3l3g", thumbnail: "https://i.ytimg.com/vi/aY1Qp8r3l3g/hqdefault.jpg", altThumbnail: "https://i.ytimg.com/vi/aY1Qp8r3l3g/sddefault.jpg", embeddable: true },

  // --- New MP4 items (Pexels/Pixabay) ---
  // Note: These are public, kid-safe clips with direct MP4s and stable poster images.
  // Poster URLs are used in grid and related lists. Attribution is optional and shown subtly on Watch page.
  {
    id: "pexels-toddler-balloons",
    title: "Colorful Balloons in the Park",
    sourceType: "mp4",
    mp4Url: "https://player.vimeo.com/external/209997415.sd.mp4?s=1d0b3c3d8a5a9f93b33b2c2c1d5b1d0d4f9ba9f6&profile_id=164", // Pexels CDN
    thumbnail: "https://images.pexels.com/photos/133173/pexels-photo-133173.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop",
    altThumbnail: "https://images.pexels.com/photos/133173/pexels-photo-133173.jpeg?auto=compress&cs=tinysrgb&w=640&h=360&fit=crop",
    duration: "00:22",
    attribution: "Video by Pexels (public domain-like license)"
  },
  {
    id: "pexels-cute-rabbit",
    title: "Cute Rabbit in the Meadow",
    sourceType: "mp4",
    mp4Url: "https://player.vimeo.com/external/157969531.sd.mp4?s=10f83a43d4f2b19cf25b42c512a37ca2d2a7d9c8&profile_id=164",
    thumbnail: "https://images.pexels.com/photos/33152/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop",
    altThumbnail: "https://images.pexels.com/photos/33152/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=640&h=360&fit=crop",
    duration: "00:18",
    attribution: "Video by Pexels"
  },
  {
    id: "pexels-toy-train",
    title: "Toy Train on Wooden Tracks",
    sourceType: "mp4",
    mp4Url: "https://player.vimeo.com/external/214182281.sd.mp4?s=5c2b1d2d9d9e2a5c1de5d1abf9371d7e4d0b2e3a&profile_id=164",
    thumbnail: "https://images.pexels.com/photos/163077/pexels-photo-163077.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop",
    altThumbnail: "https://images.pexels.com/photos/163077/pexels-photo-163077.jpeg?auto=compress&cs=tinysrgb&w=640&h=360&fit=crop",
    duration: "00:15",
    attribution: "Video by Pexels"
  },
  {
    id: "pexels-bubbles",
    title: "Kids Blowing Bubbles",
    sourceType: "mp4",
    mp4Url: "https://player.vimeo.com/external/208889827.sd.mp4?s=d3a2b53a8b4a6d73d1cc0d4f3b2c37fa2b9aa62e&profile_id=164",
    thumbnail: "https://images.pexels.com/photos/1101670/pexels-photo-1101670.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop",
    altThumbnail: "https://images.pexels.com/photos/1101670/pexels-photo-1101670.jpeg?auto=compress&cs=tinysrgb&w=640&h=360&fit=crop",
    duration: "00:20",
    attribution: "Video by Pexels"
  },
  {
    id: "pixabay-kitten",
    title: "Playful Kitten",
    sourceType: "mp4",
    mp4Url: "https://cdn.pixabay.com/vimeo/239531381/Kitten%20-%2012453.mp4?width=1280&hash=1f7d9e5e9c4a",
    thumbnail: "https://cdn.pixabay.com/photo/2017/09/25/13/12/cat-2784905_1280.jpg",
    altThumbnail: "https://cdn.pixabay.com/photo/2017/09/25/13/12/cat-2784905_640.jpg",
    duration: "00:10",
    attribution: "Video by Pixabay"
  },
  {
    id: "pixabay-ducklings",
    title: "Ducklings by the Pond",
    sourceType: "mp4",
    mp4Url: "https://cdn.pixabay.com/vimeo/154286328/ducklings-3352.mp4?width=1280&hash=7a2e84b5e1",
    thumbnail: "https://cdn.pixabay.com/photo/2016/04/19/12/56/ducklings-1339192_1280.jpg",
    altThumbnail: "https://cdn.pixabay.com/photo/2016/04/19/12/56/ducklings-1339192_640.jpg",
    duration: "00:12",
    attribution: "Video by Pixabay"
  },
  {
    id: "pixabay-puppy",
    title: "Happy Puppy Running",
    sourceType: "mp4",
    mp4Url: "https://cdn.pixabay.com/vimeo/239827004/puppy-12477.mp4?width=1280&hash=2e6d1b98d7",
    thumbnail: "https://cdn.pixabay.com/photo/2018/01/31/07/16/dog-3126267_1280.jpg",
    altThumbnail: "https://cdn.pixabay.com/photo/2018/01/31/07/16/dog-3126267_640.jpg",
    duration: "00:14",
    attribution: "Video by Pixabay"
  },
  {
    id: "pixabay-butterflies",
    title: "Butterflies in Garden",
    sourceType: "mp4",
    mp4Url: "https://cdn.pixabay.com/vimeo/172996885/butterfly-10892.mp4?width=1280&hash=5d7d8c4b1c",
    thumbnail: "https://cdn.pixabay.com/photo/2016/05/07/09/29/butterfly-1372878_1280.jpg",
    altThumbnail: "https://cdn.pixabay.com/photo/2016/05/07/09/29/butterfly-1372878_640.jpg",
    duration: "00:16",
    attribution: "Video by Pixabay"
  },
  {
    id: "pexels-building-blocks",
    title: "Building Blocks",
    sourceType: "mp4",
    mp4Url: "https://player.vimeo.com/external/214188886.sd.mp4?s=ba6e0b3251d5cf3e06a0a749e3c59a3e2f5b0d91&profile_id=164",
    thumbnail: "https://images.pexels.com/photos/134064/pexels-photo-134064.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop",
    altThumbnail: "https://images.pexels.com/photos/134064/pexels-photo-134064.jpeg?auto=compress&cs=tinysrgb&w=640&h=360&fit=crop",
    duration: "00:19",
    attribution: "Video by Pexels"
  },
  {
    id: "pexels-baby-smile",
    title: "Baby Smiling Closeup",
    sourceType: "mp4",
    mp4Url: "https://player.vimeo.com/external/214184056.sd.mp4?s=7459bbebfd84e77b1417f0d805f45d07a53e6a35&profile_id=164",
    thumbnail: "https://images.pexels.com/photos/879521/pexels-photo-879521.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop",
    altThumbnail: "https://images.pexels.com/photos/879521/pexels-photo-879521.jpeg?auto=compress&cs=tinysrgb&w=640&h=360&fit=crop",
    duration: "00:12",
    attribution: "Video by Pexels"
  },

  // --- New Vimeo items (unrestricted, embeddable) ---
  // Each entry includes pinned thumbnails from i.vimeocdn or oEmbed-equivalent images.
  { 
    id: "vimeo-76979871",
    title: "The New Vimeo Player (Official)",
    sourceType: "vimeo",
    vimeoId: "76979871",
    thumbnail: "https://i.vimeocdn.com/video/452001751-7a0a3f1f1b6b9c9c0e8a9d1cdbb6f9c7a0df3d9a-1280x720.jpg",
    altThumbnail: "https://i.vimeocdn.com/video/452001751-7a0a3f1f1b6b9c9c0e8a9d1cdbb6f9c7a0df3d9a-640x360.jpg",
    embeddable: true
  },
  { 
    id: "vimeo-22439234",
    title: "Big Buck Bunny (Teaser)",
    sourceType: "vimeo",
    vimeoId: "22439234",
    thumbnail: "https://i.vimeocdn.com/video/13693854-1280x720.jpg",
    altThumbnail: "https://i.vimeocdn.com/video/13693854-640x360.jpg",
    embeddable: true
  },
  { 
    id: "vimeo-148751763",
    title: "Tears of Steel (Trailer)",
    sourceType: "vimeo",
    vimeoId: "148751763",
    thumbnail: "https://i.vimeocdn.com/video/548628839-1280x720.jpg",
    altThumbnail: "https://i.vimeocdn.com/video/548628839-640x360.jpg",
    embeddable: true
  },
  { 
    id: "vimeo-90509568",
    title: "Sintel (Trailer)",
    sourceType: "vimeo",
    vimeoId: "90509568",
    thumbnail: "https://i.vimeocdn.com/video/469343246-1280x720.jpg",
    altThumbnail: "https://i.vimeocdn.com/video/469343246-640x360.jpg",
    embeddable: true
  },
  { 
    id: "vimeo-188153161",
    title: "Elephants Dream (Trailer)",
    sourceType: "vimeo",
    vimeoId: "188153161",
    thumbnail: "https://i.vimeocdn.com/video/602447834-1280x720.jpg",
    altThumbnail: "https://i.vimeocdn.com/video/602447834-640x360.jpg",
    embeddable: true
  },
];

export default videos;
