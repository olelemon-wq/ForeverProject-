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

  const config = (tenant.themeConfig as any) || {};
  const subjects = config.subjects || [];
  const allSubjectsAlive = subjects.length > 0 && subjects.every((s: any) => s.isAlive);
  const isHappy = tenant.category === 'Couple' || tenant.category === 'Wedding' || (tenant.category === 'Pet Memorial' && allSubjectsAlive);

  return (
    <div className="space-y-8 animate-fade-in">
      {(() => {
        const { label: fLabel, description: fDesc } = getFeatureLabel(tenant.category, 'condolence');
        const displayLabel = isHappy 
          ? (tenant.category === 'Pet Memorial' ? 'สมุดเยี่ยมเยียนและส่งความรักถึงน้อง ๆ' : 'สมุดเยี่ยมเยียนและข้อความอวยพร') 
          : fLabel;
        const displayDesc = isHappy
          ? 'คุณสามารถเขียนบันทึกความรู้สึก ส่งต่อกำลังใจ ความรัก และอธิษฐานจิตผ่านสมุดเยี่ยมเยียนเล่มนี้'
          : fDesc;
        return (
          <div className="rounded-3xl border border-stone-200/60 bg-white p-8 sm:p-12 shadow-sm space-y-10 relative overflow-hidden">
            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="select-none py-2 w-full">
                <CategoryOrnament category={tenant.category} count={9} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900" style={{ color: 'var(--theme-primary, #0d9488)' }}>
                {displayLabel}
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm max-w-md leading-relaxed">
                {displayDesc}
              </p>
              {/* Decorative divider */}
              <div className="w-full flex items-center justify-center gap-3 pt-2 select-none">
                <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-stone-200" />
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-stone-300" />
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--theme-primary, #0d9488)', opacity: 0.4 }} />
                  <div className="w-1 h-1 rounded-full bg-stone-300" />
                </div>
                <div className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-stone-200" />
              </div>
            </div>

            {/* List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2 text-stone-700">
                  <PenTool className="w-3.5 h-3.5" style={{ color: 'var(--theme-primary)' }} />
                  <span>{isHappy ? 'ข้อความอวยพรทั้งหมด' : 'ข้อความรำลึกทั้งหมด'}</span>
                  <span className="text-stone-400 font-medium">({condolences.length})</span>
                </h3>
              </div>

              {condolences.length === 0 ? (
                <div className="text-center py-16 space-y-2 border border-dashed border-stone-200 rounded-2xl">
                  <PenTool className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="text-sm text-stone-500">
                    {isHappy ? 'ยังไม่มีข้อความในสมุดเล่มนี้' : 'ยังไม่มีข้อความไว้อาลัย'}
                  </p>
                  <p className="text-xs text-stone-400">เป็นคนแรกที่ร่วมเขียนข้อความ</p>
                </div>
              ) : (
                <div className="space-y-0">
                  <div className="divide-y divide-stone-100">
                    {paginatedCondolences.map((c) => (
                      <CondolenceItem
                        key={c.id}
                        condolence={c}
                        hideRelationship={tenant.category === 'Pet Memorial'}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1.5 pt-8 flex-wrap">
                      <Link
                        href={`/${slug}/condolence?page=${currentPage - 1}`}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                          currentPage === 1
                            ? 'border-stone-100 text-stone-300 pointer-events-none'
                            : 'border-stone-200 text-stone-600 bg-white hover:bg-stone-50 active:scale-95'
                        }`}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">ก่อนหน้า</span>
                      </Link>

                      <div className="flex items-center gap-1">
                        {getPageNumbers(currentPage, totalPages).map((p, idx) => {
                          if (p === '...') {
                            return (
                              <span key={`ellipsis-${idx}`} className="px-2 py-2 text-xs text-stone-400 select-none">
                                ...
                              </span>
                            );
                          }

                          const isActive = p === currentPage;
                          return (
                            <Link
                              key={`page-${p}`}
                              href={`/${slug}/condolence?page=${p}`}
                              className={`min-w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition ${
                                isActive
                                  ? 'text-white shadow-sm'
                                  : 'text-stone-500 hover:bg-stone-100 active:scale-95'
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
                        className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                          currentPage === totalPages
                            ? 'border-stone-100 text-stone-300 pointer-events-none'
                            : 'border-stone-200 text-stone-600 bg-white hover:bg-stone-50 active:scale-95'
                        }`}
                      >
                        <span className="hidden sm:inline">ถัดไป</span>
                        <ChevronRight className="w-3.5 h-3.5" />
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
      <CondolenceForm 
        websiteId={tenant.id} 
        category={tenant.category} 
        subjects={(tenant.themeConfig as any)?.subjects} 
      />
    </div>
  );
}
