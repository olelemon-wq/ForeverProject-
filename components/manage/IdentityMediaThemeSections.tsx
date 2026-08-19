'use client';

import {
  IdentitySectionHeader,
  IdentityTileCheck,
  identityTileClass,
} from '@/components/manage/IdentitySetupChrome';
import DefaultMediaPicker from '@/components/DefaultMediaPicker';
import type { DefaultMediaKind } from '@/lib/defaultMedia';
import { getSiteThemeStyle } from '@/lib/siteTheme';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HERO_LAYOUTS, type HeroBgMode, type HeroLayoutId } from '@/lib/heroLayouts';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const THEME_PRESETS = [
  { name: 'Peaceful Mint', desc: 'สงบ รำลึก', primary: '#7ea18b', secondary: '#d4be95' },
  { name: 'Sweet Peach', desc: 'อบอุ่น โรแมนติก', primary: '#e09f9f', secondary: '#e6c1a8' },
  { name: 'Warm Caramel', desc: 'อ่อนโยน เป็นธรรมชาติ', primary: '#c29a7c', secondary: '#dcc6a8' },
  { name: 'Classic Olive', desc: 'คลาสสิก ครอบครัว', primary: '#96a288', secondary: '#cfc5b0' },
  { name: 'Ocean Breeze', desc: 'สดใส มิตรภาพ', primary: '#8ba8bd', secondary: '#ded2af' },
  { name: 'Lilac Dream', desc: 'หรูหรา ทางการ', primary: '#a49cb5', secondary: '#c8bfcb' },
] as const;

function mixHex(a: string, b: string, amount: number) {
  const parse = (hex: string) => {
    const n = parseInt(hex.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
  };
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const ch = (x: number, y: number) => Math.round(x + (y - x) * amount);
  return `#${[ch(ar, br), ch(ag, bg), ch(ab, bb)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function themeSwatches(primary: string, secondary: string) {
  return [primary, mixHex(primary, secondary, 0.35), mixHex(primary, secondary, 0.7), secondary];
}

function MiniName({ align = 'center', onDark = false }: { align?: 'center' | 'left' | 'right'; onDark?: boolean }) {
  const bar = onDark ? 'bg-white/80' : 'bg-stone-400/80';
  const sub = onDark ? 'bg-white/45' : 'bg-stone-300';
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-0.5',
        align === 'center' && 'items-center',
        align === 'left' && 'items-start',
        align === 'right' && 'items-end',
      )}
    >
      <span className={cn('h-1 w-8 rounded-full', bar)} />
      <span className={cn('h-0.5 w-5 rounded-full', sub)} />
    </div>
  );
}

function MiniCircle({ className }: { className?: string }) {
  return <span className={cn('shrink-0 rounded-full border-2 border-white bg-stone-300 shadow-sm', className)} />;
}

function MiniFrame({ className }: { className?: string }) {
  return <span className={cn('shrink-0 rounded-md border-2 border-white bg-stone-300 shadow-sm', className)} />;
}

function ThemeCover() {
  return <div className="absolute inset-0 bg-[#E6EFF9]" />;
}

function HeroLayoutThumbnail({ layout }: { layout: HeroLayoutId }) {
  const shell = (children: ReactNode) => (
    <div className="relative aspect-[1024/420] w-full overflow-hidden">
      {children}
    </div>
  );

  if (layout === 'center-classic') {
    return shell(
      <>
        <ThemeCover />
        <div className="relative flex h-full flex-col items-center justify-center gap-1.5 px-2">
          <MiniCircle className="size-6" />
          <MiniName />
        </div>
      </>,
    );
  }

  if (layout === 'avatar-left' || layout === 'avatar-right') {
    const right = layout === 'avatar-right';
    return shell(
      <>
        <ThemeCover />
        <div className={cn('relative flex h-full items-center gap-2 px-2.5', right && 'flex-row-reverse')}>
          <MiniCircle className="size-7" />
          <MiniName align={right ? 'right' : 'left'} />
        </div>
      </>,
    );
  }

  if (layout === 'text-top') {
    return shell(
      <>
        <ThemeCover />
        <div className="relative flex h-full flex-col items-center justify-center gap-1.5 px-2">
          <MiniName />
          <MiniCircle className="size-6" />
        </div>
      </>,
    );
  }

  if (layout === 'bottom-band' || layout === 'bottom-band-right') {
    const right = layout === 'bottom-band-right';
    return shell(
      <>
        <ThemeCover />
        <div className={cn('absolute inset-x-0 bottom-0 flex h-[38%] items-center gap-1 bg-[#F5F5F7] px-1.5', right && 'flex-row-reverse')}>
          <MiniCircle className="size-4" />
          <MiniName align={right ? 'right' : 'left'} />
        </div>
      </>,
    );
  }

  if (layout === 'framed-portrait') {
    return shell(
      <>
        <ThemeCover />
        <div className="relative flex h-full flex-col items-center justify-center gap-1 px-2">
          <MiniFrame className="h-7 w-5" />
          <span className="h-px w-4 bg-stone-400" />
          <MiniName />
        </div>
      </>,
    );
  }

  return shell(
    <>
      <ThemeCover />
      <div className="relative flex h-full flex-col items-center justify-center gap-0.5 px-2">
        <MiniFrame className="h-6 w-[18px]" />
        <span className="h-px w-4 bg-stone-400" />
        <MiniName />
      </div>
    </>,
  );
}

function ThemeHomepagePreview({
  siteName,
  primaryColor,
  secondaryColor,
  fontFamily,
}: {
  siteName: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}) {
  const heroTint = mixHex(primaryColor, '#ffffff', 0.88);
  const surfaceTint = mixHex(secondaryColor, '#ffffff', 0.93);
  const buttonTint = mixHex(primaryColor, secondaryColor, 0.18);

  return (
    <div className="w-full md:max-w-2xl">
      <div
        className="bg-white"
        style={getSiteThemeStyle({ primaryColor, secondaryColor, fontFamily })}
      >
        <div className="space-y-4 bg-white py-3 sm:py-4">
          <div
            className="overflow-hidden rounded-2xl border border-black/5"
            style={{
              background: `linear-gradient(180deg, ${heroTint} 0%, #ffffff 100%)`,
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="text-sm font-black tracking-tight">FOREVER</span>
                <span className="hidden h-4 w-px bg-white/30 sm:block" />
                <span className="hidden text-xs font-medium text-white/80 sm:block">
                  หน้าแรก
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold text-white/80">
                <span>เรื่องราว</span>
                <span>แกลเลอรี</span>
                <span>ติดต่อ</span>
              </div>
            </div>

            <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
              <div className="space-y-1.5">
                <h5 className="text-base font-bold text-stone-900 sm:text-lg">
                  {siteName || 'ชื่อหน้าเว็บ'}
                </h5>
                <div className="h-1.5 w-48 rounded-full bg-stone-200" />
                <div className="h-1.5 w-36 rounded-full bg-stone-200" />
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <div className="p-0 sm:rounded-2xl sm:border sm:border-stone-200 sm:bg-white sm:p-3 sm:shadow-[0_8px_24px_rgba(29,29,31,0.05)]">
                  <span
                    className="inline-flex rounded-full px-2 py-1 text-[10px] font-bold"
                    style={{ backgroundColor: surfaceTint, color: primaryColor }}
                  >
                    หัวข้อ section
                  </span>
                  <div
                    className="mt-3 h-2 w-32 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <div className="mt-3 h-1.5 w-full rounded-full bg-stone-200" />
                  <div className="mt-2 h-1.5 w-4/5 rounded-full bg-stone-200" />
                </div>

                <div className="border-t border-stone-200/80 pt-3 sm:rounded-2xl sm:border sm:border-stone-200 sm:bg-white sm:p-3 sm:pt-3 sm:shadow-[0_8px_24px_rgba(29,29,31,0.05)]">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: secondaryColor }}
                      />
                      <div className="h-2 w-24 rounded-full bg-stone-300" />
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-stone-200" />
                    <div className="h-1.5 w-5/6 rounded-full bg-stone-200" />
                  </div>
                  <button
                    type="button"
                    className="mt-4 h-10 w-full rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: buttonTint }}
                  >
                    ปุ่มหลักของหน้า
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const FONT_OPTIONS = [
  { value: 'LINE Seed Sans TH', label: 'LINE Seed Sans TH (แนะนำ)' },
  { value: 'Inter', label: 'Inter (เรียบหรูสากล)' },
  { value: 'Sarabun', label: 'Sarabun (ไทยทางการ)' },
  { value: 'Niramit', label: 'Niramit (ไทยร่วมสมัย)' },
] as const;

const FONT_SIZE_OPTIONS = [
  { value: 'NORMAL' as const, label: 'ขนาดปกติ', sizeClass: 'text-sm' },
  { value: 'MEDIUM' as const, label: 'ขนาดกลาง', sizeClass: 'text-base' },
  { value: 'LARGE' as const, label: 'ขนาดใหญ่', sizeClass: 'text-lg' },
] as const;

type Props = {
  category: string | undefined;
  siteName: string;
  siteNameLabel: string;
  onSiteNameChange: (value: string) => void;
  avatarUrl: string;
  coverUrl: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  defaultFontSize: 'NORMAL' | 'MEDIUM' | 'LARGE';
  heroLayout: HeroLayoutId;
  heroBgMode: HeroBgMode;
  defaultMediaPicker: DefaultMediaKind | null;
  onDefaultMediaPickerChange: (kind: DefaultMediaKind | null) => void;
  onPickDefaultMedia: (kind: DefaultMediaKind, src: string) => void;
  onThemePreset: (primary: string, secondary: string) => void;
  onPrimaryColor: (value: string) => void;
  onSecondaryColor: (value: string) => void;
  onFontFamily: (value: string) => void;
  onFontSize: (value: 'NORMAL' | 'MEDIUM' | 'LARGE') => void;
  onHeroLayout: (layout: HeroLayoutId, bgMode: HeroBgMode) => void;
  showAdvancedColors?: boolean;
};

export default function IdentityMediaThemeSections({
  category,
  siteName,
  siteNameLabel,
  onSiteNameChange,
  avatarUrl,
  coverUrl,
  primaryColor,
  secondaryColor,
  fontFamily,
  defaultFontSize,
  heroLayout,
  heroBgMode,
  defaultMediaPicker,
  onDefaultMediaPickerChange,
  onPickDefaultMedia,
  onThemePreset,
  onPrimaryColor,
  onSecondaryColor,
  onFontFamily,
  onFontSize,
  onHeroLayout,
  showAdvancedColors = false,
}: Props) {
  return (
    <div className="space-y-2 pt-4 md:pt-6">
      <DefaultMediaPicker
        open={defaultMediaPicker === 'avatar'}
        onOpenChange={(open) => onDefaultMediaPickerChange(open ? 'avatar' : null)}
        kind="avatar"
        category={category}
        selectedSrc={avatarUrl}
        onSelect={(src) => onPickDefaultMedia('avatar', src)}
      />
      <DefaultMediaPicker
        open={defaultMediaPicker === 'cover'}
        onOpenChange={(open) => onDefaultMediaPickerChange(open ? 'cover' : null)}
        kind="cover"
        category={category}
        selectedSrc={coverUrl}
        onSelect={(src) => onPickDefaultMedia('cover', src)}
      />

      <IdentitySectionHeader step={1} title="รูปแบบหน้าแรก" className="pt-3 md:pt-4" />
      <div className="grid max-w-2xl grid-cols-4 gap-2">
        {HERO_LAYOUTS.map((opt) => {
          const selected = heroLayout === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              title={opt.label}
              aria-label={opt.label}
              aria-pressed={selected}
              onClick={() => {
                const nextBg = opt.id === 'bottom-band' || opt.id === 'bottom-band-right' || opt.id === 'framed-on-cover' ? ('image' as const) : heroBgMode;
                onHeroLayout(opt.id, nextBg);
              }}
              className={cn(
                'relative min-w-0 overflow-hidden rounded-lg bg-white text-left transition hover:shadow-sm',
                selected
                  ? 'border border-[#0071e3] ring-1 ring-[#0071e3]/15'
                  : 'border border-[#CADCF1] hover:border-[#9BB8DC]',
              )}
            >
              {selected ? <IdentityTileCheck /> : null}
              <HeroLayoutThumbnail layout={opt.id} />
            </button>
          );
        })}
      </div>

      {showAdvancedColors ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50/50 p-3">
            <input type="color" value={primaryColor} onChange={(e) => onPrimaryColor(e.target.value)} className="size-9 shrink-0 cursor-pointer rounded-lg border border-stone-200 bg-white" />
            <Input value={primaryColor} onChange={(e) => onPrimaryColor(e.target.value)} className="h-8 font-mono text-xs" />
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50/50 p-3">
            <input type="color" value={secondaryColor} onChange={(e) => onSecondaryColor(e.target.value)} className="size-9 shrink-0 cursor-pointer rounded-lg border border-stone-200 bg-white" />
            <Input value={secondaryColor} onChange={(e) => onSecondaryColor(e.target.value)} className="h-8 font-mono text-xs" />
          </div>
        </div>
      ) : null}

      <IdentitySectionHeader step={2} title="ชื่อหน้าเว็บ" />
      <div className="max-w-lg space-y-1">
        <label className="text-sm font-bold tracking-wide text-stone-600">{siteNameLabel}</label>
        <Input
          type="text"
          value={siteName}
          maxLength={100}
          onChange={(e) => onSiteNameChange(e.target.value)}
          className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 text-sm text-stone-900 sm:text-base focus:border-emerald-500/80 focus:bg-white focus:outline-none"
        />
        <p className="text-xs text-stone-400">
          แนะนำไม่เกิน 2 บรรทัดบนหน้าแรก ({siteName.length}/100)
        </p>
      </div>

      <IdentitySectionHeader step={3} title="ฟอนต์ & ขนาดตัวอักษร" />
      <div className="max-w-lg space-y-2">
      <Select value={fontFamily} onValueChange={onFontFamily}>
        <SelectTrigger className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50/50 text-sm font-bold" style={{ fontFamily }}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          {FONT_OPTIONS.map((f) => (
            <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>
              {f.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-wrap gap-2">
        {FONT_SIZE_OPTIONS.map((opt) => {
          const selected = defaultFontSize === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onFontSize(opt.value)}
              aria-label={opt.label}
              title={opt.label}
              className={cn(
                'flex size-9 items-center justify-center rounded-full border transition',
                selected
                  ? 'border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3]'
                  : 'border-stone-200 text-stone-600 hover:border-stone-300'
              )}
            >
              <span className={cn('font-semibold leading-none', opt.sizeClass)}>A</span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-stone-400">ขนาดมีผลกับเมนูและเนื้อหาทั้งหน้าเว็บ</p>
      </div>

      <IdentitySectionHeader step={4} title="ธีมสี" subtitle="เลือกโทนสีของเว็บไซต์" />
      <ThemeHomepagePreview
        siteName={siteName}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        fontFamily={fontFamily}
      />
      <div className="flex flex-wrap gap-2">
        {THEME_PRESETS.map((t) => {
          const selected = primaryColor.toLowerCase() === t.primary.toLowerCase() && secondaryColor.toLowerCase() === t.secondary.toLowerCase();
          return (
            <button
              key={t.name}
              type="button"
              onClick={() => onThemePreset(t.primary, t.secondary)}
              aria-pressed={selected}
              className={cn(
                identityTileClass(selected),
                'w-[108px] shrink-0 overflow-hidden p-2.5',
              )}
            >
              {selected ? <IdentityTileCheck /> : null}
              <div className="flex flex-col items-start pr-4 text-left">
                <p className="min-h-[2rem] text-[11px] font-bold leading-snug text-stone-900">
                  {t.name}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  {themeSwatches(t.primary, t.secondary).map((color, i) => (
                    <span
                      key={`${t.name}-${i}`}
                      className="size-4 shrink-0 rounded-full ring-1 ring-black/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="mt-2 min-h-[2rem] text-[11px] leading-snug text-stone-500">
                  {t.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
