'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ExternalLink,
  Flame,
  Heart,
  HeartHandshake,
  PawPrint,
  Sparkles,
  Users,
  UserRound,
} from 'lucide-react';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { getDemoSiteCards, type DemoSiteCard } from '@/lib/demoSites';
import type { CategoryKey } from '@/lib/categories';

const CATEGORY_ICONS: Record<CategoryKey, React.ReactNode> = {
  Memorial: <Flame className="w-4 h-4" />,
  'Family Legacy': <Sparkles className="w-4 h-4" />,
  Couple: <Heart className="w-4 h-4" />,
  Wedding: <HeartHandshake className="w-4 h-4" />,
  Friends: <Users className="w-4 h-4" />,
  'Pet Memorial': <PawPrint className="w-4 h-4" />,
};

const COPY = {
  th: {
    eyebrow: 'ตัวอย่างจริง',
    title: 'สำรวจเว็บตัวอย่างทุกหมวด',
    subtitle:
      'เปิดดูเว็บที่จัดเตรียมไว้แล้วครบทุกประเภท — การ์ดพิธี แกลเลอรี สมุดข้อความ และฟีเจอร์อื่น ๆ ตามหมวดที่คุณสนใจ',
    open: 'เปิดดูตัวอย่าง',
    create: 'สร้างเว็บของคุณ',
    note: 'เว็บตัวอย่างเป็นข้อมูลสาธิต — เปิดดูได้โดยไม่ต้องล็อกอิน',
  },
  en: {
    eyebrow: 'Live demos',
    title: 'Explore every category',
    subtitle:
      'Browse fully prepared example sites for every journey — invitations, galleries, guestbooks, and more.',
    open: 'View demo',
    create: 'Create your site',
    note: 'Demo sites are public showcases — no login required to browse.',
  },
};

function DemoCard({
  site,
  openLabel,
  createLabel,
}: {
  site: DemoSiteCard;
  openLabel: string;
  createLabel: string;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[22px] bg-white border border-stone-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={site.coverUrl}
          alt={site.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <span
          className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/90 px-3 py-1 text-[11px] font-bold text-stone-700 backdrop-blur-sm"
        >
          {CATEGORY_ICONS[site.category]}
          <span>{site.categoryLabel}</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6 text-left">
        <div className="space-y-2">
          <h2 className="text-[20px] sm:text-[22px] font-semibold tracking-tight text-[#1D1D1F] leading-snug">
            {site.title}
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#86868B] leading-relaxed">{site.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {site.highlights.map((item) => (
            <span
              key={item}
              className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-600"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-row flex-wrap items-center gap-2 pt-2">
          <Link
            href={`/${site.slug}`}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#0071e3] px-3.5 py-2 text-[13px] font-medium text-white transition hover:bg-[#0071e3]/90 sm:px-5 sm:py-2.5 sm:text-[14px]"
          >
            <span>{openLabel}</span>
            <ExternalLink className="size-3.5 sm:size-4" />
          </Link>
          <Link
            href={`/manage/create?category=${encodeURIComponent(site.category)}`}
            className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full border border-stone-300 px-3.5 py-2 text-[13px] font-medium text-[#1D1D1F] transition hover:bg-stone-50 sm:px-5 sm:py-2.5 sm:text-[14px]"
          >
            <UserRound className="size-3.5 sm:size-4" />
            <span>{createLabel}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ExamplesPage() {
  const { lang } = useLanguageStore();
  const [mounted, setMounted] = useState(false);
  const sites = getDemoSiteCards();

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = mounted && lang === 'en' ? COPY.en : COPY.th;

  return (
    <main className="marketing-light-surface min-h-screen bg-[#F5F5F7] text-[#1D1D1F] antialiased [color-scheme:light]">
      <section className="border-b border-[#bfc9c3]/20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-6 py-14 md:py-20 text-center space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#0071e3]/10 px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider text-[#0071e3]">
            <Sparkles className="w-3.5 h-3.5" />
            {t.eyebrow}
          </span>
          <h1 className="text-[34px] md:text-[56px] font-bold tracking-tight leading-[1.05]">{t.title}</h1>
          <p className="mx-auto max-w-2xl text-[16px] md:text-[19px] text-[#86868B] font-medium leading-relaxed">
            {t.subtitle}
          </p>
          <div className="pt-2">
            <Link
              href="/manage/create?category=Memorial"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1D1D1F] px-7 py-3 text-[15px] font-medium text-white transition hover:bg-[#1D1D1F]/90"
            >
              {t.create}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {sites.map((site) => (
              <DemoCard key={site.slug} site={site} openLabel={t.open} createLabel={t.create} />
            ))}
          </div>
          <p className="mt-10 text-center text-[13px] text-[#86868B]">{t.note}</p>
        </div>
      </section>
    </main>
  );
}
