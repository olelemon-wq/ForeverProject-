import Link from 'next/link';
import {
  HeartHandshake,
  Link2,
  Lock,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import MarketingPageShell, { MarketingSection } from '@/components/marketing/MarketingPageShell';
import { MARKETING_CATEGORIES } from '@/lib/marketingCategories';

const BELIEFS = [
  {
    title: 'ความทรงจำสมควรมีเกียรติ',
    body: 'หน้าเว็บรำลึกและพื้นที่ความทรงจำควรสงบ อบอุ่น และไม่มีโฆษณารบกวน — ไม่ใช่ฟีดที่เลื่อนแล้วหายไป',
  },
  {
    title: 'ครอบครัวควรควบคุมได้เอง',
    body: 'ลงทะเบียน จ่ายเงิน สร้าง แก้ไข ต่ออายุ และเพิ่มผู้ดูแลร่วมได้ครบ โดยไม่ต้องพึ่งเจ้าหน้าที่ตลอดทาง',
  },
  {
    title: 'ความเป็นส่วนตัวมาก่อน',
    body: 'ข้อความจากผู้เยี่ยมชมผ่านการอนุมัติก่อนเผยแพร่ ผู้ดูแลกำหนดสิ่งที่เหมาะสมกับครอบครัวได้',
  },
] as const;

const TRUST_POINTS = [
  {
    icon: UserCheck,
    title: 'อนุมัติก่อนเผยแพร่',
    body: 'สมุดข้อความและความทรงจำจากแขกต้องผ่านการคัดกรองจากผู้ดูแลก่อนแสดง',
  },
  {
    icon: Lock,
    title: 'เข้าสู่ระบบด้วย OTP',
    body: 'ยืนยันตัวตนด้วยรหัส SMS ไม่มีรหัสผ่านถาวรที่อาจรั่วไหล',
  },
  {
    icon: ShieldCheck,
    title: 'ไม่มีโฆษณาบนหน้าเว็บ',
    body: 'พื้นที่สาธารณะของแต่ละเว็บถูกออกแบบให้สงบและเคารพผู้เยี่ยมชม',
  },
] as const;

export default function AboutPage() {
  return (
    <MarketingPageShell
      eyebrow="About FOREVER"
      title="เราอยู่เพื่อเก็บความทรงจำให้อยู่ยาว"
      subtitle={
        <>
          FOREVER เป็นแพลตฟอร์มสร้างเว็บไซต์ความทรงจำออนไลน์ ที่ให้ครอบครัวและคนรัก
          ทำได้เองทั้งหมด — เรียบง่าย สง่างาม และเคารพทุกช่วงเวลาสำคัญในชีวิต
        </>
      }
    >
      <MarketingSection title="ทำไมถึงมี FOREVER">
        <p>
          ความทรงจำที่สำคัญมักกระจัดกระจายอยู่ในแชท อัลบั้ม และโพสต์ที่เลื่อนผ่านไป
          เราอยากให้ครอบครัวมีพื้นที่ดิจิทัลที่สง่างามในลิงก์เดียว
          — ทั้งสำหรับอนุสรณ์บุคคล เรื่องราวครอบครัว คู่รัก งานแต่ง กลุ่มเพื่อน
          และการรำลึกสัตว์เลี้ยง — โดยไม่ต้องเป็นนักออกแบบหรือนักพัฒนา
        </p>
        <p>
          สำเร็จเมื่อผู้ดูแลสร้าง เผยแพร่ และดูแลเว็บได้เอง
          และผู้เยี่ยมชมรู้สึกถึงความสงบ ความเคารพ และความอบอุ่นเมื่อเปิดเข้ามา
        </p>
      </MarketingSection>

      <MarketingSection title="จุดต่างของเรา">
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden />
            <div>
              <p className="font-semibold text-stone-900">ทำเองได้ 100%</p>
              <p className="mt-1">
                ลงทะเบียนด้วยเบอร์โทร จ่ายผ่าน PromptPay สร้างเว็บ แก้ไขเนื้อหา
                ต่ออายุ และเพิ่มผู้ดูแลร่วมได้โดยไม่ต้องรอเจ้าหน้าที่
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <HeartHandshake className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden />
            <div>
              <p className="font-semibold text-stone-900">สง่างามตามบริบทจริง</p>
              <p className="mt-1">
                ไม่ใช่ตัวสร้างหน้าเว็บทั่วไป แต่เป็นเส้นทางที่ออกแบบตามหมวด
                — อนุสรณ์ คู่รัก งานแต่ง ครอบครัว เพื่อน และสัตว์เลี้ยง —
                พร้อมค่าเริ่มต้นที่เคารพวัฒนธรรมและความรู้สึก
              </p>
            </div>
          </li>
        </ul>
      </MarketingSection>

      <MarketingSection title="สิ่งที่เราเชื่อ">
        <ul className="space-y-4">
          {BELIEFS.map((item) => (
            <li key={item.title}>
              <p className="font-semibold text-stone-900">{item.title}</p>
              <p className="mt-1">{item.body}</p>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection title="เหมาะกับใคร">
        <p>
          FOREVER รองรับหลายช่วงชีวิตและความสัมพันธ์ — เลือกหมวดที่ตรงกับสิ่งที่คุณอยากเก็บไว้
        </p>
        <ul className="mt-4 divide-y divide-stone-100 border-y border-stone-100">
          {MARKETING_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <li key={category.slug}>
                <Link
                  href={`/${category.slug}`}
                  className="flex items-start gap-3 py-3 transition hover:bg-stone-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                >
                  <Icon
                    className="mt-0.5 size-5 shrink-0"
                    style={{ color: category.accent }}
                    aria-hidden
                  />
                  <span className="min-w-0">
                    <span className="block font-semibold text-stone-900">{category.th.title}</span>
                    <span className="mt-0.5 block text-stone-600">{category.th.tagline}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </MarketingSection>

      <MarketingSection title="ความน่าเชื่อถือที่เรายึดถือ">
        <ul className="space-y-4">
          {TRUST_POINTS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex items-start gap-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden />
              <div>
                <p className="font-semibold text-stone-900">{title}</p>
                <p className="mt-1">{body}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="pt-2">
          อ่านเพิ่มเติมที่{' '}
          <Link href="/privacy" className="font-semibold text-emerald-700 hover:underline">
            นโยบายความเป็นส่วนตัว
          </Link>{' '}
          และ{' '}
          <Link href="/security" className="font-semibold text-emerald-700 hover:underline">
            ความปลอดภัย
          </Link>
        </p>
      </MarketingSection>

      <MarketingSection title="สัญญาเรื่องความถาวร">
        <div className="flex items-start gap-3">
          <Link2 className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden />
          <p>
            ลิงก์และ QR ของเว็บถูกออกแบบให้แชร์ต่อได้ยาวนาน พร้อมระบบต่ออายุและการดูแลโดยผู้ดูแลเอง
            — เพื่อให้ความทรงจำกลับมาเปิดได้อีกเมื่อครอบครัวต้องการ
          </p>
        </div>
      </MarketingSection>

      <section className="rounded-3xl border border-emerald-200/80 bg-emerald-50/60 p-6 sm:p-8 text-center space-y-4">
        <h2 className="text-base font-bold text-stone-900">พร้อมเริ่มเก็บความทรงจำแล้วหรือยัง</h2>
        <p>
          ดูตัวอย่างเว็บจริงทุกหมวด หรือสร้างเว็บของคุณได้ทันที — และหากมีคำถาม
          ทีมเราพร้อมช่วยเหลือ
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-1">
          <Link
            href="/examples"
            className="inline-flex items-center justify-center rounded-full bg-[#0071e3] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0077ed]"
          >
            ดูตัวอย่างทั้งหมด
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
          >
            สร้างเว็บของคุณ
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-emerald-800 transition hover:underline"
          >
            ติดต่อเรา
          </Link>
        </div>
      </section>
    </MarketingPageShell>
  );
}
