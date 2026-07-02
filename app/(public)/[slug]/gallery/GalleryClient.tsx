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
}

export default function GalleryClient({ mediaList, slug }: GalleryClientProps) {
  return (
    <div className="space-y-6">
      {/* Grid Display */}
      {mediaList.length === 0 ? (
        <div className="text-center py-16 text-stone-500 text-sm border border-dashed border-stone-200 rounded-2xl space-y-2">
          <ImageIcon className="w-10 h-10 text-stone-300 mx-auto block" />
          <p>ยังไม่มีการอัปโหลดไฟล์รูปภาพความทรงจำ</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 gap-4">
          {mediaList.map((media) => {
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
