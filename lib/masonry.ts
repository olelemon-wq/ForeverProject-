import type { ReactNode } from 'react';

type MasonryBreakpointCols = number | { default: number; [key: number]: number };

/** Column counts per breakpoint for react-masonry-css. */
export function getMasonryBreakpoints(itemCount: number): MasonryBreakpointCols {
  if (itemCount <= 1) return { default: 1 };
  if (itemCount === 2) return { default: 2 };
  if (itemCount <= 4) return { default: 2, 1024: 3 };
  if (itemCount <= 8) return { default: 2, 640: 3, 1024: 4 };
  return { default: 2, 640: 3, 1024: 4, 1280: 5 };
}

export type MasonryGridProps = {
  itemCount: number;
  children: ReactNode;
  className?: string;
};
