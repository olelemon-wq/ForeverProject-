import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Calendar, Info, Share2 } from 'lucide-react';
import React from 'react';
import AnnouncementControls from './AnnouncementControls';
import CoupleJourneyCard from '@/components/announcement/CoupleJourneyCard';
import FriendsMeetupCard from '@/components/announcement/FriendsMeetupCard';
import MemorialScheduleCard from '@/components/announcement/MemorialScheduleCard';
import { getEnabledFeatures } from '@/lib/features';
import { getCoupleMilestonesFromAnnouncement } from '@/lib/coupleMilestones';
import { resolveAnnouncementCardTheme } from '@/lib/announcementCardTheme';
import { resolveMediaSrc } from '@/lib/mediaUrl';
import { ANNOUNCEMENT_CARD_CLASS } from '@/lib/publicLayout';

export const dynamic = 'force-dynamic';

async function getTenantData(slug: string) {
  return await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
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
      title: 'กำหนดการอำลาและการเดินทางกลับดาว',
      item1: '1. พิธีอำลา / กล่าวคำอาลัย',
      item2: '2. พิธีฌาปนกิจสัตว์เลี้ยง',
      item3: '3. พิธีลอยอังคารอัฐิ / โปรยเถ้ากระดูก',
      venueTitle: 'สถานที่จัดพิธี (VENUE)',
      venueLabel: 'วัดจัดพิธี / สถานที่จัดงาน',
      pavilionLabel: 'ศาลา / โซนจัดพิธี (ถ้ามี)',
      venueDesc: 'กรุณาคลิกปุ่มนำทางเพื่อความสะดวกในการเดินทางมายังสถานที่จัดงาน',
      footerText: 'ขอขอบคุณทุกท่านที่มาร่วมส่งน้องกลับดาวและแบ่งปันความรัก — ครอบครัว',
      guidelinesTitle: 'ข้อแนะนำการร่วมส่งน้องกลับดาว',
      contactLabel: 'ติดต่อประสานงาน:',
    };
  }
  if (category === 'Family' || category === 'Family Legacy') {
    return {
      title: 'กำหนดการและวันรวมใจสายใยครอบครัว',
      item1: '1. กิจกรรมสืบสานประวัติศาสตร์ตระกูล',
      item2: '2. งานเลี้ยงพบปะสังสรรค์ครอบครัวใหญ่',
      item3: '3. พิธีการเคารพและรำลึกบรรพบุรุษ',
      venueTitle: 'สถานที่จัดงาน (VENUE)',
      venueLabel: 'สถานที่นัดหมาย / บ้านครอบครัว',
      pavilionLabel: 'ห้องประชุม / ห้องจัดเลี้ยง (ถ้ามี)',
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
      pavilionLabel: 'โซน / ห้อง (ถ้ามี)',
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
    venueTitle: 'สถานที่จัดพิธี (Venue)',
    venueLabel: 'วัดจัดพิธี',
    pavilionLabel: 'ศาลาที่จัดงาน',
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
  if (category === 'Pet Memorial') return 'เรียนเชิญร่วมส่งน้องเดินทางกลับดาว';
  if (category === 'Family' || category === 'Family Legacy') return 'เชิญชวนร่วมพบปะและสืบสานสายใยครอบครัว';
  return 'กราบเรียนเชิญด้วยความเคารพอย่างสูง';
};

export default async function PublicAnnouncementPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  const sLabels = getScheduleLabels(tenant.category);

  const enabledFeatures = getEnabledFeatures(tenant.themeConfig, tenant);
  if (!enabledFeatures.announcement) {
    notFound();
  }

  const themeConfig = tenant.themeConfig as any;
  const announcement = themeConfig?.announcement;

  if (!announcement || !announcement.active) {
    return (
      <div className="space-y-8 animate-fade-in text-center py-16">
        <div className="max-w-md mx-auto rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <Info className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-900 mb-1">ยังไม่มีประกาศกำหนดการ</h3>
          <p className="text-xs text-stone-500">เจ้าภาพยังไม่ได้เปิดใช้งานหน้าการ์ดแจ้งกำหนดการสวดพระอภิธรรมและฌาปนกิจออนไลน์สำหรับเว็บไซต์นี้</p>
        </div>
      </div>
    );
  }

  if (announcement.mode === 'custom' && announcement.customCardUrl) {
    return (
      <div className="space-y-8 animate-fade-in print:p-0 print:m-0 print:bg-white print:shadow-none print-outer-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
          <div>
            <h4 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
              <span>การ์ดกำหนดการ</span>
            </h4>
            <p className="text-[10px] text-stone-500">คุณสามารถพิมพ์ เซฟเป็น PDF หรือคัดลอกลิงก์เพื่อส่งต่อทาง LINE/Facebook ได้ทันทีค่ะ</p>
          </div>
          <AnnouncementControls slug={slug} />
        </div>

        <section
          id="announcement-card"
          className={`${ANNOUNCEMENT_CARD_CLASS} rounded-3xl border border-stone-200 overflow-hidden shadow-md bg-white print-card-section`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveMediaSrc(announcement.customCardUrl)}
            alt="การ์ดกำหนดการ"
            className="w-full h-auto object-contain block"
          />
        </section>
      </div>
    );
  }

  const cardTheme = resolveAnnouncementCardTheme(tenant.category, announcement.style);
  const avatarUrl = themeConfig?.avatarUrl;
  const avatarScale = themeConfig?.avatarScale || 1;
  const avatarX = themeConfig?.avatarX || 0;
  const avatarY = themeConfig?.avatarY || 0;
  const avatarRotate = themeConfig?.avatarRotate || 0;

  const isFriends = tenant.category === 'Friends';
  const isCouple = tenant.category === 'Couple';
  const isWedding = tenant.category === 'Wedding';
  const coupleMilestones = isCouple ? getCoupleMilestonesFromAnnouncement(announcement) : [];
  const wreathPolicies: Record<string, string> = isWedding
    ? {
        NORMAL: 'ยินดีรับซองและของขวัญแสดงความยินดีตามปกติ',
        NO_FLOWERS: 'ขออภัย เจ้าภาพงดรับของขวัญ (เน้นการร่วมแสดงความยินดีและอวยพรแทน)',
        DONATION_ONLY: 'ขออภัย เจ้าภาพงดรับของขวัญ (ร่วมสมทบทุนมูลนิธิแทน)',
        NO_WREATH: 'ขออภัย เจ้าภาพงดรับซองและของขวัญทุกประเภท',
      }
    : {
        NORMAL: 'เปิดรับพวงหรีดแสดงความอาลัยตามปกติ',
        NO_FLOWERS: 'เจ้าภาพขอความร่วมมืองดรับพวงหรีดดอกไม้สด (เพื่อร่วมรักษ์โลก)',
        DONATION_ONLY: 'เจ้าภาพขอความร่วมมืองดรับพวงหรีด (ร่วมทำบุญสมทบทุนแทน)',
        NO_WREATH: 'เจ้าภาพขอความร่วมมืองดรับพวงหรีดทุกประเภท',
      };
  const showWreathPolicy = isWedding && !!announcement.wreathPolicy;

  return (
    <div className="space-y-8 animate-fade-in print:p-0 print:m-0 print:bg-white print:shadow-none print-outer-container">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page {
            size: portrait;
            margin: 8mm 12mm !important;
          }
          html, body {
            background: #fff !important;
            color: #000 !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
          }
          .print-outer-container {
            padding: 0 !important;
            margin: 0 !important;
            background: none !important;
            box-shadow: none !important;
          }
          .print-card-section {
            max-width: 100% !important;
            width: 100% !important;
            box-shadow: none !important;
            border: 1px solid #C2A878 !important;
            border-radius: 1.5rem !important;
            padding: 1.5rem 2.25rem !important;
            margin: 0 auto !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-avatar-container {
            width: 76px !important;
            height: 76px !important;
            border-width: 2px !important;
          }
        }
      `,
        }}
      />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-stone-200/85 p-4 rounded-2xl shadow-xs print:hidden">
        <div className="text-left space-y-0.5">
          <h4 className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              {tenant.category === 'Couple'
                ? 'การ์ดบันทึกวันสำคัญออนไลน์'
                : tenant.category === 'Wedding'
                  ? 'การ์ดเชิญ & กำหนดการออนไลน์'
                  : 'การ์ดกำหนดการดิจิทัลออนไลน์'}
            </span>
          </h4>
          <p className="text-[10px] text-stone-500">
            คุณสามารถพิมพ์ เซฟเป็น PDF หรือคัดลอกลิงก์เพื่อส่งต่อทาง LINE/Facebook ได้ทันทีค่ะ
          </p>
        </div>
        <AnnouncementControls slug={slug} />
      </div>

      {isCouple ? (
        <CoupleJourneyCard
          tenantName={tenant.name}
          inviteText={announcement.text}
          inviteFallback={getInviteFallback(tenant.category)}
          footerText={sLabels.footerText}
          theme={cardTheme}
          milestones={coupleMilestones}
          timelineTitle="เส้นทางที่ผ่านมา"
          fontFamily={announcement?.fontFamily}
          siteFontFamily={themeConfig?.fontFamily}
          avatarUrl={avatarUrl}
          avatarScale={avatarScale}
          avatarX={avatarX}
          avatarY={avatarY}
          avatarRotate={avatarRotate}
          imageCoordSpace={themeConfig?.imageCoordSpace}
          notes={announcement.dressCode}
          contactPhone={announcement.contactPhone}
          className="print-card-section print:shadow-none print:my-0 print:mx-auto print:max-w-3xl"
        />
      ) : isFriends ? (
        <FriendsMeetupCard
          tenantName={tenant.name}
          inviteText={announcement.text}
          inviteFallback={getInviteFallback(tenant.category)}
          footerText={sLabels.footerText}
          theme={cardTheme}
          fontFamily={announcement?.fontFamily}
          siteFontFamily={themeConfig?.fontFamily}
          avatarUrl={avatarUrl}
          avatarScale={avatarScale}
          avatarX={avatarX}
          avatarY={avatarY}
          avatarRotate={avatarRotate}
          imageCoordSpace={themeConfig?.imageCoordSpace}
          meetupDate={announcement.waterDate}
          meetupTime={announcement.waterTime}
          venueName={announcement.templeName}
          venueDetail={announcement.pavilion}
          mapLink={announcement.mapLink}
          notes={announcement.dressCode}
          contactPhone={announcement.contactPhone}
        />
      ) : (
        <MemorialScheduleCard
          category={tenant.category}
          tenantName={tenant.name}
          inviteText={announcement.text}
          inviteFallback={getInviteFallback(tenant.category)}
          labels={sLabels}
          theme={cardTheme}
          fontFamily={announcement?.fontFamily}
          siteFontFamily={themeConfig?.fontFamily}
          avatarUrl={avatarUrl}
          avatarScale={avatarScale}
          avatarX={avatarX}
          avatarY={avatarY}
          avatarRotate={avatarRotate}
          imageCoordSpace={themeConfig?.imageCoordSpace}
          waterDate={announcement.waterDate}
          waterTime={announcement.waterTime}
          abhidhammaDateRange={announcement.abhidhammaDateRange}
          abhidhammaTime={announcement.abhidhammaTime}
          cremationDate={announcement.cremationDate}
          cremationTime={announcement.cremationTime}
          templeName={announcement.templeName}
          pavilion={announcement.pavilion}
          mapLink={announcement.mapLink}
          dressCode={announcement.dressCode}
          contactPhone={announcement.contactPhone}
          wreathPolicy={announcement.wreathPolicy}
          wreathPolicies={wreathPolicies}
          showWreathPolicy={showWreathPolicy}
          isWedding={isWedding}
          sectionClassName="print-card-section print:shadow-none print:my-0 print:mx-auto print:max-w-3xl"
        />
      )}
    </div>
  );
}
