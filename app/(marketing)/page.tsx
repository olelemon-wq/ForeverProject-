'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Cloud, QrCode, Sparkles } from 'lucide-react';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { MARKETING_CATEGORIES } from '@/lib/marketingCategories';

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
    heroTitleLine1: 'สลักความทรงจำไว้',
    heroTitleLine2: 'ชั่วนิรันดร์',
    heroDescLines: [
      'FOREVER คือพื้นที่ออนไลน์ส่วนตัวสำหรับเก็บเรื่องราว',
      'ภาพถ่าย และคำรำลึก',
      'บ้านดิจิทัลที่คุณสร้างขึ้น เพื่อคนที่คุณรัก และคนที่จะมาหลังจากนี้',
    ],
    heroDescLinesDesktop: [
      'FOREVER คือพื้นที่ออนไลน์ส่วนตัวสำหรับเก็บเรื่องราว ภาพถ่าย และคำรำลึก',
      'บ้านดิจิทัลที่คุณสร้างขึ้น เพื่อคนที่คุณรัก และคนที่จะมาหลังจากนี้',
    ],
    startCta: 'เริ่มสร้างพื้นที่ของคุณ',
    startCtaShort: 'เริ่มสร้าง',
    exploreExamples: 'ดูตัวอย่างจริง',
    exploreExamplesShort: 'ตัวอย่าง',
    whyTitleLine1: 'เพราะความทรงจำ...',
    whyTitleLine2: 'ไม่ควรหายไป พร้อมกับเวลา',
    whyP1Lines: [
      'วันนี้เราเก็บความทรงจำกระจายอยู่ทุกที่',
      'รูปใน Instagram, คลิปสั้นใน TikTok, วิดีโอใน YouTube',
      'โพสต์ใน X, ข้อความใน LINE',
      'หรือแม้แต่ Facebook ที่คนรุ่นใหม่อาจไม่เคยเปิดดูเลย',
      '',
      'สิ่งที่เคยสำคัญวันหนึ่ง...',
      'กลายเป็นแค่โพสต์ที่จมในฟีด หาไม่เจอเมื่อเวลาผ่านไป',
      'หรือหายไปพร้อมกับบัญชี แอป หรือเครื่องที่เปลี่ยน',
    ],
    whyP1LinesDesktop: [
      'วันนี้เราเก็บความทรงจำกระจายอยู่ทุกที่ รูปใน Instagram, คลิปสั้นใน TikTok',
      'วิดีโอใน YouTube, โพสต์ใน X, ข้อความใน LINE',
      'หรือแม้แต่ Facebook ที่คนรุ่นใหม่อาจไม่เคยเปิดดูเลย',
      '',
      'สิ่งที่เคยสำคัญวันหนึ่ง...กลายเป็นแค่โพสต์ที่จมในฟีด',
      'หาไม่เจอเมื่อเวลาผ่านไป หรือหายไปพร้อมกับบัญชี แอป หรือเครื่องที่เปลี่ยน',
    ],
    whyP1SupplementLines: [
      'โซเชียลมีไว้แชร์ช่วงเวลา',
      'แต่ความทรงจำที่สำคัญ ควรมีที่อยู่ที่เราเลือกเอง',
      'และอยู่ได้นานกว่าฟีดหนึ่งวัน',
    ],
    whyP2Lines: [
      'FOREVER เกิดขึ้นเพื่อให้ทุกคนมี “บ้านดิจิทัล” ของความทรงจำ',
      'ลิงก์เดียวที่ครอบครัว เพื่อน หรือคนรักเปิดดูได้ทุกที่ ทุกเวลา',
      'ไม่มีโฆษณา ไม่มีฟีดรบกวน คุณเลือกว่าจะเปิดเผยอะไร',
      'ใครเขียนข้อความได้ และรูปไหนควรอยู่ตรงนี้',
    ],
    whyP3Lines: [
      'คุณจัดการทุกอย่างเอง อัปโหลดรูป เขียนเรื่องราว',
      'อนุมัติข้อความจากคนรอบข้าง พิมพ์ QR Code',
      'ติดไว้ในสมุดครอบครัว หรือแชร์ลิงก์ในงานพิธี',
      'ความทรงจำไม่ได้มีวันหมดอายุ และ FOREVER ออกแบบมา',
      'ให้เป็นที่เก็บถาวร ไม่ใช่โพสต์ชั่วคราว',
    ],
    whyP3LinesDesktop: [
      'คุณจัดการทุกอย่างเอง อัปโหลดรูป เขียนเรื่องราว อนุมัติข้อความจากคนรอบข้าง',
      'พิมพ์ QR Code ติดไว้ในสมุดครอบครัว หรือแชร์ลิงก์ในงานพิธี',
      'ความทรงจำไม่ได้มีวันหมดอายุ และ FOREVER ออกแบบมา',
      'ให้เป็นที่เก็บถาวร ไม่ใช่โพสต์ชั่วคราว',
    ],
    categoriesTitle: 'ทุกเรื่องราวสำคัญ มีรูปแบบของตัวเอง',
    categoriesDescLines: [
      'FOREVER รองรับหลายบริบท',
      'แต่ละหัวข้อมีฟีเจอร์ที่เหมาะกับเรื่องนั้นโดยเฉพาะ',
    ],
    pricingTitle: 'แผนสมาชิกรายปี',
    priceAmount: '฿2,000',
    pricePeriod: '/ ปี',
    storage: 'พื้นที่ 1 GB',
    allFeatures: 'ครบทุกฟีเจอร์',
    permanentQr: 'QR Code ถาวรสำหรับพิมพ์',
    readyTitleLine1: 'พร้อมให้ความทรงจำของคุณ...',
    readyTitleLine2: 'มีที่อยู่ของตัวเองหรือยัง',
  },
  en: {
    heroTitleLine1: 'Timeless digital',
    heroTitleLine2: 'memories',
    heroDescLines: [
      'FOREVER is your private online space for stories,',
      'photos, and tributes',
      'a digital home you build for the people you love, and those who come after.',
    ],
    heroDescLinesDesktop: [
      'FOREVER is your private online space for stories, photos, and tributes',
      'a digital home you build for the people you love, and those who come after.',
    ],
    startCta: 'Start your space',
    startCtaShort: 'Start',
    exploreExamples: 'See live examples',
    exploreExamplesShort: 'Examples',
    whyTitleLine1: 'Because memories...',
    whyTitleLine2: 'should not fade with time',
    whyP1Lines: [
      'Today our memories scatter everywhere',
      'photos on Instagram, short clips on TikTok, videos on YouTube',
      'posts on X, messages in LINE',
      'or even Facebook that younger generations may never open.',
      '',
      'What mattered once...',
      'becomes just another post lost in the feed, impossible to find years later',
      'or gone with an account, an app, or a new phone.',
    ],
    whyP1LinesDesktop: [
      'Today our memories scatter everywhere, photos on Instagram, short clips on TikTok',
      'videos on YouTube, posts on X, messages in LINE',
      'or even Facebook that younger generations may never open.',
      '',
      'What mattered once... becomes just another post lost in the feed',
      'impossible to find years later, or gone with an account, an app, or a new phone.',
    ],
    whyP1SupplementLines: [
      'Social media is for sharing the moment',
      'but memories that matter deserve a place you choose yourself',
      'one that lasts longer than a single day’s feed.',
    ],
    whyP2Lines: [
      'FOREVER gives every story a digital home',
      'one respectful link your family, friends, or loved ones can open anytime, anywhere',
      'no ads, no noisy feeds, you decide what to share',
      'who can write messages, and which photos belong here.',
    ],
    whyP3Lines: [
      'You stay in full control, upload photos, write stories',
      'approve messages from others, print a QR code',
      'stick it in the family album, or share a link at a ceremony',
      'memories do not expire, and FOREVER is designed',
      'to be a lasting archive, not a fleeting post.',
    ],
    whyP3LinesDesktop: [
      'You stay in full control, upload photos, write stories, approve messages from others',
      'print a QR code, stick it in the family album, or share a link at a ceremony',
      'memories do not expire, and FOREVER is designed',
      'to be a lasting archive, not a fleeting post.',
    ],
    categoriesTitle: 'Every important story has its own shape',
    categoriesDescLines: [
      'FOREVER supports many contexts',
      'each category has features tailored to that kind of story.',
    ],
    pricingTitle: 'Annual membership',
    priceAmount: '฿2,000',
    pricePeriod: '/ year',
    storage: '1 GB storage',
    allFeatures: 'All features included',
    permanentQr: 'Permanent QR for printing',
    readyTitleLine1: 'Ready to give your memories',
    readyTitleLine2: 'a home of their own?',
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
      <AuroraBackground className="h-auto min-h-[42vh] py-14 md:py-20 bg-[#F5F5F7]" showRadialGradient>
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 w-full">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-5 md:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.03em] text-[#1D1D1F] text-balance flex flex-col items-center gap-3 sm:gap-4 md:gap-5">
              <span className="block leading-none">{t.heroTitleLine1}</span>
              <span className="block leading-none">{t.heroTitleLine2}</span>
            </h1>
            <LineBreakText lines={t.heroDescLines} className={`${bodyText} max-w-2xl text-pretty md:hidden`} />
            <LineBreakText lines={t.heroDescLinesDesktop} className={`${bodyText} max-w-2xl text-pretty hidden md:block`} />
          </div>
        </div>
      </AuroraBackground>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-[720px] mx-auto px-6 space-y-6 md:space-y-7 text-center">
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-[#1D1D1F] leading-snug flex flex-col items-center gap-1 md:gap-2">
            <span className="block">{t.whyTitleLine1}</span>
            <span className="block">{t.whyTitleLine2}</span>
          </h2>
          <LineBreakText lines={t.whyP1Lines} className={`${bodyText} md:hidden`} />
          <LineBreakText lines={t.whyP1LinesDesktop} className={`${bodyText} hidden md:block`} />
          <LineBreakText lines={t.whyP1SupplementLines} className={bodyTextEmphasis} />
          <LineBreakText lines={t.whyP2Lines} className={bodyText} />
          <LineBreakText lines={t.whyP3Lines} className={`${bodyText} md:hidden`} />
          <LineBreakText lines={t.whyP3LinesDesktop} className={`${bodyText} hidden md:block`} />
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

          <ul className="space-y-3 sm:space-y-4 text-left list-none">
            {MARKETING_CATEGORIES.map((category) => {
              const copy = isEn ? category.en : category.th;
              return (
                <li key={category.slug}>
                  <Link
                    href={`/${category.slug}`}
                    className="flex items-start gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E8E8ED] hover:border-[#0071e3]/25 hover:bg-[#F5F5F7] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all group"
                  >
                    <div className="shrink-0 w-[144px] sm:w-[160px] aspect-[4/3] rounded-xl overflow-hidden bg-white border border-[#E8E8ED]">
                      <img
                        src={category.image}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-sm sm:text-base font-semibold text-[#1D1D1F] group-hover:text-[#0071e3] transition-colors leading-snug">
                        {copy.title}
                      </p>
                      <p className="mt-1 text-sm text-[#86868B] font-medium leading-relaxed">
                        {copy.tagline}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="max-w-2xl mx-auto bg-white rounded-[28px] md:rounded-[32px] p-8 md:p-12 text-center shadow-[0_1px_2px_rgba(0,0,0,0.03),0_16px_48px_rgba(0,0,0,0.08)]">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
              {t.pricingTitle}
            </h2>
            <p className="text-4xl md:text-5xl font-bold tracking-tight leading-none mt-4">
              {t.priceAmount}
              <span className="text-base md:text-xl font-medium text-[#6E6E73] ml-1">{t.pricePeriod}</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-8 border-t border-[#E8E8ED] mt-8">
              {[
                { icon: Cloud, label: t.storage },
                { icon: Sparkles, label: t.allFeatures },
                { icon: QrCode, label: t.permanentQr },
              ].map((item) => (
                <div key={item.label} className="flex sm:flex-col items-center sm:justify-center gap-2 text-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F5F7] shrink-0">
                    <item.icon className="w-4 h-4 text-[#0071e3]" />
                  </div>
                  <span className="text-sm font-medium text-[#6E6E73] sm:whitespace-nowrap">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-xl mx-auto space-y-6 pt-14 md:pt-16 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight text-balance">
              {t.readyTitleLine1}
              <br />
              {t.readyTitleLine2}
            </h2>
            <HomeCtaButtons
              startCta={t.startCta}
              startCtaShort={t.startCtaShort}
              exploreExamples={t.exploreExamples}
              exploreExamplesShort={t.exploreExamplesShort}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
