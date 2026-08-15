'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { MARKETING_CATEGORIES } from '@/lib/marketingCategories';
import { useLanguageStore } from '@/stores/useLanguageStore';

const TH_FLAG = (
  <span className="inline-flex w-[22px] h-[15px] shrink-0 overflow-hidden rounded-[3px] border border-stone-200/70 bg-[#EF3340]">
    <svg viewBox="0 0 9 6" className="block h-full w-full" preserveAspectRatio="none" aria-hidden>
      <rect fill="#EF3340" width="9" height="6" />
      <rect fill="#F1F2F2" y="1" width="9" height="4" />
      <rect fill="#002F6C" y="2" width="9" height="2" />
    </svg>
  </span>
);

const EN_FLAG = (
  <span className="inline-flex w-[22px] h-[15px] shrink-0 overflow-hidden rounded-[3px] border border-stone-200/70 bg-[#012169]">
    <svg viewBox="0 0 60 30" className="block h-full w-full" preserveAspectRatio="none" aria-hidden>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  </span>
);

export default function MarketingNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const { lang, setLang } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLang = mounted ? lang : 'th';

  const menuItems = [
    ...MARKETING_CATEGORIES.map((category) => ({
      href: `/${category.slug}`,
      label: currentLang === 'th' ? category.th.title : category.en.title,
    })),
    { href: '/examples', label: currentLang === 'th' ? 'ตัวอย่าง' : 'Examples' },
  ];

  return (
    <nav className="border-b border-[#bfc9c3]/20 bg-[#FFFFFF]/80 backdrop-blur-md sticky top-0 z-50 py-3">
      <div className="max-w-[1280px] mx-auto w-full flex justify-between items-center px-4 relative">
        <Link href="/" className="font-semibold text-xl tracking-tight text-[#1D1D1F] hover:opacity-80 transition-opacity duration-300">
          FOREVER
        </Link>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-normal text-[#1D1D1F]/80">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[#1D1D1F] transition-colors duration-300">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-stone-50 rounded-full border border-stone-200/70 transition active:scale-95 cursor-pointer text-[#1D1D1F] hover:text-[#1D1D1F] select-none"
            >
              {currentLang === 'th' ? TH_FLAG : EN_FLAG}
              <ChevronDown className={`w-3.5 h-3.5 text-[#1D1D1F]/70 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setIsLangDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl border border-stone-200 shadow-lg p-1.5 z-50 flex flex-col gap-0.5 animate-fade-in text-left">
                  <button
                    type="button"
                    onClick={() => {
                      setLang('th');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition text-left cursor-pointer hover:bg-stone-50 ${
                      currentLang === 'th' ? 'text-blue-700 bg-blue-50 font-bold' : 'text-[#1D1D1F]'
                    }`}
                  >
                    {TH_FLAG}
                    <span>ภาษาไทย</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLang('en');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition text-left cursor-pointer hover:bg-stone-50 ${
                      currentLang === 'en' ? 'text-blue-700 bg-blue-50 font-bold' : 'text-[#1D1D1F]'
                    }`}
                  >
                    {EN_FLAG}
                    <span>English</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <Link
            href="/login"
            className="hidden md:inline-flex items-center justify-center bg-[#0071e3] text-[#FFFFFF] text-xs px-4 py-1.5 rounded-full hover:bg-[#0077ED] transition-colors font-medium active:scale-95"
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

        {isMobileMenuOpen && (
          <div className="lg:hidden absolute left-0 right-0 top-full border-b border-[#bfc9c3]/20 bg-[#FFFFFF] shadow-xl z-50 divide-y divide-[#bfc9c3]/10">
            <div className="flex flex-col p-4 gap-2 bg-[#FFFFFF]">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#1D1D1F]/80 hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl transition block"
                >
                  {item.label}
                </Link>
              ))}

              <div className="px-4 py-3 flex items-center justify-between border-t border-stone-100 mt-2">
                <span className="text-xs font-semibold text-[#1D1D1F]/70">
                  {currentLang === 'th' ? 'เลือกภาษา' : 'Select Language'}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => { setLang('th'); setIsMobileMenuOpen(false); }}
                    className={`w-[24px] h-[16px] rounded-[3px] overflow-hidden border bg-[#EF3340] ${currentLang === 'th' ? 'border-[#0071e3] scale-105' : 'border-stone-300 opacity-60'}`}
                  >
                    <svg viewBox="0 0 9 6" className="block h-full w-full" preserveAspectRatio="none" aria-hidden>
                      <rect fill="#EF3340" width="9" height="6"/>
                      <rect fill="#F1F2F2" y="1" width="9" height="4"/>
                      <rect fill="#002F6C" y="2" width="9" height="2"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLang('en'); setIsMobileMenuOpen(false); }}
                    className={`w-[24px] h-[16px] rounded-[3px] overflow-hidden border bg-[#012169] ${currentLang === 'en' ? 'border-[#0071e3] scale-105' : 'border-stone-300 opacity-60'}`}
                  >
                    <svg viewBox="0 0 60 30" className="block h-full w-full" preserveAspectRatio="none" aria-hidden>
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
                className="px-4 py-3 mt-2 text-sm font-semibold text-center text-[#FFFFFF] bg-[#0071e3] rounded-full hover:bg-[#0077ED] transition block"
              >
                {currentLang === 'th' ? 'เริ่มต้นใช้งาน' : 'Get Started'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
