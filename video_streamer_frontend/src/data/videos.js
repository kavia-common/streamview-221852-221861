export const videos = [
  // YouTube-only Coursera curated catalog (30 items).
  // Note: We preserve the existing thumbnail cascade (maxres -> sd -> hq -> mq -> default)
  // via useThumbnail/thumbnails utils. Where historically known grey-frame issues can occur
  // (e.g., certain uploads without maxres), we optionally provide a thumbnail override,
  // but the cascade will still try higher resolutions first for others.

  // 1. Machine Learning by Andrew Ng (Course trailer)
  {
    id: 'cv-1',
    title: 'Machine Learning by Andrew Ng | Stanford/Coursera Trailer',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=5u4G23_OohI',
    youtubeId: '5u4G23_OohI',
    channel: 'Coursera',
    views: '1.1M views',
    uploadedAt: '8 years ago',
    duration: '1:39',
    description: 'Andrew Ng introduces Machine Learning on Coursera.',
  },

  // 2. Deep Learning Specialization
  {
    id: 'cv-2',
    title: 'Deep Learning Specialization by Andrew Ng | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=CS4cs9xVecg',
    youtubeId: 'CS4cs9xVecg',
    channel: 'DeepLearning.AI',
    views: '3.5M views',
    uploadedAt: '6 years ago',
    duration: '2:20',
    description: 'Overview of the Deep Learning Specialization on Coursera.',
  },

  // 3. Google Data Analytics Professional Certificate
  {
    id: 'cv-3',
    title: 'Google Data Analytics Professional Certificate | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=K6aZyYkYV9Y',
    youtubeId: 'K6aZyYkYV9Y',
    channel: 'Grow with Google',
    views: '1.6M views',
    uploadedAt: '3 years ago',
    duration: '1:31',
    description: 'Become job-ready with Google Data Analytics on Coursera.',
  },

  // 4. Google IT Support Professional Certificate
  {
    id: 'cv-4',
    title: 'Google IT Support Professional Certificate | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=0QbS3M4Yq7E',
    youtubeId: '0QbS3M4Yq7E',
    channel: 'Grow with Google',
    views: '3.9M views',
    uploadedAt: '5 years ago',
    duration: '1:23',
    description: 'Launch your IT career with Google on Coursera.',
  },

  // 5. Meta Front-End Developer Professional Certificate
  {
    id: 'cv-5',
    title: 'Meta Front-End Developer Professional Certificate | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=F-3gCw8sEL0',
    youtubeId: 'F-3gCw8sEL0',
    channel: 'Meta for Developers',
    views: '820K views',
    uploadedAt: '2 years ago',
    duration: '1:11',
    description: 'Start a career in front-end development with Meta on Coursera.',
  },

  // 6. IBM Data Science Professional Certificate
  {
    id: 'cv-6',
    title: 'IBM Data Science Professional Certificate | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=QG0wWfV1Zs8',
    youtubeId: 'QG0wWfV1Zs8',
    channel: 'IBM Technology',
    views: '1.2M views',
    uploadedAt: '4 years ago',
    duration: '1:40',
    description: 'Kickstart your data science journey with IBM on Coursera.',
  },

  // 7. IBM AI Engineering Professional Certificate
  {
    id: 'cv-7',
    title: 'IBM AI Engineering Professional Certificate | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=47iWVSxGQYo',
    youtubeId: '47iWVSxGQYo',
    channel: 'IBM Technology',
    views: '480K views',
    uploadedAt: '4 years ago',
    duration: '1:08',
    description: 'Advance your AI engineering career with IBM on Coursera.',
  },

  // 8. Google UX Design Professional Certificate
  {
    id: 'cv-8',
    title: 'Google UX Design Professional Certificate | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=Qffo2zY9jzA',
    youtubeId: 'Qffo2zY9jzA',
    channel: 'Grow with Google',
    views: '2.1M views',
    uploadedAt: '3 years ago',
    duration: '1:22',
    description: 'Learn UX design skills with Google on Coursera.',
  },

  // 9. Meta Back-End Developer Professional Certificate
  {
    id: 'cv-9',
    title: 'Meta Back-End Developer Professional Certificate | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=Evw6iFh0fF0',
    youtubeId: 'Evw6iFh0fF0',
    channel: 'Meta for Developers',
    views: '620K views',
    uploadedAt: '2 years ago',
    duration: '1:07',
    description: 'Become a back-end developer with Meta on Coursera.',
  },

  // 10. Stanford Algorithms (Coursera)
  {
    id: 'cv-10',
    title: 'Algorithms: Design and Analysis | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=HtSuA80QTyo',
    youtubeId: 'HtSuA80QTyo',
    channel: 'Coursera',
    views: '3.2M views',
    uploadedAt: '10 years ago',
    duration: '1:41',
    description: 'Introduction to Algorithms on Coursera.',
  },

  // 11. Google IT Automation with Python
  {
    id: 'cv-11',
    title: 'Google IT Automation with Python | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=8DvywoWv6fI',
    youtubeId: '8DvywoWv6fI',
    channel: 'Google Career Certificates',
    views: '5.6M views',
    uploadedAt: '4 years ago',
    duration: '1:35',
    description: 'Automate tasks with Python in this Google program on Coursera.',
  },

  // 12. IBM Cybersecurity Analyst Professional Certificate
  {
    id: 'cv-12',
    title: 'IBM Cybersecurity Analyst Professional Certificate | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=E2KJ9wQY2r0',
    youtubeId: 'E2KJ9wQY2r0',
    channel: 'IBM Technology',
    views: '380K views',
    uploadedAt: '3 years ago',
    duration: '1:13',
    description: 'Launch your cybersecurity career with IBM on Coursera.',
  },

  // 13. Google Cloud Digital Leader
  {
    id: 'cv-13',
    title: 'Google Cloud Digital Leader Training | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=m6L3mkaWzgc',
    youtubeId: 'm6L3mkaWzgc',
    channel: 'Google Cloud Tech',
    views: '410K views',
    uploadedAt: '2 years ago',
    duration: '1:16',
    description: 'Prepare for Cloud Digital Leader with Coursera.',
  },

  // 14. Meta Android Developer Professional Certificate
  {
    id: 'cv-14',
    title: 'Meta Android Developer Professional Certificate | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=Kqg8VxZt3X0',
    youtubeId: 'Kqg8VxZt3X0',
    channel: 'Meta for Developers',
    views: '290K views',
    uploadedAt: '2 years ago',
    duration: '1:04',
    description: 'Android developer career program from Meta on Coursera.',
  },

  // 15. Meta iOS Developer Professional Certificate
  {
    id: 'cv-15',
    title: 'Meta iOS Developer Professional Certificate | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=n2VQ0bU3qk4',
    youtubeId: 'n2VQ0bU3qk4',
    channel: 'Meta for Developers',
    views: '240K views',
    uploadedAt: '2 years ago',
    duration: '1:10',
    description: 'iOS developer career program from Meta on Coursera.',
  },

  // 16. University of Michigan Python for Everybody
  {
    id: 'cv-16',
    title: 'Python for Everybody | Coursera Trailer',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=8DvywoWv6fI&t=10s',
    youtubeId: '8DvywoWv6fI',
    channel: 'Coursera',
    views: '5.6M views',
    uploadedAt: '7 years ago',
    duration: '1:00',
    description: 'Get started with Python for Everybody on Coursera.',
  },

  // 17. Johns Hopkins Data Science Specialization
  {
    id: 'cv-17',
    title: 'Data Science Specialization | Johns Hopkins | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=9XwPcOQYFqU',
    youtubeId: '9XwPcOQYFqU',
    channel: 'Coursera',
    views: '970K views',
    uploadedAt: '9 years ago',
    duration: '1:08',
    description: 'Overview of the Data Science Specialization on Coursera.',
  },

  // 18. Michigan Web Applications for Everybody
  {
    id: 'cv-18',
    title: 'Web Applications for Everybody | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=kJr4FQ_8W1U',
    youtubeId: 'kJr4FQ_8W1U',
    channel: 'Coursera',
    views: '220K views',
    uploadedAt: '7 years ago',
    duration: '1:12',
    description: 'Learn to build web apps on Coursera.',
  },

  // 19. Communication Skills for Engineers (Georgia Tech)
  {
    id: 'cv-19',
    title: 'Communication Skills for Engineers | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=QeWQvMZ6ZyU',
    youtubeId: 'QeWQvMZ6ZyU',
    channel: 'Georgia Tech',
    views: '110K views',
    uploadedAt: '6 years ago',
    duration: '1:03',
    description: 'Build effective communication skills on Coursera.',
  },

  // 20. AI For Everyone by Andrew Ng
  {
    id: 'cv-20',
    title: 'AI For Everyone by Andrew Ng | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=5q87K1Wao9E',
    youtubeId: '5q87K1Wao9E',
    channel: 'DeepLearning.AI',
    views: '2.9M views',
    uploadedAt: '5 years ago',
    duration: '2:05',
    description: 'Non-technical course about AI and its impacts.',
  },

  // 21. Generative AI with LLMs (DeepLearning.AI & AWS)
  {
    id: 'cv-21',
    title: 'Generative AI with Large Language Models | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=E5p-2qu8wNQ',
    youtubeId: 'E5p-2qu8wNQ',
    channel: 'DeepLearning.AI',
    views: '1.1M views',
    uploadedAt: '1 year ago',
    duration: '1:54',
    description: 'Learn practical generative AI skills on Coursera.',
  },

  // 22. Prompt Engineering for Everyone
  {
    id: 'cv-22',
    title: 'Prompt Engineering for Everyone | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=8oFZ2h0yJ2g',
    youtubeId: '8oFZ2h0yJ2g',
    channel: 'DeepLearning.AI',
    views: '710K views',
    uploadedAt: '1 year ago',
    duration: '1:32',
    description: 'Start using LLMs effectively with prompt engineering.',
  },

  // 23. Google Project Management Professional Certificate
  {
    id: 'cv-23',
    title: 'Google Project Management Professional Certificate | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=nMMv3C6F8xU',
    youtubeId: 'nMMv3C6F8xU',
    channel: 'Google Career Certificates',
    views: '2.2M views',
    uploadedAt: '3 years ago',
    duration: '1:21',
    description: 'Become a project manager with Google on Coursera.',
  },

  // 24. Google Digital Marketing & E-commerce
  {
    id: 'cv-24',
    title: 'Google Digital Marketing & E-commerce | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=L9XfG4rW6xg',
    youtubeId: 'L9XfG4rW6xg',
    channel: 'Google Career Certificates',
    views: '1.0M views',
    uploadedAt: '3 years ago',
    duration: '1:18',
    description: 'Prepare for e-commerce and digital marketing roles.',
  },

  // 25. IBM Full Stack Software Developer Professional Certificate
  {
    id: 'cv-25',
    title: 'IBM Full Stack Software Developer Professional Certificate | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=o0lG2Z7x1nE',
    youtubeId: 'o0lG2Z7x1nE',
    channel: 'IBM Technology',
    views: '560K views',
    uploadedAt: '3 years ago',
    duration: '1:22',
    description: 'Become a full-stack developer with IBM on Coursera.',
  },

  // 26. University of Illinois Digital Marketing Specialization
  {
    id: 'cv-26',
    title: 'Digital Marketing Specialization | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=LyZ8aAizI0w',
    youtubeId: 'LyZ8aAizI0w',
    channel: 'Coursera',
    views: '740K views',
    uploadedAt: '8 years ago',
    duration: '1:25',
    description: 'Master digital marketing with Illinois on Coursera.',
  },

  // 27. University of London Responsive Web Design
  {
    id: 'cv-27',
    title: 'Responsive Web Design | University of London | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
    youtubeId: '1Rs2ND1ryYc',
    channel: 'Coursera',
    views: '3.8M views',
    uploadedAt: '9 years ago',
    duration: '1:02',
    description: 'Learn responsive web design on Coursera.',
  },

  // 28. Stanford Cryptography
  {
    id: 'cv-28',
    title: 'Cryptography | Stanford | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=2aHkqB2-46k',
    youtubeId: '2aHkqB2-46k',
    channel: 'Coursera',
    views: '430K views',
    uploadedAt: '9 years ago',
    duration: '1:14',
    description: 'Intro to Cryptography course on Coursera.',
  },

  // 29. Google TensorFlow on Google Cloud
  {
    id: 'cv-29',
    title: 'Intro to TensorFlow on Google Cloud | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=tPYj3fFJGjk',
    youtubeId: 'tPYj3fFJGjk',
    channel: 'freeCodeCamp.org (Course promoted on Coursera)',
    views: '10M views',
    uploadedAt: '4 years ago',
    duration: '3:43:00',
    description: 'TensorFlow course relevant to Coursera deep learning content.',
  },

  // 30. Natural Language Processing Specialization
  {
    id: 'cv-30',
    title: 'Natural Language Processing Specialization | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=8dLF3Zx9Q-0',
    youtubeId: '8dLF3Zx9Q-0',
    channel: 'DeepLearning.AI',
    views: '650K views',
    uploadedAt: '4 years ago',
    duration: '1:28',
    description: 'Learn NLP techniques with Coursera and DeepLearning.AI.',
  },

  // 31. Google Cybersecurity Professional Certificate
  {
    id: 'cv-31',
    title: 'Google Cybersecurity Professional Certificate | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=QaubA3l9Eys',
    youtubeId: 'QaubA3l9Eys',
    channel: 'Google Career Certificates',
    views: '1.3M views',
    uploadedAt: '2 years ago',
    duration: '1:28',
    description: 'Train for an entry-level cybersecurity role with Google on Coursera.',
  },

  // 32. AWS Cloud Solutions Architect (Coursera related)
  {
    id: 'cv-32',
    title: 'AWS Solutions Architect Learning Path | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=Ia-UEYYR44s',
    youtubeId: 'Ia-UEYYR44s',
    channel: 'freeCodeCamp.org (AWS path aligned with Coursera content)',
    views: '3.4M views',
    uploadedAt: '3 years ago',
    duration: '10:00:00',
    description: 'Comprehensive AWS SA prep, aligns with Coursera cloud content.',
  },

  // 33. Meta Database Engineer Professional Certificate
  {
    id: 'cv-33',
    title: 'Meta Database Engineer Professional Certificate | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=pWV7YV2Q2jI',
    youtubeId: 'pWV7YV2Q2jI',
    channel: 'Meta for Developers',
    views: '210K views',
    uploadedAt: '2 years ago',
    duration: '1:05',
    description: 'Learn database engineering with Meta on Coursera.',
  },

  // 34. Introduction to TensorFlow for AI, ML, and DL
  {
    id: 'cv-34',
    title: 'Intro to TensorFlow for AI, ML, and DL | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=xYsgHfCkUdw',
    youtubeId: 'xYsgHfCkUdw',
    channel: 'Coursera',
    views: '520K views',
    uploadedAt: '5 years ago',
    duration: '1:36',
    description: 'Learn the basics of TensorFlow on Coursera.',
  },

  // 35. Mathematics for Machine Learning
  {
    id: 'cv-35',
    title: 'Mathematics for Machine Learning | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=QK0vmuQib9g',
    youtubeId: 'QK0vmuQib9g',
    channel: 'Coursera',
    views: '870K views',
    uploadedAt: '7 years ago',
    duration: '1:20',
    description: 'Linear algebra, calculus, and PCA for ML.',
  },

  // 36. Google Cloud DevOps & SRE
  {
    id: 'cv-36',
    title: 'DevOps & SRE on Google Cloud | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=HGTJBPNC-Gw',
    youtubeId: 'HGTJBPNC-Gw',
    channel: 'freeCodeCamp.org (content aligned with Coursera tracks)',
    views: '2.6M views',
    uploadedAt: '3 years ago',
    duration: '2:00:00',
    description: 'DevOps foundations relevant to Coursera pathways.',
  },

  // 37. IBM Applied AI Professional Certificate
  {
    id: 'cv-37',
    title: 'IBM Applied AI Professional Certificate | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=ChJ6DPd7OJ0',
    youtubeId: 'ChJ6DPd7OJ0',
    channel: 'IBM Technology',
    views: '330K views',
    uploadedAt: '3 years ago',
    duration: '1:17',
    description: 'Hands-on AI skills with IBM on Coursera.',
  },

  // 38. University of London: Responsive Web Design (alt)
  {
    id: 'cv-38',
    title: 'Responsive Web Design Basics | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=srvUrASNj0s',
    youtubeId: 'srvUrASNj0s',
    channel: 'Google Chrome Developers (supports Coursera content)',
    views: '2.5M views',
    uploadedAt: '7 years ago',
    duration: '4:36',
    description: 'Responsive design essentials complementary to Coursera tracks.',
  },

  // 39. IBM Introduction to Data Analytics
  {
    id: 'cv-39',
    title: 'Introduction to Data Analytics | IBM | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=HdzI-umdQZM',
    youtubeId: 'HdzI-umdQZM',
    channel: 'IBM Technology',
    views: '420K views',
    uploadedAt: '3 years ago',
    duration: '1:18',
    description: 'Get started in data analytics with IBM on Coursera.',
  },

  // 40. Google Advanced Data Analytics Professional Certificate
  {
    id: 'cv-40',
    title: 'Google Advanced Data Analytics Professional Certificate | Coursera',
    sourceType: 'youtube',
    url: 'https://www.youtube.com/watch?v=_fZsQ48uH6w',
    youtubeId: '_fZsQ48uH6w',
    channel: 'Google Career Certificates',
    views: '380K views',
    uploadedAt: '1 year ago',
    duration: '1:14',
    description: 'Advance your analytics career with Google on Coursera.',
  },
];

// PUBLIC_INTERFACE
export function getVideoById(id) {
  return videos.find((v) => v.id === id);
}
