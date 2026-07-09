'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, AlertCircle, ArrowRight, User, Calendar, BookOpen, Palette, RotateCw } from 'lucide-react';
import ThaiDatePicker from '@/components/ThaiDatePicker';

const THEME_PRESETS = [
  { id: 'ELEGANT_WHITE', name: 'ขาวเรียบหรู (Elegant White)', primary: '#0071e3', secondary: '#ffffff' },
  { id: 'WARM_CREAM', name: 'ครีมอบอุ่น (Warm Cream)', primary: '#7d6b4e', secondary: '#FAF6EE' },
  { id: 'CHARCOAL_SLATE', name: 'เทาสุภาพ (Charcoal Slate)', primary: '#c2a878', secondary: '#1c1917' }
];

function FillInfoInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const siteId = searchParams.get('site');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [siteDetails, setSiteDetails] = useState<any>(null);

  // Form Fields
  const [websiteName, setWebsiteName] = useState('');
  const [biography, setBiography] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('ELEGANT_WHITE');

  // Dynamic Subjects (Single/Couple/Group)
  const [subjectName1, setSubjectName1] = useState('');
  const [subjectBirth1, setSubjectBirth1] = useState('');
  const [subjectDeath1, setSubjectDeath1] = useState('');
  const [subjectName2, setSubjectName2] = useState(''); // Used for Couple/Wedding
  const [subjectBirth2, setSubjectBirth2] = useState(''); // Used for Couple/Wedding
  const [subjectDeath2, setSubjectDeath2] = useState(''); // Used for Couple/Wedding

  useEffect(() => {
    if (!siteId) {
      setError('ไม่พบรหัสเว็บไซต์เพื่อเริ่มกรอกข้อมูล');
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

        setSiteDetails(matched);
        setWebsiteName(matched.name || '');

        const config = matched.themeConfig || {};
        if (config.style) {
          setSelectedTheme(config.style);
        }

        const subs = config.subjects || [];
        if (subs.length > 0) {
          setSubjectName1(subs[0].name || '');
          setSubjectBirth1(subs[0].birthDate || '');
          setSubjectDeath1(subs[0].deathDate || '');
        }
        if (subs.length > 1) {
          setSubjectName2(subs[1].name || '');
          setSubjectBirth2(subs[1].birthDate || '');
          setSubjectDeath2(subs[1].deathDate || '');
        }
      } catch (err: any) {
        setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลเว็บไซต์');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSite();
  }, [siteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteName.trim()) {
      setError('กรุณากรอกชื่อหัวข้อหน้าเว็บ');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const isCoupleCategory = siteDetails?.category === 'Couple' || siteDetails?.category === 'Wedding';
      
      const subjects: any[] = [];
      if (subjectName1.trim()) {
        subjects.push({
          name: subjectName1.trim(),
          birthDate: subjectBirth1 || null,
          deathDate: subjectDeath1 || null,
          isAlive: isCoupleCategory ? true : false,
        });
      }

      if (isCoupleCategory && subjectName2.trim()) {
        subjects.push({
          name: subjectName2.trim(),
          birthDate: subjectBirth2 || null,
          deathDate: subjectDeath2 || null,
          isAlive: true,
        });
      }

      const defaultTheme = THEME_PRESETS.find(t => t.id === selectedTheme);

      const themeConfig = {
        ...(siteDetails?.themeConfig || {}),
        style: selectedTheme,
        primaryColor: defaultTheme?.primary || '#0071e3',
        secondaryColor: defaultTheme?.secondary || '#ffffff',
        fontFamily: 'Inter',
        heroStyle: 'Classic',
        subjects,
        announcement: {
          ...(siteDetails?.themeConfig?.announcement || {}),
          style: selectedTheme,
          text: biography,
        }
      };

      const res = await fetch('/api/tenant/update-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: siteId,
          name: websiteName.trim(),
          themeConfig,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Go to setup features
      router.push(`/manage/onboarding/setup-features?site=${siteId}&category=${siteDetails.category}`);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      setIsSubmitting(false);
    }
  };

  const isCoupleCategory = siteDetails?.category === 'Couple' || siteDetails?.category === 'Wedding';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center text-stone-600">
        <RotateCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-medium tracking-wide">กำลังเตรียมแบบฟอร์มข้อมูล...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-855 flex flex-col items-center justify-center p-4 py-8">
      {/* Onboarding Steps Progress */}
      <div className="w-full max-w-xl mb-8 flex justify-between items-center text-xs px-2 font-medium text-stone-400">
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-200">✓</span>
          <span className="text-blue-600">เลือกชื่อลิงก์ URL</span>
        </div>
        <div className="h-[2px] bg-blue-200 flex-1 -mt-5" />
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</span>
          <span className="text-blue-600 font-bold">กรอกประวัติและเลือกธีม</span>
        </div>
        <div className="h-[2px] bg-stone-200 flex-1 -mt-5" />
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center font-bold">3</span>
          <span>ตั้งค่าเริ่มต้นฟีเจอร์</span>
        </div>
      </div>

      <div className="w-full max-w-xl p-8 rounded-3xl border border-stone-200 bg-white shadow-xl space-y-8 animate-fade-in">
        <header className="text-center space-y-2">
          <span className="text-[10px] uppercase font-black text-blue-800 tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-600" /> STEP 2: FILL INFO & THEME
          </span>
          <h1 className="text-2xl font-black text-stone-900 pt-2">ข้อมูลผู้ล่วงลับ / เจ้าของประวัติ</h1>
          <p className="text-stone-500 text-xs leading-relaxed max-w-xs mx-auto">
            กรอกข้อมูลรายละเอียดเบื้องต้นของประวัติและเลือกธีมการจัดแต่งหน้าเว็บ
          </p>
        </header>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section A: Basic Header */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block pl-1">
                ชื่อหัวข้อหน้าเว็บ (เช่น อนุสรณ์แด่... / ความทรงจำแสนรักของ...)
              </label>
              <input
                type="text"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                placeholder="ระบุข้อความหัวเรื่องบนหน้าเว็บ..."
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Section B: Subjects Details */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h3 className="text-xs font-bold text-stone-800 flex items-center gap-1.5 pl-1">
              <User className="w-4 h-4 text-blue-650" />
              <span>{isCoupleCategory ? 'ข้อมูลคู่รัก' : siteDetails?.category === 'Pet Memorial' ? 'ข้อมูลเด็กดี/สัตว์เลี้ยง' : 'ประวัติผู้ล่วงลับ'}</span>
            </h3>

            {/* Subject 1 */}
            <div className="bg-stone-50/50 p-4 rounded-2xl border border-stone-200 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 block">
                  {isCoupleCategory ? 'ชื่อฝ่ายชาย / บุคคลที่ 1' : 'ชื่อจริง - นามสกุล'}
                </label>
                <input
                  type="text"
                  value={subjectName1}
                  onChange={(e) => setSubjectName1(e.target.value)}
                  placeholder="ป้อนชื่อ..."
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              {!isCoupleCategory && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-stone-500 block">วันเกิด</label>
                    <ThaiDatePicker
                      value={subjectBirth1}
                      onChange={setSubjectBirth1}
                      placeholder="เลือกวันเกิด"
                      variant="input"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-stone-500 block">วันเสียชีวิต</label>
                    <ThaiDatePicker
                      value={subjectDeath1}
                      onChange={setSubjectDeath1}
                      placeholder="เลือกวันเสียชีวิต"
                      variant="input"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Subject 2 (Couple / Wedding only) */}
            {isCoupleCategory && (
              <div className="bg-stone-50/50 p-4 rounded-2xl border border-stone-200 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 block">ชื่อฝ่ายหญิง / บุคคลที่ 2</label>
                  <input
                    type="text"
                    value={subjectName2}
                    onChange={(e) => setSubjectName2(e.target.value)}
                    placeholder="ป้อนชื่อ..."
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section C: Biography */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h3 className="text-xs font-bold text-stone-800 flex items-center gap-1.5 pl-1">
              <BookOpen className="w-4 h-4 text-blue-650" />
              <span>ประวัติย่อ / คำพูดติดปาก / ข้อความระลึกถึงเริ่มต้น</span>
            </h3>
            <textarea
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              rows={4}
              placeholder="ระบุข้อความคำบรรยายเพื่อบอกเล่าสรุปประวัติ..."
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
              disabled={isSubmitting}
            />
          </div>

          {/* Section D: Theme Selector */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h3 className="text-xs font-bold text-stone-800 flex items-center gap-1.5 pl-1">
              <Palette className="w-4 h-4 text-blue-650" />
              <span>เลือกสไตล์ของธีมเริ่มต้น (Theme Style)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {THEME_PRESETS.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition cursor-pointer select-none ${
                    selectedTheme === theme.id
                      ? 'border-blue-600 bg-blue-50/20 shadow-sm ring-1 ring-blue-500'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <span className="text-xs font-black text-stone-900">{theme.name}</span>
                  <div className="flex gap-1.5 items-center mt-2">
                    <span className="w-4 h-4 rounded-full border border-stone-300" style={{ backgroundColor: theme.primary }} />
                    <span className="w-4 h-4 rounded-full border border-stone-300" style={{ backgroundColor: theme.secondary }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-stone-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-[#0071e3] hover:bg-[#0071e3]/90 text-white font-bold text-sm transition active:scale-[0.98] disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูลและไปเลือกฟีเจอร์'}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function FillInfoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-600">
          <p className="text-sm font-semibold tracking-wider animate-pulse">กำลังโหลด...</p>
        </div>
      }
    >
      <FillInfoInner />
    </Suspense>
  );
}
