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

export default function GalleryClient({ mediaList, slug, themeConfig }: GalleryClientProps) {
  const [activeAlbum, setActiveAlbum] = React.useState('ALL');

  const albums = (themeConfig?.albums as string[]) || [];
  const mediaAlbums = (themeConfig?.mediaAlbums as Record<string, string>) || {};

  const filteredMediaList = activeAlbum === 'ALL'
    ? mediaList
    : mediaList.filter(m => mediaAlbums[m.id] === activeAlbum);

  return (
    <div className="space-y-6">
      {/* Album Tabs */}
      {albums.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pb-4 select-none">
          <button
            type="button"
            onClick={() => setActiveAlbum('ALL')}
            className="px-4 py-1.5 rounded-full text-xs font-bold transition border"
            style={{
              borderColor: activeAlbum === 'ALL' ? 'var(--theme-primary, #0d9488)' : '#e7e5e4',
              backgroundColor: activeAlbum === 'ALL' ? 'var(--theme-primary, #0d9488)' : 'transparent',
              color: activeAlbum === 'ALL' ? 'white' : 'var(--theme-primary, #0d9488)',
            }}
          >
            ทั้งหมด ({mediaList.length})
          </button>
          {albums.map((albumName) => {
            const count = mediaList.filter(m => mediaAlbums[m.id] === albumName).length;
            const isSelected = activeAlbum === albumName;
            return (
              <button
                key={albumName}
                type="button"
                onClick={() => setActiveAlbum(albumName)}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition border"
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

      {/* Grid Display */}
      {mediaList.length === 0 ? (
        <div className="text-center py-16 text-stone-500 text-sm border border-dashed border-stone-200 rounded-2xl space-y-2">
          <ImageIcon className="w-10 h-10 text-stone-300 mx-auto block" />
          <p>ยังไม่มีการอัปโหลดไฟล์รูปภาพความทรงจำ</p>
        </div>
      ) : filteredMediaList.length === 0 ? (
        <div className="text-center py-16 text-stone-500 text-sm border border-dashed border-stone-200 rounded-2xl space-y-2">
          <ImageIcon className="w-10 h-10 text-stone-300 mx-auto block" />
          <p>ยังไม่มีรูปภาพในอัลบั้มนี้</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {filteredMediaList.map((media) => {
            return (
              <div 
                key={media.id} 
                className="break-inside-avoid mb-4 relative group rounded-2xl overflow-hidden border border-stone-150 bg-stone-50 shadow-xs transition hover:scale-[1.01] hover:shadow-md"
              >
                <img 
                  src={media.displayUrl} 
                  alt={media.fileName} 
                  className="w-full h-auto block animate-fade-in" 
                  loading="lazy" 
                />
                <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition flex items-end p-3 pointer-events-none">
                  <span className="text-[10px] text-white font-medium truncate w-full">{media.fileName}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
