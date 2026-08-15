import Link from 'next/link';

export default function MarketingFooter() {
  return (
    <footer className="border-t border-[#E8E8ED] bg-[#FFFFFF] py-8 text-xs">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 px-6 text-[#86868B] md:flex-row">
        <p>© 2026 FOREVER. All rights reserved.</p>
        <div className="flex gap-4">
          <Link className="transition-colors hover:text-[#1D1D1F]" href="/privacy">
            Privacy Policy
          </Link>
          <span className="hidden md:inline">|</span>
          <Link className="transition-colors hover:text-[#1D1D1F]" href="/terms">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
