'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ChevronLeft, ChevronRight, AlertCircle, Smartphone, Info, Check, Flame, GitBranch, Heart, Sparkles, Users } from 'lucide-react';

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
}

function CalendarPicker({
  selectedDate,
  onChange,
  placeholder,
  align = 'left',
}: {
  selectedDate: Date | null;
  onChange: (date: Date) => void;
  placeholder: string;
  align?: 'left' | 'right';
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
          <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} bottom-full mb-2 z-50 bg-white border border-stone-250 rounded-2xl shadow-xl p-3 w-[315px] sm:w-[350px] animate-fade-in text-left`}>
            <div className="flex justify-between items-center mb-4 gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-600 transition cursor-pointer flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4 text-stone-500" />
              </button>
              
              <div className="flex gap-1">
                <select
                  value={month}
                  onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-2 py-1.5 text-sm sm:text-base font-bold text-stone-900 focus:outline-none cursor-pointer hover:bg-stone-100/50 transition"
                >
                  {MONTHS_THAI.map((mName, idx) => (
                    <option key={idx} value={idx}>{mName}</option>
                  ))}
                </select>

                <select
                  value={year}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-2 py-1.5 text-sm sm:text-base font-bold text-stone-900 focus:outline-none cursor-pointer hover:bg-stone-100/50 transition"
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
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-600 transition cursor-pointer flex items-center justify-center"
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
    colorClass: 'from-amber-500/10 to-orange-500/5 text-amber-700 shadow-amber-500/5',
    iconColor: 'bg-amber-100 text-amber-700 shadow-amber-200/30'
  },
  { 
    key: 'Family Legacy', 
    thaiLabel: 'Family Legacy', 
    subLabel: 'มรดกวงศ์ตระกูล', 
    desc: 'หอเกียรติยศบันทึกประวัติศาสตร์ บันทึกความเป็นมา และผังเครือญาติสืบต่อวงศ์ตระกูล', 
    icon: GitBranch, 
    colorClass: 'from-emerald-500/10 to-teal-500/5 text-emerald-700 shadow-emerald-500/5',
    iconColor: 'bg-emerald-100 text-emerald-700 shadow-emerald-200/30'
  },
  { 
    key: 'Couple', 
    thaiLabel: 'Couple', 
    subLabel: 'ความรักคู่รัก', 
    desc: 'บันทึกการเดินทางของความรัก ไทม์ไลน์ภาพถ่ายและวิดีโอแห่งความประทับใจคู่ชีวิต', 
    icon: Heart, 
    colorClass: 'from-rose-500/10 to-pink-500/5 text-rose-700 shadow-rose-500/5',
    iconColor: 'bg-rose-100 text-rose-700 shadow-rose-200/30'
  },
  { 
    key: 'Wedding', 
    thaiLabel: 'Wedding', 
    subLabel: 'ความทรงจำแต่งงาน', 
    desc: 'กำหนดการงานมงคลสมรส สมุดลงนามแสดงความยินดีดิจิทัล และฟีดภาพวันสำคัญ', 
    icon: Sparkles, 
    colorClass: 'from-violet-500/10 to-indigo-500/5 text-violet-700 shadow-violet-500/5',
    iconColor: 'bg-violet-100 text-violet-700 shadow-violet-200/30'
  },
  { 
    key: 'Friends', 
    thaiLabel: 'Friends', 
    subLabel: 'กลุ่มเพื่อนรัก', 
    desc: 'พื้นที่รวบรวมเรื่องราวความผูกพัน มิตรภาพที่ไม่มีวันจางหาย และความทรงจำร่วมกับแก๊ง', 
    icon: Users, 
    colorClass: 'from-sky-500/10 to-blue-500/5 text-sky-700 shadow-sky-500/5',
    iconColor: 'bg-sky-100 text-sky-700 shadow-sky-200/30'
  },
  { 
    key: 'Pet Memorial', 
    thaiLabel: 'Pet Memorial', 
    subLabel: 'สัตว์เลี้ยงแสนรัก', 
    desc: 'คลังรูปถ่ายและพื้นที่ส่งท้ายความผูกพันถึงเจ้าตัวน้อย สมาชิกแสนสำคัญของครอบครัว', 
    icon: Heart, 
    colorClass: 'from-orange-500/10 to-red-500/5 text-orange-700 shadow-orange-500/5',
    iconColor: 'bg-orange-100 text-orange-700 shadow-orange-200/30'
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
  const currentCEYear = new Date().getFullYear();
  const yearsList = Array.from({ length: 150 }, (_, i) => currentCEYear + 5 - i);

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
        if (s.birthDate && s.deathDate) {
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
          if (first.deathDate) {
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
  
  const [selectedTheme, setSelectedTheme] = useState('Classic');
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
          <span>เลือกหมวดหมู่</span>
        </div>
        <div className={`flex-1 h-px mx-2 transition ${wizardStep >= 2 ? 'bg-emerald-600/60' : 'bg-stone-200'}`} />
        <div className={`flex flex-col items-center gap-2 ${wizardStep >= 2 ? 'text-emerald-700 font-bold' : ''}`}>
          <span className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${wizardStep >= 2 ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold' : 'border-stone-200 bg-white text-stone-400'}`}>2</span>
          <span>ชื่อลิงก์ URL</span>
        </div>
        <div className={`flex-1 h-px mx-2 transition ${wizardStep >= 3 ? 'bg-emerald-600/60' : 'bg-stone-200'}`} />
        <div className={`flex flex-col items-center gap-2 ${wizardStep >= 3 ? 'text-emerald-700 font-bold' : ''}`}>
          <span className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${wizardStep >= 3 ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold' : 'border-stone-200 bg-white text-stone-400'}`}>3</span>
          <span>กรอกข้อมูล</span>
        </div>
        <div className={`flex-1 h-px mx-2 transition ${wizardStep >= 4 ? 'bg-emerald-600/60' : 'bg-stone-200'}`} />
        <div className={`flex flex-col items-center gap-2 ${wizardStep >= 4 ? 'text-emerald-700 font-bold' : ''}`}>
          <span className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${wizardStep >= 4 ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold' : 'border-stone-200 bg-white text-stone-400'}`}>4</span>
          <span>เลือกธีม</span>
        </div>
        <div className={`flex-1 h-px mx-2 transition ${wizardStep >= 5 ? 'bg-emerald-600/60' : 'bg-stone-200'}`} />
        <div className={`flex flex-col items-center gap-2 ${wizardStep >= 5 ? 'text-emerald-700 font-bold' : ''}`}>
          <span className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${wizardStep >= 5 ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold' : 'border-stone-200 bg-white text-stone-400'}`}>5</span>
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

        {/* STEP 1: CATEGORY SELECTION */}
        {wizardStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <header className="space-y-1 text-center">
              <h2 className="text-xl font-black text-stone-900">เลือกประเภทความทรงจำ</h2>
              <p className="text-xs text-stone-500">เลือกรูปแบบที่ต้องการสร้างเพื่อรับการจัดแต่งฟีเจอร์และคำนำทางที่เหมาะสม</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                    className={`group flex flex-col gap-3.5 rounded-3xl p-6 text-left transition-all duration-300 cursor-pointer relative overflow-hidden select-none hover:-translate-y-0.5 border border-transparent ${
                      isSelected
                        ? `bg-gradient-to-br ${opt.colorClass} shadow-lg shadow-emerald-500/5`
                        : 'bg-stone-100/40 hover:bg-stone-100/70 hover:shadow-xs'
                    }`}
                  >
                    {/* Glowing highlight blur circle inside selected card */}
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl -mr-6 -mt-6 pointer-events-none" />
                    )}

                    <div className="flex items-center gap-3.5">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 shadow-xs ${
                        isSelected 
                          ? 'bg-emerald-600 text-white scale-105' 
                          : `${opt.iconColor} group-hover:scale-105`
                      }`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <span className="block text-[10px] font-black tracking-wider uppercase text-stone-400">
                          {opt.thaiLabel}
                        </span>
                        <span className="block text-sm font-extrabold text-stone-850">
                          {opt.subLabel}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-[11px] leading-relaxed text-stone-500 group-hover:text-stone-600 transition-colors">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-stone-100">
              <button 
                onClick={() => setWizardStep(2)}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition active:scale-95 shadow-sm"
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
                  placeholder={
                    category === 'Memorial' ? 'somsak-memorial' :
                    category === 'Family Legacy' ? 'somsak-family' :
                    category === 'Couple' ? 'somsak-and-ying' :
                    category === 'Wedding' ? 'wedding-somsak-ying' :
                    category === 'Friends' ? 'chula-law-35' :
                    category === 'Pet Memorial' ? 'lucky-cat' :
                    'somsak-family'
                  }
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

            <div className="flex justify-between pt-4 border-t border-stone-100">
              <button 
                onClick={() => setWizardStep(1)} 
                className="px-6 py-3 rounded-xl border border-stone-300 text-stone-550 hover:bg-stone-50 text-xs transition font-semibold"
              >
                ย้อนกลับ
              </button>
              <button 
                onClick={handleNextToInfo}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition active:scale-95 shadow-sm"
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
                <input 
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
                    <button
                      type="button"
                      onClick={() => {
                        const newSubs = [...subjects];
                        newSubs.splice(index, 1);
                        setSubjects(newSubs);
                      }}
                      className="absolute top-4 right-4 text-xs font-bold text-red-650 hover:text-red-700 active:scale-95 transition cursor-pointer"
                    >
                      ลบออก
                    </button>
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
                    <input 
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
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-stone-600 tracking-wide">{defaults.dateLabel}</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] text-stone-500 font-semibold block">{defaults.dateStartTitle}</span>
                          {sub.birthYearOnly ? (
                            <select
                              value={sub.birthYear || ''}
                              onChange={(e) => {
                                const val = e.target.value ? parseInt(e.target.value, 10) : null;
                                const newSubs = [...subjects];
                                newSubs[index].birthYear = val;
                                if (val) {
                                  newSubs[index].birthDate = new Date(val, 0, 1);
                                } else {
                                  newSubs[index].birthDate = null;
                                }
                                setSubjects(newSubs);
                              }}
                              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs sm:text-sm focus:outline-none cursor-pointer focus:border-emerald-500 transition"
                            >
                              <option value="">เลือกปี พ.ศ.</option>
                              {yearsList.map((y) => (
                                <option key={y} value={y}>พ.ศ. {y + 543}</option>
                              ))}
                            </select>
                          ) : (
                            <CalendarPicker
                              selectedDate={sub.birthDate}
                              onChange={(date) => {
                                const newSubs = [...subjects];
                                newSubs[index].birthDate = date;
                                setSubjects(newSubs);
                              }}
                              placeholder={defaults.dateStartPlaceholder}
                              align="left"
                            />
                          )}
                          <label className="flex items-center gap-1.5 mt-1 cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={sub.birthYearOnly}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const newSubs = [...subjects];
                                newSubs[index].birthYearOnly = checked;
                                if (checked) {
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
                        <div className="space-y-1">
                          <span className="text-[9px] text-stone-500 font-semibold block">{defaults.dateEndTitle}</span>
                          {sub.deathYearOnly ? (
                            <select
                              value={sub.deathYear || ''}
                              onChange={(e) => {
                                const val = e.target.value ? parseInt(e.target.value, 10) : null;
                                const newSubs = [...subjects];
                                newSubs[index].deathYear = val;
                                if (val) {
                                  newSubs[index].deathDate = new Date(val, 0, 1);
                                } else {
                                  newSubs[index].deathDate = null;
                                }
                                setSubjects(newSubs);
                              }}
                              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs sm:text-sm focus:outline-none cursor-pointer focus:border-emerald-500 transition"
                            >
                              <option value="">เลือกปี พ.ศ.</option>
                              {yearsList.map((y) => (
                                <option key={y} value={y}>พ.ศ. {y + 543}</option>
                              ))}
                            </select>
                          ) : (
                            <CalendarPicker
                              selectedDate={sub.deathDate}
                              onChange={(date) => {
                                const newSubs = [...subjects];
                                newSubs[index].deathDate = date;
                                setSubjects(newSubs);
                              }}
                              placeholder={defaults.dateEndPlaceholder}
                              align="right"
                            />
                          )}
                          <label className="flex items-center gap-1.5 mt-1 cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={sub.deathYearOnly}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const newSubs = [...subjects];
                                newSubs[index].deathYearOnly = checked;
                                if (checked) {
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
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {category !== 'Couple' && category !== 'Wedding' && (
                <button
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
                </button>
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
              <button onClick={() => setWizardStep(2)} className="px-6 py-3 rounded-xl border border-stone-300 text-stone-550 hover:bg-stone-50 text-xs transition font-semibold">ย้อนกลับ</button>
              <button onClick={handleNextToTheme} className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition active:scale-95 shadow-sm">ถัดไป: เลือกธีมการจัดแสดง</button>
            </div>
          </div>
        )}

        {/* STEP 4: THEME SETUP */}
        {wizardStep === 4 && (
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
              <button onClick={() => setWizardStep(3)} className="px-6 py-3 rounded-xl border border-stone-300 text-stone-550 hover:bg-stone-50 text-xs transition font-semibold">ย้อนกลับ</button>
              <button onClick={handleNextToPayment} disabled={isLoading} className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition active:scale-95 shadow-sm">
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
                onClick={handleSimulatePaymentSuccess}
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md active:scale-95"
              >
                {isLoading ? 'กำลังตรวจเช็กยอดเงิน...' : 'จำลองการชำระเงินสำเร็จ (Callback Simulator)'}
              </button>
              <button 
                onClick={() => setWizardStep(4)}
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
