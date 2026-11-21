import React from 'react';
import {
  ArticleLead,
  ArticleParagraph,
  ArticleSectionHeading,
  ArticleQuote,
} from '../components/ArticlePrimitives';

/**
 * Template for creating a new blog post:
 * 1. Duplicate this file into src/blogs/posts/<YourPost>.tsx
 * 2. Author editorial content using ArticlePrimitives inside the exported component
 * 3. Register metadata + component inside src/blogs/registry.ts
 */
export const TemplatePost: React.FC = () => {
  return (
    <div className="space-y-6">
      <ArticleLead>
        Opening lead paragraph introducing the central idea of the essay.
      </ArticleLead>

      <ArticleSectionHeading>Section Heading</ArticleSectionHeading>
      <ArticleParagraph>
        Body paragraphs use clean editorial prose with generous line-height and a
        comfortable reading measure.
      </ArticleParagraph>

      <ArticleQuote>
        Pull quotes highlight a key insight or design takeaway.
      </ArticleQuote>
    </div>
  );
};
