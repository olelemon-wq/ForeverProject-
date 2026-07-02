'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MobileLogin() {
  const router = useRouter();
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
        body: JSON.stringify({ phoneNumber, otpCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'รหัส OTP ไม่ถูกต้อง');
      }

      // Successful verification -> Go to Webmaster Manage space
      router.push('/manage');
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการยืนยันตัวตน');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Centered Mobile Login Card wrapper */}
      <div className="w-full max-w-md p-8 rounded-3xl border border-stone-200/80 bg-white shadow-xl relative z-10 space-y-8 animate-fade-in">
        <header className="text-center space-y-2">
          <span className="text-[10px] uppercase font-black text-emerald-800 tracking-widest bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-100 inline-block">
            FOREVER LOGIN
          </span>
          <h1 className="text-2xl font-black text-stone-900 pt-2">
            เข้าสู่ระบบด้วยเบอร์มือถือ
          </h1>
          <p className="text-stone-500 text-xs leading-relaxed max-w-xs mx-auto">
            เพื่อความปลอดภัยสูงสุดและง่ายดายสำหรับผู้สูงอายุ ระบบจะส่งรหัสความปลอดภัยเข้าเบอร์มือถือของคุณโดยไม่ต้องใช้รหัสผ่าน
          </p>
        </header>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 text-center font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* STEP 1: Phone number input form */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block pl-1">
                เบอร์โทรศัพท์มือถือ
              </label>
              <input 
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="ตัวอย่าง 0812345678"
                maxLength={10}
                className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 font-mono placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition text-base"
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-sm active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? 'กำลังส่งคำขอ...' : 'รับรหัส OTP ผ่าน SMS'}
            </button>
          </form>
        )}

        {/* STEP 2: OTP verification input form */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block pl-1 text-center">
                ป้อนรหัส OTP 6 หลัก
              </label>
              <input 
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123456"
                className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 font-mono text-center tracking-[0.7em] text-xl placeholder-stone-300 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                disabled={isLoading}
              />
              <p className="text-[10px] text-stone-400 text-center">
                * ระบบส่งรหัสไปยังเบอร์ {phoneNumber} แล้ว
              </p>
            </div>

            {/* Simulated OTP Banner */}
            {simulatedOtp && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center space-y-1">
                <p className="text-[10px] text-emerald-800 font-bold">📲 (จำลองการรับข้อความจากโครงข่าย)</p>
                <p className="text-xs text-stone-700 font-mono">
                  รหัสความทรงจำของคุณคือ: <span className="font-bold underline text-sm tracking-wide text-emerald-800">{simulatedOtp}</span>
                </p>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-sm active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? 'กำลังประมวลผล...' : 'ยืนยันรหัส OTP'}
            </button>

            <button 
              type="button"
              onClick={() => { setStep(1); setOtpCode(''); }}
              className="w-full text-center text-xs text-stone-500 hover:text-stone-850 transition font-medium cursor-pointer"
            >
              แก้ไขเบอร์โทรศัพท์
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
