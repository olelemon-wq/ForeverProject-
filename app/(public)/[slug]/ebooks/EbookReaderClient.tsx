'use client';

import React, { useState } from 'react';
import { Type, Palette, Maximize2, Minimize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import EbookCatalogCard from '@/components/public/EbookCatalogCard';

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
    container: 'bg-white border-stone-200 text-stone-800',
    pageText: 'text-stone-700',
    footerText: 'text-stone-500',
  },
  sepia: {
    container: 'bg-[#f4eedb] border-[#e7dec3] text-[#4f3824]',
    pageText: 'text-[#5c4531]',
    footerText: 'text-[#7c654f]',
  },
  dark: {
    container: 'bg-stone-900/60 border-stone-800 text-stone-200',
    pageText: 'text-stone-300',
    footerText: 'text-stone-400',
  },
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
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const currentTheme = themeStyles[theme];

  if (!activeBook) {
    return (
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {booklets.map((book) => (
          <EbookCatalogCard
            key={book.id}
            title={book.title}
            author={book.author}
            totalPages={book.totalPages}
            coverSize="lg"
            onOpen={() => openBook(book)}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`relative z-50 flex flex-col rounded-3xl border border-stone-200/80 bg-white shadow-xl animate-fade-in ${
        isFullScreen
          ? 'fixed inset-0 h-screen w-screen rounded-none bg-stone-50 p-5 sm:p-8'
          : 'w-full p-5 sm:p-6'
      }`}
    >
      <header className="mb-4 flex select-none items-start justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="min-w-0 text-left">
          <h3 className="line-clamp-2 text-sm font-bold text-stone-900 sm:text-base">{activeBook.title}</h3>
          <p className="mt-0.5 text-[11px] text-stone-500">ผู้จัดทำ · {activeBook.author}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            title={isFullScreen ? 'ย่อหน้าจอ' : 'แสดงเต็มหน้าจอ'}
            className="flex cursor-pointer items-center justify-center rounded-xl border border-stone-200 bg-white p-1.5 text-stone-700 shadow-xs transition hover:bg-stone-50 active:scale-95"
          >
            {isFullScreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={closeBook}
            title="ปิดหน้าอ่านหนังสือ"
            className="flex cursor-pointer items-center justify-center rounded-xl border border-stone-200 bg-white p-1.5 text-stone-700 shadow-xs transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 active:scale-95"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200/80 bg-stone-50/80 px-3 py-2.5 text-xs shadow-xs select-none sm:px-3.5">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-bold text-stone-600">
            <Type className="h-3.5 w-3.5 text-stone-400" />
            ขนาดตัวอักษร
          </span>
          <div className="flex gap-0.5 rounded-full border border-stone-200 bg-white p-0.5 shadow-xs">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setFontSize(size)}
                className={`cursor-pointer rounded-full px-3 py-0.5 text-[10px] font-bold transition active:scale-95 ${
                  fontSize === size
                    ? 'bg-[color:var(--theme-primary,#0d9488)] text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {size === 'small' ? 'เล็ก' : size === 'medium' ? 'กลาง' : 'ใหญ่'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-bold text-stone-600">
            <Palette className="h-3.5 w-3.5 text-stone-400" />
            โทนสี
          </span>
          <div className="flex gap-0.5 rounded-full border border-stone-200 bg-white p-0.5 shadow-xs">
            {([
              { key: 'white' as const, label: 'สว่าง' },
              { key: 'sepia' as const, label: 'ซีเปีย' },
              { key: 'dark' as const, label: 'มืด' },
            ]).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTheme(key)}
                className={`cursor-pointer rounded-full px-3 py-0.5 text-[10px] font-bold transition active:scale-95 ${
                  theme === key
                    ? key === 'sepia'
                      ? 'border border-[#e4d7b5]/65 bg-[#f4eedb] text-[#4f3824] shadow-xs'
                      : key === 'dark'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-[color:var(--theme-primary,#0d9488)] text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`relative flex min-h-[300px] flex-1 flex-col justify-between rounded-2xl border px-5 py-10 shadow-inner transition-colors duration-300 sm:min-h-[400px] sm:px-8 ${currentTheme.container}`}
      >
        <div className="mx-auto my-auto w-full max-w-2xl space-y-4 px-1 text-center sm:px-4">
          <p
            className={`whitespace-pre-wrap text-justify font-serif leading-relaxed italic transition-all duration-300 ${fontSizeClasses[fontSize]} ${currentTheme.pageText}`}
          >
            {activeBook.mockPages[currentPage - 1]}
          </p>
        </div>

        <p className={`text-center text-[10px] font-bold tabular-nums ${currentTheme.footerText}`}>
          หน้า {currentPage} / {activeBook.totalPages}
        </p>
      </div>

      <footer className="mt-5 flex items-center justify-between gap-3 border-t border-stone-200 pt-4">
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 transition hover:bg-stone-50 active:scale-95 disabled:pointer-events-none disabled:opacity-30 sm:px-4"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          หน้าก่อนหน้า
        </button>
        <button
          type="button"
          onClick={handleNextPage}
          disabled={currentPage === activeBook.totalPages}
          className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-[color:var(--theme-primary,#0d9488)] px-3.5 py-2 text-xs font-bold text-white transition hover:opacity-90 active:scale-95 disabled:pointer-events-none disabled:opacity-40 sm:px-4"
        >
          หน้าถัดไป
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </footer>
    </div>
  );
}
