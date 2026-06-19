'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  const [category, setCategory] = useState('Memorial');
  
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <p className="text-sm font-semibold tracking-wider animate-pulse">กำลังดาวน์โหลดระบบรักษาความปลอดภัย...</p>
      </div>
    );
  }

  // RENDER LOGIN SCREEN (IF USER NOT AUTHENTICATED)
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl border border-slate-900 bg-slate-900/40 backdrop-blur-md shadow-2xl space-y-8">
          <header className="text-center space-y-2">
            <span className="text-[10px] uppercase font-black text-emerald-400 tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">
              WIZARD SIGN-IN
            </span>
            <h1 className="text-xl font-black text-white pt-2">ยืนยันตัวตนก่อนสร้างเว็บไซต์</h1>
            <p className="text-slate-400 text-xs">กรุณากรอกเบอร์มือถือของคุณเพื่อเข้าสู่กระบวนการสร้างเว็บไซต์แบบรวดเร็ว</p>
          </header>

          {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center font-medium">⚠️ {error}</div>}

          {loginStep === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <input 
                type="tel" 
                value={loginPhone} 
                onChange={(e) => setLoginPhone(e.target.value)} 
                placeholder="ป้อนเบอร์โทรศัพท์ 10 หลัก (เช่น 0812345678)"
                className="w-full px-5 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-white text-sm"
              />
              <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-sm">
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
                className="w-full px-5 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-white text-center tracking-[0.4em] text-lg"
              />
              {simulatedOtp && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-xs text-white">
                  รหัสทดสอบ: <span className="font-bold underline">{simulatedOtp}</span>
                </div>
              )}
              <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-sm">
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
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 flex flex-col items-center">
      {/* Steps indicator */}
      <div className="w-full max-w-2xl flex items-center justify-between text-xs text-slate-400 mb-12">
        <div className={`flex flex-col items-center gap-2 ${wizardStep >= 1 ? 'text-emerald-400 font-bold' : ''}`}>
          <span className="w-8 h-8 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center">1</span>
          <span>ชื่อลิงก์ URL</span>
        </div>
        <div className="flex-1 h-px bg-slate-800 mx-2" />
        <div className={`flex flex-col items-center gap-2 ${wizardStep >= 2 ? 'text-emerald-400 font-bold' : ''}`}>
          <span className="w-8 h-8 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center">2</span>
          <span>กรอกข้อมูล</span>
        </div>
        <div className="flex-1 h-px bg-slate-800 mx-2" />
        <div className={`flex flex-col items-center gap-2 ${wizardStep >= 3 ? 'text-emerald-400 font-bold' : ''}`}>
          <span className="w-8 h-8 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center">3</span>
          <span>เลือกธีม</span>
        </div>
        <div className="flex-1 h-px bg-slate-800 mx-2" />
        <div className={`flex flex-col items-center gap-2 ${wizardStep >= 4 ? 'text-emerald-400 font-bold' : ''}`}>
          <span className="w-8 h-8 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center">4</span>
          <span>ชำระเงิน</span>
        </div>
      </div>

      <div className="w-full max-w-2xl p-8 rounded-3xl border border-slate-900 bg-slate-900/30 backdrop-blur-sm shadow-xl space-y-6">
        {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">⚠️ {error}</div>}

        {/* STEP 1: URL SETUP */}
        {wizardStep === 1 && (
          <div className="space-y-6">
            <header className="space-y-1">
              <h2 className="text-xl font-bold text-white">ตั้งชื่อลิงก์สำหรับเว็บไซต์ความทรงจำ</h2>
              <p className="text-xs text-slate-400">ใช้เป็น URL Path เพื่อให้คนทั่วไปสามารถพิมพ์เพื่อเข้าชมได้ทันที</p>
            </header>

            <div className="space-y-4">
              <div className="flex bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden focus-within:border-emerald-500 transition">
                <span className="bg-slate-900 px-4 py-3.5 text-sm text-slate-500 font-mono flex items-center">
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
                  className="flex-1 px-4 py-3.5 bg-slate-950 text-white font-mono text-sm focus:outline-none"
                />
              </div>

              <button 
                onClick={checkSlug}
                disabled={slugChecking}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition"
              >
                {slugChecking ? 'กำลังตรวจสอบ...' : 'ตรวจสอบสิทธิ์ว่าง'}
              </button>

              {slugValid === true && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-medium flex items-center gap-2">
                  ✓ ชื่อลิงก์ "forever.co.th/{slug}" พร้อมใช้งาน
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={handleNextToInfo}
                className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                ถัดไป: กรอกข้อมูลเว็บ
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: INFO SETUP */}
        {wizardStep === 2 && (
          <div className="space-y-6">
            <header className="space-y-1">
              <h2 className="text-xl font-bold text-white">รายละเอียดเว็บไซต์ความทรงจำ</h2>
              <p className="text-xs text-slate-400">กรอกรายละเอียดเพื่อสร้างโครงสร้างหน้ารำลึกเริ่มต้น</p>
            </header>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ชื่อเว็บไซต์ (เช่น รำลึกรักแด่คุณพ่อสมศักดิ์)</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="เช่น ความทรงจำแด่คุณยายมาลี"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ชื่อ-นามสกุล ผู้ล่วงลับ</label>
                <input 
                  type="text" 
                  value={deceasedName} 
                  onChange={(e) => setDeceasedName(e.target.value)} 
                  placeholder="เช่น คุณยาย มาลี อบอุ่นยิ่ง"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ช่วงชีวิตวันเกิด – วันเสียชีวิต (Lifespan)</label>
                <input 
                  type="text" 
                  value={lifespan} 
                  onChange={(e) => setLifespan(e.target.value)} 
                  placeholder="เช่น 1 มกราคม 2490 – 15 มิถุนายน 2569"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">หมวดหมู่กลุ่มเป้าหมาย (Category Selection)</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-sm"
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

            <div className="flex justify-between pt-4">
              <button onClick={() => setWizardStep(1)} className="px-6 py-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs">ย้อนกลับ</button>
              <button onClick={handleNextToTheme} className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs">ถัดไป: เลือกธีมการจัดแสดง</button>
            </div>
          </div>
        )}

        {/* STEP 3: THEME SETUP */}
        {wizardStep === 3 && (
          <div className="space-y-6">
            <header className="space-y-1">
              <h2 className="text-xl font-bold text-white">เลือกธีมความทรงจำ V1 (10 ตัวเลือก)</h2>
              <p className="text-xs text-slate-400">เลือกแนวโทนสีและอารมณ์ของหน้าเว็บความทรงจำของคุณ</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
              {themes.map(t => (
                <div 
                  key={t.name}
                  onClick={() => setSelectedTheme(t.name)}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between gap-4 transition ${
                    selectedTheme === t.name ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-850 hover:border-slate-700 bg-slate-900/10'
                  }`}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-[10px] text-slate-500 leading-normal">{t.desc}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full shadow-inner flex-shrink-0" style={{ backgroundColor: t.color }} />
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setWizardStep(2)} className="px-6 py-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs">ย้อนกลับ</button>
              <button onClick={handleNextToPayment} disabled={isLoading} className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs">
                {isLoading ? 'กำลังสร้างร่างเว็บไซต์...' : 'ถัดไป: ขั้นตอนชำระเงิน'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT (PROMPTPAY QR) */}
        {wizardStep === 4 && (
          <div className="space-y-8 text-center">
            <header className="space-y-1">
              <h2 className="text-xl font-bold text-white">ชำระเงินเพื่อเปิดบริการอัตโนมัติ</h2>
              <p className="text-xs text-slate-400">สแกนจ่ายเงิน 2,000 บาท (ค่าบริการรายปีแรกเริ่มต้น + พื้นที่ 1 GB)</p>
            </header>

            <div className="max-w-xs mx-auto p-6 rounded-2xl bg-white text-slate-900 shadow-lg space-y-4">
              <div className="text-center font-bold text-sm tracking-wide border-b pb-3">PROMPTPAY QR</div>
              {/* Simulated QR Code Area */}
              <div className="w-48 h-48 bg-slate-200 border-4 border-slate-100 rounded-lg mx-auto flex flex-col items-center justify-center gap-2 p-2">
                <span className="text-3xl">📱</span>
                <span className="text-[10px] font-black text-slate-800">MOCK DYNAMIC QR</span>
                <span className="text-[9px] font-mono text-slate-500 break-all px-2">{paymentRef}</span>
              </div>
              <div className="text-center font-black text-lg border-t pt-3">2,000.00 THB</div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 max-w-sm mx-auto leading-normal">
              📲 สแกน QR Code แล้วระบบจะเปิดใช้งานให้คุณโดยอัตโนมัติเมื่อได้รับการกดยืนยัน Webhook callback จากธนาคาร
            </div>

            <div className="pt-4 border-t border-slate-850 max-w-xs mx-auto space-y-3">
              <button 
                onClick={handleSimulatePaymentSuccess}
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:brightness-110 transition shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                {isLoading ? 'กำลังตรวจเช็กยอดเงิน...' : 'จำลองการชำระเงินสำเร็จ (Callback Simulator)'}
              </button>
              <button 
                onClick={() => setWizardStep(3)}
                className="w-full py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
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
