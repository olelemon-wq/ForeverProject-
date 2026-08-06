'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { PublicNavItem } from '@/lib/features';
import { cn } from '@/lib/utils';

const NAV_LINK_CLASS =
  'px-3 py-2 text-xs sm:text-sm font-semibold rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/30 transition whitespace-nowrap';

const MORE_BUTTON_CLASS =
  'inline-flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-semibold rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/30 transition whitespace-nowrap';

function isNavItemActive(pathname: string, href: string, slug: string) {
  const homeHref = `/${slug}`;
  if (href === homeHref) return pathname === homeHref;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function PublicOverflowNav({
  items,
  slug,
}: {
  items: PublicNavItem[];
  slug: string;
}) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const moreMeasureRef = useRef<HTMLButtonElement>(null);
  const [visibleCount, setVisibleCount] = useState(items.length);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    const moreButton = moreMeasureRef.current;
    if (!container || !measure || !moreButton || items.length === 0) {
      setVisibleCount(items.length);
      return;
    }

    const recalc = () => {
      const available = container.clientWidth;
      if (available <= 0) return;

      const linkNodes = measure.querySelectorAll<HTMLElement>('[data-measure-link]');
      const widths = Array.from(linkNodes).map((node) => node.offsetWidth);
      const moreWidth = moreButton.offsetWidth + 8;
      const gap = 8;

      let used = 0;
      let count = 0;

      for (let i = 0; i < items.length; i++) {
        const itemWidth = widths[i] ?? 0;
        const itemsAfter = items.length - i - 1;
        const reserveMore = itemsAfter > 0 ? moreWidth : 0;
        const nextUsed = used + (count > 0 ? gap : 0) + itemWidth;

        if (nextUsed + reserveMore > available) break;

        used = nextUsed;
        count++;
      }

      if (count === 0) count = 1;
      setVisibleCount(count);
    };

    recalc();

    const observer = new ResizeObserver(recalc);
    observer.observe(container);
    window.addEventListener('resize', recalc);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', recalc);
    };
  }, [items]);

  const visibleItems = items.slice(0, visibleCount);
  const overflowItems = items.slice(visibleCount);
  const overflowHasActive = overflowItems.some((item) =>
    isNavItemActive(pathname, item.href, slug),
  );

  return (
    <>
      <div ref={containerRef} className="flex min-w-0 flex-1 items-center justify-center gap-1 sm:gap-2">
        {visibleItems.map((item) => {
          const active = isNavItemActive(pathname, item.href, slug);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                NAV_LINK_CLASS,
                active && 'bg-stone-200/40 text-stone-900',
              )}
            >
              {item.title}
            </Link>
          );
        })}

        {overflowItems.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                MORE_BUTTON_CLASS,
                'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-stone-300',
                overflowHasActive && 'bg-stone-200/40 text-stone-900',
              )}
            >
              เพิ่มเติม
              <ChevronDown className="size-4 opacity-70" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="min-w-48 rounded-xl border border-stone-200/80 bg-white p-1.5 shadow-lg"
            >
              {overflowItems.map((item) => {
                const active = isNavItemActive(pathname, item.href, slug);
                return (
                  <DropdownMenuItem key={item.key} asChild className="rounded-lg p-0 focus:bg-transparent">
                    <Link
                      href={item.href}
                      className={cn(
                        'block w-full px-3 py-1 text-right text-xs font-semibold text-stone-500 transition hover:bg-stone-200/30 hover:text-stone-900 sm:text-sm',
                        active && 'bg-stone-200/40 text-stone-900',
                      )}
                    >
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 -z-10 flex gap-2 opacity-0"
      >
        {items.map((item) => (
          <span key={item.key} data-measure-link className={NAV_LINK_CLASS}>
            {item.title}
          </span>
        ))}
        <button ref={moreMeasureRef} type="button" tabIndex={-1} className={MORE_BUTTON_CLASS}>
          เพิ่มเติม
          <ChevronDown className="size-4 opacity-70" aria-hidden />
        </button>
      </div>
    </>
  );
}
