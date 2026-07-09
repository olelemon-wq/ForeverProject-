'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useLanguageStore } from '@/stores/useLanguageStore';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, setLang } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLang = mounted ? lang : 'th';

  const menuItems = [
    { href: '#memorial', label: currentLang === 'th' ? 'อนุสรณ์บุคคล' : 'Memorial' },
    { href: '#family-legacy', label: currentLang === 'th' ? 'มรดกวงศ์ตระกูล' : 'Family Legacy' },
    { href: '#couple', label: currentLang === 'th' ? 'คู่รัก' : 'Couple' },
    { href: '#wedding', label: currentLang === 'th' ? 'งานแต่งงาน' : 'Wedding' },
    { href: '#friends', label: currentLang === 'th' ? 'กลุ่มเพื่อน' : 'Friends' },
    { href: '#pet-memorial', label: currentLang === 'th' ? 'สัตว์เลี้ยง' : 'Pet Memorial' },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 selection:bg-emerald-200 selection:text-stone-900 font-sans">
      {/* Navbar */}
      <nav className="border-b border-[#bfc9c3]/20 bg-[#FFFFFF]/80 backdrop-blur-md sticky top-0 z-50 py-3">
        <div className="max-w-[1040px] mx-auto w-full flex justify-between items-center px-4 relative">
          
          <Link href="/" className="font-semibold text-[20px] tracking-tight text-[#1D1D1F] hover:opacity-80 transition-opacity duration-300">
            FOREVER
          </Link>

          {/* Desktop links - set to 14px as per user rules */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-[14px] font-normal text-[#1D1D1F]/80">
            {menuItems.map((item, idx) => (
              <a key={idx} href={item.href} className="hover:text-[#1D1D1F] transition-colors duration-300">
                {item.label}
              </a>
            ))}
          </div>

          {/* Right action button / Language Switcher / Mobile toggle */}
          <div className="flex items-center gap-4">
            
            {/* Flag Selector Switcher */}
            <div className="flex items-center gap-2.5 px-2 py-1 bg-stone-100/60 rounded-full border border-stone-200/50">
              <button 
                type="button"
                onClick={() => setLang('th')}
                className={`w-5.5 h-5.5 rounded-full overflow-hidden flex items-center justify-center transition active:scale-95 cursor-pointer border ${
                  currentLang === 'th' ? 'border-[#0071e3] scale-105 shadow-xs' : 'border-transparent opacity-50 hover:opacity-90'
                }`}
                title="ภาษาไทย"
              >
                {/* Thailand Flag SVG */}
                <svg viewBox="0 0 9 6" className="w-full h-full object-cover">
                  <rect fill="#EF3340" width="9" height="6"/>
                  <rect fill="#F1F2F2" y="1" width="9" height="4"/>
                  <rect fill="#002F6C" y="2" width="9" height="2"/>
                </svg>
              </button>

              <button 
                type="button"
                onClick={() => setLang('en')}
                className={`w-5.5 h-5.5 rounded-full overflow-hidden flex items-center justify-center transition active:scale-95 cursor-pointer border ${
                  currentLang === 'en' ? 'border-[#0071e3] scale-105 shadow-xs' : 'border-transparent opacity-50 hover:opacity-90'
                }`}
                title="English"
              >
                {/* UK Union Jack Flag SVG */}
                <svg viewBox="0 0 60 30" className="w-full h-full object-cover">
                  <rect width="60" height="30" fill="#012169"/>
                  <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                  <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2"/>
                  <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10"/>
                  <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/>
                </svg>
              </button>
            </div>

            <Link 
              href="/login" 
              className="hidden md:inline-flex items-center justify-center bg-[#1D1D1F] text-[#FFFFFF] text-xs px-4 py-1.5 rounded-full hover:bg-[#1D1D1F]/90 transition-colors font-medium active:scale-95"
            >
              {currentLang === 'th' ? 'เริ่มต้นใช้งาน' : 'Get Started'}
            </Link>
            
            <button 
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-[#1D1D1F] hover:opacity-80 transition-opacity cursor-pointer p-1"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Dropdown Panel */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute left-0 right-0 top-full border-b border-[#bfc9c3]/20 bg-[#FFFFFF] shadow-xl z-50 divide-y divide-[#bfc9c3]/10">
              <div className="flex flex-col p-4 gap-2 bg-[#FFFFFF]">
                {menuItems.map((item, idx) => (
                  <a 
                    key={idx}
                    href={item.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-[#1D1D1F]/80 hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl transition block"
                  >
                    {item.label}
                  </a>
                ))}
                
                {/* Mobile Language Switcher */}
                <div className="px-4 py-3 flex items-center justify-between border-t border-stone-100 mt-2">
                  <span className="text-xs font-semibold text-stone-500">
                    {currentLang === 'th' ? 'เลือกภาษา' : 'Select Language'}
                  </span>
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => { setLang('th'); setIsMobileMenuOpen(false); }}
                      className={`w-6 h-6 rounded-full overflow-hidden border ${currentLang === 'th' ? 'border-[#0071e3] scale-105' : 'border-stone-300 opacity-60'}`}
                    >
                      <svg viewBox="0 0 9 6" className="w-full h-full object-cover">
                        <rect fill="#EF3340" width="9" height="6"/>
                        <rect fill="#F1F2F2" y="1" width="9" height="4"/>
                        <rect fill="#002F6C" y="2" width="9" height="2"/>
                      </svg>
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setLang('en'); setIsMobileMenuOpen(false); }}
                      className={`w-6 h-6 rounded-full overflow-hidden border ${currentLang === 'en' ? 'border-[#0071e3] scale-105' : 'border-stone-300 opacity-60'}`}
                    >
                      <svg viewBox="0 0 60 30" className="w-full h-full object-cover">
                        <rect width="60" height="30" fill="#012169"/>
                        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2"/>
                        <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10"/>
                        <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <Link 
                  href="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 mt-2 text-sm font-semibold text-center text-[#FFFFFF] bg-[#1D1D1F] rounded-full hover:bg-[#1D1D1F]/90 transition block"
                >
                  {currentLang === 'th' ? 'เริ่มต้นใช้งาน' : 'Get Started'}
                </Link>
              </div>
            </div>
          )}

        </div>
      </nav>

      {children}
    </div>
  );
}
