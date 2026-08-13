import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { getEnabledFeatures } from '@/lib/features';
import MemoryWallClient from './MemoryWallClient';
import { getFeatureLabel } from '@/lib/categories';
import CategoryOrnament from '@/components/public/CategoryOrnament';
import DonationPageShell from '@/components/public/DonationPageShell';

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
    <div className="animate-fade-in">
      <DonationPageShell
        category={tenant.category}
        patternOpacity={
          tenant.category === 'Couple'
            ? { mobile: 0.28, desktop: 0.34 }
            : tenant.category === 'Family Legacy'
              ? { mobile: 0.3, desktop: 0.36 }
              : { mobile: 0.28, desktop: 0.32 }
        }
      >
        {(() => {
          const { label: fLabel, pageDescription: fDesc } = getFeatureLabel(tenant.category, 'memory');
          return (
            <>
              <header className="mx-auto mb-8 max-w-xl space-y-3 text-center">
                <h2
                  className="text-2xl font-black tracking-tight text-stone-900 sm:text-[1.65rem]"
                  style={{ color: 'var(--theme-primary, #0d9488)' }}
                >
                  {fLabel}
                </h2>
                <p className="text-sm leading-relaxed text-stone-500">{fDesc}</p>
                <div className="flex items-center justify-center gap-4 pt-2 select-none">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-stone-200" />
                  <CategoryOrnament category={tenant.category} count={1} />
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-stone-200" />
                </div>
              </header>

              <MemoryWallClient
                websiteId={tenant.id}
                initialPosts={posts}
                category={tenant.category}
              />
            </>
          );
        })()}
      </DonationPageShell>
    </div>
  );
}
