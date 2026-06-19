'use client';

import React, { useState } from 'react';

export default function CondolenceForm({ websiteId }: { websiteId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [customRelation, setCustomRelation] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('GENERAL'); // "FAMILY" or "GENERAL"
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

    try {
      const res = await fetch('/api/condolence/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId,
          senderName,
          relationship: finalRelation,
          message,
          type,
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
            className="px-6 py-3 text-xs sm:text-sm font-semibold rounded-full text-white hover:brightness-105 active:scale-95 transition shadow-md"
            style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
          >
            🕯️ ร่วมแสดงความไว้อาลัย
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl border border-stone-200/80 bg-white text-left space-y-5 max-w-xl mx-auto shadow-xl relative animate-fade-in">
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
                <option value="Spouse">คู่สมรส</option>
                <option value="Son">บุตร</option>
                <option value="Daughter">ธิดา</option>
                <option value="Grandchild">หลาน</option>
                <option value="Relative">ญาติ</option>
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

          {/* Comment Type: General or Family priority (BR028) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block">ประเภทกลุ่มข้อความ</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                <input 
                  type="radio" 
                  name="type" 
                  value="GENERAL"
                  checked={type === 'GENERAL'}
                  onChange={() => setType('GENERAL')}
                  className="accent-emerald-600"
                />
                <span>คำไว้อาลัยทั่วไป (General)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-750">
                <input 
                  type="radio" 
                  name="type" 
                  value="FAMILY"
                  checked={type === 'FAMILY'}
                  onChange={() => setType('FAMILY')}
                  className="accent-emerald-600"
                />
                <span className="text-amber-800 font-semibold">ข้อความจากครอบครัว (Family Priority)</span>
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">ข้อความไว้อาลัย</label>
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="เขียนคำรำลึกและแสดงความไว้อาลัยแด่ผู้ล่วงลับ..."
              rows={4}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-850 text-xs resize-none focus:bg-white focus:outline-none"
              disabled={isLoading}
            />
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
              className="px-5 py-2 text-xs font-bold rounded-xl text-white hover:brightness-105 transition"
              style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
              disabled={isLoading}
            >
              {isLoading ? 'กำลังส่ง...' : '🕯️ ส่งคำไว้อาลัย'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
