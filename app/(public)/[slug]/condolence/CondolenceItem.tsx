'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import CondolenceReportDialog from '@/components/public/CondolenceReportDialog';

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
  websiteId: string;
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

export default function CondolenceItem({
  condolence,
  websiteId,
  hideRelationship = false,
}: CondolenceItemProps) {
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
    <div className="relative py-7 transition">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-sm font-bold text-stone-800 sm:text-base">{condolence.senderName}</span>
        {showRelationship && (() => {
          const badge = getRelationshipBadge(condolence.relationship);
          return (
            <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${badge.className}`}>
              {badge.label}
            </span>
          );
        })()}
        <span className="ml-auto text-[10px] tabular-nums text-stone-400">
          {new Date(condolence.createdAt).toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>
      <div className="space-y-1.5">
        <p className="break-words whitespace-pre-line text-xs leading-relaxed text-stone-600 sm:text-sm sm:leading-loose">
          &ldquo;{parseMessage(displayText)}&rdquo;
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex cursor-pointer items-center gap-0.5 pt-1 text-xs font-medium transition hover:opacity-70 focus:outline-none"
            style={{ color: 'var(--theme-primary, #0d9488)' }}
          >
            <span>{isExpanded ? 'ย่อข้อความ' : 'อ่านเพิ่มเติม'}</span>
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}
        <CondolenceReportDialog websiteId={websiteId} condolenceId={condolence.id} />
      </div>
    </div>
  );
}
