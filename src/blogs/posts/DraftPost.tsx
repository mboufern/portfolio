import React from 'react';
import { ArticleDraftNotice } from '../components/ArticlePrimitives';

export const DraftPost: React.FC = () => {
  return (
    <div className="py-2">
      <ArticleDraftNotice />
    </div>
  );
};
