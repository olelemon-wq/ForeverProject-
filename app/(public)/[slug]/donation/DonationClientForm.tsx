'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getFeatureLabel } from '@/lib/categories';
import { getDonationFormCopy } from '@/lib/donationFormCopy';
import { buildPromptPayQrImageUrl } from '@/lib/promptpayPayload';
import {
  AlertCircle,
  Check,
  Heart,
  PawPrint,
  UserRound,
} from 'lucide-react';
import CategoryOrnament from '@/components/public/CategoryOrnament';
import DonationPageShell from '@/components/public/DonationPageShell';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Donation {
  id: string;
  donorName: string;
  amount: number;
  message: string | null;
  isAnonymous: boolean;
  hideAmount: boolean;
  createdAt: string;
}

export default function DonationClientForm({
  websiteId,
  donationPromptPay,
  donationAccountName,
  category,
}: {
  websiteId: string;
  donationPromptPay: string;
  donationAccountName: string;
  category?: string;
}) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [hideAmount, setHideAmount] = useState(false);
  const [slipFile, setSlipFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const copy = getDonationFormCopy(category);
  const { label: featureLabel, pageDescription: featureDescription } = getFeatureLabel(
    category || 'Memorial',
    'donation',
  );
  const isPet = category === 'Pet Memorial';
  const FormIcon = isPet ? PawPrint : Heart;

  const parsedAmount = parseFloat(amount);
  const qrImageUrl = useMemo(
    () =>
      buildPromptPayQrImageUrl(
        donationPromptPay,
        Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : undefined,
      ),
    [donationPromptPay, parsedAmount],
  );

  useEffect(() => {
    async function loadDonations() {
      try {
        const res = await fetch(`/api/donation/list?websiteId=${websiteId}`);
        const data = await res.json();
        if (res.ok) {
          setDonations(data.donations || []);
        }
      } catch (err) {
        console.error('Error fetching donations list:', err);
      } finally {
        setListLoading(false);
      }
    }
    loadDonations();
  }, [websiteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!donorName && !isAnonymous) {
      setError(copy.errorNameRequired);
      setLoading(false);
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError(copy.errorAmountRequired);
      setLoading(false);
      return;
    }

    try {
      let slipUrl = '';
      if (slipFile) {
        const quotaRes = await fetch('/api/media/upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            websiteId,
            fileName: slipFile.name,
            fileType: slipFile.type,
            fileSize: slipFile.size,
          }),
        });
        const quotaData = await quotaRes.json();
        if (!quotaRes.ok) throw new Error(quotaData.error);

        if (quotaData.uploadUrl) {
          await fetch(quotaData.uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': slipFile.type },
            body: slipFile,
          });
        }

        slipUrl = quotaData.filePath;
      }

      const res = await fetch('/api/donation/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId,
          donorName: isAnonymous ? 'ผู้ไม่ประสงค์ออกนาม' : donorName,
          amount,
          message,
          isAnonymous,
          hideAmount,
          slipUrl: slipUrl || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(copy.successMessage);

      const listRes = await fetch(`/api/donation/list?websiteId=${websiteId}`);
      const listData = await listRes.json();
      if (listRes.ok) {
        setDonations(listData.donations || []);
      }

      setDonorName('');
      setAmount('');
      setMessage('');
      setIsAnonymous(false);
      setHideAmount(false);
      setSlipFile(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'เกิดข้อผิดพลาดในการตรวจสอบสลิป กรุณาลองใหม่อีกครั้ง';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DonationPageShell category={category || 'Memorial'} className="text-left">
      <header className="mx-auto mb-8 max-w-xl space-y-3 text-center">
        <h2
          className="text-2xl font-black tracking-tight text-stone-900 sm:text-[1.65rem]"
          style={{ color: 'var(--theme-primary, #0d9488)' }}
        >
          {featureLabel}
        </h2>
        <p className="text-sm leading-relaxed text-stone-500">{featureDescription}</p>
        <div className="flex items-center justify-center gap-4 pt-2 select-none">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-stone-200" />
          <CategoryOrnament category={category || 'Memorial'} count={1} />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-stone-200" />
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-10 lg:items-start">
        <aside className="lg:sticky lg:top-6">
          <div className="mx-auto max-w-xs space-y-4 rounded-2xl border border-stone-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-[2px]">
            <p className="text-center text-xs font-bold tracking-[0.14em] text-stone-400">
              พร้อมเพย์
            </p>

            <div className="mx-auto w-fit rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
              {qrImageUrl ? (
                <img
                  src={qrImageUrl}
                  alt={`QR Code พร้อมเพย์ ${donationPromptPay}`}
                  width={200}
                  height={200}
                  className="h-[200px] w-[200px] object-contain"
                />
              ) : (
                <div className="flex h-[200px] w-[200px] items-center justify-center text-xs text-stone-400">
                  ไม่สามารถสร้าง QR ได้
                </div>
              )}
            </div>

            <div className="space-y-3 text-center">
              <div>
                <p className="text-xs font-semibold text-stone-400">
                  {category === 'Couple' ? 'ชื่อเป้าหมาย' : 'ชื่อบัญชีรับเงิน'}
                </p>
                <p className="mt-0.5 text-sm font-bold text-stone-900">{donationAccountName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-400">หมายเลขพร้อมเพย์</p>
                <p className="mt-0.5 text-sm font-bold tabular-nums text-stone-800">
                  {donationPromptPay}
                </p>
              </div>
              {parsedAmount > 0 && (
                <p
                  className="inline-flex rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    color: 'var(--theme-primary, #0d9488)',
                    backgroundColor: 'color-mix(in srgb, var(--theme-primary, #0d9488) 10%, white)',
                  }}
                >
                  ยอดใน QR: {parsedAmount.toLocaleString('th-TH')} บาท
                </p>
              )}
            </div>

            <p className="text-center text-xs leading-relaxed text-stone-400">
              สแกน QR แล้วโอนเงิน จากนั้นกรอกแบบฟอร์มด้านล่างเพื่อแนบสลิปยืนยัน
            </p>
          </div>
        </aside>

        <div className="min-w-0 space-y-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-2">
              <FormIcon
                className="h-4 w-4 shrink-0"
                style={{ color: 'var(--theme-primary, #0d9488)' }}
                aria-hidden
              />
              <h3 className="text-base font-bold text-stone-900">{copy.formTitle}</h3>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                <span>{success}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="donor-name">{copy.donorNameLabel}</Label>
                <Input
                  id="donor-name"
                  type="text"
                  disabled={isAnonymous}
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder={copy.donorNamePlaceholder}
                  className="min-h-10 rounded-xl bg-stone-50/80"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="donation-amount">{copy.amountLabel}</Label>
                <Input
                  id="donation-amount"
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="เช่น 100"
                  className="min-h-10 rounded-xl bg-stone-50/80 tabular-nums"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="donation-message">{copy.messageLabel}</Label>
              <Input
                id="donation-message"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={copy.messagePlaceholder}
                className="min-h-10 rounded-xl bg-stone-50/80"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="donation-slip">แนบภาพสลิปโอนเงิน (PDF / รูปภาพ)</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  id="donation-slip"
                  type="file"
                  accept="image/*,application/pdf"
                  required
                  onChange={(e) => setSlipFile(e.target.files ? e.target.files[0] : null)}
                  className="min-h-10 rounded-xl bg-stone-50/80 file:mr-3 file:rounded-lg file:border-0 file:bg-stone-200 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-stone-700"
                />
                {slipFile && (
                  <span className="text-xs font-medium text-stone-500">{slipFile.name}</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-5 pt-1">
              <label className="flex cursor-pointer items-center gap-2.5">
                <Checkbox
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                />
                <span className="text-sm font-medium text-stone-700">ไม่ประสงค์ออกนาม</span>
              </label>

              <label className="flex cursor-pointer items-center gap-2.5">
                <Checkbox
                  checked={hideAmount}
                  onCheckedChange={(checked) => setHideAmount(checked === true)}
                />
                <span className="text-sm font-medium text-stone-700">ไม่แสดงยอดเงิน</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="min-h-11 w-full rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
            >
              <FormIcon className="h-4 w-4" aria-hidden />
              {loading ? copy.submitLoading : copy.submitButton}
            </Button>
          </form>

          <section className="space-y-5">
            <div className="space-y-1">
              <h3 className="flex items-center gap-2 text-base font-bold text-stone-900">
                <UserRound
                  className="h-4 w-4"
                  style={{ color: 'var(--theme-primary, #0d9488)' }}
                  aria-hidden
                />
                {copy.wallTitle}
              </h3>
              <p className="text-sm text-stone-500">{copy.wallDescription}</p>
            </div>

            {listLoading ? (
              <p className="py-6 text-center text-sm text-stone-400">กำลังโหลดรายนาม...</p>
            ) : donations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 px-6 py-10 text-center text-sm text-stone-500">
                {copy.wallEmpty}
              </div>
            ) : (
              <ul className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                {donations.map((don) => (
                  <li
                    key={don.id}
                    className="flex items-start justify-between gap-4 rounded-2xl bg-white/70 px-4 py-3.5"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-stone-900">
                          {don.isAnonymous ? 'ผู้ไม่ประสงค์ออกนาม' : don.donorName}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-bold"
                          style={{
                            backgroundColor:
                              'color-mix(in srgb, var(--theme-primary, #0d9488) 10%, white)',
                            borderColor:
                              'color-mix(in srgb, var(--theme-primary, #0d9488) 24%, white)',
                            color: 'var(--theme-primary, #0d9488)',
                          }}
                        >
                          <Check className="h-3 w-3" aria-hidden />
                          ตรวจสอบแล้ว
                        </span>
                      </div>
                      {don.message && (
                        <p className="text-sm leading-relaxed text-stone-600">
                          &ldquo;{don.message}&rdquo;
                        </p>
                      )}
                      <p className="text-xs font-medium text-stone-400">
                        {new Date(don.createdAt).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <p
                      className="shrink-0 text-sm font-black tabular-nums"
                      style={{ color: 'var(--theme-primary, #0d9488)' }}
                    >
                      {don.hideAmount ? '*** บาท' : `${don.amount.toLocaleString('th-TH')} บาท`}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </DonationPageShell>
  );
}
