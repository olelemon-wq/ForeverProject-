'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Smartphone, RotateCw, AlertCircle } from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

const CATEGORY_THAI_LABELS: Record<string, string> = {
  'Memorial': 'รำลึกผู้จากไป (Memorial)',
  'Family Legacy': 'เรื่องราวครอบครัว (Family Legacy)',
  'Couple': 'ความรักคู่รัก (Couple)',
  'Wedding': 'ความทรงจำแต่งงาน (Wedding)',
  'Friends': 'กลุ่มรุ่น (Friends)',
  'Pet Memorial': 'สัตว์เลี้ยงแสนรัก (Pet Memorial)',
};

const otpSlotClassName =
  'size-11 rounded-xl border border-[#E8E8ED] bg-[#FBFBFD] text-lg font-semibold tabular-nums text-[#1D1D1F] shadow-none transition-all first:rounded-xl last:rounded-xl first:border last:border data-[active=true]:border-[#0071e3] data-[active=true]:bg-white data-[active=true]:ring-[3px] data-[active=true]:ring-[#0071e3]/15 sm:size-12 sm:text-xl';

function formatPhoneDisplay(phone: string) {
  if (phone.length !== 10) return phone;
  return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
}

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

      // Registration with category -> unified 5-step create wizard
      if (category) {
        router.push(`/manage/create?category=${encodeURIComponent(category)}`);
        return;
      }

      const next = searchParams.get('next');
      router.push(next && next.startsWith('/') ? next : '/manage');
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการยืนยันตัวตน');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-[28px] border border-[#E8E8ED] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_16px_48px_rgba(0,0,0,0.08)] relative z-10 space-y-8 animate-fade-in text-center">
      
      {category && (
        <div className="max-w-xs mx-auto pb-4 border-b border-stone-200/60 text-xs font-medium text-stone-500 leading-relaxed">
          หลังยืนยัน OTP ระบบจะพาไปเลือกหมวด → ชำระเงิน → ตั้งชื่อลิงก์ URL แล้วเข้าหน้าจัดการ
        </div>
      )}

      <header className="space-y-2">
        {category ? (
          <span className="inline-block rounded-full border border-[#0071e3]/15 bg-[#F5F5F7] px-3.5 py-1 text-xs font-semibold text-[#0071e3]">
            กำลังสร้าง: {CATEGORY_THAI_LABELS[category] || category}
          </span>
        ) : (
          <span className="inline-block rounded-full border border-[#E8E8ED] bg-[#F5F5F7] px-3.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#6E6E73]">
            FOREVER LOGIN
          </span>
        )}
        <h1 className="pt-2 text-2xl font-semibold tracking-tight text-[#1D1D1F]">
          เข้าสู่ระบบด้วยเบอร์มือถือ
        </h1>
        <p className="mx-auto max-w-xs text-sm leading-relaxed text-[#6E6E73]">
          เพื่อความปลอดภัยสูงสุด ระบบจะส่ง
          <br />
          รหัสผ่านความปลอดภัย (OTP)
          <br />
          เข้าเบอร์มือถือของคุณเพื่อเข้าใช้งานโดยตรง
        </p>
      </header>

      {error && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          <AlertCircle className="size-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Phone number input form */}
      {step === 1 && (
        <form onSubmit={handleRequestOtp} className="space-y-6 text-left">
          <div className="space-y-2">
            <label htmlFor="phone" className="block pl-1 text-sm font-medium text-[#6E6E73]">
              เบอร์โทรศัพท์มือถือของคุณ
            </label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#86868B]" />
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="ตัวอย่าง 0812345678"
                maxLength={10}
                className="w-full rounded-2xl border border-[#E8E8ED] bg-[#FBFBFD] py-3.5 pr-5 pl-11 text-base font-mono text-[#1D1D1F] placeholder:text-[#86868B] transition focus:border-[#0071e3] focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[#0071e3]/15"
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
          <div className="space-y-4">
            <label htmlFor="otp" className="block text-center text-sm font-medium text-[#6E6E73]">
              ป้อนรหัส OTP 6 หลัก
            </label>
            <div className="flex justify-center">
              <InputOTP
                id="otp"
                maxLength={6}
                value={otpCode}
                onChange={setOtpCode}
                disabled={isLoading}
                inputMode="numeric"
                autoFocus
                containerClassName="gap-3 sm:gap-4"
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className={otpSlotClassName} />
                  <InputOTPSlot index={1} className={otpSlotClassName} />
                  <InputOTPSlot index={2} className={otpSlotClassName} />
                </InputOTPGroup>
                <InputOTPSeparator className="text-[#C7C7CC]" />
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={3} className={otpSlotClassName} />
                  <InputOTPSlot index={4} className={otpSlotClassName} />
                  <InputOTPSlot index={5} className={otpSlotClassName} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <p className="text-center text-sm text-[#86868B]">
              ส่งรหัสไปยังเบอร์ {formatPhoneDisplay(phoneNumber)} แล้ว · หมดอายุใน 5 นาที
            </p>
          </div>

          {simulatedOtp && (
            <div className="space-y-2 rounded-2xl border border-[#0071e3]/15 bg-[#F5F5F7] p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#6E6E73]">
                <Smartphone className="size-3.5 shrink-0 text-[#0071e3]" />
                <span>จำลองการรับข้อความจากระบบเครือข่าย</span>
              </div>
              <p className="text-sm text-[#1D1D1F]">
                รหัสยืนยันตัวตนของคุณคือ{' '}
                <span className="font-mono text-base font-semibold tracking-widest text-[#0071e3]">
                  {simulatedOtp}
                </span>
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
            className="w-full text-center text-sm font-medium text-[#6E6E73] transition hover:text-[#0071e3] cursor-pointer"
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F5F7] p-4 text-[#1D1D1F]">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0071e3]/5 blur-[80px]"
        aria-hidden
      />

      <Suspense
        fallback={
          <div className="flex w-full max-w-md items-center justify-center rounded-[28px] border border-[#E8E8ED] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_16px_48px_rgba(0,0,0,0.08)] text-[#6E6E73]">
            <RotateCw className="mr-2 size-6 animate-spin text-[#0071e3]" />
            <span className="text-sm font-medium">กำลังโหลดแบบฟอร์ม...</span>
          </div>
        }
      >
        <MobileLoginInner />
      </Suspense>
    </main>
  );
}
