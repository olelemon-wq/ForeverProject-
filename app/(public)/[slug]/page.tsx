import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import CondolenceForm from './CondolenceForm';

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
      <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-8 shadow-xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"
            style={{ color: 'var(--theme-primary, #0d9488)' }}>
          <span>📖</span> อาลัยและคำรำลึก
        </h2>
        <p className="text-slate-300 leading-relaxed indent-8 text-sm sm:text-base">
          คุณพ่อสมศักดิ์เป็นคนขยัน ซื่อสัตย์ และรักครอบครัวมาก ท่านเป็นผู้นำที่ดีและเสียสละเสมอเพื่อการศึกษาของลูกๆ ความดีงามและคำสั่งสอนของท่านจะคงอยู่ในการดำเนินชีวิตของพวกเราตลอดไป...
        </p>
      </div>

      {/* Condolences Board List */}
      <section className="rounded-3xl border border-slate-800 bg-slate-950/40 p-8 shadow-xl space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2"
            style={{ color: 'var(--theme-primary, #0d9488)' }}>
          <span>🕯️</span> สมุดลงนามแสดงความไว้อาลัย
        </h2>

        {condolences.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-850 rounded-2xl">
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
                      ? 'border-amber-500/20 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.05)]' 
                      : 'border-slate-850 bg-slate-900/10'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-white">{c.senderName}</span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-400 rounded">
                      ความสัมพันธ์: {c.relationship}
                    </span>
                    {isFamily && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                        ครอบครัวใกล้ชิด (Family)
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 ml-auto">
                      {new Date(c.createdAt).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
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
