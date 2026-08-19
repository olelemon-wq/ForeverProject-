'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronUp, Menu as MenuIcon, X, Type } from 'lucide-react';
import { getEnabledFeatures, buildPublicNavItems, getFeatureOrderFromThemeConfig } from '@/lib/features';
import { getFeatureLabel } from '@/lib/categories';
import { toRelativeOffset } from '@/lib/imagePosition';
import { resolveDefaultMediaSrc } from '@/lib/defaultMedia';
import { resolveMediaSrc } from '@/lib/mediaUrl';
import PublicOverflowNav from '@/components/public/PublicOverflowNav';
import MemorialHero from '@/components/public/MemorialHero';
import { isDemoSiteSlug } from '@/lib/demoSites';

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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isDemoSite = isDemoSiteSlug(slug);

  const config = (tenant.themeConfig as any) || {};

  React.useEffect(() => {
    const saved = localStorage.getItem(`forever-font-zoom-${slug}`);
    if (saved) {
      setZoomLevel(parseInt(saved, 10));
    }
  }, [slug]);

  React.useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
  const coverUrl = resolveMediaSrc(resolveDefaultMediaSrc(config.coverUrl || ''));
  const coverScale = config.coverScale || 1;
  const coverX = toRelativeOffset(config.coverX || 0, 320, config.imageCoordSpace);
  const coverY = toRelativeOffset(config.coverY || 0, 160, config.imageCoordSpace);
  const coverRotate = config.coverRotate || 0;
  const avatarX = toRelativeOffset(config.avatarX || 0, 224, config.imageCoordSpace);
  const avatarY = toRelativeOffset(config.avatarY || 0, 224, config.imageCoordSpace);
  const avatarScale = config.avatarScale || 1;
  const avatarRotate = config.avatarRotate || 0;

  const enabledFeatures = getEnabledFeatures(config, tenant);
  const featureOrder = getFeatureOrderFromThemeConfig(config);
  const hasVisibleContent = Boolean(
    hasContent && Object.values(hasContent as Record<string, boolean>).some(Boolean)
  );

  const getLabel = (key: string, defaultLabel: string) => {
    try {
      return getFeatureLabel(tenant.category, key as any).label || defaultLabel;
    } catch {
      return defaultLabel;
    }
  };

  const navItems = buildPublicNavItems({
    slug,
    enabledFeatures,
    featureOrder,
    labelFor: (key, defaultLabel) => getLabel(key, defaultLabel),
  });

  return (
    <div 
      style={themeStyles} 
      className="flex min-h-screen flex-col bg-[#faf6f0] text-stone-800 transition-all duration-200"
    >
      {isDemoSite && (
        <div className="sticky top-0 z-50 border-b border-[#0071e3]/15 bg-[#F0F6FF]/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center px-4 py-2.5">
            <Link
              href="/examples"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0071e3] transition hover:text-[#0077ED]"
            >
              <ArrowLeft className="size-4 shrink-0" aria-hidden />
              ดูตัวอย่างอื่น
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-0 md:px-6">
        <MemorialHero
          name={tenant.name}
          coverUrl={coverUrl || null}
          avatarUrl={resolveMediaSrc(resolveDefaultMediaSrc(config.avatarUrl || '')) || null}
          coverTransform={{ x: coverX, y: coverY, scale: coverScale, rotate: coverRotate }}
          avatarTransform={{ x: avatarX, y: avatarY, scale: avatarScale, rotate: avatarRotate }}
          layout={config.heroLayout}
          bgMode={config.heroBgMode}
        />
      </div>

      {/* Dynamic Navigation Menu */}
      <nav
        className={
          isDemoSite
            ? 'sticky top-11 z-40 border-b border-stone-200/60 bg-white/85 shadow-xs backdrop-blur-sm'
            : 'sticky top-0 z-40 border-b border-stone-200/60 bg-white/85 shadow-xs backdrop-blur-sm'
        }
      >
        {/* Desktop Navigation Links */}
        <div className="relative hidden sm:flex max-w-5xl mx-auto px-4 items-center gap-3 h-14">
          <Link
            href="/"
            className="shrink-0 text-xs font-black tracking-[0.18em] text-stone-400 transition hover:text-stone-700"
          >
            FOREVER
          </Link>
          <PublicOverflowNav items={navItems} slug={slug} />
          <div className="w-14 shrink-0" aria-hidden />
        </div>

        {/* Mobile Navigation Header */}
        <div className="flex sm:hidden justify-between items-center h-14 px-4 max-w-5xl mx-auto">
          <Link
            href="/"
            className="text-xs font-black tracking-[0.18em] text-stone-500 transition hover:text-stone-800"
          >
            FOREVER
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-stone-100/80 text-stone-600 transition focus:outline-none cursor-pointer flex items-center justify-center gap-1.5"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
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
          <div className="sm:hidden absolute left-0 right-0 top-full border-b border-stone-200/65 bg-white shadow-xl z-50 animate-fade-in">
            <div className="flex flex-col p-2 gap-0.5 bg-white max-w-5xl mx-auto">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-xl text-[#0071e3] hover:bg-blue-50/60 transition"
              >
                <ArrowLeft className="size-4 shrink-0" aria-hidden />
                <span>หน้าแรก FOREVER</span>
              </Link>
              <div className="mx-2 my-1 border-b border-stone-100" />
              {navItems.map((item) => (
                <Link
                  key={item.key}
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
      <main className={`${hasVisibleContent ? 'flex-1 py-10' : 'py-4'} max-w-5xl mx-auto w-full px-4`}>
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
                  zoomLevel > 0 ? 'bg-emerald-800 text-white shadow-xs' : 'text-emerald-900 hover:bg-emerald-50'
                }`}
              >
                A+
              </button>
            </div>

            <p className="text-xs font-semibold leading-normal text-stone-600">
              {config.defaultFontSize === 'LARGE'
                ? 'เจ้าภาพตั้งค่าเริ่มต้นแบบใหญ่พิเศษ (สามารถปรับลด A- หรือเพิ่ม A+ ได้อีก)'
                : config.defaultFontSize === 'MEDIUM'
                ? 'เจ้าภาพตั้งค่าเริ่มต้นแบบอ่านง่ายสบายตา (สามารถปรับลด A- หรือเพิ่ม A+ ได้อีก)'
                : 'ขนาดปกติของหน้าเว็บ (สามารถปรับเพิ่ม A+ ได้สูงสุด 2 ระดับ)'}
            </p>
          </div>
        )}

        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="flex size-12 cursor-pointer items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-lg transition hover:bg-stone-50 hover:shadow-xl active:scale-[0.93] animate-fade-in"
            title="กลับขึ้นด้านบน"
            aria-label="กลับขึ้นด้านบน"
          >
            <ChevronUp className="size-5" aria-hidden />
          </button>
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
