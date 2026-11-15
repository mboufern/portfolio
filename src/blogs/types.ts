import type React from 'react';

export interface BlogPostMeta {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  tags: string[];
  accent: string;
  coverImage?: string;
}

export interface BlogPostEntry {
  meta: BlogPostMeta;
  Component: React.FC;
}
