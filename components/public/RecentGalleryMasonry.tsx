'use client';

import MasonryGrid from '@/components/public/MasonryGrid';

type GalleryItem = {
  id: string;
  fileName: string;
  displayUrl: string;
};

export default function RecentGalleryMasonry({ items }: { items: GalleryItem[] }) {
  return (
    <MasonryGrid itemCount={items.length}>
      {items.map((m) => (
        <div
          key={m.id}
          className="overflow-hidden rounded-2xl border border-stone-150 bg-stone-50 transition hover:scale-[1.01] hover:shadow-sm"
        >
          <img
            src={m.displayUrl}
            alt={m.fileName}
            className="block h-auto w-full animate-fade-in"
            loading="lazy"
          />
        </div>
      ))}
    </MasonryGrid>
  );
}
