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
  hideRelationship?: boolean;
}

const RELATIONSHIP_BADGES: Record<string, { label: string; className: string }> = {
  Family: { label: 'ครอบครัวใกล้ชิด', className: 'bg-amber-50 text-amber-700 border-amber-200/60' },
  Spouse: { label: 'ครอบครัวใกล้ชิด', className: 'bg-amber-50 text-amber-700 border-amber-200/60' },
  Son: { label: 'ครอบครัวใกล้ชิด', className: 'bg-amber-50 text-amber-700 border-amber-200/60' },
  Daughter: { label: 'ครอบครัวใกล้ชิด', className: 'bg-amber-50 text-amber-700 border-amber-200/60' },
  Grandchild: { label: 'ครอบครัวใกล้ชิด', className: 'bg-amber-50 text-amber-700 border-amber-200/60' },
  Relative: { label: 'ญาติพี่น้อง', className: 'bg-teal-50 text-teal-700 border-teal-200/60' },
  Friend: { label: 'ผู้ร่วมไว้อาลัย (เพื่อน)', className: 'bg-stone-50 text-stone-500 border-stone-200/60' },
  Colleague: { label: 'ผู้ร่วมไว้อาลัย (พนักงาน)', className: 'bg-stone-50 text-stone-500 border-stone-200/60' },
};

const getRelationshipBadge = (rel: string) => {
  if (RELATIONSHIP_BADGES[rel]) {
    return RELATIONSHIP_BADGES[rel];
  }
  return { label: `ผู้ร่วมไว้อาลัย (${rel})`, className: 'bg-stone-50 text-stone-600 border-stone-200' };
};

export default function CondolenceItem({ condolence, hideRelationship = false }: CondolenceItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const text = condolence.message || '';
  const shouldTruncate = text.length > 220;
  const displayText = shouldTruncate && !isExpanded ? text.slice(0, 180) + '...' : text;
  const showRelationship =
    !hideRelationship &&
    !!condolence.relationship &&
    condolence.relationship !== '—';

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
    <div className="relative py-7 first:pt-0 transition">
      {/* Header row */}
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-3">
        <span className="text-sm sm:text-base font-bold text-stone-800">{condolence.senderName}</span>
        {showRelationship && (() => {
          const badge = getRelationshipBadge(condolence.relationship);
          return (
            <span className={`px-2 py-0.5 text-[9px] font-bold border rounded-full ${badge.className}`}>
              {badge.label}
            </span>
          );
        })()}
        <span className="text-[10px] text-stone-400 ml-auto tabular-nums">
          {new Date(condolence.createdAt).toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>
      {/* Message body */}
      <div className="space-y-1.5">
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed sm:leading-loose whitespace-pre-line break-words">
          &ldquo;{parseMessage(displayText)}&rdquo;
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-medium transition cursor-pointer focus:outline-none flex items-center gap-0.5 pt-1 hover:opacity-70"
            style={{ color: 'var(--theme-primary, #0d9488)' }}
          >
            <span>{isExpanded ? 'ย่อข้อความ' : 'อ่านเพิ่มเติม'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
