'use client';

import { AnnouncementCardFrame } from '@/components/announcement/AnnouncementCardFrame';
import type { AnnouncementOrientation } from '@/lib/announcementCardLayout';

export function AnnouncementPreviewSticky({
  orientation,
  active,
  children,
}: {
  orientation: AnnouncementOrientation;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 lg:sticky lg:top-6">
      <p className="text-center text-xs font-bold text-stone-400">ตัวอย่างการ์ด</p>
      {active ? (
        <AnnouncementCardFrame orientation={orientation}>
          {children}
        </AnnouncementCardFrame>
      ) : (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-4 py-8 text-center text-xs text-stone-500">
          การ์ดปิดการแสดงผลอยู่ แขกจะไม่เห็นการ์ดนี้บนหน้าเว็บ
        </div>
      )}
    </div>
  );
}
