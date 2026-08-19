'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  createTimelineItem,
  getLifeStorySections,
  getTimelineAddLabel,
  getTimelineEmptyHint,
  getLifeStoryFieldValue,
  type LifeStoryData,
  type LifeStorySectionId,
} from '@/lib/lifeStory';

export default function LifeStoryEditor({
  category,
  section,
  value,
  onChange,
}: {
  category: string;
  section: LifeStorySectionId;
  value: LifeStoryData;
  onChange: (next: LifeStoryData) => void;
}) {
  const sections = getLifeStorySections(category);
  const active = sections.find((s) => s.id === section) ?? sections[0]!;

  const patch = (partial: Partial<LifeStoryData>) => {
    onChange({ ...value, ...partial });
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-stone-900">{active.label}</h3>
        <p className="text-xs text-stone-500">{active.description}</p>
      </div>

      {section !== 'timeline' ? (
        <Textarea
          value={getLifeStoryFieldValue(value, section)}
          onChange={(e) => patch({ [section]: e.target.value })}
          rows={10}
          placeholder={active.placeholder}
          className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm text-stone-900 transition focus:border-emerald-500/80 focus:bg-white focus:outline-none"
        />
      ) : (
        <div className="space-y-3">
          {value.timeline.length === 0 ? (
            <p className="rounded-xl border border-dashed border-stone-200 bg-stone-50/60 px-4 py-6 text-center text-xs text-stone-500">
              {getTimelineEmptyHint(category)}
            </p>
          ) : (
            value.timeline.map((item, index) => (
              <div
                key={item.id}
                className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    จุดที่ {index + 1}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 px-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    onClick={() =>
                      patch({
                        timeline: value.timeline.filter((row) => row.id !== item.id),
                      })
                    }
                  >
                    <Trash2 className="size-3.5" />
                    <span className="text-xs">ลบ</span>
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="space-y-1 sm:col-span-1">
                    <label className="text-xs font-bold text-stone-500">ปี / ช่วงเวลา</label>
                    <Input
                      value={item.year}
                      onChange={(e) =>
                        patch({
                          timeline: value.timeline.map((row) =>
                            row.id === item.id ? { ...row, year: e.target.value } : row,
                          ),
                        })
                      }
                      placeholder="เช่น 2495 หรือ ช่วงปี 2520–2530"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-stone-500">หัวข้อ</label>
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        patch({
                          timeline: value.timeline.map((row) =>
                            row.id === item.id ? { ...row, title: e.target.value } : row,
                          ),
                        })
                      }
                      placeholder="เช่น จบการศึกษา / เริ่มทำงาน / สร้างครอบครัว"
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500">รายละเอียด (ไม่บังคับ)</label>
                  <Textarea
                    value={item.description}
                    onChange={(e) =>
                      patch({
                        timeline: value.timeline.map((row) =>
                          row.id === item.id
                            ? { ...row, description: e.target.value }
                            : row,
                        ),
                      })
                    }
                    rows={3}
                    placeholder="เล่าสั้น ๆ เกี่ยวกับช่วงเวลานี้"
                    className="rounded-xl"
                  />
                </div>
              </div>
            ))
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full rounded-xl border-dashed"
            onClick={() =>
              patch({ timeline: [...value.timeline, createTimelineItem()] })
            }
          >
            <Plus className="size-4" />
            {getTimelineAddLabel(category)}
          </Button>
        </div>
      )}
    </div>
  );
}
