'use client';

import React, { useState } from 'react';
import { CalendarDays, ChevronDown, FileText, Repeat2 } from 'lucide-react';
import { formatActivityDate, type ActivityRecord } from '@/lib/activities';
import { resolveMediaSrc } from '@/lib/mediaUrl';
import { cn } from '@/lib/utils';

export default function ActivitiesClient({
  activities,
}: {
  activities: ActivityRecord[];
}) {
  const [openId, setOpenId] = useState<string | null>(
    activities.length === 1 ? activities[0]?.id ?? null : null,
  );

  if (activities.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/60 px-4 py-10 text-center text-sm text-stone-500">
        ยังไม่มีกิจกรรมในขณะนี้
      </p>
    );
  }

  return (
    <div className="space-y-4 text-left">
      {activities.map((activity) => {
        const open = openId === activity.id;
        const dateLabel = formatActivityDate(activity.eventDate, activity.isRecurring);

        return (
          <article
            key={activity.id}
            className="overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-50/40"
          >
            <button
              type="button"
              onClick={() => setOpenId(open ? null : activity.id)}
              className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left sm:px-5"
            >
              <div className="min-w-0 space-y-1">
                <h3 className="text-base font-bold text-stone-900">{activity.title}</h3>
                {dateLabel ? (
                  <p
                    className="inline-flex items-center gap-1.5 text-xs font-semibold"
                    style={{ color: 'var(--theme-primary, #0d9488)' }}
                  >
                    <CalendarDays className="size-3.5" />
                    {dateLabel}
                  </p>
                ) : activity.isRecurring ? (
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600">
                    <Repeat2 className="size-3.5" />
                    จัดเป็นประจำ
                  </p>
                ) : null}
                {activity.description && !open ? (
                  <p className="line-clamp-2 text-sm leading-relaxed text-stone-600">
                    {activity.description}
                  </p>
                ) : null}
              </div>
              <ChevronDown
                className={cn(
                  'mt-1 size-4 shrink-0 text-stone-400 transition',
                  open && 'rotate-180',
                )}
              />
            </button>

            {open ? (
              <div className="space-y-4 border-t border-stone-200/80 px-4 pb-5 pt-4 sm:px-5">
                {activity.description ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-600">
                    {activity.description}
                  </p>
                ) : null}

                {activity.images.length > 0 ? (
                  <div className="space-y-2">
                    {activity.images.map((src, index) => (
                      <img
                        key={`${activity.id}-${index}`}
                        src={resolveMediaSrc(src)}
                        alt={`${activity.title} หน้า ${index + 1}`}
                        className="block h-auto w-full rounded-xl border border-stone-200 bg-white"
                      />
                    ))}
                  </div>
                ) : null}

                {activity.pdfUrl ? (
                  <a
                    href={resolveMediaSrc(activity.pdfUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
                  >
                    <FileText className="size-4" />
                    เปิดไฟล์ PDF
                  </a>
                ) : null}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
