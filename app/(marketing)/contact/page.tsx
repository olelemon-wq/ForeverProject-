import Link from 'next/link';
import { Mail, MessageCircle, Clock } from 'lucide-react';
import MarketingPageShell, { MarketingSection } from '@/components/marketing/MarketingPageShell';

export default function ContactPage() {
  return (
    <MarketingPageShell
      eyebrow="Contact"
      title="ติดต่อเรา"
      subtitle="ทีมงาน FOREVER พร้อมช่วยเหลือเรื่องการใช้งาน การชำระเงิน และการตั้งค่าเว็บไซต์ของคุณ"
    >
      <MarketingSection title="ช่องทางติดต่อ">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-stone-900">อีเมล</p>
            <a href="mailto:hello@forever.co.th" className="text-emerald-700 hover:underline">
              hello@forever.co.th
            </a>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-stone-900">Line Official</p>
            <p>@forever (กำลังเปิดให้บริการเร็ว ๆ นี้)</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-stone-900">เวลาตอบกลับ</p>
            <p>วันจันทร์–ศุกร์ 09:00–18:00 น. (ยกเว้นวันหยุดนักขัตฤกษ์)</p>
          </div>
        </div>
      </MarketingSection>

      <MarketingSection title="ก่อนติดต่อ">
        <p>
          ลองดู{' '}
          <Link href="/help" className="text-emerald-700 font-semibold hover:underline">
            ศูนย์ช่วยเหลือ
          </Link>{' '}
          และ{' '}
          <Link href="/faq" className="text-emerald-700 font-semibold hover:underline">
            คำถามที่พบบ่อย
          </Link>{' '}
          ก่อนได้ — คำตอบส่วนใหญ่อยู่ที่นั่นแล้ว
        </p>
      </MarketingSection>
    </MarketingPageShell>
  );
}
