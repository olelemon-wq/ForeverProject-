'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, AlertCircle, CheckCircle2, QrCode, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

      router.push(
        `/manage/setup-features?site=${siteId}&category=${encodeURIComponent(siteDetails?.category || '')}`
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
          <span className="text-[10px] uppercase font-black text-blue-850 tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 inline-flex items-center gap-1">
            <CreditCard className="w-3 h-3 text-blue-600" /> THAI PROMPTPAY
          </span>
          <h1 className="text-2xl font-black text-stone-900 pt-2">ชำระค่าบริการสร้างเว็บไซต์</h1>
          <p className="text-stone-500 text-xs leading-relaxed max-w-xs mx-auto">
            สแกนเพื่อเปิดใช้งานเว็บไซต์ความทรงจำของคุณเป็นระยะเวลา 1 ปี (ความจุ 1 GB)
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
                <span className="text-stone-800 font-mono text-[11px] truncate max-w-[200px]">{siteDetails.name}</span>
              </div>
              <div className="border-t border-stone-200/60 my-2 pt-2 flex justify-between items-baseline">
                <span className="text-xs text-stone-500 font-bold">ยอดที่ต้องชำระ:</span>
                <span className="text-2xl font-black text-[#0071e3]">฿2,000 <span className="text-[10px] font-normal text-stone-400">/ ปี</span></span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-stone-200/40">
                <span className="text-[10px] text-stone-400 font-bold uppercase">รหัสอ้างอิง:</span>
                <span className="text-[11px] text-stone-600 font-mono">{paymentRef || 'Generating...'}</span>
              </div>
            </div>

            {/* PromptPay QR Section */}
            <div className="flex flex-col items-center justify-center p-6 border border-stone-200 rounded-3xl bg-[#FAF8F5] relative shadow-inner">
              {/* Dynamic QR Code Mock representation */}
              <div className="w-48 h-48 bg-white border-4 border-stone-900 rounded-2xl flex items-center justify-center p-2 relative shadow-md">
                <QrCode className="w-full h-full text-stone-900 stroke-[1.2]" />
                <div className="absolute inset-0 flex items-center justify-center bg-white/5 opacity-0 hover:opacity-100 transition-opacity">
                  <span className="px-2.5 py-1 bg-stone-900 text-white rounded-lg text-[9px] font-black tracking-widest uppercase">PROMPTPAY</span>
                </div>
              </div>
              <span className="mt-4 px-3 py-1 bg-amber-50 border border-amber-200 text-[10px] text-amber-800 font-black rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1 select-none">
                ● รอการชำระเงิน (PENDING)
              </span>
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
                    <span>กำลังตรวจสอบยอดเงิน...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>จำลองการจ่ายเงินผ่านแอปธนาคาร</span>
                  </>
                )}
              </Button>
              <p className="text-[10px] text-stone-400">
                * หลังชำระเงินสำเร็จ ระบบจะพาไปเลือกฟีเจอร์เริ่มต้น แล้วเข้าหน้าจัดการเว็บไซต์
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
