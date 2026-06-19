'use client';

import React, { useState } from 'react';

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
  const [theme, setTheme] = useState<'white' | 'sepia' | 'dark'>('dark');

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
    <div className="space-y-8 text-center font-sans">
      {!activeBook ? (
        /* Render Booklets List Selection Card Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {booklets.map(book => (
            <div 
              key={book.id}
              onClick={() => openBook(book)}
              className="p-6 rounded-3xl border border-slate-850 hover:border-slate-700 bg-slate-950/40 cursor-pointer flex flex-col justify-between items-center text-center space-y-4 hover:scale-[1.02] transition shadow-lg"
            >
              <div className="w-24 h-32 bg-slate-900 border border-slate-850 rounded-lg shadow-inner flex flex-col items-center justify-center p-3 relative overflow-hidden">
                {/* Book design spine line */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                <span className="text-2xl mb-2">📖</span>
                <span className="text-[8px] text-slate-500 font-bold text-center leading-tight line-clamp-2">{book.title}</span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white leading-normal">{book.title}</h4>
                <p className="text-[10px] text-slate-500">ผู้เขียน: {book.author}</p>
                <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">{book.totalPages} หน้า</span>
              </div>

              <button className="px-4 py-2 bg-slate-850 text-[10px] font-bold text-emerald-400 hover:text-white rounded-xl transition border border-slate-800">
                📖 เปิดอ่านหนังสือออนไลน์
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Render Premium Inline Web Ebook Reader (Step 9 Inline Page Swipe) */
        <div 
          className={`rounded-3xl border border-slate-800 bg-slate-950/80 p-6 flex flex-col justify-between shadow-2xl animate-fade-in relative z-50 ${
            isFullScreen ? 'fixed inset-0 w-screen h-screen rounded-none z-50 bg-slate-950/95 flex flex-col justify-between p-8' : 'max-w-xl mx-auto'
          }`}
        >
          <header className="flex justify-between items-center border-b border-slate-850 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white text-left">{activeBook.title}</h3>
              <p className="text-[9px] text-slate-500 text-left">ผู้แต่ง: {activeBook.author}</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="text-[10px] text-slate-400 hover:text-white transition bg-slate-900 border border-slate-850 px-2 py-1 rounded"
              >
                {isFullScreen ? 'ย่อหน้าจอ' : 'เต็มหน้าจอ'}
              </button>
              <button 
                onClick={closeBook} 
                className="text-[10px] text-red-400 font-bold hover:text-red-300 transition"
              >
                ปิด [x]
              </button>
            </div>
          </header>

          {/* Accessibility Settings Panel */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 p-3 rounded-2xl border border-slate-850 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">ขนาดตัวอักษร:</span>
              <button
                onClick={() => setFontSize('small')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  fontSize === 'small' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 hover:bg-slate-850'
                }`}
              >
                เล็ก
              </button>
              <button
                onClick={() => setFontSize('medium')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  fontSize === 'medium' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 hover:bg-slate-850'
                }`}
              >
                กลาง
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  fontSize === 'large' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 hover:bg-slate-850'
                }`}
              >
                ใหญ่
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">โทนสี:</span>
              <button
                onClick={() => setTheme('white')}
                className={`px-2.5 py-1 rounded-lg font-medium transition border ${
                  theme === 'white' ? 'bg-white text-slate-900 border-emerald-500' : 'bg-white/80 text-slate-900 border-slate-300 hover:bg-white'
                }`}
              >
                สว่าง
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`px-2.5 py-1 rounded-lg font-medium transition border ${
                  theme === 'sepia' ? 'bg-[#f4eedb] text-[#4f3824] border-emerald-500' : 'bg-[#f4eedb]/80 text-[#4f3824] border-[#e7dec3] hover:bg-[#f4eedb]'
                }`}
              >
                ซีเปีย
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-2.5 py-1 rounded-lg font-medium transition border ${
                  theme === 'dark' ? 'bg-slate-900 text-slate-100 border-emerald-500' : 'bg-slate-900/80 text-slate-100 border-slate-800 hover:bg-slate-850'
                }`}
              >
                มืด
              </button>
            </div>
          </div>

          {/* Book Page Content Display (lightweight page-swipe viewer) */}
          <div className={`flex-1 py-12 px-6 border rounded-2xl flex flex-col justify-between min-h-[300px] sm:min-h-[400px] shadow-inner relative transition-colors duration-300 ${currentTheme.container}`}>
            <span className={`text-[8px] font-bold absolute top-3 left-1/2 -translate-x-1/2 uppercase tracking-widest ${currentTheme.headerText}`}>
              Forever Commemorative Web Reader
            </span>
            
            <div className="my-auto space-y-4 px-4 text-center">
              <p className={`leading-relaxed font-serif italic text-justify whitespace-pre-wrap transition-all duration-300 ${fontSizeClasses[fontSize]} ${currentTheme.pageText}`}>
                {activeBook.mockPages[currentPage - 1]}
              </p>
            </div>

            <div className={`text-[10px] font-bold ${currentTheme.footerText}`}>
              หน้า {currentPage} / {activeBook.totalPages}
            </div>
          </div>

          {/* Paging controls */}
          <footer className="flex justify-between items-center gap-4 mt-6 border-t border-slate-850 pt-4">
            <button 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-850 text-slate-300 hover:text-white font-bold text-xs disabled:opacity-30 disabled:pointer-events-none transition active:scale-95"
            >
              ← หน้าก่อนหน้า
            </button>
            <button 
              onClick={handleNextPage}
              disabled={currentPage === activeBook.totalPages}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-850 text-slate-300 hover:text-white font-bold text-xs disabled:opacity-30 disabled:pointer-events-none transition active:scale-95"
            >
              หน้าถัดไป →
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}
