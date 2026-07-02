import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { getEnabledFeatures } from '@/lib/features';
import EbookReaderClient from './EbookReaderClient';
import { getFeatureLabel } from '@/lib/categories';
import { BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getTenantData(slug: string) {
  return await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
}

async function getEbooks(websiteId: string) {
  return await db.ebook.findMany({
    where: { websiteId },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function PublicEbooksPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  if (!getEnabledFeatures(tenant.themeConfig, tenant).ebooks) {
    notFound();
  }

  // 1. Fetch real ebooks from database
  const dbEbooks = await getEbooks(tenant.id);

  // 2. Fallback Mock Commemorative booklets (matching F014) if none uploaded yet
  const mockBooklets = [
    {
      id: 'book-1',
      title: 'หนังสือธรรมะรำลึกและคำสอนสติ',
      author: 'ครอบครัวเจริญยิ่ง',
      totalPages: 4,
      mockPages: [
        'บทนำ\n\nการมีชีวิตอยู่เป็นเรื่องชั่วคราว การจากไปเป็นสัจธรรม ทุกสิ่งในโลกล้วนเกิดขึ้น ตั้งอยู่ และดับไปตามกาลเวลา หนังสือเล่มนี้จัดทำขึ้นเพื่อเป็นธรรมทานและอนุสรณ์รำลึกแด่ผู้วายชนม์ ขอความสงบสุขจงมีแด่ผู้อ่านทุกท่าน...',
        'หน้า 2: บทแผ่เมตตา\n\nสัพเพ สัตตา: สัตว์ทั้งหลายที่เป็นเพื่อนทุกข์ เกิดแก่เจ็บตายด้วยกันทั้งหมดทั้งสิ้น\nอะเวรา โหนตุ: จงเป็นสุขเป็นสุขเถิด อย่าได้มีเวรแก่กันและกันเลย\nอัพยาปัชฌา โหนตุ: จงเป็นสุขเป็นสุขเถิด อย่าได้เบียดเบียนซึ่งกันและกันเลย...',
        'หน้า 3: สัจธรรมชีวิต\n\nวันคืนล่วงไป วันคืนล่วงไป บัดนี้เราทำอะไรอยู่? ความตายไม่เคยต่อรองเวลา ไม่มีสิ่งใดที่เรานำติดตัวไปด้วยได้นอกจากบุญและบาปที่ได้สะสมมาขณะยังมีลมหายใจ ขอให้ทุกท่านตระหนักถึงความดีงาม...',
        'บทส่งท้าย\n\nขอกุศลผลบุญจากการจัดพิมพ์และแจกจ่ายหนังสือนำเสนอธรรมะเล่มนี้ จงเป็นปัจจัยส่งดวงวิญญาณของผู้ล่วงลับสู่สุคติในสัมปรายภพเทอญ\n\nด้วยความเคารพรักและอาลัยอย่างสูง\nคณะผู้จัดทำ',
      ],
    },
    {
      id: 'book-2',
      title: 'บันทึกประวัติความทรงจำและคำขอบคุณ',
      author: 'คณะผู้จัดทำ',
      totalPages: 3,
      mockPages: [
        'บทความขอบคุณจากคณะผู้จัดทำ\n\nกราบขอบพระคุณแขกผู้มีเกียรติทุกท่านที่สละเวลามาร่วมไว้อาลัยและฟังสวดอภิธรรม ตลอดจนร่วมฌาปนกิจ การต้อนรับหากขาดตกบกพร่องประการใด ครอบครัวขอน้อมรับคำติชมและกราบขออภัยมา ณ ที่นี้...',
        'หน้า 2: ประวัติสังเขป\n\nคุณพ่อเกิดในครอบครัวเกษตรกร สู้ชีวิตด้วยความมุมานะ อุตสาหะ พยายาม จนสามารถส่งเสียลูกๆ ให้ได้รับการศึกษาที่ดีที่สุด ท่านมักพร่ำสอนเสมอเรื่องความชื่อสัตย์สุจริตและการให้เกียรติผู้อื่น...',
        'หน้า 3: คำกล่าวรำลึกจากบุตรและธิดา\n\n"พ่อไม่ได้จากไปไหนเลย พ่อยังคงอยู่ในทุกแววตา ทุกการตัดสินใจ และคำสั่งสอนที่ดีงามของลูกๆ เสมอ รักและคิดถึงพ่อสุดหัวใจ..."',
      ],
    },
  ];

  // 3. Map database books to structure expected by client component
  const mappedDbEbooks = dbEbooks.map(eb => ({
    id: eb.id,
    title: eb.title,
    author: eb.author,
    totalPages: eb.totalPages,
    mockPages: eb.pages as string[],
  }));

  // Combine real books and default fallback books
  const finalBooklets = [...mappedDbEbooks, ...mockBooklets];

  return (
    <div className="space-y-8 animate-fade-in text-center font-sans">
      {(() => {
        const { label: fLabel, description: fDesc } = getFeatureLabel(tenant.category, 'ebooks');
        return (
          <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
            <h2 className="text-xl font-bold mb-2 flex items-center justify-center gap-2"
                style={{ color: 'var(--theme-primary, #0d9488)' }}>
              <BookOpen className="w-5 h-5 text-emerald-700" style={{ color: 'var(--theme-primary)' }} /> {fLabel}
            </h2>
            <p className="text-stone-500 text-xs leading-normal max-w-md mx-auto">
              {fDesc}
            </p>
          </div>
        );
      })()}

      {/* Render the Client-side Ebook reader */}
      <EbookReaderClient booklets={finalBooklets} />
    </div>
  );
}
