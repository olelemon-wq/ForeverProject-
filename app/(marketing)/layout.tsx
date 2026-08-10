import MarketingNav from '@/components/marketing/MarketingNav';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingAccessibilityWidget from '@/components/marketing/MarketingAccessibilityWidget';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="marketing-light-surface min-h-screen bg-[#F5F5F7] text-[#1D1D1F] selection:bg-emerald-200 selection:text-[#1D1D1F] font-sans [color-scheme:light]"
      style={{ colorScheme: 'light' }}
    >
      <MarketingNav />
      {children}
      <MarketingFooter />
      <MarketingAccessibilityWidget />
    </div>
  );
}
