import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import CondolenceForm from './CondolenceForm';
import { BookOpen, Flame } from 'lucide-react';

async function getTenantData(slug: string) {
  const tenant = await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
  return tenant;
}

async function getApprovedCondolences(websiteId: string) {
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
  return condolences.sort((a, b) => {
    if (a.type === 'FAMILY' && b.type !== 'FAMILY') return -1;
    if (a.type !== 'FAMILY' && b.type === 'FAMILY') return 1;
    return 0; // maintain original chronological sort order
  });
}

export default async function PublicMemorialHome(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  const condolences = await getApprovedCondolences(tenant.id);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Biography Box */}
      <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"
            style={{ color: 'var(--theme-primary, #0d9488)' }}>
          <BookOpen className="w-5 h-5 text-emerald-700" style={{ color: 'var(--theme-primary)' }} /> อาลัยและคำรำลึก
        </h2>
        <p className="text-stone-600 leading-relaxed indent-8 text-sm sm:text-base">
          คุณพ่อสมศักดิ์เป็นคนขยัน ซื่อสัตย์ และรักครอบครัวมาก ท่านเป็นผู้นำที่ดีและเสียสละเสมอเพื่อการศึกษาของลูกๆ ความดีงามและคำสั่งสอนของท่านจะคงอยู่ในการดำเนินชีวิตของพวกเราตลอดไป...
        </p>
      </div>

      {/* Condolences Board List */}
      <section className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)] space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2"
            style={{ color: 'var(--theme-primary, #0d9488)' }}>
          <Flame className="w-5 h-5 animate-pulse" style={{ color: 'var(--theme-primary)' }} /> สมุดลงนามแสดงความไว้อาลัย
        </h2>

        {condolences.length === 0 ? (
          <div className="text-center py-8 text-stone-500 text-sm border border-dashed border-stone-200 rounded-2xl">
            ยังไม่มีข้อความแสดงความไว้อาลัยปรากฏในสมุดเล่มนี้
          </div>
        ) : (
          <div className="space-y-4">
            {condolences.map((c) => {
              const isFamily = c.type === 'FAMILY';
              return (
                <div 
                  key={c.id} 
                  className={`p-5 rounded-2xl border transition ${
                    isFamily 
                      ? 'border-amber-200 bg-amber-50/40 shadow-[0_2px_10px_rgba(245,158,11,0.03)]' 
                      : 'border-stone-200 bg-stone-50/50'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-stone-850">{c.senderName}</span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-stone-100 text-stone-600 rounded">
                      ความสัมพันธ์: {c.relationship}
                    </span>
                    {isFamily && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 rounded">
                        ครอบครัวใกล้ชิด (Family)
                      </span>
                    )}
                    <span className="text-[10px] text-stone-550 ml-auto">
                      {new Date(c.createdAt).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    "{c.message}"
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Condolence submission component */}
      <CondolenceForm websiteId={tenant.id} />
    </div>
  );
}
