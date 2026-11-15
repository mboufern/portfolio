import type { BlogPostEntry } from './types';
import { GamesILikePost } from './posts/GamesILikePost';
import { TemplatePost } from './posts/_TemplatePost';

export const BLOG_POSTS: BlogPostEntry[] = [
  {
    meta: {
      slug: 'games-i-like',
      title: 'Design Influences & Games I Like',
      subtitle:
        'Deconstructing world architecture, kinetic physics, reactive AI, and player agency in the titles that shape how I design software and games.',
      date: '2026',
      readTime: '4 min read',
      tags: ['Game Design', 'Architecture', 'Personal Picks'],
      accent: '#ff779c',
      coverImage: '/assets/games/botw.jpg',
    },
    Component: GamesILikePost,
  },
  {
    meta: {
      slug: 'building-scrap-vanguard-systems',
      title: 'Building Modular Combat & Devlog Notes',
      subtitle:
        'Behind the scenes of architecting wave-based survival rigs, Shader Graph effects, and rapid iteration workflows.',
      date: '2026',
      readTime: '3 min read',
      tags: ['Devlog', 'Unity', 'Engineering'],
      accent: '#2bbece',
    },
    Component: TemplatePost,
  },
];

export const getBlogPostBySlug = (slug: string): BlogPostEntry | undefined =>
  BLOG_POSTS.find((entry) => entry.meta.slug === slug);
