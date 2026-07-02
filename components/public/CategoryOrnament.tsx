'use client';

import React from 'react';

interface CategoryOrnamentProps {
  category: string;
}

export default function CategoryOrnament({ category }: CategoryOrnamentProps) {
  // Select ornament based on category
  switch (category) {
    case 'Pet Memorial':
      return (
        <svg 
          className="w-12 h-12 opacity-30 text-emerald-800" 
          viewBox="0 0 100 100" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ color: 'var(--theme-primary)' }}
        >
          {/* Paw pads */}
          <circle cx="50" cy="55" r="10" />
          <circle cx="34" cy="38" r="6" />
          <circle cx="44" cy="29" r="6" />
          <circle cx="56" cy="29" r="6" />
          <circle cx="66" cy="38" r="6" />
          {/* Leaves/Clover branches */}
          <path d="M20,70 C15,55 18,38 30,28" />
          <path d="M80,70 C85,55 82,38 70,28" />
          <path d="M20,70 C30,75 40,77 50,77 C60,77 70,75 80,70" />
        </svg>
      );

    case 'Couple':
    case 'Wedding':
      return (
        <svg 
          className="w-12 h-12 opacity-30 text-rose-800" 
          viewBox="0 0 100 100" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ color: 'var(--theme-primary)' }}
        >
          {/* Intertwined heart shape */}
          <path d="M50,48 C50,48 42,38 35,45 C28,52 35,65 50,75 C65,65 72,52 65,45 C58,38 50,48 50,48 Z" />
          {/* Olive branch frame */}
          <path d="M22,62 C18,48 27,28 50,23 C73,28 82,48 78,62" />
          <path d="M22,62 C27,76 37,81 50,81 C63,81 73,76 78,62" />
        </svg>
      );

    case 'Family Legacy':
      return (
        <svg 
          className="w-12 h-12 opacity-30 text-amber-800" 
          viewBox="0 0 100 100" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ color: 'var(--theme-primary)' }}
        >
          {/* Family Tree line art */}
          <path d="M50,28 L50,72 M42,75 C46,73 50,72 50,72 C50,72 54,73 58,75" />
          <path d="M50,58 C42,53 37,44 32,44 C27,44 22,48 22,48" />
          <path d="M50,48 C58,44 63,35 68,35 C73,35 78,40 78,40" />
          <path d="M50,38 C45,30 37,25 37,25" />
          <path d="M50,42 C55,30 63,25 63,25" />
          <circle cx="32" cy="44" r="3.5" />
          <circle cx="22" cy="48" r="3.5" />
          <circle cx="68" cy="35" r="3.5" />
          <circle cx="78" cy="40" r="3.5" />
          <circle cx="37" cy="25" r="3.5" />
          <circle cx="63" cy="25" r="3.5" />
        </svg>
      );

    case 'Friends':
      return (
        <svg 
          className="w-12 h-12 opacity-30 text-indigo-800" 
          viewBox="0 0 100 100" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ color: 'var(--theme-primary)' }}
        >
          {/* Minimalist Twinkling Sparkles */}
          <path d="M50,22 C50,35 50,48 63,48 C50,48 50,61 50,74 C50,61 50,48 37,48 C50,48 50,35 50,22 Z" />
          <path d="M72,36 C72,42 72,49 79,49 C72,49 72,56 72,62 C72,56 72,49 65,49 C72,49 72,42 72,36 Z" />
          <path d="M28,44 C28,48 28,53 33,53 C28,53 28,58 28,62 C28,58 28,53 23,53 C28,53 28,48 28,44 Z" />
        </svg>
      );

    case 'Memorial':
    default:
      return (
        <svg 
          className="w-16 h-16 opacity-40 text-emerald-800" 
          viewBox="0 0 100 100" 
          fill="none" 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ color: 'var(--theme-primary)' }}
        >
          {/* Outer thin outline */}
          <path 
            d="M50,7 C56,16 64,24 68,32 C78,36 85,44 93,50 C85,56 78,64 68,68 C64,76 56,84 50,93 C44,84 36,76 32,68 C22,64 15,56 7,50 C15,44 22,36 32,32 C36,24 44,16 50,7 Z" 
            strokeWidth="1" 
          />
          {/* Outer thick outline */}
          <path 
            d="M50,12 C55,20 62,26 66,34 C76,37 82,45 88,50 C82,55 76,63 66,66 C63,76 55,82 50,88 C45,82 37,76 34,66 C24,63 18,55 12,50 C18,45 24,37 34,34 C37,24 45,18 50,12 Z" 
            strokeWidth="2.5" 
          />
          {/* Middle star outline */}
          <path 
            d="M50,24 C54,32 64,38 74,50 C64,52 54,58 50,74 C46,58 36,52 26,50 C36,38 46,32 50,24 Z" 
            strokeWidth="1.2" 
          />
          {/* Center 4-lobed core */}
          <path 
            d="M50,44 C52,44 52,47 52,48 C52,47 55,47 56,50 C55,50 55,53 52,52 C52,53 52,55 50,56 C48,55 48,53 48,52 C48,53 45,53 44,50 C45,47 48,47 48,48 C48,47 48,44 50,44 Z" 
            strokeWidth="1.2" 
          />
        </svg>
      );
  }
}
