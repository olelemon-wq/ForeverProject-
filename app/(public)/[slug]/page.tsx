import { notFound } from 'next/navigation';
import { db } from '@/lib/db';

async function getTenantData(slug: string) {
  const tenant = await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
  return tenant;
}

export default async function PublicMemorialHome(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  const themeConfig = tenant.themeConfig as any;
  const primaryColor = themeConfig?.primaryColor || '#0d9488';

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-8 shadow-xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"
            style={{ color: 'var(--theme-primary)' }}>
          <span>📖</span> อาลัยและคำรำลึก
        </h2>
        <p className="text-slate-300 leading-relaxed indent-8 text-sm sm:text-base">
          คุณพ่อสมศักดิ์เป็นคนขยัน ซื่อสัตย์ และรักครอบครัวมาก ท่านเป็นผู้นำที่ดีและเสียสละเสมอเพื่อการศึกษาของลูกๆ ความดีงามและคำสั่งสอนของท่านจะคงอยู่ในการดำเนินชีวิตของพวกเราตลอดไป...
        </p>
      </div>

      {/* Condolence submission call-to-action */}
      <div className="p-8 rounded-3xl border border-dashed border-slate-850 bg-slate-950/10 text-center">
        <h3 className="text-base sm:text-lg font-semibold text-slate-200 mb-2">
          ร่วมส่งคำไว้อาลัยและแสดงความระลึกถึง
        </h3>
        <p className="text-slate-400 text-xs mb-6 max-w-md mx-auto leading-normal">
          คุณสามารถร่วมจุดเทียนออนไลน์และเขียนคำไว้อาลัย เพื่อรวบรวมเป็นสมุดบันทึกส่งต่อให้ครอบครัวผู้ล่วงลับ
        </p>
        <button 
          className="px-6 py-3 text-xs sm:text-sm font-semibold rounded-full text-slate-950 hover:brightness-110 active:scale-95 transition shadow-lg"
          style={{ backgroundColor: 'var(--theme-primary)' }}
        >
          🕯️ ร่วมแสดงความไว้อาลัย
        </button>
      </div>
    </div>
  );
}
