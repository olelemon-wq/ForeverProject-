import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { 
  BookOpen, Image, Flame, ArrowRight,
  PawPrint,
} from 'lucide-react';
import Link from 'next/link';
import { getEnabledFeatures } from '@/lib/features';
import CoupleJourneyCard from '@/components/announcement/CoupleJourneyCard';
import FriendsMeetupCard from '@/components/announcement/FriendsMeetupCard';
import MemorialScheduleCard from '@/components/announcement/MemorialScheduleCard';
import LifeStorySection from '@/components/public/LifeStorySection';
import { getCoupleMilestonesFromAnnouncement } from '@/lib/coupleMilestones';
import { getCategoryEbookMocks, toEbookSummaries } from '@/lib/ebookMocks';
import {
  categoryUsesLifeStory,
  lifeStoryHasContent,
  normalizeLifeStory,
} from '@/lib/lifeStory';
import { resolveAnnouncementCardTheme } from '@/lib/announcementCardTheme';
import { getCategoryJourney } from '@/lib/categories';
import { filterGalleryMedia } from '@/lib/galleryMedia';
import RecentGalleryBento from '@/components/public/RecentGalleryBento';
import FeaturedEbooksSnippet from '@/components/public/FeaturedEbooksSnippet';
import CondolenceSectionShell from '@/components/public/CondolenceSectionShell';
import PetProfileCard, { type PetProfileCardSubject } from '@/components/public/PetProfileCard';
import { resolveMediaSrc } from '@/lib/mediaUrl';
import { FEATURE_CARD_CLASS } from '@/lib/publicLayout';
import { FramedAnnouncementCard } from '@/components/announcement/AnnouncementCardFrame';
import { announcementShowsPhoto, ANNOUNCEMENT_FRAMED_CARD_CLASS } from '@/lib/announcementCardLayout';

export const dynamic = 'force-dynamic';

async function getTenantData(slug: string) {
  return await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
}

async function getRecentGallery(websiteId: string, themeConfig?: unknown) {
  const medias = await db.media.findMany({
    where: {
      websiteId,
      album: 'GALLERY',
      isDeleted: false,
      NOT: { mimeType: { startsWith: 'video/' } },
    },
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' },
    ],
    take: 12,
  });

  return filterGalleryMedia(medias, themeConfig)
    .slice(0, 4)
    .map((m) => ({
      id: m.id,
      filePath: m.filePath,
      fileName: m.fileName,
      mimeType: m.mimeType,
    }));
}

function getDisplayUrl(filePath: string, _mimeType: string, _index: number) {
  return resolveMediaSrc(filePath);
}

const getScheduleLabels = (category: string) => {
  if (category === 'Couple') {
    return {
      title: 'วันสำคัญของเรา',
      item1: 'วันสำคัญ / ครบรอบ',
      item2: '',
      item3: '',
      venueTitle: 'สถานที่ / โน้ต (ถ้ามี)',
      venueLabel: 'สถานที่หรือเหตุการณ์',
      pavilionLabel: 'รายละเอียดเพิ่มเติม (ถ้ามี)',
      venueDesc: 'กดปุ่มนำทางเพื่อเปิดแผนที่ (ถ้ามี)',
      footerText: 'ขอบคุณที่มาร่วมเป็นส่วนหนึ่งของเส้นทางความรักของเรา',
      guidelinesTitle: 'โน้ตเพิ่มเติม',
      contactLabel: 'ติดต่อ:',
      notesLabel: 'โน้ต / รายละเอียด:',
    };
  }
  if (category === 'Wedding') {
    return {
      title: 'กำหนดการจัดงานและกิจกรรม',
      item1: '1. พิธีมงคลสมรส / พิธีหลั่งน้ำพระพุทธมนต์',
      item2: '2. งานฉลองมงคลสมรส / งานเลี้ยงฉลอง',
      item3: '3. พิธีฉลองอาฟเตอร์ปาร์ตี้ / กิจกรรมพิเศษ',
      venueTitle: 'สถานที่จัดงาน (VENUE)',
      venueLabel: 'สถานที่จัดงาน',
      pavilionLabel: 'ห้องจัดเลี้ยง / ห้องจัดงาน (ถ้ามี)',
      venueDesc: 'กรุณาคลิกปุ่มนำทางเพื่อความสะดวกในการเดินทางมายังสถานที่จัดงาน',
      footerText: 'ขอขอบคุณแขกผู้มีเกียรติทุกท่านที่มาร่วมแสดงความยินดี — เจ้าภาพ',
      guidelinesTitle: 'คำแนะนำการร่วมแสดงความยินดี',
      contactLabel: 'ติดต่อประสานงานเจ้าภาพ:',
    };
  }
  if (category === 'Pet Memorial') {
    return {
      title: 'กำหนดการอำลาและวันสำคัญของน้อง',
      item1: '1. พิธีอำลา / ส่งความคิดถึง',
      item2: '2. พิธีส่งน้องกลับดาว',
      item3: '3. พิธีรำลึก / โปรยเถ้า (ถ้ามี)',
      venueTitle: 'สถานที่จัดพิธี',
      venueLabel: 'สถานที่จัดพิธี',
      venueDesc: 'กรุณาคลิกปุ่มนำทางเพื่อความสะดวกในการเดินทางมายังสถานที่จัดงาน',
      footerText: 'ขอบคุณทุกคนที่มาร่วมส่งความรักและความคิดถึงให้น้อง — ครอบครัว',
      guidelinesTitle: 'ข้อมูลเพิ่มเติมสำหรับผู้มาร่วม',
      contactLabel: 'ติดต่อประสานงาน:',
    };
  }
  if (category === 'Family' || category === 'Family Legacy') {
    return {
      title: 'กำหนดการและวันรวมใจสายใยครอบครัว',
      item1: '1. กิจกรรมและงานสำคัญของครอบครัว',
      item2: '2. งานเลี้ยงพบปะสังสรรค์ครอบครัวใหญ่',
      item3: '3. พิธีร่วมใจและกิจกรรมรำลึก (ถ้ามี)',
      venueTitle: 'สถานที่จัดงาน (VENUE)',
      venueLabel: 'สถานที่นัดหมาย / บ้านครอบครัว',
      venueDesc: 'กรุณาคลิกปุ่มนำทางเพื่อความสะดวกในการเดินทางมายังสถานที่จัดงาน',
      footerText: 'กราบขอบพระคุณทุกท่านที่ร่วมสืบสานสายสัมพันธ์และส่งต่อความรัก — ครอบครัว',
      guidelinesTitle: 'ข้อมูลเพิ่มเติมสำหรับครอบครัว',
      contactLabel: 'ติดต่อประสานงาน:',
    };
  }
  if (category === 'Friends') {
    return {
      title: 'นัดพบปะกลุ่ม',
      item1: 'นัดพบปะกลุ่ม',
      item2: '',
      item3: '',
      venueTitle: 'สถานที่นัดพบ',
      venueLabel: 'สถานที่นัดพบ',
      venueDesc: 'กดปุ่มนำทางเพื่อเปิดแผนที่ไปยังจุดนัดพบ',
      footerText: 'ขอขอบคุณทุกคนที่ร่วมแบ่งปันความทรงจำและมิตรภาพ — กลุ่ม',
      guidelinesTitle: 'ข้อมูลเพิ่มเติมสำหรับเพื่อน ๆ',
      contactLabel: 'ติดต่อประสานงาน:',
      notesLabel: 'โน้ต / รายละเอียด:',
    };
  }
  return {
    title: 'กำหนดการและพิธีการ',
    item1: '1. พิธีรดน้ำศพ',
    item2: '2. พิธีสวดพระอภิธรรม',
    item3: '3. พิธีฌาปนกิจ / พระราชทานเพลิงศพ',
    venueTitle: 'สถานที่จัดพิธี (VENUE)',
    venueLabel: 'วัดจัดพิธี',
    venueDesc: 'กรุณาคลิกปุ่มนำทางเพื่อความสะดวกในการเดินทางมายังวัด',
    footerText: 'กราบขอบพระคุณทุกท่านที่มาร่วมไว้อาลัย — คณะเจ้าภาพ',
    guidelinesTitle: 'ข้อแนะนำการร่วมแสดงความอาลัย',
    contactLabel: 'ติดต่อประสานงานเจ้าภาพ:',
  };
};

const getInviteFallback = (category: string) => {
  if (category === 'Couple') return 'บันทึกวันสำคัญและเส้นทางความรักของเรา';
  if (category === 'Wedding') return 'กราบเรียนเชิญญาติสนิทและมิตรสหายมาร่วมยินดี';
  if (category === 'Friends') return 'เชิญชวนมาร่วมพบปะและสร้างความทรงจำด้วยกัน';
  if (category === 'Pet Memorial') return 'เรียนเชิญร่วมส่งน้องด้วยความรักและความคิดถึง';
  if (category === 'Family' || category === 'Family Legacy') return 'เชิญร่วมพบปะและสืบสานสายใยครอบครัว';
  return 'กราบเรียนเชิญด้วยความเคารพอย่างสูง';
};

async function getRecentCondolences(websiteId: string) {
  const condolences = await db.condolence.findMany({
    where: {
      websiteId,
      isApproved: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Sort: FAMILY condolences displayed before GENERAL condolences (BR028)
  const sorted = condolences.sort((a, b) => {
    if (a.type === 'FAMILY' && b.type !== 'FAMILY') return -1;
    if (a.type !== 'FAMILY' && b.type === 'FAMILY') return 1;
    return 0; // maintain original chronological sort order
  });

  return sorted.slice(0, 3); // Take top 3
}

async function getRecentEbooks(websiteId: string, category: string) {
  const dbEbooks = await db.ebook.findMany({
    where: { websiteId },
    orderBy: { createdAt: 'desc' },
  });

  const mockBooklets = getCategoryEbookMocks(category);
  const mappedDbEbooks = dbEbooks.map((eb) => ({
    id: eb.id,
    title: eb.title,
    author: eb.author,
    totalPages: eb.totalPages,
  }));

  return dbEbooks.length > 0
    ? mappedDbEbooks.slice(0, 2)
    : toEbookSummaries(mockBooklets).slice(0, 2);
}

export default async function PublicMemorialHome(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  // Parallel database fetching
  const [recentPhotos, recentCondolences, recentEbooks] = await Promise.all([
    getRecentGallery(tenant.id, tenant.themeConfig),
    getRecentCondolences(tenant.id),
    getRecentEbooks(tenant.id, tenant.category),
  ]);

  const config = tenant.themeConfig as any;
  const sLabels = getScheduleLabels(tenant.category);
  const enabledFeatures = getEnabledFeatures(config, tenant);
  const displayBiography = config?.biography || (() => {
    if (tenant.category === 'Couple') {
      return "เรื่องราวความรักของเราสองคน บันทึกทุกช่วงเวลาที่เติมเต็มรอยยิ้ม ความทรงจำ และเส้นทางที่เราเดินมาด้วยกัน...";
    }
    if (tenant.category === 'Wedding') {
      return "เรื่องราวความรักของเราสองคน เริ่มต้นจากการพบกันครั้งแรก และร่วมเดินทางเติมเต็มรอยยิ้มและสร้างความทรงจำที่อบอุ่นด้วยกันในทุกวัน...";
    }
    if (tenant.category === 'Pet Memorial') {
      return "เรื่องราวของสัตว์เลี้ยงแสนรักผู้เป็นสมาชิกคนสำคัญของบ้าน น้องคอยมอบพลังบวก รอยยิ้ม และความรักที่ไม่มีเงื่อนไขให้กับเราในทุกช่วงเวลา...";
    }
    if (tenant.category === 'Family Legacy') {
      return "เก็บเรื่องราวของครอบครัว ภาพความทรงจำ และคำสอนที่ส่งต่อจากรุ่นสู่รุ่นไว้ด้วยกัน...";
    }
    if (tenant.category === 'Friends') {
      return "บันทึกเรื่องราวการเดินทางของมิตรภาพและเพื่อนฝูง รวบรวมทุกวีรกรรม เสียงหัวเราะ และความทรงจำวันวานที่ไม่มีวันจางหาย...";
    }
    return "คุณพ่อสมศักดิ์เป็นคนขยัน ซื่อสัตย์ และรักครอบครัวมาก ท่านเป็นผู้นำที่ดีและเสียสละเสมอเพื่อการศึกษาของลูกๆ ความดีงามและคำสั่งสอนของท่านจะคงอยู่ในการดำเนินชีวิตของพวกเราตลอดไป...";
  })();
  
  const journey = getCategoryJourney(tenant.category);
  const homeCopy = journey.home || {};
  
  const petProfiles: PetProfileCardSubject[] = Array.isArray(config?.subjects)
    ? (config.subjects as PetProfileCardSubject[])
    : [];
  const allSubjectsAlive =
    petProfiles.length > 0 && petProfiles.every((s) => s.isAlive);
  const isHappy =
    tenant.category === 'Couple' ||
    tenant.category === 'Wedding' ||
    tenant.category === 'Friends' ||
    (tenant.category === 'Pet Memorial' && allSubjectsAlive);

  const biographyHeading =
    homeCopy.biographyHeading ||
    (isHappy
      ? tenant.category === 'Pet Memorial'
        ? 'เรื่องราวและช่วงเวลาแสนซน'
        : 'เรื่องราวประทับใจ'
      : 'อาลัยและคำรำลึก');
  const condolenceHeading =
    homeCopy.condolenceHeading ||
    (isHappy
      ? tenant.category === 'Pet Memorial'
        ? 'สมุดเยี่ยมเยียนและข้อความถึงน้อง ๆ'
        : 'สมุดเยี่ยมเยียนและข้อความอวยพร'
      : 'ข้อความไว้อาลัยล่าสุด');
  const condolenceCta =
    homeCopy.condolenceCta ||
    (isHappy ? 'ส่งความรักและความปรารถนาดี' : 'เขียนข้อความ/ร่วมจุดเทียนออนไลน์');
  const condolenceViewAll =
    tenant.category === 'Friends'
      ? 'ดูสมุดข้อความทั้งหมด'
      : isHappy
        ? 'ดูสมุดเยี่ยมเยียนทั้งหมด'
        : 'ดูสมุดลงนามทั้งหมด';
  const condolenceEmpty =
    tenant.category === 'Friends'
      ? 'ยังไม่มีข้อความ ร่วมเขียนฝากถึงกันเป็นคนแรก'
      : isHappy
        ? 'ยังไม่มีข้อความในสมุดเล่มนี้ ร่วมเขียนเป็นคนแรก'
        : 'ยังไม่มีข้อความแสดงความไว้อาลัย ร่วมเขียนคำไว้อาลัยเปิดสมุดลงนามเป็นคนแรก';
  const condolenceOpenAll =
    tenant.category === 'Friends'
      ? 'เปิดอ่านข้อความทั้งหมด'
      : isHappy
        ? 'เปิดสมุดเยี่ยมเยียนทั้งหมด'
        : 'เปิดสมุดอ่านคำไว้อาลัยทั้งหมด';
  const galleryHeading = homeCopy.galleryHeading || 'ภาพถ่ายความทรงจำล่าสุด';
  const ebooksTitle = (() => {
    if (tenant.category === 'Couple') return 'สมุดภาพความรักแนะนำ';
    if (tenant.category === 'Pet Memorial') return 'บันทึกการเดินทางของน้องและสมุดภาพแนะนำ';
    if (tenant.category === 'Friends') return 'หนังสือรุ่นและบันทึกความทรงจำแนะนำ';
    if (tenant.category === 'Family Legacy') return 'หนังสือครอบครัวและบันทึกแนะนำ';
    return 'หนังสือที่ระลึกและธรรมทานแนะนำ';
  })();
  const ebooksCtaText = (() => {
    if (tenant.category === 'Couple') return 'ดูสมุดภาพทั้งหมด';
    if (tenant.category === 'Pet Memorial') return 'ดูบันทึกทั้งหมด';
    return 'อ่านหนังสือทั้งหมด';
  })();
  const ann = config?.announcement || {};
  const isAnnActive = enabledFeatures.announcement;

  const cardTheme = resolveAnnouncementCardTheme(tenant.category, ann.style);

  // Deceased Image config
  const avatarUrl = config?.avatarUrl;
  const avatarScale = config?.avatarScale || 1;
  const avatarX = config?.avatarX || 0;
  const avatarY = config?.avatarY || 0;
  const avatarRotate = config?.avatarRotate || 0;
  const showPhoto = announcementShowsPhoto(ann.showPhoto);

  // Wreath/Gift policy — Friends has no wreath/condolence policy
  const isFriends = tenant.category === 'Friends';
  const isCouple = tenant.category === 'Couple';
  const isWedding = tenant.category === 'Wedding';
  const coupleMilestones = isCouple ? getCoupleMilestonesFromAnnouncement(ann) : [];
  const wreathPolicies: Record<string, string> = isWedding ? {
    'NORMAL': 'ยินดีรับซองและของขวัญแสดงความยินดีตามปกติ',
    'NO_FLOWERS': 'ขออภัย เจ้าภาพงดรับของขวัญ (เน้นการร่วมแสดงความยินดีและอวยพรแทน)',
    'DONATION_ONLY': 'ขออภัย เจ้าภาพงดรับของขวัญ (ร่วมสมทบทุนมูลนิธิแทน)',
    'NO_WREATH': 'ขออภัย เจ้าภาพงดรับซองและของขวัญทุกประเภท',
  } : {
    'NORMAL': 'เปิดรับพวงหรีดแสดงความอาลัยตามปกติ',
    'NO_FLOWERS': 'เจ้าภาพขอความร่วมมืองดรับพวงหรีดดอกไม้สด (เพื่อร่วมรักษ์โลก)',
    'DONATION_ONLY': 'เจ้าภาพขอความร่วมมืองดรับพวงหรีด (ร่วมทำบุญสมทบทุนแทน)',
    'NO_WREATH': 'เจ้าภาพขอความร่วมมืองดรับพวงหรีดทุกประเภท',
  };
  const showWreathPolicy = isWedding && !!ann?.wreathPolicy;

  return (
    <div className="space-y-8 animate-fade-in text-center">
      
      {/* 1. Announcement Invitation Card */}
      {isAnnActive && ann.mode === 'custom' && ann.customCardUrl ? (
        <FramedAnnouncementCard
          id="announcement-card"
          category={tenant.category}
          orientation={ann.orientation}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveMediaSrc(ann.customCardUrl)}
            alt="การ์ดกำหนดการ"
            className="block h-full w-full bg-white object-contain"
          />
        </FramedAnnouncementCard>
      ) : isAnnActive && isCouple ? (
        <FramedAnnouncementCard category={tenant.category} orientation={ann.orientation}>
        <CoupleJourneyCard
          className={ANNOUNCEMENT_FRAMED_CARD_CLASS}
          tenantName={tenant.name}
          inviteText={ann.text}
          inviteFallback={getInviteFallback(tenant.category)}
          footerText={sLabels.footerText}
          theme={cardTheme}
          milestones={coupleMilestones}
          timelineTitle="เส้นทางที่ผ่านมา"
          fontFamily={ann?.fontFamily}
          siteFontFamily={config?.fontFamily}
          avatarUrl={avatarUrl}
          avatarScale={avatarScale}
          avatarX={avatarX}
          avatarY={avatarY}
          avatarRotate={avatarRotate}
          showPhoto={showPhoto}
          imageCoordSpace={config?.imageCoordSpace}
          notes={ann.dressCode}
          contactPhone={ann.contactPhone}
        />
        </FramedAnnouncementCard>
      ) : isAnnActive && isFriends ? (
        <FramedAnnouncementCard category={tenant.category} orientation={ann.orientation}>
        <FriendsMeetupCard
          className={ANNOUNCEMENT_FRAMED_CARD_CLASS}
          tenantName={tenant.name}
          inviteText={ann.text}
          inviteFallback={getInviteFallback(tenant.category)}
          footerText={sLabels.footerText}
          theme={cardTheme}
          fontFamily={ann?.fontFamily}
          siteFontFamily={config?.fontFamily}
          avatarUrl={avatarUrl}
          avatarScale={avatarScale}
          avatarX={avatarX}
          avatarY={avatarY}
          avatarRotate={avatarRotate}
          showPhoto={showPhoto}
          imageCoordSpace={config?.imageCoordSpace}
          meetupDate={ann.waterDate}
          meetupTime={ann.waterTime}
          venueName={ann.templeName}
          venueDetail={ann.pavilion}
          mapLink={ann.mapLink}
          notes={ann.dressCode}
          contactPhone={ann.contactPhone}
        />
        </FramedAnnouncementCard>
      ) : isAnnActive ? (
        <FramedAnnouncementCard category={tenant.category} orientation={ann.orientation}>
        <MemorialScheduleCard
          className={ANNOUNCEMENT_FRAMED_CARD_CLASS}
          compact
          category={tenant.category}
          tenantName={tenant.name}
          inviteText={ann.text}
          inviteFallback={getInviteFallback(tenant.category)}
          labels={sLabels}
          theme={cardTheme}
          fontFamily={ann?.fontFamily}
          siteFontFamily={config?.fontFamily}
          avatarUrl={avatarUrl}
          avatarScale={avatarScale}
          avatarX={avatarX}
          avatarY={avatarY}
          avatarRotate={avatarRotate}
          showPhoto={showPhoto}
          imageCoordSpace={config?.imageCoordSpace}
          waterDate={ann.waterDate}
          waterTime={ann.waterTime}
          abhidhammaDateRange={ann.abhidhammaDateRange}
          abhidhammaTime={ann.abhidhammaTime}
          cremationDate={ann.cremationDate}
          cremationTime={ann.cremationTime}
          templeName={ann.templeName}
          pavilion={ann.pavilion}
          mapLink={ann.mapLink}
          dressCode={ann.dressCode}
          contactPhone={ann.contactPhone}
          wreathPolicy={ann.wreathPolicy}
          wreathPolicies={wreathPolicies}
          showWreathPolicy={showWreathPolicy}
          isWedding={isWedding}
        />
        </FramedAnnouncementCard>
      ) : null}

      {/* 2. Recent Gallery Snippet */}
      {enabledFeatures.gallery && recentPhotos.length > 0 && (
        <div className={`${FEATURE_CARD_CLASS} rounded-3xl border border-stone-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] text-left space-y-5 sm:p-8 sm:space-y-6`}>
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <h2 className="text-xl font-bold flex items-center gap-2"
                style={{ color: 'var(--theme-primary, #0d9488)' }}>
              <Image className="w-5 h-5 text-emerald-700" style={{ color: 'var(--theme-primary)' }} /> {galleryHeading}
            </h2>
            <Link 
              href={`/${slug}/gallery`}
              className="hidden sm:inline-flex text-xs font-bold transition items-center gap-1 hover:underline flex-shrink-0"
              style={{ color: 'var(--theme-primary, #0d9488)' }}
            >
              <span>ดูแกลเลอรีทั้งหมด</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <RecentGalleryBento
            items={recentPhotos.map((m, idx) => ({
              id: m.id,
              fileName: m.fileName,
              displayUrl: getDisplayUrl(m.filePath, m.mimeType, idx),
            }))}
          />

          <div className="flex justify-end sm:hidden">
            <Link 
              href={`/${slug}/gallery`}
              className="text-xs font-bold transition flex items-center gap-1 hover:underline"
              style={{ color: 'var(--theme-primary, #0d9488)' }}
            >
              <span>ดูแกลเลอรีทั้งหมด</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* 3. Featured Ebooks Snippet */}
      {enabledFeatures.ebooks && recentEbooks.length > 0 && (
        <FeaturedEbooksSnippet
          slug={slug}
          title={ebooksTitle}
          ctaText={ebooksCtaText}
          books={recentEbooks}
        />
      )}

      {/* 4. Recent Condolences Quote Snippet */}
      {enabledFeatures.condolence && (
        <CondolenceSectionShell
          category={tenant.category}
          className="text-left shadow-[0_4px_20px_rgba(0,0,0,0.015)]"
          contentClassName="space-y-6"
        >
          <div className="flex justify-between items-center border-b border-stone-100/90 pb-3">
            <h2 className="text-xl font-bold flex items-center gap-2"
                style={{ color: 'var(--theme-primary, #0d9488)' }}>
              <Flame className="w-5 h-5 animate-pulse" style={{ color: 'var(--theme-primary)' }} /> {condolenceHeading}
            </h2>
            <Link 
              href={`/${slug}/condolence`}
              className="hidden sm:inline-flex text-xs font-bold transition items-center gap-1 hover:underline flex-shrink-0"
              style={{ color: 'var(--theme-primary, #0d9488)' }}
            >
              <span>{condolenceViewAll}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentCondolences.length === 0 ? (
            <div className="text-center py-8 text-stone-500 text-sm border border-dashed border-stone-200 rounded-2xl">
              {condolenceEmpty}
            </div>
          ) : (
            <div className="divide-y divide-stone-100/90">
              {recentCondolences.map((c) => (
                <div key={c.id} className="py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 select-none items-center justify-center rounded-full bg-stone-200 text-xs font-black uppercase text-stone-700">
                        {c.senderName.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="flex items-center gap-1.5 text-xs font-extrabold text-stone-850">
                          <span>{c.senderName}</span>
                          {c.type === 'FAMILY' && (
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-700">ครอบครัว</span>
                          )}
                        </h4>
                        {tenant.category !== 'Pet Memorial' && c.relationship && c.relationship !== '—' && (
                          <p className="text-xs text-stone-400">ความสัมพันธ์: {c.relationship}</p>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-xs text-stone-400">
                      {new Date(c.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="mt-3 pl-1 text-xs italic leading-relaxed text-stone-650">
                    &ldquo;{c.message}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/${slug}/condolence`}
              className="flex-1 px-5 py-3 rounded-xl font-bold text-center border border-stone-200 hover:bg-stone-50 transition text-xs text-stone-750 shadow-sm"
            >
              {condolenceOpenAll}
            </Link>
            <Link
              href={`/${slug}/condolence`}
              className="flex-1 px-5 py-3 rounded-xl font-bold text-center text-white hover:brightness-105 active:scale-95 transition text-xs shadow-md"
              style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
            >
              {condolenceCta}
            </Link>
          </div>
        </CondolenceSectionShell>
      )}

      {/* 5. Pet profiles + Biography */}
      {tenant.category === 'Pet Memorial' && petProfiles.some((s) => s?.name) && (
        <section className={`${FEATURE_CARD_CLASS} space-y-8 rounded-3xl border border-stone-200/80 bg-white p-6 text-left shadow-sm sm:p-8`}>
          <div className="mx-auto max-w-2xl space-y-2 text-center">
            <h2
              className="flex items-center justify-center gap-2 text-xl font-black"
              style={{ color: 'var(--theme-primary, #0d9488)' }}
            >
              <PawPrint className="h-5 w-5" aria-hidden />
              สมุดประจำตัวน้อง
            </h2>
            <p className="text-sm font-medium leading-relaxed text-stone-500">
              ทุกอุ้งเท้ามีเรื่องราว — ทำความรู้จักสมาชิกตัวน้อยของบ้านเรา
            </p>
          </div>

          <div
            className={`grid grid-cols-1 gap-6 ${
              petProfiles.filter((s) => s?.name).length > 1
                ? 'md:grid-cols-2'
                : 'mx-auto w-full max-w-xl'
            }`}
          >
            {petProfiles
              .filter((s) => s?.name)
              .map((s, i) => (
                <PetProfileCard
                  key={`${s.name}-${i}`}
                  subject={s}
                  index={i}
                  fallbackAvatar={config?.avatarUrl}
                />
              ))}
          </div>
        </section>
      )}

      {(() => {
        const lifeData = normalizeLifeStory(config?.lifeStory, config?.biography || '');
        if (
          categoryUsesLifeStory(tenant.category) &&
          lifeStoryHasContent(lifeData, tenant.category)
        ) {
          return <LifeStorySection data={lifeData} category={tenant.category} />;
        }
        return (
          <div className={`${FEATURE_CARD_CLASS} rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)] text-left`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"
                style={{ color: 'var(--theme-primary, #0d9488)' }}>
              <BookOpen className="w-5 h-5 text-emerald-700" style={{ color: 'var(--theme-primary)' }} /> {biographyHeading}
            </h2>
            <p className="text-stone-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {displayBiography}
            </p>
          </div>
        );
      })()}

    </div>
  );
}
