'use client';

import React, { useState } from 'react';
import { Flame, RotateCw } from 'lucide-react';

export default function CondolenceForm({ 
  websiteId, 
  category, 
  subjects 
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
  const isHappy = category === 'Couple' || category === 'Wedding' || (category === 'Pet Memorial' && allSubjectsAlive);
  const hideRelationship = category === 'Pet Memorial';

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
    
    // Captcha validation
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
          : 'คำไว้อาลัยส่งเข้าระบบเรียบร้อยแล้ว และจะปรากฏเมื่อผู้ดูแลระบบกดอนุมัติ'
      );
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
      setError(err.message || (isHappy ? 'เกิดข้อผิดพลาดในการส่งข้อความ' : 'เกิดข้อผิดพลาดในการเขียนคำไว้อาลัย'));
    } finally {
      setIsLoading(false);
    }
  };

  const emojiList = isHappy ? [
    { char: '❤️', label: 'ส่งความรัก' },
    { char: '✨', label: 'ประกายสดใส' },
    { char: '🐱', label: 'น้องแมว' },
    { char: '🐶', label: 'น้องหมา' },
    { char: '🐾', label: 'รอยเท้าสัตว์เลี้ยง' },
    { char: '🤍', label: 'หัวใจสีขาว' },
    { char: '🌸', label: 'ดอกไม้สดชื่น' },
  ] : [
    { char: '🕯️', label: 'เทียนไว้อาลัย' },
    { char: '🕊️', label: 'นกพิราบความสงบ' },
    { char: '🙏', label: 'ไหว้เคารพ' },
    { char: '🤍', label: 'หัวใจสีขาว' },
    { char: '🥀', label: 'ดอกไม้เหี่ยว' },
    { char: '🖤', label: 'หัวใจสีดำ' },
    { char: '🌹', label: 'ดอกไม้ระลึกถึง' },
  ];

  return (
    <div className="mt-8 text-center">
      {!isOpen ? (
        <div className="py-12 px-8 rounded-3xl border border-stone-200/60 bg-white shadow-sm text-center">
          <h3 className="text-base sm:text-lg font-bold text-stone-800 mb-2">
            {isHappy ? 'ร่วมส่งความคิดถึงและบันทึกข้อความ' : 'ร่วมส่งคำไว้อาลัยและแสดงความระลึกถึง'}
          </h3>
          <p className="text-stone-400 text-xs sm:text-sm mb-8 max-w-sm mx-auto leading-relaxed">
            {isHappy 
              ? 'เขียนข้อความส่งความรักและอวยพร เพื่อรวบรวมเป็นสมุดบันทึกความทรงจำ'
              : 'ร่วมจุดเทียนออนไลน์และเขียนคำไว้อาลัย ส่งต่อให้ครอบครัวผู้ล่วงลับ'}
          </p>
          <button 
            onClick={() => setIsOpen(true)}
            className="px-8 py-3 text-sm font-bold rounded-full text-white hover:brightness-105 active:scale-95 transition shadow-md flex items-center gap-2 mx-auto"
            style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
          >
            <Flame className="w-4 h-4" />
            <span>{isHappy ? 'เขียนข้อความ' : 'เขียนคำไว้อาลัย'}</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl border border-stone-200/60 bg-white text-left space-y-6 w-full shadow-sm relative animate-fade-in">
          <header className="flex justify-between items-center border-b border-stone-100 pb-4">
            <h3 className="text-base font-bold text-stone-900">{isHappy ? 'เขียนข้อความ' : 'เขียนคำไว้อาลัย'}</h3>
            <button 
              type="button" 
              onClick={() => setIsOpen(false)} 
              className="text-xs text-stone-400 hover:text-stone-600 transition border-0 bg-transparent cursor-pointer"
            >
              ปิดฟอร์ม [x]
            </button>
          </header>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2"><span className="shrink-0 w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-[10px] font-black">!</span>{error}</div>}
          {success && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium flex items-center gap-2"><span className="shrink-0 w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[10px] font-black">✓</span>{success}</div>}

          <div className={`grid grid-cols-1 gap-4 ${hideRelationship ? '' : 'sm:grid-cols-2'}`}>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">
                {isHappy ? 'ชื่อผู้เขียนข้อความ' : 'ชื่อผู้ส่งคำไว้อาลัย'}
              </label>
              <input 
                type="text" 
                value={senderName} 
                onChange={(e) => setSenderName(e.target.value)} 
                placeholder="เช่น สมพร รักดี"
                className="w-full px-4 py-3 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-800 text-sm focus:bg-white focus:outline-none focus:border-stone-300 transition"
                disabled={isLoading}
              />
            </div>

            {!hideRelationship && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">ความสัมพันธ์</label>
                <select 
                  value={relationship} 
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-800 text-sm focus:bg-white focus:outline-none focus:border-stone-300 transition cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a8a29e%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat"
                  disabled={isLoading}
                >
                  <option value="Family">ครอบครัวใกล้ชิด</option>
                  <option value="Relative">ญาติพี่น้อง</option>
                  <option value="Friend">เพื่อน</option>
                  <option value="Colleague">เพื่อนร่วมงาน</option>
                  <option value="Other">อื่น ๆ (ระบุเอง)</option>
                </select>
              </div>
            )}
          </div>

          {/* Conditional custom relation input box */}
          {!hideRelationship && relationship === 'Other' && (
            <div className="space-y-1 animate-fade-in">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">ระบุความสัมพันธ์เพิ่มเติม</label>
              <input 
                type="text" 
                value={customRelation} 
                onChange={(e) => setCustomRelation(e.target.value)} 
                placeholder="เช่น เพื่อนสมัยประถม, เพื่อนบ้าน"
                className="w-full px-4 py-3 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-800 text-sm focus:bg-white focus:outline-none focus:border-stone-300 transition"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">
              {isHappy ? 'ข้อความถึงน้อง ๆ / เจ้าของแคมเปญ' : 'ข้อความไว้อาลัย'}
            </label>
            <div className="flex items-center gap-1 mb-2 flex-wrap">
              <button
                type="button"
                onClick={() => insertFormatting('bold')}
                className="w-8 h-8 flex items-center justify-center text-xs font-black rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition active:scale-95 cursor-pointer"
                title="ตัวหนา (Bold)"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('italic')}
                className="w-8 h-8 flex items-center justify-center text-xs italic font-semibold rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition active:scale-95 cursor-pointer"
                title="ตัวเอียง (Italic)"
              >
                I
              </button>

              <div className="h-5 w-px bg-stone-200 mx-1.5"></div>

              <div className="flex items-center gap-0.5">
                {emojiList.map((item) => (
                  <button
                    key={item.char}
                    type="button"
                    onClick={() => insertEmoji(item.char)}
                    className="w-8 h-8 flex items-center justify-center text-sm hover:bg-stone-100 rounded-lg transition active:scale-90 cursor-pointer border-0 bg-transparent"
                    title={item.label}
                  >
                    {item.char}
                  </button>
                ))}
              </div>

              <span className="text-[10px] text-stone-400 ml-auto select-none hidden sm:inline">
                {isHappy ? 'เลือกรูปแบบข้อความหรือใส่อีโมจิไว้อาลัย' : 'เลือกรูปแบบข้อความหรือใส่อีโมจิไว้อาลัย'}
              </span>
            </div>
            <textarea 
              id="condolence-message-textarea"
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder={isHappy ? "เขียนส่งความรัก ความคิดถึง หรือข้อความสมุดเยี่ยมเยียน..." : "เขียนคำรำลึกและแสดงความไว้อาลัยแด่ผู้ล่วงลับ..."}
              rows={5}
              className="w-full px-4 py-3 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-800 text-sm resize-none focus:bg-white focus:outline-none focus:border-stone-300 transition leading-relaxed"
              disabled={isLoading}
            />
          </div>

          {/* Captcha */}
          <div className="p-5 bg-stone-50/50 border border-stone-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">ยืนยันตัวตน</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-stone-700 bg-white px-4 py-2 rounded-xl border border-stone-200">
                  {captchaQuestion.num1} + {captchaQuestion.num2} = ?
                </span>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="p-2 hover:bg-stone-200 text-stone-400 hover:text-stone-600 rounded-xl transition active:rotate-45 cursor-pointer border-0 bg-transparent"
                  title="เปลี่ยนโจทย์"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>
            <input 
              type="text" 
              value={userAnswer} 
              onChange={(e) => setUserAnswer(e.target.value)} 
              placeholder="กรอกคำตอบเป็นตัวเลข..."
              className="w-full sm:w-48 px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-800 text-sm focus:outline-none focus:border-stone-300 transition"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)} 
              className="px-5 py-2.5 text-sm border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-500 hover:text-stone-700 transition cursor-pointer bg-white"
              disabled={isLoading}
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 text-sm font-bold rounded-xl text-white hover:brightness-105 transition flex items-center gap-2 cursor-pointer active:scale-95"
              style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
              disabled={isLoading}
            >
              <Flame className="w-4 h-4" />
              <span>{isLoading ? 'กำลังส่ง...' : (isHappy ? 'ส่งข้อความ' : 'ส่งคำไว้อาลัย')}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
