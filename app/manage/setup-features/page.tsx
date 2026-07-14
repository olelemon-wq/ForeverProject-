'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import FeatureToggleList from '@/components/FeatureToggleList';
import { 
  getInitialFeatureMapForCategory, 
  getVisibleKeys, 
  getFeatureLabel, 
  MANDATORY_FEATURES 
} from '@/lib/categories';
import { type FeatureMap } from '@/lib/features';
import { Button } from '@/components/ui/button';

function SetupFeaturesInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const websiteId = searchParams.get('site');
  const category = searchParams.get('category') || undefined;

  const [features, setFeatures] = useState<FeatureMap>(() => 
    getInitialFeatureMapForCategory(category)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!websiteId) {
      setError('ไม่พบรหัสเว็บไซต์ กรุณากลับไปที่หน้าจัดการ');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/tenant/update-features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteId, features }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push('/manage');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกฟีเจอร์');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 flex items-start justify-center p-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-stone-200 bg-white shadow-xl p-8 space-y-8 animate-fade-in">
        <header className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-black text-emerald-800 tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <Sparkles className="w-3 h-3" /> ตั้งค่าเริ่มต้น
          </span>
          <h1 className="text-2xl font-black text-stone-900 pt-2">เลือกฟีเจอร์ที่ต้องการใช้งาน</h1>
          <p className="text-stone-500 text-sm max-w-md mx-auto">
            ชำระเงินเรียบร้อยแล้ว เลือกเฉพาะส่วนที่คุณต้องการแสดงบนเว็บไซต์ความทรงจำ
            เพื่อให้หน้าเว็บเรียบและตรงใจ คุณสามารถเปิดเพิ่มภายหลังได้ในหน้าตั้งค่า
          </p>
        </header>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs font-semibold text-stone-600 flex items-center justify-between">
            <span>ฟีเจอร์หลัก (เปิดใช้งานเสมอ)</span>
            <span className="px-2 py-0.5 bg-stone-200 text-stone-700 rounded-md text-[10px] font-bold">
              รวมอยู่แล้ว: ประวัติโดยย่อ
            </span>
          </div>

          <FeatureToggleList 
            value={features} 
            onChange={setFeatures} 
            disabled={isLoading}
            mandatoryKeys={MANDATORY_FEATURES}
            visibleKeys={getVisibleKeys(category)}
            labelFor={(key) => getFeatureLabel(category, key)}
          />
        </div>

        <div className="pt-2">
          <Button variant="ghost"
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="h-auto w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition active:scale-95 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? 'กำลังบันทึก...' : 'ยืนยันและเริ่มใช้งาน'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </Button>
          <p className="mt-3 text-center text-[11px] text-stone-400">
            ฟีเจอร์ที่เลือกไว้ตอนนี้จะแสดงบนเว็บทันที — ปรับเปลี่ยนได้ทุกเมื่อในเมนูตั้งค่า
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SetupFeaturesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-600">
          <p className="text-sm font-semibold tracking-wider animate-pulse">กำลังโหลด...</p>
        </div>
      }
    >
      <SetupFeaturesInner />
    </Suspense>
  );
}
