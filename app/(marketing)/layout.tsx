'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 selection:bg-emerald-200 selection:text-stone-900 font-sans">
      {/* Navbar */}
      <nav className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
          
          <div className="flex items-center gap-2">
            <Link href="/" className="text-2xl font-bold tracking-wider bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              FOREVER
            </Link>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition">
              คุณสมบัติ
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition">
              ราคา
            </Link>
            <Link href="/manage" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition">
              จัดการเว็บ
            </Link>
            <Link href="/login" className="px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:brightness-105 transition active:scale-95 shadow-[0_4px_12px_rgba(16,185,129,0.2)]">
              สร้างเว็บไซต์ฟรี
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-xl border border-stone-200 text-stone-650 hover:bg-stone-50 transition cursor-pointer active:scale-95"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Dropdown Panel */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute left-0 right-0 top-full border-b border-stone-200/65 bg-white shadow-xl z-50 animate-fade-in divide-y divide-stone-100">
              <div className="flex flex-col p-3 gap-2 bg-white">
                <Link 
                  href="/features" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold rounded-xl text-stone-750 hover:text-stone-900 hover:bg-stone-100/50 transition block"
                >
                  คุณสมบัติ
                </Link>
                <Link 
                  href="/pricing" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold rounded-xl text-stone-755 hover:text-stone-900 hover:bg-stone-100/50 transition block"
                >
                  ราคา
                </Link>
                <Link 
                  href="/manage" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold rounded-xl text-stone-750 hover:text-stone-900 hover:bg-stone-100/50 transition block"
                >
                  จัดการเว็บ
                </Link>
                <Link 
                  href="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold rounded-xl text-center text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-105 transition block"
                >
                  สร้างเว็บไซต์ฟรี
                </Link>
              </div>
            </div>
          )}

        </div>
      </nav>

      {children}
    </div>
  );
}
