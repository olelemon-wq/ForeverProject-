'use client';

import React, { useState } from 'react';

interface Booklet {
  id: string;
  title: string;
  totalPages: number;
  author: string;
  mockPages: string[];
}

export default function EbookReaderClient({ booklets }: { booklets: Booklet[] }) {
  const [activeBook, setActiveBook] = useState<Booklet | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);

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

          {/* Book Page Content Display (lightweight page-swipe viewer) */}
          <div className="flex-1 py-12 px-6 bg-slate-900/60 border border-slate-850 rounded-2xl flex flex-col justify-between min-h-[300px] sm:min-h-[400px] shadow-inner relative select-none">
            <span className="text-[8px] text-slate-600 font-bold absolute top-3 left-1/2 -translate-x-1/2 uppercase tracking-widest">Forever Commemorative Web Reader</span>
            
            <div className="my-auto space-y-4 px-4 text-center">
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-serif italic text-justify leading-normal whitespace-pre-wrap">
                {activeBook.mockPages[currentPage - 1]}
              </p>
            </div>

            <div className="text-[10px] text-slate-500 font-bold">
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
