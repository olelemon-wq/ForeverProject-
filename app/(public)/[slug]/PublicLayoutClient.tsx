'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flame, Menu as MenuIcon, X, Eye, Type } from 'lucide-react';
import { getEnabledFeatures } from '@/lib/features';
import { getFeatureLabel } from '@/lib/categories';
import { imageTransformStyle, toRelativeOffset } from '@/lib/imagePosition';

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
  themeConfig?: any;
}

export default function PublicLayoutClient({
  children,
  tenant,
  slug,
  visibleMenus,
  themeStyles,
  hasContent,
}: {
  children: React.ReactNode;
  tenant: Tenant;
  slug: string;
  visibleMenus: Menu[];
  themeStyles: React.CSSProperties;
  hasContent?: any;
}) {
  const [zoomLevel, setZoomLevel] = useState<number>(0);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const config = (tenant.themeConfig as any) || {};

  React.useEffect(() => {
    const saved = localStorage.getItem(`forever-font-zoom-${slug}`);
    if (saved) {
      setZoomLevel(parseInt(saved, 10));
    }
  }, [slug]);

  const changeZoom = (newZoom: number) => {
    setZoomLevel(newZoom);
    localStorage.setItem(`forever-font-zoom-${slug}`, newZoom.toString());
  };

  React.useEffect(() => {
    let basePercent = 100;
    if (config.defaultFontSize === 'MEDIUM') basePercent = 112.5;
    else if (config.defaultFontSize === 'LARGE') basePercent = 125;

    const finalPercent = basePercent + (zoomLevel * 12.5);
    document.documentElement.style.fontSize = `${finalPercent}%`;

    return () => {
      document.documentElement.style.fontSize = '100%';
    };
  }, [config.defaultFontSize, zoomLevel]);
  const coverUrl = config.coverUrl || '';
  const coverScale = config.coverScale || 1;
  const coverX = toRelativeOffset(config.coverX || 0, 320, config.imageCoordSpace);
  const coverY = toRelativeOffset(config.coverY || 0, 160, config.imageCoordSpace);
  const coverRotate = config.coverRotate || 0;
  const avatarX = toRelativeOffset(config.avatarX || 0, 224, config.imageCoordSpace);
  const avatarY = toRelativeOffset(config.avatarY || 0, 224, config.imageCoordSpace);
  const avatarScale = config.avatarScale || 1;
  const avatarRotate = config.avatarRotate || 0;

  const enabledFeatures = getEnabledFeatures(config, tenant);
  
  const getLabel = (key: string, defaultLabel: string) => {
    try {
      return getFeatureLabel(tenant.category, key as any).label || defaultLabel;
    } catch {
      return defaultLabel;
    }
  };

  const navItems: { title: string; href: string }[] = [];

  // 1. Home (always shown)
  navItems.push({ title: 'หน้าแรก', href: `/${slug}` });

  // 2. Gallery
  if (enabledFeatures.gallery) {
    navItems.push({ title: getLabel('gallery', 'คลังภาพรำลึก'), href: `/${slug}/gallery` });
  }

  // 3. Condolence (สมุดไว้อาลัย / สมุดส่งความคิดถึง)
  if (enabledFeatures.condolence) {
    navItems.push({ title: getLabel('condolence', 'สมุดไว้อาลัย'), href: `/${slug}/condolence` });
  }

  // 4. Videos
  if (enabledFeatures.videos) {
    navItems.push({ title: getLabel('videos', 'คลังวิดีโอ'), href: `/${slug}/videos` });
  }

  // 5. Memory / ไดอารี่ความสุข
  if (enabledFeatures.memory) {
    navItems.push({ title: getLabel('memory', 'กระดานความทรงจำ'), href: `/${slug}/memory` });
  }

  // 6. Family
  if (enabledFeatures.family) {
    navItems.push({ title: getLabel('family', 'ผังครอบครัว'), href: `/${slug}/family` });
  }

  // 7. Ebooks
  if (enabledFeatures.ebooks) {
    navItems.push({ title: getLabel('ebooks', 'หนังสือที่ระลึก'), href: `/${slug}/ebooks` });
  }

  // 8. Donation
  if (enabledFeatures.donation && tenant.donationActive) {
    navItems.push({ title: getLabel('donation', 'ร่วมทำบุญ'), href: `/${slug}/donation` });
  }

  return (
    <div 
      style={themeStyles} 
      className="flex min-h-screen flex-col bg-[#faf6f0] text-stone-800 transition-all duration-200"
    >

      {/* Header */}
      <header className={`relative py-16 text-center border-b border-stone-200/60 overflow-hidden transition-all duration-500 ${
        coverUrl ? 'bg-stone-955 text-white py-20 sm:py-24' : 'bg-white'
      }`}>
        {coverUrl ? (
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img 
              src={coverUrl.startsWith('http') || coverUrl.startsWith('/') ? coverUrl : `/${coverUrl}`} 
              alt="Cover Image" 
              className="w-full h-full object-cover" 
              style={imageTransformStyle({
                x: coverX,
                y: coverY,
                scale: coverScale,
                rotate: coverRotate,
              })}
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]" />
          </div>
        ) : (
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none opacity-10"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          />
        )}
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="w-24 h-24 rounded-full border-4 bg-stone-50 mx-auto shadow-md overflow-hidden flex items-center justify-center mb-4 animate-fade-in relative"
               style={{ borderColor: 'var(--theme-primary)' }}>
            {config.avatarUrl ? (
              <img 
                src={config.avatarUrl.startsWith('http') || config.avatarUrl.startsWith('/') ? config.avatarUrl : `/${config.avatarUrl}`} 
                alt="Avatar"
                className="w-full h-full object-cover"
                style={imageTransformStyle({
                  x: avatarX,
                  y: avatarY,
                  scale: avatarScale,
                  rotate: avatarRotate,
                })}
              />
            ) : (
              <Flame className="w-10 h-10 animate-pulse" style={{ color: 'var(--theme-primary)' }} />
            )}
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-2 ${coverUrl ? 'text-white drop-shadow-md' : 'text-stone-900'}`}>
            {tenant.name}
          </h1>
        </div>
      </header>

      {/* Dynamic Navigation Menu */}
      <nav className="border-b border-stone-200/60 bg-white/85 backdrop-blur-sm sticky top-0 z-40 shadow-xs">
        {/* Desktop Navigation Links */}
        <div className="hidden sm:flex max-w-5xl mx-auto px-4 items-center justify-center gap-1 sm:gap-2 h-14">
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
        <div className="flex sm:hidden justify-between items-center h-14 px-4 max-w-5xl mx-auto">
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
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-stone-500 border-t border-stone-200/60 bg-stone-100/30">
        <p>© 2026 FOREVER Digital Memorial Platform — {tenant.name}</p>
      </footer>

      {/* Floating Accessibility Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans select-none">
        {/* Expanded Panel */}
        {isAccessibilityOpen && (
          <div className="w-64 bg-white border border-stone-200 rounded-2xl p-4 shadow-2xl flex flex-col gap-3 animate-fade-in text-left">
            <div className="flex justify-between items-center border-b border-stone-100 pb-1.5">
              <h4 className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
                <Type className="w-4 h-4 text-emerald-700" />
                <span>ปรับขนาดตัวอักษร</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsAccessibilityOpen(false)}
                className="p-1 hover:bg-stone-100 text-stone-400 hover:text-stone-700 rounded-lg transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex bg-stone-50 border border-stone-200 rounded-xl p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => changeZoom(Math.max(-1, zoomLevel - 1))}
                disabled={zoomLevel <= -1}
                className={`flex-1 py-1.5 rounded-lg text-center text-xs font-bold transition flex items-center justify-center cursor-pointer disabled:opacity-30 ${
                  zoomLevel < 0 ? 'bg-stone-800 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => changeZoom(0)}
                className={`flex-1 py-1.5 rounded-lg text-center text-xs font-bold transition cursor-pointer ${
                  zoomLevel === 0 ? 'bg-stone-800 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                ปกติ
              </button>
              <button
                type="button"
                onClick={() => changeZoom(Math.min(2, zoomLevel + 1))}
                disabled={zoomLevel >= 2}
                className={`flex-1 py-1.5 rounded-lg text-center text-xs font-bold transition flex items-center justify-center cursor-pointer disabled:opacity-30 ${
                  zoomLevel > 0 ? 'bg-emerald-700 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                A+
              </button>
            </div>

            <p className="text-[10px] text-stone-400 font-semibold leading-normal">
              {config.defaultFontSize === 'LARGE'
                ? 'เจ้าภาพตั้งค่าเริ่มต้นแบบใหญ่พิเศษ (สามารถปรับลด A- หรือเพิ่ม A+ ได้อีก)'
                : config.defaultFontSize === 'MEDIUM'
                ? 'เจ้าภาพตั้งค่าเริ่มต้นแบบอ่านง่ายสบายตา (สามารถปรับลด A- หรือเพิ่ม A+ ได้อีก)'
                : 'ขนาดปกติของหน้าเว็บ (สามารถปรับเพิ่ม A+ ได้สูงสุด 2 ระดับ)'}
            </p>
          </div>
        )}

        {/* Floating Trigger Button */}
        <button
          type="button"
          onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
          className={`w-12 h-12 rounded-full border shadow-lg hover:shadow-xl active:scale-[0.93] transition flex items-center justify-center font-bold text-sm cursor-pointer select-none hover:bg-stone-50 ${
            isAccessibilityOpen 
              ? 'bg-stone-800 border-stone-700 text-white' 
              : zoomLevel !== 0 
              ? 'bg-emerald-700 border-emerald-600 text-white hover:bg-emerald-800' 
              : 'bg-white border-stone-200 text-stone-700'
          }`}
          title="ปรับปรุงการเข้าถึงขนาดตัวอักษร"
        >
          {isAccessibilityOpen ? <X className="w-5 h-5" /> : <span className="font-serif">Aa</span>}
        </button>
      </div>
    </div>
  );
}
