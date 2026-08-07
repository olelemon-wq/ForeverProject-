import Link from 'next/link';
import { BookOpen, CreditCard, Settings, ShieldCheck } from 'lucide-react';
import MarketingPageShell, { MarketingSection } from '@/components/marketing/MarketingPageShell';

const helpTopics = [
  {
    icon: BookOpen,
    title: 'เริ่มต้นใช้งาน',
    description: 'สร้างเว็บ ตั้งค่าหมวด และเผยแพร่ลิงก์ให้ญาติมิตร',
    href: '/login',
  },
  {
    icon: Settings,
    title: 'จัดการเนื้อหา',
    description: 'แก้ไขการ์ดพิธี แกลเลอรี วิดีโอ และบอร์ดข้อความใน /manage',
    href: '/features',
  },
  {
    icon: CreditCard,
    title: 'แพ็กเกจและการชำระเงิน',
    description: 'ราคา การต่ออายุ และพื้นที่จัดเก็บ',
    href: '/pricing',
  },
  {
    icon: ShieldCheck,
    title: 'ความปลอดภัย',
    description: 'OTP, การอนุมัติข้อความ และการปกป้องข้อมูล',
    href: '/security',
  },
];

export default function HelpPage() {
  return (
    <MarketingPageShell
      eyebrow="Help Center"
      title="ศูนย์ช่วยเหลือ"
      subtitle="คู่มือและลิงก์ที่ช่วยให้คุณใช้งาน FOREVER ได้อย่างราบรื่น"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {helpTopics.map((topic) => (
          <Link
            key={topic.href}
            href={topic.href}
            className="p-6 rounded-3xl border border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm transition space-y-3"
          >
            <topic.icon className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-stone-900">{topic.title}</h2>
            <p className="text-xs text-stone-600">{topic.description}</p>
          </Link>
        ))}
      </div>

      <MarketingSection title="ยังหาคำตอบไม่เจอ?">
        <p>
          ดู{' '}
          <Link href="/faq" className="text-emerald-700 font-semibold hover:underline">
            คำถามที่พบบ่อย
          </Link>{' '}
          หรือ{' '}
          <Link href="/contact" className="text-emerald-700 font-semibold hover:underline">
            ติดต่อทีมงาน
          </Link>
        </p>
      </MarketingSection>
    </MarketingPageShell>
  );
}
