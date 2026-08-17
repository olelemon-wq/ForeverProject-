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
import { MarketingBuyBlock } from '@/components/marketing/MarketingBuyBlock';
import { MarketingDemoSiteCard } from '@/components/marketing/MarketingDemoSiteCard';

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
      <section className="border-b border-[#E8E8ED] bg-white">
        <div className="mx-auto max-w-2xl px-6 py-12 md:py-16">
          <div
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F5F7]"
            style={{ color: category.accent }}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {copy.title}
          </h1>
          <p className="mt-3 text-lg font-medium leading-relaxed text-[#6E6E73] md:text-xl">
            {copy.tagline}
          </p>
          <p className="mt-4 max-w-prose text-base leading-relaxed text-[#6E6E73]">{copy.pageIntro}</p>
          <div className="mt-8">
            <MarketingBuyBlock createCategory={category.createCategory} isEn={isEn} />
          </div>
          <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-[28px] shadow-[0_8px_28px_rgba(0,0,0,0.08)]">
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
          <div className="mx-auto max-w-2xl px-6 py-14 sm:py-16 lg:max-w-5xl">
            <h2 className="text-2xl font-semibold tracking-tight text-[#1D1D1F] md:text-3xl">
              {isEn ? 'Make it yours' : 'ปรับได้ตามใจคุณ'}
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#6E6E73]">
              {isEn
                ? 'There are many features to choose from. Pick what feels right, and arrange the order yourself.'
                : 'มีฟีเจอร์ให้เลือกมากมาย เลือกให้ตรงใจ จัดลำดับก่อนหลังได้ง่ายๆ ด้วยตัวเอง'}
            </p>

            <ul className="mt-10 divide-y divide-[#E8E8ED]">
              {features.map((feature) => {
                const FeatureIcon = FEATURE_ICONS[feature.icon] ?? Flame;
                const image =
                  FEATURE_IMAGES_BY_CATEGORY[category.createCategory]?.[
                    feature.key as FeatureKey
                  ];
                const isVideo = feature.key === 'videos';
                const paragraphs =
                  !isEn && feature.salesParagraphs?.length
                    ? feature.salesParagraphs
                    : [feature.pageDescription || feature.description];
                const body = paragraphs.filter(Boolean).join(' ');

                return (
                  <li key={feature.key} className="py-8 first:pt-0 last:pb-0">
                    <article className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6 lg:gap-8">
                      {image ? (
                        <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-2xl bg-[#E8E8ED] sm:h-auto sm:w-40 sm:aspect-[4/3] md:w-44 lg:w-48">
                          <img
                            src={`${image}?v=8`}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover object-center"
                          />
                          {isVideo && (
                            <>
                              <span className="absolute left-2.5 top-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-[#0071e3] px-2 py-0.5 text-xs font-semibold text-white">
                                <Video className="size-3" aria-hidden />
                                {isEn ? 'Video' : 'วิดีโอ'}
                              </span>
                              <span className="absolute inset-0 z-10 flex items-center justify-center">
                                <span className="flex size-9 items-center justify-center rounded-full bg-[#0071e3] text-white shadow-[0_4px_14px_rgba(0,113,227,0.4)]">
                                  <Play className="size-4 fill-white translate-x-px" aria-hidden />
                                </span>
                              </span>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="flex h-36 w-full shrink-0 items-center justify-center rounded-2xl bg-white sm:h-auto sm:w-40 sm:aspect-[4/3] md:w-44 lg:w-48">
                          <div
                            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F5F7]"
                            style={{ color: category.accent }}
                          >
                            <FeatureIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                          </div>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-semibold leading-snug text-[#1D1D1F]">
                          {feature.label}
                        </h3>
                        <p className="mt-2 break-keep text-sm leading-relaxed text-[#6E6E73] sm:text-base">
                          {body}
                        </p>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-2xl px-6 py-14 sm:py-16 lg:max-w-[1080px]">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[#1D1D1F] md:text-3xl">
            {isEn ? `Example sites in ${copy.title}` : `ตัวอย่างเว็บไซต์หมวด ${copy.title}`}
          </h2>
        </div>

        {demos.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-5">
            {demos.map((demo) => (
              <MarketingDemoSiteCard key={demo.slug} demo={demo} isEn={isEn} />
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[#E8E8ED] bg-white p-10 text-center text-[#86868B]">
            {isEn ? 'More examples coming soon.' : 'ตัวอย่างเพิ่มเติมกำลังจัดทำ'}
          </div>
        )}

        <Link
          href="/examples"
          className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#0071e3] transition-all hover:gap-2"
        >
          {isEn ? 'All examples' : 'ดูตัวอย่างทั้งหมด'}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="border-t border-[#E8E8ED] bg-white">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-3 px-6 py-14 sm:py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-[#1D1D1F] md:text-3xl">
            {isEn ? 'Ready to create this site?' : 'พร้อมสร้างเว็บนี้แล้ว'}
          </h2>
          <MarketingBuyBlock
            createCategory={category.createCategory}
            isEn={isEn}
            showPrice={false}
            compact
          />
        </div>
      </section>
    </main>
  );
}
