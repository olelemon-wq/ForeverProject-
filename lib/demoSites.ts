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
  'mae-somsri',
  'ajarn-somchai',
  'pluemploy',
  'napat-mintra',
  'beam-fah',
  'kukimiyafamily',
  'porjai-nicha',
  'win-praew',
  'bts-family',
  'saengdao-lineage',
  'rungarun-house',
  'friendforever',
  'campus-crew',
  'office-buddies',
  'kittiemeaw',
  'nong-mango',
  'nong-bao',
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
    slug: 'mae-somsri',
    category: 'Memorial',
    categoryLabel: 'อนุสรณ์บุคคล',
    title: 'ด้วยรักและคิดถึง คุณแม่สมศรี',
    description: 'สมุดไว้อาลัย ความทรงจำจากลูกหลาน แกลเลอรี และผังครอบครัว',
    coverUrl: '/demo-media/a1b2c3d4-mae1-4f01-9e11-somsri000001/mae-05.jpg',
    primaryColor: '#8B7355',
    highlights: ['สมุดไว้อาลัย', 'ความทรงจำ', 'ผังครอบครัว'],
  },
  {
    slug: 'ajarn-somchai',
    category: 'Memorial',
    categoryLabel: 'อนุสรณ์บุคคล',
    title: 'รำลึกอาจารย์สมชาย พิทักษ์ธรรม',
    description: 'ประวัติ แกลเลอรี กิจกรรมรำลึก และกองทุนบริจาคเพื่อการศึกษา',
    coverUrl: '/demo-media/a1b2c3d4-aja1-4f01-9e11-somchai00001/ajarn-03.jpg',
    primaryColor: '#4A5568',
    highlights: ['กิจกรรมรำลึก', 'บริจาค', 'สมุดไว้อาลัย'],
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
    slug: 'napat-mintra',
    category: 'Couple',
    categoryLabel: 'คู่รัก',
    title: 'ณภัทร & มินตรา',
    description: 'ไดอารี่คู่รัก วันครบรอบ และแกลเลอรีทริปด้วยกัน',
    coverUrl: '/demo-media/c0a01e01-napat-4min-tra0-couple000001/napat-mintra-01.jpg',
    primaryColor: '#C4787A',
    highlights: ['ไดอารี่คู่รัก', 'วันครบรอบ', 'แกลเลอรี'],
  },
  {
    slug: 'beam-fah',
    category: 'Couple',
    categoryLabel: 'คู่รัก',
    title: 'บีม & ฟ้า',
    description: 'บอร์ดทริปคู่ กิจกรรมด้วยกัน และข้อความถึงกัน',
    coverUrl: '/demo-media/c0a01e02-beam0-4fah-couple00000002/beam-fah-01.jpg',
    primaryColor: '#6B8E9F',
    highlights: ['บอร์ดทริป', 'กิจกรรมคู่', 'ข้อความถึงกัน'],
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
    slug: 'porjai-nicha',
    category: 'Wedding',
    categoryLabel: 'งานแต่งงาน',
    title: 'ปอใจ & ณิชา',
    description: 'การ์ดเชิญ สมุดอวยพร และใส่ซองออนไลน์',
    coverUrl: '/demo-media/c0a02e01-porja-4nic-ha0-wedding00001/porjai-nicha-01.jpg',
    primaryColor: '#D4A5A5',
    highlights: ['การ์ดเชิญ', 'สมุดอวยพร', 'ใส่ซองออนไลน์'],
  },
  {
    slug: 'win-praew',
    category: 'Wedding',
    categoryLabel: 'งานแต่งงาน',
    title: 'วิน & แพรว',
    description: 'กำหนดการ แกลเลอรีพรีเวด และผังสองครอบครัว',
    coverUrl: '/demo-media/c0a02e02-winpr-4aew-wedding00002/win-praew-01.jpg',
    primaryColor: '#9AAE8C',
    highlights: ['กำหนดการ', 'พรีเวดดิ้ง', 'ผังครอบครัว'],
  },
  {
    slug: 'bts-family',
    category: 'Family Legacy',
    categoryLabel: 'เรื่องราวครอบครัว',
    title: 'Jitjaidee-Family',
    description: 'Jitjaidee family legacy — genealogy, history books, gallery, and memory board.',
    coverUrl:
      '/demo-media/4041f2c5-d9e2-4367-8877-a88214b3a76e/1785401245880-deceased-avatar-1785401245825-7f401b80-8dd9-405d-b816-b0824fbbf8b7.jpg',
    primaryColor: '#8ba8bd',
    highlights: ['ผังครอบครัว', 'หนังสือครอบครัว', 'คลังภาพครอบครัว'],
  },
  {
    slug: 'saengdao-lineage',
    category: 'Family Legacy',
    categoryLabel: 'เรื่องราวครอบครัว',
    title: 'ตระกูลแสงดาว',
    description: 'ผังตระกูล หนังสือครอบครัว และคลังภาพรุ่นสู่รุ่น',
    coverUrl: '/demo-media/c0a03e01-saeng-4dao-family000001/saengdao-lineage-01.jpg',
    primaryColor: '#7A8F6E',
    highlights: ['ผังตระกูล', 'หนังสือครอบครัว', 'คลังภาพ'],
  },
  {
    slug: 'rungarun-house',
    category: 'Family Legacy',
    categoryLabel: 'เรื่องราวครอบครัว',
    title: 'บ้านรุ่งอรุณ',
    description: 'งานรวมญาติ ความทรงจำร่วม และแกลเลอรีบ้านเกิด',
    coverUrl: '/demo-media/c0a03e02-runga-4run-family000002/rungarun-house-01.jpg',
    primaryColor: '#B08968',
    highlights: ['งานรวมญาติ', 'ความทรงจำ', 'แกลเลอรีบ้านเกิด'],
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
    slug: 'campus-crew',
    category: 'Friends',
    categoryLabel: 'กลุ่มเพื่อน',
    title: 'เพื่อนมหาลัย รุ่น 58',
    description: 'ทริปรุ่น ความทรงจำมหาลัย และข้อความถึงกัน',
    coverUrl: '/demo-media/c0a04e01-campu-4scr-ew0-friends0001/campus-crew-01.jpg',
    primaryColor: '#5B7C99',
    highlights: ['ทริปรุ่น', 'ข้อความถึงกัน', 'แกลเลอรี'],
  },
  {
    slug: 'office-buddies',
    category: 'Friends',
    categoryLabel: 'กลุ่มเพื่อน',
    title: 'เพื่อนที่ทำงาน Team Sunrise',
    description: 'นัดหมายทีม แกลเลอรีออฟฟิศ และข้อความให้กำลังใจ',
    coverUrl: '/demo-media/c0a04e02-offic-4ebu-ddi-friends0002/office-buddies-01.jpg',
    primaryColor: '#8C7AA9',
    highlights: ['นัดหมายทีม', 'แกลเลอรีออฟฟิศ', 'ให้กำลังใจ'],
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
  {
    slug: 'nong-mango',
    category: 'Pet Memorial',
    categoryLabel: 'สัตว์เลี้ยง',
    title: 'น้องมะม่วงจอมซน',
    description: 'สมุดส่งความคิดถึง ไดอารี่ และแกลเลอรีน้องแมว',
    coverUrl: '/demo-media/c0a05e01-mango-4cat-pet0-memorial01/nong-mango-01.jpg',
    primaryColor: '#D4A574',
    highlights: ['สมุดส่งความคิดถึง', 'ไดอารี่', 'แกลเลอรี'],
  },
  {
    slug: 'nong-bao',
    category: 'Pet Memorial',
    categoryLabel: 'สัตว์เลี้ยง',
    title: 'น้องเบาผู้ซื่อสัตย์',
    description: 'กิจกรรมรำลึก กองทุนช่วยเหลือสัตว์ และแกลเลอรีน้องหมา',
    coverUrl: '/demo-media/c0a05e02-baodg-4pet-memorial0002/nong-bao-01.jpg',
    primaryColor: '#8B9A7D',
    highlights: ['กิจกรรมรำลึก', 'กองทุนสัตว์', 'แกลเลอรี'],
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
