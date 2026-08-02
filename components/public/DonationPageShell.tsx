import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { getCondolenceSectionTheme } from '@/lib/condolenceCardTheme';
import { FEATURE_CARD_CLASS } from '@/lib/publicLayout';

type DonationPageShellProps = {
  category: string;
  children: ReactNode;
  className?: string;
  /** Override pattern opacity; defaults keep mobile readable and desktop subtle */
  patternOpacity?: {
    mobile?: number;
    desktop?: number;
  };
};

const PATTERN_MASK =
  'linear-gradient(to left, black 0%, black 30%, rgba(0,0,0,0.55) 54%, transparent 100%)';

export default function DonationPageShell({
  category,
  children,
  className,
  patternOpacity,
}: DonationPageShellProps) {
  const theme = getCondolenceSectionTheme(category);
  const hasPattern = Boolean(theme.patternUrl);
  const mobileOpacity = patternOpacity?.mobile ?? 0.52;
  const desktopOpacity = patternOpacity?.desktop ?? 0.52;

  if (!hasPattern) {
    return (
      <div
        className={cn(
          FEATURE_CARD_CLASS,
          'relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] sm:p-10',
          className,
        )}
      >
        {children}
      </div>
    );
  }

  const patternMaskStyle = {
    WebkitMaskImage: PATTERN_MASK,
    maskImage: PATTERN_MASK,
  } as const;

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
      {/* Mobile: floral strip on the right */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[40%] max-w-[172px] overflow-hidden sm:max-w-[188px] lg:hidden"
        style={{ opacity: mobileOpacity }}
        aria-hidden
      >
        <img
          src={theme.patternUrl}
          alt=""
          className="h-full w-full object-cover object-right-bottom"
          style={patternMaskStyle}
        />
      </div>

      {/* Desktop: same artwork mirrored to the left */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[34%] max-w-[148px] overflow-hidden lg:block lg:max-w-[160px]"
        aria-hidden
      >
        <img
          src={theme.patternUrl}
          alt=""
          className="h-full w-full -scale-x-100 object-cover object-right-bottom"
          style={{ ...patternMaskStyle, opacity: desktopOpacity }}
        />
      </div>

      <div className="relative p-6 sm:p-10 lg:pl-16 lg:pr-10">{children}</div>
    </div>
  );
}
