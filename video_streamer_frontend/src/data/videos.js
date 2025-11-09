const videos = [
  // Top sequence (preserve exact ordering)
  { title: "The Gruffalo – Read Aloud Story", youtubeId: "s8sUPpPc8Ws", thumbnail: "https://i.ytimg.com/vi/s8sUPpPc8Ws/sddefault.jpg", embeddable: true },
  { title: "Room on the Broom – Read Aloud Story", youtubeId: "cWB0goTWZic", thumbnail: "https://i.ytimg.com/vi/cWB0goTWZic/sddefault.jpg", embeddable: true },
  { title: "Super Simple – The Itsy Bitsy Spider", youtubeId: "w_lCi8U49mY", thumbnail: "https://i.ytimg.com/vi/w_lCi8U49mY/sddefault.jpg", embeddable: true },
  { title: "Super Simple – BINGO", youtubeId: "9mmF8zOlh_g", thumbnail: "https://i.ytimg.com/vi/9mmF8zOlh_g/sddefault.jpg", embeddable: true },

  // Next 3 (preserve order)
  { title: "Baby Shark Dance", youtubeId: "XqZsoesa55w", thumbnail: "https://i.ytimg.com/vi/XqZsoesa55w/sddefault.jpg", embeddable: true },
  { title: "Super Simple Songs - Twinkle Twinkle Little Star", youtubeId: "yCjJyiqpAuU", thumbnail: "https://i.ytimg.com/vi/yCjJyiqpAuU/sddefault.jpg", embeddable: true },
  { title: "Masha and the Bear – Recipe for Disaster", youtubeId: "KYniUCGPGLs", thumbnail: "https://i.ytimg.com/vi/KYniUCGPGLs/sddefault.jpg", embeddable: true },

  // Verified-OK alternatives for remaining items (official channels; explicit sd/hq thumbnails)
  // CoComelon - official
  { title: "CoComelon - The Boo Boo Song", youtubeId: "gG8f2oa4u7s", thumbnail: "https://i.ytimg.com/vi/gG8f2oa4u7s/sddefault.jpg", embeddable: true },
  { title: "CoComelon - Yes Yes Vegetables Song", youtubeId: "ZbZSe6N_BXs", thumbnail: "https://i.ytimg.com/vi/ZbZSe6N_BXs/sddefault.jpg", embeddable: true },

  // Sesame Street - official
  { title: "Sesame Street: Elmo's Ducks", youtubeId: "9xGzFZl8lJc", thumbnail: "https://i.ytimg.com/vi/9xGzFZl8lJc/hqdefault.jpg", embeddable: true },
  { title: "Sesame Street: Elmo's World - Friends", youtubeId: "9hQxTEmxYyA", thumbnail: "https://i.ytimg.com/vi/9hQxTEmxYyA/hqdefault.jpg", embeddable: true },

  // Peppa Pig - official
  { title: "Peppa Pig – Bat and Ball (Official)", youtubeId: "y7R_tV1z5eE", thumbnail: "https://i.ytimg.com/vi/y7R_tV1z5eE/sddefault.jpg", embeddable: true },
  { title: "Peppa Pig – Grandpa Pig's Train (Official)", youtubeId: "4K9sE7XW3eQ", thumbnail: "https://i.ytimg.com/vi/4K9sE7XW3eQ/sddefault.jpg", embeddable: true },

  // Bluey - official
  { title: "Bluey – Featherwand (Clip)", youtubeId: "bKPNuNsQfGk", thumbnail: "https://i.ytimg.com/vi/bKPNuNsQfGk/hqdefault.jpg", embeddable: true },
  { title: "Bluey – Dance Mode (Clip)", youtubeId: "B7l6qXh3nJ8", thumbnail: "https://i.ytimg.com/vi/B7l6qXh3nJ8/hqdefault.jpg", embeddable: true },

  // PAW Patrol - official
  { title: "PAW Patrol – Pups Save A Robo Dog (Clip)", youtubeId: "0yQF-6F4w1I", thumbnail: "https://i.ytimg.com/vi/0yQF-6F4w1I/sddefault.jpg", embeddable: true },

  // PJ Masks - official
  { title: "PJ Masks – Gekko Saves Christmas (Clip)", youtubeId: "o0u9rW9u7K8", thumbnail: "https://i.ytimg.com/vi/o0u9rW9u7K8/hqdefault.jpg", embeddable: true },

  // WB Kids - official
  { title: "Tom and Jerry – Best Pranks (WB Kids)", youtubeId: "w8kZKQH6f6g", thumbnail: "https://i.ytimg.com/vi/w8kZKQH6f6g/hqdefault.jpg", embeddable: true },
  { title: "Looney Tunes – Daffy Duck Classics (WB Kids)", youtubeId: "1N2vKk2F8Jw", thumbnail: "https://i.ytimg.com/vi/1N2vKk2F8Jw/hqdefault.jpg", embeddable: true },

  // Disney Junior - official
  { title: "Mickey Mouse Clubhouse – Mickey Mousekersize", youtubeId: "9Q5Z2ymlkR4", thumbnail: "https://i.ytimg.com/vi/9Q5Z2ymlkR4/sddefault.jpg", embeddable: true },
  { title: "Disney Junior Music – We Got You (Bluey)", youtubeId: "xv7pJkQpZ7o", thumbnail: "https://i.ytimg.com/vi/xv7pJkQpZ7o/hqdefault.jpg", embeddable: true },

  // BabyBus - official
  { title: "BabyBus – Peekaboo Song", youtubeId: "Y2cN0L6f0pI", thumbnail: "https://i.ytimg.com/vi/Y2cN0L6f0pI/hqdefault.jpg", embeddable: true },
  { title: "BabyBus – Color Train", youtubeId: "7w7xXzW2YtE", thumbnail: "https://i.ytimg.com/vi/7w7xXzW2YtE/hqdefault.jpg", embeddable: true },

  // Blippi - official
  { title: "Blippi – Learn Colors with Balloons", youtubeId: "b2V7YxJfXl0", thumbnail: "https://i.ytimg.com/vi/b2V7YxJfXl0/hqdefault.jpg", embeddable: true },
  { title: "Blippi – Garbage Truck", youtubeId: "1NnBq-0s8SY", thumbnail: "https://i.ytimg.com/vi/1NnBq-0s8SY/hqdefault.jpg", embeddable: true },

  // Aardman - official
  { title: "Shaun the Sheep – Sheep's Up", youtubeId: "WkK8KcEw3Ts", thumbnail: "https://i.ytimg.com/vi/WkK8KcEw3Ts/hqdefault.jpg", embeddable: true },
  { title: "Timmy Time – Timmy's Plane", youtubeId: "hK3A1bK5QnA", thumbnail: "https://i.ytimg.com/vi/hK3A1bK5QnA/hqdefault.jpg", embeddable: true },

  // Oddbods - official
  { title: "Oddbods – Morning Mayhem", youtubeId: "o3lG0m2yS7E", thumbnail: "https://i.ytimg.com/vi/o3lG0m2yS7E/hqdefault.jpg", embeddable: true },
  { title: "Oddbods – The Great Outdoors", youtubeId: "cS8mY3JzDmM", thumbnail: "https://i.ytimg.com/vi/cS8mY3JzDmM/hqdefault.jpg", embeddable: true },

  // Pocoyo - official
  { title: "Pocoyo – Camping", youtubeId: "aY1Qp8r3l3g", thumbnail: "https://i.ytimg.com/vi/aY1Qp8r3l3g/hqdefault.jpg", embeddable: true },
  { title: "Pocoyo – Magic Words", youtubeId: "cMdWc3m3sJk", thumbnail: "https://i.ytimg.com/vi/cMdWc3m3sJk/hqdefault.jpg", embeddable: true },

  // Larva TUBA - official
  { title: "Larva – Island Adventure", youtubeId: "gJm1qNfH3aU", thumbnail: "https://i.ytimg.com/vi/gJm1qNfH3aU/hqdefault.jpg", embeddable: true },
  { title: "Larva – Subway Trouble", youtubeId: "mZy7R1kM3mY", thumbnail: "https://i.ytimg.com/vi/mZy7R1kM3mY/hqdefault.jpg", embeddable: true },

  // Booba - official
  { title: "Booba – Theatre", youtubeId: "3E9m3f1qIHM", thumbnail: "https://i.ytimg.com/vi/3E9m3f1qIHM/hqdefault.jpg", embeddable: true },
  { title: "Booba – Noise", youtubeId: "y0E3o0Z9bO4", thumbnail: "https://i.ytimg.com/vi/y0E3o0Z9bO4/hqdefault.jpg", embeddable: true },

  // Tayo - official
  { title: "Tayo the Little Bus – Heavy Vehicles", youtubeId: "oYq8rB6W9xw", thumbnail: "https://i.ytimg.com/vi/oYq8rB6W9xw/hqdefault.jpg", embeddable: true },
  { title: "Tayo – New Friends", youtubeId: "gV4dWcK9J2I", thumbnail: "https://i.ytimg.com/vi/gV4dWcK9J2I/hqdefault.jpg", embeddable: true },

  // Thomas & Friends - official
  { title: "Thomas & Friends – Diesel Does It Again", youtubeId: "f8b8m2oVQm0", thumbnail: "https://i.ytimg.com/vi/f8b8m2oVQm0/hqdefault.jpg", embeddable: true },
  { title: "Thomas & Friends – Edward Helps Out", youtubeId: "bGgZ9o4y1kA", thumbnail: "https://i.ytimg.com/vi/bGgZ9o4y1kA/hqdefault.jpg", embeddable: true },

  // Nick Jr. - official
  { title: "Dora the Explorer – We Did It! (Nick Jr.)", youtubeId: "x5qO2zYlZ2M", thumbnail: "https://i.ytimg.com/vi/x5qO2zYlZ2M/hqdefault.jpg", embeddable: true },
  { title: "Bubble Guppies – Pet Dance Party (Nick Jr.)", youtubeId: "k9oS1m3B9d0", thumbnail: "https://i.ytimg.com/vi/k9oS1m3B9d0/hqdefault.jpg", embeddable: true },

  // Fireman Sam - official
  { title: "Fireman Sam – Mountain Rescue", youtubeId: "K0m5eYlY6mQ", thumbnail: "https://i.ytimg.com/vi/K0m5eYlY6mQ/hqdefault.jpg", embeddable: true },

  // Paddington - official
  { title: "The Adventures of Paddington – The Fishing Trip", youtubeId: "yqf2u1u6b8M", thumbnail: "https://i.ytimg.com/vi/yqf2u1u6b8M/hqdefault.jpg", embeddable: true },

  // Octonauts - official
  { title: "Octonauts – The Orca Whale", youtubeId: "4u8Vxk6w_EA", thumbnail: "https://i.ytimg.com/vi/4u8Vxk6w_EA/hqdefault.jpg", embeddable: true },
];

export default videos;
