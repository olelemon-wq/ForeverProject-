import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Query all active and public sites
  const tenants = await db.tenant.findMany({
    where: {
      visibility: 'PUBLIC',
      status: 'ACTIVE',
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const baseUrl = 'https://forever.co.th';

  const tenantUrls = tenants.map((t) => ({
    url: `${baseUrl}/${t.slug}`,
    lastModified: t.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    ...tenantUrls,
  ];
}
