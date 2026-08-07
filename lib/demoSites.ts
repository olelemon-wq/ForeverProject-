import type { CategoryKey } from '@/lib/categories';
import { getCategoryJourney } from '@/lib/categories';
import { resolveDefaultMediaSrc } from '@/lib/defaultMedia';
import { resolveMediaSrc } from '@/lib/mediaUrl';

export interface DemoSiteCard {
  slug: string;
  category: CategoryKey;
  categoryLabel: string;
  title: string;
  description: string;
  coverUrl: string;
  primaryColor: string;
  highlights: string[];
}

/** Public showcase demos — keep in sync with `prisma/data/demo-sites.json`. */
export const DEMO_SITE_SLUGS = [
  'boonkrua-family',
  'pluemploy',
  'kukimiyafamily',
  'bts-family',
  'friendforever',
  'kittiemeaw',
] as const;

export type DemoSiteSlug = (typeof DEMO_SITE_SLUGS)[number];

const DEMO_SITE_CARDS: DemoSiteCard[] = [
  {
    slug: 'boonkrua-family',
    category: 'Memorial',
    categoryLabel: 'อนุสรณ์บุคคล',
    title: 'ด้วยรักและคิดถึง คุณพ่อบุญเครือ',
    description: 'เว็บรำลึกพร้อมการ์ดพิธี สมุดไว้อาลัย แกลเลอรี และผังครอบครัว',
    coverUrl:
      '/demo-media/71c8328d-857d-440e-a77d-8de0a06b3232/1782186663308-gallery-1782186662815-img-7169.jpg',
    primaryColor: '#5c6b52',
    highlights: ['การ์ดพิธี', 'สมุดไว้อาลัย', 'ผังครอบครัว'],
  },
  {
    slug: 'pluemploy',
    category: 'Couple',
    categoryLabel: 'คู่รัก',
    title: 'ปลื้ม & พลอย',
    description: 'บันทึกวันสำคัญ ไดอารี่ความทรงจำ และแกลเลอรีคู่รัก',
    coverUrl:
      '/demo-media/350b0b44-5a07-4173-aa75-0ce6e78ab71c/1784969266780-gallery-1784969266742-CleanShot 2569-07-25 at 15.27.45@2x.jpg',
    primaryColor: '#c9a0a8',
    highlights: ['บันทึกวันสำคัญ', 'ไดอารี่ความทรงจำ', 'แกลเลอรี'],
  },
  {
    slug: 'kukimiyafamily',
    category: 'Wedding',
    categoryLabel: 'งานแต่งงาน',
    title: 'กิ๊ฟ & มิยา',
    description: 'การ์ดเชิญ กำหนดการ สมุดอวยพร ใส่ซองออนไลน์ และผังสองครอบครัว',
    coverUrl:
      '/demo-media/88a6311e-21a0-49f9-a0d6-6a63a5d2f566/1785128145977-announcement-card-1785128145848.jpg',
    primaryColor: '#96a288',
    highlights: ['การ์ดเชิญ', 'สมุดอวยพร', 'ใส่ซองออนไลน์'],
  },
  {
    slug: 'bts-family',
    category: 'Family Legacy',
    categoryLabel: 'มรดกวงศ์ตระกูล',
    title: 'Jitjaidee-Family',
    description: 'Jitjaidee family legacy — genealogy, history books, gallery, and memory board.',
    coverUrl:
      '/demo-media/4041f2c5-d9e2-4367-8877-a88214b3a76e/1785401245880-deceased-avatar-1785401245825-7f401b80-8dd9-405d-b816-b0824fbbf8b7.jpg',
    primaryColor: '#8ba8bd',
    highlights: ['ผังวงศ์ตระกูล', 'หนังสือประวัติตระกูล', 'แกลเลอรี'],
  },
  {
    slug: 'friendforever',
    category: 'Friends',
    categoryLabel: 'กลุ่มเพื่อน',
    title: 'เพื่อนรัก CN the Gang',
    description: 'พื้นที่รวมความทรงจำทริป ข้อความถึงกัน และแกลเลอรีกลุ่มเพื่อน',
    coverUrl:
      '/demo-media/edd45dd0-39bf-4e0d-9b5a-d43562f1e044/1784993607104-gallery-1784993606994-b7b93478-45b9-40c1-8162-3349be8b5174.jpg',
    primaryColor: '#7a8f6e',
    highlights: ['บอร์ดนัดหมาย', 'ข้อความถึงกัน', 'แกลเลอรีกลุ่ม'],
  },
  {
    slug: 'kittiemeaw',
    category: 'Pet Memorial',
    categoryLabel: 'สัตว์เลี้ยง',
    title: 'คิตตี้เหมียวจอมซน',
    description: 'พื้นที่รำลึกน้องสัตว์เลี้ยง พร้อมสมุดส่งความคิดถึงและแกลเลอรี',
    coverUrl: '/defaults/pet-memorial/cover/3.png',
    primaryColor: '#8b9a7d',
    highlights: ['สมุดส่งความคิดถึง', 'ไดอารี่ความสุข', 'แกลเลอรีน้อง'],
  },
];

export function getDemoSiteCards(): DemoSiteCard[] {
  return DEMO_SITE_CARDS.map((site) => ({
    ...site,
    coverUrl: resolveMediaSrc(resolveDefaultMediaSrc(site.coverUrl)),
    categoryLabel:
      site.categoryLabel || getCategoryJourney(site.category).label.split('(')[0].trim(),
  }));
}

export function isDemoSiteSlug(slug: string): slug is DemoSiteSlug {
  return (DEMO_SITE_SLUGS as readonly string[]).includes(slug);
}
