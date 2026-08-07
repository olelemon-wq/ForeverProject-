import Link from 'next/link';
import { Lock, ShieldCheck, UserCheck } from 'lucide-react';
import MarketingPageShell, { MarketingSection } from '@/components/marketing/MarketingPageShell';

export default function SecurityPage() {
  return (
    <MarketingPageShell
      eyebrow="Security"
      title="ความปลอดภัย"
      subtitle="เราออกแบบ FOREVER ให้ปลอดภัยตั้งแต่การเข้าสู่ระบบจนถึงการเผยแพร่เนื้อหาสู่สาธารณะ"
    >
      <MarketingSection title="การยืนยันตัวตน">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            ผู้ดูแลระบบเข้าสู่ระบบด้วย OTP ทาง SMS ไม่มีรหัสผ่านถาวรที่อาจรั่วไหล
            และมีการจำกัดจำนวนครั้งเมื่อป้อนรหัสผิด
          </p>
        </div>
      </MarketingSection>

      <MarketingSection title="การควบคุมเนื้อหา">
        <div className="flex items-start gap-3">
          <UserCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            ข้อความจากผู้เยี่ยมชมต้องผ่านการอนุมัติก่อนแสดงบนเว็บ
            ผู้ดูแลสามารถลบหรือรายงานเนื้อหาที่ไม่เหมาะสมได้จากหน้าจัดการ
          </p>
        </div>
      </MarketingSection>

      <MarketingSection title="การจัดเก็บข้อมูล">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            ไฟล์มีเดียจัดเก็บบนระบบคลาวด์ที่มีการเข้ารหัสระหว่างทาง (HTTPS)
            และแยกพื้นที่ตามเว็บไซต์แต่ละแห่ง ข้อมูลของคุณไม่ปะปนกับลูกค้ารายอื่น
          </p>
        </div>
      </MarketingSection>

      <p className="text-center text-sm">
        <Link href="/privacy" className="text-emerald-700 font-semibold hover:underline">
          อ่านนโยบายความเป็นส่วนตัว
        </Link>
      </p>
    </MarketingPageShell>
  );
}
