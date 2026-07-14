'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Smartphone, Info, Check, Flame, GitBranch, Heart, Sparkles, Users, PawPrint, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import ThaiDatePicker from '@/components/ThaiDatePicker';

const MONTHS_THAI = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

interface Subject {
  name: string;
  birthDate: Date | null;
  deathDate: Date | null;
  birthYearOnly: boolean;
  deathYearOnly: boolean;
  birthYear: number | null;
  deathYear: number | null;
  isAlive?: boolean;
}

function dateToYmd(d: Date | null): string {
  if (!d || isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function ymdToDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(`${s}T00:00:00`);
  return isNaN(d.getTime()) ? null : d;
}

const CATEGORY_INPUT_DEFAULTS: Record<string, {
  nameLabel: string;
  namePlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  dateLabel: string;
  dateStartTitle: string;
  dateStartPlaceholder: string;
  dateEndTitle: string;
  dateEndPlaceholder: string;
  lifespanPrefix: string;
}> = {
  'Memorial': {
    nameLabel: 'ชื่อเว็บไซต์ (เช่น รำลึกรักแด่คุณพ่อสมศักดิ์)',
    namePlaceholder: 'เช่น ความทรงจำแด่คุณยายมาลี',
    subjectLabel: 'ชื่อ-นามสกุล ผู้ล่วงลับ',
    subjectPlaceholder: 'เช่น คุณยาย มาลี อบอุ่นยิ่ง',
    dateLabel: 'ช่วงชีวิตวันเกิด – วันเสียชีวิต (Lifespan)',
    dateStartTitle: 'วันเกิด',
    dateStartPlaceholder: 'เลือกวันเกิด',
    dateEndTitle: 'วันเสียชีวิต',
    dateEndPlaceholder: 'เลือกวันเสียชีวิต',
    lifespanPrefix: 'ช่วงชีวิต',
  },
  'Family Legacy': {
    nameLabel: 'ชื่อเว็บไซต์ (เช่น มรดกวงศ์ตระกูลรักดี)',
    namePlaceholder: 'เช่น ประวัติศาสตร์ตระกูล ศรีสวัสดิ์',
    subjectLabel: 'ชื่อผู้สร้างประวัติศาสตร์ตระกูล / ต้นตระกูล',
    subjectPlaceholder: 'เช่น คุณปู่บุญส่ง รักดี',
    dateLabel: 'ปีชาตะ – ปีมรณะ ของต้นตระกูล',
    dateStartTitle: 'ปีชาตะ (วันเกิด)',
    dateStartPlaceholder: 'เลือกวันเกิด (ปีชาตะ)',
    dateEndTitle: 'ปีมรณะ (วันเสียชีวิต)',
    dateEndPlaceholder: 'เลือกวันเสียชีวิต (ปีมรณะ)',
    lifespanPrefix: 'ช่วงอายุต้นตระกูล',
  },
  'Couple': {
    nameLabel: 'ชื่อเว็บไซต์ (เช่น เส้นทางรัก สมศรี & สมชาย)',
    namePlaceholder: 'เช่น ความทรงจำคู่รัก สมหวัง & วันเพ็ญ',
    subjectLabel: 'ชื่อคู่รัก / คู่ชีวิต',
    subjectPlaceholder: 'เช่น สมศรี & สมชาย',
    dateLabel: 'วันแรกที่พบกัน – วันครบรอบแต่งงาน',
    dateStartTitle: 'วันแรกที่พบกัน',
    dateStartPlaceholder: 'เลือกวันแรกที่พบกัน',
    dateEndTitle: 'วันครบรอบแต่งงาน',
    dateEndPlaceholder: 'เลือกวันครบรอบแต่งงาน',
    lifespanPrefix: 'ช่วงเวลาแห่งรัก',
  },
  'Wedding': {
    nameLabel: 'ชื่อเว็บไซต์ (เช่น งานมงคลสมรส ณัฐพล & เบญจมาศ)',
    namePlaceholder: 'เช่น ความทรงจำงานแต่ง วิทยา & ปิยะธิดา',
    subjectLabel: 'ชื่อคู่บ่าวสาว',
    subjectPlaceholder: 'เช่น ณัฐพล & เบญจมาศ',
    dateLabel: 'วันเริ่มต้นคบหา – วันแต่งงาน',
    dateStartTitle: 'วันเริ่มต้นคบหา',
    dateStartPlaceholder: 'เลือกวันเริ่มต้นคบหา',
    dateEndTitle: 'วันมงคลสมรส',
    dateEndPlaceholder: 'เลือกวันมงคลสมรส',
    lifespanPrefix: 'ช่วงความสัมพันธ์',
  },
  'Friends': {
    nameLabel: 'ชื่อเว็บไซต์ (เช่น กลุ่มเพื่อนซี้ ม.ศ.3 รุ่น 12)',
    namePlaceholder: 'เช่น มิตรภาพตลอดไป แก๊งสามช่า',
    subjectLabel: 'ชื่อกลุ่มเพื่อน / รุ่น',
    subjectPlaceholder: 'เช่น เพื่อนซี้ ม.ศ.3 รุ่น 12',
    dateLabel: 'วันเริ่มก่อตั้งแก๊ง – วันปัจจุบัน',
    dateStartTitle: 'วันก่อตั้งแก๊ง',
    dateStartPlaceholder: 'เลือกวันก่อตั้งแก๊ง',
    dateEndTitle: 'วันรวมตัวล่าสุด',
    dateEndPlaceholder: 'เลือกวันรวมตัวล่าสุด',
    lifespanPrefix: 'ระยะเวลามิตรภาพ',
  },
  'Pet Memorial': {
    nameLabel: 'ชื่อเว็บไซต์ (เช่น รำลึกถึงเจ้าปุยฝ้ายแสนรัก)',
    namePlaceholder: 'เช่น ความทรงจำแสนรัก เจ้าตูบสี่ขา',
    subjectLabel: 'ชื่อสัตว์เลี้ยงแสนรัก',
    subjectPlaceholder: 'เช่น เจ้าปุยฝ้าย',
    dateLabel: 'วันเกิด – วันที่เดินทางไปดาวหมาแมว',
    dateStartTitle: 'วันเกิด',
    dateStartPlaceholder: 'เลือกวันเกิด',
    dateEndTitle: 'วันที่เดินทางกลับดาว',
    dateEndPlaceholder: 'เลือกวันที่เดินทางกลับดาว',
    lifespanPrefix: 'ช่วงชีวิตแสนสุข',
  },
};

const CATEGORY_OPTIONS = [
  { 
    key: 'Memorial', 
    thaiLabel: 'Memorial', 
    subLabel: 'รำลึกบุคคลทั่วไป', 
    desc: 'พื้นที่ส่งต่อความรักและความระลึกถึงผู้ล่วงลับ รวบรวมคำไว้อาลัยและภาพความอบอุ่น', 
    icon: Flame, 
  },
  { 
    key: 'Family Legacy', 
    thaiLabel: 'Family Legacy', 
    subLabel: 'มรดกวงศ์ตระกูล', 
    desc: 'หอเกียรติยศบันทึกประวัติศาสตร์ บันทึกความเป็นมา และผังเครือญาติสืบต่อวงศ์ตระกูล', 
    icon: GitBranch, 
  },
  { 
    key: 'Couple', 
    thaiLabel: 'Couple', 
    subLabel: 'ความรักคู่รัก', 
    desc: 'บันทึกการเดินทางของความรัก ไทม์ไลน์ภาพถ่ายและวิดีโอแห่งความประทับใจคู่ชีวิต', 
    icon: Heart, 
  },
  { 
    key: 'Wedding', 
    thaiLabel: 'Wedding', 
    subLabel: 'ความทรงจำแต่งงาน', 
    desc: 'กำหนดการงานมงคลสมรส สมุดลงนามแสดงความยินดีดิจิทัล และฟีดภาพวันสำคัญ', 
    icon: Sparkles, 
  },
  { 
    key: 'Friends', 
    thaiLabel: 'Friends', 
    subLabel: 'กลุ่มเพื่อนรัก', 
    desc: 'พื้นที่รวบรวมเรื่องราวความผูกพัน มิตรภาพที่ไม่มีวันจางหาย และความทรงจำร่วมกับแก๊ง', 
    icon: Users, 
  },
  { 
    key: 'Pet Memorial', 
    thaiLabel: 'Pet Memorial', 
    subLabel: 'สัตว์เลี้ยงแสนรัก', 
    desc: 'คลังรูปถ่ายและพื้นที่ส่งท้ายความผูกพันถึงเจ้าตัวน้อย สมาชิกแสนสำคัญของครอบครัว', 
    icon: PawPrint, 
  },
];

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

  const [category, setCategory] = useState('Memorial');
  const defaults = CATEGORY_INPUT_DEFAULTS[category] || CATEGORY_INPUT_DEFAULTS['Memorial'];
  const [lifespan, setLifespan] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      name: '',
      birthDate: null,
      deathDate: null,
      birthYearOnly: false,
      deathYearOnly: false,
      birthYear: null,
      deathYear: null,
    }
  ]);

  // Synchronize subjects to deceasedName and lifespan
  useEffect(() => {
    // 1. Sync names to deceasedName (joined with &)
    const names = subjects.map(s => s.name).filter(Boolean);
    if (names.length > 1) {
      setDeceasedName(names.join(' & '));
    } else if (names.length === 1) {
      setDeceasedName(names[0]);
    } else {
      setDeceasedName('');
    }

    // 2. Format a combined lifespan string for display
    const formatThaiDate = (date: Date, isYearOnly: boolean) => {
      const yearThai = date.getFullYear() + 543;
      if (isYearOnly) {
        return `พ.ศ. ${yearThai}`;
      }
      const day = date.getDate();
      const monthName = MONTHS_THAI[date.getMonth()];
      return `${day} ${monthName} ${yearThai}`;
    };

    if (category === 'Couple' || category === 'Wedding') {
      const first = subjects[0];
      if (first && first.birthDate) {
        if (first.deathDate) {
          setLifespan(`${formatThaiDate(first.birthDate, first.birthYearOnly)} – ${formatThaiDate(first.deathDate, first.deathYearOnly)}`);
        } else {
          setLifespan(`${formatThaiDate(first.birthDate, first.birthYearOnly)} – (ยังไม่ระบุ)`);
        }
      } else {
        setLifespan('');
      }
    } else {
      const formattedLifespans = subjects.map(s => {
        if (!s.name) return null;
        let range = '';
        if (s.isAlive && s.birthDate) {
          range = `เกิด ${formatThaiDate(s.birthDate, s.birthYearOnly)} (ปัจจุบัน)`;
        } else if (s.birthDate && s.deathDate) {
          range = `${formatThaiDate(s.birthDate, s.birthYearOnly)} – ${formatThaiDate(s.deathDate, s.deathYearOnly)}`;
        } else if (s.birthDate) {
          range = `${formatThaiDate(s.birthDate, s.birthYearOnly)} – (ยังไม่ระบุ)`;
        } else {
          return null;
        }
        return `${s.name}: ${range}`;
      }).filter(Boolean);

      if (formattedLifespans.length > 0) {
        setLifespan(formattedLifespans.join(' | '));
      } else {
        // Backwards compatibility for preview chip when no name is typed yet but dates are selected
        const first = subjects[0];
        if (first && first.birthDate) {
          if (first.isAlive) {
            setLifespan(`เกิด ${formatThaiDate(first.birthDate, first.birthYearOnly)} (ปัจจุบัน)`);
          } else if (first.deathDate) {
            setLifespan(`${formatThaiDate(first.birthDate, first.birthYearOnly)} – ${formatThaiDate(first.deathDate, first.deathYearOnly)}`);
          } else {
            setLifespan(`${formatThaiDate(first.birthDate, first.birthYearOnly)} – (ยังไม่ระบุ)`);
          }
        } else {
          setLifespan('');
        }
      }
    }
  }, [subjects, category]);
  
  const [selectedTheme, setSelectedTheme] = useState('Peaceful Mint');
  const [primaryColor, setPrimaryColor] = useState('#0d9488');
  
  // Loading & error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Payment states
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(2000);
  const [createdTenantId, setCreatedTenantId] = useState('');

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
    setWizardStep(3);
  };

  const handleNextToTheme = () => {
    const hasEmptySubject = subjects.some(s => !s.name.trim());
    if (!name.trim()) {
      setError('กรุณากรอกชื่อเว็บไซต์ให้เรียบร้อย');
      return;
    }
    if (hasEmptySubject) {
      const errorMsg = category === 'Couple' || category === 'Wedding'
        ? 'กรุณากรอกชื่อคู่รักให้ครบทั้ง 2 ท่าน'
        : category === 'Pet Memorial'
        ? 'กรุณากรอกชื่อสัตว์เลี้ยงให้ครบถ้วน'
        : 'กรุณากรอกชื่อผู้ล่วงลับให้ครบถ้วน';
      setError(errorMsg);
      return;
    }
    setError('');
    setWizardStep(4);
  };

  const handleNextToPayment = async () => {
    setError('');
    setIsLoading(true);
    try {
      // Call create endpoint to save the tenant in pending payment state
      const themeColors: Record<string, string> = {
        'Peaceful Mint': '#7ea18b',
        'Sweet Peach': '#e09f9f',
        'Warm Caramel': '#c29a7c',
        'Classic Olive': '#96a288',
        'Ocean Breeze': '#8ba8bd',
        'Lilac Dream': '#a49cb5',
      };
      
      const themeSecondaryColors: Record<string, string> = {
        'Peaceful Mint': '#d4be95',
        'Sweet Peach': '#e6c1a8',
        'Warm Caramel': '#dcc6a8',
        'Classic Olive': '#cfc5b0',
        'Ocean Breeze': '#ded2af',
        'Lilac Dream': '#c8bfcb',
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
            primaryColor: themeColors[selectedTheme] || '#0d9488',
            secondaryColor: themeSecondaryColors[selectedTheme] || '#f59e0b',
            fontFamily: 'Inter',
            heroStyle: 'Classic',
            subjects: subjects.map(s => ({
              name: s.name,
              birthDate: s.birthDate ? s.birthDate.toISOString() : null,
              deathDate: s.deathDate ? s.deathDate.toISOString() : null,
              birthYearOnly: s.birthYearOnly,
              deathYearOnly: s.deathYearOnly,
            })),
            deceasedBirthDate: subjects[0]?.birthDate ? subjects[0].birthDate.toISOString() : null,
            deceasedDeathDate: subjects[0]?.deathDate ? subjects[0].deathDate.toISOString() : null,
            birthYearOnly: subjects[0]?.birthYearOnly || false,
            deathYearOnly: subjects[0]?.deathYearOnly || false,
            lifespan,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCreatedTenantId(data.id);
      setPaymentRef(data.payment.refId);
      setPaymentAmount(data.payment.amount);
      setWizardStep(5);
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

      // Payment verified -> let the owner pick which features to enable before
      // landing on the dashboard (mandatory onboarding step).
      router.push(`/manage/setup-features?site=${createdTenantId}&category=${encodeURIComponent(category)}`);
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
              <Input 
                type="tel" 
                value={loginPhone} 
                onChange={(e) => setLoginPhone(e.target.value)} 
                placeholder="ป้อนเบอร์โทรศัพท์ 10 หลัก (เช่น 0812345678)"
                className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 text-sm focus:bg-white focus:outline-none"
              />
              <Button variant="ghost" type="submit" disabled={isLoading} className="h-auto w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition active:scale-95 shadow-sm">
                {isLoading ? 'กำลังประมวลผล...' : 'ขอรหัส OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <Input 
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
              <Button variant="ghost" type="submit" disabled={isLoading} className="h-auto w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition active:scale-95 shadow-sm">
                {isLoading ? 'กำลังตรวจสอบ...' : 'ยืนยันรหัส OTP'}
              </Button>
            </form>
          )}
        </div>
      </main>
    );
  }

  // RENDER WIZARD FLOW (IF AUTHENTICATED)
  const themes = [
    { name: 'Peaceful Mint', primary: '#7ea18b', hover: '#668571', secondary: '#d4be95', light: '#f4f6f3', desc: 'โทนเขียวเสจหม่นและเบจทรายพรีเมียม (ไว้อาลัยอย่างสงบ)' },
    { name: 'Sweet Peach', primary: '#e09f9f', hover: '#c48282', secondary: '#e6c1a8', light: '#fff7f5', desc: 'โทนชมพูพีชพาสเทลและส้มแอปริคอตนวล (งานแต่งงาน / คู่รัก)' },
    { name: 'Warm Caramel', primary: '#c29a7c', hover: '#a67f62', secondary: '#dcc6a8', light: '#fbf8f5', desc: 'โทนน้ำตาลคาราเมลและเหลืองนมอุ่น (สัตว์เลี้ยง / บันทึกการเดินทาง)' },
    { name: 'Classic Olive', primary: '#96a288', hover: '#7a866d', secondary: '#cfc5b0', light: '#f7f8f5', desc: 'โทนเขียวมะกอกหม่นและแชมเปญคลาสสิก (สายใยตระกูล / ครอบครัว)' },
    { name: 'Ocean Breeze', primary: '#8ba8bd', hover: '#708d9e', secondary: '#ded2af', light: '#f5f7f9', desc: 'โทนฟ้าพาสเทลและเหลืองเลมอนครีมสดใส (มิตรภาพ / ย้อนวันวาน)' },
    { name: 'Lilac Dream', primary: '#a49cb5', hover: '#89819a', secondary: '#c8bfcb', light: '#f7f6f8', desc: 'โทนม่วงไลแล็กหม่นและเทาลาเวนเดอร์ (หรูหรา / ทางการทั่วไป)' }
  ];

  return (
    <main className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] py-8 md:py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl mb-6 md:mb-8">
        <Link
          href="/manage"
          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#86868B] hover:text-[#1D1D1F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับไปแผงควบคุม
        </Link>
      </div>

      {/* Steps indicator — lighter, Home-aligned */}
      <div className="w-full max-w-3xl flex items-center justify-between text-[11px] md:text-[12px] text-[#86868B] mb-8 md:mb-10 select-none">
        {[
          { n: 1, label: 'เลือกหมวดหมู่' },
          { n: 2, label: 'ชื่อลิงก์ URL' },
          { n: 3, label: 'กรอกข้อมูล' },
          { n: 4, label: 'เลือกธีม' },
          { n: 5, label: 'ชำระเงิน' },
        ].map((step, idx, arr) => (
          <React.Fragment key={step.n}>
            <div className={`flex flex-col items-center gap-1.5 ${wizardStep >= step.n ? 'text-[#0071e3] font-semibold' : ''}`}>
              <span
                className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[12px] md:text-[13px] transition ${
                  wizardStep >= step.n
                    ? 'bg-[#0071e3] text-white'
                    : 'bg-white text-[#86868B] shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                }`}
              >
                {wizardStep > step.n ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : step.n}
              </span>
              <span className="hidden sm:block text-center leading-tight">{step.label}</span>
            </div>
            {idx < arr.length - 1 && (
              <div className={`flex-1 h-px mx-1.5 md:mx-2 transition ${wizardStep > step.n ? 'bg-[#0071e3]/50' : 'bg-[#d2d2d7]'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="w-full max-w-3xl p-6 md:p-8 rounded-[22px] md:rounded-[28px] bg-[#FFFFFF] shadow-[0_4px_24px_rgba(0,0,0,0.08)] space-y-6 overflow-visible">
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-[13px] text-red-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: CATEGORY SELECTION */}
        {wizardStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <header className="space-y-2 text-left sm:text-center">
              <p className="text-[13px] font-medium text-[#86868B]">
                {userPhone ? `เข้าสู่ระบบด้วย ${userPhone}` : 'สร้างเว็บเพิ่ม'}
              </p>
              <h2 className="text-[28px] md:text-[32px] font-semibold tracking-tight text-[#1D1D1F] leading-tight">
                สร้างเว็บไซต์ใหม่
              </h2>
              <p className="text-[15px] md:text-[17px] text-[#86868B] font-medium leading-relaxed max-w-xl mx-auto">
                เลือกหมวดความทรงจำสำหรับเว็บถัดไป ระบบจะจัดฟีเจอร์ให้เหมาะกับหมวดที่เลือก
              </p>
            </header>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
              {CATEGORY_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = category === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setCategory(opt.key);
                      setError('');
                      if (opt.key === 'Couple' || opt.key === 'Wedding') {
                        setSubjects([
                          {
                            name: '',
                            birthDate: null,
                            deathDate: null,
                            birthYearOnly: false,
                            deathYearOnly: false,
                            birthYear: null,
                            deathYear: null,
                          },
                          {
                            name: '',
                            birthDate: null,
                            deathDate: null,
                            birthYearOnly: false,
                            deathYearOnly: false,
                            birthYear: null,
                            deathYear: null,
                          }
                        ]);
                      } else {
                        setSubjects([
                          {
                            name: '',
                            birthDate: null,
                            deathDate: null,
                            birthYearOnly: false,
                            deathYearOnly: false,
                            birthYear: null,
                            deathYear: null,
                          }
                        ]);
                      }
                    }}
                    className={`group relative flex h-auto w-full min-w-0 cursor-pointer select-none flex-col items-stretch gap-3 rounded-[18px] border p-5 text-left transition-all duration-200 md:rounded-[22px] md:p-6 ${
                      isSelected
                        ? 'border-[#0071e3] bg-white shadow-[0_4px_20px_rgba(0,113,227,0.12)]'
                        : 'border-transparent bg-[#F5F5F7] hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                          isSelected
                            ? 'bg-[#0071e3] text-white'
                            : 'bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                        }`}
                      >
                        <Icon className="size-5" strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0">
                        <span className="block text-[12px] font-semibold tracking-wide text-[#86868B]">
                          {opt.thaiLabel}
                        </span>
                        <span className="block text-[15px] font-semibold tracking-tight text-[#1D1D1F] md:text-[17px]">
                          {opt.subLabel}
                        </span>
                      </div>
                    </div>

                    <p className="whitespace-normal text-[13px] leading-relaxed text-[#86868B] md:text-[14px]">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 border-t border-[#d2d2d7]/40">
              <p className="text-[13px] text-[#86868B]">
                เว็บใหม่จะมีขั้นชำระเงิน ฿2,000 / ปี
              </p>
              <button
                type="button"
                onClick={() => setWizardStep(2)}
                className="inline-flex items-center justify-center rounded-full bg-[#0071e3] px-8 py-2.5 text-[15px] font-medium text-[#FFFFFF] transition-colors hover:bg-[#0071e3]/90 hover:text-[#FFFFFF] active:scale-[0.98]"
              >
                ถัดไป: ตั้งชื่อลิงก์ URL
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: URL SETUP */}
        {wizardStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <header className="space-y-1">
              <h2 className="text-xl font-black text-stone-900">ตั้งชื่อลิงก์สำหรับเว็บไซต์ความทรงจำ</h2>
              <p className="text-xs text-stone-500">ใช้เป็น URL Path เพื่อให้คนทั่วไปสามารถพิมพ์เพื่อเข้าชมได้ทันที</p>
            </header>

            <div className="space-y-4">
              <div className="flex items-stretch overflow-hidden rounded-2xl border border-[#d2d2d7] bg-[#F5F5F7] transition focus-within:border-[#0071e3]/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0071e3]/20">
                <span className="flex shrink-0 items-center border-r border-[#d2d2d7] px-4 font-mono text-sm text-[#86868B] select-none">
                  forever.co.th/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''));
                    setSlugValid(null);
                  }}
                  placeholder={
                    category === 'Memorial' ? 'somsak-memorial' :
                    category === 'Family Legacy' ? 'somsak-family' :
                    category === 'Couple' ? 'somsak-and-ying' :
                    category === 'Wedding' ? 'wedding-somsak-ying' :
                    category === 'Friends' ? 'chula-law-35' :
                    category === 'Pet Memorial' ? 'lucky-cat' :
                    'somsak-family'
                  }
                  className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3.5 font-mono text-sm text-[#1D1D1F] outline-none placeholder:text-[#AEAEB2]"
                />
              </div>

              <button
                type="button"
                onClick={checkSlug}
                disabled={slugChecking}
                className="inline-flex h-auto cursor-pointer items-center rounded-xl border border-[#d2d2d7] bg-white px-5 py-2.5 text-xs font-bold text-[#1D1D1F] shadow-sm transition hover:bg-[#F5F5F7] active:scale-95 disabled:pointer-events-none disabled:opacity-50"
              >
                {slugChecking ? 'กำลังตรวจสอบ...' : 'ตรวจสอบสิทธิ์ว่าง'}
              </button>

              {slugValid === true && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
                  <Check className="size-4 shrink-0 text-emerald-600" />
                  <span>ชื่อลิงก์ &quot;forever.co.th/{slug}&quot; พร้อมใช้งาน</span>
                </div>
              )}
              {slugValid === false && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                  ชื่อลิงก์นี้ถูกใช้แล้ว หรือไม่สามารถใช้ได้ กรุณาลองชื่ออื่น
                </div>
              )}
            </div>

            <div className="flex justify-between gap-3 border-t border-[#d2d2d7]/40 pt-4">
              <button
                type="button"
                onClick={() => setWizardStep(1)}
                className="rounded-full border border-[#d2d2d7] px-6 py-2.5 text-[13px] font-semibold text-[#86868B] transition hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
              >
                ย้อนกลับ
              </button>
              <button
                type="button"
                onClick={handleNextToInfo}
                className="inline-flex h-auto items-center justify-center rounded-full bg-[#0071e3] px-8 py-2.5 text-[15px] font-medium text-[#FFFFFF] transition-colors hover:bg-[#0071e3]/90 hover:text-[#FFFFFF] active:scale-[0.98]"
              >
                ถัดไป: กรอกข้อมูลเว็บ
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INFO SETUP */}
        {wizardStep === 3 && (
          <div className="space-y-6 animate-fade-in overflow-visible">
            <header className="space-y-1">
              <h2 className="text-xl font-black text-stone-900">รายละเอียดเว็บไซต์ความทรงจำ</h2>
              <p className="text-xs text-stone-500">กรอกรายละเอียดเพื่อสร้างโครงสร้างหน้ารำลึกเริ่มต้น</p>
            </header>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-stone-600 tracking-wide flex items-center gap-1">
                  <span>{defaults.nameLabel}</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <Input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder={defaults.namePlaceholder}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm sm:text-base focus:bg-white focus:outline-none"
                />
              </div>

              {subjects.map((sub, index) => (
                <div key={index} className="p-5 rounded-2xl border border-stone-250 bg-stone-50/20 space-y-4 relative animate-fade-in shadow-xs">
                  {subjects.length > 1 && category !== 'Couple' && category !== 'Wedding' && (
                    <Button variant="ghost"
                      type="button"
                      onClick={() => {
                        const newSubs = [...subjects];
                        newSubs.splice(index, 1);
                        setSubjects(newSubs);
                      }}
                      className="absolute top-4 right-4 text-xs font-bold text-red-650 hover:text-red-700 active:scale-95 transition cursor-pointer"
                    >
                      ลบออก
                    </Button>
                  )}
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-wider">
                    {category === 'Pet Memorial' ? `ข้อมูลสัตว์เลี้ยงตัวที่ ${index + 1}` :
                     category === 'Couple' || category === 'Wedding' ? `ข้อมูลคู่รักคนที่ ${index + 1}` :
                     `ข้อมูลผู้ล่วงลับท่านที่ ${index + 1}`}
                  </h4>

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-stone-600 tracking-wide flex items-center gap-1">
                      <span>{defaults.subjectLabel}</span>
                      <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <Input 
                      type="text" 
                      value={sub.name} 
                      onChange={(e) => {
                        const newSubs = [...subjects];
                        newSubs[index].name = e.target.value;
                        setSubjects(newSubs);
                      }} 
                      placeholder={defaults.subjectPlaceholder}
                      className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm sm:text-base focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>

                  {!(index > 0 && (category === 'Couple' || category === 'Wedding')) && (
                    <div className="space-y-2.5">
                      {/* Still Alive checkbox for Pet Memorial and Family Legacy */}
                      {(category === 'Pet Memorial' || category === 'Family Legacy') && (
                        <label className="flex items-center gap-1.5 cursor-pointer select-none pb-0.5">
                          <Checkbox 
                            checked={sub.isAlive || false}
                            onCheckedChange={(checked) => {
                                const isChecked = !!checked;
                              const newSubs = [...subjects];
                              newSubs[index].isAlive = isChecked;
                              if (isChecked) {
                                newSubs[index].deathDate = null;
                                newSubs[index].deathYear = null;
                                newSubs[index].deathYearOnly = false;
                              }
                              setSubjects(newSubs);
                            }}
                            className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-emerald-800">
                            {category === 'Pet Memorial' ? 'น้องยังมีชีวิตอยู่' : 'ท่านยังมีชีวิตอยู่'}
                          </span>
                        </label>
                      )}

                      <label className="text-sm font-bold text-stone-600 tracking-wide">{defaults.dateLabel}</label>
                      
                      <div className={`grid gap-4 ${sub.isAlive ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                        <div className="space-y-1">
                          <span className="text-[9px] text-stone-500 font-semibold block">{defaults.dateStartTitle}</span>
                          <ThaiDatePicker
                            variant="input"
                            yearOnly={sub.birthYearOnly}
                            value={
                              sub.birthYearOnly
                                ? sub.birthYear != null
                                  ? `${sub.birthYear}-01-01`
                                  : ''
                                : dateToYmd(sub.birthDate)
                            }
                            onChange={(ymd) => {
                              const newSubs = [...subjects];
                              if (sub.birthYearOnly) {
                                if (!ymd) {
                                  newSubs[index].birthYear = null;
                                  newSubs[index].birthDate = null;
                                } else {
                                  const year = parseInt(ymd.slice(0, 4), 10);
                                  newSubs[index].birthYear = year;
                                  newSubs[index].birthDate = new Date(year, 0, 1);
                                }
                              } else {
                                newSubs[index].birthDate = ymdToDate(ymd);
                              }
                              setSubjects(newSubs);
                            }}
                            placeholder={sub.birthYearOnly ? 'เลือกปี พ.ศ.' : defaults.dateStartPlaceholder}
                            align="left"
                          />
                          <label className="flex items-center gap-1.5 mt-1 cursor-pointer select-none">
                            <Checkbox 
                              checked={sub.birthYearOnly}
                              onCheckedChange={(checked) => {
                                const isChecked = !!checked;
                                const newSubs = [...subjects];
                                newSubs[index].birthYearOnly = isChecked;
                                if (isChecked) {
                                  const initialYear = sub.birthDate ? sub.birthDate.getFullYear() : new Date().getFullYear();
                                  newSubs[index].birthYear = initialYear;
                                  newSubs[index].birthDate = new Date(initialYear, 0, 1);
                                } else {
                                  newSubs[index].birthYear = null;
                                  newSubs[index].birthDate = null;
                                }
                                setSubjects(newSubs);
                              }}
                              className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-3 h-3 cursor-pointer"
                            />
                            <span className="text-[9px] text-stone-500 font-semibold">
                              {category === 'Couple' ? 'ระบุเฉพาะปีที่พบกัน' :
                               category === 'Friends' ? 'ระบุเฉพาะปีที่ก่อตั้ง' :
                               category === 'Wedding' ? 'ระบุเฉพาะปี' :
                               'ไม่ระบุวัน-เดือน (ระบุเฉพาะปีเกิด)'}
                            </span>
                          </label>
                        </div>

                        {/* Death Date column (only if not alive) */}
                        {!sub.isAlive && (
                          <div className="space-y-1">
                            <span className="text-[9px] text-stone-500 font-semibold block">{defaults.dateEndTitle}</span>
                            <ThaiDatePicker
                              variant="input"
                              yearOnly={sub.deathYearOnly}
                              value={
                                sub.deathYearOnly
                                  ? sub.deathYear != null
                                    ? `${sub.deathYear}-01-01`
                                    : ''
                                  : dateToYmd(sub.deathDate)
                              }
                              onChange={(ymd) => {
                                const newSubs = [...subjects];
                                if (sub.deathYearOnly) {
                                  if (!ymd) {
                                    newSubs[index].deathYear = null;
                                    newSubs[index].deathDate = null;
                                  } else {
                                    const year = parseInt(ymd.slice(0, 4), 10);
                                    newSubs[index].deathYear = year;
                                    newSubs[index].deathDate = new Date(year, 0, 1);
                                  }
                                } else {
                                  newSubs[index].deathDate = ymdToDate(ymd);
                                }
                                setSubjects(newSubs);
                              }}
                              placeholder={sub.deathYearOnly ? 'เลือกปี พ.ศ.' : defaults.dateEndPlaceholder}
                              align="right"
                            />
                            <label className="flex items-center gap-1.5 mt-1 cursor-pointer select-none">
                              <Checkbox 
                                checked={sub.deathYearOnly}
                                onCheckedChange={(checked) => {
                                const isChecked = !!checked;
                                  const newSubs = [...subjects];
                                  newSubs[index].deathYearOnly = isChecked;
                                  if (isChecked) {
                                    const initialYear = sub.deathDate ? sub.deathDate.getFullYear() : new Date().getFullYear();
                                    newSubs[index].deathYear = initialYear;
                                    newSubs[index].deathDate = new Date(initialYear, 0, 1);
                                  } else {
                                    newSubs[index].deathYear = null;
                                    newSubs[index].deathDate = null;
                                  }
                                  setSubjects(newSubs);
                                }}
                                className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-3 h-3 cursor-pointer"
                              />
                              <span className="text-[9px] text-stone-500 font-semibold">
                                {category === 'Couple' ? 'ระบุเฉพาะปีมงคลสมรส' :
                                 category === 'Friends' ? 'ระบุเฉพาะปีล่าสุด' :
                                 category === 'Wedding' ? 'ระบุเฉพาะปี' :
                                 category === 'Pet Memorial' ? 'ไม่ระบุวัน-เดือน (ระบุเฉพาะปีที่เดินทางกลับดาว)' :
                                 'ไม่ระบุวัน-เดือน (ระบุเฉพาะปีที่เสียชีวิต)'}
                              </span>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {category !== 'Couple' && category !== 'Wedding' && (
                <Button variant="ghost"
                  type="button"
                  onClick={() => {
                    setSubjects([
                      ...subjects,
                      {
                        name: '',
                        birthDate: null,
                        deathDate: null,
                        birthYearOnly: false,
                        deathYearOnly: false,
                        birthYear: null,
                        deathYear: null,
                      }
                    ]);
                  }}
                  className="w-full py-3 border-2 border-dashed border-stone-300 hover:border-emerald-500 hover:text-emerald-700 text-stone-500 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer bg-stone-50/20 active:scale-99 hover:bg-emerald-50/10"
                >
                  {category === 'Pet Memorial' ? '+ เพิ่มสัตว์เลี้ยงอีกตัว' :
                   category === 'Memorial' || category === 'Family Legacy' ? '+ เพิ่มรายชื่อผู้ล่วงลับอีกท่าน' :
                   '+ เพิ่มรายชื่อผู้ร่วมแสดงผล'}
                </Button>
              )}

              {lifespan && (
                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                    สรุปกำหนดข้อมูลช่วงเวลา ({defaults.lifespanPrefix})
                  </span>
                  <p className="text-[10px] text-emerald-700 font-semibold leading-relaxed whitespace-pre-line">
                    {lifespan}
                  </p>
                </div>
              )}

            </div>

            <div className="flex justify-between pt-4 border-t border-stone-100">
              <Button variant="ghost" type="button" onClick={() => setWizardStep(2)} className="px-6 py-3 rounded-xl border border-stone-300 text-stone-550 hover:bg-stone-50 text-xs transition font-semibold">ย้อนกลับ</Button>
              <button
                type="button"
                onClick={handleNextToTheme}
                className="inline-flex h-auto items-center justify-center rounded-full bg-[#0071e3] px-8 py-2.5 text-[15px] font-medium text-[#FFFFFF] transition-colors hover:bg-[#0071e3]/90 hover:text-[#FFFFFF] active:scale-[0.98]"
              >
                ถัดไป: เลือกธีมการจัดแสดง
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: THEME SETUP */}
        {wizardStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <header className="space-y-1">
              <h2 className="text-xl font-black text-stone-900">เลือกธีมความทรงจำพาสเทลสำเร็จรูป (6 ตัวเลือก)</h2>
              <p className="text-xs text-stone-500">เลือกแนวโทนสีและอารมณ์ของหน้าเว็บความทรงจำของคุณ</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2">
              {themes.map(t => {
                const isActive = selectedTheme === t.name;
                return (
                  <div 
                    key={t.name}
                    onClick={() => setSelectedTheme(t.name)}
                    className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between gap-4 transition select-none hover:shadow-md ${
                      isActive ? 'border-sky-500 bg-sky-50/10 shadow-xs ring-2 ring-sky-500/10' : 'border-stone-200 hover:border-stone-300 bg-stone-50/20'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-stone-900">{t.name}</p>
                        {isActive && (
                          <span className="w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-stone-500 leading-normal">{t.desc}</p>
                    </div>
                    
                    {/* Color dots row */}
                    <div className="flex gap-1 items-center">
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-200/50 block shrink-0" style={{ backgroundColor: t.primary }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-200/50 block shrink-0" style={{ backgroundColor: t.hover }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-200/50 block shrink-0" style={{ backgroundColor: t.secondary }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-200/50 block shrink-0" style={{ backgroundColor: t.light }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-stone-100">
              <Button variant="ghost" type="button" onClick={() => setWizardStep(3)} className="px-6 py-3 rounded-xl border border-stone-300 text-stone-550 hover:bg-stone-50 text-xs transition font-semibold">ย้อนกลับ</Button>
              <button
                type="button"
                onClick={handleNextToPayment}
                disabled={isLoading}
                className="inline-flex h-auto items-center justify-center rounded-full bg-[#0071e3] px-8 py-2.5 text-[15px] font-medium text-[#FFFFFF] transition-colors hover:bg-[#0071e3]/90 hover:text-[#FFFFFF] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
              >
                {isLoading ? 'กำลังสร้างร่างเว็บไซต์...' : 'ถัดไป: ขั้นตอนชำระเงิน'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: PAYMENT (PROMPTPAY QR) */}
        {wizardStep === 5 && (
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
                type="button"
                onClick={handleSimulatePaymentSuccess}
                disabled={isLoading}
                className="inline-flex h-auto w-full items-center justify-center rounded-full bg-[#0071e3] py-3 text-[15px] font-medium text-[#FFFFFF] transition-colors hover:bg-[#0071e3]/90 hover:text-[#FFFFFF] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
              >
                {isLoading ? 'กำลังตรวจเช็กยอดเงิน...' : 'จำลองการชำระเงินสำเร็จ (Callback Simulator)'}
              </button>
              <Button variant="ghost" type="button" 
                onClick={() => setWizardStep(4)}
                className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-550 hover:bg-stone-50 text-xs font-semibold transition"
              >
                ย้อนกลับไปแก้ไข
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
