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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mediaList.map((media) => {
            const isYoutube = media.mimeType === 'video/youtube';
            return (
              <div 
                key={media.id} 
                className="relative group rounded-2xl overflow-hidden border border-stone-150 bg-stone-50 shadow-xs transition hover:shadow-md flex flex-col"
              >
                {isYoutube ? (
                  <div className="aspect-video relative bg-black">
                    <iframe
                      src={getYoutubeEmbedUrl(media.filePath)}
                      className="w-full h-full block border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="relative aspect-video bg-black flex items-center justify-center">
                    <video 
                      src={media.displayUrl} 
                      className="w-full h-full block animate-fade-in" 
                      controls 
                    />
                  </div>
                )}
                <div className="p-4 border-t border-stone-100 bg-white">
                  <h4 className="text-xs font-bold text-stone-850 truncate">{media.fileName}</h4>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
