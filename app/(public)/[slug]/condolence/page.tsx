import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { getEnabledFeatures } from '@/lib/features';
import CondolenceForm from '../CondolenceForm';
import { getFeatureLabel } from '@/lib/categories';
import { PenTool, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import CondolenceItem from './CondolenceItem';
import CategoryOrnament from '@/components/public/CategoryOrnament';

export const dynamic = 'force-dynamic';

async function getTenantData(slug: string) {
  const tenant = await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
  return tenant;
}

async function getApprovedCondolences(websiteId: string) {
  const condolences = await db.condolence.findMany({
    where: {
      websiteId,
      isApproved: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const RELATIONSHIP_LEVELS: Record<string, number> = {
    Family: 1,
    Spouse: 1,
    Son: 1,
    Daughter: 1,
    Grandchild: 1,
    Relative: 2,
    Friend: 3,
    Colleague: 3,
  };

  return condolences.sort((a, b) => {
    const levelA = RELATIONSHIP_LEVELS[a.relationship] || 7;
    const levelB = RELATIONSHIP_LEVELS[b.relationship] || 7;
    
    if (levelA !== levelB) {
      return levelA - levelB;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

const getPageNumbers = (current: number, total: number) => {
  const pages = [];
  const delta = 1;
  
  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }
  return pages;
};

export default async function PublicCondolencePage(props: { 
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { slug } = await props.params;
  const resolvedSearchParams = await props.searchParams;
  const rawPage = resolvedSearchParams?.page;
  const page = rawPage ? parseInt(rawPage, 10) : 1;

  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  if (!getEnabledFeatures(tenant.themeConfig, tenant).condolence) {
    notFound();
  }

  const condolences = await getApprovedCondolences(tenant.id);

  const ITEMS_PER_PAGE = 10;
  const totalCondolences = condolences.length;
  const totalPages = Math.max(1, Math.ceil(totalCondolences / ITEMS_PER_PAGE));
  const currentPage = Math.max(1, Math.min(totalPages, page));

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCondolences = condolences.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-8 animate-fade-in">
      {(() => {
        const { label: fLabel, description: fDesc } = getFeatureLabel(tenant.category, 'condolence');
        return (
          <div className="rounded-3xl border border-stone-200/80 bg-white p-8 sm:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.015)] space-y-8 relative overflow-hidden">
            {/* Page Header with CategoryOrnament and Wing lines */}
            <div className="flex flex-col items-center text-center space-y-3">
              <h2 className="text-2xl font-black text-stone-900" style={{ color: 'var(--theme-primary, #0d9488)' }}>
                {fLabel}
              </h2>
              <p className="text-stone-500 text-xs max-w-lg leading-normal">
                {fDesc}
              </p>
              {/* Centered Motif with Wing lines divider */}
              <div className="w-full flex items-center justify-center gap-4 pt-4 select-none">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-stone-200" />
                <div className="flex-shrink-0">
                  <CategoryOrnament category={tenant.category} />
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-stone-200" />
              </div>
            </div>

            {/* Condolences Board List */}
            <div className="space-y-6">
              <h3 className="text-base font-bold flex items-center gap-2 text-stone-800">
                <PenTool className="w-4 h-4 text-emerald-700" style={{ color: 'var(--theme-primary)' }} />
                <span>ข้อความรำลึกทั้งหมด ({condolences.length})</span>
              </h3>

              {condolences.length === 0 ? (
                <div className="text-center py-12 text-stone-500 text-sm border border-dashed border-stone-200 rounded-2xl">
                  ยังไม่มีข้อความแสดงความไว้อาลัยปรากฏในสมุดเล่มนี้
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Clean row-based list separated by dividers */}
                  <div className="divide-y divide-stone-150">
                    {paginatedCondolences.map((c) => (
                      <CondolenceItem key={c.id} condolence={c} />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1.5 pt-6 border-t border-stone-100 mt-6 flex-wrap">
                      <Link
                        href={`/${slug}/condolence?page=${currentPage - 1}`}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                          currentPage === 1
                            ? 'border-stone-100 text-stone-300 pointer-events-none bg-stone-50/50'
                            : 'border-stone-200 text-stone-700 bg-white hover:bg-stone-50 hover:border-stone-300 active:scale-95'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>ก่อนหน้า</span>
                      </Link>

                      <div className="flex items-center gap-1">
                        {getPageNumbers(currentPage, totalPages).map((p, idx) => {
                          if (p === '...') {
                            return (
                              <span key={`ellipsis-${idx}`} className="px-2.5 py-2 text-xs font-bold text-stone-400 select-none">
                                ...
                              </span>
                            );
                          }

                          const isActive = p === currentPage;
                          return (
                            <Link
                              key={`page-${p}`}
                              href={`/${slug}/condolence?page=${p}`}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                                isActive
                                  ? 'text-white bg-emerald-600 shadow-sm'
                                  : 'text-stone-600 bg-stone-100 hover:bg-stone-200/80 active:scale-95'
                              }`}
                              style={isActive ? { backgroundColor: 'var(--theme-primary, #0d9488)' } : {}}
                            >
                              {p}
                            </Link>
                          );
                        })}
                      </div>

                      <Link
                        href={`/${slug}/condolence?page=${currentPage + 1}`}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                          currentPage === totalPages
                            ? 'border-stone-100 text-stone-300 pointer-events-none bg-stone-50/50'
                            : 'border-stone-200 text-stone-700 bg-white hover:bg-stone-50 hover:border-stone-300 active:scale-95'
                        }`}
                      >
                        <span>ถัดไป</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Condolence submission component */}
      <CondolenceForm websiteId={tenant.id} />
    </div>
  );
}
