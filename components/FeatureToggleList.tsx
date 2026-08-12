'use client';

import React, { useMemo } from 'react';
import {
  Megaphone,
  Image as ImageIcon,
  Flame,
  StickyNote,
  MessagesSquare,
  Network,
  BookOpen,
  HandHeart,
  CalendarDays,
  Check,
  Video,
  Lock,
  GripVertical,
  Info,
  type LucideIcon,
} from 'lucide-react';
import {
  FEATURE_CATALOG,
  normalizeFeatureOrder,
  type FeatureKey,
  type FeatureMap,
} from '@/lib/features';
import { Sortable, SortableItem } from '@/components/ui/sortable';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  CalendarDays,
};

export default function FeatureToggleList({
  value,
  onChange,
  order,
  onOrderChange,
  disabled = false,
  mandatoryKeys = [],
  visibleKeys,
  labelFor,
}: {
  value: FeatureMap;
  onChange: (next: FeatureMap) => void;
  order: FeatureKey[];
  onOrderChange: (next: FeatureKey[]) => void;
  disabled?: boolean;
  mandatoryKeys?: FeatureKey[];
  visibleKeys?: FeatureKey[];
  labelFor?: (key: FeatureKey) => { label: string; description: string };
}) {
  const toggle = (key: FeatureKey) => {
    if (disabled || mandatoryKeys.includes(key)) return;
    onChange({ ...value, [key]: !value[key] });
  };

  const visibleFeatures = useMemo(() => {
    return FEATURE_CATALOG.filter((feature) => {
      if (!visibleKeys) return true;
      return visibleKeys.includes(feature.key);
    });
  }, [visibleKeys]);

  const orderedKeys = useMemo(
    () => normalizeFeatureOrder(order, visibleKeys),
    [order, visibleKeys],
  );

  const featureByKey = Object.fromEntries(
    visibleFeatures.map((feature) => [feature.key, feature]),
  ) as Record<FeatureKey, (typeof visibleFeatures)[number]>;

  const handleOrderChange = React.useCallback(
    (nextIds: (string | number)[]) => {
      onOrderChange(nextIds as FeatureKey[]);
    },
    [onOrderChange],
  );

  return (
    <div className="max-w-2xl space-y-4">
      <Alert className="border-amber-200/90 bg-amber-50/90 text-amber-950">
        <Info className="text-amber-600" />
        <AlertTitle className="text-sm font-bold text-amber-950">
          วิธีจัดลำดับเมนูบนเว็บไซต์
        </AlertTitle>
        <AlertDescription className="space-y-1.5 text-xs leading-relaxed text-amber-900/85">
          <p>
            กดค้างที่ไอคอน{' '}
            <span className="inline-flex translate-y-0.5 items-center rounded border border-stone-300 bg-white px-1 py-0.5 align-middle">
              <GripVertical className="size-3.5 text-stone-500" aria-hidden />
            </span>{' '}
            ด้านซ้ายของแต่ละรายการ แล้วเลื่อนขึ้น-ลงเพื่อสลับตำแหน่ง
          </p>
          <p>
            การแตะชื่อฟีเจอร์หรือวงกลม ✓ ใช้เปิด-ปิดการแสดงผลเท่านั้น — ลากจากตรงนั้นไม่ได้
          </p>
        </AlertDescription>
      </Alert>

      <Sortable value={orderedKeys} onValueChange={handleOrderChange} className="grid grid-cols-1 gap-2.5">
        {orderedKeys.map((key) => {
          const feature = featureByKey[key];
          if (!feature) return null;

          const Icon = ICONS[feature.icon] ?? Flame;
          const isMandatory = mandatoryKeys.includes(feature.key);
          const active = isMandatory ? true : !!value[feature.key];

          const labelCopy = labelFor
            ? labelFor(feature.key)
            : { label: feature.label, description: feature.description };
          const displayLabel = labelCopy.label;
          const displayDesc = labelCopy.description;

          return (
            <SortableItem key={feature.key} id={feature.key}>
              {({ setActivatorNodeRef, dragHandleProps }) => (
                <div
                  className={`group flex h-auto w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200 ${
                    isMandatory
                      ? 'border-[#0071e3]/20 bg-blue-50/40'
                      : active
                        ? 'border-[#0071e3]/25 bg-blue-50/30 hover:border-[#0071e3]/40 hover:shadow-sm'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                  } ${disabled ? 'opacity-70' : ''}`}
                >
                  <button
                    ref={setActivatorNodeRef}
                    aria-label={`ลากเพื่อจัดลำดับ ${displayLabel}`}
                    title="กดค้างแล้วลากขึ้น-ลง"
                    disabled={disabled}
                    className="flex size-8 shrink-0 touch-none cursor-grab items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-400 transition hover:border-stone-300 hover:text-stone-600 active:cursor-grabbing disabled:cursor-not-allowed"
                    {...dragHandleProps}
                  >
                    <GripVertical className="size-4" aria-hidden />
                  </button>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={active}
                    aria-label={displayLabel}
                    onClick={() => toggle(feature.key)}
                    disabled={disabled || isMandatory}
                    className="flex min-w-0 flex-1 items-center gap-4 text-left disabled:cursor-not-allowed"
                  >
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        active
                          ? 'border-[#0071e3] bg-[#0071e3] text-white'
                          : 'border-stone-300 bg-white text-transparent group-hover:border-stone-400'
                      }`}
                    >
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-sm font-bold text-stone-900">
                        <span>{displayLabel}</span>
                        {isMandatory && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#0071e3]/15 bg-blue-50 px-2 py-0.5 text-xs font-bold text-[#0071e3]">
                            <Lock className="size-2.5" />
                            จำเป็น
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-stone-500">
                        {displayDesc}
                      </span>
                    </span>
                  </button>

                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      active ? 'bg-[#0071e3]/10 text-[#0071e3]' : 'bg-stone-100 text-stone-500'
                    }`}
                    aria-hidden
                  >
                    <Icon className="size-5" />
                  </span>
                </div>
              )}
            </SortableItem>
          );
        })}
      </Sortable>
    </div>
  );
}
