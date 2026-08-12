'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getMarketingCategory, type MarketingCategorySlug } from '@/lib/marketingCategories';
import { getDemoSiteCards } from '@/lib/demoSites';
import { useLanguageStore } from '@/stores/useLanguageStore';

export default function MarketingCategoryPage({ slug }: { slug: MarketingCategorySlug }) {
  const category = getMarketingCategory(slug);
  if (!category) return null;

  const { lang } = useLanguageStore();
  const isEn = lang === 'en';
  const copy = isEn ? category.en : category.th;
  const Icon = category.icon;

  const demos = getDemoSiteCards()
    .filter((site) => site.category === category.createCategory)
    .slice(0, 3);

  return (
    <main className="bg-[#F5F5F7] text-[#1D1D1F] min-h-screen">
      <section className="relative overflow-hidden border-b border-[#E8E8ED] bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5 text-left">
            <div
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F5F7]"
              style={{ color: category.accent }}
            >
              <Icon className="h-6 w-6" aria-hidden />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
              {copy.title}
            </h1>
            <p className="text-lg md:text-xl text-[#6E6E73] font-medium leading-relaxed max-w-xl">
              {copy.tagline}
            </p>
            <p className="text-base text-[#86868B] leading-relaxed max-w-xl">{copy.pageIntro}</p>
            <Link
              href={`/manage/create?category=${encodeURIComponent(category.createCategory)}`}
              className="inline-flex items-center justify-center bg-[#0071e3] text-white font-medium text-base px-8 py-3 rounded-full hover:bg-[#0077ED] transition-colors"
            >
              {isEn ? 'Create your site' : 'สร้างเว็บหมวดนี้'}
            </Link>
          </div>
          <div className="relative aspect-[4/3] rounded-[28px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <img src={category.image} alt={copy.title} className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-6 py-14 md:py-20">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {isEn ? 'Example sites' : 'ตัวอย่างเว็บไซต์'}
            </h2>
            <p className="mt-2 text-[#86868B] font-medium">
              {isEn ? 'See how others use this category' : 'ดูตัวอย่างการใช้งานจริงในหมวดนี้'}
            </p>
          </div>
          <Link href="/examples" className="hidden sm:inline-flex items-center gap-1 text-[#0071e3] font-semibold text-sm hover:gap-2 transition-all">
            {isEn ? 'All examples' : 'ดูตัวอย่างทั้งหมด'}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {demos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {demos.map((demo) => (
              <Link
                key={demo.slug}
                href={`/${demo.slug}`}
                className="group overflow-hidden rounded-[22px] bg-white border border-[#E8E8ED] shadow-sm hover:shadow-md transition-all"
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
                  <p className="mt-2 text-sm text-[#86868B] line-clamp-2">{demo.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[22px] border border-dashed border-[#E8E8ED] bg-white p-10 text-center text-[#86868B]">
            {isEn ? 'More examples coming soon.' : 'ตัวอย่างเพิ่มเติมกำลังจัดทำ'}
          </div>
        )}
      </section>
    </main>
  );
}
