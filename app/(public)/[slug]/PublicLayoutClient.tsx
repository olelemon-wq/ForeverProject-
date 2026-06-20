'use client';

import React, { useState } from 'react';
import Link from 'next/link';

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
          <span className="flex items-center gap-1">👁️ ปรับขนาดตัวอักษร:</span>
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
            <span className="text-3xl">🕯️</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 mb-2">
            {tenant.name}
          </h1>
        </div>
      </header>

      {/* Dynamic Navigation Menu */}
      <nav className="border-b border-stone-200/60 bg-white/85 backdrop-blur-sm sticky top-9 z-40 shadow-xs">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-center gap-1 sm:gap-2 h-14 overflow-x-auto">
          {visibleMenus.map((menu) => {
            const path = menu.pageType === 'HOME' ? '' : `/${menu.pageType.toLowerCase()}`;
            return (
              <Link 
                key={menu.id} 
                href={`/${slug}${path}`} 
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/30 transition flex-shrink-0"
              >
                {menu.title}
              </Link>
            );
          })}
          
          <Link 
            href={`/${slug}/memory`} 
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/30 transition flex-shrink-0"
          >
            กระดานความทรงจำ
          </Link>

          <Link 
            href={`/${slug}/family`} 
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/30 transition flex-shrink-0"
          >
            ผังครอบครัว
          </Link>

          <Link 
            href={`/${slug}/ebooks`} 
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/30 transition flex-shrink-0"
          >
            หนังสือที่ระลึก
          </Link>

          {tenant.donationActive && (
            <Link 
              href={`/${slug}/donation`} 
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/30 transition flex-shrink-0"
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
