import { FaBomb, FaCode, FaPalette, FaScroll } from 'react-icons/fa6';
import type { BlogCategory } from './types';

export const BLOG_CATEGORIES: Array<'All' | BlogCategory> = [
  'All',
  'Game Dev',
  'Software Architecture',
  'Art',
  'Devlogs',
];

export const getCategoryIcon = (category: BlogCategory, className = 'w-4 h-4') => {
  switch (category) {
    case 'Game Dev':
      return <FaBomb className={className} />;
    case 'Software Architecture':
      return <FaCode className={className} />;
    case 'Art':
      return <FaPalette className={className} />;
    case 'Devlogs':
    default:
      return <FaScroll className={className} />;
  }
};
