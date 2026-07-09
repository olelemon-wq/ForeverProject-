'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Sparkles, ArrowRight, RotateCw } from 'lucide-react';
import FeatureToggleList from '@/components/FeatureToggleList';
import { 
  getInitialFeatureMapForCategory, 
  getVisibleKeys, 
  getFeatureLabel, 
  MANDATORY_FEATURES 
} from '@/lib/categories';
import { type FeatureMap } from '@/lib/features';

function OnboardingSetupFeaturesInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const websiteId = searchParams.get('site');
  const category = searchParams.get('category') || undefined;

  const [features, setFeatures] = useState<FeatureMap>(() => 
    getInitialFeatureMapForCategory(category)
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [siteDetails, setSiteDetails] = useState<any>(null);

  useEffect(() => {
    if (!websiteId) {
      setError('ไม่พบรหัสเว็บไซต์สำหรับการเปิดใช้งานฟีเจอร์');
      setIsLoading(false);
      return;
    }

    const fetchSite = async () => {
      try {
        const res = await fetch('/api/tenant/list-mine');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const matched = (data.websites || []).find((w: any) => w.id === websiteId);
        if (!matched) {
          throw new Error('ไม่พบข้อมูลเว็บไซต์ในบัญชีของคุณ');
        }

        setSiteDetails(matched);

        const existingFeatures = matched.themeConfig?.features;
        if (existingFeatures) {
          setFeatures(existingFeatures);
        }
      } catch (err: any) {
        setError(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSite();
  }, [websiteId]);

  const handleConfirm = async () => {
    if (!websiteId) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/tenant/update-features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteId, features }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Successfully onboarded -> Redirect to Backoffice Dashboard using slug!
      router.push(`/manage?site=${siteDetails?.slug || ''}`);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกฟีเจอร์');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center text-stone-600">
        <RotateCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-medium tracking-wide">กำลังเตรียมข้อมูลการเปิดใช้งานฟีเจอร์...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-850 flex flex-col items-center justify-center p-4 py-8">
      {/* Onboarding Steps Progress */}
      <div className="w-full max-w-xl mb-8 flex justify-between items-center text-xs px-2 font-medium text-stone-400">
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-200">✓</span>
          <span className="text-blue-600">เลือกชื่อลิงก์ URL</span>
        </div>
        <div className="h-[2px] bg-blue-200 flex-1 -mt-5" />
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-200">✓</span>
          <span className="text-blue-600">กรอกประวัติและเลือกธีม</span>
        </div>
        <div className="h-[2px] bg-blue-200 flex-1 -mt-5" />
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">3</span>
          <span className="text-blue-600 font-bold">ตั้งค่าเริ่มต้นฟีเจอร์</span>
        </div>
      </div>

      <div className="w-full max-w-2xl rounded-3xl border border-stone-200 bg-white shadow-xl p-8 space-y-8 animate-fade-in">
        <header className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-black text-blue-800 tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            <Sparkles className="w-3 h-3 text-blue-600" /> STEP 3: SETUP FEATURES
          </span>
          <h1 className="text-2xl font-black text-stone-900 pt-2">เลือกฟีเจอร์ที่ต้องการใช้งาน</h1>
          <p className="text-stone-500 text-xs max-w-md mx-auto leading-relaxed">
            เลือกฟีเจอร์เสริมที่คุณต้องการเปิดใช้สำหรับเด็กคนนี้หรือประวัตินี้โดยเฉพาะ (แก้ไขเพิ่มเติมได้ตลอดภายหลังในแผงจัดการ)
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
            disabled={isSubmitting}
            mandatoryKeys={MANDATORY_FEATURES}
            visibleKeys={getVisibleKeys(category || siteDetails?.category)}
            labelFor={(key) => getFeatureLabel(category || siteDetails?.category, key)}
          />
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-[#0071e3] hover:bg-[#0071e3]/90 text-white font-bold text-sm transition active:scale-95 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'กำลังบันทึกและสร้างเว็บ...' : 'ยืนยันและเปิดใช้งานหน้าความทรงจำ'}
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function OnboardingSetupFeaturesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-600">
          <p className="text-sm font-semibold tracking-wider animate-pulse">กำลังโหลด...</p>
        </div>
      }
    >
      <OnboardingSetupFeaturesInner />
    </Suspense>
  );
}
