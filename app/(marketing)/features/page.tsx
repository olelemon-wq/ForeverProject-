import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Camera,
  Clock,
  Palette,
  QrCode,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';

type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  span?: 'wide' | 'tall' | 'full';
  accent?: 'emerald' | 'teal' | 'stone';
};

const pillars = [
  {
    title: 'ทำเองได้ทั้งหมด',
    description: 'ไม่ต้องรอทีมเทคนิค — ตั้งค่าและเผยแพร่ได้ในไม่กี่นาที',
  },
  {
    title: 'ออกแบบมาเพื่อความทรงจำ',
    description: 'โทนสี ฟอนต์ และเลย์เอาต์ที่สงบ เรียบหรู และเคารพบริบทไทย',
  },
  {
    title: 'ปลอดภัยและควบคุมได้',
    description: 'อนุมัติข้อความก่อนเผยแพร่ พร้อมระบบเข้าสู่ระบบ OTP',
  },
];

const featureGroups: { label: string; items: FeatureItem[] }[] = [
  {
    label: 'เริ่มต้นและออกแบบ',
    items: [
      {
        icon: Clock,
        title: 'สร้างเว็บไซต์เสร็จสิ้นใน 3 นาที',
        description:
          'ระบบ Self-Service 100% ตอบคำถามง่าย ๆ ระบบจะสร้างเว็บให้ทันที ไม่ต้องมีพื้นฐานเขียนโปรแกรม',
        span: 'wide',
        accent: 'emerald',
      },
      {
        icon: Palette,
        title: 'ปรับแต่งโทนสีและฟอนต์อักษร',
        description:
          'เลือกโทนสีสุภาพและฟอนต์อันประณีต เช่น LINE Seed Sans TH, Charm, Sarabun เพื่อแสดงความเคารพอย่างสูง',
        accent: 'teal',
      },
    ],
  },
  {
    label: 'เนื้อหาและความทรงจำ',
    items: [
      {
        icon: Calendar,
        title: 'กำหนดการพิธีการ์ดออนไลน์',
        description:
          'สร้างการ์ดแจ้งกำหนดการฌาปนกิจและพิธีสวดที่แชร์ได้ง่าย พร้อมลิงก์แผนที่นำทาง',
        accent: 'stone',
      },
      {
        icon: Camera,
        title: 'แกลเลอรีรูปถ่ายความทรงจำ',
        description:
          'จัดเก็บและแสดงภาพในดีไซน์ Masonry สวยงาม โหลดรวดเร็ว คัดกรองภาพได้อย่างเป็นระเบียบ',
        span: 'tall',
        accent: 'emerald',
      },
      {
        icon: BookOpen,
        title: 'หนังสือที่ระลึก Web Reader',
        description:
          'ผู้เข้าร่วมงานสแกนเปิดอ่านหนังสือธรรมทานหรือบันทึกคำขอบคุณออนไลน์ผ่านสมาร์ทโฟนได้ทันที',
        accent: 'stone',
      },
      {
        icon: QrCode,
        title: 'ดาวน์โหลดคิวอาร์โค้ดถาวร',
        description:
          'รับ QR Code ประจำหน้าเว็บสำหรับพิมพ์ลงการ์ดกระดาษ ของชำร่วย หรือบอร์ดหน้างาน',
        accent: 'teal',
      },
    ],
  },
  {
    label: 'ความไว้วางใจ',
    items: [
      {
        icon: ShieldCheck,
        title: 'ระบบคัดกรองคำไว้อาลัย',
        description:
          'ทุกข้อความและภาพบนกระดานแชร์ความทรงจำ จะแสดงหลังได้รับการอนุมัติจากผู้ดูแลระบบเท่านั้น',
        span: 'wide',
        accent: 'emerald',
      },
      {
        icon: Users,
        title: 'แผนผังเครือญาติ',
        description:
          'จัดเรียงสมาชิกในครอบครัวและทายาทอย่างเป็นสัดส่วน เพื่อรำลึกรากเหง้าและส่งต่อประวัติศาสตร์',
        accent: 'stone',
      },
    ],
  },
];

const accentStyles = {
  emerald: {
    icon: 'text-emerald-700',
    surface: 'bg-emerald-50',
    ring: 'ring-emerald-100',
  },
  teal: {
    icon: 'text-teal-700',
    surface: 'bg-teal-50',
    ring: 'ring-teal-100',
  },
  stone: {
    icon: 'text-[#1D1D1F]',
    surface: 'bg-[#F5F5F7]',
    ring: 'ring-[#E8E8ED]',
  },
} as const;

function spanClass(span?: FeatureItem['span']) {
  if (span === 'wide') return 'md:col-span-2';
  if (span === 'tall') return 'md:row-span-2';
  if (span === 'full') return 'md:col-span-3';
  return '';
}

function FeatureCard({ feature }: { feature: FeatureItem }) {
  const Icon = feature.icon;
  const accent = accentStyles[feature.accent ?? 'stone'];

  return (
    <article
      className={`group relative overflow-hidden rounded-[28px] border border-[#E8E8ED] bg-white p-7 sm:p-8 shadow-[0_1px_0_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-0.5 hover:border-[#d8d8de] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] ${spanClass(feature.span)}`}
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-60 blur-2xl transition duration-500 group-hover:opacity-90 ${accent.surface}`}
        aria-hidden
      />
      <div className="relative flex h-full flex-col gap-5">
        <div
          className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${accent.surface} ${accent.ring}`}
        >
          <Icon className={`h-6 w-6 ${accent.icon}`} strokeWidth={1.75} />
        </div>
        <div className="space-y-2.5">
          <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-[#1D1D1F]">
            {feature.title}
          </h3>
          <p className="max-w-prose text-[14px] leading-relaxed text-[#6E6E73]">
            {feature.description}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function FeaturesPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative border-b border-[#E8E8ED] bg-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.08),transparent)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1080px] px-6 pb-16 pt-14 sm:pb-20 sm:pt-20">
          <div className="mx-auto max-w-[720px] text-center">
            <h1 className="text-[40px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1D1D1F] sm:text-[56px]">
              ทุกเครื่องมือที่จำเป็น
              <br className="hidden sm:block" />
              เพื่อเก็บเรื่องราวให้คงอยู่
            </h1>
            <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-relaxed text-[#6E6E73]">
              ออกแบบมาให้ญาติและเพื่อนใช้งานได้ง่าย ในขณะที่หน้าเว็บยังดูสง่างาม
              เรียบหรู และเหมาะกับบริบทงานพิธีและความทรงจำของครอบครัวไทย
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-[#1D1D1F] px-7 py-3 text-[15px] font-medium text-white transition hover:bg-[#333336] active:scale-[0.98]"
              >
                เริ่มสร้างเว็บไซต์
              </Link>
              <Link
                href="/examples"
                className="inline-flex items-center justify-center rounded-full border border-[#D2D2D7] bg-white px-7 py-3 text-[15px] font-medium text-[#1D1D1F] transition hover:bg-[#F5F5F7] active:scale-[0.98]"
              >
                ดูตัวอย่างจริง
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-[920px] gap-4 sm:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-3xl border border-[#E8E8ED] bg-[#FBFBFD] px-5 py-5 text-left"
              >
                <p className="text-[15px] font-semibold text-[#1D1D1F]">{pillar.title}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#6E6E73]">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature groups */}
      {featureGroups.map((group) => (
        <section key={group.label} className="mx-auto max-w-[1080px] px-6 py-14 sm:py-16">
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-[#E8E8ED] pb-5">
            <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[#1D1D1F] sm:text-[32px]">
              {group.label}
            </h2>
            <p className="hidden text-[13px] text-[#86868B] sm:block">
              {group.items.length} ฟีเจอร์
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[minmax(180px,auto)]">
            {group.items.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="mx-auto max-w-[1080px] px-6 pb-20 pt-4">
        <div className="relative overflow-hidden rounded-[32px] bg-[#1D1D1F] px-8 py-12 text-center sm:px-12 sm:py-14">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.18),transparent_45%),radial-gradient(circle_at_80%_100%,rgba(45,212,191,0.12),transparent_40%)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-[560px] space-y-5">
            <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-white sm:text-[34px]">
              พร้อมเปิดพื้นที่ความทรงจำของคุณแล้วหรือยัง
            </h2>
            <p className="text-[15px] leading-relaxed text-white/72">
              ทดลองสร้างหน้าเว็บได้ฟรี ปรับกำหนดการและแกลเลอรีได้ทันที
              แล้วแชร์ลิงก์หรือ QR Code ให้คนที่คุณรัก
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[15px] font-semibold text-[#1D1D1F] transition hover:bg-[#F5F5F7] active:scale-[0.98]"
              >
                เริ่มสร้างฟรี
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 text-[15px] font-medium text-white transition hover:bg-white/10 active:scale-[0.98]"
              >
                ดูราคา
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
