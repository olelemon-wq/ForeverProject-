import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { getEnabledFeatures } from '@/lib/features';
import EbookReaderClient from './EbookReaderClient';
import { getFeatureLabel } from '@/lib/categories';
import CategoryOrnament from '@/components/public/CategoryOrnament';
import { FEATURE_CARD_CLASS } from '@/lib/publicLayout';
import { getCategoryEbookMocks } from '@/lib/ebookMocks';

export const dynamic = 'force-dynamic';

async function getTenantData(slug: string) {
  return await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
}

async function getEbooks(websiteId: string) {
  return await db.ebook.findMany({
    where: { websiteId },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function PublicEbooksPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  if (!getEnabledFeatures(tenant.themeConfig, tenant).ebooks) {
    notFound();
  }

  const dbEbooks = await getEbooks(tenant.id);
  const mockBooklets = getCategoryEbookMocks(tenant.category);

  const mappedDbEbooks = dbEbooks.map((eb) => ({
    id: eb.id,
    title: eb.title,
    author: eb.author,
    totalPages: eb.totalPages,
    mockPages: eb.pages as string[],
  }));

  const finalBooklets = dbEbooks.length > 0 ? mappedDbEbooks : [...mappedDbEbooks, ...mockBooklets];

  return (
    <div className="animate-fade-in text-center">
      {(() => {
        const { label: fLabel, description: fDesc } = getFeatureLabel(tenant.category, 'ebooks');
        return (
          <div className={`${FEATURE_CARD_CLASS} relative space-y-6 overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-5 text-left shadow-[0_4px_20px_rgba(0,0,0,0.015)] sm:space-y-8 sm:p-8 md:p-12`}>
            <div className="flex flex-col items-center space-y-3 text-center">
              <h2 className="text-2xl font-black text-stone-900" style={{ color: 'var(--theme-primary, #0d9488)' }}>
                {fLabel}
              </h2>
              <p className="max-w-lg text-xs leading-normal text-stone-500">{fDesc}</p>
              <div className="flex w-full select-none items-center justify-center gap-4 pt-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-stone-200" />
                <div className="flex-shrink-0">
                  <CategoryOrnament category={tenant.category} count={1} />
                </div>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-stone-200" />
              </div>
            </div>

            <EbookReaderClient booklets={finalBooklets} />
          </div>
        );
      })()}
    </div>
  );
}
