import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import VideosClient from './VideosClient';
import { getFeatureLabel } from '@/lib/categories';
import { getEnabledFeatures } from '@/lib/features';
import CategoryOrnament from '@/components/public/CategoryOrnament';

export const dynamic = 'force-dynamic';

async function getTenantData(slug: string) {
  return await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
}

async function getVideoMedia(websiteId: string) {
  const medias = await db.media.findMany({
    where: {
      websiteId,
      album: { in: ['GALLERY', 'VIDEO'] },
      isDeleted: false,
      mimeType: { startsWith: 'video/' },
    },
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  return medias.map((m, idx) => ({
    id: m.id,
    filePath: m.filePath,
    fileName: m.fileName,
    mimeType: m.mimeType,
    displayUrl: getDisplayUrl(m.filePath, m.mimeType, idx),
    createdAt: m.createdAt.toISOString(),
  }));
}

function getDisplayUrl(filePath: string, mimeType: string, index: number) {
  return filePath;
}

export default async function PublicVideosPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  const enabledFeatures = getEnabledFeatures(tenant.themeConfig, tenant);
  if (!enabledFeatures.videos) {
    notFound();
  }

  const mediaList = await getVideoMedia(tenant.id);

  return (
    <div className="animate-fade-in">
      {(() => {
        const { label: fLabel, description: fDesc } = getFeatureLabel(tenant.category, 'videos');
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
                  <CategoryOrnament category={tenant.category} count={1} />
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-stone-200" />
              </div>
            </div>

            {/* Videos Grid */}
            <div>
              <VideosClient mediaList={mediaList} slug={slug} />
            </div>
          </div>
        );
      })()}
    </div>
  );
}
