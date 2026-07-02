'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Condolence {
  id: string;
  senderName: string;
  relationship: string;
  message: string;
  type: string;
  createdAt: Date | string;
}

interface CondolenceItemProps {
  condolence: Condolence;
}

const RELATIONSHIP_BADGES: Record<string, { label: string; className: string }> = {
  Family: { label: 'ครอบครัวใกล้ชิด', className: 'bg-amber-50 text-amber-800 border-amber-250/70' },
  Spouse: { label: 'ครอบครัวใกล้ชิด', className: 'bg-amber-50 text-amber-800 border-amber-250/70' },
  Son: { label: 'ครอบครัวใกล้ชิด', className: 'bg-amber-50 text-amber-800 border-amber-250/70' },
  Daughter: { label: 'ครอบครัวใกล้ชิด', className: 'bg-amber-50 text-amber-800 border-amber-250/70' },
  Grandchild: { label: 'ครอบครัวใกล้ชิด', className: 'bg-amber-50 text-amber-800 border-amber-250/70' },
  Relative: { label: 'ญาติพี่น้อง', className: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  Friend: { label: 'ผู้ร่วมไว้อาลัย', className: 'bg-stone-50 text-stone-600 border-stone-200' },
  Colleague: { label: 'ผู้ร่วมไว้อาลัย', className: 'bg-stone-50 text-stone-600 border-stone-200' },
};

const getRelationshipBadge = (rel: string) => {
  if (RELATIONSHIP_BADGES[rel]) {
    return RELATIONSHIP_BADGES[rel];
  }
  return { label: `ผู้ร่วมไว้อาลัย (${rel})`, className: 'bg-stone-50 text-stone-600 border-stone-200' };
};

export default function CondolenceItem({ condolence }: CondolenceItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isFamily = condolence.type === 'FAMILY';
  const text = condolence.message || '';
  const shouldTruncate = text.length > 220;
  const displayText = shouldTruncate && !isExpanded ? text.slice(0, 180) + '...' : text;

  const parseMessage = (msg: string) => {
    if (!msg) return '';
    const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
    const parts = msg.split(regex);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-extrabold text-stone-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="italic text-stone-850">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div 
      className={`relative overflow-hidden p-5 rounded-2xl border transition ${
        isFamily 
          ? 'border-amber-200/70 bg-white shadow-[0_6px_20px_rgba(245,158,11,0.06)]' 
          : 'border-stone-200/80 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.03)]'
      }`}
    >
      {/* Background Thai Pattern (Seamless Repeat) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage: "url('/BG-card/slice1.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: '100px 100px',
        }}
      />
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="text-sm font-bold text-stone-850">{condolence.senderName}</span>
        {(() => {
          const badge = getRelationshipBadge(condolence.relationship);
          return (
            <span className={`px-2 py-0.5 text-[9px] font-bold border rounded ${badge.className}`}>
              {badge.label}
            </span>
          );
        })()}
        <span className="text-[10px] text-stone-550 ml-auto">
          {new Date(condolence.createdAt).toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line break-words">
          "{parseMessage(displayText)}"
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10px] sm:text-xs font-bold text-emerald-700 hover:text-emerald-850 transition cursor-pointer focus:outline-none flex items-center gap-0.5 pt-1.5"
          >
            <span>{isExpanded ? 'ย่อข้อความ' : 'อ่านเพิ่มเติม'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
