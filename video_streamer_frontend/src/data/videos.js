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
];

export default videos;
