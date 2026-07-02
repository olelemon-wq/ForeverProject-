import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { getEnabledFeatures } from '@/lib/features';
import FamilyTreeClient from './FamilyTreeClient';

export const dynamic = 'force-dynamic';

async function getTenantData(slug: string) {
  return await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
}

async function getFamilyMembers(websiteId: string) {
  return await db.familyMember.findMany({
    where: { websiteId },
    orderBy: { createdAt: 'asc' },
  });
}

export default async function PublicFamilyTreePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  if (!getEnabledFeatures(tenant.themeConfig, tenant).family) {
    notFound();
  }

  const members = await getFamilyMembers(tenant.id);

  return <FamilyTreeClient tenant={{ ...tenant, category: tenant.category }} members={members} />;
}
