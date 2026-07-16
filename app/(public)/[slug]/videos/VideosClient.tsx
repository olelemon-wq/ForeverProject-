'use client';

import React, { useState } from 'react';
import { Video, Play, ExternalLink, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { InstagramEmbed, TikTokEmbed } from 'react-social-media-embed';

/* ─── Types ─── */

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

type Platform = 'youtube' | 'facebook' | 'tiktok' | 'instagram' | 'vimeo' | 'file';

/* ─── Existing detectPlatform ─── */

function detectPlatform(mimeType: string, filePath: string): Platform {
  if (mimeType === 'video/youtube') return 'youtube';
  if (mimeType === 'video/facebook') return 'facebook';
  if (mimeType === 'video/tiktok') return 'tiktok';
  if (mimeType === 'video/instagram') return 'instagram';
  if (mimeType === 'video/vimeo') return 'vimeo';
  if (/youtu\.?be/.test(filePath)) return 'youtube';
  if (/facebook\.com|fb\.watch/.test(filePath)) return 'facebook';
  if (/tiktok\.com/.test(filePath)) return 'tiktok';
  if (/instagram\.com/.test(filePath)) return 'instagram';
  if (/vimeo\.com/.test(filePath)) return 'vimeo';
  return 'file';
}

function getYoutubeId(url: string) {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|&v=))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

/* ─── Constants ─── */

const PLATFORM_LABELS: Record<Platform, string> = {
  youtube: 'YouTube',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  instagram: 'Instagram',
  vimeo: 'Vimeo',
  file: 'ไฟล์วิดีโอ',
};

const PLATFORM_COLORS: Record<Platform, { bg: string; text: string; ring: string }> = {
  youtube:   { bg: 'bg-red-500',    text: 'text-white', ring: 'ring-red-500/20' },
  facebook:  { bg: 'bg-blue-600',   text: 'text-white', ring: 'ring-blue-600/20' },
  tiktok:    { bg: 'bg-stone-900',  text: 'text-white', ring: 'ring-stone-900/20' },
  instagram: { bg: 'bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600', text: 'text-white', ring: 'ring-pink-500/20' },
  vimeo:     { bg: 'bg-sky-500',    text: 'text-white', ring: 'ring-sky-500/20' },
  file:      { bg: 'bg-emerald-600', text: 'text-white', ring: 'ring-emerald-600/20' },
};

function isVertical(platform: Platform) {
  return platform === 'tiktok' || platform === 'instagram';
}

/* ─── Platform SVG Icons ─── */

function PlatformIcon({ platform, className }: { platform: Platform; className?: string }) {
  const base = className || 'w-5 h-5';
  switch (platform) {
    case 'youtube':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z"/>
        </svg>
      );
    case 'tiktok':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.3 0 .59.04.86.12V9.01a6.32 6.32 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.4a8.16 8.16 0 0 0 4.77 1.53V7.48a4.85 4.85 0 0 1-1.01-.79Z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.97.25 2.43.41.61.24 1.05.52 1.51.98.46.46.74.9.98 1.51.17.46.36 1.26.41 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.97-.41 2.43a4.07 4.07 0 0 1-.98 1.51 4.07 4.07 0 0 1-1.51.98c-.46.17-1.26.36-2.43.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.25-2.43-.41a4.07 4.07 0 0 1-1.51-.98 4.07 4.07 0 0 1-.98-1.51c-.17-.46-.36-1.26-.41-2.43C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.97.41-2.43.24-.61.52-1.05.98-1.51a4.07 4.07 0 0 1 1.51-.98c.46-.17 1.26-.36 2.43-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.77 5.77 0 0 0-2.09 1.36A5.77 5.77 0 0 0 .69 4.08C.39 4.84.19 5.72.13 6.99.07 8.27.06 8.68.06 11.94v.12c0 3.26.01 3.67.07 4.95.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.36 2.09a5.77 5.77 0 0 0 2.09 1.36c.76.3 1.64.5 2.91.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.77 5.77 0 0 0 2.09-1.36 5.77 5.77 0 0 0 1.36-2.09c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.77 5.77 0 0 0-1.36-2.09A5.77 5.77 0 0 0 19.91.63C19.15.33 18.27.13 17 .07 15.72.01 15.31 0 12.05 0H12Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z"/>
        </svg>
      );
    case 'facebook':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.33l-.53 3.49h-2.8v8.44C19.61 23.08 24 18.09 24 12.07Z"/>
        </svg>
      );
    case 'vimeo':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.98 6.52c-.1 2.27-1.68 5.38-4.74 9.33C16.07 19.95 13.27 22 10.94 22c-1.44 0-2.66-1.34-3.66-4.01L5.65 11.8c-.55-2.67-1.14-4.01-1.78-4.01-.14 0-.62.29-1.44.87L1.34 7.3a98.3 98.3 0 0 0 2.76-2.47C5.44 3.65 6.47 3 7.2 2.94c1.52-.15 2.46.9 2.82 3.14.39 2.42.66 3.93.82 4.52.45 2.07.95 3.1 1.5 3.1.42 0 1.06-.67 1.92-2.02.85-1.35 1.31-2.38 1.37-3.08.12-1.16-.34-1.74-1.37-1.74-.49 0-.99.11-1.5.34 1-3.28 2.9-4.87 5.72-4.78 2.09.06 3.07 1.42 2.96 4.1Z"/>
        </svg>
      );
    default:
      return <Video className={base} />;
  }
}

function getVimeoId(url: string) {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

/* ─── Lightbox Player ─── */

function LightboxPlayer({ media, platform }: { media: GalleryMedia; platform: Platform }) {
  if (platform === 'youtube') {
    const ytId = getYoutubeId(media.filePath);
    if (!ytId) return null;
    return (
      <div className="w-full max-w-4xl mx-auto" style={{ aspectRatio: '16 / 9', maxHeight: '80vh' }}>
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
          className="w-full h-full border-none rounded-2xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (platform === 'vimeo') {
    const vimeoId = getVimeoId(media.filePath);
    if (!vimeoId) return null;
    return (
      <div className="w-full max-w-4xl mx-auto" style={{ aspectRatio: '16 / 9', maxHeight: '80vh' }}>
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
          className="w-full h-full border-none rounded-2xl"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (platform === 'facebook') {
    return (
      <div className="w-full max-w-4xl mx-auto" style={{ aspectRatio: '16 / 9', maxHeight: '80vh' }}>
        <iframe
          src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(media.filePath)}&show_text=false&autoplay=true`}
          className="w-full h-full border-none rounded-2xl"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  if (platform === 'tiktok') {
    return (
      <div className="w-full max-w-sm mx-auto overflow-auto" style={{ maxHeight: '80vh' }}>
        <TikTokEmbed url={media.filePath} width="100%" />
      </div>
    );
  }

  if (platform === 'instagram') {
    return (
      <div className="w-full max-w-sm mx-auto overflow-auto" style={{ maxHeight: '80vh' }}>
        <InstagramEmbed url={media.filePath} width="100%" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto" style={{ maxHeight: '80vh' }}>
      <video
        src={media.displayUrl}
        className="w-full rounded-2xl"
        style={{ aspectRatio: '16 / 9', maxHeight: '80vh' }}
        controls
        autoPlay
      />
    </div>
  );
}

/* ─── Grid Card ─── */

function VideoCard({ media, onClick }: { media: GalleryMedia; onClick: () => void }) {
  const platform = detectPlatform(media.mimeType, media.filePath);
  const colors = PLATFORM_COLORS[platform];
  const ytId = platform === 'youtube' ? getYoutubeId(media.filePath) : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full rounded-3xl overflow-hidden border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 ${colors.ring} text-left cursor-pointer`}
    >
      {/* 16:9 thumbnail area — all cards identical height */}
      <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
        {/* Background */}
        {ytId ? (
          <img
            src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
            alt={media.fileName}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-stone-100">
            <div className={`absolute inset-0 ${colors.bg} opacity-[0.07]`} />
          </div>
        )}

        {/* Scrim */}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110 ${
              ytId ? 'bg-black/50 backdrop-blur-sm' : `${colors.bg}`
            }`}
          >
            <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
          </div>
        </div>

        {/* Platform badge */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg ${colors.bg} ${colors.text}`}
          >
            <PlatformIcon platform={platform} className="w-3 h-3" />
            {PLATFORM_LABELS[platform]}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-stone-100">
        <h4 className="text-[11px] font-bold text-stone-800 truncate" title={media.fileName}>
          {media.fileName}
        </h4>
      </div>
    </button>
  );
}

/* ─── Main Component ─── */

export default function VideosClient({ mediaList, slug }: VideosClientProps) {
  const [activeMedia, setActiveMedia] = useState<GalleryMedia | null>(null);
  const activePlatform = activeMedia
    ? detectPlatform(activeMedia.mimeType, activeMedia.filePath)
    : null;

  if (mediaList.length === 0) {
    return (
      <div className="text-center py-16 text-stone-500 text-sm border border-dashed border-stone-200 rounded-2xl space-y-2">
        <Video className="w-10 h-10 text-stone-300 mx-auto block" />
        <p>ยังไม่มีการเพิ่มลิงก์วิดีโอความทรงจำ</p>
      </div>
    );
  }

  return (
    <>
      {/* Uniform 16:9 grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {mediaList.map((media) => (
          <VideoCard
            key={media.id}
            media={media}
            onClick={() => setActiveMedia(media)}
          />
        ))}
      </div>

      {/* Lightbox dialog — unmounts player on close so audio stops */}
      <Dialog
        open={!!activeMedia}
        onOpenChange={(open) => { if (!open) setActiveMedia(null); }}
      >
        <DialogContent
          className={`p-0 border-none bg-transparent shadow-none gap-0 [&>button]:hidden ${
            activePlatform && isVertical(activePlatform)
              ? 'max-w-sm'
              : 'max-w-4xl'
          }`}
        >
          {/* Player + close button overlaid */}
          {activeMedia && activePlatform && (
            <div className="relative rounded-2xl overflow-hidden bg-black">
              <button
                type="button"
                onClick={() => setActiveMedia(null)}
                className="absolute top-3 right-3 z-50 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/70 backdrop-blur-md text-white hover:bg-black/90 shadow-xl transition text-xs font-bold"
                aria-label="ปิด"
              >
                <X className="w-4 h-4" />
                ปิด
              </button>
              <LightboxPlayer media={activeMedia} platform={activePlatform} />
            </div>
          )}

          {/* Footer bar */}
          {activeMedia && activePlatform && (
            <div className="mt-3 flex items-center justify-between gap-3 px-1">
              <p className="text-xs text-white/70 truncate flex-1">
                {activeMedia.fileName}
              </p>
              {activePlatform !== 'file' && (
                <a
                  href={activeMedia.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-[11px] font-semibold hover:bg-white/25 transition shrink-0"
                >
                  <ExternalLink className="w-3 h-3" />
                  เปิดบน {PLATFORM_LABELS[activePlatform]}
                </a>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
