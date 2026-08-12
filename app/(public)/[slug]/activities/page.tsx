import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { getEnabledFeatures } from '@/lib/features';
import { getFeatureLabel } from '@/lib/categories';
import CategoryOrnament from '@/components/public/CategoryOrnament';
import { FEATURE_CARD_CLASS } from '@/lib/publicLayout';
import { normalizeActivityRow } from '@/lib/activities';
import ActivitiesClient from './ActivitiesClient';

export const dynamic = 'force-dynamic';

async function getTenantData(slug: string) {
  return await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
}

export default async function PublicActivitiesPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  if (!getEnabledFeatures(tenant.themeConfig, tenant).activities) {
    notFound();
  }

  const rows = await db.activity.findMany({
    where: { websiteId: tenant.id },
    orderBy: [{ sortOrder: 'asc' }, { eventDate: 'desc' }, { createdAt: 'desc' }],
  });
  const activities = rows.map(normalizeActivityRow);
  const { label, description } = getFeatureLabel(tenant.category, 'activities');

  return (
    <div className="animate-fade-in text-center">
      <div
        className={`${FEATURE_CARD_CLASS} relative space-y-6 overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-5 text-left shadow-[0_4px_20px_rgba(0,0,0,0.015)] sm:space-y-8 sm:p-8 md:p-12`}
      >
        <div className="flex flex-col items-center space-y-3 text-center">
          <h2
            className="text-2xl font-black text-stone-900"
            style={{ color: 'var(--theme-primary, #0d9488)' }}
          >
            {label}
          </h2>
          <p className="max-w-lg text-xs leading-normal text-stone-500">{description}</p>
          <div className="flex w-full select-none items-center justify-center gap-4 pt-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-stone-200" />
            <div className="shrink-0">
              <CategoryOrnament category={tenant.category} count={1} />
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-stone-200" />
          </div>
        </div>

        <ActivitiesClient activities={activities} />
      </div>
    </div>
  );
}
