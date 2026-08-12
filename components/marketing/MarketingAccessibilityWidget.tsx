'use client';

import React, { useEffect, useState } from 'react';
import { ChevronUp, Type, X } from 'lucide-react';

const STORAGE_KEY = 'forever-font-zoom-marketing';

export default function MarketingAccessibilityWidget() {
  const [zoomLevel, setZoomLevel] = useState(0);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setZoomLevel(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 350);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const finalPercent = 100 + zoomLevel * 12.5;
    document.documentElement.style.fontSize = `${finalPercent}%`;
    return () => {
      document.documentElement.style.fontSize = '100%';
    };
  }, [zoomLevel]);

  const changeZoom = (newZoom: number) => {
    setZoomLevel(newZoom);
    localStorage.setItem(STORAGE_KEY, newZoom.toString());
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans select-none">
      {isAccessibilityOpen && (
        <div className="w-64 bg-white border border-[#E8E8ED] rounded-2xl p-4 shadow-2xl flex flex-col gap-3 animate-fade-in text-left">
          <div className="flex justify-between items-center border-b border-[#E8E8ED] pb-1.5">
            <h4 className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
              <Type className="w-4 h-4 text-emerald-700" />
              <span>ปรับขนาดตัวอักษร</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsAccessibilityOpen(false)}
              className="p-1 hover:bg-[#F5F5F7] text-[#86868B] hover:text-[#1D1D1F] rounded-lg transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex bg-[#F5F5F7] border border-[#E8E8ED] rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => changeZoom(Math.max(-1, zoomLevel - 1))}
              disabled={zoomLevel <= -1}
              className={`flex-1 py-1.5 rounded-lg text-center text-xs font-bold transition flex items-center justify-center cursor-pointer disabled:opacity-30 ${
                zoomLevel < 0 ? 'bg-[#1D1D1F] text-white shadow-xs' : 'text-[#86868B] hover:bg-white'
              }`}
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => changeZoom(0)}
              className={`flex-1 py-1.5 rounded-lg text-center text-xs font-bold transition cursor-pointer ${
                zoomLevel === 0 ? 'bg-[#1D1D1F] text-white shadow-xs' : 'text-[#86868B] hover:bg-white'
              }`}
            >
              ปกติ
            </button>
            <button
              type="button"
              onClick={() => changeZoom(Math.min(2, zoomLevel + 1))}
              disabled={zoomLevel >= 2}
              className={`flex-1 py-1.5 rounded-lg text-center text-xs font-bold transition flex items-center justify-center cursor-pointer disabled:opacity-30 ${
                zoomLevel > 0 ? 'bg-emerald-700 text-white shadow-xs' : 'text-[#86868B] hover:bg-white'
              }`}
            >
              A+
            </button>
          </div>

          <p className="text-xs text-[#86868B] font-semibold leading-normal">
            ขนาดปกติของหน้าเว็บ (สามารถปรับเพิ่ม A+ ได้สูงสุด 2 ระดับ)
          </p>
        </div>
      )}

      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex size-12 cursor-pointer items-center justify-center rounded-full border border-[#E8E8ED] bg-white text-[#1D1D1F] shadow-lg transition hover:bg-[#F5F5F7] hover:shadow-xl active:scale-[0.93] animate-fade-in"
          title="กลับขึ้นด้านบน"
          aria-label="กลับขึ้นด้านบน"
        >
          <ChevronUp className="size-5" aria-hidden />
        </button>
      )}

      <button
        type="button"
        onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
        className={`w-12 h-12 rounded-full border shadow-lg hover:shadow-xl active:scale-[0.93] transition flex items-center justify-center font-bold text-sm cursor-pointer select-none hover:bg-[#F5F5F7] ${
          isAccessibilityOpen
            ? 'bg-[#1D1D1F] border-[#1D1D1F] text-white'
            : zoomLevel !== 0
              ? 'bg-emerald-700 border-emerald-600 text-white hover:bg-emerald-800'
              : 'bg-white border-[#E8E8ED] text-[#1D1D1F]'
        }`}
        title="ปรับขนาดตัวอักษร"
        aria-label="ปรับขนาดตัวอักษร"
      >
        {isAccessibilityOpen ? <X className="w-5 h-5" /> : <span className="font-serif">Aa</span>}
      </button>
    </div>
  );
}
