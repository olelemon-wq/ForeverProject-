import Link from 'next/link';

const footerLinks = {
  product: [
    { href: '/features', label: 'ฟีเจอร์' },
    { href: '/examples', label: 'ตัวอย่าง' },
    { href: '/pricing', label: 'ราคา' },
  ],
  company: [
    { href: '/about', label: 'เกี่ยวกับเรา' },
    { href: '/contact', label: 'ติดต่อ' },
  ],
  help: [
    { href: '/help', label: 'ศูนย์ช่วยเหลือ' },
    { href: '/faq', label: 'คำถามที่พบบ่อย' },
    { href: '/security', label: 'ความปลอดภัย' },
  ],
};

export default function MarketingFooter() {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E8E8ED] py-14 text-xs">
      <div className="max-w-[1280px] mx-auto px-6 text-left">
        <div className="grid grid-cols-3 gap-x-6 gap-y-8 mb-12 border-b border-[#E8E8ED] pb-12 md:gap-8">
          <div className="space-y-3">
            <h4 className="font-semibold text-[#1D1D1F]">ผลิตภัณฑ์</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((item) => (
                <li key={item.href}>
                  <Link className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-[#1D1D1F]">บริษัท</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((item) => (
                <li key={item.href}>
                  <Link className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-[#1D1D1F]">ช่วยเหลือ</h4>
            <ul className="space-y-2">
              {footerLinks.help.map((item) => (
                <li key={item.href}>
                  <Link className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[#86868B]">
          <p>© 2026 FOREVER. All rights reserved.</p>
          <div className="flex gap-4">
            <Link className="hover:text-[#1D1D1F] transition-colors" href="/privacy">
              Privacy Policy
            </Link>
            <span className="hidden md:inline">|</span>
            <Link className="hover:text-[#1D1D1F] transition-colors" href="/terms">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
