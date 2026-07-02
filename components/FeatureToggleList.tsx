'use client';

import React from 'react';
import {
  Megaphone,
  Image as ImageIcon,
  Flame,
  StickyNote,
  MessagesSquare,
  Network,
  BookOpen,
  HandHeart,
  Check,
  Video,
  Lock,
  type LucideIcon,
} from 'lucide-react';
import { FEATURE_CATALOG, type FeatureKey, type FeatureMap } from '@/lib/features';

const ICONS: Record<string, LucideIcon> = {
  Megaphone,
  Image: ImageIcon,
  Flame,
  StickyNote,
  MessagesSquare,
  Network,
  BookOpen,
  HandHeart,
  Video,
};

export default function FeatureToggleList({
  value,
  onChange,
  disabled = false,
  mandatoryKeys = [],
  visibleKeys,
  labelFor,
}: {
  value: FeatureMap;
  onChange: (next: FeatureMap) => void;
  disabled?: boolean;
  mandatoryKeys?: FeatureKey[];
  visibleKeys?: FeatureKey[];
  labelFor?: (key: FeatureKey) => { label: string; description: string };
}) {
  const toggle = (key: FeatureKey) => {
    if (disabled || mandatoryKeys.includes(key)) return;
    onChange({ ...value, [key]: !value[key] });
  };

  const visibleFeatures = FEATURE_CATALOG.filter((f) => {
    if (!visibleKeys) return true;
    return visibleKeys.includes(f.key);
  });

  const mandatoryFeatures = visibleFeatures.filter((f) => mandatoryKeys.includes(f.key));
  const optionalFeatures = visibleFeatures.filter((f) => !mandatoryKeys.includes(f.key));
  const sortedFeatures = [...mandatoryFeatures, ...optionalFeatures];

  return (
    <div className="grid grid-cols-1 gap-3 max-w-2xl">
      {sortedFeatures.map((feature) => {
        const Icon = ICONS[feature.icon] ?? Flame;
        const isMandatory = mandatoryKeys.includes(feature.key);
        const active = isMandatory ? true : !!value[feature.key];

        const labelCopy = labelFor ? labelFor(feature.key) : { label: feature.label, description: feature.description };
        const displayLabel = labelCopy.label;
        const displayDesc = labelCopy.description;

        return (
          <button
            key={feature.key}
            type="button"
            role="switch"
            aria-checked={active}
            aria-label={displayLabel}
            onClick={() => toggle(feature.key)}
            disabled={disabled || isMandatory}
            className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all disabled:cursor-not-allowed ${
              isMandatory
                ? 'border-emerald-300 bg-emerald-50/50 opacity-85'
                : active
                ? 'border-emerald-300 bg-emerald-50/70 shadow-[0_2px_10px_rgba(13,148,136,0.08)]'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors order-1 ${
                active
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-stone-300 bg-white text-transparent'
              }`}
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>

            <span className="flex-1 order-2">
              <span className="block text-sm font-semibold text-stone-880 flex items-center gap-2">
                <span>{displayLabel}</span>
                {isMandatory && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md">
                    <Lock className="h-2.5 w-2.5" />
                    <span className="text-rose-500 font-black">*</span>
                    จำเป็น
                  </span>
                )}
              </span>
              <span className="mt-0.5 block text-xs leading-snug text-stone-500">
                {displayDesc}
              </span>
            </span>

            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl order-3 ${
                active ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-400'
              }`}
            >
              <Icon className="h-5 w-5" />
            </span>
          </button>
        );
      })}
    </div>
  );
}
