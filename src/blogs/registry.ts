import type { BlogPostEntry } from './types';
import { GamesILikePost } from './posts/GamesILikePost';
import { WhatMakesGameFunBotwPost } from './posts/WhatMakesGameFunBotwPost';
import { DraftPost } from './posts/DraftPost';

export const BLOG_POSTS: BlogPostEntry[] = [
  {
    meta: {
      slug: 'games-i-like',
      title: 'Design Influences & Games I Like',
      subtitle:
        'Deconstructing world architecture, kinetic physics, reactive AI, and player agency in the titles that shape how I design software and games.',
      category: 'Game Dev',
      date: 'Nov 2026',
      readTime: '4 min read',
      tags: ['Game Design', 'Architecture', 'Personal Picks'],
      accent: '#ff779c',
      coverImage: '/assets/games/botw.jpg',
    },
    Component: GamesILikePost,
  },
  {
    meta: {
      slug: 'what-makes-a-game-fun-botw',
      title: 'What Makes a Game Fun? Zelda BOTW',
      subtitle:
        'How The Legend of Zelda: Breath of the Wild completely redefined what fun means to me.',
      category: 'Game Dev',
      date: 'Nov 2026',
      readTime: '4 min read',
      tags: ['Game Design', 'Zelda BOTW', 'Player Agency'],
      accent: '#15cea9',
      coverImage: '/assets/games/totk.jpg',
    },
    Component: WhatMakesGameFunBotwPost,
  },
  {
    meta: {
      slug: 'preventing-player-boredom-botw-mgsv',
      title: 'Anti-Boredom Mechanics: BOTW & MGSV',
      subtitle:
        'Preventing the player from boring themselves—systemic lessons from Breath of the Wild and Metal Gear Solid V.',
      category: 'Game Dev',
      date: 'Nov 2026',
      readTime: 'Coming soon',
      tags: ['Game Mechanics', 'BOTW', 'MGSV'],
      accent: '#f59e0b',
      coverImage: '/assets/games/mgsv.jpg',
      isDraft: true,
    },
    Component: DraftPost,
  },
  {
    meta: {
      slug: 'creating-your-own-game-design-tools',
      title: 'Creating Your Own Game Design Tools',
      subtitle:
        'Why building custom editors, debuggers, and workflow tools pays off when designing games.',
      category: 'Game Dev',
      date: 'Nov 2026',
      readTime: 'Coming soon',
      tags: ['Tooling', 'Game Design', 'Workflow'],
      accent: '#2bbece',
      coverImage: '/assets/games/portal-2.jpg',
      isDraft: true,
    },
    Component: DraftPost,
  },
  {
    meta: {
      slug: 'bleeding-edge-hobby-and-business',
      title: 'Between a Hobby and a Business',
      subtitle:
        'Walking the bleeding edge between building games purely for love and treating them as a sustainable business.',
      category: 'Game Dev',
      date: 'Nov 2026',
      readTime: 'Coming soon',
      tags: ['Indie Dev', 'Business', 'Mindset'],
      accent: '#ff779c',
      coverImage: '/assets/games/elden-ring.jpg',
      isDraft: true,
    },
    Component: DraftPost,
  },
  {
    meta: {
      slug: 'frameworks-that-explain-abstractions',
      title: 'Frameworks That Explain Abstractions',
      subtitle:
        'Why good software frameworks clarify the abstractions beneath them instead of hiding complexity behind magic.',
      category: 'Software Architecture',
      date: 'Nov 2026',
      readTime: 'Coming soon',
      tags: ['Architecture', 'Abstractions', 'Engineering'],
      accent: '#2bbece',
      coverImage: '/assets/projects/moraja3ati/feature-ostad.png',
      isDraft: true,
    },
    Component: DraftPost,
  },
  {
    meta: {
      slug: 'how-game-pace-controls-the-player',
      title: 'How Game Pace Controls the Player',
      subtitle:
        'Using tempo, tension, and breathing room to guide player emotion, curiosity, and decision-making.',
      category: 'Game Dev',
      date: 'Nov 2026',
      readTime: 'Coming soon',
      tags: ['Pacing', 'Game Design', 'Player Experience'],
      accent: '#ff779c',
      coverImage: '/assets/games/hades.jpg',
      isDraft: true,
    },
    Component: DraftPost,
  },
  {
    meta: {
      slug: 'insights-from-feedback-and-analytics',
      title: 'Insights From Feedback & Analytics',
      subtitle:
        'Extracting real, actionable signal from noisy playtest feedback and raw analytics data.',
      category: 'Software Architecture',
      date: 'Nov 2026',
      readTime: 'Coming soon',
      tags: ['Analytics', 'Feedback', 'Product'],
      accent: '#2bbece',
      coverImage: '/assets/projects/moraja3ati/feature-practice.png',
      isDraft: true,
    },
    Component: DraftPost,
  },
  {
    meta: {
      slug: 'balance-and-imbalance-in-silksong',
      title: 'Balance and Imbalance in Silksong',
      subtitle:
        'What makes combat and progression feel alive when a game embraces deliberate imbalance—through the lens of Silksong.',
      category: 'Game Dev',
      date: 'Nov 2026',
      readTime: 'Coming soon',
      tags: ['Game Balance', 'Silksong', 'Combat Design'],
      accent: '#ff779c',
      coverImage: '/assets/games/silksong.jpg',
      isDraft: true,
    },
    Component: DraftPost,
  },
  {
    meta: {
      slug: 'ai-can-code-now-good-for-us',
      title: 'AI Can Code Now—Good for Us',
      subtitle:
        'When writing syntax stops being the bottleneck, systems thinking, taste, and product direction matter more than ever.',
      category: 'Software Architecture',
      date: 'Nov 2026',
      readTime: 'Coming soon',
      tags: ['AI', 'Software Engineering', 'Craft'],
      accent: '#15cea9',
      coverImage: '/assets/projects/moraja3ati/hero-app-screenshot-old.png',
      isDraft: true,
    },
    Component: DraftPost,
  },
  {
    meta: {
      slug: 'is-art-really-dying',
      title: 'Is Art Really Dying?',
      subtitle:
        'Thoughts on human craft, originality, and creative intent in an era of automated media generation.',
      category: 'Art',
      date: 'Nov 2026',
      readTime: 'Coming soon',
      tags: ['Art', 'Craft', '3D & Visuals'],
      accent: '#a78bfa',
      coverImage: '/assets/projects/3d-art/helmet_1.png',
      isDraft: true,
    },
    Component: DraftPost,
  },
  {
    meta: {
      slug: 'game-jam-experience-before-ai',
      title: 'The Game Jam Experience Before AI',
      subtitle:
        'Looking back at the chaotic, scrappy magic of building game jam prototypes from scratch before AI tools.',
      category: 'Devlogs',
      date: 'Nov 2026',
      readTime: 'Coming soon',
      tags: ['Game Jam', 'Retrospective', 'Indie Dev'],
      accent: '#ff779c',
      coverImage: '/assets/projects/cursed-demons/ss1.png',
      isDraft: true,
    },
    Component: DraftPost,
  },
  {
    meta: {
      slug: 'moroccan-gaming-expo-2025',
      title: 'Moroccan Gaming Expo 2025',
      subtitle:
        'Floor notes, player reactions, and my experience showcasing indie work at Morocco Gaming Expo 2025.',
      category: 'Devlogs',
      date: 'Nov 2026',
      readTime: 'Coming soon',
      tags: ['Expo', 'Devlog', 'Community'],
      accent: '#15cea9',
      coverImage: '/assets/projects/scrap-vanguard/trailer_2.png',
      isDraft: true,
    },
    Component: DraftPost,
  },
  {
    meta: {
      slug: 'walls-and-tower-cardboard-to-steam',
      title: 'Walls & Tower: Cardboard to Steam',
      subtitle:
        'The ten-year journey of Walls & Tower Party—from hand-cut cardboard prototypes to launching on Steam.',
      category: 'Devlogs',
      date: 'Nov 2026',
      readTime: 'Coming soon',
      tags: ['Walls & Tower Party', 'Steam', 'Postmortem'],
      accent: '#f59e0b',
      coverImage: '/assets/projects/wnt/trailer_1.png',
      isDraft: true,
    },
    Component: DraftPost,
  },
  {
    meta: {
      slug: 'scrap-vanguard-letting-go-of-old-ideas',
      title: 'Scrap Vanguard: Letting Go of Ideas',
      subtitle:
        'Knowing when to cut beloved mechanics and old ideas that no longer serve the core game in Scrap Vanguard.',
      category: 'Devlogs',
      date: 'Nov 2026',
      readTime: 'Coming soon',
      tags: ['Scrap Vanguard', 'Design Cuts', 'Devlog'],
      accent: '#2bbece',
      coverImage: '/assets/projects/scrap-vanguard/trailer_1.png',
      isDraft: true,
    },
    Component: DraftPost,
  },
  {
    meta: {
      slug: 'scrap-vanguard-demo-results',
      title: 'Scrap Vanguard: Demo Results',
      subtitle:
        'Breaking down the numbers, playtest feedback, and lessons learned from releasing the Scrap Vanguard demo.',
      category: 'Devlogs',
      date: 'Nov 2026',
      readTime: 'Coming soon',
      tags: ['Scrap Vanguard', 'Demo', 'Analytics'],
      accent: '#2bbece',
      coverImage: '/assets/projects/scrap-vanguard/gameplay_1.png',
      isDraft: true,
    },
    Component: DraftPost,
  },
  {
    meta: {
      slug: 'under-under-agent-diplegia-failed-prototype',
      title: 'Under Under & Failed Prototypes',
      subtitle:
        'Developing Under Under and Agent Diplegia—and what a failed prototype teaches you faster than a success.',
      category: 'Devlogs',
      date: 'Nov 2026',
      readTime: 'Coming soon',
      tags: ['Under Under', 'Agent Diplegia', 'Postmortem'],
      accent: '#ff779c',
      coverImage: '/assets/projects/under-under/ss1.png',
      isDraft: true,
    },
    Component: DraftPost,
  },
];

export const getBlogPostBySlug = (slug: string): BlogPostEntry | undefined =>
  BLOG_POSTS.find((entry) => entry.meta.slug === slug);
