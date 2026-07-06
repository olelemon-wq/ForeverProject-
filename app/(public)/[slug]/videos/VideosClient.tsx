'use client';

import React from 'react';
import { Video } from 'lucide-react';

interface GalleryMedia {
  id: string;
  filePath: string;
  fileName: string;
  mimeType: string;
  displayUrl: string;
  createdAt: string;
}

interface VideosClientProps {
  mediaList: GalleryMedia[];
  slug: string;
}

function getYoutubeEmbedUrl(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
}

export default function VideosClient({ mediaList, slug }: VideosClientProps) {
  return (
    <div className="space-y-6">
      {/* Grid Display */}
      {mediaList.length === 0 ? (
        <div className="text-center py-16 text-stone-500 text-sm border border-dashed border-stone-200 rounded-2xl space-y-2">
          <Video className="w-10 h-10 text-stone-300 mx-auto block" />
          <p>ยังไม่มีการอัปโหลดไฟล์วิดีโอหรือแนบลิงก์ YouTube ความทรงจำ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaList.map((media) => {
            const isYoutube = media.mimeType === 'video/youtube';
            return (
              <div 
                key={media.id} 
                className="relative group rounded-3xl overflow-hidden border border-stone-200 bg-stone-50 shadow-sm transition hover:shadow-md hover:scale-[1.01] duration-300 flex flex-col"
              >
                {/* 16:9 Aspect Ratio Container via Padding Bottom */}
                <div className="relative w-full pb-[56.25%] bg-stone-950 overflow-hidden select-none">
                  {isYoutube ? (
                    <iframe
                      src={getYoutubeEmbedUrl(media.filePath)}
                      className="absolute inset-0 w-full h-full block border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video 
                      src={media.displayUrl} 
                      className="absolute inset-0 w-full h-full block object-contain bg-stone-950 animate-fade-in" 
                      controls 
                    />
                  )}
                </div>
                <div className="p-4 border-t border-stone-100 bg-white flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-stone-850 truncate" title={media.fileName}>
                      {media.fileName}
                    </h4>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      {isYoutube ? 'ลิงก์วิดีโอ YouTube' : 'ไฟล์วิดีโออัปโหลดโดยตรง'}
                    </p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Video className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
