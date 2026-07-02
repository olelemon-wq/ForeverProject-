import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Video } from 'lucide-react';
import VideosClient from './VideosClient';
import { getFeatureLabel } from '@/lib/categories';
import { getEnabledFeatures } from '@/lib/features';

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
      album: 'GALLERY',
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
  if (filePath.startsWith('https://storage.forever.co.th')) {
    // Beautiful, peaceful nature video from Mixkit CDN
    return 'https://assets.mixkit.co/videos/preview/mixkit-sunset-seen-through-the-branches-of-a-tree-42751-large.mp4';
  }
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
    <div className="space-y-8 animate-fade-in">
      {(() => {
        const { label: fLabel, description: fDesc } = getFeatureLabel(tenant.category, 'videos');
        return (
          <div className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2"
                style={{ color: 'var(--theme-primary, #0d9488)' }}>
              <Video className="w-5 h-5 text-emerald-700" style={{ color: 'var(--theme-primary)' }} /> {fLabel}
            </h2>
            <p className="text-stone-500 text-xs leading-normal">
              {fDesc}
            </p>
          </div>
        );
      })()}

      <section className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
        <VideosClient mediaList={mediaList} slug={slug} />
      </section>
    </div>
  );
}
