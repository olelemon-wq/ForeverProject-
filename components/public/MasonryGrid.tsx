'use client';

import Masonry from 'react-masonry-css';
import { getMasonryBreakpoints, type MasonryGridProps } from '@/lib/masonry';

export default function MasonryGrid({ itemCount, children, className = '' }: MasonryGridProps) {
  return (
    <Masonry
      breakpointCols={getMasonryBreakpoints(itemCount)}
      className={`masonry-grid ${className}`.trim()}
      columnClassName="masonry-grid_column"
    >
      {children}
    </Masonry>
  );
}
