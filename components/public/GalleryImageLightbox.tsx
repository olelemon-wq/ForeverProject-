'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export type GalleryLightboxItem = {
  id: string;
  displayUrl: string;
  fileName: string;
};

type GalleryImageLightboxProps = {
  items: GalleryLightboxItem[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export default function GalleryImageLightbox({
  items,
  activeIndex,
  onClose,
  onNavigate,
}: GalleryImageLightboxProps) {
  const isOpen = activeIndex !== null;
  const item = activeIndex !== null ? items[activeIndex] : null;
  const hasPrev = activeIndex !== null && activeIndex > 0;
  const hasNext = activeIndex !== null && activeIndex < items.length - 1;
  const showNav = items.length > 1;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/88 supports-backdrop-filter:backdrop-blur-sm"
        className="max-w-[min(96vw,1100px)] border-none bg-transparent p-0 shadow-none ring-0 sm:max-w-[min(96vw,1100px)]"
      >
        {item && (
          <div className="relative flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="absolute -top-1 right-0 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-2 text-xs font-bold text-white backdrop-blur-md transition hover:bg-black/80 sm:-top-2 sm:right-0"
              aria-label="ปิด"
            >
              <X className="h-4 w-4" />
              ปิด
            </button>

            <div className="flex w-full items-center justify-center gap-2">
              {showNav && (
                <button
                  type="button"
                  disabled={!hasPrev}
                  onClick={() => hasPrev && activeIndex !== null && onNavigate(activeIndex - 1)}
                  className="hidden shrink-0 rounded-full border border-white/20 bg-black/50 p-2.5 text-white transition hover:bg-black/70 disabled:pointer-events-none disabled:opacity-30 sm:flex"
                  aria-label="รูปก่อนหน้า"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}

              <img
                src={item.displayUrl}
                alt={item.fileName}
                className="max-h-[78vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
              />

              {showNav && (
                <button
                  type="button"
                  disabled={!hasNext}
                  onClick={() => hasNext && activeIndex !== null && onNavigate(activeIndex + 1)}
                  className="hidden shrink-0 rounded-full border border-white/20 bg-black/50 p-2.5 text-white transition hover:bg-black/70 disabled:pointer-events-none disabled:opacity-30 sm:flex"
                  aria-label="รูปถัดไป"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>

            {showNav && (
              <div className="flex w-full items-center justify-between gap-3 sm:hidden">
                <button
                  type="button"
                  disabled={!hasPrev}
                  onClick={() => hasPrev && activeIndex !== null && onNavigate(activeIndex - 1)}
                  className="rounded-full border border-white/20 bg-black/50 px-3 py-2 text-xs font-bold text-white disabled:opacity-30"
                >
                  ก่อนหน้า
                </button>
                <span className="text-[10px] text-white/60 tabular-nums">
                  {(activeIndex ?? 0) + 1} / {items.length}
                </span>
                <button
                  type="button"
                  disabled={!hasNext}
                  onClick={() => hasNext && activeIndex !== null && onNavigate(activeIndex + 1)}
                  className="rounded-full border border-white/20 bg-black/50 px-3 py-2 text-xs font-bold text-white disabled:opacity-30"
                >
                  ถัดไป
                </button>
              </div>
            )}

            <p className="max-w-full truncate px-2 text-center text-xs text-white/75">
              {item.fileName}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
