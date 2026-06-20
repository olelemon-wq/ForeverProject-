import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Metadata } from 'next';
import PublicLayoutClient from './PublicLayoutClient';

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const tenant = await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
  });

  if (!tenant) {
    return {};
  }

  const title = `รำลึกถึง ${tenant.name} - ${tenant.category} | FOREVER`;
  const description = `ร่วมรำลึก ร่วมจุดเทียน และเขียนคำไว้อาลัยแด่ ${tenant.name} เพื่อบันทึกความทรงจำอันทรงคุณค่าให้อยู่ตลอดไป`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://forever.co.th/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://forever.co.th/${slug}`,
      siteName: 'FOREVER Memorial',
      locale: 'th_TH',
      type: 'website',
    },
  };
}


async function getTenantData(slug: string) {
  const tenant = await db.tenant.findUnique({
    where: { slug: slug.toLowerCase() },
    include: {
      menus: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
  return tenant;
}

export default async function PublicMemorialLayout(props: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { children } = props;
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant || tenant.status === 'SUSPENDED') {
    notFound();
  }

  const themeConfig = tenant.themeConfig as any;
  const themeStyles = {
    '--theme-primary': themeConfig?.primaryColor || '#0d9488',
    '--theme-secondary': themeConfig?.secondaryColor || '#f59e0b',
    '--theme-font': themeConfig?.fontFamily || 'Inter',
  } as React.CSSProperties;

  // Filter out menus that are not visible (Step 7 logic)
  const visibleMenus = tenant.menus.filter((menu) => menu.isVisible);

  return (
    <PublicLayoutClient
      tenant={tenant}
      slug={slug}
      visibleMenus={visibleMenus}
      themeStyles={themeStyles}
    >
      {children}
    </PublicLayoutClient>
  );
}

