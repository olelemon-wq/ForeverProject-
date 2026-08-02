import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import GalleryClient from './GalleryClient';
import { getFeatureLabel } from '@/lib/categories';
import { getEnabledFeatures } from '@/lib/features';
import CategoryOrnament from '@/components/public/CategoryOrnament';
import { FEATURE_CARD_CLASS } from '@/lib/publicLayout';
import { filterGalleryMedia } from '@/lib/galleryMedia';
import { resolveMediaSrc } from '@/lib/mediaUrl';

export const dynamic = 'force-dynamic';

async function getTenantData(slug: string) {
  return await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
}

async function getGalleryMedia(websiteId: string, themeConfig?: unknown) {
  const medias = await db.media.findMany({
    where: {
      websiteId,
      album: 'GALLERY',
      isDeleted: false,
      NOT: { mimeType: { startsWith: 'video/' } },
    },
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  return filterGalleryMedia(medias, themeConfig).map((m, idx) => ({
    id: m.id,
    filePath: m.filePath,
    fileName: m.fileName,
    mimeType: m.mimeType,
    displayUrl: getDisplayUrl(m.filePath, m.mimeType, idx),
    createdAt: m.createdAt.toISOString(),
  }));
}

function getDisplayUrl(filePath: string, _mimeType: string, _index: number) {
  return resolveMediaSrc(filePath);
}

export default async function PublicGalleryPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  const enabledFeatures = getEnabledFeatures(tenant.themeConfig, tenant);
  if (!enabledFeatures.gallery) {
    notFound();
  }

  const mediaList = await getGalleryMedia(tenant.id, tenant.themeConfig);

  return (
    <div className="animate-fade-in">
      {(() => {
        const { label: fLabel, description: fDesc } = getFeatureLabel(tenant.category, 'gallery');
        return (
          <div className={`${FEATURE_CARD_CLASS} relative space-y-6 overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] sm:space-y-8 sm:p-8 md:p-12`}>
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

            {/* Gallery Grid */}
            <div>
              <GalleryClient mediaList={mediaList} slug={slug} themeConfig={tenant.themeConfig} />
            </div>
          </div>
        );
      })()}
    </div>
  );
}
