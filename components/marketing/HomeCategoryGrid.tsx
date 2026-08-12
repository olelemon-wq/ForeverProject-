'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { MARKETING_CATEGORIES } from '@/lib/marketingCategories';
import { useLanguageStore } from '@/stores/useLanguageStore';

export default function HomeCategoryGrid() {
  const { lang } = useLanguageStore();
  const isEn = lang === 'en';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {MARKETING_CATEGORIES.map((category) => {
        const copy = isEn ? category.en : category.th;
        const Icon = category.icon;

        return (
          <Link
            key={category.slug}
            href={`/${category.slug}`}
            className="group flex flex-col overflow-hidden rounded-[24px] bg-white border border-[#E8E8ED] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_8px_28px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F5F7]">
              <img
                src={category.image}
                alt={copy.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
                aria-hidden
              />
              <div
                className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 shadow-sm"
                style={{ color: category.accent }}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5 md:p-6 text-left">
              <h3 className="text-xl md:text-2xl font-semibold text-[#1D1D1F] tracking-tight">
                {copy.title}
              </h3>
              <p className="mt-2 text-sm md:text-base text-[#86868B] font-medium leading-relaxed flex-1">
                {copy.cardDesc}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0071e3] group-hover:gap-2 transition-all">
                {isEn ? 'Learn more' : 'ดูรายละเอียด'}
                <ChevronRight className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
