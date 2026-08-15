'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle2, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildPromptPayQrImageUrl } from '@/lib/promptpayPayload';

function PaymentPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const siteId = searchParams.get('site');

  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [siteDetails, setSiteDetails] = useState<any>(null);
  const [paymentRef, setPaymentRef] = useState('');

  useEffect(() => {
    if (!siteId) {
      setError('ไม่พบข้อมูลรหัสเว็บไซต์สำหรับการชำระเงิน');
      setIsLoading(false);
      return;
    }

    const fetchPaymentDetails = async () => {
      try {
        const res = await fetch('/api/tenant/list-mine');
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        const matched = (data.websites || []).find((w: any) => w.id === siteId);
        if (!matched) {
          throw new Error('ไม่พบข้อมูลเว็บไซต์ที่รอชำระเงินในบัญชีของคุณ');
        }

        if (matched.status === 'ACTIVE') {
          if (typeof matched.slug === 'string' && matched.slug.startsWith('draft-')) {
            router.push(`/manage/create?step=url&site=${siteId}`);
            return;
          }
          router.push(matched.slug ? `/manage?site=${matched.slug}` : '/manage');
          return;
        }

        setSiteDetails(matched);

        // Fetch invoice/payment reference
        const invoiceRes = await fetch(`/api/payment/invoice?websiteId=${siteId}&json=true`);
        const invoiceData = await invoiceRes.json();
        if (invoiceRes.ok && invoiceData.payment) {
          setPaymentRef(invoiceData.payment.refId);
        } else {
          // fallback ref
          setPaymentRef(`QR-draft-${siteId.substring(0, 8)}`);
        }
      } catch (err: any) {
        setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลคำสั่งซื้อ');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [siteId, router]);

  const handleSimulatePayment = async () => {
    if (!paymentRef) return;
    setIsVerifying(true);
    setError('');

    try {
      const res = await fetch('/api/payment/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refId: paymentRef,
          status: 'SUCCESS',
          amount: 2000.00,
          signature: 'MOCK_SIGNATURE_OK_2026',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // After pay: set permanent URL next (theme/data live in /manage)
      const needsUrl =
        typeof siteDetails?.slug === 'string' && siteDetails.slug.startsWith('draft-');
      router.push(
        needsUrl
          ? `/manage/create?step=url&site=${siteId}`
          : `/manage?site=${encodeURIComponent(siteDetails?.slug || '')}`
      );
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการจำลองการชำระเงิน');
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center text-stone-600">
        <RotateCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-medium tracking-wide">กำลังเตรียมช่องทางการชำระเงิน...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-850 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl border border-stone-200 bg-white shadow-xl space-y-8 animate-fade-in text-center">
        <header className="space-y-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0071e3]/10 px-3.5 py-1 text-xs font-semibold text-[#0071e3]">
            PromptPay
          </span>
          <h1 className="pt-2 text-2xl font-semibold tracking-tight text-[#1D1D1F]">เหลือแค่สแกน QR</h1>
          <p className="mx-auto max-w-xs text-sm font-medium leading-relaxed text-[#6E6E73]">
            เปิดเว็บได้ทั้งปี พื้นที่ 1 GB
          </p>
        </header>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center justify-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {siteDetails && (
          <div className="space-y-6">
            {/* Order Card summary */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-150 text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-stone-500 font-medium">ประเภทเว็บไซต์:</span>
                <span className="text-stone-900 font-bold">{siteDetails.category}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500 font-medium">ชื่อชั่วคราว:</span>
                <span className="text-stone-800 font-mono text-xs truncate max-w-[200px]">{siteDetails.name}</span>
              </div>
              <div className="border-t border-stone-200/60 my-2 pt-2 flex justify-between items-baseline">
                <span className="text-sm font-medium text-[#6E6E73]">ยอดชำระ</span>
                <span className="text-2xl font-semibold tracking-tight text-[#0071e3]">
                  ฿1,800 <span className="text-sm font-medium text-[#86868B]">/ ปี</span>
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-stone-200/40">
                <span className="text-xs text-stone-400 font-bold uppercase">รหัสอ้างอิง:</span>
                <span className="text-xs text-stone-600 font-mono">{paymentRef || 'Generating...'}</span>
              </div>
            </div>

            {/* PromptPay QR Section */}
            <div className="relative flex flex-col items-center justify-center rounded-3xl border border-stone-200 bg-[#FAF8F5] p-6 shadow-inner">
              <div className="relative w-48 overflow-hidden rounded-2xl border border-stone-200 bg-white p-3 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    buildPromptPayQrImageUrl('0812345678', 2000) ||
                    'https://api.qrserver.com/v1/create-qr-code/?size=240x240&ecc=M&data=FOREVER-MOCK-PROMPTPAY'
                  }
                  alt="PromptPay QR จำลอง"
                  width={192}
                  height={192}
                  className="aspect-square w-full object-contain"
                />
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-stone-900/85 px-2.5 py-0.5 text-xs font-medium tracking-wide text-white">
                  จำลอง
                </span>
              </div>
              <span className="mt-4 flex select-none items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
                รอการชำระเงิน (PENDING)
              </span>
              <p className="mt-2 text-xs font-medium text-[#86868B]">
                QR ทดสอบ สแกนแล้วไม่ตัดเงินจริง
              </p>
            </div>

            {/* Action simulation trigger */}
            <div className="space-y-3 pt-4">
              <Button variant="ghost"
                type="button"
                onClick={handleSimulatePayment}
                disabled={isVerifying}
                className="h-auto w-full py-4 rounded-2xl bg-[#0071e3] hover:bg-[#0071e3]/90 text-white font-bold text-sm transition active:scale-[0.98] disabled:opacity-60 shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>กำลังตรวจให้นิดนึง...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ชำระแล้ว ไปต่อเลย</span>
                  </>
                )}
              </Button>
              <p className="text-xs text-stone-400">
                หลังชำระแล้ว จะไปตั้งชื่อลิงก์ แล้วเข้าหน้าจัดการเว็บ
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-600">
          <p className="text-sm font-semibold tracking-wider animate-pulse">กำลังโหลด...</p>
        </div>
      }
    >
      <PaymentPageInner />
    </Suspense>
  );
}
