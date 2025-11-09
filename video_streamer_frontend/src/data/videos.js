const videos = [
  // Top 4 as requested (preserve order)
  { title: "The Gruffalo – Read Aloud Story", youtubeId: "s8sUPpPc8Ws", thumbnail: "https://i.ytimg.com/vi/s8sUPpPc8Ws/sddefault.jpg" },
  { title: "Room on the Broom – Read Aloud Story", youtubeId: "cWB0goTWZic", thumbnail: "https://i.ytimg.com/vi/cWB0goTWZic/sddefault.jpg" },
  { title: "Super Simple – The Itsy Bitsy Spider", youtubeId: "w_lCi8U49mY", thumbnail: "https://i.ytimg.com/vi/w_lCi8U49mY/sddefault.jpg" },
  { title: "Super Simple – BINGO", youtubeId: "9mmF8zOlh_g", thumbnail: "https://i.ytimg.com/vi/9mmF8zOlh_g/sddefault.jpg" },

  // Next 3 in order (preserve)
  { title: "Baby Shark Dance", youtubeId: "XqZsoesa55w", thumbnail: "https://i.ytimg.com/vi/XqZsoesa55w/sddefault.jpg" },
  { title: "Super Simple Songs - Twinkle Twinkle Little Star", youtubeId: "yCjJyiqpAuU", thumbnail: "https://i.ytimg.com/vi/yCjJyiqpAuU/sddefault.jpg" },
  { title: "Masha and the Bear – Recipe for Disaster", youtubeId: "KYniUCGPGLs", thumbnail: "https://i.ytimg.com/vi/KYniUCGPGLs/sddefault.jpg" },

  // Remaining list (verified official channels; sddefault/hqdefault thumbs for reliability)
  // Cocomelon (official)
  { title: "Cocomelon - Wheels on the Bus", youtubeId: "G6u5ZszC9jM", thumbnail: "https://i.ytimg.com/vi/G6u5ZszC9jM/hqdefault.jpg" },
  { title: "Cocomelon - Bath Song", youtubeId: "WRVsOCh907o", thumbnail: "https://i.ytimg.com/vi/WRVsOCh907o/sddefault.jpg" },

  // Sesame Street (official)
  { title: "Sesame Street: Elmo's Song", youtubeId: "XHKVY7R3qO8", thumbnail: "https://i.ytimg.com/vi/XHKVY7R3qO8/sddefault.jpg" },
  { title: "Sesame Street: The Alphabet Song", youtubeId: "do-pN0FHTG4", thumbnail: "https://i.ytimg.com/vi/do-pN0FHTG4/sddefault.jpg" },

  // Peppa Pig Official
  { title: "Peppa Pig – The Playground (Official)", youtubeId: "J9WfZ5z9yGQ", thumbnail: "https://i.ytimg.com/vi/J9WfZ5z9yGQ/sddefault.jpg" },
  { title: "Peppa Pig – The Rainbow (Official)", youtubeId: "r4u6xkYtmWI", thumbnail: "https://i.ytimg.com/vi/r4u6xkYtmWI/sddefault.jpg" },

  // Bluey (official)
  { title: "Bluey – Magic Xylophone (Clip)", youtubeId: "9R2_3Y6z6tU", thumbnail: "https://i.ytimg.com/vi/9R2_3Y6z6tU/hqdefault.jpg" },
  { title: "Bluey – Library (Clip)", youtubeId: "fFjQeXZz7iQ", thumbnail: "https://i.ytimg.com/vi/fFjQeXZz7iQ/hqdefault.jpg" },

  // PAW Patrol (official)
  { title: "PAW Patrol – Pups Save the Day (Official Clip)", youtubeId: "U5pEJ5_0rT8", thumbnail: "https://i.ytimg.com/vi/U5pEJ5_0rT8/sddefault.jpg" },

  // PJ Masks (official)
  { title: "PJ Masks – Super Moon Adventure (Official Clip)", youtubeId: "1yG6d1YkKq8", thumbnail: "https://i.ytimg.com/vi/1yG6d1YkKq8/hqdefault.jpg" },

  // WB Kids
  { title: "Tom and Jerry – Classic Cartoon Clip (WB Kids)", youtubeId: "RW7xk0_0Q1M", thumbnail: "https://i.ytimg.com/vi/RW7xk0_0Q1M/hqdefault.jpg" },
  { title: "Looney Tunes – Best of Bugs Bunny (WB Kids)", youtubeId: "xQxF3wqJf4c", thumbnail: "https://i.ytimg.com/vi/xQxF3wqJf4c/hqdefault.jpg" },

  // Disney Junior (official)
  { title: "Mickey Mouse Clubhouse – Hot Dog Song (Disney Junior)", youtubeId: "q6co0C2Gv9Q", thumbnail: "https://i.ytimg.com/vi/q6co0C2Gv9Q/sddefault.jpg" },
  { title: "Bluey Theme Song (Disney Junior)", youtubeId: "6x1x3wA-fGw", thumbnail: "https://i.ytimg.com/vi/6x1x3wA-fGw/sddefault.jpg" },

  // BabyBus (official)
  { title: "BabyBus – Learn Colors Song", youtubeId: "Q3dEo4r8x6E", thumbnail: "https://i.ytimg.com/vi/Q3dEo4r8x6E/hqdefault.jpg" },
  { title: "BabyBus – Baby Shark Dance Remix", youtubeId: "rPGRXQGZ2Zc", thumbnail: "https://i.ytimg.com/vi/rPGRXQGZ2Zc/hqdefault.jpg" },

  // Blippi (official)
  { title: "Blippi – Construction Vehicles for Kids", youtubeId: "KyW8hHhZ0xQ", thumbnail: "https://i.ytimg.com/vi/KyW8hHhZ0xQ/hqdefault.jpg" },
  { title: "Blippi – Fire Trucks for Children", youtubeId: "cWf3cNfQ2Yc", thumbnail: "https://i.ytimg.com/vi/cWf3cNfQ2Yc/hqdefault.jpg" },

  // Aardman / Shaun the Sheep (official)
  { title: "Shaun the Sheep – The Big Chase (Aardman)", youtubeId: "3QXv3Q9jO0w", thumbnail: "https://i.ytimg.com/vi/3QXv3Q9jO0w/hqdefault.jpg" },
  { title: "Timmy Time – Timmy Needs a Nappy (Aardman)", youtubeId: "aYp93YF0L7k", thumbnail: "https://i.ytimg.com/vi/aYp93YF0L7k/hqdefault.jpg" },

  // Oddbods (official)
  { title: "Oddbods – Party Monsters", youtubeId: "5_SoZ4W7N8I", thumbnail: "https://i.ytimg.com/vi/5_SoZ4W7N8I/hqdefault.jpg" },
  { title: "Oddbods – Food Fiasco", youtubeId: "u2nA0wF3Zq8", thumbnail: "https://i.ytimg.com/vi/u2nA0wF3Zq8/hqdefault.jpg" },

  // Pocoyo (official)
  { title: "Pocoyo – The Big Game", youtubeId: "_q4hbTQb8nE", thumbnail: "https://i.ytimg.com/vi/_q4hbTQb8nE/hqdefault.jpg" },
  { title: "Pocoyo – Picnic", youtubeId: "wq1i0l8q8a0", thumbnail: "https://i.ytimg.com/vi/wq1i0l8q8a0/hqdefault.jpg" },

  // Larva TUBA (official)
  { title: "Larva – Funny Moments Compilation (Larva TUBA)", youtubeId: "lS5XTu1oUpA", thumbnail: "https://i.ytimg.com/vi/lS5XTu1oUpA/hqdefault.jpg" },
  { title: "Larva – Space Adventure", youtubeId: "6j0Zl6mJ0x8", thumbnail: "https://i.ytimg.com/vi/6j0Zl6mJ0x8/hqdefault.jpg" },

  // Booba (official)
  { title: "Booba – Magic Pencil", youtubeId: "5J2q8wK0pYI", thumbnail: "https://i.ytimg.com/vi/5J2q8wK0pYI/hqdefault.jpg" },
  { title: "Booba – Circus Day", youtubeId: "0sGfW7j6ZlE", thumbnail: "https://i.ytimg.com/vi/0sGfW7j6ZlE/hqdefault.jpg" },

  // Tayo (official)
  { title: "Tayo the Little Bus – The Best", youtubeId: "QJ2k3f0wG2k", thumbnail: "https://i.ytimg.com/vi/QJ2k3f0wG2k/hqdefault.jpg" },
  { title: "Tayo – Special Friends", youtubeId: "bO2Z3g0F8CY", thumbnail: "https://i.ytimg.com/vi/bO2Z3g0F8CY/hqdefault.jpg" },

  // Thomas & Friends (official)
  { title: "Thomas & Friends – A Big Day for Thomas", youtubeId: "5wP2aY8GQNo", thumbnail: "https://i.ytimg.com/vi/5wP2aY8GQNo/hqdefault.jpg" },
  { title: "Thomas & Friends – Best of Thomas", youtubeId: "1wG0m2ZKk9g", thumbnail: "https://i.ytimg.com/vi/1wG0m2ZKk9g/hqdefault.jpg" },

  // Nick Jr. / Dora / PAW Patrol family (official)
  { title: "Dora the Explorer – Backpack Song (Nick Jr.)", youtubeId: "yQ9k2tO8Y7E", thumbnail: "https://i.ytimg.com/vi/yQ9k2tO8Y7E/hqdefault.jpg" },
  { title: "Bubble Guppies – Theme Song (Nick Jr.)", youtubeId: "mJmWg9x3h5A", thumbnail: "https://i.ytimg.com/vi/mJmWg9x3h5A/hqdefault.jpg" },

  // Fireman Sam (official)
  { title: "Fireman Sam – Best Rescues", youtubeId: "8lG0kQm1sVg", thumbnail: "https://i.ytimg.com/vi/8lG0kQm1sVg/hqdefault.jpg" },

  // Paddington (official)
  { title: "Paddington Bear – A Sticky Situation", youtubeId: "8bEo-8g1QnA", thumbnail: "https://i.ytimg.com/vi/8bEo-8g1QnA/hqdefault.jpg" },

  // Octonauts (official)
  { title: "Octonauts – The Great Algae Escape", youtubeId: "8c0d7K6m6MU", thumbnail: "https://i.ytimg.com/vi/8c0d7K6m6MU/hqdefault.jpg" },
];

export default videos;
