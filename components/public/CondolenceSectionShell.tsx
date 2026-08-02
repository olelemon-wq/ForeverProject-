import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { getCondolenceSectionTheme } from '@/lib/condolenceCardTheme';
import { FEATURE_CARD_CLASS } from '@/lib/publicLayout';

type CondolenceSectionShellProps = {
  category: string;
  children: ReactNode;
  className?: string;
  /** Spacing/layout classes for inner content — avoid space-y on the outer shell (breaks edge pattern height). */
  contentClassName?: string;
  /** Override pattern opacity; mobile defaults lighter so text stays readable */
  patternOpacity?: {
    mobile?: number;
    desktop?: number;
  };
};

export default function CondolenceSectionShell({
  category,
  children,
  className,
  contentClassName,
  patternOpacity,
}: CondolenceSectionShellProps) {
  const theme = getCondolenceSectionTheme(category);
  const hasPattern = Boolean(theme.patternUrl);
  const mobileOpacity = patternOpacity?.mobile ?? 0.34;
  const desktopOpacity = patternOpacity?.desktop ?? 0.5;

  if (!hasPattern) {
    return (
      <div
        className={cn(
          FEATURE_CARD_CLASS,
          'rounded-3xl border border-stone-200/80 bg-white p-8 shadow-sm',
          className,
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
        className={cn(
          FEATURE_CARD_CLASS,
          'relative overflow-hidden rounded-3xl border shadow-[0_4px_20px_rgba(0,0,0,0.02)]',
        theme.borderClass,
        theme.surfaceClass,
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden sm:hidden"
        style={{ opacity: mobileOpacity }}
        aria-hidden
      >
        <img
          src={theme.patternUrl}
          alt=""
          className="absolute inset-y-0 right-0 h-full w-[34%] max-w-[148px] object-cover object-right-bottom"
          style={{
            WebkitMaskImage:
              'linear-gradient(to left, black 0%, black 28%, rgba(0,0,0,0.55) 52%, transparent 100%)',
            maskImage:
              'linear-gradient(to left, black 0%, black 28%, rgba(0,0,0,0.55) 52%, transparent 100%)',
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block"
        style={{ opacity: desktopOpacity }}
        aria-hidden
      >
        <img
          src={theme.patternUrl}
          alt=""
          className="absolute inset-y-0 right-0 h-full w-[38%] max-w-[188px] object-cover object-right-bottom"
          style={{
            WebkitMaskImage:
              'linear-gradient(to left, black 0%, black 28%, rgba(0,0,0,0.55) 52%, transparent 100%)',
            maskImage:
              'linear-gradient(to left, black 0%, black 28%, rgba(0,0,0,0.55) 52%, transparent 100%)',
          }}
        />
      </div>
      <div
        className={cn(
          'relative px-8 py-8 pr-14 sm:px-10 sm:py-10 sm:pr-20',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
