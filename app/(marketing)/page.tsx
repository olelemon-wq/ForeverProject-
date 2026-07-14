'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  UserPlus, 
  GitBranch, 
  BookOpen, 
  ChevronRight,
  Mail,
  Gift,
  HeartHandshake,
  Cloud,
  QrCode,
} from 'lucide-react';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { AuroraBackground } from '@/components/ui/aurora-background';

const TRANSLATIONS = {
  th: {
    heroTitle: "สลักความทรงจำไว้\u200Bชั่วนิรันดร์",
    heroDesc: "สร้างพื้นที่ออนไลน์\u200Bอันทรงคุณค่า\u200Bเพื่อรำลึก\u200Bและเก็บบันทึก\u200Bประวัติศาสตร์ชีวิต\u200B ความรัก\u200B และเรื่องราว\u200Bแสนวิเศษ\u200Bที่จะอยู่\u200Bเป็นความทรงจำ\u200Bตลอดกาล",
    startMemorial: "เริ่มต้นสร้างพื้นที่รำลึก",
    exploreExamples: "สำรวจหน้าตัวอย่าง",
    
    memorialTitle: "อนุสรณ์บุคคลทั่วไป (Memorial)",
    memorialDesc: "พื้นที่อันเปี่ยมด้วยเกียรติและความสง่างามเพื่อแสดงความเคารพรักแด่คนที่คุณคิดถึง รวบรวมชีวประวัติ เรื่องราว ภาพถ่าย และคำไว้อาลัยอย่างไร้โฆษณา รบกวนจิตใจ ในพื้นที่ของพวกเราตลอดกาล",
    timelineBio: "ลำดับเหตุการณ์ชีวิตและชีวประวัติอันทรงเกียรติ",
    collaborativeAlbums: "อัลบั้มภาพถ่ายแห่งความทรงจำร่วมกัน",
    createMemorialBtn: "สร้างเว็บรำลึกบุคคล",

    coupleTitle: "คู่รัก (Couple)",
    coupleDesc: "สมุดบันทึกดิจิทัลส่วนตัวสำหรับคู่รัก เก็บรวบรวมทุกหมุดหมายสำคัญ วันครบรอบแสนพิเศษ และโมเมนต์ที่น่ารักในวันธรรมดา เพื่อร่วมเฉลองความผูกพันและการเดินทางของชีวิตคู่ในพื้นที่ปลอดภัยตลอดกาล",
    createCoupleBtn: "สร้างเว็บคู่รัก",

    weddingTitle: "งานแต่งงาน (Wedding)",
    weddingDesc: "การ์ดเชิญ กำหนดการ และความทรงจำประทับใจวันสำคัญ ครบจบในลิงก์เดียว",
    createWeddingBtn: "สร้างเว็บงานแต่ง",
    familyTitle: "มรดกวงศ์ตระกูล (Family Legacy)",
    familyDesc: "รวบรวมแผนผังครอบครัว บันทึกสูตรอาหารส่งต่อรุ่นสู่รุ่น และเก็บรักษามรดกทางความรู้ในห้องเก็บข้อมูลส่วนตัวที่ปลอดภัยสำหรับการเดินทางอันยืนยงของวงศ์ตระกูล",
    createFamilyBtn: "สร้างเว็บประวัติตระกูล",
    inviteTitle: "การ์ดเชิญ & กำหนดการ",
    inviteDesc: "การ์ดเชิญออนไลน์และแจ้งกำหนดการพิธี",
    giftTitle: "กล่องรับซอง & ของชำร่วย",
    giftDesc: "ระบบรับซองคำอวยพรและแจกไฟล์ของชำร่วย",
    rsvpTitle: "ระบบตอบรับการเข้าร่วม (RSVP)",
    rsvpDesc: "ให้แขกยืนยันการร่วมงานล่วงหน้าได้อย่างง่ายดาย",

    friendsTitle: "กลุ่มเพื่อน (Friends)",
    friendsDesc: "พื้นที่บันทึกความทรงจำการเดินทางร่วมกัน ทริปแก๊งเพื่อนซี้ เรื่องราวมิตรภาพที่เติบโตไปด้วยกัน เพื่อบันทึกรอยยิ้ม เสียงหัวเราะ และคำยินดีในทุกก้าวของชีวิตไว้เป็นของขวัญล้ำค่าของกลุ่มตลอดไป",
    createFriendsBtn: "สร้างเว็บกลุ่มเพื่อน",

    petTitle: "สัตว์เลี้ยง (Pet Memorial)",
    petDesc: "พื้นที่เก็บความทรงจำที่สวยงามและความรักอันไม่มีเงื่อนไขของเจ้าตัวน้อยผู้เป็นสมาชิกในครอบครัว เพื่อให้ทุกช่วงเวลาแสนรักและรอยยิ้มของน้องยังคงอยู่และเบ่งบานในใจเราตลอดกาล",
    createPetBtn: "สร้างเว็บสัตว์เลี้ยง",

    whatYouGet: "สิ่งที่คุณจะได้",
    guestbookTitle: "สมุดส่งความคิดถึง",
    guestbookDesc: "พื้นที่ส่งต่อความคิดถึง ให้สมาชิกในบ้านและเพื่อนๆ ได้ร่วมเขียนฝากถ้อยคำแห่งความรัก ความผูกพัน และแบ่งปันความคิดถึงที่แสนอบอุ่นส่งถึงน้องได้ตลอดเวลา",
    guestbookMockMsg1: "คิดถึงนะน้องมิว บ้านเงียบไปเลย",
    guestbookMockAuthor1: "น้องมิ้น",
    guestbookMockMsg2: "ขอบคุณที่ทำให้ทุกวันอบอุ่นเสมอ",
    guestbookMockAuthor2: "ลุงเอก",
    guestbookMockPlaceholder: "ฝากข้อความคิดถึง...",
    diaryTitle: "ไดอารี่ความสุข",
    diaryDesc: "ไดอารี่บันทึกเรื่องราวการเติบโต วีรกรรมแสนซน และบันทึกวันสำคัญที่ได้ร่วมเดินทางด้วยกัน เพื่อเก็บรวบรวมทุกๆ ความรู้สึกและความอบอุ่นไว้ให้อ่านได้ในวันข้างหน้า",
    galleryTitle: "คลังภาพเจ้าตัวน้อย",
    galleryDesc: "รวบรวมทุกภาพถ่ายใบโปรดและวิดีโอโมเมนต์สำคัญของน้อง จัดเก็บแบ่งเป็นอัลบั้มอย่างเป็นสัดส่วน เพื่อจัดแสดงความสดใสและเก็บรักษาไว้เป็นหน้าต่างเวลาที่หยิบมาดูเมื่อไหร่ก็ยิ้มได้",

    pricingTitle: "แผนสมาชิก",
    priceUnit: "฿2,000 / ปี",
    storage: "พื้นที่ 1 GB",
    allFeatures: "ครบทุกฟีเจอร์",
    permanentQr: "QR Code ถาวรสำหรับพิมพ์",
    pricingBtn: "เริ่มสร้างเลย",

    readyTitle: "พร้อมเก็บความทรงจำของคุณหรือยัง",
    readyBtn: "สร้างเว็บไซต์ของคุณ"
  },
  en: {
    heroTitle: "Timeless digital legacies.",
    heroDesc: "Create beautiful, enduring spaces to celebrate lives lived, love shared, and stories that deserve to be remembered forever.",
    startMemorial: "Start a Memorial",
    exploreExamples: "Explore Examples",

    memorialTitle: "Individual Memorials",
    memorialDesc: "A dignified, beautifully designed space to honor a loved one. Collect stories, photos, and tributes in an ad-free, respectful environment that lasts generations.",
    timelineBio: "Elegant timelines & biographies",
    collaborativeAlbums: "Collaborative photo albums",
    createMemorialBtn: "Create Memorial",

    coupleTitle: "Couple",
    coupleDesc: "Your private digital journal to celebrate milestones, anniversaries, and the warmth of everyday moments, preserving your shared growth and narrative forever.",
    createCoupleBtn: "Create Couple Site",

    weddingTitle: "Wedding",
    weddingDesc: "Digital invitations, schedules, and wedding memories, all in a single link.",
    createWeddingBtn: "Create Wedding Site",
    inviteTitle: "Invitations & Schedules",
    inviteDesc: "Online invitation card and ceremony schedule notifier.",
    giftTitle: "Digital Envelope & Gifts",
    giftDesc: "Accept warm blessings and distribute digital guest return-gifts.",
    rsvpTitle: "RSVP Response System",
    rsvpDesc: "Let guests confirm their attendance easily in advance.",
    familyTitle: "Family Legacy",
    familyDesc: "Map your ancestry, preserve family recipes, and pass down wisdom. A private, secure vault for your family's enduring narrative.",
    createFamilyBtn: "Create Family Site",

    friendsTitle: "Friends",
    friendsDesc: "A dedicated space to preserve shared journeys, road trips, and the story of a lifetime friendship, keeping the laughter and warm memories alive as a timeless treasure for your circle.",
    createFriendsBtn: "Create Friends Site",

    petTitle: "Pet Memorial",
    petDesc: "A dedicated sanctuary to preserve the beautiful memories and unconditional love of your beloved pets, keeping their smiles blooming in our hearts forever.",
    createPetBtn: "Create Pet Site",

    whatYouGet: "What You Will Get",
    guestbookTitle: "Condolence Guestbook",
    guestbookDesc: "A warm space for family and friends to write tributes, memories, and share words of love for your beloved pet anytime.",
    guestbookMockMsg1: "Miss you, Mew. The house feels so quiet.",
    guestbookMockAuthor1: "Min",
    guestbookMockMsg2: "Thank you for making every day warmer.",
    guestbookMockAuthor2: "Uncle Ek",
    guestbookMockPlaceholder: "Leave a message...",
    diaryTitle: "Happiness Diary",
    diaryDesc: "A diary to record sweet memories, adventures, and milestones together, preserving the warmth for years to come.",
    galleryTitle: "Pet Gallery",
    galleryDesc: "Organize favorite photos and videos into beautiful albums, keeping their playful spirits and brightest moments alive.",

    pricingTitle: "Subscription Plan",
    priceUnit: "฿2,000 / Year",
    storage: "1 GB Cloud Storage",
    allFeatures: "All Features Included",
    permanentQr: "Permanent QR Code for Printing",
    pricingBtn: "Get Started Now",

    readyTitle: "Ready to keep your memories?",
    readyBtn: "Create Your Website"
  }
};

export default function MarketingHome() {
  const { lang } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = mounted && lang === 'en' ? TRANSLATIONS.en : TRANSLATIONS.th;

  return (
    <main className="marketing-light-surface bg-[#F5F5F7] text-[#1D1D1F] antialiased selection:bg-[#0071e3] selection:text-[#FFFFFF] min-h-screen [color-scheme:light]">
      
      {/* HERO SECTION */}
      <AuroraBackground
        className="h-auto min-h-[70vh] py-20 md:py-32 bg-[#F5F5F7]"
        showRadialGradient
      >
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 w-full">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-[36px] md:text-[80px] font-bold tracking-tight text-[#1D1D1F] leading-[1.05] font-sans">
              {mounted && lang === 'en' ? (
                t.heroTitle
              ) : (
                <>
                  สลักความทรงจำไว้
                  <br className="block sm:hidden" />
                  ชั่วนิรันดร์
                </>
              )}
            </h1>
            <p className="text-[17px] md:text-[24px] text-[#86868B] max-w-2xl font-medium leading-snug">
              {t.heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link 
                href="/login?category=Memorial" 
                className="inline-flex items-center justify-center bg-[#0071e3] text-[#FFFFFF] font-medium text-[17px] px-8 py-3 rounded-full hover:bg-[#0071e3]/90 transition-all active:scale-[0.98]"
              >
                {t.startMemorial}
              </Link>
              <Link 
                href="/kittiemeaw" 
                className="inline-flex items-center justify-center bg-transparent text-[#0071e3] font-medium text-[17px] px-8 py-3 rounded-full hover:underline transition-all flex items-center gap-1"
              >
                {t.exploreExamples} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </AuroraBackground>

      {/* MEMORIAL SECTION */}
      <section id="memorial" className="py-5 md:py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-stretch gap-6 md:gap-12 bg-[#FFFFFF] rounded-[22px] md:rounded-[28px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden p-6 md:p-12 lg:p-16">
            <div className="w-full md:w-1/2 order-2 md:order-1 relative rounded-3xl overflow-hidden aspect-[16/10] md:aspect-auto bg-[#F5F5F7]">
              <img 
                className="w-full h-full object-cover md:absolute md:inset-0" 
                alt="Premium lifestyle photography for a memorial service website" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpnY3Uwxk0XiEohL9UGRkc8Hc9BwOPmZ242HyhpqVqu3t52QxxmSxKuQc8FNiFclznZvPBCIV4Hxrlyt13LDNgaMd9PrfyDYKXN8LLHZpkvcVIb5xtAfXZCfPKYVidBSTtaVkZ9X-sq-6ZXQWxXEn6ScaiRB58xRknLM1zQZTYyIac-UA48-I99R2hxNNm5WWWWQZ9ekLTZwFJy9RVNdoDIyPyrVFcab0mp4SKC1NgdBnxJGs4X3k"
              />
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2 space-y-4 md:space-y-6 text-left">
              <h2 className="text-[32px] md:text-[48px] tracking-tight text-[#1D1D1F] font-semibold leading-tight">{t.memorialTitle}</h2>
              <p className="text-[17px] md:text-[19px] text-[#86868B] font-medium">
                {t.memorialDesc}
              </p>
              <ul className="space-y-3 md:space-y-4 pt-2 md:pt-4">
                <li className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#1D1D1F] shrink-0" />
                  <span className="text-[17px] text-[#1D1D1F] font-medium">{t.timelineBio}</span>
                </li>
                <li className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5 text-[#1D1D1F] shrink-0" />
                  <span className="text-[17px] text-[#1D1D1F] font-medium">{t.collaborativeAlbums}</span>
                </li>
              </ul>
              <div className="pt-4 md:pt-6">
                <Link 
                  href="/login?category=Memorial" 
                  className="inline-flex items-center justify-center bg-[#0071e3] text-[#FFFFFF] font-medium text-[15px] px-8 py-2.5 rounded-full hover:bg-[#0071e3]/90 transition-colors"
                >
                  {t.createMemorialBtn}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COUPLE SECTION */}
      <section id="couple" className="py-5 md:py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="rounded-[22px] md:rounded-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
          <div className="relative w-full rounded-[22px] md:rounded-[32px] overflow-hidden bg-[#FFFFFF] flex flex-col md:flex-row items-stretch min-h-0 md:min-h-[480px]">
            <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-20 flex flex-col justify-center z-10 bg-[#FFFFFF] text-left">
              <h2 className="text-[32px] md:text-[48px] tracking-tight text-[#1D1D1F] font-semibold mb-4 leading-tight">
                {t.coupleTitle}
              </h2>
              <p className="text-[17px] md:text-[21px] text-[#86868B] font-medium mb-5 md:mb-8 max-w-md">
                {t.coupleDesc}
              </p>
              <div>
                <Link 
                  href="/login?category=Couple" 
                  className="inline-flex items-center justify-center bg-[#0071e3] text-[#FFFFFF] font-medium text-[15px] px-8 py-2.5 rounded-full hover:bg-[#0071e3]/90 transition-colors"
                >
                  {t.createCoupleBtn}
                </Link>
              </div>
            </div>
            <div className="relative md:absolute md:inset-0 md:left-1/2 w-full md:w-1/2 h-[220px] md:h-full">
              <img 
                alt="A beautiful, high-end editorial photo of a couple" 
                className="w-full h-full object-cover object-center absolute inset-0" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4sFtiQx4Dpew3HfPkRhGl6Zst2ZmqJ9H6gUoYOCM92DkS31dUFPofTEXqFMhRURonfspY9nve80gTgXL49Fma9YCCnAxXqQnqwcWuzEuPi1SegvQ_-Pk-x6Gfivy_0H6TS6H4JSMPVttqFaMYP_DV9RhcUZlFsWAh-xo_ReMD_9iJdpTT5qB_U3J_NeVzI3lSufok1NLoKsTcD76c-GQKanaa20zLsrjKcSj-JAYdnH4EOhdXurE"
              />
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* WEDDING SECTION */}
      <section id="wedding" className="py-5 md:py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="overflow-hidden rounded-[22px] md:rounded-[32px] bg-[#FFFFFF] shadow-[0_4px_24px_rgba(0,0,0,0.08)] flex flex-col lg:flex-row lg:items-stretch">
            <div className="flex w-full flex-col justify-center p-6 md:p-10 lg:w-1/2 lg:p-14 text-left space-y-4 md:space-y-6">
              <h2 className="text-[32px] md:text-[48px] tracking-tight font-semibold leading-tight text-[#1D1D1F]">
                {t.weddingTitle}
              </h2>
              <p className="max-w-md text-[17px] md:text-[19px] text-[#86868B] font-medium leading-relaxed">
                {t.weddingDesc}
              </p>

              <ul className="space-y-3 md:space-y-4 pt-2 md:pt-4">
                {[
                  { icon: Mail, label: t.inviteTitle },
                  { icon: Gift, label: t.giftTitle },
                  { icon: HeartHandshake, label: t.rsvpTitle },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-[#0071e3] shrink-0" />
                    <span className="text-[17px] text-[#1D1D1F] font-medium">{item.label}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 md:pt-6">
                <Link
                  href="/login?category=Wedding"
                  className="inline-flex items-center justify-center bg-[#0071e3] text-[#FFFFFF] font-medium text-[15px] px-8 py-2.5 rounded-full hover:bg-[#0071e3]/90 transition-colors"
                >
                  {t.createWeddingBtn}
                </Link>
              </div>
            </div>

            <div className="grid w-full grid-cols-3 gap-2.5 p-4 sm:gap-3 sm:p-5 md:p-6 lg:w-1/2 lg:gap-3 lg:p-5 lg:pl-2">
              {[
                {
                  src: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
                  alt: 'คู่บ่าวสาวในวันแต่งงาน',
                },
                {
                  src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
                  alt: 'บรรยากาศพิธีแต่งงานกลางแจ้ง',
                },
                {
                  src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
                  alt: 'แหวนแต่งงานบนดอกไม้',
                },
              ].map((photo) => (
                <div
                  key={photo.src}
                  className="relative aspect-[3/4] overflow-hidden rounded-2xl md:rounded-[1.25rem] bg-[#F5F5F7] lg:aspect-auto lg:min-h-[320px]"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAMILY LEGACY SECTION */}
      <section id="family-legacy" className="py-5 md:py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="rounded-[22px] md:rounded-[32px] bg-[#E8F1FB] p-6 sm:p-8 md:p-10 lg:p-12">
            <h2 className="text-center text-[32px] md:text-[48px] tracking-tight text-[#1D1D1F] font-semibold leading-tight">
              {mounted && lang === 'en' ? (
                t.familyTitle
              ) : (
                <>
                  มรดกวงศ์ตระกูล
                  <br className="sm:hidden" />
                  <span className="hidden sm:inline"> </span>
                  (Family Legacy)
                </>
              )}
            </h2>

            <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-[1fr_1.35fr_1fr] gap-4 md:gap-5 items-stretch">
              {/* Description */}
              <div className="bg-[#FFFFFF] rounded-[22px] md:rounded-[28px] p-6 md:p-8 flex flex-col justify-center text-left shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <p className="text-[17px] md:text-[19px] text-[#86868B] font-medium leading-relaxed">
                  {t.familyDesc}
                </p>
              </div>

              {/* Image + mobile CTA */}
              <div className="relative min-h-[280px] md:min-h-[360px] rounded-[22px] md:rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <img
                  className="absolute inset-0 h-full w-full object-cover"
                  alt="A multi-generational family"
                  src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80"
                />
                <div className="absolute inset-x-0 bottom-0 flex justify-start bg-gradient-to-t from-black/50 to-transparent p-5 pt-16 md:hidden">
                  <Link
                    href="/login?category=Family Legacy"
                    className="inline-flex items-center justify-center bg-[#0071e3] text-[#FFFFFF] font-medium text-[15px] px-8 py-2.5 rounded-full hover:bg-[#0071e3]/90 transition-colors"
                  >
                    {t.createFamilyBtn}
                  </Link>
                </div>
              </div>

              {/* Feature icons + desktop CTA */}
              <div className="bg-[#FFFFFF] rounded-[22px] md:rounded-[28px] p-6 md:p-8 flex flex-col justify-center gap-5 md:gap-6 text-left shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-3">
                  <GitBranch className="w-6 h-6 text-[#0071e3] shrink-0" />
                  <h3 className="font-semibold text-[17px] md:text-[19px] text-[#1D1D1F] tracking-tight">
                    Interactive Family Trees
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-[#0071e3] shrink-0" />
                  <h3 className="font-semibold text-[17px] md:text-[19px] text-[#1D1D1F] tracking-tight">
                    Heirloom Recipes
                  </h3>
                </div>
                <div className="hidden md:block pt-2">
                  <Link
                    href="/login?category=Family Legacy"
                    className="inline-flex items-center justify-center bg-[#0071e3] text-[#FFFFFF] font-medium text-[15px] px-8 py-2.5 rounded-full hover:bg-[#0071e3]/90 transition-colors"
                  >
                    {t.createFamilyBtn}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FRIENDS SECTION */}
      <section id="friends" className="py-5 md:py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="rounded-[22px] md:rounded-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
          <div className="relative w-full rounded-[22px] md:rounded-[32px] overflow-hidden bg-[#FFFFFF] flex flex-col md:flex-row items-stretch min-h-0 md:min-h-[480px]">
            <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-20 flex flex-col justify-center z-10 bg-[#FFFFFF] text-left">
              <h2 className="text-[32px] md:text-[48px] tracking-tight text-[#1D1D1F] font-semibold mb-4 leading-tight">
                {t.friendsTitle}
              </h2>
              <p className="text-[17px] md:text-[21px] text-[#86868B] font-medium mb-5 md:mb-8 max-w-md">
                {t.friendsDesc}
              </p>
              <div>
                <Link 
                  href="/login?category=Friends" 
                  className="inline-flex items-center justify-center bg-[#0071e3] text-[#FFFFFF] font-medium text-[15px] px-8 py-2.5 rounded-full hover:bg-[#0071e3]/90 transition-colors"
                >
                  {t.createFriendsBtn}
                </Link>
              </div>
            </div>
            <div className="relative md:absolute md:inset-0 md:left-1/2 w-full md:w-1/2 h-[220px] md:h-full">
              <img 
                alt="Friends laughing together" 
                className="w-full h-full object-cover object-center absolute inset-0" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwyOR5_KWg2H8t5M27y7ySRwuTQLc_opZIs4G6hJ69Lp1TOYjD1c-SBJCvO3k_Li3Sh2vmqr5aEF5c1tjz-dLLDUpKTuCqBOCvKqm5us1jjVLDtC6o7tYUAl7uubQxSrFtl_Rb3Y0zOVXuzbn8xHURQFIvOJj-Q3zY039j6OO2l2uxbghYq85gz_1tMYbi0C2B9VvyqfmHCvS3s8TbghrmN56HBqbVYBxoyAWzwBWt5i2zZUVP_gI"
              />
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* PET MEMORIAL SECTION */}
      <section id="pet-memorial" className="py-5 md:py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Intro */}
            <div className="lg:col-span-4 flex flex-col justify-center text-left space-y-4 md:space-y-5">
              <h2 className="text-[32px] md:text-[48px] tracking-tight font-semibold leading-tight text-[#1D1D1F]">
                {mounted && lang === 'en' ? (
                  t.petTitle
                ) : (
                  <>
                    สัตว์เลี้ยง
                    <br className="hidden md:block" />
                    <span className="md:hidden"> </span>
                    (Pet Memorial)
                  </>
                )}
              </h2>
              <p className="text-[17px] md:text-[19px] text-[#86868B] font-medium leading-relaxed max-w-md">
                {t.petDesc}
              </p>
            </div>

            {/* Feature cards: guestbook | blue gallery | diary */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
              {/* 1 — Guestbook + dog with owner */}
              <div className="bg-[#FFFFFF] rounded-[22px] md:rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] flex flex-col h-full group">
                <div className="relative aspect-[2/1] md:aspect-[4/3] overflow-hidden bg-[#F5F5F7]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz2pGinLl6I0W9a40FYq3VtO-LvGKt-wrsWP_rd5npjmAAv8lM6I3FkjcSmiUiTppfWjtKLgXA6xfRK5Ghic1_WAXr-NDt-Fbvtvm_Lm2E62Lq16BHKP_TyM52OBktxG0kgtPDSqH1dwPQGDxPlvDGvK4PNFrFw-WJ9XhKwcNKwX9VMlJvDhqJLJ0XYYI7JratIH2v5foXRPHMOzVX8b4bGHXXQLDuNeRB2N70DyEfMaN24kptZCs"
                    alt={t.guestbookTitle}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 md:p-6 flex flex-col flex-grow text-left">
                  <h3 className="font-semibold text-[28px] md:text-[21px] mb-2 text-[#1D1D1F] tracking-tight leading-tight">{t.guestbookTitle}</h3>
                  <p className="font-medium text-[14px] md:text-[15px] text-[#86868B] leading-relaxed">{t.guestbookDesc}</p>
                </div>
              </div>

              {/* 3 — Gallery details on blue (center) */}
              <div className="bg-[#0071e3] rounded-[22px] md:rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] flex flex-col sm:h-full">
                <div className="p-5 md:p-6 flex flex-col sm:flex-grow text-left text-white">
                  <h3 className="font-semibold text-[28px] md:text-[32px] mb-2 tracking-tight leading-tight">{t.galleryTitle}</h3>
                  <p className="font-medium text-[14px] md:text-[15px] text-white/85 leading-relaxed sm:flex-grow">{t.galleryDesc}</p>
                  <div className="mt-4 sm:mt-6 flex justify-start md:justify-center">
                    <Link
                      href="/login?category=Pet Memorial"
                      className="inline-flex items-center justify-center bg-[#E8F1FB] text-[#0071e3] font-medium text-[15px] px-8 py-2.5 rounded-full hover:bg-[#d6e8fa] transition-colors"
                    >
                      {t.createPetBtn}
                    </Link>
                  </div>
                </div>
              </div>

              {/* 2 — Diary + gallery polaroids image */}
              <div className="bg-[#FFFFFF] rounded-[22px] md:rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] flex flex-col h-full group">
                <div className="relative aspect-[2/1] md:aspect-[4/3] overflow-hidden bg-[#F5F5F7]">
                  <img
                    src="/images/pet-polaroids.jpg"
                    alt={t.diaryTitle}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 md:p-6 flex flex-col flex-grow text-left">
                  <h3 className="font-semibold text-[28px] md:text-[21px] mb-2 text-[#1D1D1F] tracking-tight leading-tight">{t.diaryTitle}</h3>
                  <p className="font-medium text-[14px] md:text-[15px] text-[#86868B] leading-relaxed">{t.diaryDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING + CTA */}
      <section className="py-12 md:py-20 text-center">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="space-y-6 md:space-y-8">
            <p className="text-[14px] text-[#86868B] font-medium uppercase tracking-widest">{t.pricingTitle}</p>
            <h2 className="text-[36px] md:text-[80px] tracking-tight text-[#1D1D1F] font-bold">{t.priceUnit}</h2>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto pt-2 md:pt-4">
              {[
                { icon: Cloud, label: t.storage },
                { icon: Sparkles, label: t.allFeatures },
                { icon: QrCode, label: t.permanentQr },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 sm:gap-3 text-center"
                >
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#0071e3] shrink-0" />
                  <span className="text-[13px] sm:text-[17px] text-[#1D1D1F] font-medium leading-snug">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="max-w-3xl mx-auto space-y-5 md:space-y-8 pt-4 md:pt-6">
              <h2 className="text-[32px] md:text-[48px] tracking-tight text-[#1D1D1F] font-semibold leading-tight">
                {mounted && lang === 'en' ? (
                  t.readyTitle
                ) : (
                  <>
                    พร้อมเก็บความทรงจำ{' '}
                    <br className="sm:hidden" />
                    ของคุณหรือยัง
                  </>
                )}
              </h2>
              <Link
                href="/login?category=Memorial"
                className="inline-flex items-center justify-center bg-[#0071e3] text-[#FFFFFF] font-medium text-[17px] px-8 py-3 rounded-full hover:bg-[#0071e3]/90 transition-colors"
              >
                {t.readyBtn}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#FFFFFF] border-t border-[#bfc9c3]/20 py-12 text-xs">
        <div className="max-w-[1280px] mx-auto px-6 text-left">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 border-b border-[#bfc9c3]/20 pb-12">
            <div className="space-y-3">
              <h4 className="font-semibold text-[#1D1D1F]">ผลิตภัณฑ์</h4>
              <ul className="space-y-2">
                <li><a className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="#features">ฟีเจอร์</a></li>
                <li><Link className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="/kittiemeaw">ตัวอย่าง</Link></li>
                <li><Link className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="/pricing">ราคา</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-[#1D1D1F]">ประเภท</h4>
              <ul className="space-y-2">
                <li><Link className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="/login">อนุสรณ์บุคคล</Link></li>
                <li><Link className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="/login">งานแต่งงาน</Link></li>
                <li><Link className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="/login">สัตว์เลี้ยง</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-[#1D1D1F]">บริษัท</h4>
              <ul className="space-y-2">
                <li><a className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="#">เกี่ยวกับเรา</a></li>
                <li><a className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="#">ติดต่อ</a></li>
                <li><a className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="#">ร่วมงานกับเรา</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-[#1D1D1F]">ช่วยเหลือ</h4>
              <ul className="space-y-2">
                <li><a className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="#">ศูนย์ช่วยเหลือ</a></li>
                <li><a className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="#">คำถามที่พบบ่อย</a></li>
                <li><a className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href="#">ความปลอดภัย</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[#86868B]">
            <p>© 2026 FOREVER. All rights reserved.</p>
            <div className="flex gap-4">
              <a className="hover:text-[#1D1D1F] transition-colors" href="#">Privacy Policy</a>
              <span className="hidden md:inline">|</span>
              <a className="hover:text-[#1D1D1F] transition-colors" href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
