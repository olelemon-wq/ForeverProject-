'use client';

import Masonry from 'react-masonry-css';
import { getMasonryBreakpoints, type MasonryGridProps } from '@/lib/masonry';

export default function MasonryGrid({ itemCount, children, className = '' }: MasonryGridProps) {
  return (
    <Masonry
      breakpointCols={getMasonryBreakpoints(itemCount)}
      className={`flex w-auto -ml-2 sm:-ml-4 ${className}`.trim()}
      columnClassName="box-border flex flex-col gap-2 bg-clip-padding pl-2 sm:gap-4 sm:pl-4"
    >
      {children}
    </Masonry>
  );
}
