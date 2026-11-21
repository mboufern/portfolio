import type React from 'react';

export type BlogCategory =
  | 'Game Dev'
  | 'Software Architecture'
  | 'Art'
  | 'Devlogs';

export interface BlogPostMeta {
  slug: string;
  title: string;
  subtitle: string;
  category: BlogCategory;
  date: string;
  readTime: string;
  tags: string[];
  accent: string;
  coverImage?: string;
  isDraft?: boolean;
}

export interface BlogPostEntry {
  meta: BlogPostMeta;
  Component: React.FC;
}
