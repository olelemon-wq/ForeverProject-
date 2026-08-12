'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Flame, PenTool, RotateCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const fieldClass =
  'h-10 rounded-xl border-stone-200 bg-stone-50/60 px-4 py-0 text-sm leading-none text-stone-800 shadow-none focus-visible:border-stone-300 focus-visible:ring-2 focus-visible:ring-[color:var(--theme-primary)]/15';

export default function CondolenceForm({
  websiteId,
  category,
  subjects,
}: {
  websiteId: string;
  category?: string;
  subjects?: any[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [customRelation, setCustomRelation] = useState('');
  const [message, setMessage] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');

  const allSubjectsAlive = subjects && subjects.length > 0 && subjects.every((s: any) => s.isAlive);
  const isHappy =
    category === 'Couple' ||
    category === 'Wedding' ||
    category === 'Friends' ||
    (category === 'Pet Memorial' && allSubjectsAlive);
  const hideRelationship = category === 'Pet Memorial';

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    setCaptchaQuestion({ num1, num2, answer: num1 + num2 });
    setUserAnswer('');
  };

  React.useEffect(() => {
    if (isOpen) {
      generateCaptcha();
    }
  }, [isOpen]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const insertEmoji = (emoji: string) => {
    const textarea = document.getElementById('condolence-message-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextText = message.substring(0, start) + emoji + message.substring(end);
    setMessage(nextText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 10);
  };

  const insertFormatting = (type: 'bold' | 'italic') => {
    const textarea = document.getElementById('condolence-message-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = message.substring(start, end);
    let wrapped = selected;
    if (type === 'bold') wrapped = `**${selected || 'ข้อความตัวหนา'}**`;
    if (type === 'italic') wrapped = `*${selected || 'ข้อความตัวเอียง'}*`;

    const nextText = message.substring(0, start) + wrapped + message.substring(end);
    setMessage(nextText);
    setTimeout(() => {
      textarea.focus();
      const offset = type === 'bold' ? 2 : 1;
      const textToSelect = selected || (type === 'bold' ? 'ข้อความตัวหนา' : 'ข้อความตัวเอียง');
      textarea.setSelectionRange(start + offset, start + offset + textToSelect.length);
    }, 10);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!senderName.trim()) {
      setError(isHappy ? 'กรุณากรอกชื่อผู้เขียนข้อความ' : 'กรุณากรอกชื่อผู้ส่งคำไว้อาลัย');
      return;
    }
    if (!message.trim()) {
      setError(isHappy ? 'กรุณากรอกข้อความของท่าน' : 'กรุณากรอกข้อความไว้อาลัย');
      return;
    }

    if (parseInt(userAnswer, 10) !== captchaQuestion.answer) {
      setError('รหัสผ่านความปลอดภัย (Captcha) ไม่ถูกต้อง กรุณาลองอีกครั้ง');
      generateCaptcha();
      return;
    }

    const finalRelationship = hideRelationship
      ? '—'
      : relationship === 'Other'
        ? customRelation.trim()
        : relationship;
    if (!hideRelationship && !finalRelationship) {
      setError('กรุณากรอกความสัมพันธ์ของท่าน');
      return;
    }

    const isFamilyType = !hideRelationship && (relationship === 'Family' || relationship === 'Relative');
    const condolenceType = isFamilyType ? 'FAMILY' : 'GENERAL';

    setIsLoading(true);

    try {
      const res = await fetch('/api/condolence/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId,
          senderName,
          relationship: finalRelationship,
          message,
          type: condolenceType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(
        isHappy
          ? 'ส่งข้อความของคุณเรียบร้อยแล้ว และจะปรากฏเมื่อผู้ดูแลระบบกดอนุมัติค่ะ'
          : 'คำไว้อาลัยส่งเข้าระบบเรียบร้อยแล้ว และจะปรากฏเมื่อผู้ดูแลระบบกดอนุมัติ',
      );
      setSenderName('');
      setMessage('');
      setRelationship('Friend');
      setCustomRelation('');
      setTimeout(() => {
        setIsOpen(false);
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      setError(
        err.message ||
          (isHappy ? 'เกิดข้อผิดพลาดในการส่งข้อความ' : 'เกิดข้อผิดพลาดในการเขียนคำไว้อาลัย'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const emojiList = isHappy
    ? [
        { char: '❤️', label: 'ส่งความรัก' },
        { char: '✨', label: 'ประกายสดใส' },
        { char: '🐱', label: 'น้องแมว' },
        { char: '🐶', label: 'น้องหมา' },
        { char: '🐾', label: 'รอยเท้าสัตว์เลี้ยง' },
        { char: '🤍', label: 'หัวใจสีขาว' },
        { char: '🌸', label: 'ดอกไม้สดชื่น' },
      ]
    : [
        { char: '🕯️', label: 'เทียนไว้อาลัย' },
        { char: '🕊️', label: 'นกพิราบความสงบ' },
        { char: '🙏', label: 'ไหว้เคารพ' },
        { char: '🤍', label: 'หัวใจสีขาว' },
        { char: '🥀', label: 'ดอกไม้เหี่ยว' },
        { char: '🖤', label: 'หัวใจสีดำ' },
        { char: '🌹', label: 'ดอกไม้ระลึกถึง' },
      ];

  const toolbarHint =
    category === 'Friends'
      ? 'ใส่สติกเกอร์หรืออีโมจิให้ข้อความสนุกขึ้น'
      : 'เลือกรูปแบบข้อความหรือใส่อีโมจิ';

  return (
    <div className="border-t border-stone-200/80 pt-8">
      {!isOpen ? (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/80">
            <PenTool
              className="h-5 w-5"
              style={{ color: 'var(--theme-primary, #0d9488)' }}
              aria-hidden
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-stone-900 sm:text-lg">
              {isHappy ? 'ร่วมส่งความคิดถึงและบันทึกข้อความ' : 'ร่วมส่งคำไว้อาลัยและแสดงความระลึกถึง'}
            </h3>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-stone-500">
              {isHappy
                ? category === 'Friends'
                  ? 'เขียนข้อความฝากถึงกัน เพื่อเก็บเป็นความทรงจำของกลุ่ม'
                  : 'เขียนข้อความส่งความรักและอวยพร เพื่อรวบรวมเป็นสมุดบันทึกความทรงจำ'
                : 'ร่วมจุดเทียนออนไลน์และเขียนคำไว้อาลัย ส่งต่อให้ครอบครัวผู้ล่วงลับ'}
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mx-auto min-h-11 rounded-full px-6 text-sm font-bold text-white hover:brightness-105"
            style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
          >
            <Flame className="h-4 w-4" aria-hidden />
            {isHappy ? 'เขียนข้อความ' : 'เขียนคำไว้อาลัย'}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="animate-fade-in relative w-full space-y-5 text-left">
          <header className="flex items-center justify-between gap-3">
            <h3 className="text-base font-bold text-stone-900">
              {isHappy ? 'เขียนข้อความ' : 'เขียนคำไว้อาลัย'}
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 shrink-0 rounded-lg px-2 text-stone-500 hover:text-stone-700"
            >
              <X className="size-4" aria-hidden />
              <span className="sr-only">ปิดฟอร์ม</span>
              <span className="text-xs font-medium">ปิด</span>
            </Button>
          </header>

          {error && (
            <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50/80">
              <AlertCircle className="size-4" />
              <AlertDescription className="text-xs text-red-700">{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="rounded-xl border-emerald-200 bg-emerald-50/80">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <AlertDescription className="text-xs text-emerald-700">{success}</AlertDescription>
            </Alert>
          )}

          <div
            className={cn(
              'flex flex-col gap-4',
              !hideRelationship && 'sm:flex-row sm:items-start',
            )}
          >
            <div className="min-w-0 flex-1 space-y-1.5">
              <Label htmlFor="condolence-sender-name" className="text-xs font-semibold text-stone-600">
                {isHappy ? 'ชื่อผู้เขียนข้อความ' : 'ชื่อผู้ส่งคำไว้อาลัย'}
              </Label>
              <Input
                id="condolence-sender-name"
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="เช่น สมพร รักดี"
                className={cn(fieldClass, 'w-full')}
                disabled={isLoading}
              />
            </div>

            {!hideRelationship && (
              <div className="min-w-0 flex-1 space-y-1.5">
                <Label className="text-xs font-semibold text-stone-600">ความสัมพันธ์</Label>
                <Select value={relationship} onValueChange={setRelationship} disabled={isLoading}>
                  <SelectTrigger
                    className={cn(
                      fieldClass,
                      'w-full min-w-0 !h-10 items-center justify-between data-[size=default]:!h-10',
                    )}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Family">ครอบครัวใกล้ชิด</SelectItem>
                    <SelectItem value="Relative">ญาติพี่น้อง</SelectItem>
                    <SelectItem value="Friend">เพื่อน</SelectItem>
                    <SelectItem value="Colleague">เพื่อนร่วมงาน</SelectItem>
                    <SelectItem value="Other">อื่น ๆ (ระบุเอง)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {!hideRelationship && relationship === 'Other' && (
            <div className="space-y-1.5 animate-fade-in">
              <Label htmlFor="condolence-custom-relation" className="text-xs font-semibold text-stone-600">
                ระบุความสัมพันธ์เพิ่มเติม
              </Label>
              <Input
                id="condolence-custom-relation"
                type="text"
                value={customRelation}
                onChange={(e) => setCustomRelation(e.target.value)}
                placeholder="เช่น เพื่อนสมัยประถม, เพื่อนบ้าน"
                className={cn(fieldClass, 'w-full')}
                disabled={isLoading}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="condolence-message-textarea" className="text-xs font-semibold text-stone-600">
              {category === 'Friends'
                ? 'ข้อความถึงกลุ่ม'
                : isHappy
                  ? 'ข้อความถึงน้อง ๆ / เจ้าของแคมเปญ'
                  : 'ข้อความไว้อาลัย'}
            </Label>
            <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50/50 transition-[box-shadow,border-color] focus-within:border-stone-300 focus-within:ring-2 focus-within:ring-[color:var(--theme-primary)]/15">
              <div className="flex flex-wrap items-center gap-0.5 border-b border-stone-200/70 px-2 py-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => insertFormatting('bold')}
                  className="size-8 rounded-lg text-xs font-black text-stone-700"
                  title="ตัวหนา (Bold)"
                >
                  B
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => insertFormatting('italic')}
                  className="size-8 rounded-lg text-xs font-semibold italic text-stone-700"
                  title="ตัวเอียง (Italic)"
                >
                  I
                </Button>

                <div className="mx-1 h-5 w-px bg-stone-200" aria-hidden />

                <div className="flex flex-wrap items-center gap-0.5">
                  {emojiList.map((item) => (
                    <Button
                      key={item.char}
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => insertEmoji(item.char)}
                      className="size-8 rounded-lg text-sm"
                      title={item.label}
                    >
                      {item.char}
                    </Button>
                  ))}
                </div>

                <span className="ml-auto hidden select-none text-xs text-stone-400 sm:inline">
                  {toolbarHint}
                </span>
              </div>
              <Textarea
                id="condolence-message-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  category === 'Friends'
                    ? 'เขียนข้อความฝากถึงกลุ่ม ความหลัง หรือคำทักทาย...'
                    : isHappy
                      ? 'เขียนส่งความรัก ความคิดถึง หรือข้อความสมุดเยี่ยมเยียน...'
                      : 'เขียนคำรำลึกและแสดงความไว้อาลัยแด่ผู้ล่วงลับ...'
                }
                rows={5}
                className="min-h-[7.5rem] resize-none rounded-none border-0 bg-transparent px-4 py-3 text-sm leading-relaxed text-stone-800 shadow-none focus-visible:ring-0"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condolence-captcha-answer" className="text-xs font-semibold text-stone-600">
              ยืนยันตัวตน
            </Label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-700 tabular-nums">
                  {captchaQuestion.num1} + {captchaQuestion.num2} = ?
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={generateCaptcha}
                  className="size-9 rounded-xl text-stone-400 hover:text-stone-600"
                  title="เปลี่ยนโจทย์"
                >
                  <RotateCw className="size-4" />
                </Button>
              </div>
              <Input
                id="condolence-captcha-answer"
                type="text"
                inputMode="numeric"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="กรอกคำตอบเป็นตัวเลข..."
                className={cn(fieldClass, 'sm:max-w-[11rem]')}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="min-h-11 rounded-xl border-stone-200 px-5 text-stone-600"
              disabled={isLoading}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              className="min-h-11 rounded-xl px-6 font-bold text-white hover:brightness-105"
              style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
              disabled={isLoading}
            >
              <Flame className="size-4" />
              <span>{isLoading ? 'กำลังส่ง...' : isHappy ? 'ส่งข้อความ' : 'ส่งคำไว้อาลัย'}</span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
