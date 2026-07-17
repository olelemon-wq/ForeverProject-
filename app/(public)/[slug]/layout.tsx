import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Metadata } from 'next';
import PublicLayoutClient from './PublicLayoutClient';

export const dynamic = 'force-dynamic';

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

  const title =
    tenant.category === 'Friends'
      ? `${tenant.name} — กลุ่ม | FOREVER`
      : tenant.category === 'Couple' || tenant.category === 'Wedding'
        ? `${tenant.name} | FOREVER`
        : `รำลึกถึง ${tenant.name} - ${tenant.category} | FOREVER`;
  const description =
    tenant.category === 'Friends'
      ? `พื้นที่เก็บความทรงจำและข้อความถึงกันของ ${tenant.name}`
      : tenant.category === 'Couple' || tenant.category === 'Wedding'
        ? `ร่วมส่งคำอวยพรและความปรารถนาดีถึง ${tenant.name}`
        : `ร่วมรำลึก ร่วมจุดเทียน และเขียนคำไว้อาลัยแด่ ${tenant.name} เพื่อบันทึกความทรงจำอันทรงคุณค่าให้อยู่ตลอดไป`;

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
  const fontFamily = themeConfig?.fontFamily || 'Inter';
  const themeFont = fontFamily.includes(' ') ? `"${fontFamily}"` : fontFamily;
  const themeStyles = {
    '--theme-primary': themeConfig?.primaryColor || '#0d9488',
    '--theme-secondary': themeConfig?.secondaryColor || '#f59e0b',
    '--theme-font': themeFont,
    fontFamily: `${themeFont}, ui-sans-serif, system-ui, sans-serif`,
  } as React.CSSProperties;

  // Filter out menus that are not visible (Step 7 logic)
  const visibleMenus = tenant.menus.filter((menu) => menu.isVisible);

  // Check content presence in DB for optional features (BR003: only show tabs that have actual content)
  const [
    hasGallery,
    hasVideos,
    hasCondolence,
    hasMemory,
    hasFeed,
    hasFamily,
    hasEbooks
  ] = await Promise.all([
    db.media.findFirst({
      where: { 
        websiteId: tenant.id, 
        album: 'GALLERY', 
        isDeleted: false,
        NOT: { mimeType: { startsWith: 'video/' } }
      },
    }).then(m => !!m),
    db.media.findFirst({
      where: { 
        websiteId: tenant.id, 
        album: { in: ['GALLERY', 'VIDEO'] }, 
        isDeleted: false,
        mimeType: { startsWith: 'video/' }
      },
    }).then(m => !!m),
    db.condolence.findFirst({
      where: { websiteId: tenant.id, isApproved: true },
    }).then(c => !!c),
    db.memoryPost.findFirst({
      where: { websiteId: tenant.id, isApproved: true },
    }).then(m => !!m),
    db.memorialPost.findFirst({
      where: { tenantId: tenant.id, status: 'PUBLISHED' },
    }).then(f => !!f),
    db.familyMember.findFirst({
      where: { websiteId: tenant.id },
    }).then(f => !!f),
    db.ebook.findFirst({
      where: { websiteId: tenant.id },
    }).then(e => !!e)
  ]);

  const hasContent = {
    announcement: !!themeConfig?.announcement?.active && !!themeConfig?.announcement?.text,
    gallery: hasGallery,
    videos: hasVideos,
    condolence: hasCondolence,
    memory: hasMemory,
    feed: hasFeed,
    family: hasFamily,
    ebooks: hasEbooks,
    donation: !!tenant.donationActive && !!tenant.donationPromptPay,
  };

  return (
    <PublicLayoutClient
      tenant={tenant}
      slug={slug}
      visibleMenus={visibleMenus}
      themeStyles={themeStyles}
      hasContent={hasContent}
    >
      {children}
    </PublicLayoutClient>
  );
}

