'use client';

import React, { useState, useEffect } from 'react';

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
  donationAccountName 
}: { 
  websiteId: string; 
  donationPromptPay: string; 
  donationAccountName: string;
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

  // 1. Fetch donations for the merit board
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

  // 2. Handle slip submit and API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!donorName && !isAnonymous) {
      setError('กรุณากรอกชื่อผู้ร่วมทำบุญ หรือเลือกแบบไม่ประสงค์ออกนาม');
      setLoading(false);
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('กรุณากรอกจำนวนเงินทำบุญที่ถูกต้อง');
      setLoading(false);
      return;
    }

    try {
      // Simulate slip image uploading to S3/R2 storage via presigned URL
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
        slipUrl = quotaData.filePath;
      }

      // Submit Donation details
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

      setSuccess('ส่งสลิปโอนเงินตรวจสอบสำเร็จ ขออนุโมทนาบุญค่ะ');
      
      // Reload donations list
      const listRes = await fetch(`/api/donation/list?websiteId=${websiteId}`);
      const listData = await listRes.json();
      if (listRes.ok) {
        setDonations(listData.donations || []);
      }

      // Reset form fields
      setDonorName('');
      setAmount('');
      setMessage('');
      setIsAnonymous(false);
      setHideAmount(false);
      setSlipFile(null);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการตรวจสอบสลิป กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-lg mx-auto font-sans">
      
      {/* PromptPay QR Code Box */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 shadow-xl text-center space-y-6">
        <header className="space-y-2">
          <span className="text-[10px] uppercase font-black text-amber-400 tracking-widest bg-amber-500/10 px-3 py-1 rounded-full">
            DONATION & MERITS
          </span>
          <h2 className="text-xl font-bold text-white">ร่วมทำบุญอุทิศส่วนกุศล</h2>
          <p className="text-slate-400 text-xs leading-normal max-w-xs mx-auto">
            เงินร่วมทำบุญจะโอนเข้าสู่บัญชีพร้อมเพย์หลักของครอบครัวผู้ล่วงลับโดยตรง 100% ปราศจากค่าบริการแพลตฟอร์ม
          </p>
        </header>

        <div className="p-5 rounded-2xl bg-white text-slate-900 shadow-lg space-y-4 max-w-xs mx-auto border border-slate-100">
          <div className="text-center font-bold text-[10px] tracking-wider border-b pb-2 text-slate-500 uppercase">PROMPTPAY QR</div>
          
          <div className="w-40 h-40 bg-slate-100 rounded-lg mx-auto flex flex-col items-center justify-center gap-1 border-2 border-slate-200 p-2">
            <span className="text-2xl">🌸</span>
            <span className="text-[8px] font-black text-slate-700">DONATION SCAN</span>
            <span className="text-[9px] font-mono text-slate-500 break-all px-2">{donationPromptPay}</span>
          </div>

          <div className="space-y-0.5 text-left">
            <p className="text-[10px] font-bold text-slate-400">ชื่อบัญชีรับเงิน:</p>
            <p className="text-xs font-black text-slate-950 truncate">{donationAccountName}</p>
            <p className="text-[9px] text-slate-500">หมายเลขพร้อมเพย์: {donationPromptPay}</p>
          </div>
        </div>

        {/* Donation slip upload form */}
        <form onSubmit={handleSubmit} className="border-t border-slate-850 pt-6 text-left space-y-4">
          <h3 className="text-sm font-bold text-white">🌸 ส่งสลิปโอนเงินยืนยันการทำบุญ (Slip Verify)</h3>
          
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-xs text-red-400 rounded-xl font-semibold">⚠️ {error}</div>}
          {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 rounded-xl font-semibold">✓ {success}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase block">ชื่อผู้ร่วมทำบุญ</label>
              <input 
                type="text"
                disabled={isAnonymous}
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="เช่น นายสมใจ รักสงบ"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs disabled:opacity-40"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase block">จำนวนเงินทำบุญ (บาท)</label>
              <input 
                type="number"
                step="0.01"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="เช่น 100"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">คำส่งอนุโมทนา/คำอุทิศส่วนกุศล (ระบุได้ตามปรารถนา)</label>
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="เช่น ขอให้ดวงวิญญาณไปสู่สุคติในสัมปรายภพ"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">แนบภาพสลิปโอนเงิน (PDF / Image)</label>
            <input 
              type="file"
              accept="image/*,application/pdf"
              required
              onChange={(e) => setSlipFile(e.target.files ? e.target.files[0] : null)}
              className="w-full text-slate-400 text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-750"
            />
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 accent-emerald-500"
              />
              <span className="text-xs text-slate-300 font-bold">ไม่ประสงค์ออกนาม</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={hideAmount}
                onChange={(e) => setHideAmount(e.target.checked)}
                className="w-4 h-4 accent-emerald-500"
              />
              <span className="text-xs text-slate-300 font-bold">ไม่แสดงยอดเงิน</span>
            </label>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs rounded-xl transition"
          >
            {loading ? 'กำลังส่งและตรวจสอบสลิปอัตโนมัติ...' : '🌸 ยืนยันยอดและร่วมอนุโมทนาบุญ'}
          </button>
        </form>
      </div>

      {/* Merit Wall - Display board of verified donors */}
      <section className="rounded-3xl border border-slate-800 bg-slate-950/20 p-6 shadow-inner space-y-6">
        <div className="text-center">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">🌿 กระดานรายนามผู้ร่วมอนุโมทนาบุญ (Merit Wall)</h3>
          <p className="text-[10px] text-slate-500 mt-1">รายนามแขกผู้มีเกียรติที่ร่วมทำบุญและได้รับการตรวจสอบสลิปเรียบร้อยแล้ว</p>
        </div>

        {listLoading ? (
          <div className="text-center py-6 text-xs text-slate-500 animate-pulse">กำลังโหลดข้อมูลรายนาม...</div>
        ) : donations.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-850 rounded-2xl text-xs text-slate-600 italic">
            ยังไม่มีผู้ส่งข้อมูลทำบุญในเวลานี้
          </div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {donations.map(don => (
              <div key={don.id} className="p-4 rounded-2xl border border-slate-850 bg-slate-900/20 flex justify-between items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white">{don.isAnonymous ? 'ผู้ไม่ประสงค์ออกนาม' : don.donorName}</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-bold">
                      ✓ ตรวจสอบแล้ว
                    </span>
                  </div>
                  {don.message && <p className="text-xs text-slate-400 font-medium italic">"{don.message}"</p>}
                  <p className="text-[8px] text-slate-600 font-semibold">{new Date(don.createdAt).toLocaleDateString('th-TH')}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-black text-amber-400">
                    {don.hideAmount ? '*** บาท' : `${don.amount.toLocaleString()} บาท`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
