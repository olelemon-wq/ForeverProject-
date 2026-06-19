import { notFound } from 'next/navigation';
import Link from 'next/link';

// Mock DB Fetch function
async function getTenantData(slug: string) {
  // Reserved names check
  const reserved = ['admin', 'manage', 'api', 'payment', 'www', 'test'];
  if (reserved.includes(slug.toLowerCase())) {
    return null;
  }

  // Return mock data matching DB Schema
  return {
    slug,
    name: 'คุณพ่อ สมศักดิ์ เจริญยิ่ง',
    lifespan: '24 ตุลาคม 2488 – 12 พฤษภาคม 2569',
    category: 'Memorial',
    visibility: 'PUBLIC',
    themeConfig: {
      primaryColor: '#0d9488', // Teal 600
      secondaryColor: '#f59e0b', // Amber 500
      fontFamily: 'Inter, sans-serif',
      heroStyle: 'Classic',
    },
    biography: 'คุณพ่อสมศักดิ์เป็นคนขยัน ซื่อสัตย์ และรักครอบครัวมาก ท่านเป็นผู้นำที่ดีและเสียสละเสมอเพื่อการศึกษาของลูกๆ ความดีงามและคำสั่งสอนของท่านจะคงอยู่ในการดำเนินชีวิตของพวกเราตลอดไป...',
    createdAt: new Date(),
  };
}

export default async function PublicMemorialHome(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tenant = await getTenantData(slug);

  if (!tenant) {
    notFound();
  }

  const { themeConfig } = tenant;

  // CSS variables injection object
  const themeStyles = {
    '--theme-primary': themeConfig.primaryColor,
    '--theme-secondary': themeConfig.secondaryColor,
    '--theme-font': themeConfig.fontFamily,
  } as React.CSSProperties;

  return (
    <div 
      style={themeStyles} 
      className="min-h-screen bg-slate-900 text-slate-100 flex flex-col transition-colors duration-300"
    >
      {/* Dynamic Header / Hero */}
      <header className="relative py-20 text-center bg-slate-950 border-b border-slate-800/80 overflow-hidden">
        {/* Glow styling mapped to theme primary */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none opacity-20 transition-all"
          style={{ backgroundColor: 'var(--theme-primary)' }}
        />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="w-32 h-32 rounded-full border-4 bg-slate-800 mx-auto shadow-xl overflow-hidden flex items-center justify-center mb-6"
               style={{ borderColor: 'var(--theme-primary)' }}>
            {/* Placeholder Profile Picture */}
            <span className="text-4xl text-slate-500">🕯️</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            {tenant.name}
          </h1>
          <p className="text-slate-400 font-medium tracking-wide">
            {tenant.lifespan}
          </p>
        </div>
      </header>

      {/* Navigation menu for public website modules */}
      <nav className="border-b border-slate-800 bg-slate-950/40 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-center gap-1 sm:gap-2 h-14">
          <Link href={`/${slug}`} className="px-4 py-2 text-sm font-semibold rounded-full bg-slate-800 text-white"
                style={{ color: 'var(--theme-primary)' }}>
            หน้าแรก
          </Link>
          <Link href={`/${slug}/biography`} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition">
            ประวัติ
          </Link>
          <Link href={`/${slug}/gallery`} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition">
            อัลบั้มรูปภาพ
          </Link>
          <Link href={`/${slug}/condolence`} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition">
            สมุดไว้อาลัย
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-8 shadow-xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"
              style={{ color: 'var(--theme-primary)' }}>
            <span>📖</span> อาลัยและคำรำลึก
          </h2>
          <p className="text-slate-300 leading-relaxed indent-8">
            {tenant.biography}
          </p>
        </div>

        {/* Mock Call to action to write condolences */}
        <div className="mt-8 p-8 rounded-3xl border border-dashed border-slate-800 bg-slate-950/10 text-center">
          <h3 className="text-lg font-semibold text-slate-200 mb-2">
            ร่วมส่งคำไว้อาลัยและแสดงความระลึกถึง
          </h3>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            คุณสามารถร่วมจุดเทียนออนไลน์และเขียนคำไว้อาลัย เพื่อรวบรวมเป็นสมุดบันทึกส่งต่อให้ครอบครัวผู้ล่วงลับ
          </p>
          <button 
            className="px-6 py-3 font-semibold rounded-full text-slate-950 hover:brightness-110 active:scale-95 transition"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          >
            🕯️ ร่วมแสดงความไว้อาลัย
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-slate-600 border-t border-slate-950 bg-slate-950">
        <p>© 2026 FOREVER Digital Memorial Platform — {tenant.name}</p>
      </footer>
    </div>
  );
}
