import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';

async function getTenantData(slug: string) {
  return await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
}

export default async function PublicDonationPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant || !tenant.donationActive || !tenant.donationPromptPay) {
    notFound();
  }

  const themeConfig = tenant.themeConfig as any;
  const primaryColor = themeConfig?.primaryColor || '#0d9488';

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-8 shadow-xl text-center space-y-6 max-w-lg mx-auto">
        <header className="space-y-2">
          <span className="text-[10px] uppercase font-black text-amber-400 tracking-widest bg-amber-500/10 px-3 py-1 rounded-full">
            DONATION & MERITS
          </span>
          <h2 className="text-xl font-bold text-white">ร่วมทำบุญอุทิศส่วนกุศล</h2>
          <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
            ท่านสามารถร่วมสมทบทุนทำบุญเพื่อบำเพ็ญกุศล หรือบริจาคแก่มูลนิธิในนามของ {tenant.name}
          </p>
        </header>

        {/* PromptPay QR Code Box */}
        <div className="p-6 rounded-2xl bg-white text-slate-900 shadow-lg space-y-4 max-w-xs mx-auto border border-slate-100">
          <div className="text-center font-bold text-xs tracking-wider border-b pb-2 text-slate-700">PROMPTPAY QR</div>
          
          {/* Simulated QR Code for Merits */}
          <div className="w-44 h-44 bg-slate-100 rounded-lg mx-auto flex flex-col items-center justify-center gap-2 border-2 border-slate-200 p-2">
            <span className="text-3xl">🌸</span>
            <span className="text-[9px] font-black text-slate-800">DONATION SCHEME</span>
            <span className="text-[10px] font-mono text-slate-500 break-all px-2">{tenant.donationPromptPay}</span>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-850">ชื่อบัญชีรับเงิน:</p>
            <p className="text-sm font-black text-slate-950">{tenant.donationAccountName || 'ครอบครัวผู้ล่วงลับ'}</p>
            <p className="text-[9px] text-slate-500">หมายเลขพร้อมเพย์: {tenant.donationPromptPay}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 max-w-md mx-auto leading-normal">
          * เงินทำบุญจะโอนเข้าบัญชีพร้อมเพย์ของเจ้าภาพโดยตรง 100% ปราศจากการหักค่าบริการจากแพลตฟอร์ม
        </div>

        <div className="pt-4 border-t border-slate-850">
          <Link href={`/${slug}`} className="px-6 py-2.5 rounded-full border border-slate-800 text-slate-400 hover:text-white text-xs transition">
            ย้อนกลับหน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
}
