'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MARKETING_DISPLAY_PRICE } from '@/lib/marketingCategories';
import { cn } from '@/lib/utils';

export function categoryCreateHref(createCategory: string) {
  return `/manage/create?category=${encodeURIComponent(createCategory)}`;
}

export function MarketingBuyBlock({
  createCategory,
  isEn,
  align = 'start',
  compact = false,
}: {
  createCategory: string;
  isEn: boolean;
  align?: 'start' | 'center';
  compact?: boolean;
}) {
  const price = isEn ? MARKETING_DISPLAY_PRICE.en : MARKETING_DISPLAY_PRICE.th;

  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
      )}
    >
      <p className="leading-none">
        <span
          className={cn(
            'font-semibold tracking-tight text-[#1D1D1F]',
            compact ? 'text-2xl' : 'text-3xl md:text-4xl',
          )}
        >
          {price.amount}
        </span>
        <span className="ml-1 text-base font-medium text-[#6E6E73]">{price.period}</span>
      </p>
      <Button
        asChild
        className={cn(
          'rounded-full bg-[#0071e3] text-base font-medium text-white hover:bg-[#0077ED]',
          compact ? 'h-11 px-6' : 'h-12 px-8',
        )}
      >
        <Link href={categoryCreateHref(createCategory)}>{price.cta}</Link>
      </Button>
    </div>
  );
}
