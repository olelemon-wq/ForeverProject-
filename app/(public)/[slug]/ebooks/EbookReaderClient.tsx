'use client';

import React, { useState } from 'react';
import { BookOpen, Type, Palette, Maximize2, Minimize2, X } from 'lucide-react';

interface Booklet {
  id: string;
  title: string;
  totalPages: number;
  author: string;
  mockPages: string[];
}

const fontSizeClasses = {
  small: 'text-sm sm:text-base',
  medium: 'text-base sm:text-lg',
  large: 'text-lg sm:text-2xl font-semibold',
};

const themeStyles = {
  white: {
    container: 'bg-white border-slate-200 text-slate-800',
    metaText: 'text-slate-400',
    pageText: 'text-slate-700',
    headerText: 'text-slate-500',
    footerText: 'text-slate-500',
  },
  sepia: {
    container: 'bg-[#f4eedb] border-[#e7dec3] text-[#4f3824]',
    metaText: 'text-[#8c745c]',
    pageText: 'text-[#5c4531]',
    headerText: 'text-[#7c654f]',
    footerText: 'text-[#7c654f]',
  },
  dark: {
    container: 'bg-slate-900/60 border-slate-850 text-slate-200',
    metaText: 'text-slate-500',
    pageText: 'text-slate-300',
    headerText: 'text-slate-600',
    footerText: 'text-slate-500',
  }
};

export default function EbookReaderClient({ booklets }: { booklets: Booklet[] }) {
  const [activeBook, setActiveBook] = useState<Booklet | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [theme, setTheme] = useState<'white' | 'sepia' | 'dark'>('white');

  const openBook = (book: Booklet) => {
    setActiveBook(book);
    setCurrentPage(1);
  };

  const closeBook = () => {
    setActiveBook(null);
    setIsFullScreen(false);
  };

  const handleNextPage = () => {
    if (!activeBook) return;
    if (currentPage < activeBook.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const currentTheme = themeStyles[theme];

  return (
    <div className="space-y-8 text-center">
      {!activeBook ? (
        /* Render Booklets List Selection Card Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {booklets.map(book => (
            <div 
              key={book.id}
              onClick={() => openBook(book)}
              className="p-6 rounded-3xl border border-stone-200 hover:border-stone-350 bg-white cursor-pointer flex flex-col justify-between items-center text-center space-y-4 hover:scale-[1.02] transition shadow-sm"
            >
              <div className="w-24 h-32 bg-stone-50 border border-stone-200 rounded-lg shadow-inner flex flex-col items-center justify-center p-3 relative overflow-hidden">
                {/* Book design spine line */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600" />
                <BookOpen className="w-6 h-6 text-emerald-700 mb-2" />
                <span className="text-[8px] text-stone-500 font-bold text-center leading-tight line-clamp-2">{book.title}</span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-stone-900 leading-normal">{book.title}</h4>
                <p className="text-[10px] text-stone-500">ผู้เขียน: {book.author}</p>
                <span className="text-[9px] px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-bold">{book.totalPages} หน้า</span>
              </div>

              <button className="px-4 py-2 bg-emerald-50 text-[10px] font-bold text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 border border-emerald-100 rounded-xl transition flex items-center justify-center gap-1 mx-auto">
                <BookOpen className="w-3.5 h-3.5" />
                <span>เปิดอ่านหนังสือออนไลน์</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Render Premium Inline Web Ebook Reader (Step 9 Inline Page Swipe) */
        <div 
          className={`rounded-3xl border border-stone-200 bg-white p-6 flex flex-col justify-between shadow-xl animate-fade-in relative z-50 ${
            isFullScreen ? 'fixed inset-0 w-screen h-screen rounded-none z-50 bg-stone-50 flex flex-col justify-between p-8' : 'w-full'
          }`}
        >
          <header className="flex justify-between items-center border-b border-stone-200 pb-3 mb-4 select-none animate-fade-in">
            <div>
              <h3 className="text-sm font-black text-stone-900 text-left">{activeBook.title}</h3>
              <p className="text-[10px] text-stone-500 text-left">ผู้แต่ง: {activeBook.author}</p>
            </div>
            <div className="flex gap-2 items-center">
              <button 
                type="button"
                onClick={() => setIsFullScreen(!isFullScreen)}
                title={isFullScreen ? 'ย่อหน้าจอ' : 'แสดงเต็มหน้าจอ'}
                className="p-1.5 text-stone-500 hover:text-stone-800 transition bg-white border border-stone-200 rounded-xl hover:bg-stone-50 flex items-center justify-center cursor-pointer shadow-2xs active:scale-95"
              >
                {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button 
                type="button"
                onClick={closeBook} 
                title="ปิดหน้าอ่านหนังสือ"
                className="p-1.5 text-stone-500 hover:text-red-650 transition bg-white border border-stone-200 rounded-xl hover:bg-red-50 flex items-center justify-center cursor-pointer shadow-2xs active:scale-95"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>

          {/* Accessibility Settings Panel (Premium Toolbar widget) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 bg-stone-100/50 p-2 rounded-2xl border border-stone-200/80 mb-6 text-xs shadow-xs px-3.5 select-none">
            
            {/* Font Size Settings */}
            <div className="flex items-center gap-2">
              <span className="text-stone-550 font-bold flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-stone-400" />
                <span>ขนาดตัวอักษร:</span>
              </span>
              <div className="flex gap-0.5 bg-white border border-stone-200 rounded-full p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setFontSize('small')}
                  className={`px-3.5 py-0.5 rounded-full transition-all text-[10px] font-bold cursor-pointer active:scale-95 ${
                    fontSize === 'small' 
                      ? 'bg-stone-800 text-white shadow-xs' 
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  เล็ก
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('medium')}
                  className={`px-3.5 py-0.5 rounded-full transition-all text-[10px] font-bold cursor-pointer active:scale-95 ${
                    fontSize === 'medium' 
                      ? 'bg-stone-800 text-white shadow-xs' 
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  กลาง
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('large')}
                  className={`px-3.5 py-0.5 rounded-full transition-all text-[10px] font-bold cursor-pointer active:scale-95 ${
                    fontSize === 'large' 
                      ? 'bg-stone-800 text-white shadow-xs' 
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  ใหญ่
                </button>
              </div>
            </div>
            
            {/* Color Theme Settings */}
            <div className="flex items-center gap-2">
              <span className="text-stone-555 font-bold flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-stone-400" />
                <span>โทนสี:</span>
              </span>
              <div className="flex gap-0.5 bg-white border border-stone-200 rounded-full p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setTheme('white')}
                  className={`px-3.5 py-0.5 rounded-full transition-all text-[10px] font-bold cursor-pointer active:scale-95 ${
                    theme === 'white' 
                      ? 'bg-stone-800 text-white shadow-xs' 
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  สว่าง
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('sepia')}
                  className={`px-3.5 py-0.5 rounded-full transition-all text-[10px] font-bold cursor-pointer active:scale-95 ${
                    theme === 'sepia' 
                      ? 'bg-[#F4EEDB] text-[#4F3824] border border-[#E4D7B5]/65 shadow-2xs' 
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  ซีเปีย
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`px-3.5 py-0.5 rounded-full transition-all text-[10px] font-bold cursor-pointer active:scale-95 ${
                    theme === 'dark' 
                      ? 'bg-stone-900 text-white shadow-xs' 
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  มืด
                </button>
              </div>
            </div>
          </div>

          {/* Book Page Content Display (lightweight page-swipe viewer) */}
          <div className={`flex-1 py-12 px-6 border rounded-2xl flex flex-col justify-between min-h-[300px] sm:min-h-[400px] shadow-inner relative transition-colors duration-300 ${currentTheme.container}`}>
            <span className={`text-[8px] font-bold absolute top-3 left-1/2 -translate-x-1/2 uppercase tracking-widest ${currentTheme.headerText}`}>
              Forever Commemorative Web Reader
            </span>
            
            <div className="my-auto space-y-4 px-4 text-center max-w-2xl mx-auto w-full">
              <p className={`leading-relaxed font-serif italic text-justify whitespace-pre-wrap transition-all duration-300 ${fontSizeClasses[fontSize]} ${currentTheme.pageText}`}>
                {activeBook.mockPages[currentPage - 1]}
              </p>
            </div>

            <div className={`text-[10px] font-bold ${currentTheme.footerText}`}>
              หน้า {currentPage} / {activeBook.totalPages}
            </div>
          </div>

          {/* Paging controls */}
          <footer className="flex justify-between items-center gap-4 mt-6 border-t border-stone-200 pt-4">
            <button 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-600 hover:text-stone-900 font-bold text-xs disabled:opacity-30 disabled:pointer-events-none transition active:scale-95"
            >
              ← หน้าก่อนหน้า
            </button>
            <button 
              onClick={handleNextPage}
              disabled={currentPage === activeBook.totalPages}
              className="px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-600 hover:text-stone-900 font-bold text-xs disabled:opacity-30 disabled:pointer-events-none transition active:scale-95"
            >
              หน้าถัดไป →
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}
