'use client';

import { useEffect, useState, type ReactNode } from 'react';

export function MarketingSkyHero({ children }: { children: ReactNode }) {
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPlayVideo(!media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return (
    <section className="relative isolate flex min-h-[72vh] items-center overflow-hidden">
      <img
        src="/marketing/hero-curtain.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {playVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/marketing/hero-curtain.jpg"
          aria-hidden
        >
          <source src="/marketing/hero-curtain.mp4" type="video/mp4" />
        </video>
      ) : null}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 via-stone-50/20 to-[#F5F5F7]"
        aria-hidden
      />
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 py-20 md:py-28">
        {children}
      </div>
    </section>
  );
}
