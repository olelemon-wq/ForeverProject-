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
        <div className="p-8 rounded-3xl border border-dashed border-slate-850 bg-slate-950/10">
          <h3 className="text-base sm:text-lg font-semibold text-slate-200 mb-2">
            ร่วมส่งคำไว้อาลัยและแสดงความระลึกถึง
          </h3>
          <p className="text-slate-400 text-xs mb-6 max-w-md mx-auto leading-normal">
            คุณสามารถร่วมจุดเทียนออนไลน์และเขียนคำไว้อาลัย เพื่อรวบรวมเป็นสมุดบันทึกส่งต่อให้ครอบครัวผู้ล่วงลับ
          </p>
          <button 
            onClick={() => setIsOpen(true)}
            className="px-6 py-3 text-xs sm:text-sm font-semibold rounded-full text-slate-950 hover:brightness-110 active:scale-95 transition shadow-lg bg-emerald-400"
            style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
          >
            🕯️ ร่วมแสดงความไว้อาลัย
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl border border-slate-800 bg-slate-950/50 text-left space-y-5 max-w-xl mx-auto shadow-2xl relative animate-fade-in">
          <header className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">เขียนคำไว้อาลัย</h3>
            <button 
              type="button" 
              onClick={() => setIsOpen(false)} 
              className="text-xs text-slate-500 hover:text-white transition"
            >
              ปิดฟอร์ม [x]
            </button>
          </header>

          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-medium">⚠️ {error}</div>}
          {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-medium">✓ {success}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ชื่อผู้ส่งคำไว้อาลัย</label>
              <input 
                type="text" 
                value={senderName} 
                onChange={(e) => setSenderName(e.target.value)} 
                placeholder="เช่น สมพร รักดี"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ความสัมพันธ์</label>
              <select 
                value={relationship} 
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs"
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
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ระบุความสัมพันธ์เพิ่มเติม</label>
              <input 
                type="text" 
                value={customRelation} 
                onChange={(e) => setCustomRelation(e.target.value)} 
                placeholder="เช่น เพื่อนสมัยประถม, เพื่อนบ้าน"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                disabled={isLoading}
              />
            </div>
          )}

          {/* Comment Type: General or Family priority (BR028) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">ประเภทกลุ่มข้อความ</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input 
                  type="radio" 
                  name="type" 
                  value="GENERAL"
                  checked={type === 'GENERAL'}
                  onChange={() => setType('GENERAL')}
                  className="accent-emerald-500"
                />
                <span>คำไว้อาลัยทั่วไป (General)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input 
                  type="radio" 
                  name="type" 
                  value="FAMILY"
                  checked={type === 'FAMILY'}
                  onChange={() => setType('FAMILY')}
                  className="accent-emerald-500"
                />
                <span className="text-amber-400 font-semibold">ข้อความจากครอบครัว (Family Priority)</span>
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ข้อความไว้อาลัย</label>
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="เขียนคำรำลึกและแสดงความไว้อาลัยแด่ผู้ล่วงลับ..."
              rows={4}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)} 
              className="px-4 py-2 text-xs border border-slate-850 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white transition"
              disabled={isLoading}
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 text-xs font-bold rounded-xl text-slate-950 bg-emerald-400 hover:brightness-110 transition"
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
