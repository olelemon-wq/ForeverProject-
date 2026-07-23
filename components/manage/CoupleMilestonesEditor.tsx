'use client';

import ThaiDatePicker from '@/components/ThaiDatePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import type { CoupleMilestone } from '@/lib/coupleMilestones';
import { emptyCoupleMilestone } from '@/lib/coupleMilestones';

interface CoupleMilestonesEditorProps {
  milestones: CoupleMilestone[];
  onChange: (milestones: CoupleMilestone[]) => void;
  formatThaiDate: (isoDate: string) => string;
}

export default function CoupleMilestonesEditor({
  milestones,
  onChange,
  formatThaiDate,
}: CoupleMilestonesEditorProps) {
  const updateMilestone = (index: number, patch: Partial<CoupleMilestone>) => {
    onChange(milestones.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  };

  const removeMilestone = (index: number) => {
    if (milestones.length <= 1) {
      onChange([emptyCoupleMilestone()]);
      return;
    }
    onChange(milestones.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <p className="font-bold text-stone-700">รายการวันสำคัญ</p>
      <p className="text-[11px] text-stone-500 leading-relaxed">
        เพิ่มวันพบกันครั้งแรก ครบรอบ ทริป หรือช่วงเวลาที่อยากบันทึก — เรียงตามลำดับที่ต้องการแสดงบนการ์ด
      </p>

      {milestones.map((milestone, index) => (
        <div
          key={milestone.id}
          className="space-y-3 rounded-2xl border border-stone-200/80 bg-stone-100/40 p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-stone-700">วันสำคัญที่ {index + 1}</p>
            <Button
              type="button"
              variant="ghost"
              onClick={() => removeMilestone(index)}
              className="h-8 w-8 p-0 text-stone-400 hover:text-rose-600 hover:bg-rose-50"
              aria-label={`ลบวันสำคัญที่ ${index + 1}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-1">
            <label className="text-stone-600 font-semibold text-[11px]">ชื่อเหตุการณ์</label>
            <Input
              type="text"
              value={milestone.title}
              onChange={(e) => updateMilestone(index, { title: e.target.value })}
              placeholder="เช่น วันแรกที่พบกัน / ครบรอบ 3 ปี / ทริปญี่ปุ่น"
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-stone-600 font-semibold text-[11px]">วันที่</label>
              <div className="flex gap-1.5 items-center">
                <Input
                  type="text"
                  value={milestone.date}
                  onChange={(e) => updateMilestone(index, { date: e.target.value })}
                  placeholder="เช่น วันอาทิตย์ที่ 14 ก.พ. 68"
                  className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:border-emerald-500 min-w-0"
                />
                <ThaiDatePicker
                  align="right"
                  buttonClassName="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-250 rounded-xl text-stone-600 transition flex items-center justify-center cursor-pointer h-[38px] w-[38px] shrink-0"
                  iconClassName="w-4 h-4"
                  onChange={(val) => {
                    if (val) updateMilestone(index, { date: formatThaiDate(val) });
                  }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-stone-600 font-semibold text-[11px]">เวลา (ไม่บังคับ)</label>
              <Input
                type="text"
                value={milestone.time || ''}
                onChange={(e) => updateMilestone(index, { time: e.target.value })}
                placeholder="เช่น 18:00 น."
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-stone-600 font-semibold text-[11px]">สถานที่ (ไม่บังคับ)</label>
            <Input
              type="text"
              value={milestone.place || ''}
              onChange={(e) => updateMilestone(index, { place: e.target.value })}
              placeholder="เช่น ร้านอาหาร / ทริปท่องเที่ยว / บ้าน"
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-stone-600 font-semibold text-[11px]">โน้ตเพิ่มเติม (ไม่บังคับ)</label>
            <Input
              type="text"
              value={milestone.note || ''}
              onChange={(e) => updateMilestone(index, { note: e.target.value })}
              placeholder="เช่น วันที่เราไปดูพระอาทิตย์ตกด้วยกัน"
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-stone-600 font-semibold text-[11px]">ลิงก์ Google Maps (ไม่บังคับ)</label>
            <Input
              type="text"
              value={milestone.mapLink || ''}
              onChange={(e) => updateMilestone(index, { mapLink: e.target.value })}
              placeholder="https://maps.google.com/..."
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="ghost"
        onClick={() => onChange([...milestones, emptyCoupleMilestone()])}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-stone-300 bg-white py-2.5 text-xs font-bold text-stone-600 hover:border-[#0071e3]/30 hover:bg-[#0071e3]/5 hover:text-[#0071e3]"
      >
        <Plus className="w-4 h-4" />
        <span>เพิ่มวันสำคัญ</span>
      </Button>
    </div>
  );
}
