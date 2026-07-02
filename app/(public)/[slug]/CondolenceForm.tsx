'use client';

import React, { useState } from 'react';
import { Flame, RotateCw } from 'lucide-react';

export default function CondolenceForm({ websiteId }: { websiteId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [customRelation, setCustomRelation] = useState('');
  const [message, setMessage] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 1; // 1-9
    const num2 = Math.floor(Math.random() * 9) + 1; // 1-9
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

  const insertFormatting = (tag: 'bold' | 'italic') => {
    const textarea = document.getElementById('condolence-message-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    if (tag === 'bold') {
      replacement = `**${selectedText || 'ข้อความตัวหนา'}**`;
    } else {
      replacement = `*${selectedText || 'ข้อความตัวเอียง'}*`;
    }

    const newText = text.substring(0, start) + replacement + text.substring(end);
    setMessage(newText);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      const offset = tag === 'bold' ? 2 : 1;
      if (selectedText) {
        textarea.setSelectionRange(start + offset, start + offset + selectedText.length);
      } else {
        const placeholderText = tag === 'bold' ? 'ข้อความตัวหนา' : 'ข้อความตัวเอียง';
        textarea.setSelectionRange(start + offset, start + offset + placeholderText.length);
      }
    }, 0);
  };

  const insertEmoji = (emoji: string) => {
    const textarea = document.getElementById('condolence-message-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const newText = text.substring(0, start) + emoji + text.substring(end);
    setMessage(newText);

    // Reposition cursor after the inserted emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    const finalRelation = relationship === 'Other' ? customRelation.trim() : relationship;

    if (!senderName || !finalRelation || !message) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      setIsLoading(false);
      return;
    }

    if (!userAnswer) {
      setError('กรุณาตอบคำถามป้องกันบอท (คำนวณเลข)');
      setIsLoading(false);
      return;
    }

    if (parseInt(userAnswer) !== captchaQuestion.answer) {
      setError('คำตอบคำนวณเลขไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
      generateCaptcha();
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/condolence/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId,
          senderName,
          relationship: finalRelation,
          message,
          type: relationship === 'Family' ? 'FAMILY' : 'GENERAL',
          captchaToken: 'mock-token',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('คำไว้อาลัยส่งเข้าระบบเรียบร้อยแล้ว และจะปรากฏเมื่อผู้ดูแลระบบกดอนุมัติ');
      setSenderName('');
      setMessage('');
      setRelationship('Friend');
      setCustomRelation('');
      // Auto close after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการเขียนคำไว้อาลัย');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 text-center">
      {!isOpen ? (
        <div className="p-8 rounded-3xl border border-dashed border-stone-300 bg-white shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-stone-850 mb-2">
            ร่วมส่งคำไว้อาลัยและแสดงความระลึกถึง
          </h3>
          <p className="text-stone-500 text-xs mb-6 max-w-md mx-auto leading-normal">
            คุณสามารถร่วมจุดเทียนออนไลน์และเขียนคำไว้อาลัย เพื่อรวบรวมเป็นสมุดบันทึกส่งต่อให้ครอบครัวผู้ล่วงลับ
          </p>
          <button 
            onClick={() => setIsOpen(true)}
            className="px-6 py-3 text-xs sm:text-sm font-semibold rounded-full text-white hover:brightness-105 active:scale-95 transition shadow-md flex items-center gap-1.5 mx-auto"
            style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
          >
            <Flame className="w-4 h-4 animate-pulse" />
            <span>ร่วมแสดงความไว้อาลัย</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl border border-stone-200/80 bg-white text-left space-y-5 w-full shadow-xl relative animate-fade-in">
          <header className="flex justify-between items-center border-b border-stone-200 pb-3">
            <h3 className="text-base font-bold text-stone-900">เขียนคำไว้อาลัย</h3>
            <button 
              type="button" 
              onClick={() => setIsOpen(false)} 
              className="text-xs text-stone-400 hover:text-stone-700 transition"
            >
              ปิดฟอร์ม [x]
            </button>
          </header>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">⚠️ {error}</div>}
          {success && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium">✓ {success}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">ชื่อผู้ส่งคำไว้อาลัย</label>
              <input 
                type="text" 
                value={senderName} 
                onChange={(e) => setSenderName(e.target.value)} 
                placeholder="เช่น สมพร รักดี"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-850 text-xs focus:bg-white focus:outline-none"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">ความสัมพันธ์</label>
              <select 
                value={relationship} 
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-850 text-xs focus:bg-white focus:outline-none"
                disabled={isLoading}
              >
                <option value="Family">ครอบครัวใกล้ชิด</option>
                <option value="Relative">ญาติพี่น้อง</option>
                <option value="Friend">เพื่อน</option>
                <option value="Colleague">เพื่อนร่วมงาน</option>
                <option value="Other">อื่น ๆ (ระบุเอง)</option>
              </select>
            </div>
          </div>

          {/* Conditional custom relation input box (GRILL DECISION) */}
          {relationship === 'Other' && (
            <div className="space-y-1 animate-fade-in">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">ระบุความสัมพันธ์เพิ่มเติม</label>
              <input 
                type="text" 
                value={customRelation} 
                onChange={(e) => setCustomRelation(e.target.value)} 
                placeholder="เช่น เพื่อนสมัยประถม, เพื่อนบ้าน"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-850 text-xs focus:bg-white focus:outline-none"
                disabled={isLoading}
              />
            </div>
          )}



          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">ข้อความไว้อาลัย</label>
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => insertFormatting('bold')}
                className="px-2.5 py-1 text-xs font-black rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-850 transition active:scale-95 cursor-pointer shadow-sm"
                title="ตัวหนา (Bold)"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('italic')}
                className="px-2.5 py-1 text-xs italic font-semibold rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-850 transition active:scale-95 cursor-pointer shadow-sm"
                title="ตัวเอียง (Italic)"
              >
                I
              </button>

              <div className="h-4 w-px bg-stone-250 mx-1"></div>

              {/* Mourning Emojis List */}
              <div className="flex items-center gap-1">
                {[
                  { char: '🕯️', label: 'เทียนไว้อาลัย' },
                  { char: '🕊️', label: 'นกพิราบความสงบ' },
                  { char: '🙏', label: 'ไหว้เคารพ' },
                  { char: '🤍', label: 'หัวใจสีขาว' },
                  { char: '🥀', label: 'ดอกไม้เหี่ยว' },
                  { char: '🖤', label: 'หัวใจสีดำ' },
                  { char: '🌹', label: 'ดอกไม้ระลึกถึง' },
                ].map((item) => (
                  <button
                    key={item.char}
                    type="button"
                    onClick={() => insertEmoji(item.char)}
                    className="p-1 text-sm hover:bg-stone-100 rounded-md transition active:scale-90 cursor-pointer"
                    title={item.label}
                  >
                    {item.char}
                  </button>
                ))}
              </div>

              <span className="text-[10px] text-stone-400 ml-auto select-none hidden sm:inline">
                เลือกรูปแบบข้อความหรือใส่อีโมจิไว้อาลัย
              </span>
            </div>
            <textarea 
              id="condolence-message-textarea"
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="เขียนคำรำลึกและแสดงความไว้อาลัยแด่ผู้ล่วงลับ..."
              rows={4}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-850 text-xs resize-none focus:bg-white focus:outline-none"
              disabled={isLoading}
            />
          </div>

          {/* Math Captcha Challenge for Bot Protection */}
          <div className="space-y-2 p-4 bg-stone-50 border border-stone-200 rounded-2xl">
            <label className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide block">
              🛡️ การป้องกันสแปมบอท (กรุณาคำนวณผลลัพธ์)
            </label>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-stone-800 bg-white border border-stone-200 px-3 py-2 rounded-xl select-none">
                {captchaQuestion.num1} + {captchaQuestion.num2} = ?
              </span>
              <input 
                type="number" 
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="คำตอบของคุณ"
                className="flex-1 px-4 py-2 bg-white border border-stone-200 rounded-xl text-stone-850 text-xs focus:outline-none"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={generateCaptcha}
                className="px-3 py-2 text-xs bg-stone-100 text-stone-500 hover:text-stone-800 rounded-xl border border-stone-200 transition flex items-center justify-center cursor-pointer active:scale-95"
                title="เปลี่ยนคำถาม"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)} 
              className="px-4 py-2 text-xs border border-stone-300 hover:bg-stone-100 rounded-xl text-stone-500 hover:text-stone-800 transition"
              disabled={isLoading}
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 text-xs font-bold rounded-xl text-white hover:brightness-105 transition flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
              disabled={isLoading}
            >
              <Flame className="w-4 h-4" />
              <span>{isLoading ? 'กำลังส่ง...' : 'ส่งคำไว้อาลัย'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
