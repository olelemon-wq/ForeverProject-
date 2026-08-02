'use client';

import { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import GalleryImageLightbox from '@/components/public/GalleryImageLightbox';

type GalleryItem = {
  id: string;
  fileName: string;
  displayUrl: string;
};

function getContainerClass(count: number): string {
  if (count === 1) return 'grid grid-cols-1 gap-2 sm:gap-3';
  if (count === 2) return 'grid grid-cols-2 gap-2 sm:gap-3';
  if (count === 3) {
    return 'grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-2 md:grid-rows-2 md:min-h-[280px] lg:min-h-[320px]';
  }
  return 'grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:grid-rows-3 md:min-h-[300px] lg:min-h-[400px]';
}

function getItemClass(index: number, count: number): string {
  const base =
    'group relative overflow-hidden rounded-xl border border-stone-150/80 bg-stone-100 shadow-xs transition duration-300 hover:scale-[1.01] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--theme-primary,#0d9488)]/40';

  if (count === 1) {
    return cn(base, 'col-span-full aspect-[16/10]');
  }

  if (count === 2) {
    return cn(base, 'aspect-[4/3]');
  }

  if (count === 3) {
    if (index === 0) {
      return cn(
        base,
        'col-span-2 aspect-[16/10] md:col-span-1 md:row-span-2 md:aspect-auto md:h-full md:min-h-0',
      );
    }
    return cn(base, 'aspect-[4/3] md:aspect-auto md:h-full md:min-h-0');
  }

  if (index === 0) {
    return cn(
      base,
      'aspect-[4/3] md:col-span-2 md:row-span-3 md:aspect-auto md:h-full md:min-h-0',
    );
  }
  return cn(base, 'aspect-[4/3] md:aspect-auto md:h-full md:min-h-0');
}

export default function RecentGalleryBento({ items }: { items: GalleryItem[] }) {
  const visible = items.slice(0, 4);
  const count = visible.length;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className={getContainerClass(count)}>
        {visible.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={getItemClass(index, count)}
            aria-label={`ขยายรูป ${item.fileName}`}
          >
            <img
              src={item.displayUrl}
              alt={item.fileName}
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 flex items-end justify-end bg-stone-900/0 p-2 transition group-hover:bg-stone-900/20">
              <span className="flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[9px] font-bold text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                <ZoomIn className="h-3 w-3" />
                ขยาย
              </span>
            </div>
          </button>
        ))}
      </div>

      <GalleryImageLightbox
        items={visible}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </>
  );
}
