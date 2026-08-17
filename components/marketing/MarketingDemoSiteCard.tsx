import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { formatDemoPrice, type DemoSiteCard } from '@/lib/demoSites';

export function joinHighlights(items: string[], isEn: boolean) {
  if (items.length === 0) return '';
  if (items.length === 1) {
    return isEn ? `This site includes ${items[0]}` : `พร้อม ${items[0]}`;
  }
  const last = items[items.length - 1];
  const rest = items.slice(0, -1).join(isEn ? ', ' : ' ');
  return isEn
    ? `This site includes ${rest}, and ${last}`
    : `พร้อม ${rest} และ${last}`;
}

export function MarketingDemoSiteCard({
  demo,
  isEn,
  layout = 'tile',
}: {
  demo: DemoSiteCard;
  isEn: boolean;
  layout?: 'tile' | 'row';
}) {
  const price = formatDemoPrice(demo.price, isEn);
  const isRow = layout === 'row';
  const cta = isEn ? 'View demo' : 'เปิดดูตัวอย่าง';

  const priceLine = (
    <p className="leading-none">
      <span className="text-lg font-semibold tracking-tight text-[#1D1D1F]">{price.amount}</span>
      <span className="ml-1 text-sm font-medium text-[#6E6E73]">{price.period}</span>
    </p>
  );

  const rowButton = (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#0071e3] px-3 py-1.5 text-sm font-medium text-white transition group-hover:bg-[#0077ED] md:px-4 md:py-2">
      {cta}
      <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </span>
  );

  return (
    <Link
      href={`/${demo.slug}`}
      className={
        isRow
          ? 'group flex h-full min-h-[10.5rem] flex-row items-stretch overflow-hidden rounded-[24px] border border-[#E8E8ED] bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-0.5 hover:border-[#d8d8de] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] md:min-h-[8.25rem]'
          : 'group flex flex-col overflow-hidden rounded-[24px] border border-[#E8E8ED] bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-0.5 hover:border-[#d8d8de] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]'
      }
    >
      <div
        className={
          isRow
            ? 'relative w-28 shrink-0 self-stretch overflow-hidden bg-[#F5F5F7] sm:w-32 md:w-44 lg:w-48'
            : 'aspect-[16/10] overflow-hidden bg-[#F5F5F7]'
        }
      >
        <img
          src={demo.coverUrl}
          alt=""
          className={
            isRow
              ? 'absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]'
              : 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]'
          }
        />
      </div>
      {isRow ? (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 p-3 text-left sm:p-4 md:px-5 md:py-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <h3 className="line-clamp-2 min-w-0 flex-1 text-base font-semibold leading-snug text-[#1D1D1F] md:text-lg">
              {demo.title}
            </h3>
            <div className="hidden shrink-0 items-center gap-4 md:flex">
              {priceLine}
              {rowButton}
            </div>
          </div>
          {demo.highlights.length > 0 && (
            <p className="line-clamp-2 break-keep text-sm leading-relaxed text-[#6E6E73]">
              {joinHighlights(demo.highlights, isEn)}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between gap-3 pt-1 md:hidden">
            {priceLine}
            {rowButton}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-3 p-5 text-left">
          <h3 className="text-lg font-semibold leading-snug text-[#1D1D1F]">{demo.title}</h3>
          {demo.highlights.length > 0 && (
            <p className="break-keep text-sm leading-relaxed text-[#6E6E73]">
              {joinHighlights(demo.highlights, isEn)}
            </p>
          )}
          {priceLine}
          <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-semibold text-[#0071e3]">
            {cta}
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      )}
    </Link>
  );
}
