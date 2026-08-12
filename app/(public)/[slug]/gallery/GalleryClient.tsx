'use client';

import React from 'react';
import { Image as ImageIcon, ZoomIn } from 'lucide-react';
import MasonryGrid from '@/components/public/MasonryGrid';
import GalleryImageLightbox from '@/components/public/GalleryImageLightbox';

interface GalleryMedia {
  id: string;
  filePath: string;
  fileName: string;
  mimeType: string;
  displayUrl: string;
  createdAt: string;
}

interface GalleryClientProps {
  mediaList: GalleryMedia[];
  slug: string;
  themeConfig?: any;
}


export default function GalleryClient({ mediaList, slug, themeConfig }: GalleryClientProps) {
  const [activeAlbum, setActiveAlbum] = React.useState('ALL');
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const albums = (themeConfig?.albums as string[]) || [];
  const mediaAlbums = (themeConfig?.mediaAlbums as Record<string, string>) || {};

  const filteredMediaList = activeAlbum === 'ALL'
    ? mediaList
    : mediaList.filter((m) => mediaAlbums[m.id] === activeAlbum);

  React.useEffect(() => {
    setActiveIndex(null);
  }, [activeAlbum]);

  const lightboxItems = filteredMediaList.map((m) => ({
    id: m.id,
    displayUrl: m.displayUrl,
    fileName: m.fileName,
  }));

  return (
    <div className="space-y-5 sm:space-y-6">
      {albums.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pb-2 select-none sm:pb-4">
          <button
            type="button"
            onClick={() => setActiveAlbum('ALL')}
            className="rounded-full border px-4 py-1.5 text-xs font-bold transition"
            style={{
              borderColor: activeAlbum === 'ALL' ? 'var(--theme-primary, #0d9488)' : '#e7e5e4',
              backgroundColor: activeAlbum === 'ALL' ? 'var(--theme-primary, #0d9488)' : 'transparent',
              color: activeAlbum === 'ALL' ? 'white' : 'var(--theme-primary, #0d9488)',
            }}
          >
            ทั้งหมด ({mediaList.length})
          </button>
          {albums.map((albumName) => {
            const count = mediaList.filter((m) => mediaAlbums[m.id] === albumName).length;
            const isSelected = activeAlbum === albumName;
            return (
              <button
                key={albumName}
                type="button"
                onClick={() => setActiveAlbum(albumName)}
                className="rounded-full border px-4 py-1.5 text-xs font-bold transition"
                style={{
                  borderColor: isSelected ? 'var(--theme-primary, #0d9488)' : '#e7e5e4',
                  backgroundColor: isSelected ? 'var(--theme-primary, #0d9488)' : 'transparent',
                  color: isSelected ? 'white' : 'var(--theme-primary, #0d9488)',
                }}
              >
                {albumName} ({count})
              </button>
            );
          })}
        </div>
      )}

      {mediaList.length === 0 ? (
        <div className="space-y-2 rounded-2xl border border-dashed border-stone-200 py-16 text-center text-sm text-stone-500">
          <ImageIcon className="mx-auto block size-10 text-stone-300" />
          <p>ยังไม่มีการอัปโหลดไฟล์รูปภาพความทรงจำ</p>
        </div>
      ) : filteredMediaList.length === 0 ? (
        <div className="space-y-2 rounded-2xl border border-dashed border-stone-200 py-16 text-center text-sm text-stone-500">
          <ImageIcon className="mx-auto block size-10 text-stone-300" />
          <p>ยังไม่มีรูปภาพในอัลบั้มนี้</p>
        </div>
      ) : (
        <MasonryGrid itemCount={filteredMediaList.length}>
          {filteredMediaList.map((media, index) => (
            <button
              key={media.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative w-full overflow-hidden rounded-xl border border-stone-150 bg-stone-50 text-left shadow-xs transition hover:scale-[1.01] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--theme-primary,#0d9488)]/40 sm:rounded-2xl"
              aria-label={`ขยายรูป ${media.fileName}`}
            >
              <img
                src={media.displayUrl}
                alt={media.fileName}
                className="block h-auto w-full animate-fade-in"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 flex items-end justify-end bg-stone-900/0 p-2 transition group-hover:bg-stone-900/25 sm:p-3">
                <span className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs font-bold text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                  <ZoomIn className="h-3 w-3" />
                  ขยาย
                </span>
              </div>
            </button>
          ))}
        </MasonryGrid>
      )}

      <GalleryImageLightbox
        items={lightboxItems}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </div>
  );
}
