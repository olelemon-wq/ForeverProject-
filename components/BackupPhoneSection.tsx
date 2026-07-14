'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Plus, Trash2, CheckCircle2, AlertCircle, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
          <div key={p.id} className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50/30 p-3.5 text-left">
            <div className="flex min-w-0 items-center gap-3">
              <Smartphone className={`size-4 shrink-0 ${p.isPrimary ? 'text-blue-600' : 'text-stone-400'}`} />
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <p className="font-mono text-xs font-bold text-stone-900">
                  {formatPhoneNumber(p.phone)}
                </p>
                {p.isPrimary ? (
                  <Badge className="h-auto shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-[12px] font-black text-emerald-800 hover:bg-emerald-50">
                    ● เบอร์หลัก
                  </Badge>
                ) : (
                  <Badge variant="outline" className="h-auto shrink-0 rounded-full border-stone-200 bg-stone-100 px-2.5 py-0.5 text-[9px] font-black text-stone-600 hover:bg-stone-100">
                    ● เบอร์สำรอง
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            {!p.isPrimary && (
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => handleSetPrimary(p.id)}
                  className="cursor-pointer rounded-lg border border-stone-250 bg-white px-2 py-1 text-[10px] font-bold text-stone-700 transition hover:bg-stone-50 hover:text-stone-950 active:scale-95"
                >
                  ตั้งเป็นเบอร์หลัก
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => handleDeletePhone(p.id)}
                  className="cursor-pointer rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-650 transition hover:bg-red-100 active:scale-95"
                  title="ลบเบอร์สำรอง"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            )}
          </div>
        ))}

        {/* Same row shell as phone items so Plus aligns with Smartphone */}
        {!isAdding ? (
          <button
            type="button"
            onClick={() => { setIsAdding(true); setStep(1); }}
            className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-3.5 text-left text-xs font-bold text-stone-600 transition hover:bg-stone-100/60 hover:text-stone-900"
          >
            <Plus className="size-4 shrink-0" strokeWidth={2} />
            <span>เพิ่มเบอร์โทรศัพท์สำรองกู้คืน</span>
          </button>
        ) : null}
      </div>

      {isAdding && (
        <div className="animate-fade-in space-y-4 rounded-2xl border border-stone-200 bg-stone-50/60 p-4 text-left">
          <div className="flex items-center justify-between border-b border-stone-200/50 pb-2">
            <span className="text-[10px] font-black uppercase text-stone-500">ผูกเบอร์โทรศัพท์สำรอง</span>
            <Button
              variant="ghost"
              type="button"
              onClick={() => { setIsAdding(false); setSimulatedOtp(''); }}
              className="cursor-pointer border-0 bg-transparent text-[10px] font-bold text-stone-400 hover:text-stone-850"
            >
              ยกเลิก
            </Button>
          </div>

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-stone-500">เบอร์โทรศัพท์มือถือสำรอง</label>
                <Input
                  type="tel"
                  maxLength={10}
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="เช่น 0891234567"
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-stone-900 focus:border-blue-600 focus:outline-none"
                  disabled={actionLoading}
                  required
                />
              </div>
              <Button
                variant="ghost"
                type="submit"
                disabled={actionLoading || newPhone.length !== 10}
                className="flex h-auto w-full cursor-pointer items-center justify-center gap-1 rounded-xl bg-stone-900 py-2 text-xs font-bold text-white transition hover:bg-stone-800 active:scale-95 disabled:opacity-50"
              >
                {actionLoading && <RotateCw className="size-3 animate-spin" />}
                <span>ขอรหัส OTP</span>
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-center text-[9px] font-bold text-stone-500">
                  ป้อนรหัส OTP 6 หลักที่ส่งไปยัง {formatPhoneNumber(newPhone)}
                </label>
                <Input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456"
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-center font-mono text-sm tracking-widest text-stone-900 focus:border-blue-600 focus:outline-none"
                  disabled={actionLoading}
                  required
                />
              </div>

              {simulatedOtp && (
                <div className="space-y-0.5 rounded-xl border border-blue-100 bg-blue-50 p-3 text-center">
                  <p className="text-[9px] font-bold text-blue-900">จำลองรหัส OTP สำรอง</p>
                  <p className="font-mono text-xs font-bold text-stone-750">{simulatedOtp}</p>
                </div>
              )}

              <Button
                variant="ghost"
                type="submit"
                disabled={actionLoading || otpCode.length !== 6}
                className="flex h-auto w-full cursor-pointer items-center justify-center gap-1 rounded-xl bg-blue-600 py-2 text-xs font-bold text-white transition hover:bg-blue-700 active:scale-95 disabled:opacity-50"
              >
                {actionLoading && <RotateCw className="size-3 animate-spin" />}
                <span>ยืนยันและเชื่อมต่อเบอร์</span>
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
