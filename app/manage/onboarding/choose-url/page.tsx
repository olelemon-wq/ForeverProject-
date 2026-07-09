'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle2, Globe, ArrowRight, RotateCw } from 'lucide-react';

function ChooseUrlInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const siteId = searchParams.get('site');

  const [isLoading, setIsLoading] = useState(true);
  const [slug, setSlug] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationMsg, setValidationMsg] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [siteDetails, setSiteDetails] = useState<any>(null);

  useEffect(() => {
    if (!siteId) {
      setError('ไม่พบรหัสเว็บไซต์เพื่อเริ่มขั้นตอนกำหนดลิงก์');
      setIsLoading(false);
      return;
    }

    const fetchSite = async () => {
      try {
        const res = await fetch('/api/tenant/list-mine');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const matched = (data.websites || []).find((w: any) => w.id === siteId);
        if (!matched) {
          throw new Error('ไม่พบข้อมูลเว็บไซต์ในบัญชีของคุณ');
        }

        // If not paid, redirect to payment
        if (matched.status === 'PENDING_PAYMENT') {
          router.push(`/manage/payment?site=${siteId}`);
          return;
        }

        setSiteDetails(matched);
        // Pre-fill slug if it is not a temporary 'draft-' one
        if (matched.slug && !matched.slug.startsWith('draft-')) {
          setSlug(matched.slug);
          setIsValidated(true);
          setIsAvailable(true);
        }
      } catch (err: any) {
        setError(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลเว็บไซต์');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSite();
  }, [siteId, router]);

  const checkSlugAvailability = async () => {
    if (!slug) return;
    setIsChecking(true);
    setValidationMsg('');
    setIsAvailable(null);
    setIsValidated(false);

    try {
      const res = await fetch('/api/tenant/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();

      if (!res.ok) {
        setIsAvailable(false);
        setValidationMsg(data.error || 'ชื่อลิงก์นี้ไม่สามารถใช้งานได้');
      } else {
        setIsAvailable(true);
        setIsValidated(true);
        setValidationMsg(data.message || 'ชื่อลิงก์นี้สามารถใช้งานได้');
      }
    } catch (err) {
      setIsAvailable(false);
      setValidationMsg('เกิดข้อผิดพลาดในการตรวจสอบชื่อลิงก์');
    } finally {
      setIsChecking(false);
    }
  };

  const handleConfirmUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidated || !isAvailable) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/tenant/update-slug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteId: siteId, slug }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // Proceed to Step 4b
      router.push(`/manage/onboarding/fill-info?site=${siteId}`);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกชื่อลิงก์');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center text-stone-600">
        <RotateCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-medium tracking-wide">กำลังเตรียมข้อมูลระบบหลังบ้าน...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-850 flex flex-col items-center justify-center p-4">
      {/* 3-Step Onboarding Progress Indicator */}
      <div className="w-full max-w-xl mb-8 flex justify-between items-center text-xs px-2 font-medium text-stone-400">
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</span>
          <span className="text-blue-600 font-bold">เลือกชื่อลิงก์ URL</span>
        </div>
        <div className="h-[2px] bg-stone-200 flex-1 -mt-5" />
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center font-bold">2</span>
          <span>กรอกประวัติและเลือกธีม</span>
        </div>
        <div className="h-[2px] bg-stone-200 flex-1 -mt-5" />
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center font-bold">3</span>
          <span>ตั้งค่าเริ่มต้นฟีเจอร์</span>
        </div>
      </div>

      <div className="w-full max-w-lg p-8 rounded-3xl border border-stone-200 bg-white shadow-xl space-y-8 animate-fade-in">
        <header className="text-center space-y-2">
          <span className="text-[10px] uppercase font-black text-blue-800 tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 inline-flex items-center gap-1">
            <Globe className="w-3 h-3 text-blue-600" /> STEP 1: CHOOSE URL
          </span>
          <h1 className="text-2xl font-black text-stone-900 pt-2">กำหนดชื่อลิงก์เว็บไซต์</h1>
          <p className="text-stone-500 text-xs leading-relaxed max-w-xs mx-auto">
            ตั้งชื่อลิงก์เพื่อส่งต่อและแชร์ให้แขกคนอื่น ๆ เข้ามาร่วมระลึกถึง
          </p>
        </header>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleConfirmUrl} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block pl-1">
              ที่อยู่ลิงก์เว็บไซต์ความทรงจำ
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-4 top-3.5 text-xs text-stone-400 font-mono select-none">
                  forever.co.th/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                    setIsValidated(false);
                    setIsAvailable(null);
                    setValidationMsg('');
                  }}
                  placeholder="name-surname"
                  className="w-full pl-[92px] pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 font-mono text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  disabled={isSubmitting}
                />
              </div>
              <button
                type="button"
                onClick={checkSlugAvailability}
                disabled={isChecking || !slug}
                className="px-5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-100 disabled:text-stone-400 text-white font-bold text-xs rounded-2xl transition active:scale-95 cursor-pointer flex-shrink-0 flex items-center justify-center gap-1.5"
              >
                {isChecking && <RotateCw className="w-3 h-3 animate-spin" />}
                <span>ตรวจสอบความว่าง</span>
              </button>
            </div>

            {/* Validation Message display status */}
            {validationMsg && (
              <div className={`p-3 rounded-xl border text-[11px] font-medium flex items-center gap-1.5 ${
                isAvailable 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                  : 'bg-red-50 border-red-100 text-red-800'
              }`}>
                {isAvailable ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-red-600" />}
                <span>{validationMsg}</span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!isValidated || !isAvailable || isSubmitting}
              className="w-full py-4 rounded-2xl bg-[#0071e3] hover:bg-[#0071e3]/90 text-white font-bold text-sm transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'กำลังบันทึก...' : 'ยืนยันชื่อลิงก์และไปต่อ'}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
            <p className="mt-3 text-center text-[10px] text-stone-400 leading-relaxed">
              * ต้องประกอบด้วยตัวอักษรพิมพ์เล็ก (a-z) ตัวเลข (0-9) และขีดกลาง (-) เท่านั้น ความยาว 3-50 ตัวอักษร
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function ChooseUrlPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-600">
          <p className="text-sm font-semibold tracking-wider animate-pulse">กำลังโหลด...</p>
        </div>
      }
    >
      <ChooseUrlInner />
    </Suspense>
  );
}
