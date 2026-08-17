'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { MARKETING_CATEGORIES, MARKETING_DISPLAY_PRICE } from '@/lib/marketingCategories';
import { MarketingSkyHero } from '@/components/marketing/MarketingSkyHero';
import { Button } from '@/components/ui/button';
import { categoryCreateHref } from '@/components/marketing/MarketingBuyBlock';

function LineBreakText({ lines, className }: { lines: readonly string[]; className?: string }) {
  const blocks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (line === '') {
      if (current.length) blocks.push(current);
      current = [];
    } else {
      current.push(line);
    }
  }
  if (current.length) blocks.push(current);

  return (
    <div className={className}>
      {blocks.map((block, blockIndex) => (
        <p key={blockIndex} className={blockIndex > 0 ? 'mt-4' : undefined}>
          {block.map((line, lineIndex) => (
            <React.Fragment key={lineIndex}>
              {lineIndex > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}

const COPY = {
  th: {
    heroTitleLine1: 'ให้ความทรงจำ',
    heroTitleLine2: 'มีที่อยู่ของตัวเอง',
    heroDescLines: [
      'FOREVER คือพื้นที่ออนไลน์ส่วนตัว',
      'สำหรับเก็บเรื่องราว ภาพถ่าย และความคิดถึง',
      'บ้านดิจิทัลที่คุณสร้างขึ้น',
      'เพื่อคนที่คุณรักได้กลับมาเปิดดู',
    ],
    heroDescLinesDesktop: [
      'FOREVER คือพื้นที่ออนไลน์ส่วนตัว สำหรับเก็บเรื่องราว ภาพถ่าย และความคิดถึง',
      'บ้านดิจิทัลที่คุณสร้างขึ้น เพื่อคนที่คุณรักได้กลับมาเปิดดู',
    ],
    startCta: 'เริ่มสร้างพื้นที่ของคุณ',
    startCtaShort: 'เริ่มสร้าง',
    exploreExamples: 'ดูตัวอย่างจริง',
    exploreExamplesShort: 'ตัวอย่าง',
    whyTitleLine1: 'เพราะความทรงจำ...',
    whyTitleLine2: 'ไม่ควรหายไป พร้อมกับเวลา',
    whyP1Lines: [
      'วันนี้เราเก็บเรื่องราวกระจายอยู่ทุกที่',
      'รูปใน Instagram, คลิปสั้นใน TikTok, วิดีโอใน YouTube',
      'โพสต์ใน X, ข้อความใน LINE',
      'หรือแม้แต่ Facebook ที่คนรุ่นใหม่อาจไม่เคยเปิดดูเลย',
      '',
      'สิ่งที่เคยสำคัญวันหนึ่ง...',
      'กลายเป็นแค่โพสต์ที่จมในฟีด หาไม่เจอเมื่อเวลาผ่านไป',
      'หรือหายไปพร้อมกับบัญชี แอป หรือเครื่องที่เปลี่ยน',
    ],
    whyP1LinesDesktop: [
      'วันนี้เราเก็บเรื่องราวกระจายอยู่ทุกที่ รูปใน Instagram, คลิปสั้นใน TikTok',
      'วิดีโอใน YouTube, โพสต์ใน X, ข้อความใน LINE',
      'หรือแม้แต่ Facebook ที่คนรุ่นใหม่อาจไม่เคยเปิดดูเลย',
      '',
      'สิ่งที่เคยสำคัญวันหนึ่ง...กลายเป็นแค่โพสต์ที่จมในฟีด',
      'หาไม่เจอเมื่อเวลาผ่านไป หรือหายไปพร้อมกับบัญชี แอป หรือเครื่องที่เปลี่ยน',
    ],
    whyP1SupplementLines: [
      'โซเชียลมีไว้แชร์ช่วงเวลา',
      'แต่เรื่องสำคัญ ควรมีที่อยู่ที่เราเลือกเอง',
      'และอยู่ได้นานกว่าฟีดหนึ่งวัน',
    ],
    whyP2Lines: [
      'FOREVER คือบ้านดิจิทัล',
      'ลิงก์เดียวที่ครอบครัวเปิดได้ทุกเมื่อ ไม่มีโฆษณา หรือฟีดรบกวน',
      'คุณเลือกว่าใครเห็นอะไร และรูปไหนอยู่ตรงนี้',
    ],
    whyP2LinesDesktop: [
      'FOREVER คือบ้านดิจิทัล ลิงก์เดียวที่ครอบครัวเปิดได้ทุกเมื่อ',
      'ไม่มีโฆษณา หรือฟีดรบกวน คุณเลือกว่าใครเห็นอะไร และรูปไหนอยู่ตรงนี้',
    ],
    whyP3Lines: [
      'อัปโหลดรูป เขียนเรื่อง อนุมัติข้อความ พิมพ์ QR',
      'ติดสมุดครอบครัว หรือแชร์ลิงก์ในงานพิธี',
      'เก็บถาวร ไม่ใช่โพสต์ชั่วคราว',
    ],
    whyP3LinesDesktop: [
      'อัปโหลดรูป เขียนเรื่อง อนุมัติข้อความ พิมพ์ QR ติดสมุดหรือแชร์ในงาน',
      'เรื่องราวไม่ได้มีวันหมดอายุ FOREVER เก็บถาวร ไม่ใช่โพสต์ชั่วคราว',
    ],
    categoriesTitle: 'ทุกเรื่องราวสำคัญ มีรูปแบบของตัวเอง',
    categoriesDescLines: [
      'FOREVER รองรับหลายบริบท',
      'แต่ละหัวข้อมีฟีเจอร์ที่เหมาะกับเรื่องนั้นโดยเฉพาะ',
    ],
    readyTitleLine1: 'พร้อมแล้วก็เริ่มได้เลย',
  },
  en: {
    heroTitleLine1: 'Give memories',
    heroTitleLine2: 'a home of their own',
    heroDescLines: [
      'FOREVER is a private online space',
      'for stories, photos, and the people you miss',
      'a digital home you build',
      'so the people you love can come back to look',
    ],
    heroDescLinesDesktop: [
      'FOREVER is a private online space for stories, photos, and the people you miss',
      'a digital home you build so the people you love can come back to look',
    ],
    startCta: 'Start your space',
    startCtaShort: 'Start',
    exploreExamples: 'See live examples',
    exploreExamplesShort: 'Examples',
    whyTitleLine1: 'Because memories...',
    whyTitleLine2: 'should not fade with time',
    whyP1Lines: [
      'Today our stories scatter everywhere',
      'photos on Instagram, short clips on TikTok, videos on YouTube',
      'posts on X, messages in LINE',
      'or even Facebook that younger generations may never open.',
      '',
      'What mattered once...',
      'becomes just another post lost in the feed, impossible to find years later',
      'or gone with an account, an app, or a new phone.',
    ],
    whyP1LinesDesktop: [
      'Today our stories scatter everywhere, photos on Instagram, short clips on TikTok',
      'videos on YouTube, posts on X, messages in LINE',
      'or even Facebook that younger generations may never open.',
      '',
      'What mattered once... becomes just another post lost in the feed',
      'impossible to find years later, or gone with an account, an app, or a new phone.',
    ],
    whyP1SupplementLines: [
      'Social media is for sharing the moment',
      'but what matters deserves a place you choose yourself',
      'one that lasts longer than a single day’s feed.',
    ],
    whyP2Lines: [
      'FOREVER is a digital home',
      'one link family can open anytime',
      'no ads, no noisy feed, you choose who sees what, and which photos belong here',
    ],
    whyP2LinesDesktop: [
      'FOREVER is a digital home, one link family can open anytime',
      'no ads, no noisy feed, you choose who sees what, and which photos belong here',
    ],
    whyP3Lines: [
      'Upload photos, write stories, approve messages, print a QR',
      'keep it in the family book or share at a ceremony',
      'an archive, not a fleeting post',
    ],
    whyP3LinesDesktop: [
      'Upload photos, write stories, approve messages, print a QR for the album or a ceremony',
      'stories do not expire FOREVER is a lasting archive, not a fleeting post',
    ],
    categoriesTitle: 'Every important story has its own shape',
    categoriesDescLines: [
      'FOREVER supports many contexts',
      'each category has features tailored to that kind of story.',
    ],
    readyTitleLine1: 'Start when you’re ready',
  },
} as const;

function HomeCtaButtons({
  startCta,
  startCtaShort,
  exploreExamples,
  exploreExamplesShort,
}: {
  startCta: string;
  startCtaShort: string;
  exploreExamples: string;
  exploreExamplesShort: string;
}) {
  return (
    <div className="flex flex-row gap-2.5 sm:gap-4 justify-center w-full max-w-md mx-auto">
      <Link
        href="/manage/create?category=Memorial"
        className="flex-1 inline-flex items-center justify-center bg-[#0071e3] text-white font-medium text-sm sm:text-lg px-3 sm:px-8 py-3 sm:py-3.5 rounded-full hover:bg-[#0077ED] shadow-[0_4px_14px_rgba(0,113,227,0.35)] transition-all active:scale-[0.98] whitespace-nowrap"
      >
        <span className="sm:hidden">{startCtaShort}</span>
        <span className="hidden sm:inline">{startCta}</span>
      </Link>
      <Link
        href="/examples"
        className="flex-1 inline-flex items-center justify-center bg-white text-[#0071e3] font-medium text-sm sm:text-lg px-3 sm:px-8 py-3 sm:py-3.5 rounded-full border border-[#0071e3]/25 hover:border-[#0071e3]/40 hover:bg-[#F5F5F7] transition-all gap-1 whitespace-nowrap"
      >
        <span className="sm:hidden">{exploreExamplesShort}</span>
        <span className="hidden sm:inline">{exploreExamples}</span>
        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden />
      </Link>
    </div>
  );
}

export default function MarketingHome() {
  const { lang } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = mounted && lang === 'en' ? COPY.en : COPY.th;
  const isEn = mounted && lang === 'en';

  const bodyText = 'text-base md:text-lg text-[#6E6E73] font-medium leading-[1.75]';
  const bodyTextEmphasis = 'text-xl md:text-3xl text-[#1D1D1F] font-semibold leading-[1.65]';

  return (
    <main className="marketing-light-surface bg-[#F5F5F7] text-[#1D1D1F] antialiased selection:bg-[#0071e3] selection:text-[#FFFFFF] min-h-screen [color-scheme:light]">
      <MarketingSkyHero>
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-5 md:space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.03em] text-[#1D1D1F] text-balance flex flex-col items-center gap-3 sm:gap-4 md:gap-5">
            <span className="block leading-none">{t.heroTitleLine1}</span>
            <span className="block leading-none">{t.heroTitleLine2}</span>
          </h1>
          <LineBreakText lines={t.heroDescLines} className="max-w-2xl text-pretty text-lg font-medium leading-[1.75] text-[#3D3D3F] md:hidden" />
          <LineBreakText lines={t.heroDescLinesDesktop} className="hidden max-w-2xl text-pretty text-xl font-medium leading-[1.75] text-[#3D3D3F] md:block" />
        </div>
      </MarketingSkyHero>

      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[720px] px-6 text-center">
          <h2 className="flex flex-col items-center gap-1 text-2xl font-semibold leading-snug tracking-tight text-[#1D1D1F] md:gap-2 md:text-4xl">
            <span className="block">{t.whyTitleLine1}</span>
            <span className="block">{t.whyTitleLine2}</span>
          </h2>
          <div className="mt-6 md:mt-8">
            <LineBreakText lines={t.whyP1Lines} className={`${bodyText} md:hidden`} />
            <LineBreakText lines={t.whyP1LinesDesktop} className={`${bodyText} hidden md:block`} />
          </div>
          <div className="mx-auto mt-10 grid grid-cols-3 gap-2 md:mt-12 md:gap-3">
            {[
              '/marketing/family-story-features/gallery.jpg',
              '/marketing/couple-features/memory-full.jpg',
              '/marketing/memorial-features/memory.jpg',
            ].map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                className="aspect-[4/3] w-full rounded-2xl object-cover"
                loading="lazy"
              />
            ))}
          </div>
          <div className="mt-10 md:mt-12">
            <LineBreakText lines={t.whyP1SupplementLines} className={bodyTextEmphasis} />
          </div>
          <div className="mt-6 space-y-6 md:mt-8 md:space-y-7">
            <LineBreakText lines={t.whyP2Lines} className={`${bodyText} md:hidden`} />
            <LineBreakText lines={t.whyP2LinesDesktop} className={`${bodyText} hidden md:block`} />
            <LineBreakText lines={t.whyP3Lines} className={`${bodyText} md:hidden`} />
            <LineBreakText lines={t.whyP3LinesDesktop} className={`${bodyText} hidden md:block`} />
          </div>
        </div>
      </section>

      <section id="categories" className="py-12 md:py-16 bg-[#F5F5F7] border-y border-[#E8E8ED]">
        <div className="max-w-[720px] mx-auto px-6 text-center space-y-6">
          <div className="space-y-3">
            <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-[#1D1D1F]">
              {t.categoriesTitle}
            </h2>
            <LineBreakText lines={t.categoriesDescLines} className={`${bodyText} text-sm md:text-lg`} />
          </div>

          <ul className="divide-y divide-[#E8E8ED] text-left list-none">
            {MARKETING_CATEGORIES.map((category) => {
              const copy = isEn ? category.en : category.th;
              const price = isEn ? MARKETING_DISPLAY_PRICE.en : MARKETING_DISPLAY_PRICE.th;
              return (
                <li key={category.slug} className="py-6 first:pt-0 last:pb-0 md:py-8 md:first:pt-0">
                  <article className="flex overflow-hidden rounded-2xl border border-[#E8E8ED] bg-white">
                    <Link
                      href={`/${category.slug}`}
                      className="relative w-[30%] min-h-[8.5rem] min-w-[6.5rem] max-w-[11rem] shrink-0 self-stretch bg-[#F5F5F7]"
                    >
                      <img
                        src={category.image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-3.5 sm:p-5">
                      <div>
                        <h3 className="text-lg font-semibold leading-snug tracking-tight text-[#1D1D1F] md:text-xl">
                          <Link href={`/${category.slug}`} className="hover:text-[#0071e3]">
                            {copy.title}
                          </Link>
                        </h3>
                        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-[#6E6E73]">
                          {copy.cardDesc}
                        </p>
                      </div>
                      <div className="flex items-end justify-between gap-3">
                        <p className="leading-none">
                          <span className="text-lg font-semibold tracking-tight text-[#1D1D1F] sm:text-xl">
                            {price.amount}
                          </span>
                          <span className="ml-1 text-sm font-medium text-[#6E6E73]">{price.period}</span>
                        </p>
                        <Button
                          asChild
                          className="h-9 shrink-0 rounded-full bg-[#0071e3] px-4 text-sm font-medium text-white hover:bg-[#0077ED] sm:h-10 sm:px-5"
                        >
                          <Link href={categoryCreateHref(category.createCategory)}>{price.cta}</Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-xl space-y-6 px-6 text-center">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {t.readyTitleLine1}
          </h2>
          <HomeCtaButtons
            startCta={t.startCta}
            startCtaShort={t.startCtaShort}
            exploreExamples={t.exploreExamples}
            exploreExamplesShort={t.exploreExamplesShort}
          />
        </div>
      </section>
    </main>
  );
}
