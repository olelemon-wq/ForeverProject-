'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

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

/**
 * Classic masonry (natural heights), always spanning the full card width.
 * Keep 4 columns on large screens even when photos are few — matches the ✓ reference.
 */
function masonryColumnsClass(count: number) {
  if (count <= 1) return 'columns-1 max-w-2xl mx-auto';
  if (count === 2) return 'columns-2';
  return 'columns-2 md:columns-3 lg:columns-4';
}

export default function GalleryClient({ mediaList, slug, themeConfig }: GalleryClientProps) {
  const [activeAlbum, setActiveAlbum] = React.useState('ALL');

  const albums = (themeConfig?.albums as string[]) || [];
  const mediaAlbums = (themeConfig?.mediaAlbums as Record<string, string>) || {};

  const filteredMediaList = activeAlbum === 'ALL'
    ? mediaList
    : mediaList.filter((m) => mediaAlbums[m.id] === activeAlbum);

  return (
    <div className="space-y-6">
      {albums.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pb-4 select-none">
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
        <div className={`w-full [column-gap:1rem] ${masonryColumnsClass(filteredMediaList.length)}`}>
          {filteredMediaList.map((media) => (
            <div
              key={media.id}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-stone-150 bg-stone-50 shadow-xs transition hover:scale-[1.01] hover:shadow-md"
            >
              <img
                src={media.displayUrl}
                alt={media.fileName}
                className="block h-auto w-full animate-fade-in"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 flex items-end bg-stone-900/40 p-3 opacity-0 transition group-hover:opacity-100">
                <span className="w-full truncate text-[10px] font-medium text-white">{media.fileName}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
