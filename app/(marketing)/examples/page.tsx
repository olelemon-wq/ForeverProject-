'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { getDemoSiteCards } from '@/lib/demoSites';
import { MARKETING_CATEGORIES } from '@/lib/marketingCategories';
import { MarketingDemoSiteCard } from '@/components/marketing/MarketingDemoSiteCard';

const COPY = {
  th: {
    title: 'สำรวจเว็บตัวอย่างทุกหมวด',
    subtitleLead: 'เปิดดูเว็บที่จัดเตรียมไว้แล้วครบทุกประเภท การ์ดพิธี แกลเลอรี',
    subtitleMid: 'สมุดข้อความ',
    subtitleRest: 'และฟีเจอร์อื่น ๆ ตามหมวดที่คุณสนใจ',
    create: 'สร้างเว็บของคุณ',
    note: 'เว็บตัวอย่างเป็นข้อมูลสาธิต เปิดดูได้โดยไม่ต้องล็อกอิน',
  },
  en: {
    title: 'Explore every category',
    subtitle: [
      'Browse fully prepared example sites for every journey: invitations, galleries, guestbooks',
      'and other features in the category you care about.',
    ],
    create: 'Create your site',
    note: 'Demo sites are public showcases. No login required to browse.',
  },
};

export default function ExamplesPage() {
  const { lang } = useLanguageStore();
  const [mounted, setMounted] = useState(false);
  const sites = getDemoSiteCards();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isEn = mounted && lang === 'en';
  const t = isEn ? COPY.en : COPY.th;

  return (
    <main className="marketing-light-surface min-h-screen bg-[#F5F5F7] text-[#1D1D1F] antialiased [color-scheme:light]">
      <section className="border-b border-[#E8E8ED] bg-white">
        <div className="mx-auto max-w-[1080px] space-y-5 px-6 py-14 text-center md:py-20">
          <h1 className="text-3xl font-bold leading-[1.05] tracking-tight md:text-5xl">{t.title}</h1>
          <p className="mx-auto max-w-2xl break-keep text-base font-medium leading-relaxed text-[#6E6E73] md:text-lg">
            {isEn ? (
              <>
                {COPY.en.subtitle[0]}
                <br />
                {COPY.en.subtitle[1]}
              </>
            ) : (
              <>
                {COPY.th.subtitleLead}
                <br className="md:hidden" /> {COPY.th.subtitleMid}
                <br className="hidden md:block" /> {COPY.th.subtitleRest}
              </>
            )}
          </p>
          <div className="pt-2">
            <Link
              href="/manage/create"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0071e3] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#0077ED]"
            >
              {t.create}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1080px] px-6">
        <div className="divide-y divide-[#E8E8ED]">
          {MARKETING_CATEGORIES.map((category) => {
            const demos = sites
              .filter((site) => site.category === category.createCategory)
              .slice(0, 3);
            if (demos.length === 0) return null;

            const copy = isEn ? category.en : category.th;

            return (
              <div key={category.slug} className="py-12 sm:py-14">
                <h2 className="text-2xl font-semibold tracking-tight text-[#1D1D1F] md:text-3xl">
                  <Link href={`/${category.slug}`} className="hover:text-[#0071e3]">
                    {copy.title}
                  </Link>
                </h2>
                <p className="mt-2 max-w-2xl break-keep text-base leading-relaxed text-[#6E6E73]">
                  {copy.tagline}
                </p>
                <div className="mt-8 flex flex-col gap-4">
                  {demos.map((demo) => (
                    <MarketingDemoSiteCard
                      key={demo.slug}
                      demo={demo}
                      isEn={isEn}
                      layout="row"
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <p className="pb-12 text-center text-sm text-[#6E6E73] sm:pb-16">{t.note}</p>
      </section>
    </main>
  );
}
