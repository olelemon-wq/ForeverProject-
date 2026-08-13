'use client';

import Link from 'next/link';
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Flame,
  HandHeart,
  Image as ImageIcon,
  Megaphone,
  MessagesSquare,
  Network,
  Play,
  StickyNote,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { getCategoryFeatureShowcase } from '@/lib/categories';
import type { FeatureKey } from '@/lib/features';
import { getMarketingCategory, type MarketingCategorySlug } from '@/lib/marketingCategories';
import { getDemoSiteCards } from '@/lib/demoSites';
import { useLanguageStore } from '@/stores/useLanguageStore';

const FEATURE_ICONS: Record<string, LucideIcon> = {
  Megaphone,
  Image: ImageIcon,
  Flame,
  StickyNote,
  MessagesSquare,
  Network,
  BookOpen,
  HandHeart,
  Video,
  CalendarDays,
};

/** Memorial marketing feature visuals (bundled under /public/marketing). */
const MEMORIAL_FEATURE_IMAGES: Partial<Record<FeatureKey, string>> = {
  gallery: '/marketing/memorial-features/gallery.jpg',
  videos: '/marketing/memorial-features/videos.jpg',
  announcement: '/marketing/memorial-features/announcement.jpg',
  condolence: '/marketing/memorial-features/condolence.jpg',
  memory: '/marketing/memorial-features/memory.jpg',
  family: '/marketing/memorial-features/family.png',
  ebooks: '/marketing/memorial-features/ebooks.jpg',
  activities: '/marketing/memorial-features/activities.jpg',
  donation: '/marketing/memorial-features/donation.jpg',
};

/** Family Legacy marketing feature visuals. */
const FAMILY_LEGACY_FEATURE_IMAGES: Partial<Record<FeatureKey, string>> = {
  gallery: '/marketing/family-story-features/gallery.jpg',
  videos: '/marketing/family-story-features/videos.jpg',
  announcement: '/marketing/family-story-features/announcement.jpg',
  condolence: '/marketing/family-story-features/condolence.jpg',
  memory: '/marketing/family-story-features/memory.jpg',
  family: '/marketing/family-story-features/family.jpg',
  ebooks: '/marketing/family-story-features/ebooks.jpg',
  activities: '/marketing/family-story-features/activities.jpg',
  donation: '/marketing/family-story-features/donation.jpg',
};

/** Couple marketing feature visuals. */
const COUPLE_FEATURE_IMAGES: Partial<Record<FeatureKey, string>> = {
  gallery: '/marketing/couple-features/gallery-full.jpg',
  videos: '/marketing/couple-features/videos.jpg',
  announcement: '/marketing/couple-features/announcement-full.jpg',
  condolence: '/marketing/couple-features/condolence.jpg',
  memory: '/marketing/couple-features/memory-full.jpg',
  family: '/marketing/couple-features/family-full.jpg',
  ebooks: '/marketing/couple-features/ebooks.jpg',
  activities: '/marketing/couple-features/activities-full.jpg',
  donation: '/marketing/couple-features/donation.jpg',
};

/** Wedding marketing feature visuals. */
const WEDDING_FEATURE_IMAGES: Partial<Record<FeatureKey, string>> = {
  gallery: '/marketing/wedding-features/gallery.jpg',
  videos: '/marketing/wedding-features/videos.jpg',
  announcement: '/marketing/wedding-features/announcement.jpg',
  condolence: '/marketing/wedding-features/condolence.jpg',
  memory: '/marketing/wedding-features/memory.jpg',
  family: '/marketing/wedding-features/family.jpg',
  ebooks: '/marketing/wedding-features/ebooks.jpg',
  activities: '/marketing/wedding-features/activities.jpg',
  donation: '/marketing/wedding-features/donation.jpg',
};

/** Friends marketing feature visuals. */
const FRIENDS_FEATURE_IMAGES: Partial<Record<FeatureKey, string>> = {
  gallery: '/marketing/friends-features/gallery.jpg',
  videos: '/marketing/friends-features/videos.jpg',
  announcement: '/marketing/friends-features/announcement.jpg',
  condolence: '/marketing/friends-features/condolence.jpg',
  memory: '/marketing/friends-features/memory.jpg',
  family: '/marketing/friends-features/family.jpg',
  ebooks: '/marketing/friends-features/ebooks.jpg',
  activities: '/marketing/friends-features/activities.jpg',
  donation: '/marketing/friends-features/donation.jpg',
};

/** Pet Memorial marketing feature visuals. */
const PET_MEMORIAL_FEATURE_IMAGES: Partial<Record<FeatureKey, string>> = {
  gallery: '/marketing/pet-memorial-features/gallery.jpg',
  videos: '/marketing/pet-memorial-features/videos.jpg',
  announcement: '/marketing/pet-memorial-features/announcement.jpg',
  condolence: '/marketing/pet-memorial-features/condolence.jpg',
  memory: '/marketing/pet-memorial-features/memory.jpg',
  family: '/marketing/pet-memorial-features/family.jpg',
  activities: '/marketing/pet-memorial-features/activities.jpg',
  donation: '/marketing/pet-memorial-features/donation.jpg',
};

const FEATURE_IMAGES_BY_CATEGORY: Partial<
  Record<string, Partial<Record<FeatureKey, string>>>
> = {
  Memorial: MEMORIAL_FEATURE_IMAGES,
  'Family Legacy': FAMILY_LEGACY_FEATURE_IMAGES,
  Couple: COUPLE_FEATURE_IMAGES,
  Wedding: WEDDING_FEATURE_IMAGES,
  Friends: FRIENDS_FEATURE_IMAGES,
  'Pet Memorial': PET_MEMORIAL_FEATURE_IMAGES,
};

export default function MarketingCategoryPage({ slug }: { slug: MarketingCategorySlug }) {
  const category = getMarketingCategory(slug);
  if (!category) return null;

  const { lang } = useLanguageStore();
  const isEn = lang === 'en';
  const copy = isEn ? category.en : category.th;
  const Icon = category.icon;
  const features = getCategoryFeatureShowcase(category.createCategory).filter(
    (f) => f.key !== 'feed',
  );

  const demos = getDemoSiteCards()
    .filter((site) => site.category === category.createCategory)
    .slice(0, 3);

  return (
    <main className="bg-[#F5F5F7] text-[#1D1D1F] min-h-screen">
      <section className="relative overflow-hidden border-b border-[#E8E8ED] bg-white">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-6 py-14 md:py-20 lg:grid-cols-2">
          <div className="space-y-5 text-left">
            <div
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F5F7]"
              style={{ color: category.accent }}
            >
              <Icon className="h-6 w-6" aria-hidden />
            </div>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              {copy.title}
            </h1>
            <p className="max-w-xl text-lg font-medium leading-relaxed text-[#6E6E73] md:text-xl">
              {copy.tagline}
            </p>
            <p className="max-w-xl text-base leading-relaxed text-[#86868B]">{copy.pageIntro}</p>
            <Link
              href={`/manage/create?category=${encodeURIComponent(category.createCategory)}`}
              className="inline-flex items-center justify-center rounded-full bg-[#0071e3] px-8 py-3 text-base font-medium text-white transition-colors hover:bg-[#0077ED]"
            >
              {isEn ? 'Create your site' : 'สร้างเว็บหมวดนี้'}
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <img
              src={category.image}
              alt={copy.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {features.length > 0 && (
        <section className="border-b border-[#E8E8ED] bg-[#F5F5F7]">
          <div className="mx-auto max-w-[1080px] px-6 py-14 sm:py-16">
            <div className="mb-8 flex items-end justify-between gap-4 border-b border-[#E8E8ED] pb-5">
              <div className="min-w-0 text-left">
                <h2 className="text-3xl font-semibold tracking-[-0.02em] text-[#1D1D1F]">
                  {isEn ? 'Sections you can enable' : 'ส่วนที่เลือกใช้ได้'}
                </h2>
                <p className="mt-1.5 text-sm text-[#86868B]">
                  {isEn
                    ? 'Turn each section on or off when you set up the site.'
                    : 'เปิดหรือปิดทีหลังได้ตอนตั้งค่าเว็บ'}
                </p>
              </div>
              <p className="hidden shrink-0 text-sm text-[#86868B] sm:block">
                {isEn ? `${features.length} sections` : `${features.length} ส่วน`}
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-2.5 sm:gap-4 md:grid-cols-2">
              {features.map((feature, index) => {
                const FeatureIcon = FEATURE_ICONS[feature.icon] ?? Flame;
                const image =
                  FEATURE_IMAGES_BY_CATEGORY[category.createCategory]?.[
                    feature.key as FeatureKey
                  ];
                const mediaLeft = index % 2 === 0;
                const isVideo = feature.key === 'videos';

                const media = image ? (
                  <div className="relative h-full min-h-[10rem] overflow-hidden bg-[#F5F5F7]">
                    <img
                      src={`${image}?v=8`}
                      alt=""
                      loading="lazy"
                      className="absolute left-1/2 top-1/2 h-[112%] w-[112%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    {isVideo && (
                      <>
                        <span className="absolute left-2.5 top-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-[#0071e3] px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm sm:left-3 sm:top-3 sm:text-xs">
                          <Video className="size-3" aria-hidden />
                          {isEn ? 'Video' : 'ไฟล์วิดีโอ'}
                        </span>
                        <span className="absolute inset-0 z-10 flex items-center justify-center">
                          <span className="flex size-11 items-center justify-center rounded-full bg-[#0071e3] text-white shadow-[0_6px_20px_rgba(0,113,227,0.45)] sm:size-12">
                            <Play className="size-5 fill-white translate-x-px" aria-hidden />
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex min-h-[10rem] items-center justify-center bg-[#F5F5F7]">
                    <div
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-[#E8E8ED]"
                      style={{ color: category.accent }}
                    >
                      <FeatureIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                    </div>
                  </div>
                );

                const copyBlock = (
                  <div className="flex min-w-0 flex-col justify-center p-4 text-left sm:p-5 md:px-6 md:py-5">
                    <h3 className="text-sm font-semibold leading-snug text-[#1D1D1F] sm:text-base">
                      {feature.label}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#6E6E73]">
                      {feature.pageDescription}
                    </p>
                  </div>
                );

                return (
                  <li key={feature.key}>
                    <article
                      className={`group relative grid h-full min-h-[10rem] overflow-hidden rounded-[24px] border border-[#E8E8ED] bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-0.5 hover:border-[#d8d8de] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] sm:min-h-[11rem] sm:rounded-[28px] ${
                        mediaLeft
                          ? 'grid-cols-[minmax(9rem,0.95fr)_1.05fr]'
                          : 'grid-cols-[1.05fr_minmax(9rem,0.95fr)]'
                      }`}
                    >
                      {mediaLeft ? (
                        <>
                          {media}
                          {copyBlock}
                        </>
                      ) : (
                        <>
                          {copyBlock}
                          {media}
                        </>
                      )}
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1080px] px-6 py-14 sm:py-16">
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-[#E8E8ED] pb-5">
          <div className="min-w-0 text-left">
            <h2 className="text-3xl font-semibold tracking-[-0.02em] text-[#1D1D1F]">
              {isEn ? 'Example sites' : 'ตัวอย่างเว็บไซต์'}
            </h2>
            <p className="mt-1.5 text-sm text-[#86868B]">
              {isEn ? 'See how others use this category' : 'ดูตัวอย่างการใช้งานจริงในหมวดนี้'}
            </p>
          </div>
          <Link
            href="/examples"
            className="hidden items-center gap-1 text-sm font-semibold text-[#0071e3] transition-all hover:gap-2 sm:inline-flex"
          >
            {isEn ? 'All examples' : 'ดูตัวอย่างทั้งหมด'}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {demos.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            {demos.map((demo) => (
              <Link
                key={demo.slug}
                href={`/${demo.slug}`}
                className="group overflow-hidden rounded-[24px] border border-[#E8E8ED] bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-0.5 hover:border-[#d8d8de] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] sm:rounded-[28px]"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#F5F5F7]">
                  <img
                    src={demo.coverUrl}
                    alt={demo.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5 text-left">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#86868B]">
                    {demo.categoryLabel}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-[#1D1D1F]">{demo.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[#6E6E73]">{demo.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[#E8E8ED] bg-white p-10 text-center text-[#86868B] sm:rounded-[28px]">
            {isEn ? 'More examples coming soon.' : 'ตัวอย่างเพิ่มเติมกำลังจัดทำ'}
          </div>
        )}
      </section>
    </main>
  );
}
