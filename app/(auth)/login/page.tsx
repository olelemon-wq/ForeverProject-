'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Smartphone, Lock, RotateCw, CheckCircle2, AlertCircle } from 'lucide-react';

const CATEGORY_THAI_LABELS: Record<string, string> = {
  'Memorial': 'รำลึกผู้จากไป (Memorial)',
  'Family Legacy': 'มรดกวงศ์ตระกูล (Family Legacy)',
  'Couple': 'ความรักคู่รัก (Couple)',
  'Wedding': 'ความทรงจำแต่งงาน (Wedding)',
  'Friends': 'กลุ่มรุ่น (Friends)',
  'Pet Memorial': 'สัตว์เลี้ยงแสนรัก (Pet Memorial)'
};

function MobileLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState(1); // 1 = Phone Input, 2 = OTP Input
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการส่งรหัส OTP');
      }

      setStep(2);
      // Capture the mock SMS code returned by the server to display in the UI banner
      setSimulatedOtp(data.simulatedOtp || '');
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในระบบกรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otpCode, category }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'รหัส OTP ไม่ถูกต้อง');
      }

      // Successful verification -> Go to payment page if draft created, else go to manage dashboard
      if (data.draftTenantId) {
        router.push(`/manage/payment?site=${data.draftTenantId}`);
      } else {
        const next = searchParams.get('next');
        router.push(next && next.startsWith('/') ? next : '/manage');
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการยืนยันตัวตน');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl border border-stone-200 bg-white shadow-xl relative z-10 space-y-8 animate-fade-in text-center">
      
      {/* 3-Step Wizard Indicator (if registering a website) */}
      {category && (
        <div className="flex justify-between items-center text-[10px] font-bold text-stone-400 max-w-xs mx-auto pb-4 border-b border-stone-200/60 select-none">
          <span className="text-stone-500">1. เลือกหัวข้อ ✓</span>
          <span className="text-blue-600 border-b-2 border-blue-500 pb-1">2. ยืนยันเบอร์โทรศัพท์</span>
          <span>3. ชำระเงินค่าบริการ</span>
        </div>
      )}

      <header className="space-y-2">
        {category ? (
          <span className="text-[10px] uppercase font-black text-blue-800 tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 inline-block animate-pulse">
            กำลังสร้าง: {CATEGORY_THAI_LABELS[category] || category}
          </span>
        ) : (
          <span className="text-[10px] uppercase font-black text-stone-500 tracking-widest bg-stone-100 px-3.5 py-1 rounded-full border border-stone-200 inline-block">
            FOREVER LOGIN
          </span>
        )}
        <h1 className="text-2xl font-black text-stone-900 pt-2">
          เข้าสู่ระบบด้วยเบอร์มือถือ
        </h1>
        <p className="text-stone-500 text-xs leading-relaxed max-w-xs mx-auto">
          เพื่อความปลอดภัยสูงสุด ระบบจะส่งรหัสผ่านความปลอดภัย (OTP) เข้าเบอร์มือถือของคุณเพื่อเข้าใช้งานโดยตรง
        </p>
      </header>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Phone number input form */}
      {step === 1 && (
        <form onSubmit={handleRequestOtp} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block pl-1">
              เบอร์โทรศัพท์มือถือของคุณ
            </label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-4 w-4 h-4 text-stone-400" />
              <input 
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="ตัวอย่าง 0812345678"
                maxLength={10}
                className="w-full pl-11 pr-5 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 font-mono placeholder-stone-400 focus:outline-none focus:border-blue-600 focus:bg-white transition text-base"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 rounded-2xl bg-[#0071e3] hover:bg-[#0071e3]/95 text-white font-bold transition shadow-md active:scale-[0.98] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            disabled={isLoading || phoneNumber.length !== 10}
          >
            {isLoading && <RotateCw className="w-4 h-4 animate-spin" />}
            <span>{isLoading ? 'กำลังส่งรหัส OTP...' : 'รับรหัส OTP ผ่าน SMS'}</span>
          </button>
        </form>
      )}

      {/* STEP 2: OTP verification input form */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block text-center">
              ป้อนรหัส OTP 6 หลัก
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 w-4 h-4 text-stone-400" />
              <input 
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123456"
                className="w-full pl-11 pr-5 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 font-mono text-center tracking-[0.4em] text-xl placeholder-stone-300 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                disabled={isLoading}
                required
              />
            </div>
            <p className="text-[10px] text-stone-400 text-center">
              * ระบบส่งรหัสไปยังเบอร์ {phoneNumber} แล้ว (รหัสหมดอายุใน 5 นาที)
            </p>
          </div>

          {/* Simulated OTP Banner */}
          {simulatedOtp && (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center space-y-1">
              <p className="text-[10px] text-blue-900 font-bold">📲 (จำลองการรับข้อความจากระบบเครือข่าย)</p>
              <p className="text-xs text-stone-700 font-mono">
                รหัสผ่านยืนยันตัวตนของคุณคือ: <span className="font-bold underline text-sm tracking-wide text-blue-800">{simulatedOtp}</span>
              </p>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-4 rounded-2xl bg-[#0071e3] hover:bg-[#0071e3]/95 text-white font-bold transition shadow-md active:scale-[0.98] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            disabled={isLoading || otpCode.length !== 6}
          >
            {isLoading && <RotateCw className="w-4 h-4 animate-spin" />}
            <span>{isLoading ? 'กำลังประมวลผล...' : 'ยืนยันรหัส OTP'}</span>
          </button>

          <button 
            type="button"
            onClick={() => { setStep(1); setOtpCode(''); setSimulatedOtp(''); }}
            className="w-full text-center text-xs text-stone-500 hover:text-stone-850 transition font-medium cursor-pointer"
          >
            แก้ไขเบอร์โทรศัพท์
          </button>
        </form>
      )}
    </div>
  );
}

export default function MobileLogin() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#0071e3]/5 rounded-full blur-[80px] pointer-events-none" />

      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 rounded-3xl border border-stone-200 bg-white shadow-xl flex items-center justify-center text-stone-600">
            <RotateCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
            <span className="text-sm font-medium">กำลังโหลดแบบฟอร์ม...</span>
          </div>
        }
      >
        <MobileLoginInner />
      </Suspense>
    </main>
  );
}
