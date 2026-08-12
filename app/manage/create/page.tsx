'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  Check,
  Flame,
  GitBranch,
  Heart,
  Sparkles,
  Users,
  PawPrint,
  ArrowLeft,
  QrCode,
  RotateCw,
  type LucideIcon,
} from 'lucide-react';
import { MARKETING_CATEGORIES } from '@/lib/marketingCategories';
import { buildPromptPayQrImageUrl } from '@/lib/promptpayPayload';

const CATEGORY_OPTIONS: {
  key: string;
  thaiLabel: string;
  subLabel: string;
  desc: string;
  icon: LucideIcon;
  image: string;
}[] = [
  {
    key: 'Memorial',
    thaiLabel: 'Memorial',
    subLabel: 'รำลึกบุคคลทั่วไป',
    desc: 'พื้นที่ส่งต่อความรักและความระลึกถึงผู้ล่วงลับ รวบรวมคำไว้อาลัยและภาพความอบอุ่น',
    icon: Flame,
    image: '',
  },
  {
    key: 'Family Legacy',
    thaiLabel: 'Family Legacy',
    subLabel: 'เรื่องราวครอบครัว',
    desc: 'หอเกียรติยศบันทึกประวัติศาสตร์ บันทึกความเป็นมา และผังเครือญาติสืบต่อวงศ์ตระกูล',
    icon: GitBranch,
    image: '',
  },
  {
    key: 'Couple',
    thaiLabel: 'Couple',
    subLabel: 'ความรักคู่รัก',
    desc: 'บันทึกการเดินทางของความรัก ไทม์ไลน์ภาพถ่ายและวิดีโอแห่งความประทับใจคู่ชีวิต',
    icon: Heart,
    image: '',
  },
  {
    key: 'Wedding',
    thaiLabel: 'Wedding',
    subLabel: 'ความทรงจำแต่งงาน',
    desc: 'กำหนดการงานมงคลสมรส สมุดลงนามแสดงความยินดีดิจิทัล และฟีดภาพวันสำคัญ',
    icon: Sparkles,
    image: '',
  },
  {
    key: 'Friends',
    thaiLabel: 'Friends',
    subLabel: 'กลุ่มรุ่น',
    desc: 'พื้นที่รวบรวมเรื่องราวความผูกพัน มิตรภาพที่ไม่มีวันจางหาย และความทรงจำร่วมกับแก๊ง',
    icon: Users,
    image: '',
  },
  {
    key: 'Pet Memorial',
    thaiLabel: 'Pet',
    subLabel: 'พื้นที่ของน้อง',
    desc: 'เก็บภาพและเรื่องราวของน้อง ทั้งวันที่อยู่ด้วยกันและในความทรงจำ',
    icon: PawPrint,
    image: '',
  },
].map((opt) => ({
  ...opt,
  image:
    MARKETING_CATEGORIES.find((c) => c.createCategory === opt.key)?.image ||
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
}));

type WizardStep = 1 | 2 | 3;

function formatPhoneDisplay(phone: string) {
  if (phone.length !== 10) return phone;
  return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
}

export default function WebsiteCreationWizardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7] text-[#6E6E73]">
          <p className="animate-pulse text-sm font-medium tracking-wide">กำลังโหลด...</p>
        </div>
      }
    >
      <WebsiteCreationWizard />
    </Suspense>
  );
}

function WebsiteCreationWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userPhone, setUserPhone] = useState('');
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);
  const [category, setCategory] = useState('Memorial');

  const [slug, setSlug] = useState('');
  const [slugValid, setSlugValid] = useState<boolean | null>(null);
  const [slugChecking, setSlugChecking] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [paymentRef, setPaymentRef] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(2000);
  const [createdTenantId, setCreatedTenantId] = useState('');

  // Resume from query: ?step=url&site=...
  useEffect(() => {
    const step = searchParams.get('step');
    const site = searchParams.get('site');
    const cat = searchParams.get('category');

    if (cat && CATEGORY_OPTIONS.some((c) => c.key === cat)) {
      setCategory(cat);
    }

    if (step === 'url' && site) {
      setCreatedTenantId(site);
      setWizardStep(3);
    } else if (step === 'payment' && site) {
      setCreatedTenantId(site);
      setWizardStep(2);
    }
  }, [searchParams]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          setUserPhone(data.phone || '');
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      const cat = searchParams.get('category');
      const next = cat
        ? `/manage/create?category=${encodeURIComponent(cat)}`
        : '/manage/create';
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [isAuthenticated, router, searchParams]);

  // Load payment ref when resuming payment / URL step with site id
  useEffect(() => {
    if (!createdTenantId || wizardStep !== 2 || paymentRef) return;

    async function loadPayment() {
      try {
        const invoiceRes = await fetch(
          `/api/payment/invoice?websiteId=${createdTenantId}&json=true`
        );
        const invoiceData = await invoiceRes.json();
        if (invoiceRes.ok && invoiceData.payment) {
          setPaymentRef(invoiceData.payment.refId);
          setPaymentAmount(invoiceData.payment.amount || 2000);
        }
      } catch {
        /* ignore — simulate button still needs ref */
      }
    }
    loadPayment();
  }, [createdTenantId, wizardStep, paymentRef]);

  const createDraftAndPay = async (selectedCategory: string) => {
    setError('');
    setIsLoading(true);
    setCategory(selectedCategory);
    try {
      const res = await fetch('/api/tenant/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: selectedCategory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCreatedTenantId(data.id);
      setPaymentRef(data.payment.refId);
      setPaymentAmount(data.payment.amount);
      setWizardStep(2);
      router.replace(`/manage/create?step=payment&site=${data.id}`);
    } catch (err: any) {
      setError(err.message || 'สร้างร่างเว็บไซต์ไม่สำเร็จ');
    } finally {
      setIsLoading(false);
    }
  };

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
      if (!res.ok) throw new Error(data.error);
      setSlugValid(true);
    } catch (err: any) {
      setError(err.message);
      setSlugValid(false);
    } finally {
      setSlugChecking(false);
    }
  };

  const handleSimulatePaymentSuccess = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/payment/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refId: paymentRef,
          status: 'SUCCESS',
          amount: paymentAmount,
          signature: 'MOCK_SIGNATURE_OK_2026',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setWizardStep(3);
      router.replace(`/manage/create?step=url&site=${createdTenantId}`);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการตรวจสอบยอดเงิน');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSlug = async () => {
    if (!slugValid || !createdTenantId) {
      setError('กรุณาตรวจสอบชื่อลิงก์ URL ให้ผ่านก่อน');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/tenant/update-slug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteId: createdTenantId, slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push(`/manage?site=${encodeURIComponent(slug.trim().toLowerCase())}`);
    } catch (err: any) {
      setError(err.message || 'ตั้งชื่อลิงก์ไม่สำเร็จ');
      setIsLoading(false);
    }
  };

  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7] text-[#6E6E73]">
        <RotateCw className="mr-2 size-5 animate-spin text-[#0071e3]" />
        <p className="text-sm font-medium">กำลังเตรียมระบบ...</p>
      </div>
    );
  }

  const steps = [
    { n: 1 as const, label: 'เลือกหมวดหมู่' },
    { n: 2 as const, label: 'ชำระเงิน' },
    { n: 3 as const, label: 'ชื่อลิงก์ URL' },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#F5F5F7] px-4 py-8 text-[#1D1D1F] md:py-12">
      <div className="mb-6 w-full max-w-3xl md:mb-8">
        <Link
          href="/manage"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#86868B] transition-colors hover:text-[#1D1D1F]"
        >
          <ArrowLeft className="size-4" />
          กลับไปแผงควบคุม
        </Link>
      </div>

      <div className="mb-8 flex w-full max-w-3xl select-none items-center justify-between text-xs text-[#86868B] md:mb-10 md:text-sm">
        {steps.map((step, idx) => (
          <React.Fragment key={step.n}>
            <div
              className={`flex flex-col items-center gap-1.5 ${
                wizardStep >= step.n ? 'font-semibold text-[#0071e3]' : ''
              }`}
            >
              <span
                className={`flex size-7 items-center justify-center rounded-full text-xs transition md:size-8 md:text-sm ${
                  wizardStep >= step.n
                    ? 'bg-[#0071e3] text-white'
                    : 'bg-white text-[#86868B] shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                }`}
              >
                {wizardStep > step.n ? (
                  <Check className="size-3.5" strokeWidth={2.5} />
                ) : (
                  step.n
                )}
              </span>
              <span className="max-w-16 text-center text-xs leading-tight sm:max-w-none sm:text-sm">
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`mx-1.5 h-px flex-1 transition md:mx-2 ${
                  wizardStep > step.n ? 'bg-[#0071e3]/50' : 'bg-[#d2d2d7]'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="w-full max-w-3xl space-y-6 overflow-visible rounded-[22px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.08)] md:rounded-[28px] md:p-8">
        {error && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
            <AlertCircle className="size-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Category — click advances */}
        {wizardStep === 1 && (
          <div className="animate-fade-in space-y-6">
            <header className="space-y-2 text-center">
              <p className="text-sm font-medium text-[#86868B]">
                {userPhone
                  ? `เข้าสู่ระบบด้วย ${formatPhoneDisplay(userPhone)}`
                  : 'สร้างเว็บเพิ่ม'}
              </p>
              <h2 className="text-2xl font-semibold leading-tight tracking-tight text-[#1D1D1F] sm:text-3xl">
                สร้างเว็บไซต์ใหม่
              </h2>
              <p className="mx-auto max-w-xl text-sm font-medium leading-relaxed text-[#86868B] sm:text-base md:text-lg">
                กดเลือกหมวดด้านล่าง — ระบบจะพาไปชำระเงินทันที
              </p>
            </header>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {CATEGORY_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const busy = isLoading && category === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    disabled={isLoading}
                    onClick={() => createDraftAndPay(opt.key)}
                    className="group rounded-2xl border border-[#E8E8ED] bg-white p-3.5 text-left transition hover:border-[#0071e3]/40 hover:bg-[#F5F5F7] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] disabled:cursor-wait disabled:opacity-70 sm:p-4"
                  >
                    {/* Mobile: image left + text right */}
                    <div className="flex items-start gap-3.5 sm:hidden">
                      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-[#F5F5F7] ring-1 ring-[#E8E8ED]">
                        <img
                          src={opt.image}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                        {busy && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                            <RotateCw className="size-5 animate-spin text-[#0071e3]" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="text-sm font-semibold leading-snug text-[#1D1D1F]">
                          {opt.subLabel}
                        </p>
                        <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-[#6E6E73]">
                          {opt.desc}
                        </p>
                      </div>
                    </div>

                    {/* Desktop: icon + text, then image below */}
                    <div className="hidden sm:block">
                      <div className="mb-3 flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F5F5F7] text-[#6E6E73] transition group-hover:bg-[#0071e3]/10 group-hover:text-[#0071e3]">
                          {busy ? (
                            <RotateCw className="size-5 animate-spin text-[#0071e3]" />
                          ) : (
                            <Icon className="size-5" strokeWidth={1.75} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium uppercase tracking-wide text-[#86868B]">
                            {opt.thaiLabel}
                          </p>
                          <p className="mt-0.5 text-base font-semibold text-[#1D1D1F]">
                            {opt.subLabel}
                          </p>
                          <p className="mt-1.5 text-sm leading-relaxed text-[#6E6E73]">
                            {opt.desc}
                          </p>
                        </div>
                      </div>
                      <div className="overflow-hidden rounded-xl bg-[#F5F5F7] ring-1 ring-[#E8E8ED]">
                        <img
                          src={opt.image}
                          alt=""
                          className="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] md:h-32"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Payment */}
        {wizardStep === 2 && (
          <div className="animate-fade-in mx-auto max-w-md space-y-6 text-center">
            <header className="space-y-2">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#F5F5F7] ring-1 ring-[#E8E8ED]">
                <QrCode className="size-6 text-[#0071e3]" strokeWidth={1.75} />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">ชำระค่าบริการ</h2>
              <p className="text-sm leading-relaxed text-[#6E6E73]">
                สแกน PromptPay เพื่อเปิดใช้งานเว็บไซต์ 1 ปี
                <br />
                พื้นที่จัดเก็บ 1 GB · ฿{paymentAmount.toLocaleString('th-TH')}
              </p>
            </header>

            <div className="rounded-2xl border border-[#E8E8ED] bg-[#FBFBFD] p-6">
              <div className="relative mx-auto w-48 overflow-hidden rounded-xl border border-[#E8E8ED] bg-white p-3 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    buildPromptPayQrImageUrl(
                      userPhone || '0812345678',
                      paymentAmount
                    ) ||
                    'https://api.qrserver.com/v1/create-qr-code/?size=240x240&ecc=M&data=FOREVER-MOCK-PROMPTPAY'
                  }
                  alt="PromptPay QR จำลอง"
                  width={192}
                  height={192}
                  className="aspect-square w-full object-contain"
                />
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[#1D1D1F]/85 px-2.5 py-0.5 text-xs font-medium tracking-wide text-white">
                  จำลอง
                </span>
              </div>
              <p className="mt-3 text-xs text-[#86868B]">
                QR นี้ใช้สำหรับทดสอบเท่านั้น — สแกนแล้วไม่ตัดเงินจริง
              </p>
              <p className="mt-2 font-mono text-xs text-[#6E6E73]">
                รหัสอ้างอิง: {paymentRef || 'กำลังโหลด...'}
              </p>
            </div>

            <button
              type="button"
              disabled={isLoading || !paymentRef}
              onClick={handleSimulatePaymentSuccess}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0071e3] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(0,113,227,0.28)] transition hover:bg-[#0077ED] disabled:opacity-60"
            >
              {isLoading && <RotateCw className="size-4 animate-spin" />}
              {isLoading ? 'กำลังตรวจเช็กยอดเงิน...' : 'จำลองการชำระเงินสำเร็จ'}
            </button>
          </div>
        )}

        {/* STEP 3: URL */}
        {wizardStep === 3 && (
          <div className="animate-fade-in mx-auto max-w-lg space-y-6">
            <header className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold tracking-tight">ตั้งชื่อลิงก์ URL</h2>
              <p className="text-sm leading-relaxed text-[#6E6E73]">
                เลือกชื่อที่ไม่ซ้ำ — จะเป็นที่อยู่ถาวรของเว็บไซต์คุณ
              </p>
            </header>

            <div className="space-y-3">
              <label htmlFor="slug" className="block text-sm font-medium text-[#6E6E73]">
                forever.co.th/
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                    setSlugValid(null);
                  }}
                  placeholder="เช่น somsak-family"
                  className="w-full rounded-2xl border border-[#E8E8ED] bg-[#FBFBFD] px-4 py-3.5 font-mono text-base text-[#1D1D1F] placeholder:text-[#86868B] transition focus:border-[#0071e3] focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[#0071e3]/15"
                />
                <button
                  type="button"
                  onClick={checkSlug}
                  disabled={slugChecking || slug.length < 3}
                  className="shrink-0 rounded-full border border-[#E8E8ED] bg-white px-5 py-3 text-sm font-medium text-[#1D1D1F] transition hover:bg-[#F5F5F7] disabled:opacity-50"
                >
                  {slugChecking ? 'กำลังตรวจ...' : 'ตรวจสอบ'}
                </button>
              </div>
              {slugValid === true && (
                <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                  <Check className="size-4" />
                  ชื่อลิงก์นี้ใช้ได้
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={isLoading || slugValid !== true}
              onClick={handleConfirmSlug}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0071e3] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(0,113,227,0.28)] transition hover:bg-[#0077ED] disabled:opacity-60"
            >
              {isLoading && <RotateCw className="size-4 animate-spin" />}
              {isLoading ? 'กำลังบันทึก...' : 'เข้าสู่หน้าจัดการ'}
            </button>

            <p className="text-center text-sm text-[#86868B]">
              ปรับธีม สี และข้อมูลเนื้อหาได้ในหน้าจัดการหลังจากนี้
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
