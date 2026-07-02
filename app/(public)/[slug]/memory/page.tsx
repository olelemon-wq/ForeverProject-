import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { getEnabledFeatures } from '@/lib/features';
import MemoryWallClient from './MemoryWallClient';
import { getFeatureLabel } from '@/lib/categories';
import CategoryOrnament from '@/components/public/CategoryOrnament';

export const dynamic = 'force-dynamic';

async function getTenantData(slug: string) {
  return await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
}

async function getApprovedPosts(websiteId: string) {
  const posts = await db.memoryPost.findMany({
    where: {
      websiteId,
      isApproved: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return posts.map(p => ({
    id: p.id,
    title: p.title,
    content: p.content,
    mediaUrl: p.mediaUrl,
    mediaType: p.mediaType,
    senderName: p.senderName,
    createdAt: p.createdAt.toISOString(),
  }));
}

export default async function PublicMemoryWallPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  if (!getEnabledFeatures(tenant.themeConfig, tenant).memory) {
    notFound();
  }

  const posts = await getApprovedPosts(tenant.id);

  return (
    <div className="animate-fade-in space-y-8">
      {(() => {
        const { label: fLabel, description: fDesc } = getFeatureLabel(tenant.category, 'memory');
        return (
          <div className="rounded-3xl border border-stone-200/80 bg-white p-8 sm:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.015)] space-y-8 relative overflow-hidden">
            {/* Page Header with CategoryOrnament */}
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-stone-100">
              <CategoryOrnament category={tenant.category} />
              <h2 className="text-2xl font-black text-stone-900" style={{ color: 'var(--theme-primary, #0d9488)' }}>
                {fLabel}
              </h2>
              <p className="text-stone-500 text-xs max-w-lg leading-normal">
                {fDesc}
              </p>
            </div>

            {/* Memory Wall Grid & Interactive Clients */}
            <div>
              <MemoryWallClient websiteId={tenant.id} initialPosts={posts} />
            </div>
          </div>
        );
      })()}
    </div>
  );
}
