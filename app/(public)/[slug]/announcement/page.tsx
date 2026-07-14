import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { 
  Calendar, MapPin, Phone, Info, Share2, Printer, 
  ExternalLink, Droplets, Flame, Sparkles 
} from 'lucide-react';
import React from 'react';
import AnnouncementControls from './AnnouncementControls';
import DeceasedAvatar from './DeceasedAvatar';
import { getEnabledFeatures } from '@/lib/features';

export const dynamic = 'force-dynamic';

async function getTenantData(slug: string) {
  return await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
}

const getScheduleLabels = (category: string) => {
  if (category === 'Couple' || category === 'Wedding') {
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
    };
  }
  if (category === 'Friends') {
    return {
      title: 'กำหนดการและกิจกรรมนัดพบวันวาน',
      item1: '1. กิจกรรมย้อนรอยความทรงจำวัยเรียน',
      item2: '2. งานเลี้ยงสังสรรค์พบปะเพื่อนร่วมรุ่น',
      item3: '3. กิจกรรมถ่ายภาพที่ระลึกและแลกของขวัญ',
      venueTitle: 'สถานที่จัดงาน (VENUE)',
      venueLabel: 'สถานที่จัดงาน / ร้านอาหาร',
      pavilionLabel: 'โซนที่นั่ง / ห้องจัดเลี้ยง (ถ้ามี)',
      venueDesc: 'กรุณาคลิกปุ่มนำทางเพื่อความสะดวกในการเดินทางมายังสถานที่จัดงาน',
      footerText: 'ขอขอบคุณเพื่อน ๆ ทุกคนที่ร่วมแบ่งปันความรักและมิตรภาพวันวาน — กลุ่มเพื่อน',
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
  };
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

  // Fallback if not active but feature is enabled
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

  // Parse template colors
  let cardBgClass = 'bg-white border-stone-200 text-stone-900';
  let textMutedClass = 'text-stone-500';
  let headingColorClass = 'text-stone-900';
  let innerCardBg = 'bg-stone-50/60 border-stone-200/80';
  let borderGoldClass = 'border-amber-600/30';

  if (announcement.style === 'CHARCOAL_SLATE') {
    cardBgClass = 'bg-stone-900 border-stone-800 text-[#C2A878] shadow-[0_10px_30px_rgba(0,0,0,0.4)]';
    textMutedClass = 'text-[#C2A878]/80';
    headingColorClass = 'text-[#C2A878]';
    innerCardBg = 'bg-stone-850/65 border-[#C2A878]/20';
    borderGoldClass = 'border-[#C2A878]/45';
  } else if (announcement.style === 'WARM_CREAM') {
    cardBgClass = 'bg-[#FAF6EE] border-[#EADFC9] text-[#4A3E29]';
    textMutedClass = 'text-[#7D6B4E]';
    headingColorClass = 'text-[#362C1A]';
    innerCardBg = 'bg-[#F3EBD9]/60 border-[#E5D7B7]';
    borderGoldClass = 'border-[#C2A878]/30';
  }

  // Deceased Image config
  const avatarUrl = themeConfig?.avatarUrl;
  const avatarScale = themeConfig?.avatarScale || 1;
  const avatarX = themeConfig?.avatarX || 0;
  const avatarY = themeConfig?.avatarY || 0;
  const avatarRotate = themeConfig?.avatarRotate || 0;

  // Wreath/Gift policy localization
  const wreathPolicies: Record<string, string> = (tenant.category === 'Couple' || tenant.category === 'Wedding') ? {
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

  const cardStyles: React.CSSProperties = {
    fontFamily: announcement?.fontFamily || 'var(--theme-font)',
  };
  if (announcement?.style === 'CHARCOAL_SLATE') {
    cardStyles.backgroundImage = 'url(/Template-cards/charcoal_gold.png)';
    cardStyles.backgroundSize = 'cover';
    cardStyles.backgroundPosition = 'center';
  }

  return (
    <div className="space-y-8 animate-fade-in print:p-0 print:m-0 print:bg-white print:shadow-none print-outer-container">
      <style dangerouslySetInnerHTML={{ __html: `
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
          .print-space-y-tight > * + * {
            margin-top: 0.55rem !important;
          }
          .print-header-tight {
            margin-bottom: 0.35rem !important;
          }
          .print-header-tight > * + * {
            margin-top: 0.15rem !important;
          }
          .print-inner-card-grid {
            gap: 0.35rem !important;
          }
          .print-inner-card-tight {
            padding: 0.5rem 0.75rem !important;
            border-radius: 0.75rem !important;
          }
          .print-avatar-container {
            width: 76px !important;
            height: 76px !important;
            border-width: 2px !important;
          }
          .print-card-section h2 {
            font-size: 1.35rem !important;
          }
          .print-card-section h3 {
            font-size: 0.75rem !important;
          }
          .print-card-section h4 {
            font-size: 0.7rem !important;
          }
          .print-card-section p, 
          .print-card-section span, 
          .print-card-section div {
            font-size: 0.72rem !important;
          }
          .print-card-section .text-\\[10px\\] {
            font-size: 8px !important;
          }
          .print-card-section footer {
            padding-top: 0.5rem !important;
          }
        }
      `}} />
      
      {/* Top Banner controls (hidden during print) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-stone-200/85 p-4 rounded-2xl shadow-xs print:hidden">
        <div className="text-left space-y-0.5">
          <h4 className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>การ์ดกำหนดการดิจิทัลออนไลน์</span>
          </h4>
          <p className="text-[10px] text-stone-500">คุณสามารถพิมพ์ เซฟเป็น PDF หรือคัดลอกลิงก์เพื่อส่งต่อทาง LINE/Facebook ได้ทันทีค่ะ</p>
        </div>
        <AnnouncementControls slug={slug} />
      </div>

      {/* Main Invitation Card Container */}
      <section 
        id="announcement-card"
        className={`max-w-2xl mx-auto rounded-3xl border-2 p-8 sm:p-12 shadow-md relative overflow-hidden transition-all duration-300 print:border-stone-300 print:shadow-none print:my-0 print:mx-auto print:max-w-3xl print-card-section ${cardBgClass}`}
        style={cardStyles}
      >
        {/* Decorative corner lines */}
        {announcement?.style !== 'CHARCOAL_SLATE' && (
          <>
            <div className={`absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 pointer-events-none rounded-tl-lg ${borderGoldClass}`} />
            <div className={`absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 pointer-events-none rounded-tr-lg ${borderGoldClass}`} />
            <div className={`absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 pointer-events-none rounded-bl-lg ${borderGoldClass}`} />
            <div className={`absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 pointer-events-none rounded-br-lg ${borderGoldClass}`} />
          </>
        )}
        
        <div className="text-center space-y-6 print-space-y-tight relative z-10">
          
          <header className="space-y-4 print-header-tight">
            <span className="text-[10px] font-black tracking-widest uppercase opacity-85 block">กราบเรียนเชิญด้วยความเคารพอย่างสูง</span>
            <DeceasedAvatar
              avatarUrl={avatarUrl}
              avatarScale={avatarScale}
              avatarX={avatarX}
              avatarY={avatarY}
              avatarRotate={avatarRotate}
              imageCoordSpace={themeConfig?.imageCoordSpace}
              tenantName={tenant.name}
              primaryColor="var(--theme-primary, #0d9488)"
            />
            
            <div className="space-y-1">
              <h2 className={`text-2xl sm:text-3xl font-black ${headingColorClass}`}>
                {(() => {
                  const match = tenant.name.match(/^(ด้วยรักและคิดถึง|ด้วยรักและอาลัย|ร่วมรำลึกถึง|รำลึกถึง|คิดถึง|อาลัยแด่)\s*(.*)$/);
                  if (match) {
                    return (
                      <>
                        <span className="block sm:inline">{match[1]}</span>
                        <span className="hidden sm:inline"> </span>
                        <span className="block sm:inline">{match[2]}</span>
                      </>
                    );
                  }
                  return tenant.name;
                })()}
              </h2>
              {announcement.text && (() => {
                const deceasedName = tenant.name.replace(/^(ด้วยรักและคิดถึง|ด้วยรักและอาลัย|ร่วมรำลึกถึง|รำลึกถึง|คิดถึง|อาลัยแด่)\s*/, '');
                if (deceasedName && announcement.text.includes(deceasedName)) {
                  const index = announcement.text.indexOf(deceasedName);
                  const beforeName = announcement.text.substring(0, index);
                  const nameAndAfter = announcement.text.substring(index);
                  return (
                    <p className={`text-sm leading-relaxed max-w-md mx-auto whitespace-pre-line ${textMutedClass}`}>
                      {beforeName}
                      <br className="hidden sm:inline" />
                      {nameAndAfter}
                    </p>
                  );
                }
                return (
                  <p className={`text-sm leading-relaxed max-w-md mx-auto whitespace-pre-line ${textMutedClass}`}>
                    {announcement.text}
                  </p>
                );
              })()}
            </div>
          </header>

          <hr className={`border-t ${borderGoldClass}`} />

          {/* Ceremony Schedule */}
          <div className="space-y-4 text-left">
            <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${headingColorClass}`}>
              <Calendar className="w-4 h-4" />
              <span>{sLabels.title}</span>
            </h3>

            <div className="grid grid-cols-1 gap-3 print-inner-card-grid">
              {/* 1. Water Ceremony */}
              {announcement.waterDate && (
                <div className={`p-4 print-inner-card-tight rounded-2xl border ${innerCardBg}`}>
                  <h4 className={`text-xs font-bold ${headingColorClass}`}>{sLabels.item1}</h4>
                  <p className={`text-sm mt-0.5 font-bold ${headingColorClass}`}>
                    {announcement.waterDate} {announcement.waterTime && `เวลา ${announcement.waterTime}`}
                  </p>
                </div>
              )}

              {/* 2. Abhidhamma Ceremony */}
              {announcement.abhidhammaDateRange && (
                <div className={`p-4 print-inner-card-tight rounded-2xl border ${innerCardBg}`}>
                  <h4 className={`text-xs font-bold ${headingColorClass}`}>{sLabels.item2}</h4>
                  <p className={`text-sm mt-0.5 font-bold ${headingColorClass}`}>
                    {announcement.abhidhammaDateRange} {announcement.abhidhammaTime && `เวลา ${announcement.abhidhammaTime}`}
                  </p>
                </div>
              )}

              {/* 3. Cremation Ceremony */}
              {announcement.cremationDate && (
                <div className={`p-4 print-inner-card-tight rounded-2xl border ${innerCardBg}`}>
                  <h4 className={`text-xs font-bold ${headingColorClass}`}>{sLabels.item3}</h4>
                  <p className={`text-sm mt-0.5 font-bold ${headingColorClass}`}>
                    {announcement.cremationDate} {announcement.cremationTime && `เวลา ${announcement.cremationTime}`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Location & Directions */}
          {(announcement.templeName || announcement.pavilion) && (
            <div className="space-y-3 text-left">
              <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${headingColorClass}`}>
                <MapPin className="w-4 h-4" />
                <span>{sLabels.venueTitle}</span>
              </h3>
              
              <div className={`p-4 print-inner-card-tight rounded-2xl border ${innerCardBg} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
                <div>
                  <h4 className={`text-sm font-bold ${headingColorClass}`}>
                    {announcement.templeName || sLabels.venueLabel} {announcement.pavilion && `(${announcement.pavilion})`}
                  </h4>
                  <p className={`text-xs mt-0.5 ${textMutedClass}`}>
                    {sLabels.venueDesc}
                  </p>
                </div>
                {announcement.mapLink && (
                  <a 
                    href={announcement.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 bg-stone-900 hover:bg-black text-white dark:bg-white dark:hover:bg-stone-50 dark:text-stone-900 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition print:hidden cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>เปิด Google Maps นำทาง</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Guidelines Block */}
          <div className="space-y-3 text-left">
            <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${headingColorClass}`}>
              <Info className="w-4 h-4" />
              <span>
                {tenant.category === 'Couple' || tenant.category === 'Wedding'
                  ? 'คำแนะนำการร่วมแสดงความยินดี'
                  : 'ข้อแนะนำการร่วมแสดงความอาลัย'}
              </span>
            </h3>

            <div className={`p-4 print-inner-card-tight rounded-2xl border text-xs space-y-3.5 ${innerCardBg}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {announcement.dressCode && (
                  <div className="flex flex-col gap-0.5">
                    <span className={`font-bold ${headingColorClass}`}>การแต่งกาย:</span>
                    <span className={textMutedClass}>{announcement.dressCode}</span>
                  </div>
                )}
                {announcement.wreathPolicy && (
                  <div className="flex flex-col gap-0.5">
                    <span className={`font-bold ${headingColorClass}`}>
                      {tenant.category === 'Couple' || tenant.category === 'Wedding' ? 'ของขวัญ / ซอง:' : 'นโยบายพวงหรีด:'}
                    </span>
                    <span className={textMutedClass}>{wreathPolicies[announcement.wreathPolicy] || wreathPolicies.NORMAL}</span>
                  </div>
                )}
              </div>
              {announcement.contactPhone && (
                <div className="flex gap-2 border-t border-stone-200/50 pt-3 mt-3 items-center">
                  <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--theme-primary, #0d9488)' }} />
                  <span className={`font-bold shrink-0 ${headingColorClass}`}>ติดต่อประสานงานเจ้าภาพ:</span>
                  <span className={textMutedClass}>{announcement.contactPhone}</span>
                </div>
              )}
            </div>
          </div>

          <footer className="pt-4 text-center">
            <p className={`text-[9px] font-bold tracking-wider uppercase ${textMutedClass}`}>
              {sLabels.footerText}
            </p>
          </footer>

        </div>
      </section>
    </div>
  );
}
