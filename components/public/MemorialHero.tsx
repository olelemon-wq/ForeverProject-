'use client';

import React from 'react';
import { Flame } from 'lucide-react';
import { imageTransformStyle } from '@/lib/imagePosition';
import { resolveMediaSrc } from '@/lib/mediaUrl';
import {
  normalizeHeroBgMode,
  normalizeHeroLayout,
  type HeroBgMode,
  type HeroLayoutId,
} from '@/lib/heroLayouts';
import { cn } from '@/lib/utils';

export interface MemorialHeroProps {
  name: string;
  tagline?: string;
  coverUrl?: string | null;
  avatarUrl?: string | null;
  coverTransform?: { x?: number; y?: number; scale?: number; rotate?: number };
  avatarTransform?: { x?: number; y?: number; scale?: number; rotate?: number };
  layout?: HeroLayoutId | string;
  bgMode?: HeroBgMode | string;
  /** Compact preview for manage dashboard */
  compact?: boolean;
  className?: string;
}

function SoftWashBackground({ onDark }: { onDark?: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
      style={
        onDark
          ? {
              background: `
                radial-gradient(ellipse 90% 70% at 50% 30%, color-mix(in srgb, var(--theme-primary) 35%, transparent), transparent 72%),
                linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.45))
              `,
            }
          : {
              background: `
                radial-gradient(ellipse 85% 65% at 50% 28%, color-mix(in srgb, var(--theme-primary) 26%, transparent), transparent 70%),
                linear-gradient(165deg, color-mix(in srgb, var(--theme-primary) 10%, #F5F5F7), #FAF8F5 55%, #F5F5F7 100%)
              `,
            }
      }
    />
  );
}

function AvatarCircle({
  avatarUrl,
  avatarTransform,
  sizeClass,
}: {
  avatarUrl?: string | null;
  avatarTransform?: MemorialHeroProps['avatarTransform'];
  sizeClass: string;
}) {
  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-stone-50 shadow-[0_8px_24px_rgba(29,29,31,0.18)] ring-1 ring-black/5',
        sizeClass
      )}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolveMediaSrc(avatarUrl)}
          alt=""
          className="h-full w-full object-cover"
          style={imageTransformStyle({
            x: avatarTransform?.x || 0,
            y: avatarTransform?.y || 0,
            scale: avatarTransform?.scale || 1,
            rotate: avatarTransform?.rotate || 0,
          })}
        />
      ) : (
        <Flame
          className="h-2/5 w-2/5 animate-pulse text-stone-400"
        />
      )}
    </div>
  );
}

function AvatarFrame({
  avatarUrl,
  avatarTransform,
  compact,
}: {
  avatarUrl?: string | null;
  avatarTransform?: MemorialHeroProps['avatarTransform'];
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border-2 border-white bg-stone-50 shadow-[0_8px_28px_rgba(29,29,31,0.14)] ring-1 ring-black/5',
        compact ? 'h-36 w-28 sm:h-40 sm:w-32' : 'h-52 w-40 sm:h-64 sm:w-48'
      )}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolveMediaSrc(avatarUrl)}
          alt=""
          className="h-full w-full object-cover"
          style={imageTransformStyle({
            x: avatarTransform?.x || 0,
            y: avatarTransform?.y || 0,
            scale: avatarTransform?.scale || 1,
            rotate: avatarTransform?.rotate || 0,
          })}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Flame
            className={cn(compact ? 'h-10 w-10' : 'h-14 w-14', 'animate-pulse text-stone-400')}
          />
        </div>
      )}
    </div>
  );
}

function TitleBlock({
  name,
  tagline,
  onDark,
  align = 'center',
  compact,
}: {
  name: string;
  tagline?: string;
  onDark?: boolean;
  align?: 'center' | 'left' | 'right';
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        align === 'left' && 'text-left',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center'
      )}
    >
      <h1
        className={cn(
          'font-bold tracking-tight',
          compact ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl',
          onDark ? 'text-white drop-shadow-md' : 'text-stone-900'
        )}
      >
        {name}
      </h1>
      {tagline ? (
        <p
          className={cn(
            'mt-1.5 font-medium leading-relaxed',
            compact ? 'text-xs' : 'text-sm sm:text-base',
            onDark ? 'text-white/85' : 'text-stone-600'
          )}
        >
          {tagline}
        </p>
      ) : null}
    </div>
  );
}

function CoverLayer({
  coverUrl,
  coverTransform,
  dimClass = 'bg-black/40',
}: {
  coverUrl: string;
  coverTransform?: MemorialHeroProps['coverTransform'];
  dimClass?: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolveMediaSrc(coverUrl)}
        alt=""
        className="h-full w-full object-cover"
        style={imageTransformStyle({
          x: coverTransform?.x || 0,
          y: coverTransform?.y || 0,
          scale: coverTransform?.scale || 1,
          rotate: coverTransform?.rotate || 0,
        })}
      />
      <div className={cn('absolute inset-0', dimClass)} />
    </div>
  );
}

function BottomBandHero({
  name,
  tagline,
  coverUrl,
  avatarUrl,
  coverTransform,
  avatarTransform,
  showWash,
  compact,
  className,
  avatarSide,
}: {
  name: string;
  tagline?: string;
  coverUrl?: string | null;
  avatarUrl?: string | null;
  coverTransform?: MemorialHeroProps['coverTransform'];
  avatarTransform?: MemorialHeroProps['avatarTransform'];
  showWash?: boolean;
  compact?: boolean;
  className?: string;
  avatarSide: 'left' | 'right';
}) {
  const hasCover = !!coverUrl;
  const avatarClass = compact
    ? 'h-16 w-16 -mt-8 sm:h-20 sm:w-20 sm:-mt-10'
    : 'h-20 w-20 -mt-10 sm:h-24 sm:w-24 sm:-mt-12';

  return (
    <header
      className={cn(
        'relative overflow-hidden border-b border-stone-200/60 transition-all duration-500',
        compact ? 'rounded-2xl border' : '',
        hasCover ? 'bg-stone-900' : 'bg-stone-100',
        className
      )}
    >
      <div className={cn('relative', compact ? 'h-36 sm:h-44' : 'h-48 sm:h-64')}>
        {hasCover ? (
          <CoverLayer
            coverUrl={coverUrl!}
            coverTransform={coverTransform}
            dimClass="bg-gradient-to-t from-black/35 via-black/10 to-black/5"
          />
        ) : (
          <SoftWashBackground />
        )}
        {showWash && hasCover ? <SoftWashBackground onDark /> : null}
      </div>

      <div className="relative z-10 border-t border-stone-200/70 bg-[#F5F5F7]">
        <div
          className={cn(
            'mx-auto flex w-full items-center gap-4 px-4',
            avatarSide === 'right' && 'flex-row-reverse',
            compact ? 'max-w-xl py-4' : 'max-w-5xl py-5 sm:gap-5 sm:py-6'
          )}
        >
          <AvatarCircle
            avatarUrl={avatarUrl}
            avatarTransform={avatarTransform}
            sizeClass={avatarClass}
          />
          <div className="min-w-0 flex-1">
            <TitleBlock
              name={name}
              tagline={tagline}
              align={avatarSide === 'right' ? 'right' : 'left'}
              compact={compact}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function MemorialHero({
  name,
  tagline,
  coverUrl,
  avatarUrl,
  coverTransform,
  avatarTransform,
  layout: layoutProp,
  bgMode: bgModeProp,
  compact = false,
  className,
}: MemorialHeroProps) {
  const layout = normalizeHeroLayout(layoutProp);
  const bgMode = normalizeHeroBgMode(bgModeProp, layout);
  const showImage =
    !!coverUrl && (bgMode === 'image' || bgMode === 'image-and-wash');
  const showWash = bgMode === 'soft-wash' || bgMode === 'image-and-wash';
  const onDark = showImage;

  const avatarSize = compact
    ? 'h-20 w-20 sm:h-24 sm:w-24'
    : 'h-28 w-28 sm:h-36 sm:w-36';

  if (layout === 'bottom-band' || layout === 'bottom-band-right') {
    return (
      <BottomBandHero
        name={name}
        tagline={tagline}
        coverUrl={coverUrl}
        avatarUrl={avatarUrl}
        coverTransform={coverTransform}
        avatarTransform={avatarTransform}
        showWash={showWash}
        compact={compact}
        className={className}
        avatarSide={layout === 'bottom-band-right' ? 'right' : 'left'}
      />
    );
  }

  if (layout === 'framed-portrait') {
    return (
      <header
        className={cn(
          'relative overflow-hidden border-b border-stone-200/60 bg-[#FAF8F5] transition-all duration-500',
          compact ? 'rounded-2xl border py-8' : 'py-14 sm:py-20',
          className
        )}
      >
        {showImage ? (
          <CoverLayer
            coverUrl={coverUrl!}
            coverTransform={coverTransform}
            dimClass="bg-[#FAF8F5]/85"
          />
        ) : null}
        {showWash ? <SoftWashBackground onDark={showImage} /> : null}
        {!showImage && !showWash ? (
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-[100px]"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          />
        ) : null}

        <div
          className={cn(
            'relative z-10 mx-auto flex w-full flex-col items-center px-4',
            compact ? 'max-w-xl gap-4' : 'max-w-5xl gap-5'
          )}
        >
          <AvatarFrame
            avatarUrl={avatarUrl}
            avatarTransform={avatarTransform}
            compact={compact}
          />
          <div
            className="h-px w-12 sm:w-16"
            style={{ backgroundColor: 'var(--theme-primary)' }}
            aria-hidden
          />
          <TitleBlock name={name} tagline={tagline} compact={compact} />
        </div>
      </header>
    );
  }

  if (layout === 'framed-on-cover') {
    const hasCover = !!coverUrl;
    return (
      <header
        className={cn(
          'relative overflow-hidden border-b border-stone-200/60 transition-all duration-500',
          compact ? 'min-h-[240px] rounded-2xl border py-10' : 'min-h-[320px] py-16 sm:min-h-[380px] sm:py-20',
          hasCover ? 'bg-stone-900' : 'bg-stone-100',
          className
        )}
      >
        {hasCover ? (
          <CoverLayer
            coverUrl={coverUrl!}
            coverTransform={coverTransform}
            dimClass="bg-black/45"
          />
        ) : (
          <SoftWashBackground />
        )}
        {showWash ? <SoftWashBackground onDark={hasCover} /> : null}

        <div
          className={cn(
            'relative z-10 mx-auto flex w-full flex-col items-center px-4',
            compact ? 'max-w-xl gap-4' : 'max-w-5xl gap-5'
          )}
        >
          <AvatarFrame
            avatarUrl={avatarUrl}
            avatarTransform={avatarTransform}
            compact={compact}
          />
          <div
            className={cn('h-px w-12 sm:w-16', hasCover ? 'bg-white/80' : '')}
            style={hasCover ? undefined : { backgroundColor: 'var(--theme-primary)' }}
            aria-hidden
          />
          <TitleBlock
            name={name}
            tagline={tagline}
            onDark={hasCover}
            compact={compact}
          />
        </div>
      </header>
    );
  }

  const shellClass = cn(
    'relative overflow-hidden border-b border-stone-200/60 transition-all duration-500',
    compact ? 'rounded-2xl border' : '',
    showImage ? 'bg-stone-900 text-white' : showWash ? 'bg-[#F5F5F7]' : 'bg-white',
    compact ? 'min-h-[220px] py-8' : 'min-h-[280px] py-16 sm:min-h-[320px] sm:py-20',
    className
  );

  return (
    <header className={shellClass}>
      {showImage ? (
        <CoverLayer coverUrl={coverUrl!} coverTransform={coverTransform} />
      ) : null}

      {showWash ? <SoftWashBackground onDark={onDark} /> : null}

      {!showImage && !showWash ? (
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-[100px]"
          style={{ backgroundColor: 'var(--theme-primary)' }}
        />
      ) : null}

      <div
        className={cn(
          'relative z-10 mx-auto w-full px-4',
          compact ? 'max-w-xl' : 'max-w-5xl'
        )}
      >
        {layout === 'center-classic' ? (
          <div className="flex flex-col items-center gap-4">
            <AvatarCircle
              avatarUrl={avatarUrl}
              avatarTransform={avatarTransform}
              sizeClass={avatarSize}
            />
            <TitleBlock
              name={name}
              tagline={tagline}
              onDark={onDark}
              compact={compact}
            />
          </div>
        ) : null}

        {layout === 'avatar-left' ? (
          <div className="flex items-center gap-4 sm:gap-6">
            <AvatarCircle
              avatarUrl={avatarUrl}
              avatarTransform={avatarTransform}
              sizeClass={avatarSize}
            />
            <TitleBlock
              name={name}
              tagline={tagline}
              onDark={onDark}
              align="left"
              compact={compact}
            />
          </div>
        ) : null}

        {layout === 'avatar-right' ? (
          <div className="flex flex-row-reverse items-center gap-4 sm:gap-6">
            <AvatarCircle
              avatarUrl={avatarUrl}
              avatarTransform={avatarTransform}
              sizeClass={avatarSize}
            />
            <TitleBlock
              name={name}
              tagline={tagline}
              onDark={onDark}
              align="right"
              compact={compact}
            />
          </div>
        ) : null}

        {layout === 'text-top' ? (
          <div className="flex flex-col items-center gap-5">
            <TitleBlock
              name={name}
              tagline={tagline}
              onDark={onDark}
              compact={compact}
            />
            <AvatarCircle
              avatarUrl={avatarUrl}
              avatarTransform={avatarTransform}
              sizeClass={avatarSize}
            />
          </div>
        ) : null}
      </div>
    </header>
  );
}
