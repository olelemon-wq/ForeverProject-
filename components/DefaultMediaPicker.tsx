'use client';

import React, { useState } from 'react';
import { Check, Images } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getDefaultMediaForCategory, type DefaultMediaKind } from '@/lib/defaultMedia';
import { cn } from '@/lib/utils';

interface DefaultMediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: DefaultMediaKind;
  category?: string | null;
  selectedSrc?: string;
  onSelect: (src: string) => void;
}

export default function DefaultMediaPicker({
  open,
  onOpenChange,
  kind,
  category,
  selectedSrc,
  onSelect,
}: DefaultMediaPickerProps) {
  const items = getDefaultMediaForCategory(category, kind);
  const title = kind === 'avatar' ? 'เลือกชุดรูปโปรไฟล์' : 'เลือกภาพพื้นหลัง';
  const desc =
    kind === 'avatar'
      ? 'กดเลือกเพื่อพรีวิว แล้วกดยืนยันเพื่อใช้งาน'
      : 'กดเลือกเพื่อพรีวิว แล้วกดยืนยันเพื่อใช้งาน';

  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const handleClose = (v: boolean) => {
    if (!v) setPreviewSrc(null);
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md gap-4 rounded-2xl border-stone-200 p-5 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base text-stone-900">
            <Images className="size-4 text-[#0071e3]" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs text-stone-500">{desc}</DialogDescription>
        </DialogHeader>

        {/* Large preview */}
        {previewSrc && (
          <div className="space-y-3">
            <div
              className={cn(
                'mx-auto overflow-hidden border-2 border-[#0071e3]/40 bg-stone-50',
                kind === 'avatar'
                  ? 'size-36 rounded-full'
                  : 'aspect-[16/9] w-full max-w-sm rounded-2xl'
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewSrc} alt="พรีวิว" className="h-full w-full object-cover" />
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPreviewSrc(null)}
                className="rounded-xl px-5 py-2 text-xs font-semibold text-stone-500 transition hover:bg-stone-100"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelect(previewSrc);
                  setPreviewSrc(null);
                  onOpenChange(false);
                }}
                className="rounded-full bg-[#0071e3] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#0071e3]/90 hover:text-white"
              >
                ยืนยันเปลี่ยน
              </button>
            </div>
          </div>
        )}

        {/* Grid of choices */}
        <div
          className={cn(
            'grid gap-2.5',
            kind === 'avatar' ? 'grid-cols-4' : 'grid-cols-2'
          )}
        >
          {items.map((item) => {
            const isCurrent = selectedSrc === item.src;
            const isPreviewing = previewSrc === item.src;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPreviewSrc(item.src)}
                className={cn(
                  'group relative overflow-hidden border text-left transition',
                  kind === 'avatar' ? 'aspect-square rounded-full' : 'aspect-[16/9] rounded-xl',
                  isPreviewing
                    ? 'border-[#0071e3] ring-2 ring-[#0071e3]/35'
                    : isCurrent
                      ? 'border-emerald-500 ring-2 ring-emerald-400/30'
                      : 'border-stone-200 hover:border-stone-300'
                )}
                title={item.label}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.label}
                  className="h-full w-full object-cover"
                />
                {isCurrent && !isPreviewing && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                      <Check className="size-3" strokeWidth={2.5} />
                    </span>
                  </span>
                )}
                {isPreviewing && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <span className="flex size-6 items-center justify-center rounded-full bg-[#0071e3] text-white shadow-sm">
                      <Check className="size-3" strokeWidth={2.5} />
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
