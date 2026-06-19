import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Metadata } from 'next';

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
    <div style={themeStyles} className="min-h-screen bg-[#faf6f0] text-stone-800 flex flex-col font-sans">
      {/* Dynamic Person JSON-LD Schema (schema.org) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": tenant.name,
            "description": `เว็บไซต์ความทรงจำและร่วมรำลึกถึง ${tenant.name} (${tenant.category})`,
            "url": `https://forever.co.th/${slug}`,
          }),
        }}
      />

      {/* Header */}
      <header className="relative py-16 text-center bg-white border-b border-stone-200/60 overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none opacity-10"
          style={{ backgroundColor: 'var(--theme-primary)' }}
        />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="w-24 h-24 rounded-full border-4 bg-stone-50 mx-auto shadow-md overflow-hidden flex items-center justify-center mb-4 animate-fade-in"
               style={{ borderColor: 'var(--theme-primary)' }}>
            <span className="text-3xl">🕯️</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 mb-2">
            {tenant.name}
          </h1>
        </div>
      </header>

      {/* Dynamic Navigation Menu (Step 7: Auto-hide and Visibility Checks) */}
      <nav className="border-b border-stone-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-center gap-1 sm:gap-2 h-14 overflow-x-auto">
          {visibleMenus.map((menu) => {
            const path = menu.pageType === 'HOME' ? '' : `/${menu.pageType.toLowerCase()}`;
            return (
              <Link 
                key={menu.id} 
                href={`/${slug}${path}`} 
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/30 transition"
              >
                {menu.title}
              </Link>
            );
          })}
          
          {/* Dynamic Memory Wall Link (Phase 2) */}
          <Link 
            href={`/${slug}/memory`} 
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/30 transition"
          >
            กระดานความทรงจำ
          </Link>

          {/* Dynamic Family Tree Link (Phase 2) */}
          <Link 
            href={`/${slug}/family`} 
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/30 transition"
          >
            ผังครอบครัว
          </Link>

          {/* Dynamic Ebooks Link (Phase 2) */}
          <Link 
            href={`/${slug}/ebooks`} 
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/30 transition"
          >
            หนังสือที่ระลึก
          </Link>

          {/* Dynamic Donation Link (Phase 2: BR015) */}
          {tenant.donationActive && (
            <Link 
              href={`/${slug}/donation`} 
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/30 transition"
            >
              ร่วมทำบุญ
            </Link>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-stone-500 border-t border-stone-200/60 bg-stone-100/30">
        <p>© 2026 FOREVER Digital Memorial Platform — {tenant.name}</p>
      </footer>
    </div>
  );
}

