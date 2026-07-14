'use client';

import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';

type TabItem = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

function scrollTabIntoView(scroller: HTMLElement, tab: HTMLElement) {
  const pad = 16;
  const tabLeft = tab.offsetLeft;
  const tabRight = tabLeft + tab.offsetWidth;
  const viewLeft = scroller.scrollLeft;
  const viewRight = viewLeft + scroller.clientWidth;

  if (tabLeft < viewLeft + pad) {
    scroller.scrollTo({ left: Math.max(0, tabLeft - pad), behavior: 'smooth' });
  } else if (tabRight > viewRight - pad) {
    scroller.scrollTo({
      left: tabRight - scroller.clientWidth + pad,
      behavior: 'smooth',
    });
  }
}

export default function ScrollableSubTabs({
  tabs,
  value,
  onChange,
  className = '',
}: {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateOverflow = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    // Fade hints only matter when labels show (md+) and content overflows
    if (window.matchMedia('(max-width: 767px)').matches) {
      setCanLeft(false);
      setCanRight(false);
      return;
    }
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(maxScroll > 2 && el.scrollLeft < maxScroll - 2);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateOverflow();
    el.addEventListener('scroll', updateOverflow, { passive: true });
    window.addEventListener('resize', updateOverflow);

    const ro = new ResizeObserver(() => updateOverflow());
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', updateOverflow);
      window.removeEventListener('resize', updateOverflow);
      ro.disconnect();
    };
  }, [updateOverflow]);

  return (
    <div className={`relative ${className}`}>
      <div className="rounded-2xl border border-stone-200/30 bg-stone-100/60 p-1.5">
        <div
          ref={scrollerRef}
          className="flex touch-pan-x items-center gap-1 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden md:gap-1"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = value === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                data-tab-id={tab.id}
                aria-label={tab.label}
                title={tab.label}
                onClick={(e) => {
                  onChange(tab.id);
                  const scroller = scrollerRef.current;
                  if (scroller) scrollTabIntoView(scroller, e.currentTarget);
                }}
                className={`flex shrink-0 items-center justify-center gap-2 rounded-xl border text-xs font-bold transition select-none md:justify-start md:whitespace-nowrap ${
                  isActive
                    ? 'border-stone-200/40 bg-white font-extrabold text-stone-900 shadow-xs'
                    : 'border-transparent text-stone-500 hover:bg-white/50 hover:text-stone-900'
                } flex-1 px-2 py-2.5 md:flex-none md:px-3.5 md:py-2`}
              >
                <Icon className={`size-4 shrink-0 md:size-3.5 ${isActive ? 'text-emerald-600' : 'text-stone-400'}`} />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {canLeft && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-8 rounded-l-2xl bg-gradient-to-r from-stone-100 to-transparent md:block"
        />
      )}

      {canRight && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-10 rounded-r-2xl bg-gradient-to-l from-stone-100 via-stone-100/90 to-transparent md:block"
        />
      )}
    </div>
  );
}
