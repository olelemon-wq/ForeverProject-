'use client';

import React, { useEffect, useState } from 'react';
import {
  CalendarDays,
  Edit3,
  FileText,
  Plus,
  Repeat2,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import ThaiDatePicker from '@/components/ThaiDatePicker';
import { getFeatureLabel } from '@/lib/categories';
import { formatActivityDate, type ActivityRecord } from '@/lib/activities';
import { resolveMediaSrc } from '@/lib/mediaUrl';

async function uploadFile(
  websiteId: string,
  file: File,
  album = 'ACTIVITIES',
): Promise<string> {
  const res = await fetch('/api/media/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      websiteId,
      fileName: `activity-${Date.now()}-${file.name}`,
      fileType: file.type,
      fileSize: file.size,
      album,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'อัปโหลดไฟล์ไม่สำเร็จ');

  if (data.uploadUrl) {
    const putRes = await fetch(data.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    if (!putRes.ok) throw new Error('อัปโหลดไฟล์ไม่สำเร็จ');
  }

  return data.filePath as string;
}

export default function ActivitiesEditor({
  websiteId,
  category,
  onCountChange,
}: {
  websiteId: string;
  category: string;
  onCountChange?: (count: number) => void;
}) {
  const feature = getFeatureLabel(category, 'activities');
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [activityId, setActivityId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [pdfUrl, setPdfUrl] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const resetForm = () => {
    setActivityId('');
    setTitle('');
    setDescription('');
    setEventDate('');
    setIsRecurring(false);
    setImages([]);
    setPdfUrl('');
    setImageFiles([]);
    setPdfFile(null);
    setFormOpen(false);
  };

  const loadActivities = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/activity/list?websiteId=${websiteId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const rows = (data.activities || []) as ActivityRecord[];
      setActivities(rows);
      onCountChange?.(rows.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [websiteId]);

  const startEdit = (activity: ActivityRecord) => {
    setActivityId(activity.id);
    setTitle(activity.title);
    setDescription(activity.description || '');
    setEventDate(activity.eventDate ? activity.eventDate.slice(0, 10) : '');
    setIsRecurring(activity.isRecurring);
    setImages(activity.images);
    setPdfUrl(activity.pdfUrl || '');
    setImageFiles([]);
    setPdfFile(null);
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError('');
    setSuccess('');

    try {
      let nextImages = [...images];
      for (const file of imageFiles) {
        nextImages.push(await uploadFile(websiteId, file));
      }

      let nextPdfUrl = pdfUrl.trim() || null;
      if (pdfFile) {
        nextPdfUrl = await uploadFile(websiteId, pdfFile, 'ACTIVITIES_PDF');
      }

      const res = await fetch('/api/activity/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activityId || undefined,
          websiteId,
          title,
          description,
          images: nextImages,
          pdfUrl: nextPdfUrl,
          eventDate: eventDate || null,
          isRecurring,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(activityId ? 'บันทึกการแก้ไขกิจกรรมสำเร็จ' : 'เพิ่มกิจกรรมสำเร็จ');
      await loadActivities();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'บันทึกกิจกรรมไม่สำเร็จ');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('ลบกิจกรรมนี้ใช่หรือไม่?')) return;
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/activity/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId: id, websiteId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess('ลบกิจกรรมสำเร็จ');
      await loadActivities();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ลบกิจกรรมไม่สำเร็จ');
    }
  };

  return (
    <section className="space-y-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <h3 className="flex items-center gap-1.5 text-lg font-black text-stone-900">
            <CalendarDays className="size-5 text-emerald-700" />
            <span>
              {feature.label} ({activities.length})
            </span>
          </h3>
          <p className="text-xs text-stone-500">{feature.description}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            if (formOpen) resetForm();
            else setFormOpen(true);
          }}
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-850 hover:bg-emerald-100"
        >
          {formOpen ? 'ปิดหน้าต่าง' : (
            <>
              <Plus className="size-3.5" />
              เพิ่มกิจกรรม
            </>
          )}
        </Button>
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </p>
      ) : null}

      {formOpen ? (
        <form
          onSubmit={handleSave}
          className="max-w-2xl space-y-4 rounded-2xl border border-stone-200 bg-stone-50/40 p-5"
        >
          <h4 className="flex items-center gap-1.5 text-xs font-black uppercase text-emerald-800">
            {activityId ? (
              <>
                <Edit3 className="size-3.5" />
                แก้ไขกิจกรรม
              </>
            ) : (
              <>
                <Plus className="size-3.5" />
                เพิ่ม{feature.label}
              </>
            )}
          </h4>

          <div className="space-y-1">
            <label className="text-sm font-bold text-stone-600">ชื่อกิจกรรม</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="เช่น งานแข่งขันหมากรุกบุญเครือรำลึก"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-stone-600">รายละเอียด</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="เล่ารายละเอียด กติกา หรือข้อมูลที่อยากให้ผู้เข้าชมทราบ"
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-bold text-stone-600">วันที่จัด (ไม่บังคับ)</label>
              <ThaiDatePicker value={eventDate} onChange={setEventDate} />
            </div>
            <label className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-700">
              <Checkbox
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked === true)}
              />
              <span className="flex items-center gap-1.5">
                <Repeat2 className="size-4 text-stone-500" />
                จัดเป็นประจำทุกปี
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-bold text-stone-600">รูปภาพ / โปสเตอร์</label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setImageFiles(e.target.files ? Array.from(e.target.files) : [])
                }
                className="text-sm"
              />
              {images.length > 0 ? (
                <p className="text-xs text-stone-500">มีรูปเดิม {images.length} รูป</p>
              ) : null}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-stone-600">ไฟล์ PDF (ไม่บังคับ)</label>
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="text-sm"
              />
              {pdfUrl ? (
                <p className="truncate text-xs text-stone-500">มีไฟล์ PDF เดิมอยู่แล้ว</p>
              ) : null}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={saveLoading} className="rounded-xl">
              {saveLoading ? 'กำลังบันทึก...' : activityId ? 'บันทึกการแก้ไข' : 'เพิ่มกิจกรรม'}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl">
              ยกเลิก
            </Button>
          </div>
        </form>
      ) : null}

      {loading ? (
        <p className="text-sm text-stone-500">กำลังโหลดกิจกรรม...</p>
      ) : activities.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-200 bg-stone-50/60 px-4 py-8 text-center text-sm text-stone-500">
          ยังไม่มี{feature.label}
        </p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => {
            const dateLabel = formatActivityDate(activity.eventDate, activity.isRecurring);
            return (
              <div
                key={activity.id}
                className="rounded-2xl border border-stone-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-bold text-stone-900">{activity.title}</p>
                    {dateLabel ? (
                      <p className="text-xs font-semibold text-emerald-700">{dateLabel}</p>
                    ) : null}
                    {activity.description ? (
                      <p className="line-clamp-2 text-xs leading-relaxed text-stone-500">
                        {activity.description}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap gap-2 pt-1 text-xs text-stone-400">
                      {activity.images.length > 0 ? (
                        <span>{activity.images.length} รูป</span>
                      ) : null}
                      {activity.pdfUrl ? (
                        <span className="inline-flex items-center gap-1">
                          <FileText className="size-3" />
                          PDF
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(activity)}
                      className="h-8 px-2"
                    >
                      <Edit3 className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(activity.id)}
                      className="h-8 px-2 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
                {activity.images[0] ? (
                  <img
                    src={resolveMediaSrc(activity.images[0])}
                    alt={activity.title}
                    className="mt-3 h-28 w-full rounded-xl object-cover"
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
