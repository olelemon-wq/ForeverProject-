'use client';

import React from 'react';

interface CategoryOrnamentProps {
  category: string;
  /** Number of motifs in a centered row. Default 1. Use 9 for condolence band. */
  count?: number;
}

const baseProps = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  style: { color: 'var(--theme-primary, #8b7355)' },
};

function PawMotif({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" strokeWidth="2" {...baseProps}>
      <circle cx="50" cy="58" r="12" />
      <circle cx="32" cy="38" r="7" />
      <circle cx="44" cy="28" r="7" />
      <circle cx="56" cy="28" r="7" />
      <circle cx="68" cy="38" r="7" />
    </svg>
  );
}

function HeartMotif({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" strokeWidth="2" {...baseProps}>
      <path d="M50,78 C50,78 22,58 22,42 C22,30 32,24 42,30 C46,32 50,38 50,38 C50,38 54,32 58,30 C68,24 78,30 78,42 C78,58 50,78 50,78 Z" />
    </svg>
  );
}

function SparkleMotif({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" strokeWidth="2" {...baseProps}>
      <path d="M50,18 C50,34 50,50 66,50 C50,50 50,66 50,82 C50,66 50,50 34,50 C50,50 50,34 50,18 Z" />
      <path d="M72,28 C72,36 72,44 80,44 C72,44 72,52 72,60 C72,52 72,44 64,44 C72,44 72,36 72,28 Z" strokeWidth="1.5" />
      <path d="M28,40 C28,46 28,52 34,52 C28,52 28,58 28,64 C28,58 28,52 22,52 C28,52 28,46 28,40 Z" strokeWidth="1.5" />
    </svg>
  );
}

function FamilyMotif({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" strokeWidth="2" {...baseProps}>
      <path d="M50,22 L50,78" />
      <path d="M50,42 L28,58 M50,42 L72,58" />
      <path d="M50,58 L34,74 M50,58 L66,74" />
      <circle cx="50" cy="22" r="6" />
      <circle cx="28" cy="58" r="5" />
      <circle cx="72" cy="58" r="5" />
      <circle cx="34" cy="74" r="4" />
      <circle cx="66" cy="74" r="4" />
    </svg>
  );
}

function ThaiDiamondMotif({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" {...baseProps}>
      <path d="M60,14 L96,60 L60,106 L24,60 Z" strokeWidth="1.5" />
      <path d="M60,26 L84,60 L60,94 L36,60 Z" strokeWidth="1" />
      <path d="M60,32 C64,40 68,48 60,52 C52,48 56,40 60,32 Z" strokeWidth="0.8" />
      <path d="M60,88 C56,80 52,72 60,68 C68,72 64,80 60,88 Z" strokeWidth="0.8" />
      <path d="M32,60 C40,56 48,52 52,60 C48,68 40,64 32,60 Z" strokeWidth="0.8" />
      <path d="M88,60 C80,64 72,68 68,60 C72,52 80,56 88,60 Z" strokeWidth="0.8" />
      <circle cx="60" cy="60" r="4" strokeWidth="1.2" />
    </svg>
  );
}

function MotifSvg({ category, className }: { category: string; className?: string }) {
  switch (category) {
    case 'Pet Memorial':
      return <PawMotif className={className} />;
    case 'Couple':
    case 'Wedding':
      return <HeartMotif className={className} />;
    case 'Family Legacy':
      return <FamilyMotif className={className} />;
    case 'Friends':
      return <SparkleMotif className={className} />;
    case 'Memorial':
    default:
      return <ThaiDiamondMotif className={className} />;
  }
}

export default function CategoryOrnament({ category, count = 1 }: CategoryOrnamentProps) {
  const n = Math.max(1, Math.min(count, 11));

  if (n === 1) {
    return (
      <MotifSvg
        category={category}
        className="w-14 h-14 opacity-45 select-none"
      />
    );
  }

  // Long band — used on condolence book across categories
  return (
    <div className="w-full max-w-lg mx-auto select-none" aria-hidden>
      <div className="flex items-center justify-center gap-1 sm:gap-1.5 px-1">
        <div
          className="h-px flex-1 max-w-10 sm:max-w-16"
          style={{
            background: 'linear-gradient(to right, transparent, var(--theme-primary, #8b7355))',
            opacity: 0.4,
          }}
        />
        {Array.from({ length: n }).map((_, i) => {
          const mid = Math.floor(n / 2);
          const dist = Math.abs(i - mid);
          const size =
            dist === 0
              ? 'w-8 h-8 sm:w-9 sm:h-9'
              : dist === 1
                ? 'w-7 h-7 sm:w-8 sm:h-8'
                : 'w-6 h-6 sm:w-7 sm:h-7';
          const opacity =
            dist === 0
              ? 'opacity-60'
              : dist === 1
                ? 'opacity-50'
                : dist === 2
                  ? 'opacity-40'
                  : 'opacity-32';
          return (
            <MotifSvg
              key={i}
              category={category}
              className={`${size} ${opacity} shrink-0`}
            />
          );
        })}
        <div
          className="h-px flex-1 max-w-10 sm:max-w-16"
          style={{
            background: 'linear-gradient(to left, transparent, var(--theme-primary, #8b7355))',
            opacity: 0.4,
          }}
        />
      </div>
    </div>
  );
}
