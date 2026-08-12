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
  image: string;
  layout?: 'default' | 'horizontal' | 'feature' | 'media-left' | 'media-right';
  bentoClass?: string;
  accent?: 'emerald' | 'teal' | 'stone' | 'sky';
  mobileCompact?: boolean;
  bottomAlign?: boolean;
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
        image:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
        layout: 'media-right',
        accent: 'sky',
      },
      {
        icon: Palette,
        title: 'ปรับแต่งโทนสีและฟอนต์อักษร',
        description:
          'เลือกโทนสีสุภาพและฟอนต์อันประณีต เช่น LINE Seed Sans TH, Charm, Sarabun เพื่อแสดงความเคารพอย่างสูง',
        image:
          'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80',
        layout: 'media-right',
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
        image:
          '/demo-media/88a6311e-21a0-49f9-a0d6-6a63a5d2f566/1784609462838-announcement-card-1784609462687.jpg',
        bentoClass: 'col-start-1 row-start-1 md:col-start-auto md:row-start-auto',
        accent: 'stone',
        mobileCompact: true,
        bottomAlign: true,
      },
      {
        icon: Camera,
        title: 'แกลเลอรีรูปถ่ายความทรงจำ',
        description:
          'จัดเก็บและแสดงภาพในดีไซน์ Masonry สวยงาม โหลดรวดเร็ว คัดกรองภาพได้อย่างเป็นระเบียบ',
        image:
          '/demo-media/f4d68f77-50a1-4799-b060-cf38af5d210d/1785398635928-gallery-1785398635709-a3ee928f-d9e5-42eb-83d6-5b3c49053306.jpg',
        layout: 'feature',
        bentoClass:
          'col-start-2 row-start-1 row-span-2 md:col-start-2 md:row-start-1 md:row-span-2',
        accent: 'emerald',
      },
      {
        icon: BookOpen,
        title: 'หนังสือที่ระลึก Web Reader',
        description:
          'ผู้เข้าร่วมงานสแกนเปิดอ่านหนังสือธรรมทานหรือบันทึกคำขอบคุณออนไลน์ผ่านสมาร์ทโฟนได้ทันที',
        image:
          'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=900&q=80',
        bentoClass:
          'col-span-2 row-start-3 md:col-span-1 md:col-start-3 md:row-start-1',
        accent: 'sky',
        bottomAlign: true,
      },
      {
        icon: QrCode,
        title: 'ดาวน์โหลดคิวอาร์โค้ดถาวร',
        description:
          'รับ QR Code ประจำหน้าเว็บสำหรับพิมพ์ลงการ์ดกระดาษ ของชำร่วย หรือบอร์ดหน้างาน',
        image:
          '/demo-media/88a6311e-21a0-49f9-a0d6-6a63a5d2f566/1784608875889-announcement-card-1784608875729.webp',
        bentoClass: 'col-start-1 row-start-2 md:col-start-1 md:row-start-2',
        accent: 'teal',
        mobileCompact: true,
        bottomAlign: true,
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
        image:
          'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80',
        layout: 'media-left',
        accent: 'emerald',
      },
      {
        icon: Users,
        title: 'แผนผังเครือญาติ',
        description:
          'จัดเรียงสมาชิกในครอบครัวและทายาทอย่างเป็นสัดส่วน เพื่อรำลึกรากเหง้าและส่งต่อประวัติศาสตร์',
        image:
          'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80',
        layout: 'media-left',
        accent: 'stone',
      },
    ],
  },
];

const accentStyles = {
  emerald: {
    card: 'bg-white border border-[#E8E8ED]',
    icon: 'text-emerald-700',
    iconBg: 'bg-emerald-50 ring-1 ring-emerald-100/80',
  },
  teal: {
    card: 'bg-white border border-[#E8E8ED]',
    icon: 'text-teal-700',
    iconBg: 'bg-teal-50 ring-1 ring-teal-100/80',
  },
  sky: {
    card: 'bg-white border border-[#E8E8ED]',
    icon: 'text-[#0071e3]',
    iconBg: 'bg-sky-50 ring-1 ring-sky-100/80',
  },
  stone: {
    card: 'bg-white border border-[#E8E8ED]',
    icon: 'text-[#1D1D1F]',
    iconBg: 'bg-[#F5F5F7] ring-1 ring-[#E8E8ED]',
  },
} as const;

function FeatureImage({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-white/60 shadow-sm ring-1 ring-black/[0.04] ${className ?? ''}`}>
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />
    </div>
  );
}

function FeatureCard({ feature }: { feature: FeatureItem }) {
  const Icon = feature.icon;
  const accent = accentStyles[feature.accent ?? 'stone'];
  const layout = feature.layout ?? 'default';
  const compact = feature.mobileCompact ?? false;

  const cardBase = `group relative h-full overflow-hidden rounded-[24px] p-4 shadow-[0_1px_0_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-0.5 hover:border-[#d8d8de] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] sm:rounded-[28px] sm:p-5 md:p-6 ${accent.card} ${feature.bentoClass ?? ''}`;

  const heading = (
    <>
      <div
        className={`inline-flex items-center justify-center rounded-xl ${compact ? 'h-8 w-8' : 'h-10 w-10'} ${accent.iconBg}`}
      >
        <Icon
          className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} ${accent.icon}`}
          strokeWidth={1.75}
        />
      </div>
      <div className="space-y-1">
        <h3
          className={`font-semibold leading-snug text-[#1D1D1F] ${compact ? 'text-sm' : 'text-base'}`}
        >
          {feature.title}
        </h3>
        <p
          className={`text-pretty leading-relaxed text-[#6E6E73] ${compact ? 'line-clamp-4 text-xs sm:text-sm' : 'text-sm'}`}
        >
          {feature.description}
        </p>
      </div>
    </>
  );

  if (layout === 'media-left' || layout === 'media-right') {
    const image = (
      <FeatureImage
        src={feature.image}
        className="h-auto w-36 shrink-0 !rounded-xl aspect-[4/3] sm:w-40"
      />
    );
    const copy = (
      <div className="min-w-0 flex-1 pt-0.5">
        <h3 className="text-sm font-semibold leading-snug text-[#1D1D1F] sm:text-base">
          {feature.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-[#6E6E73]">
          {feature.description}
        </p>
      </div>
    );

    return (
      <article className={cardBase}>
        <div className="flex items-start gap-3.5 sm:gap-4">
          {layout === 'media-left' ? (
            <>
              {image}
              {copy}
            </>
          ) : (
            <>
              {copy}
              {image}
            </>
          )}
        </div>
      </article>
    );
  }

  if (layout === 'horizontal') {
    const alignBottom = feature.bottomAlign;
    return (
      <article className={cardBase}>
        <div
          className={`flex h-full flex-col gap-3 md:flex-row md:gap-4 ${
            alignBottom ? 'md:items-end' : 'md:items-center'
          }`}
        >
          <div className="flex flex-1 flex-col gap-2.5 min-w-0 md:gap-3">{heading}</div>
          <FeatureImage
            src={feature.image}
            className={`h-28 w-full shrink-0 sm:h-32 md:w-[38%] ${
              alignBottom ? 'mt-auto md:mt-0 md:h-32' : 'md:h-36'
            }`}
          />
        </div>
      </article>
    );
  }

  if (layout === 'feature') {
    return (
      <article className={`${cardBase} flex flex-col`}>
        <div className="shrink-0 flex flex-col gap-2 sm:gap-3">{heading}</div>
        <FeatureImage
          src={feature.image}
          className="mt-auto min-h-0 flex-1 h-28 sm:h-36 md:h-full md:min-h-[140px]"
        />
      </article>
    );
  }

  return (
    <article className={cardBase}>
      <div className="flex h-full min-h-0 flex-col">
        <div className="shrink-0">{heading}</div>
        <FeatureImage
          src={feature.image}
          className={
            feature.bottomAlign
              ? compact
                ? 'mt-auto h-20 shrink-0 md:h-32'
                : 'mt-auto h-24 shrink-0 sm:h-32 md:h-32'
              : compact
                ? 'mt-2 h-20'
                : 'mt-2.5 h-24 sm:mt-3.5 sm:h-32'
          }
        />
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
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-[#1D1D1F] sm:text-5xl">
              ทุกเครื่องมือที่จำเป็น
              <br className="hidden sm:block" />
              เพื่อเก็บเรื่องราวให้คงอยู่
            </h1>
            <p className="mx-auto mt-5 max-w-[560px] text-lg leading-relaxed text-[#6E6E73]">
              ออกแบบมาให้ญาติและเพื่อนใช้งานได้ง่าย ในขณะที่หน้าเว็บยังดูสง่างาม
              เรียบหรู และเหมาะกับบริบทงานพิธีและความทรงจำของครอบครัวไทย
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-[#0071e3] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#0077ED] active:scale-[0.98]"
              >
                เริ่มสร้างเว็บไซต์
              </Link>
              <Link
                href="/examples"
                className="inline-flex items-center justify-center rounded-full border border-[#D2D2D7] bg-white px-7 py-3 text-sm font-medium text-[#1D1D1F] transition hover:bg-[#F5F5F7] active:scale-[0.98]"
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
                <p className="text-sm font-semibold text-[#1D1D1F]">{pillar.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#6E6E73]">
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
            <h2 className="text-3xl font-semibold tracking-[-0.02em] text-[#1D1D1F] sm:text-3xl">
              {group.label}
            </h2>
            <p className="hidden text-sm text-[#86868B] sm:block">
              {group.items.length} ฟีเจอร์
            </p>
          </div>

          <div
            className={`grid gap-2.5 sm:gap-4 md:items-stretch ${
              group.label === 'เนื้อหาและความทรงจำ'
                ? 'grid-cols-2 grid-rows-[minmax(0,1fr)_minmax(0,1fr)_auto] md:grid-cols-3 md:grid-rows-2'
                : group.label === 'ความไว้วางใจ' || group.label === 'เริ่มต้นและออกแบบ'
                  ? 'grid-cols-1 md:grid-cols-2'
                  : 'grid-cols-2 md:grid-cols-3 auto-rows-fr'
            }`}
          >
            {group.items.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="mx-auto max-w-[1080px] px-6 pb-20 pt-4">
        <div className="relative overflow-hidden rounded-[32px] border border-[#E8E8ED] bg-white px-6 pt-10 pb-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.03),0_16px_48px_rgba(0,0,0,0.08)] sm:px-10 sm:pt-12 sm:pb-8">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,113,227,0.08),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-[560px] space-y-4">
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-[#1D1D1F] sm:text-4xl">
              พร้อมเปิดพื้นที่ความทรงจำ...
              <br />
              ของคุณแล้วหรือยัง
            </h2>
            <p className="text-sm leading-relaxed text-[#6E6E73]">
              ทดลองสร้างหน้าเว็บได้ฟรี ปรับกำหนดการและแกลเลอรีได้ทันที
              แล้วแชร์ลิงก์หรือ QR Code ให้คนที่คุณรัก
            </p>
          </div>
          <div className="relative mt-6 grid grid-cols-2 gap-3 md:mx-auto md:max-w-sm md:gap-4">
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0071e3] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0077ED] active:scale-[0.98] shadow-[0_4px_14px_rgba(0,113,227,0.35)]"
            >
              เริ่มสร้างเว็บไซต์
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex w-full items-center justify-center rounded-full border border-[#0071e3]/25 bg-white px-4 py-3 text-sm font-medium text-[#0071e3] transition hover:border-[#0071e3]/40 hover:bg-[#F5F5F7] active:scale-[0.98]"
            >
              ดูราคา
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
