import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { getEnabledFeatures } from '@/lib/features';
import MemorialFeed from '../_components/feed/MemorialFeed';

export const dynamic = 'force-dynamic';

async function getTenantData(slug: string) {
  return await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });
}

export default async function FeedPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  if (!getEnabledFeatures(tenant.themeConfig, tenant).feed) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8 space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900" style={{ color: 'var(--theme-primary, #0d9488)' }}>
          ฟีดความทรงจำและคำร่วมไว้อาลัย
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          ร่วมแบ่งปันภาพถ่าย เล่าเรื่องราวความทรงจำอันงดงาม และแสดงความรำลึกถึงผู้ล่วงลับให้อยู่เคียงข้างกันตลอดไป
        </p>
      </div>

      <MemorialFeed websiteId={tenant.id} slug={slug} />
    </div>
  );
}
