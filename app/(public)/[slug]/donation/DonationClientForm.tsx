'use client';

import React, { useState, useEffect } from 'react';
import { getFeatureLabel } from '@/lib/categories';
import { Heart, Sparkles, AlertCircle, Check, Smartphone } from 'lucide-react';
import CategoryOrnament from '@/components/public/CategoryOrnament';

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
  category
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

      setSuccess('ส่งสลิปโอนเงินตรวจสอบสำเร็จ ขออนุโมทนาบุญค่ะ');
      
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
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการตรวจสอบสลิป กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-stone-200/80 bg-white p-8 sm:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.015)] space-y-8 relative overflow-hidden text-left max-w-2xl mx-auto font-sans">
      {/* Page Header with CategoryOrnament and Wing lines */}
      {(() => {
        const { label: fLabel, description: fDesc } = getFeatureLabel(category || 'Memorial', 'donation');
        return (
          <div className="flex flex-col items-center text-center space-y-3">
            <h2 className="text-2xl font-black text-stone-900" style={{ color: 'var(--theme-primary, #0d9488)' }}>
              {fLabel}
            </h2>
            <p className="text-stone-500 text-xs max-w-md leading-normal">
              {fDesc}
            </p>
            {/* Centered Motif with Wing lines divider */}
            <div className="w-full flex items-center justify-center gap-4 pt-4 select-none">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-stone-200" />
              <div className="flex-shrink-0">
                <CategoryOrnament category={category || 'Memorial'} />
              </div>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-stone-200" />
            </div>
          </div>
        );
      })()}

      <div className="space-y-10">
        {/* PromptPay QR Code Box */}
        <div className="text-center space-y-6">
          <div className="p-5 rounded-2xl bg-stone-50 text-stone-900 shadow-sm space-y-4 max-w-xs mx-auto border border-stone-200/60">
            <div className="text-center font-bold text-[10px] tracking-wider border-b border-stone-200 pb-2 text-stone-500 uppercase">PROMPTPAY QR</div>
            
            <div className="w-40 h-40 bg-white rounded-lg mx-auto flex flex-col items-center justify-center gap-1 border border-stone-200 p-2">
              <Smartphone className="w-8 h-8 text-stone-500" />
              <span className="text-[8px] font-black text-stone-700">DONATION SCAN</span>
              <span className="text-[9px] font-mono text-stone-500 break-all px-2">{donationPromptPay}</span>
            </div>

            <div className="space-y-0.5 text-left">
              <p className="text-[10px] font-bold text-stone-400">ชื่อบัญชีรับเงิน:</p>
              <p className="text-xs font-black text-stone-900 truncate">{donationAccountName}</p>
              <p className="text-[9px] text-stone-550">หมายเลขพร้อมเพย์: {donationPromptPay}</p>
            </div>
          </div>

          {/* Donation slip upload form */}
          <form onSubmit={handleSubmit} className="border-t border-stone-200 pt-6 text-left space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-amber-600" />
              <span>ส่งสลิปโอนเงินยืนยันการทำบุญ (Slip Verify)</span>
            </h3>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xl font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 rounded-xl font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-stone-500 font-bold uppercase block">ชื่อผู้ร่วมทำบุญ</label>
                <input 
                  type="text"
                  disabled={isAnonymous}
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="เช่น นายสมใจ รักสงบ"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-850 text-xs disabled:opacity-40 focus:bg-white focus:outline-none"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] text-stone-500 font-bold uppercase block">จำนวนเงินทำบุญ (บาท)</label>
                <input 
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="เช่น 100"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-850 text-xs font-mono focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-stone-500 font-bold uppercase block">คำส่งอนุโมทนา/คำอุทิศส่วนกุศล (ระบุได้ตามปรารถนา)</label>
              <input 
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="เช่น ขอให้ดวงวิญญาณไปสู่สุคติในสัมปรายภพ"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-850 text-xs focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-stone-500 font-bold uppercase block">แนบภาพสลิปโอนเงิน (PDF / Image)</label>
              <input 
                type="file"
                accept="image/*,application/pdf"
                required
                onChange={(e) => setSlipFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-stone-500 text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:bg-stone-200 file:text-stone-700 hover:file:bg-stone-300 cursor-pointer"
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600"
                />
                <span className="text-xs text-stone-700 font-bold">ไม่ประสงค์ออกนาม</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={hideAmount}
                  onChange={(e) => setHideAmount(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600"
                />
                <span className="text-xs text-stone-700 font-bold">ไม่แสดงยอดเงิน</span>
              </label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
            >
              <Heart className="w-4 h-4 text-stone-950" />
              <span>{loading ? 'กำลังส่งและตรวจสอบสลิปอัตโนมัติ...' : 'ยืนยันยอดและร่วมอนุโมทนาบุญ'}</span>
            </button>
          </form>
        </div>

        {/* Merit Wall - Display board of verified donors */}
        <div className="border-t border-stone-200 pt-8 space-y-6">
          <div className="text-center">
            <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>กระดานรายนามผู้ร่วมอนุโมทนาบุญ (Merit Wall)</span>
            </h3>
            <p className="text-[10px] text-stone-550 mt-1">รายนามแขกผู้มีเกียรติที่ร่วมทำบุญและได้รับการตรวจสอบสลิปเรียบร้อยแล้ว</p>
          </div>

          {listLoading ? (
            <div className="text-center py-6 text-xs text-stone-500 animate-pulse">กำลังโหลดข้อมูลรายนาม...</div>
          ) : donations.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-stone-200 rounded-2xl text-xs text-stone-500 italic">
              ยังไม่มีผู้ส่งข้อมูลทำบุญในเวลานี้
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {donations.map(don => (
                <div key={don.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-stone-900">{don.isAnonymous ? 'ผู้ไม่ประสงค์ออกนาม' : don.donorName}</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 border border-amber-200 text-amber-800 text-[8px] font-bold">
                        ✓ ตรวจสอบแล้ว
                      </span>
                    </div>
                    {don.message && <p className="text-xs text-stone-600 font-medium italic">"{don.message}"</p>}
                    <p className="text-[8px] text-stone-400 font-semibold">{new Date(don.createdAt).toLocaleDateString('th-TH')}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-black text-amber-700">
                      {don.hideAmount ? '*** บาท' : `${don.amount.toLocaleString()} บาท`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
