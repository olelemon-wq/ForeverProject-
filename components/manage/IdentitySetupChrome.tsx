'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Camera, Check, ImageIcon, Move, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import MemorialHero from '@/components/public/MemorialHero';
import type { HeroBgMode, HeroLayoutId } from '@/lib/heroLayouts';
import { getSiteThemeStyle } from '@/lib/siteTheme';
import { cn } from '@/lib/utils';

export function IdentitySectionHeader({
  step,
  title,
  subtitle,
  showStep = true,
  className,
}: {
  step?: number;
  title: string;
  subtitle?: string;
  showStep?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1 border-t border-stone-100 pt-6 first:border-t-0 first:pt-0 md:pt-8', className)}>
      <div className="flex items-center gap-3">
        {showStep ? (
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-700">
            {step}
          </span>
        ) : null}
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-stone-900">{title}</h4>
          {subtitle ? (
            <p className="text-xs leading-relaxed text-stone-500">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type IdentityPreviewProps = {
  siteName: string;
  coverUrl: string;
  avatarUrl: string;
  coverTransform: { x: number; y: number; scale: number; rotate: number };
  avatarTransform: { x: number; y: number; scale: number; rotate: number };
  layout: HeroLayoutId;
  bgMode: HeroBgMode;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  dirty?: boolean;
  photoActions?: {
    avatarUploading: boolean;
    coverUploading: boolean;
    onPickAvatarTheme: () => void;
    onPickCoverTheme: () => void;
    onUploadAvatar: () => void;
    onUploadCover: () => void;
    onRepositionAvatar: () => void;
    onRepositionCover: () => void;
    onClearAvatar: () => void;
    onClearCover: () => void;
  };
};

export function MediaEditMenu({
  kind,
  hasImage,
  uploading,
  overlay = false,
  onPickTheme,
  onUpload,
  onReposition,
  onClear,
}: {
  kind: 'avatar' | 'cover';
  hasImage: boolean;
  uploading: boolean;
  overlay?: boolean;
  onPickTheme: () => void;
  onUpload: () => void;
  onReposition: () => void;
  onClear: () => void;
}) {
  const isCover = kind === 'cover';
  const triggerLabel = isCover ? 'แก้ไขรูปภาพหน้าปก' : 'แก้ไขรูปโปรไฟล์';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={overlay ? 'secondary' : 'outline'}
          size={overlay ? 'icon' : 'sm'}
          disabled={uploading}
          aria-label={triggerLabel}
          title={triggerLabel}
          className={
            overlay
              ? 'size-10 rounded-full bg-white/95 text-stone-800 shadow-sm hover:bg-white'
              : 'h-10 w-full rounded-xl text-xs font-semibold'
          }
        >
          <Camera className={overlay ? 'size-4' : 'size-3.5'} />
          {overlay ? (
            <span className="sr-only">{uploading ? 'กำลังอัปโหลด...' : triggerLabel}</span>
          ) : uploading ? (
            'กำลังอัปโหลด...'
          ) : (
            triggerLabel
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={overlay && isCover ? 'end' : 'start'}
        className="w-auto min-w-56"
      >
        <DropdownMenuItem onSelect={onPickTheme}>
          <ImageIcon />
          เลือกรูปจากชุดธีม
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onUpload}>
          <Upload />
          อัปโหลดรูปภาพ
        </DropdownMenuItem>
        {hasImage ? (
          <>
            <DropdownMenuItem onSelect={onReposition}>
              <Move />
              จัดตำแหน่งใหม่
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={onClear}>
              <Trash2 />
              ลบออก
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const DESKTOP_HERO_W = 1024;
const DESKTOP_HERO_H = 420;

function ScaledDesktopHero({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      setScale(w > 0 ? w / DESKTOP_HERO_W : 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={hostRef}
      className="relative w-full overflow-hidden"
      style={{ height: DESKTOP_HERO_H * scale }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: DESKTOP_HERO_W,
          height: DESKTOP_HERO_H,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function IdentityPreviewSticky({
  siteName,
  coverUrl,
  avatarUrl,
  coverTransform,
  avatarTransform,
  layout,
  bgMode,
  primaryColor,
  secondaryColor,
  fontFamily,
  dirty,
  photoActions,
}: IdentityPreviewProps) {
  return (
    <div className="shrink-0 border-b border-stone-100 bg-white pb-3 pt-1">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
          ตัวอย่างหน้าเว็บ
        </p>
        {dirty ? (
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 ring-1 ring-amber-200/80">
            ยังไม่บันทึก
          </span>
        ) : null}
      </div>

      {/* Mobile: no card wrapper, just hero + buttons */}
      <div className="md:hidden" style={getSiteThemeStyle({ primaryColor, secondaryColor, fontFamily })}>
        <div className="relative overflow-hidden rounded-2xl">
          <MemorialHero
            compact
            name={siteName || 'ชื่อหน้าเว็บ'}
            coverUrl={coverUrl || null}
            avatarUrl={avatarUrl || null}
            coverTransform={coverTransform}
            avatarTransform={avatarTransform}
            layout={layout}
            bgMode={bgMode}
            className="border-0"
          />
        </div>
        {photoActions ? (
          <div className="mt-2 flex gap-2 [&>*]:flex-1">
            <MediaEditMenu
              kind="avatar"
              hasImage={Boolean(avatarUrl)}
              uploading={photoActions.avatarUploading}
              onPickTheme={photoActions.onPickAvatarTheme}
              onUpload={photoActions.onUploadAvatar}
              onReposition={photoActions.onRepositionAvatar}
              onClear={photoActions.onClearAvatar}
            />
            <MediaEditMenu
              kind="cover"
              hasImage={Boolean(coverUrl)}
              uploading={photoActions.coverUploading}
              onPickTheme={photoActions.onPickCoverTheme}
              onUpload={photoActions.onUploadCover}
              onReposition={photoActions.onRepositionCover}
              onClear={photoActions.onClearCover}
            />
          </div>
        ) : null}
      </div>

      {/* Desktop: scaled preview in card */}
      <div
        className="hidden overflow-hidden rounded-2xl border border-stone-200/80 shadow-sm md:block"
        style={getSiteThemeStyle({ primaryColor, secondaryColor, fontFamily })}
      >
        <div className="relative">
          <ScaledDesktopHero>
            <MemorialHero
              preview
              name={siteName || 'ชื่อหน้าเว็บ'}
              coverUrl={coverUrl || null}
              avatarUrl={avatarUrl || null}
              coverTransform={coverTransform}
              avatarTransform={avatarTransform}
              layout={layout}
              bgMode={bgMode}
              className="h-full border-0"
            />
          </ScaledDesktopHero>
          {photoActions ? (
            <div className="pointer-events-none absolute inset-0 z-10">
              <div className="pointer-events-auto absolute left-2 top-2">
                <MediaEditMenu
                  kind="avatar"
                  overlay
                  hasImage={Boolean(avatarUrl)}
                  uploading={photoActions.avatarUploading}
                  onPickTheme={photoActions.onPickAvatarTheme}
                  onUpload={photoActions.onUploadAvatar}
                  onReposition={photoActions.onRepositionAvatar}
                  onClear={photoActions.onClearAvatar}
                />
              </div>
              <div className="pointer-events-auto absolute right-2 top-2">
                <MediaEditMenu
                  kind="cover"
                  overlay
                  hasImage={Boolean(coverUrl)}
                  uploading={photoActions.coverUploading}
                  onPickTheme={photoActions.onPickCoverTheme}
                  onUpload={photoActions.onUploadCover}
                  onReposition={photoActions.onRepositionCover}
                  onClear={photoActions.onClearCover}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function identityTileClass(selected: boolean) {
  return cn(
    'relative overflow-hidden rounded-xl border-2 bg-white text-left transition hover:shadow-sm',
    selected
      ? 'border-[#0071e3] ring-2 ring-[#0071e3]/15'
      : 'border-stone-200 hover:border-stone-300',
  );
}

export function IdentityTileCheck() {
  return (
    <span className="absolute right-1.5 top-1.5 z-10 flex size-5 items-center justify-center rounded-full bg-[#0071e3] text-white shadow-sm">
      <Check className="size-3 stroke-[3]" />
    </span>
  );
}

export function IdentityConfirmBar({
  dirty,
  saveLoading,
  onConfirm,
}: {
  dirty: boolean;
  saveLoading: boolean;
  onConfirm: () => void;
}) {
  if (!dirty && !saveLoading) return null;

  return (
    <div className="fixed bottom-4 right-4 z-30 flex max-w-sm flex-col items-end gap-2 md:bottom-6 md:right-6">
      <button
        type="button"
        disabled={saveLoading}
        onClick={onConfirm}
        className="h-auto rounded-xl bg-[#0071e3] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(0,113,227,0.35)] transition hover:bg-[#0071e3]/90 disabled:opacity-50"
      >
        {saveLoading ? 'กำลังบันทึก...' : 'ยืนยันการตั้งค่า'}
      </button>
      <p className="rounded-lg bg-white/95 px-3 py-1.5 text-xs text-amber-700 shadow-sm">
        มีการเปลี่ยนแปลงที่ยังไม่บันทึก กดยืนยันเมื่อพร้อมเผยแพร่
      </p>
    </div>
  );
}
