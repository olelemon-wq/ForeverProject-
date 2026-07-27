import type { CategoryKey } from '@/lib/categories';
import { getCategoryJourney } from '@/lib/categories';
import { resolveDefaultMediaSrc } from '@/lib/defaultMedia';

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
    coverUrl: '/defaults/memorial/cover/2.png',
    primaryColor: '#5c6b52',
    highlights: ['การ์ดพิธี', 'สมุดไว้อาลัย', 'ผังครอบครัว'],
  },
  {
    slug: 'pluemploy',
    category: 'Couple',
    categoryLabel: 'คู่รัก',
    title: 'ปลื้ม & พลอย',
    description: 'บันทึกวันสำคัญ ไดอารี่ความทรงจำ และแกลเลอรีคู่รัก',
    coverUrl: '/defaults/couple/cover/1.png',
    primaryColor: '#c9a0a8',
    highlights: ['บันทึกวันสำคัญ', 'ไดอารี่ความทรงจำ', 'แกลเลอรี'],
  },
  {
    slug: 'kukimiyafamily',
    category: 'Wedding',
    categoryLabel: 'งานแต่งงาน',
    title: 'กิ๊ฟ & มิยา',
    description: 'การ์ดเชิญ กำหนดการ สมุดอวยพร ใส่ซองออนไลน์ และผังสองครอบครัว',
    coverUrl: '/defaults/wedding/cover/1.jpg',
    primaryColor: '#96a288',
    highlights: ['การ์ดเชิญ', 'สมุดอวยพร', 'ใส่ซองออนไลน์'],
  },
  {
    slug: 'bts-family',
    category: 'Family Legacy',
    categoryLabel: 'มรดกวงศ์ตระกูล',
    title: 'Bangtan Legacy',
    description: 'ประวัติตระกูล ผังวงศ์ตระกูล และบอร์ดบันทึกความทรงจำ',
    coverUrl:
      '/uploads/4041f2c5-d9e2-4367-8877-a88214b3a76e/1784090512680-deceased-cover-1784090512609-054cb23c60e2f5fc307a3aa66fede435.jpg',
    primaryColor: '#6b5b4f',
    highlights: ['ผังวงศ์ตระกูล', 'บันทึกประวัติ', 'แกลเลอรี'],
  },
  {
    slug: 'friendforever',
    category: 'Friends',
    categoryLabel: 'กลุ่มเพื่อน',
    title: 'เพื่อนรัก CN the Gang',
    description: 'พื้นที่รวมความทรงจำทริป ข้อความถึงกัน และแกลเลอรีกลุ่มเพื่อน',
    coverUrl: '/defaults/friends/cover/2.jpg',
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
    coverUrl: resolveDefaultMediaSrc(site.coverUrl),
    categoryLabel:
      site.categoryLabel || getCategoryJourney(site.category).label.split('(')[0].trim(),
  }));
}

export function isDemoSiteSlug(slug: string): slug is DemoSiteSlug {
  return (DEMO_SITE_SLUGS as readonly string[]).includes(slug);
}
