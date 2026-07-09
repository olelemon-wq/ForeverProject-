'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Plus, Trash2, CheckCircle2, AlertCircle, RotateCw, Shield, Key } from 'lucide-react';

interface PhoneRecord {
  id: string;
  phone: string;
  isPrimary: boolean;
}

export default function BackupPhoneSection({ userPhone }: { userPhone: string }) {
  const [phones, setPhones] = useState<PhoneRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState(1); // 1 = input phone, 2 = verify OTP
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPhones = async () => {
    try {
      const res = await fetch('/api/auth/backup-phone/list');
      const data = await res.json();
      if (res.ok) {
        setPhones(data.phones || []);
      }
    } catch (err) {
      console.error('Error loading phones list:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhones();
  }, []);

  const formatPhoneNumber = (ph: string) => {
    if (ph.length !== 10) return ph;
    return `${ph.substring(0, 3)}-${ph.substring(3, 6)}-${ph.substring(6)}`;
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setActionLoading(true);

    try {
      const res = await fetch('/api/auth/backup-phone/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: newPhone }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setStep(2);
      setSimulatedOtp(data.simulatedOtp || '');
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการขอรหัส OTP');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setActionLoading(true);

    try {
      const res = await fetch('/api/auth/backup-phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: newPhone, otpCode }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setSuccess('เพิ่มเบอร์โทรศัพท์สำรองเรียบร้อยแล้ว');
      setNewPhone('');
      setOtpCode('');
      setStep(1);
      setIsAdding(false);
      setSimulatedOtp('');
      await fetchPhones();
    } catch (err: any) {
      setError(err.message || 'รหัส OTP ไม่ถูกต้อง');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePhone = async (phoneId: string) => {
    if (!window.confirm('คุณต้องการลบเบอร์โทรศัพท์สำรองนี้ใช่หรือไม่?')) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/backup-phone/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneId }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setSuccess('ลบเบอร์โทรศัพท์เรียบร้อยแล้ว');
      await fetchPhones();
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการลบเบอร์โทรศัพท์');
    }
  };

  const handleSetPrimary = async (phoneId: string) => {
    if (!window.confirm('คุณต้องการตั้งเบอร์โทรศัพท์นี้เป็นเบอร์หลักใช่หรือไม่? เซสชันปัจจุบันของคุณจะสลับมาใช้เบอร์นี้สำหรับการล็อกอินและตั้งค่า')) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/backup-phone/set-primary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneId }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setSuccess('เปลี่ยนเบอร์โทรศัพท์หลักสำเร็จแล้ว');
      // Reload page to refresh all tokens and cookies
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการตั้งเบอร์โทรศัพท์หลัก');
    }
  };

  if (isLoading) {
    return (
      <div className="py-6 flex items-center justify-center text-stone-500">
        <RotateCw className="w-5 h-5 animate-spin text-blue-600 mr-2" />
        <span className="text-xs">กำลังโหลดข้อมูลความปลอดภัย...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-150 text-[11px] text-red-700 font-medium flex items-center gap-1.5 animate-fade-in text-left">
          <AlertCircle className="w-3.5 h-3.5 text-red-650 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-150 text-[11px] text-emerald-800 font-medium flex items-center gap-1.5 animate-fade-in text-left">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Verified Phones List */}
      <div className="space-y-2">
        {phones.map((p) => (
          <div key={p.id} className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/30 flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <Smartphone className={`w-4 h-4 ${p.isPrimary ? 'text-blue-600' : 'text-stone-400'}`} />
              <div>
                <p className="text-xs font-bold text-stone-900 font-mono">
                  {formatPhoneNumber(p.phone)}
                </p>
                <div className="flex gap-1.5 items-center mt-1">
                  {p.isPrimary ? (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-100 rounded text-[9px] font-black">
                      <Shield className="w-2.5 h-2.5 text-blue-600" />
                      เบอร์หลัก (PRIMARY)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-stone-100 text-stone-500 border border-stone-200 rounded text-[9px] font-bold">
                      เบอร์สำรอง
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            {!p.isPrimary && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleSetPrimary(p.id)}
                  className="px-2 py-1 bg-white border border-stone-250 hover:bg-stone-50 text-stone-700 hover:text-stone-950 rounded-lg text-[10px] font-bold transition active:scale-95 cursor-pointer"
                >
                  ตั้งเป็นเบอร์หลัก
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePhone(p.id)}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-650 rounded-lg border border-red-200 transition active:scale-95 cursor-pointer"
                  title="ลบเบอร์สำรอง"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add backup phone toggle */}
      {!isAdding ? (
        <button
          type="button"
          onClick={() => { setIsAdding(true); setStep(1); }}
          className="w-full py-3 bg-stone-50 border border-dashed border-stone-300 rounded-2xl text-[11px] font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100/60 transition flex items-center justify-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>เพิ่มเบอร์โทรศัพท์สำรองกู้คืน</span>
        </button>
      ) : (
        <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-4 animate-fade-in text-left">
          <div className="flex justify-between items-center pb-2 border-b border-stone-200/50">
            <span className="text-[10px] font-black uppercase text-stone-500">ผูกเบอร์โทรศัพท์สำรอง</span>
            <button
              type="button"
              onClick={() => { setIsAdding(false); setSimulatedOtp(''); }}
              className="text-[10px] text-stone-400 hover:text-stone-850 font-bold border-0 bg-transparent cursor-pointer"
            >
              ยกเลิก
            </button>
          </div>

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-stone-500">เบอร์โทรศัพท์มือถือสำรอง</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="เช่น 0891234567"
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-blue-600"
                  disabled={actionLoading}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={actionLoading || newPhone.length !== 10}
                className="w-full py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition active:scale-95 cursor-pointer flex items-center justify-center gap-1"
              >
                {actionLoading && <RotateCw className="w-3 h-3 animate-spin" />}
                <span>ขอรหัส OTP</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-stone-500 text-center block">
                  ป้อนรหัส OTP 6 หลักที่ส่งไปยัง {formatPhoneNumber(newPhone)}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456"
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-center font-mono tracking-widest text-sm text-stone-900 focus:outline-none focus:border-blue-600"
                  disabled={actionLoading}
                  required
                />
              </div>

              {simulatedOtp && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl space-y-0.5 text-center">
                  <p className="text-[9px] text-blue-900 font-bold">📲 จำลองรหัส OTP สำรอง</p>
                  <p className="text-xs font-mono font-bold text-stone-750">{simulatedOtp}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={actionLoading || otpCode.length !== 6}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition active:scale-95 cursor-pointer flex items-center justify-center gap-1"
              >
                {actionLoading && <RotateCw className="w-3 h-3 animate-spin" />}
                <span>ยืนยันและเชื่อมต่อเบอร์</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
