import Link from 'next/link';
import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import { MARKETING_FAQS } from '@/lib/marketingContent';

export default function FaqPage() {
  return (
    <MarketingPageShell
      eyebrow="FAQ"
      title="คำถามที่พบบ่อย"
      subtitle="คำตอบสำหรับคำถามที่ลูกค้าถามบ่อยที่สุด"
    >
      <div className="space-y-4">
        {MARKETING_FAQS.map((item, index) => (
          <div key={item.question} className="p-6 rounded-3xl border border-stone-200 bg-white space-y-2">
            <h2 className="text-sm font-bold text-stone-900">
              {index + 1}. {item.question}
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-stone-500 pt-4">
        มีคำถามเพิ่มเติม?{' '}
        <Link href="/contact" className="text-emerald-700 font-semibold hover:underline">
          ติดต่อเรา
        </Link>
      </p>
    </MarketingPageShell>
  );
}
