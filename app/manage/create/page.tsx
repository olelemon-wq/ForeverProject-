'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ChevronLeft, ChevronRight, AlertCircle, Smartphone, Info, Check } from 'lucide-react';

const MONTHS_THAI = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

function CalendarPicker({
  selectedDate,
  onChange,
  placeholder,
}: {
  selectedDate: Date | null;
  onChange: (date: Date) => void;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleMonthChange = (newMonth: number) => {
    setCurrentDate(new Date(year, newMonth, 1));
  };

  const handleYearChange = (newYear: number) => {
    setCurrentDate(new Date(newYear, month, 1));
  };

  const currentCEYear = new Date().getFullYear();
  const years = Array.from({ length: 150 }, (_, i) => currentCEYear + 10 - i);

  const formatThaiDateShort = (date: Date) => {
    const day = date.getDate();
    const monthName = MONTHS_THAI[date.getMonth()];
    const yearThai = date.getFullYear() + 543;
    return `${day} ${monthName} ${yearThai}`;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-left text-xs sm:text-sm flex justify-between items-center cursor-pointer hover:bg-stone-100/50 transition focus:outline-none"
      >
        <span className={selectedDate ? 'text-stone-900 font-medium' : 'text-stone-400'}>
          {selectedDate ? formatThaiDateShort(selectedDate) : placeholder}
        </span>
        <Calendar className="w-4 h-4 text-stone-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 bottom-full mb-2 z-50 bg-white border border-stone-250 rounded-2xl shadow-xl p-4 w-[310px] sm:w-[350px] animate-fade-in text-left">
            <div className="flex justify-between items-center mb-4 gap-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2.5 rounded-xl hover:bg-stone-100 text-stone-600 transition cursor-pointer flex items-center justify-center border border-stone-200"
              >
                <ChevronLeft className="w-4 h-4 text-stone-500" />
              </button>
              
              <div className="flex gap-2">
                <select
                  value={month}
                  onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm sm:text-base font-bold text-stone-900 focus:outline-none cursor-pointer hover:bg-stone-100/50 transition"
                >
                  {MONTHS_THAI.map((mName, idx) => (
                    <option key={idx} value={idx}>{mName}</option>
                  ))}
                </select>

                <select
                  value={year}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm sm:text-base font-bold text-stone-900 focus:outline-none cursor-pointer hover:bg-stone-100/50 transition"
                >
                  {years.map((yVal) => (
                    <option key={yVal} value={yVal}>
                      พ.ศ. {yVal + 543}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2.5 rounded-xl hover:bg-stone-100 text-stone-600 transition cursor-pointer flex items-center justify-center border border-stone-200"
              >
                <ChevronRight className="w-4 h-4 text-stone-500" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-stone-500 mb-2 border-b border-stone-100 pb-1">
              <span>อา</span>
              <span>จ</span>
              <span>อ</span>
              <span>พ</span>
              <span>พฤ</span>
              <span>ศ</span>
              <span>ส</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const thisDate = new Date(year, month, dayNum);
                const isSelected = selectedDate && 
                  selectedDate.getDate() === dayNum && 
                  selectedDate.getMonth() === month && 
                  selectedDate.getFullYear() === year;

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => {
                      onChange(thisDate);
                      setIsOpen(false);
                    }}
                    className={`p-2 rounded-lg text-center cursor-pointer transition ${
                      isSelected 
                        ? 'bg-emerald-600 text-white font-bold' 
                        : 'hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function WebsiteCreationWizard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userPhone, setUserPhone] = useState('');
  
  // Login states (if not authenticated)
  const [loginPhone, setLoginPhone] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [loginStep, setLoginStep] = useState(1);
  const [simulatedOtp, setSimulatedOtp] = useState('');

  // Wizard state: 1 = URL, 2 = Info, 3 = Theme, 4 = Payment
  const [wizardStep, setWizardStep] = useState(1);
  
  // Form states
  const [slug, setSlug] = useState('');
  const [slugValid, setSlugValid] = useState<boolean | null>(null);
  const [slugChecking, setSlugChecking] = useState(false);
  
  const [name, setName] = useState('');
  const [deceasedName, setDeceasedName] = useState('');
  const [lifespan, setLifespan] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [deathDate, setDeathDate] = useState<Date | null>(null);
  const [category, setCategory] = useState('Memorial');

  // Synchronize birthDate and deathDate to lifespan string
  useEffect(() => {
    const formatThaiDate = (date: Date) => {
      const day = date.getDate();
      const monthName = MONTHS_THAI[date.getMonth()];
      const yearThai = date.getFullYear() + 543;
      return `${day} ${monthName} ${yearThai}`;
    };

    if (birthDate && deathDate) {
      setLifespan(`${formatThaiDate(birthDate)} – ${formatThaiDate(deathDate)}`);
    } else if (birthDate) {
      setLifespan(`${formatThaiDate(birthDate)} – (ยังไม่ระบุ)`);
    } else {
      setLifespan('');
    }
  }, [birthDate, deathDate]);
  
  const [selectedTheme, setSelectedTheme] = useState('Classic');
  const [primaryColor, setPrimaryColor] = useState('#0d9488');
  
  // Loading & error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Payment states
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(2000);

  // Check auth session on load
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          setUserPhone(data.phone);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  // Real-time Slug validation trigger
  const checkSlug = async () => {
    if (slug.length < 3) {
      setError('ชื่อลิงก์ URL ต้องไม่ต่ำกว่า 3 ตัวอักษร');
      setSlugValid(false);
      return;
    }
    setSlugChecking(true);
    setError('');
    try {
      const res = await fetch('/api/tenant/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      setSlugValid(true);
    } catch (err: any) {
      setError(err.message);
      setSlugValid(false);
    } finally {
      setSlugChecking(false);
    }
  };

  // Inline login flow
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: loginPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLoginStep(2);
      setSimulatedOtp(data.simulatedOtp || '');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: loginPhone, otpCode: loginOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIsAuthenticated(true);
      setUserPhone(data.webmaster.phone);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Wizard transitions
  const handleNextToInfo = () => {
    if (!slugValid) {
      setError('กรุณาเลือกและตรวจสอบชื่อลิงก์ URL ให้ผ่านก่อน');
      return;
    }
    setError('');
    setWizardStep(2);
  };

  const handleNextToTheme = () => {
    if (!name || !deceasedName) {
      setError('กรุณากรอกชื่อเว็บไซต์และชื่อผู้ล่วงลับ');
      return;
    }
    setError('');
    setWizardStep(3);
  };

  const handleNextToPayment = async () => {
    setError('');
    setIsLoading(true);
    try {
      // Call create endpoint to save the tenant in pending payment state
      const themeColors: Record<string, string> = {
        Classic: '#0d9488',
        Warm: '#b45309',
        Peaceful: '#0369a1',
        Dark: '#1e293b',
        Gold: '#b45309',
        Rose: '#be185d',
        Sky: '#0284c7',
        Forest: '#15803d',
        Royal: '#6d28d9',
        Lavender: '#701a75',
      };
      
      const res = await fetch('/api/tenant/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          name,
          category,
          deceasedName,
          themeConfig: {
            primaryColor: themeColors[selectedTheme] || primaryColor,
            secondaryColor: '#f59e0b',
            fontFamily: 'Inter',
            heroStyle: 'Classic',
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPaymentRef(data.payment.refId);
      setPaymentAmount(data.payment.amount);
      setWizardStep(4);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate payment callback verification (matches F004 webhook workflow)
  const handleSimulatePaymentSuccess = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Simulate bank callback hitting /api/payment/callback
      const res = await fetch('/api/payment/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refId: paymentRef,
          status: 'SUCCESS',
          amount: paymentAmount,
          signature: 'MOCK_SIGNATURE_OK_2026', // signature matched mock
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Payment verified -> redirect to website manager dashboard
      router.push('/manage');
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการตรวจสอบยอดเงิน');
      setIsLoading(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-600">
        <p className="text-sm font-semibold tracking-wider animate-pulse">กำลังดาวน์โหลดระบบรักษาความปลอดภัย...</p>
      </div>
    );
  }

  // RENDER LOGIN SCREEN (IF USER NOT AUTHENTICATED)
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-stone-50 text-stone-850 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl border border-stone-200 bg-white shadow-xl space-y-8 animate-fade-in">
          <header className="text-center space-y-2">
            <span className="text-[10px] uppercase font-black text-emerald-800 tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              WIZARD SIGN-IN
            </span>
            <h1 className="text-xl font-black text-stone-900 pt-2">ยืนยันตัวตนก่อนสร้างเว็บไซต์</h1>
            <p className="text-stone-500 text-xs">กรุณากรอกเบอร์มือถือของคุณเพื่อเข้าสู่กระบวนการสร้างเว็บไซต์แบบรวดเร็ว</p>
          </header>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loginStep === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <input 
                type="tel" 
                value={loginPhone} 
                onChange={(e) => setLoginPhone(e.target.value)} 
                placeholder="ป้อนเบอร์โทรศัพท์ 10 หลัก (เช่น 0812345678)"
                className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 text-sm focus:bg-white focus:outline-none"
              />
              <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition active:scale-95 shadow-sm">
                {isLoading ? 'กำลังประมวลผล...' : 'ขอรหัส OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <input 
                type="text" 
                maxLength={6} 
                value={loginOtp} 
                onChange={(e) => setLoginOtp(e.target.value)} 
                placeholder="ใส่รหัส OTP 6 หลัก"
                className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 text-center tracking-[0.4em] text-lg focus:bg-white focus:outline-none"
              />
              {simulatedOtp && (
                <div className="p-3 bg-emerald-50 border border-emerald-250 rounded-xl text-center text-xs text-emerald-800 font-semibold">
                  รหัสทดสอบ: <span className="font-bold underline">{simulatedOtp}</span>
                </div>
              )}
              <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition active:scale-95 shadow-sm">
                {isLoading ? 'กำลังตรวจสอบ...' : 'ยืนยันรหัส OTP'}
              </button>
            </form>
          )}
        </div>
      </main>
    );
  }

  // RENDER WIZARD FLOW (IF AUTHENTICATED)
  const themes = [
    { name: 'Classic', color: '#0d9488', desc: 'สุขุม เรียบง่าย สมเกียรติ' },
    { name: 'Warm', color: '#b45309', desc: 'อบอุ่น อบอวลด้วยความคิดถึง' },
    { name: 'Peaceful', color: '#0369a1', desc: 'เงียบสงบ สันติ รำลึก' },
    { name: 'Dark', color: '#1e293b', desc: 'สง่างาม มั่นคง ล้ำลึก' },
    { name: 'Gold', color: '#b45309', desc: 'หรูหรา เลอค่า มีเกียรติประวัติ' },
    { name: 'Rose', color: '#be185d', desc: 'อ่อนหวาน รำลึกถึงเรื่องรักงาม' },
    { name: 'Sky', color: '#0284c7', desc: 'สดใส ท้องฟ้า การเดินทางครั้งใหม่' },
    { name: 'Forest', color: '#15803d', desc: 'สงบเย็น ร่มรื่น ธรรมชาติ' },
    { name: 'Royal', color: '#6d28d9', desc: 'ทรงคุณค่า ภูมิฐาน โดดเด่น' },
    { name: 'Lavender', color: '#701a75', desc: 'ผ่อนคลาย อ่อนโยน ปลอบประโลมใจ' },
  ];

  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 py-12 px-4 flex flex-col items-center">
      {/* Steps indicator */}
      <div className="w-full max-w-2xl flex items-center justify-between text-xs text-stone-400 mb-12 select-none">
        <div className={`flex flex-col items-center gap-2 ${wizardStep >= 1 ? 'text-emerald-700 font-bold' : ''}`}>
          <span className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${wizardStep >= 1 ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold' : 'border-stone-200 bg-white text-stone-400'}`}>1</span>
          <span>ชื่อลิงก์ URL</span>
        </div>
        <div className={`flex-1 h-px mx-2 transition ${wizardStep >= 2 ? 'bg-emerald-600/60' : 'bg-stone-200'}`} />
        <div className={`flex flex-col items-center gap-2 ${wizardStep >= 2 ? 'text-emerald-700 font-bold' : ''}`}>
          <span className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${wizardStep >= 2 ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold' : 'border-stone-200 bg-white text-stone-400'}`}>2</span>
          <span>กรอกข้อมูล</span>
        </div>
        <div className={`flex-1 h-px mx-2 transition ${wizardStep >= 3 ? 'bg-emerald-600/60' : 'bg-stone-200'}`} />
        <div className={`flex flex-col items-center gap-2 ${wizardStep >= 3 ? 'text-emerald-700 font-bold' : ''}`}>
          <span className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${wizardStep >= 3 ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold' : 'border-stone-200 bg-white text-stone-400'}`}>3</span>
          <span>เลือกธีม</span>
        </div>
        <div className={`flex-1 h-px mx-2 transition ${wizardStep >= 4 ? 'bg-emerald-600/60' : 'bg-stone-200'}`} />
        <div className={`flex flex-col items-center gap-2 ${wizardStep >= 4 ? 'text-emerald-700 font-bold' : ''}`}>
          <span className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${wizardStep >= 4 ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold' : 'border-stone-200 bg-white text-stone-400'}`}>4</span>
          <span>ชำระเงิน</span>
        </div>
      </div>

      <div className="w-full max-w-2xl p-8 rounded-3xl border border-stone-200 bg-white shadow-xl space-y-6 overflow-visible">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: URL SETUP */}
        {wizardStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <header className="space-y-1">
              <h2 className="text-xl font-black text-stone-900">ตั้งชื่อลิงก์สำหรับเว็บไซต์ความทรงจำ</h2>
              <p className="text-xs text-stone-500">ใช้เป็น URL Path เพื่อให้คนทั่วไปสามารถพิมพ์เพื่อเข้าชมได้ทันที</p>
            </header>

            <div className="space-y-4">
              <div className="flex bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden focus-within:border-emerald-600 transition">
                <span className="bg-stone-100/80 px-4 py-3.5 text-sm text-stone-500 font-mono flex items-center border-r border-stone-200 select-none">
                  forever.co.th/
                </span>
                <input 
                  type="text" 
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''));
                    setSlugValid(null);
                  }}
                  placeholder="somsak-family"
                  className="flex-1 px-4 py-3.5 bg-stone-50 text-stone-900 font-mono text-sm focus:outline-none focus:bg-white"
                />
              </div>

              <button 
                onClick={checkSlug}
                disabled={slugChecking}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition border border-stone-250 shadow-sm active:scale-95"
              >
                {slugChecking ? 'กำลังตรวจสอบ...' : 'ตรวจสอบสิทธิ์ว่าง'}
              </button>

              {slugValid === true && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>ชื่อลิงก์ "forever.co.th/{slug}" พร้อมใช้งาน</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-stone-100">
              <button 
                onClick={handleNextToInfo}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition active:scale-95 shadow-sm"
              >
                ถัดไป: กรอกข้อมูลเว็บ
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: INFO SETUP */}
        {wizardStep === 2 && (
          <div className="space-y-6 animate-fade-in overflow-visible">
            <header className="space-y-1">
              <h2 className="text-xl font-black text-stone-900">รายละเอียดเว็บไซต์ความทรงจำ</h2>
              <p className="text-xs text-stone-500">กรอกรายละเอียดเพื่อสร้างโครงสร้างหน้ารำลึกเริ่มต้น</p>
            </header>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-550 uppercase tracking-wide">ชื่อเว็บไซต์ (เช่น รำลึกรักแด่คุณพ่อสมศักดิ์)</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="เช่น ความทรงจำแด่คุณยายมาลี"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs sm:text-sm focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-550 uppercase tracking-wide">ชื่อ-นามสกุล ผู้ล่วงลับ</label>
                <input 
                  type="text" 
                  value={deceasedName} 
                  onChange={(e) => setDeceasedName(e.target.value)} 
                  placeholder="เช่น คุณยาย มาลี อบอุ่นยิ่ง"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs sm:text-sm focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-550 uppercase tracking-wide">ช่วงชีวิตวันเกิด – วันเสียชีวิต (Lifespan)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-stone-500 font-semibold block">วันเกิด</span>
                    <CalendarPicker
                      selectedDate={birthDate}
                      onChange={setBirthDate}
                      placeholder="เลือกวันเกิด"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-stone-500 font-semibold block">วันเสียชีวิต</span>
                    <CalendarPicker
                      selectedDate={deathDate}
                      onChange={setDeathDate}
                      placeholder="เลือกวันเสียชีวิต"
                    />
                  </div>
                </div>
                {lifespan && (
                  <p className="text-[10px] text-emerald-800 font-semibold mt-2.5 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-1.5 inline-block">
                    ช่วงชีวิต: {lifespan}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-550 uppercase tracking-wide">หมวดหมู่กลุ่มเป้าหมาย (Category Selection)</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-750 text-xs sm:text-sm focus:bg-white focus:outline-none"
                >
                  <option value="Memorial">Memorial (รำลึกบุคคลทั่วไป)</option>
                  <option value="Family Legacy">Family Legacy (มรดกวงศ์ตระกูล)</option>
                  <option value="Couple">Couple (ความรักคู่รัก)</option>
                  <option value="Wedding">Wedding (ความทรงจำแต่งงาน)</option>
                  <option value="Friends">Friends (กลุ่มเพื่อนรัก)</option>
                  <option value="Pet Memorial">Pet Memorial (สัตว์เลี้ยงแสนรัก)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-stone-100">
              <button onClick={() => setWizardStep(1)} className="px-6 py-3 rounded-xl border border-stone-300 text-stone-550 hover:bg-stone-50 text-xs transition font-semibold">ย้อนกลับ</button>
              <button onClick={handleNextToTheme} className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition active:scale-95 shadow-sm">ถัดไป: เลือกธีมการจัดแสดง</button>
            </div>
          </div>
        )}

        {/* STEP 3: THEME SETUP */}
        {wizardStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <header className="space-y-1">
              <h2 className="text-xl font-black text-stone-900">เลือกธีมความทรงจำ V1 (10 ตัวเลือก)</h2>
              <p className="text-xs text-stone-500">เลือกแนวโทนสีและอารมณ์ของหน้าเว็บความทรงจำของคุณ</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
              {themes.map(t => (
                <div 
                  key={t.name}
                  onClick={() => setSelectedTheme(t.name)}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between gap-4 transition ${
                    selectedTheme === t.name ? 'border-emerald-600 bg-emerald-50/40 shadow-sm' : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                  }`}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-stone-900">{t.name}</p>
                    <p className="text-[10px] text-stone-500 leading-normal">{t.desc}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full shadow-inner flex-shrink-0" style={{ backgroundColor: t.color }} />
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-stone-100">
              <button onClick={() => setWizardStep(2)} className="px-6 py-3 rounded-xl border border-stone-300 text-stone-550 hover:bg-stone-50 text-xs transition font-semibold">ย้อนกลับ</button>
              <button onClick={handleNextToPayment} disabled={isLoading} className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition active:scale-95 shadow-sm">
                {isLoading ? 'กำลังสร้างร่างเว็บไซต์...' : 'ถัดไป: ขั้นตอนชำระเงิน'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT (PROMPTPAY QR) */}
        {wizardStep === 4 && (
          <div className="space-y-8 text-center animate-fade-in">
            <header className="space-y-1">
              <h2 className="text-xl font-black text-stone-900">ชำระเงินเพื่อเปิดบริการอัตโนมัติ</h2>
              <p className="text-xs text-stone-500">สแกนจ่ายเงิน 2,000 บาท (ค่าบริการรายปีแรกเริ่มต้น + พื้นที่ 1 GB)</p>
            </header>

            <div className="max-w-xs mx-auto p-6 rounded-2xl bg-white text-stone-900 border border-stone-200 shadow-md space-y-4">
              <div className="text-center font-bold text-sm tracking-wide border-b border-stone-100 pb-3">PROMPTPAY QR</div>
              {/* Simulated QR Code Area */}
              <div className="w-48 h-48 bg-stone-50 border border-stone-150 rounded-lg mx-auto flex flex-col items-center justify-center gap-2 p-2 shadow-inner">
                <Smartphone className="w-8 h-8 text-stone-600" />
                <span className="text-[10px] font-black text-stone-850">MOCK DYNAMIC QR</span>
                <span className="text-[9px] font-mono text-stone-500 break-all px-2 select-all">{paymentRef}</span>
              </div>
              <div className="text-center font-black text-lg border-t border-stone-100 pt-3 text-emerald-800">2,000.00 THB</div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 max-w-sm mx-auto leading-normal font-semibold flex items-start gap-2.5 text-left">
              <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>สแกน QR Code แล้วระบบจะเปิดใช้งานให้คุณโดยอัตโนมัติเมื่อได้รับการกดยืนยัน Webhook callback จากธนาคาร</span>
            </div>

            <div className="pt-4 border-t border-stone-100 max-w-xs mx-auto space-y-3">
              <button 
                onClick={handleSimulatePaymentSuccess}
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md active:scale-95"
              >
                {isLoading ? 'กำลังตรวจเช็กยอดเงิน...' : 'จำลองการชำระเงินสำเร็จ (Callback Simulator)'}
              </button>
              <button 
                onClick={() => setWizardStep(3)}
                className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-550 hover:bg-stone-50 text-xs font-semibold transition"
              >
                ย้อนกลับไปแก้ไข
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
