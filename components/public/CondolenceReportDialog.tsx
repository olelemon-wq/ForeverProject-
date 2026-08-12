'use client';

import React, { useEffect, useState } from 'react';
import { Flag, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CONDOLENCE_REPORT_DETAILS_MAX,
  CONDOLENCE_REPORT_REASONS,
  type CondolenceReportReason,
} from '@/lib/condolenceReport';
import { cn } from '@/lib/utils';

const fieldClass =
  'h-10 rounded-xl border-stone-200 bg-stone-50/60 px-4 py-0 text-sm text-stone-800 shadow-none focus-visible:border-stone-300 focus-visible:ring-2 focus-visible:ring-[color:var(--theme-primary)]/15';

const storageKey = (condolenceId: string) => `forever-condolence-report:${condolenceId}`;

type CondolenceReportDialogProps = {
  websiteId: string;
  condolenceId: string;
};

export default function CondolenceReportDialog({
  websiteId,
  condolenceId,
}: CondolenceReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<CondolenceReportReason | ''>('');
  const [details, setDetails] = useState('');
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0 });
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const refreshCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    setCaptcha({ num1, num2 });
    setCaptchaAnswer('');
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(storageKey(condolenceId))) {
      setSubmitted(true);
    }
  }, [condolenceId]);

  useEffect(() => {
    if (open) {
      refreshCaptcha();
      setError('');
      setReason('');
      setDetails('');
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!reason) {
      setError('กรุณาเลือกสาเหตุการแจ้ง');
      return;
    }

    if (parseInt(captchaAnswer, 10) !== captcha.num1 + captcha.num2) {
      setError('คำตอบยืนยันตัวตนไม่ถูกต้อง');
      refreshCaptcha();
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/condolence/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId,
          condolenceId,
          reason,
          details: details.trim() || undefined,
          captchaNum1: captcha.num1,
          captchaNum2: captcha.num2,
          captchaAnswer: parseInt(captchaAnswer, 10),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem(storageKey(condolenceId), '1');
      setSubmitted(true);
      setOpen(false);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการส่งรายงาน');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => !submitted && setOpen(true)}
        disabled={submitted}
        className={cn(
          'mt-2 inline-flex items-center gap-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--theme-primary)]/25 rounded-md',
          submitted ? 'cursor-default text-stone-400' : 'text-stone-400 hover:text-stone-600',
        )}
      >
        <Flag className="size-3" aria-hidden />
        {submitted ? 'ส่งรายงานแล้ว' : 'แจ้งข้อความไม่เหมาะสม'}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 overflow-hidden rounded-2xl border-stone-200 p-0 sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader className="space-y-1 border-b border-stone-100 px-5 py-4 text-left">
              <DialogTitle className="text-base font-bold text-stone-900">
                แจ้งข้อความไม่เหมาะสม
              </DialogTitle>
              <DialogDescription className="text-xs leading-relaxed text-stone-500">
                รายงานจะถูกส่งให้ผู้ดูแลตรวจสอบ ข้อความจะยังแสดงอยู่จนกว่าผู้ดูแลจะตัดสินใจ
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 px-5 py-4">
              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {error}
                </p>
              )}

              <fieldset className="space-y-2">
                <legend className="text-xs font-semibold text-stone-600">สาเหตุการแจ้ง</legend>
                <div className="space-y-1.5">
                  {CONDOLENCE_REPORT_REASONS.map((item) => (
                    <label
                      key={item.value}
                      className={cn(
                        'flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-xs transition',
                        reason === item.value
                          ? 'border-[color:var(--theme-primary)]/40 bg-[color:var(--theme-primary)]/6 text-stone-800'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300',
                      )}
                    >
                      <input
                        type="radio"
                        name="report-reason"
                        value={item.value}
                        checked={reason === item.value}
                        onChange={() => setReason(item.value)}
                        className="size-3.5 accent-[color:var(--theme-primary,#0d9488)]"
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="space-y-1.5">
                <Label htmlFor="report-details" className="text-xs font-semibold text-stone-600">
                  รายละเอียดเพิ่มเติม <span className="font-normal text-stone-400">(ไม่บังคับ)</span>
                </Label>
                <Textarea
                  id="report-details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value.slice(0, CONDOLENCE_REPORT_DETAILS_MAX))}
                  placeholder="อธิบายเพิ่มเติมสั้น ๆ..."
                  rows={2}
                  className="resize-none rounded-xl border-stone-200 bg-stone-50/60 text-sm"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-stone-600">ยืนยันตัวตน</Label>
                <div className="flex items-center gap-2">
                  <span className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-bold tabular-nums text-stone-700">
                    {captcha.num1} + {captcha.num2} = ?
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={refreshCaptcha}
                    className="size-9 rounded-xl text-stone-400"
                    title="เปลี่ยนโจทย์"
                  >
                    <RotateCw className="size-4" />
                  </Button>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    placeholder="คำตอบ"
                    className={cn(fieldClass, 'max-w-[6.5rem]')}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mx-0 mb-0 flex-row justify-end gap-2 border-t border-stone-100 bg-stone-50/50 px-5 py-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="h-9 shrink-0 rounded-xl border-stone-200 px-4"
                disabled={isLoading}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                className="h-9 shrink-0 rounded-xl px-4 font-bold text-white hover:brightness-105"
                style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
                disabled={isLoading}
              >
                {isLoading ? 'กำลังส่ง...' : 'ส่งรายงาน'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
