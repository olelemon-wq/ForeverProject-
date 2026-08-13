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
        'เมื่อคนที่เรารักจากไป สิ่งที่เหลือไม่ใช่แค่ความว่างในบ้าน แต่เป็นเรื่องราว ภาพถ่าย และคำที่ยังอยากบอก ครอบครัวสมควรมีพื้นที่รวมคำไว้อาลัย ชีวประวัติ และคลังความทรงจำอย่างมีเกียรติ — ไม่ใช่โพสต์ในฟีดที่เลื่อนผ่านแล้วจางหายไปตามกาลเวลา ลิงก์เดียวที่เปิดกลับมาได้ทุกเมื่อ และส่งต่อให้ญาติมิตรมาร่วมรำลึกด้วยกัน',
    },
    en: {
      title: 'Memorial',
      tagline: 'Honor a loved one with biography, guestbook, and galleries',
      cardDesc: 'A dignified space for the person you miss — stories, photos, and tributes in one link',
      pageIntro:
        'When someone we love is gone, what remains is more than an empty chair — it is their stories, photographs, and words still left unsaid. Families deserve one respectful place for condolences, life stories, and memories — not scattered social posts that scroll away. One lasting link to revisit, and to share with everyone who wants to remember together.',
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
      cardDesc: 'บ้านดิจิทัลของครอบครัว — ผังเครือญาติ ภาพเก่า เรื่องเล่า และบันทึกจากผู้ใหญ่',
      pageIntro:
        'ไม่ใช่เว็บไว้อาลัย แต่เป็นบ้านดิจิทัลของครอบครัวหลายรุ่น — ที่รวมผังเครือญาติ ภาพเก่า เรื่องเล่า และภูมิปัญญาจากผู้ใหญ่ไว้ด้วยกัน ลูกหลานจะได้เปิดอ่าน เติมเรื่องของตัวเอง และส่งต่อความทรงจำเหล่านี้ต่อไปได้ โดยไม่ต้องพึ่งอัลบั้มกระดาษที่หาย หรือแชทที่หาไม่เจอ',
    },
    en: {
      title: 'Family Stories',
      tagline: 'Preserve your family history, photos, and wisdom for the next generation',
      cardDesc: 'Your family’s digital home — trees, recipes, old photos, and elder interviews',
      pageIntro:
        'Not a funeral site — a living digital home for multiple generations: family trees, old photos, stories, and wisdom from elders. Children and grandchildren can explore, add their own chapters, and pass it on — without relying on albums that get lost or chats that vanish.',
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
        'ความรักไม่ได้มีแค่ช่วงแต่งงาน — มันคือวันแรกที่พบกัน ครบรอบทุกปี ไดอารี่ที่เขียนถึงกัน และภาพที่เก็บไว้สองคน พื้นที่ส่วนตัวของคู่รักจึงควรเป็นบันทึกความทรงจำยาว ๆ ไม่ใช่แค่ลิงก์เชิญงานชั่วคราว รวมวันสำคัญ ไดอารี่ และคลังภาพไว้ที่เดียว ที่เติบโตไปพร้อมกับความสัมพันธ์ของเรา',
    },
    en: {
      title: 'Couple',
      tagline: 'Milestones, love diary, and shared photo albums',
      cardDesc: 'A private space for two — a long-term memory journal, not just a wedding invite',
      pageIntro:
        'Love is more than a wedding day — it is first meetings, anniversaries, diary entries, and photos only the two of you share. A couple’s space should be a long-term memory journal, not a temporary invite link: milestones, a love diary, and albums in one place that grows with your relationship.',
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
        'วันแต่งงานมีรายละเอียดมากเกินกว่าจะกระจายอยู่ในหลายกลุ่มไลน์และการ์ดกระดาษ — แขกต้องการลิงก์เดียวที่เชิญชัด ดูกำหนดการได้ และเขียนอวยพรได้ทันที คู่บ่าวสาวก็ได้พื้นที่เก็บภาพ สมุดอวยพร และร่วมใส่ซองออนไลน์ไว้ด้วยกัน ครบจบในที่เดียว แล้วเก็บเป็นความทรงจำของวันมงคลต่อได้หลังงานจบ',
    },
    en: {
      title: 'Wedding',
      tagline: 'Invitations, schedule, and guestbook in one link',
      cardDesc: 'Share wedding details, collect wishes, and preserve the day’s memories',
      pageIntro:
        'A wedding has too many details to scatter across chat groups and paper cards. Guests need one clear link for the invite, schedule, and well-wishes — while the couple keeps photos, guestbook messages, and digital envelopes together. Everything in one place, then kept as lasting memories after the day is done.',
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
        'ทริป รุ่น แก๊งเพื่อน — รูปและเรื่องตลกไม่ควรกระจัดกระจายในหลายกลุ่มแชทจนหาไม่เจอ พื้นที่กลางของพวกเราคือที่รวมภาพ ข้อความถึงกัน และโมเมนต์ที่ทุกคนอยากจำไว้ด้วยกัน นัดรวมตัว ทริปประจำปี หรือหนังสือรุ่นออนไลน์ ก็อยู่ที่เดียว เปิดย้อนกลับมาหัวเราะด้วยกันได้ทุกเมื่อ',
    },
    en: {
      title: 'Friends',
      tagline: 'Trips, inside jokes, and shared memories for your circle',
      cardDesc: 'A home base for your crew — photos, messages, and moments worth keeping',
      pageIntro:
        'Road trips, reunions, lifelong friends — photos and inside jokes shouldn’t live scattered across chat threads you can never find again. A home base for your crew keeps the pictures, messages, and moments worth remembering together: reunions, yearly trips, or a shared yearbook — one place to reopen and laugh about for years.',
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
        'น้องสัตว์เลี้ยงเป็นสมาชิกในบ้าน — ไม่ใช่แค่สัตว์เลี้ยงข้างทาง แต่เป็นคนที่เคยรอเราอยู่หน้าประตู เคยนอนข้างเท้า และเคยทำให้บ้านรู้สึกอุ่นขึ้นทุกวัน เมื่อถึงเวลาที่ต้องจากกัน ครอบครัวสมควรมีพื้นที่เก็บความรักและความทรงจำอย่างมีเกียรติ รวมภาพ วิดีโอ สมุดส่งความคิดถึง และไดอารี่ความสุขไว้ในลิงก์เดียว ที่เปิดกลับมาอ่านได้ทุกเมื่อ และส่งต่อให้คนที่รักน้องร่วมกันได้',
    },
    en: {
      title: 'Pet Memorial',
      tagline: 'A loving space for the little family member you miss',
      cardDesc: 'Photos, videos, condolence book, and happiness diary for your pet',
      pageIntro:
        'Pets are family — not just animals in the house, but the ones who waited at the door, slept by our feet, and made home feel warmer every day. When it’s time to say goodbye, they deserve a gentle place to hold love and memories with dignity: photos, videos, messages of missing them, and a happiness diary — all in one lasting link you can revisit and share with everyone who loved them too.',
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
