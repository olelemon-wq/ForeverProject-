import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { 
  BookOpen, Calendar, MapPin, Image, Flame, ArrowRight,
  Phone, Info, Share2, Printer, ExternalLink, Droplets, Sparkles 
} from 'lucide-react';
import Link from 'next/link';
import DeceasedAvatar from './announcement/DeceasedAvatar';
import { getEnabledFeatures } from '@/lib/features';
import { getCategoryJourney } from '@/lib/categories';

export const dynamic = 'force-dynamic';

async function getTenantData(slug: string) {
  return await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
}

async function getRecentGallery(websiteId: string) {
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
    take: 4,
  });

  return medias.map(m => ({
    id: m.id,
    filePath: m.filePath,
    fileName: m.fileName,
    mimeType: m.mimeType,
  }));
}

function getDisplayUrl(filePath: string, mimeType: string, index: number) {
  return filePath;
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
      venueDesc: 'กรุณาคลิกปุ่มนำทางเพื่อความสะดวกในการเดินทางมายังสถานที่จัดงาน',
      footerText: 'ขอขอบคุณเพื่อน ๆ ทุกคนที่ร่วมแบ่งปันความรักและมิตรภาพวันวาน — กลุ่มเพื่อน',
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
  };
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

  let mockBooklets = [
    {
      id: 'book-1',
      title: 'หนังสือธรรมะรำลึกและคำสอนสติ',
      author: 'ครอบครัวเจริญยิ่ง',
      totalPages: 4,
    },
    {
      id: 'book-2',
      title: 'บันทึกประวัติความทรงจำและคำขอบคุณ',
      author: 'คณะผู้จัดทำ',
      totalPages: 3,
    },
  ];

  if (category === 'Couple' || category === 'Wedding') {
    mockBooklets = [
      {
        id: 'book-1',
        title: 'บันทึกความทรงจำและคำขอบคุณพรีเวดดิ้ง',
        author: 'คู่บ่าวสาว',
        totalPages: 4,
      },
      {
        id: 'book-2',
        title: 'เรื่องราวเส้นทางความรักของสองเรา',
        author: 'คู่รัก',
        totalPages: 3,
      },
    ];
  } else if (category === 'Pet Memorial') {
    mockBooklets = [
      {
        id: 'book-1',
        title: 'ไดอารี่บันทึกการเดินทางกลับดาวของหนู',
        author: 'เจ้าของอันเป็นที่รัก',
        totalPages: 4,
      },
      {
        id: 'book-2',
        title: 'รวมโมเมนต์แสนซนและรอยยิ้มสี่ขา',
        author: 'ครอบครัวน้อง',
        totalPages: 3,
      },
    ];
  } else if (category === 'Friends') {
    mockBooklets = [
      {
        id: 'book-1',
        title: 'หนังสือรุ่นและบันทึกมิตรสหายเฟรนด์ชิป',
        author: 'แก๊งเพื่อนรัก',
        totalPages: 4,
      },
      {
        id: 'book-2',
        title: 'บันทึกวีรกรรมความทรงจำแสนเกรียน',
        author: 'กลุ่มเพื่อนสนิท',
        totalPages: 3,
      },
    ];
  }

  const mappedDbEbooks = dbEbooks.map(eb => ({
    id: eb.id,
    title: eb.title,
    author: eb.author,
    totalPages: eb.totalPages,
  }));

  return [...mappedDbEbooks, ...mockBooklets].slice(0, 2);
}

export default async function PublicMemorialHome(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  // Parallel database fetching
  const [recentPhotos, recentCondolences, recentEbooks] = await Promise.all([
    getRecentGallery(tenant.id),
    getRecentCondolences(tenant.id),
    getRecentEbooks(tenant.id, tenant.category),
  ]);

  const config = tenant.themeConfig as any;
  const sLabels = getScheduleLabels(tenant.category);
  const enabledFeatures = getEnabledFeatures(config, tenant);
  const displayBiography = config?.biography || (() => {
    if (tenant.category === 'Couple' || tenant.category === 'Wedding') {
      return "เรื่องราวความรักของเราสองคน เริ่มต้นจากการพบกันครั้งแรก และร่วมเดินทางเติมเต็มรอยยิ้มและสร้างความทรงจำที่อบอุ่นด้วยกันในทุกวัน...";
    }
    if (tenant.category === 'Pet Memorial') {
      return "เรื่องราวของสัตว์เลี้ยงแสนรักผู้เป็นสมาชิกคนสำคัญของบ้าน น้องคอยมอบพลังบวก รอยยิ้ม และความรักที่ไม่มีเงื่อนไขให้กับเราในทุกช่วงเวลา...";
    }
    if (tenant.category === 'Family Legacy') {
      return "บันทึกเรื่องราวประวัติวงศ์ตระกูล บรรพบุรุษผู้บุกเบิก และมรดกทางคำสอนอันทรงคุณค่าที่สืบทอดสายใยความผูกพันจากรุ่นสู่รุ่น...";
    }
    if (tenant.category === 'Friends') {
      return "บันทึกเรื่องราวการเดินทางของมิตรภาพและเพื่อนฝูง รวบรวมทุกวีรกรรม เสียงหัวเราะ และความทรงจำวันวานที่ไม่มีวันจางหาย...";
    }
    return "คุณพ่อสมศักดิ์เป็นคนขยัน ซื่อสัตย์ และรักครอบครัวมาก ท่านเป็นผู้นำที่ดีและเสียสละเสมอเพื่อการศึกษาของลูกๆ ความดีงามและคำสั่งสอนของท่านจะคงอยู่ในการดำเนินชีวิตของพวกเราตลอดไป...";
  })();
  
  const journey = getCategoryJourney(tenant.category);
  const homeCopy = journey.home || {};
  
  const subjects = config?.subjects || [];
  const allSubjectsAlive = subjects.length > 0 && subjects.every((s: any) => s.isAlive);
  const isHappy = tenant.category === 'Couple' || tenant.category === 'Wedding' || (tenant.category === 'Pet Memorial' && allSubjectsAlive);

  const biographyHeading = isHappy 
    ? (tenant.category === 'Pet Memorial' ? 'เรื่องราวและช่วงเวลาแสนซน' : 'เรื่องราวประทับใจ') 
    : (homeCopy.biographyHeading || 'อาลัยและคำรำลึก');
  const condolenceHeading = isHappy 
    ? (tenant.category === 'Pet Memorial' ? 'สมุดเยี่ยมเยียนและข้อความถึงน้อง ๆ' : 'สมุดเยี่ยมเยียนและข้อความอวยพร') 
    : (homeCopy.condolenceHeading || 'ข้อความไว้อาลัยล่าสุด');
  const condolenceCta = isHappy 
    ? 'ส่งความรักและความปรารถนาดี' 
    : (homeCopy.condolenceCta || 'เขียนข้อความ/ร่วมจุดเทียนออนไลน์');
  const galleryHeading = homeCopy.galleryHeading || 'ภาพถ่ายความทรงจำล่าสุด';
  const ebooksTitle = (() => {
    if (tenant.category === 'Couple') return 'สมุดภาพความรักแนะนำ';
    if (tenant.category === 'Wedding') return 'ของชำร่วยออนไลน์และหนังสือที่ระลึกแนะนำ';
    if (tenant.category === 'Pet Memorial') return 'บันทึกการเดินทางของน้องและสมุดภาพแนะนำ';
    if (tenant.category === 'Friends') return 'หนังสือรุ่นและบันทึกความทรงจำแนะนำ';
    if (tenant.category === 'Family Legacy') return 'หนังสือประวัติตระกูลและบันทึกแนะนำ';
    return 'หนังสือที่ระลึกและธรรมทานแนะนำ';
  })();
  const ebooksCtaText = (() => {
    if (tenant.category === 'Couple') return 'ดูสมุดภาพทั้งหมด';
    if (tenant.category === 'Wedding') return 'ดูของชำร่วยทั้งหมด';
    if (tenant.category === 'Pet Memorial') return 'ดูบันทึกทั้งหมด';
    return 'อ่านหนังสือทั้งหมด';
  })();
  const ann = config?.announcement || {};
  const isAnnActive = enabledFeatures.announcement;

  // Parse template colors
  let cardBgClass = 'bg-white border-stone-200 text-stone-900';
  let textMutedClass = 'text-stone-500';
  let headingColorClass = 'text-stone-900';
  let innerCardBg = 'bg-stone-50/60 border-stone-200/80';
  let borderGoldClass = 'border-amber-600/30';
  let hasBackgroundImage = false;
  let bgImageUrl = '';

  if (ann.style === 'CHARCOAL_SLATE') {
    hasBackgroundImage = true;
    bgImageUrl = '/Template-cards/charcoal_gold.png';

    if (tenant.category === 'Couple' || tenant.category === 'Wedding') {
      cardBgClass = 'bg-[#FFF0F2] border-[#FBC5CD] text-[#8C3A4F] shadow-[0_10px_30px_rgba(251,197,205,0.3)]';
      textMutedClass = 'text-[#A25F70]';
      headingColorClass = 'text-[#8C3A4F]';
      innerCardBg = 'bg-[#FFF5F6]/70 border-[#FBC5CD]/40';
      borderGoldClass = 'border-[#FBC5CD]/60';
      hasBackgroundImage = false;
    } else if (tenant.category === 'Pet Memorial') {
      cardBgClass = 'bg-[#F2F6F3] border-[#C8D9CD] text-[#2C4A3E] shadow-[0_10px_30px_rgba(200,217,205,0.3)]';
      textMutedClass = 'text-[#4E7062]';
      headingColorClass = 'text-[#2C4A3E]';
      innerCardBg = 'bg-[#FAFDFB]/75 border-[#C8D9CD]/40';
      borderGoldClass = 'border-[#C8D9CD]/60';
      hasBackgroundImage = false;
    } else if (tenant.category === 'Family Legacy') {
      cardBgClass = 'bg-[#0D1F2D] border-[#2A445C] text-[#E0A96D] shadow-[0_10px_30px_rgba(0,0,0,0.4)]';
      textMutedClass = 'text-[#B5834C]';
      headingColorClass = 'text-[#E0A96D]';
      innerCardBg = 'bg-[#152E40]/65 border-[#2A445C]/40';
      borderGoldClass = 'border-[#2A445C]/60';
      hasBackgroundImage = false;
    } else if (tenant.category === 'Friends') {
      cardBgClass = 'bg-[#EAF4F4] border-[#A8D1D1] text-[#1E4848] shadow-[0_10px_30px_rgba(168,209,209,0.3)]';
      textMutedClass = 'text-[#3E7D7D]';
      headingColorClass = 'text-[#1E4848]';
      innerCardBg = 'bg-[#F4FAFA]/75 border-[#A8D1D1]/40';
      borderGoldClass = 'border-[#A8D1D1]/60';
      hasBackgroundImage = false;
    } else {
      cardBgClass = 'bg-stone-900 border-stone-800 text-[#C2A878] shadow-[0_10px_30px_rgba(0,0,0,0.4)]';
      textMutedClass = 'text-[#C2A878]/80';
      headingColorClass = 'text-[#C2A878]';
      innerCardBg = 'bg-stone-850/65 border-[#C2A878]/20';
      borderGoldClass = 'border-[#C2A878]/45';
    }
  } else if (ann.style === 'WARM_CREAM') {
    cardBgClass = 'bg-[#FAF6EE] border-[#EADFC9] text-[#4A3E29]';
    textMutedClass = 'text-[#7D6B4E]';
    headingColorClass = 'text-[#362C1A]';
    innerCardBg = 'bg-[#F3EBD9]/60 border-[#E5D7B7]';
    borderGoldClass = 'border-[#C2A878]/30';
  }

  // Deceased Image config
  const avatarUrl = config?.avatarUrl;
  const avatarScale = config?.avatarScale || 1;
  const avatarX = config?.avatarX || 0;
  const avatarY = config?.avatarY || 0;
  const avatarRotate = config?.avatarRotate || 0;

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
    fontFamily: ann?.fontFamily || 'var(--theme-font)',
  };
  if (ann?.style === 'CHARCOAL_SLATE' && hasBackgroundImage) {
    cardStyles.backgroundImage = `url(${bgImageUrl})`;
    cardStyles.backgroundSize = 'cover';
    cardStyles.backgroundPosition = 'center';
  }

  return (
    <div className="space-y-8 animate-fade-in text-center font-sans">
      
      {/* 1. Styled Announcement Invitation Card */}
      {isAnnActive && (
        <section 
          id="announcement-card"
          className={`max-w-2xl mx-auto rounded-3xl border-2 p-8 sm:p-12 shadow-md relative overflow-hidden text-center transition-all duration-300 ${cardBgClass}`}
          style={cardStyles}
        >
          {/* Decorative corner lines */}
          {!hasBackgroundImage && (
            <>
              <div className={`absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 pointer-events-none rounded-tl-lg ${borderGoldClass}`} />
              <div className={`absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 pointer-events-none rounded-tr-lg ${borderGoldClass}`} />
              <div className={`absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 pointer-events-none rounded-bl-lg ${borderGoldClass}`} />
              <div className={`absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 pointer-events-none rounded-br-lg ${borderGoldClass}`} />
            </>
          )}
          
          <div className="text-center space-y-6 relative z-10">
            
            <header className="space-y-4">
              <span className="text-[10px] font-black tracking-widest uppercase opacity-85 block">กราบเรียนเชิญด้วยความเคารพอย่างสูง</span>
              <DeceasedAvatar
                avatarUrl={avatarUrl}
                avatarScale={avatarScale}
                avatarX={avatarX}
                avatarY={avatarY}
                avatarRotate={avatarRotate}
                imageCoordSpace={config?.imageCoordSpace}
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
                {ann.text && (() => {
                  const deceasedName = tenant.name.replace(/^(ด้วยรักและคิดถึง|ด้วยรักและอาลัย|ร่วมรำลึกถึง|รำลึกถึง|คิดถึง|อาลัยแด่)\s*/, '');
                  if (deceasedName && ann.text.includes(deceasedName)) {
                    const index = ann.text.indexOf(deceasedName);
                    const beforeName = ann.text.substring(0, index);
                    const nameAndAfter = ann.text.substring(index);
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
                      {ann.text}
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

              <div className="grid grid-cols-1 gap-3">
                {/* 1. Water Ceremony */}
                {ann.waterDate && (
                  <div className={`p-4 rounded-2xl border ${innerCardBg}`}>
                    <h4 className={`text-xs font-bold ${headingColorClass}`}>{sLabels.item1}</h4>
                    <p className={`text-sm mt-0.5 font-bold ${headingColorClass}`}>
                      {ann.waterDate} {ann.waterTime && `เวลา ${ann.waterTime}`}
                    </p>
                  </div>
                )}

                {/* 2. Abhidhamma Ceremony */}
                {ann.abhidhammaDateRange && (
                  <div className={`p-4 rounded-2xl border ${innerCardBg}`}>
                    <h4 className={`text-xs font-bold ${headingColorClass}`}>{sLabels.item2}</h4>
                    <p className={`text-sm mt-0.5 font-bold ${headingColorClass}`}>
                      {ann.abhidhammaDateRange} {ann.abhidhammaTime && `เวลา ${ann.abhidhammaTime}`}
                    </p>
                  </div>
                )}

                {/* 3. Cremation Ceremony */}
                {ann.cremationDate && (
                  <div className={`p-4 rounded-2xl border ${innerCardBg}`}>
                    <h4 className={`text-xs font-bold ${headingColorClass}`}>{sLabels.item3}</h4>
                    <p className={`text-sm mt-0.5 font-bold ${headingColorClass}`}>
                      {ann.cremationDate} {ann.cremationTime && `เวลา ${ann.cremationTime}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Location & Directions */}
            {(ann.templeName || ann.pavilion) && (
              <div className="space-y-3 text-left">
                <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${headingColorClass}`}>
                  <MapPin className="w-4 h-4" />
                  <span>{sLabels.venueTitle}</span>
                </h3>
                
                <div className={`p-4 rounded-2xl border ${innerCardBg} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
                  <div>
                    <h4 className={`text-sm font-bold ${headingColorClass}`}>
                      {ann.templeName || sLabels.venueLabel} {ann.pavilion && `(${ann.pavilion})`}
                    </h4>
                    <p className={`text-xs mt-0.5 ${textMutedClass}`}>
                      {sLabels.venueDesc}
                    </p>
                  </div>
                  {ann.mapLink && (
                    <a 
                      href={ann.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-4 py-2.5 bg-stone-900 hover:bg-black text-white dark:bg-white dark:hover:bg-stone-50 dark:text-stone-900 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
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

              <div className={`p-4 rounded-2xl border text-xs space-y-3.5 ${innerCardBg}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {ann.dressCode && (
                    <div className="flex flex-col gap-0.5">
                      <span className={`font-bold ${headingColorClass}`}>การแต่งกาย:</span>
                      <span className={textMutedClass}>{ann.dressCode}</span>
                    </div>
                  )}
                  {ann.wreathPolicy && (
                    <div className="flex flex-col gap-0.5">
                      <span className={`font-bold ${headingColorClass}`}>
                        {tenant.category === 'Couple' || tenant.category === 'Wedding' ? 'ของขวัญ / ซอง:' : 'นโยบายพวงหรีด:'}
                      </span>
                      <span className={textMutedClass}>{wreathPolicies[ann.wreathPolicy] || wreathPolicies.NORMAL}</span>
                    </div>
                  )}
                </div>
                {ann.contactPhone && (
                  <div className="flex gap-2 border-t border-stone-200/50 pt-3 mt-3 items-center">
                    <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--theme-primary, #0d9488)' }} />
                    <span className={`font-bold shrink-0 ${headingColorClass}`}>ติดต่อประสานงานเจ้าภาพ:</span>
                    <span className={textMutedClass}>{ann.contactPhone}</span>
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
      )}

      {/* 2. Recent Gallery Snippet */}
      {enabledFeatures.gallery && recentPhotos.length > 0 && (
        <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)] text-left space-y-6">
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

          <div className="columns-2 sm:columns-4 gap-4">
            {recentPhotos.map((m, idx) => {
              const displayUrl = getDisplayUrl(m.filePath, m.mimeType, idx);

              return (
                <div key={m.id} className="break-inside-avoid mb-4 bg-stone-50 rounded-2xl overflow-hidden border border-stone-150 group relative transition hover:scale-[1.01] hover:shadow-sm">
                  <img 
                    src={displayUrl} 
                    alt={m.fileName} 
                    className="w-full h-auto block animate-fade-in"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>

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
        <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)] text-left space-y-6">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <h2 className="text-xl font-bold flex items-center gap-2"
                style={{ color: 'var(--theme-primary, #0d9488)' }}>
              <BookOpen className="w-5 h-5 text-emerald-700" style={{ color: 'var(--theme-primary)' }} /> {ebooksTitle}
            </h2>
            <Link 
              href={`/${slug}/ebooks`}
              className="hidden sm:inline-flex text-xs font-bold transition items-center gap-1 hover:underline flex-shrink-0"
              style={{ color: 'var(--theme-primary, #0d9488)' }}
            >
              <span>{ebooksCtaText}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentEbooks.map((book) => (
              <div 
                key={book.id}
                className="p-5 rounded-2xl border border-stone-200 bg-stone-50/40 flex items-center gap-4 hover:bg-stone-50 transition"
              >
                <div className="w-14 h-20 bg-white border border-stone-200 rounded shadow-sm flex flex-col items-center justify-center p-1.5 relative overflow-hidden flex-shrink-0">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600" style={{ backgroundColor: 'var(--theme-primary)' }} />
                  <BookOpen className="w-4 h-4 text-emerald-700 mb-1" style={{ color: 'var(--theme-primary)' }} />
                  <span className="text-[6px] text-stone-550 font-bold text-center leading-tight line-clamp-2">{book.title}</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-stone-900 line-clamp-1">{book.title}</h4>
                  <p className="text-[10px] text-stone-550">ผู้เขียน: {book.author}</p>
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-600 font-bold">{book.totalPages} หน้า</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end sm:hidden">
            <Link 
              href={`/${slug}/ebooks`}
              className="text-xs font-bold transition flex items-center gap-1 hover:underline"
              style={{ color: 'var(--theme-primary, #0d9488)' }}
            >
              <span>{ebooksCtaText}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* 4. Recent Condolences Quote Snippet */}
      {enabledFeatures.condolence && (
        <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)] text-left space-y-6">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <h2 className="text-xl font-bold flex items-center gap-2"
                style={{ color: 'var(--theme-primary, #0d9488)' }}>
              <Flame className="w-5 h-5 animate-pulse" style={{ color: 'var(--theme-primary)' }} /> {condolenceHeading}
            </h2>
            <Link 
              href={`/${slug}/condolence`}
              className="hidden sm:inline-flex text-xs font-bold transition items-center gap-1 hover:underline flex-shrink-0"
              style={{ color: 'var(--theme-primary, #0d9488)' }}
            >
              <span>ดูสมุดลงนามทั้งหมด</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentCondolences.length === 0 ? (
            <div className="text-center py-8 text-stone-500 text-sm border border-dashed border-stone-200 rounded-2xl">
              ยังไม่มีข้อความแสดงความไว้อาลัย ร่วมเขียนคำไว้อาลัยเปิดสมุดลงนามเป็นคนแรก
            </div>
          ) : (
            <div className="space-y-4">
              {recentCondolences.map((c) => (
                <div key={c.id} className="p-5 rounded-2xl border border-stone-100 bg-stone-50/30 space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 text-xs font-black flex items-center justify-center select-none uppercase">
                        {c.senderName.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-stone-850 flex items-center gap-1.5">
                          <span>{c.senderName}</span>
                          {c.type === 'FAMILY' && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold uppercase tracking-wider">ครอบครัว</span>
                          )}
                        </h4>
                        {tenant.category !== 'Pet Memorial' && c.relationship && c.relationship !== '—' && (
                          <p className="text-[9px] text-stone-400">ความสัมพันธ์: {c.relationship}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-[9px] text-stone-400 font-mono">
                      {new Date(c.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-xs text-stone-650 italic leading-relaxed pl-1">
                    " {c.message} "
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
              เปิดสมุดอ่านคำไว้อาลัยทั้งหมด
            </Link>
            <Link
              href={`/${slug}/condolence`}
              className="flex-1 px-5 py-3 rounded-xl font-bold text-center text-white hover:brightness-105 active:scale-95 transition text-xs shadow-md"
              style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
            >
              {condolenceCta}
            </Link>
          </div>
        </div>
      )}

      {/* 5. Biography Box (Moved to bottom) */}
      <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)] text-left">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"
            style={{ color: 'var(--theme-primary, #0d9488)' }}>
          <BookOpen className="w-5 h-5 text-emerald-700" style={{ color: 'var(--theme-primary)' }} /> {biographyHeading}
        </h2>
        <p className="text-stone-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
          {displayBiography}
        </p>
      </div>

    </div>
  );
}
