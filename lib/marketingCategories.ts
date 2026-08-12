import type { LucideIcon } from 'lucide-react';
import {
  Flame,
  GitBranch,
  Heart,
  HeartHandshake,
  PawPrint,
  Users,
} from 'lucide-react';
import type { CategoryKey } from '@/lib/categories';

export type MarketingCategorySlug =
  | 'memorial'
  | 'family-story'
  | 'couple'
  | 'wedding'
  | 'friends'
  | 'pet-memorial';

export interface MarketingCategory {
  slug: MarketingCategorySlug;
  createCategory: CategoryKey;
  icon: LucideIcon;
  image: string;
  accent: string;
  th: {
    title: string;
    tagline: string;
    cardDesc: string;
    pageIntro: string;
  };
  en: {
    title: string;
    tagline: string;
    cardDesc: string;
    pageIntro: string;
  };
}

export const MARKETING_CATEGORIES: MarketingCategory[] = [
  {
    slug: 'memorial',
    createCategory: 'Memorial',
    icon: Flame,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDpnY3Uwxk0XiEohL9UGRkc8Hc9BwOPmZ242HyhpqVqu3t52QxxmSxKuQc8FNiFclznZvPBCIV4Hxrlyt13LDNgaMd9PrfyDYKXN8LLHZpkvcVIb5xtAfXZCfPKYVidBSTtaVkZ9X-sq-6ZXQWxXEn6ScaiRB58xRknLM1zQZTYyIac-UA48-I99R2hxNNm5WWWWQZ9ekLTZwFJy9RVNdoDIyPyrVFcab0mp4SKC1NgdBnxJGs4X3k',
    accent: '#5c6b52',
    th: {
      title: 'อนุสรณ์บุคคล',
      tagline: 'รำลึกผู้ล่วงลับด้วยชีวประวัติ สมุดไว้อาลัย และคลังภาพ',
      cardDesc: 'พื้นที่เกียรติสำหรับคนที่คุณคิดถึง — รวมเรื่องราว ภาพถ่าย และคำไว้อาลัยในลิงก์เดียว',
      pageIntro:
        'เมื่อคนที่เรารักจากไป ครอบครัวต้องการพื้นที่รวมคำไว้อาลัย ชีวประวัติ และภาพความทรงจำ — ไม่ใช่แค่โพสต์ในฟีดที่จางหายไปตามกาลเวลา',
    },
    en: {
      title: 'Memorial',
      tagline: 'Honor a loved one with biography, guestbook, and galleries',
      cardDesc: 'A dignified space for the person you miss — stories, photos, and tributes in one link',
      pageIntro:
        'When someone we love is gone, families need one respectful place for condolences, life stories, and photos — not scattered social posts that fade away.',
    },
  },
  {
    slug: 'family-story',
    createCategory: 'Family Legacy',
    icon: GitBranch,
    image:
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80',
    accent: '#8ba8bd',
    th: {
      title: 'เรื่องราวครอบครัว',
      tagline: 'เก็บประวัติ ภาพถ่าย และภูมิปัญญาของครอบครัว — ส่งต่อให้ลูกหลาน',
      cardDesc: 'บ้านดิจิทัลของตระกูล — ผังเครือญาติ สูตรอาหาร ภาพเก่า และบทสัมภาษณ์ผู้ใหญ่',
      pageIntro:
        'ไม่ใช่เว็บไว้อาลัย แต่เป็นที่รวมเรื่องราวของครอบครัวหลายรุ่น — ให้ลูกหลานเปิดอ่านและสืบทอดต่อได้',
    },
    en: {
      title: 'Family Stories',
      tagline: 'Preserve your family history, photos, and wisdom for the next generation',
      cardDesc: 'Your family’s digital home — trees, recipes, old photos, and elder interviews',
      pageIntro:
        'Not a funeral site — a living archive for multiple generations to explore, contribute, and pass on.',
    },
  },
  {
    slug: 'couple',
    createCategory: 'Couple',
    icon: Heart,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA4sFtiQx4Dpew3HfPkRhGl6Zst2ZmqJ9H6gUoYOCM92DkS31dUFPofTEXqFMhRURonfspY9nve80gTgXL49Fma9YCCnAxXqQnqwcWuzEuPi1SegvQ_-Pk-x6Gfivy_0H6TS6H4JSMPVttqFaMYP_DV9RhcUZlFsWAh-xo_ReMD_9iJdpTT5qB_U3J_NeVzI3lSufok1NLoKsTcD76c-GQKanaa20zLsrjKcSj-JAYdnH4EOhdXurE',
    accent: '#c9a0a8',
    th: {
      title: 'คู่รัก',
      tagline: 'บันทึกวันสำคัญ ไดอารี่ความรัก และคลังภาพของสองคน',
      cardDesc: 'พื้นที่ส่วนตัวของคู่รัก — ไม่ใช่แค่เว็บเชิญงาน แต่เป็นบันทึกความทรงจำยาว ๆ',
      pageIntro:
        'เก็บครบรอบ ไดอารี่ และภาพความทรงจำของสองคนในที่เดียว — สำหรับความรักที่เติบโตไปด้วยกันทุกวัน',
    },
    en: {
      title: 'Couple',
      tagline: 'Milestones, love diary, and shared photo albums',
      cardDesc: 'A private space for two — a long-term memory journal, not just a wedding invite',
      pageIntro:
        'Record anniversaries, diary entries, and photos together — built for a love story that keeps growing.',
    },
  },
  {
    slug: 'wedding',
    createCategory: 'Wedding',
    icon: HeartHandshake,
    image:
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
    accent: '#96a288',
    th: {
      title: 'งานแต่งงาน',
      tagline: 'การ์ดเชิญ กำหนดการ และสมุดอวยพร — ครบจบในลิงก์เดียว',
      cardDesc: 'แชร์รายละเอียดงานแต่ง รับคำอวยพร และเก็บภาพวันมงคลสมรส',
      pageIntro:
        'แทนการ์ดกระดาษและกลุ่มไลน์ — ลิงก์เดียวสำหรับเชิญ กำหนดการ 3 ช่วง สมุดอวยพร และใส่ซองออนไลน์',
    },
    en: {
      title: 'Wedding',
      tagline: 'Invitations, schedule, and guestbook in one link',
      cardDesc: 'Share wedding details, collect wishes, and preserve the day’s memories',
      pageIntro:
        'Replace paper cards and chat groups — one link for invites, three-part schedule, guestbook, and digital envelopes.',
    },
  },
  {
    slug: 'friends',
    createCategory: 'Friends',
    icon: Users,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCwyOR5_KWg2H8t5M27y7ySRwuTQLc_opZIs4G6hJ69Lp1TOYjD1c-SBJCvO3k_Li3Sh2vmqr5aEF5c1tjz-dLLDUpKTuCqBOCvKqm5us1jjVLDtC6o7tYUAl7uubQxSrFtl_Rb3Y0zOVXuzbn8xHURQFIvOJj-Q3zY039j6OO2l2uxbghYq85gz_1tMYbi0C2B9VvyqfmHCvS3s8TbghrmN56HBqbVYBxoyAWzwBWt5i2zZUVP_gI',
    accent: '#7a8f6e',
    th: {
      title: 'กลุ่มเพื่อน',
      tagline: 'รวมความทรงจำทริป กลุ่มเพื่อน และเรื่องราวร่วมกัน',
      cardDesc: 'บ้านกลางของแก๊ง — แชร์ภาพ ข้อความ และโมเมนต์ที่ทุกคนอยากจำ',
      pageIntro:
        'ทริป รุ่น แก๊งเพื่อน — รูปและเรื่องราวไม่ควรกระจัดกระจายในหลายกลุ่มแชท',
    },
    en: {
      title: 'Friends',
      tagline: 'Trips, inside jokes, and shared memories for your circle',
      cardDesc: 'A home base for your crew — photos, messages, and moments worth keeping',
      pageIntro:
        'Road trips, reunions, lifelong friends — keep the laughter and stories in one place.',
    },
  },
  {
    slug: 'pet-memorial',
    createCategory: 'Pet Memorial',
    icon: PawPrint,
    image: '/defaults/pet-memorial/cover/3.png',
    accent: '#8b9a7d',
    th: {
      title: 'สัตว์เลี้ยง',
      tagline: 'พื้นที่รำลึกเจ้าตัวน้อยที่เป็นครอบครัว',
      cardDesc: 'เก็บรูป วิดีโอ สมุดส่งความคิดถึง และไดอารี่ความสุขของน้อง',
      pageIntro:
        'น้องสัตว์เลี้ยงเป็นสมาชิกในบ้าน — ควรมีพื้นที่เก็บความรักและความทรงจำอย่างมีเกียรติ',
    },
    en: {
      title: 'Pet Memorial',
      tagline: 'A loving space for the little family member you miss',
      cardDesc: 'Photos, videos, condolence book, and happiness diary for your pet',
      pageIntro:
        'Pets are family — they deserve a gentle place to hold love, photos, and memories.',
    },
  },
];

const SLUG_SET = new Set(MARKETING_CATEGORIES.map((c) => c.slug));

export function isMarketingCategorySlug(slug: string): slug is MarketingCategorySlug {
  return SLUG_SET.has(slug as MarketingCategorySlug);
}

export function getMarketingCategory(slug: string): MarketingCategory | undefined {
  return MARKETING_CATEGORIES.find((c) => c.slug === slug);
}
