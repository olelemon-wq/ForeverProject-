'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';

export function FitToFrame({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const apply = () => {
      inner.style.transform = 'none';
      inner.style.height = 'auto';
      const needed = inner.scrollHeight;
      const available = outer.clientHeight;
      if (available <= 0) return;
      if (needed > available + 1) {
        inner.style.transform = `scale(${available / needed})`;
        inner.style.transformOrigin = 'top center';
        return;
      }
      inner.style.height = '100%';
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(outer);
    return () => observer.disconnect();
  });

  return (
    <div ref={outerRef} className="h-full w-full overflow-hidden">
      <div ref={innerRef} className="w-full">
        {children}
      </div>
    </div>
  );
}
