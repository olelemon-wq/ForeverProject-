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
import { keepNameTogether, splitMemorialTitle } from '@/lib/memorialName';
import { cn } from '@/lib/utils';

/** Public site hero: taller on desktop + width aligned with nav (max-w-5xl). */
const publicHeroFrame = (compact?: boolean) =>
  compact
    ? ''
    : 'md:mx-auto md:w-full md:max-w-5xl md:overflow-hidden md:rounded-2xl md:border md:border-stone-200/60 md:shadow-sm';

/** Shared crop: 1024×420 banner (~2.44:1). Same ratio on mobile so the cover is not full-screen. */
const HERO_RATIO_BOX = 'aspect-[1024/420] min-h-0 overflow-hidden';

const publicHeroHeight = (compact?: boolean) =>
  compact
    ? cn(HERO_RATIO_BOX, 'py-6 sm:py-8')
    : cn(HERO_RATIO_BOX, 'flex flex-col justify-center py-4 sm:py-6 md:py-16 lg:py-20');

const publicFramedOnCoverHeight = (compact?: boolean) =>
  compact
    ? cn(HERO_RATIO_BOX, 'flex flex-col justify-center py-4 sm:py-6')
    : cn(HERO_RATIO_BOX, 'flex flex-col justify-center py-4 sm:py-6 md:py-16 lg:py-20');

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
  /** True-size desktop preview; parent should scale a 1024×420 box. */
  preview?: boolean;
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
                linear-gradient(165deg, color-mix(in srgb, var(--theme-primary) 10%, #F5F5F7), #FAF8F5 55%, color-mix(in srgb, var(--theme-secondary) 8%, #F5F5F7) 100%)
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
        compact ? 'h-20 w-16 sm:h-36 sm:w-28 md:h-40 md:w-32' : 'h-20 w-16 sm:h-40 sm:w-32 md:h-52 md:w-40 lg:h-64 lg:w-48'
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
  const { prefix, name: personName } = splitMemorialTitle(name);
  const nameTogether = keepNameTogether(personName);

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
          compact ? 'text-lg sm:text-xl' : 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
          onDark ? 'text-white drop-shadow-md' : 'text-stone-900'
        )}
      >
        {prefix ? (
          <>
            <span className="block sm:inline">{prefix}</span>
            <span className="inline-block max-w-full whitespace-nowrap sm:ml-2">
              {nameTogether}
            </span>
          </>
        ) : (
          <span className="inline-block max-w-full whitespace-nowrap">{nameTogether}</span>
        )}
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
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
  useCoverBackground,
  useThemeBackground,
  compact,
  fillBox,
  className,
  avatarSide,
}: {
  name: string;
  tagline?: string;
  coverUrl?: string | null;
  avatarUrl?: string | null;
  coverTransform?: MemorialHeroProps['coverTransform'];
  avatarTransform?: MemorialHeroProps['avatarTransform'];
  useCoverBackground: boolean;
  useThemeBackground: boolean;
  compact?: boolean;
  fillBox?: boolean;
  className?: string;
  avatarSide: 'left' | 'right';
}) {
  const avatarClass = compact
    ? 'h-14 w-14 -mt-7 sm:h-16 sm:w-16 sm:-mt-8'
    : 'h-14 w-14 -mt-7 sm:h-16 sm:w-16 sm:-mt-8 md:h-20 md:w-20 md:-mt-10 lg:h-24 lg:w-24 lg:-mt-12';

  return (
    <header
      className={cn(
        'relative flex flex-col overflow-hidden border-b border-stone-200/60 transition-all duration-500',
        fillBox
          ? 'h-full min-h-0 w-full'
          : compact
            ? cn('rounded-2xl border', HERO_RATIO_BOX)
            : cn(publicHeroFrame(), HERO_RATIO_BOX),
        useCoverBackground ? 'bg-stone-900' : 'bg-stone-100',
        className
      )}
    >
      <div className="relative min-h-0 flex-1">
        {useCoverBackground && coverUrl ? (
          <CoverLayer
            coverUrl={coverUrl}
            coverTransform={coverTransform}
            dimClass="bg-gradient-to-t from-black/35 via-black/10 to-black/5"
          />
        ) : useThemeBackground ? (
          <SoftWashBackground />
        ) : (
          <div className="h-full w-full bg-stone-100" />
        )}
      </div>

      <div className="relative z-10 shrink-0 border-t border-stone-200/70 bg-[#F5F5F7]">
        <div
          className={cn(
            'mx-auto flex w-full items-center gap-3 px-4',
            avatarSide === 'right' && 'flex-row-reverse',
            compact ? 'max-w-xl py-2.5' : 'max-w-5xl py-2.5 sm:py-4 md:py-5 lg:py-6 sm:gap-5'
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
  preview = false,
  className,
}: MemorialHeroProps) {
  const layout = normalizeHeroLayout(layoutProp);
  const bgMode = normalizeHeroBgMode(bgModeProp, layout);
  const hasCover = !!coverUrl;
  const useCoverBackground = bgMode === 'image' && hasCover;
  const useThemeBackground = bgMode === 'soft-wash';
  const onDark = useCoverBackground;
  const useCompact = compact && !preview;
  const fillBox = preview;

  const avatarSize = useCompact
    ? 'h-20 w-20 sm:h-24 sm:w-24'
    : 'h-16 w-16 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-36 lg:w-36';

  if (layout === 'bottom-band' || layout === 'bottom-band-right') {
    return (
      <BottomBandHero
        name={name}
        tagline={tagline}
        coverUrl={coverUrl}
        avatarUrl={avatarUrl}
        coverTransform={coverTransform}
        avatarTransform={avatarTransform}
        useCoverBackground={useCoverBackground}
        useThemeBackground={useThemeBackground}
        compact={useCompact}
        fillBox={fillBox}
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
          fillBox
            ? 'flex h-full min-h-0 w-full flex-col justify-center overflow-hidden py-14 sm:py-20'
            : useCompact
              ? cn('flex flex-col justify-center rounded-2xl border', HERO_RATIO_BOX)
              : cn(publicHeroFrame(), HERO_RATIO_BOX, 'flex flex-col justify-center py-4 sm:py-6 md:py-14 lg:py-20'),
          className
        )}
      >
        {useCoverBackground ? (
          <CoverLayer
            coverUrl={coverUrl!}
            coverTransform={coverTransform}
            dimClass="bg-[#FAF8F5]/85"
          />
        ) : null}
        {useThemeBackground ? <SoftWashBackground /> : null}
        {!useCoverBackground && !useThemeBackground ? (
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-[100px]"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          />
        ) : null}

        <div
          className={cn(
            'relative z-10 mx-auto flex w-full flex-col items-center px-4',
            useCompact ? 'max-w-xl gap-2 sm:gap-4' : 'max-w-5xl gap-2 sm:gap-4 md:gap-5'
          )}
        >
          <AvatarFrame
            avatarUrl={avatarUrl}
            avatarTransform={avatarTransform}
            compact={useCompact}
          />
          <div
            className="h-px w-12 sm:w-16"
            style={{ backgroundColor: 'var(--theme-primary)' }}
            aria-hidden
          />
          <TitleBlock name={name} tagline={tagline} compact={useCompact} />
        </div>
      </header>
    );
  }

  if (layout === 'framed-on-cover') {
    return (
      <header
        className={cn(
          'relative overflow-hidden border-b border-stone-200/60 transition-all duration-500',
          fillBox
            ? 'h-full min-h-0 w-full overflow-hidden py-16 md:py-20'
            : useCompact
              ? cn('rounded-2xl border', publicFramedOnCoverHeight(true))
              : cn(publicHeroFrame(), publicFramedOnCoverHeight()),
          useCoverBackground ? 'bg-stone-900' : 'bg-stone-100',
          className
        )}
      >
        {useCoverBackground ? (
          <CoverLayer
            coverUrl={coverUrl!}
            coverTransform={coverTransform}
            dimClass="bg-black/45"
          />
        ) : useThemeBackground ? (
          <SoftWashBackground />
        ) : (
          <div className="absolute inset-0 bg-stone-100" />
        )}

        <div
          className={cn(
            'relative z-10 mx-auto flex w-full flex-col items-center px-4',
            useCompact ? 'max-w-xl gap-2 sm:gap-4' : 'max-w-5xl gap-2 sm:gap-4 md:gap-5'
          )}
        >
          <AvatarFrame
            avatarUrl={avatarUrl}
            avatarTransform={avatarTransform}
            compact={useCompact}
          />
          <div
            className={cn('h-px w-12 sm:w-16', onDark ? 'bg-white/80' : '')}
            style={onDark ? undefined : { backgroundColor: 'var(--theme-primary)' }}
            aria-hidden
          />
          <TitleBlock
            name={name}
            tagline={tagline}
            onDark={onDark}
            compact={useCompact}
          />
        </div>
      </header>
    );
  }

  const shellClass = cn(
    'relative overflow-hidden border-b border-stone-200/60 transition-all duration-500',
    fillBox
      ? 'h-full min-h-0 w-full overflow-hidden py-16 md:py-20'
      : useCompact
        ? 'rounded-2xl border'
        : publicHeroFrame(),
    onDark ? 'bg-stone-900 text-white' : useThemeBackground ? 'bg-[#F5F5F7]' : 'bg-white',
    fillBox ? null : publicHeroHeight(useCompact),
    className
  );

  return (
    <header className={shellClass}>
      {useCoverBackground ? (
        <CoverLayer coverUrl={coverUrl!} coverTransform={coverTransform} />
      ) : null}

      {useThemeBackground ? <SoftWashBackground onDark={onDark} /> : null}
      {!useCoverBackground && !useThemeBackground ? (
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-[100px]"
          style={{ backgroundColor: 'var(--theme-primary)' }}
        />
      ) : null}

      <div
        className={cn(
          'relative z-10 mx-auto w-full px-4',
          useCompact ? 'max-w-xl' : 'max-w-5xl'
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
              compact={useCompact}
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
              compact={useCompact}
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
              compact={useCompact}
            />
          </div>
        ) : null}

        {layout === 'text-top' ? (
          <div className="flex flex-col items-center gap-5">
            <TitleBlock
              name={name}
              tagline={tagline}
              onDark={onDark}
              compact={useCompact}
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
