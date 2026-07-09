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
          
          <Link href="/" className="font-semibold text-xl tracking-tight text-[#1D1D1F] hover:opacity-80 transition-opacity duration-300">
            FOREVER
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-normal text-[#1D1D1F]/80">
            <a href="#memorial" className="hover:text-[#1D1D1F] transition-colors duration-300">
              Memorial
            </a>
            <a href="#family-legacy" className="hover:text-[#1D1D1F] transition-colors duration-300">
              Family Legacy
            </a>
            <a href="#couple" className="hover:text-[#1D1D1F] transition-colors duration-300">
              Couple
            </a>
            <a href="#wedding" className="hover:text-[#1D1D1F] transition-colors duration-300">
              Wedding
            </a>
            <a href="#friends" className="hover:text-[#1D1D1F] transition-colors duration-300">
              Friends
            </a>
            <a href="#pet-memorial" className="hover:text-[#1D1D1F] transition-colors duration-300">
              Pet Memorial
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
              className="lg:hidden text-[#1D1D1F] hover:opacity-80 transition-opacity cursor-pointer p-1"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Dropdown Panel */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute left-0 right-0 top-full border-b border-[#bfc9c3]/20 bg-[#FFFFFF] shadow-xl z-50 divide-y divide-[#bfc9c3]/10">
              <div className="flex flex-col p-4 gap-2 bg-[#FFFFFF]">
                <a 
                  href="#memorial" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#1D1D1F]/80 hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl transition block"
                >
                  Memorial
                </a>
                <a 
                  href="#family-legacy" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#1D1D1F]/80 hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl transition block"
                >
                  Family Legacy
                </a>
                <a 
                  href="#couple" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#1D1D1F]/80 hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl transition block"
                >
                  Couple
                </a>
                <a 
                  href="#wedding" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#1D1D1F]/80 hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl transition block"
                >
                  Wedding
                </a>
                <a 
                  href="#friends" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#1D1D1F]/80 hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl transition block"
                >
                  Friends
                </a>
                <a 
                  href="#pet-memorial" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#1D1D1F]/80 hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl transition block"
                >
                  Pet Memorial
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
