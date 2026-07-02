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
          className="w-12 h-12 opacity-25 text-emerald-800" 
          viewBox="0 0 100 100" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ color: 'var(--theme-primary)' }}
        >
          {/* Traditional Thai Lotus / Kanok flame motif */}
          <path d="M50,15 C50,15 45,35 35,45 C25,55 15,65 15,75 C15,85 25,85 50,85 C75,85 85,85 85,75 C85,65 75,55 65,45 C55,35 50,15 50,15 Z" />
          <path d="M50,30 C50,30 47,45 40,52 C33,59 27,65 27,72 C27,80 35,80 50,80 C65,80 73,80 73,72 C73,65 67,59 60,52 C53,45 50,30 50,30 Z" />
          <path d="M50,45 C50,45 48,55 45,60 C42,65 38,70 38,75 C38,78 42,78 50,78 C58,78 62,78 62,75 C62,70 58,65 55,60 C52,55 50,45 50,45 Z" />
        </svg>
      );
  }
}
