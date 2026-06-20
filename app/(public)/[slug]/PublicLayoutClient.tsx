'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flame, Menu as MenuIcon, X, Eye } from 'lucide-react';

interface Menu {
  id: string;
  title: string;
  pageType: string;
  isVisible: boolean;
  sortOrder: number;
}

interface Tenant {
  name: string;
  category: string;
  donationActive: boolean;
}

export default function PublicLayoutClient({
  children,
  tenant,
  slug,
  visibleMenus,
  themeStyles,
}: {
  children: React.ReactNode;
  tenant: Tenant;
  slug: string;
  visibleMenus: Menu[];
  themeStyles: React.CSSProperties;
}) {
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    ...visibleMenus.map((menu) => {
      const path = menu.pageType === 'HOME' ? '' : `/${menu.pageType.toLowerCase()}`;
      return {
        title: menu.title,
        href: `/${slug}${path}`,
      };
    }),
    { title: 'กระดานความทรงจำ', href: `/${slug}/memory` },
    { title: 'ผังครอบครัว', href: `/${slug}/family` },
    { title: 'หนังสือที่ระลึก', href: `/${slug}/ebooks` },
    ...(tenant.donationActive ? [{ title: 'ร่วมทำบุญ', href: `/${slug}/donation` }] : []),
  ];

  return (
    <div 
      style={themeStyles} 
      className={`min-h-screen bg-[#faf6f0] text-stone-800 flex flex-col font-sans transition-all duration-200 ${
        textSize === 'large' ? 'accessibility-large-text' : ''
      }`}
    >
      {/* Accessibility Toolbar */}
      <div className="w-full h-9 bg-stone-100/90 border-b border-stone-200/50 px-4 flex sticky top-0 z-50 backdrop-blur-sm shadow-xs">
        <div className="max-w-3xl mx-auto w-full flex justify-end items-center gap-3 text-[11px] font-semibold text-stone-600">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-stone-500" /> ปรับขนาดตัวอักษร:
          </span>
          <div className="flex gap-1 bg-white border border-stone-200 rounded-full p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setTextSize('normal')}
              className={`px-3 py-0.5 rounded-full transition-all text-[10px] cursor-pointer ${
                textSize === 'normal' 
                  ? 'bg-stone-800 text-white font-bold' 
                  : 'text-stone-650 hover:bg-stone-50'
              }`}
            >
              ปกติ
            </button>
            <button
              type="button"
              onClick={() => setTextSize('large')}
              className={`px-3 py-0.5 rounded-full transition-all text-[10px] cursor-pointer ${
                textSize === 'large' 
                  ? 'bg-emerald-700 text-white font-bold' 
                  : 'text-stone-650 hover:bg-stone-50'
              }`}
            >
              ใหญ่พิเศษ (A+)
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="relative py-16 text-center bg-white border-b border-stone-200/60 overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none opacity-10"
          style={{ backgroundColor: 'var(--theme-primary)' }}
        />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="w-24 h-24 rounded-full border-4 bg-stone-50 mx-auto shadow-md overflow-hidden flex items-center justify-center mb-4 animate-fade-in"
               style={{ borderColor: 'var(--theme-primary)' }}>
            <Flame className="w-10 h-10 animate-pulse" style={{ color: 'var(--theme-primary)' }} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 mb-2">
            {tenant.name}
          </h1>
        </div>
      </header>

      {/* Dynamic Navigation Menu */}
      <nav className="border-b border-stone-200/60 bg-white/85 backdrop-blur-sm sticky top-9 z-40 shadow-xs">
        {/* Desktop Navigation Links */}
        <div className="hidden sm:flex max-w-3xl mx-auto px-4 items-center justify-center gap-1 sm:gap-2 h-14">
          {navItems.map((item, idx) => (
            <Link 
              key={idx} 
              href={item.href} 
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/30 transition flex-shrink-0"
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation Header */}
        <div className="flex sm:hidden justify-between items-center h-14 px-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-stone-600 tracking-wide uppercase">
            เมนูนำทาง
          </span>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-stone-100/80 text-stone-600 transition focus:outline-none cursor-pointer flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Panel */}
        {isMobileMenuOpen && (
          <div className="sm:hidden absolute left-0 right-0 top-full border-b border-stone-200/65 bg-white shadow-xl z-50 animate-fade-in divide-y divide-stone-100">
            <div className="flex flex-col p-2 gap-0.5 bg-white">
              {navItems.map((item, idx) => (
                <Link 
                  key={idx} 
                  href={item.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100/50 transition block"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        )}
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
