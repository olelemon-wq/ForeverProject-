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

  const goPrev = () => {
    if (hasPrev && activeIndex !== null) onNavigate(activeIndex - 1);
  };

  const goNext = () => {
    if (hasNext && activeIndex !== null) onNavigate(activeIndex + 1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/88 supports-backdrop-filter:backdrop-blur-sm"
        className="fixed left-1/2 z-50 flex w-[min(calc(100vw-1rem),1100px)] max-w-[min(calc(100vw-1rem),1100px)] -translate-x-1/2 flex-col overflow-hidden border-none bg-transparent p-2 shadow-none ring-0 top-[max(0.5rem,env(safe-area-inset-top,0px))] bottom-[max(0.5rem,env(safe-area-inset-bottom,0px))] h-auto max-h-[calc(100dvh-1rem)] translate-y-0 sm:top-1/2 sm:bottom-auto sm:h-[min(92dvh,860px)] sm:max-h-[92dvh] sm:w-[min(96vw,1100px)] sm:max-w-[min(96vw,1100px)] sm:-translate-y-1/2 sm:p-3"
      >
        {item && (
          <div className="flex h-full min-h-0 flex-1 flex-col gap-2 sm:gap-3">
            <div className="flex shrink-0 items-center justify-between gap-3">
              {showNav ? (
                <span className="text-[10px] font-medium text-white/60 tabular-nums sm:text-xs">
                  {(activeIndex ?? 0) + 1} / {items.length}
                </span>
              ) : (
                <span aria-hidden className="w-8" />
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-2 text-xs font-bold text-white backdrop-blur-md transition hover:bg-black/80"
                aria-label="ปิด"
              >
                <X className="h-4 w-4" />
                ปิด
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center gap-2 sm:min-h-[min(62dvh,680px)]">
              {showNav && (
                <button
                  type="button"
                  disabled={!hasPrev}
                  onClick={goPrev}
                  className="hidden shrink-0 rounded-full border border-white/20 bg-black/50 p-2.5 text-white transition hover:bg-black/70 disabled:pointer-events-none disabled:opacity-30 sm:flex"
                  aria-label="รูปก่อนหน้า"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}

              <div className="relative flex h-full min-h-0 w-full max-w-full items-center justify-center">
                <img
                  src={item.displayUrl}
                  alt={item.fileName}
                  className="max-h-[min(62dvh,680px)] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                />

                {showNav && (
                  <>
                    <button
                      type="button"
                      disabled={!hasPrev}
                      onClick={goPrev}
                      className="absolute left-1 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 p-2 text-white backdrop-blur-sm transition hover:bg-black/75 disabled:pointer-events-none disabled:opacity-30 sm:hidden"
                      aria-label="รูปก่อนหน้า"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      disabled={!hasNext}
                      onClick={goNext}
                      className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 p-2 text-white backdrop-blur-sm transition hover:bg-black/75 disabled:pointer-events-none disabled:opacity-30 sm:hidden"
                      aria-label="รูปถัดไป"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {showNav && (
                <button
                  type="button"
                  disabled={!hasNext}
                  onClick={goNext}
                  className="hidden shrink-0 rounded-full border border-white/20 bg-black/50 p-2.5 text-white transition hover:bg-black/70 disabled:pointer-events-none disabled:opacity-30 sm:flex"
                  aria-label="รูปถัดไป"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>

            <p className="shrink-0 truncate px-1 text-center text-[10px] text-white/70 sm:text-xs">
              {item.fileName}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
