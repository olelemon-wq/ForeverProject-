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
      <nav className="border-b border-[#bfc9c3]/20 bg-[#FFFFFF]/80 backdrop-blur-md sticky top-0 z-50 py-3">
        <div className="max-w-[1040px] mx-auto w-full flex justify-between items-center px-4 relative">
          
          <Link href="/" className="font-semibold text-lg tracking-tight text-[#1D1D1F] hover:opacity-80 transition-opacity duration-300">
            FOREVER
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-normal text-[#1D1D1F]/80">
            <a href="#features" className="hover:text-[#1D1D1F] transition-colors duration-300">
              Features
            </a>
            <a href="#legacy" className="hover:text-[#1D1D1F] transition-colors duration-300">
              Legacy
            </a>
            <a href="#memorials" className="hover:text-[#1D1D1F] transition-colors duration-300">
              Memorials
            </a>
            <a href="#about" className="hover:text-[#1D1D1F] transition-colors duration-300">
              About
            </a>
          </div>

          {/* Right action button / Mobile toggle */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="hidden md:inline-flex items-center justify-center bg-[#1D1D1F] text-[#FFFFFF] text-xs px-4 py-1.5 rounded-full hover:bg-[#1D1D1F]/90 transition-colors font-medium"
            >
              Get Started
            </Link>
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-[#1D1D1F] hover:opacity-80 transition-opacity cursor-pointer p-1"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Dropdown Panel */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute left-0 right-0 top-full border-b border-[#bfc9c3]/20 bg-[#FFFFFF] shadow-xl z-50 divide-y divide-[#bfc9c3]/10">
              <div className="flex flex-col p-4 gap-2 bg-[#FFFFFF]">
                <a 
                  href="#features" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#1D1D1F]/80 hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl transition block"
                >
                  Features
                </a>
                <a 
                  href="#legacy" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#1D1D1F]/80 hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl transition block"
                >
                  Legacy
                </a>
                <a 
                  href="#memorials" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#1D1D1F]/80 hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl transition block"
                >
                  Memorials
                </a>
                <a 
                  href="#about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#1D1D1F]/80 hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl transition block"
                >
                  About
                </a>
                <Link 
                  href="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 mt-2 text-sm font-semibold text-center text-[#FFFFFF] bg-[#1D1D1F] rounded-full hover:bg-[#1D1D1F]/90 transition block"
                >
                  Get Started
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
