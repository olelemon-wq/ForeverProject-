'use client';

import React, { useState, useEffect } from 'react';
import { Camera, ShieldAlert, PenTool, RotateCw } from 'lucide-react';
import { useMemorialFeedStore } from '@/stores/useMemorialFeedStore';

interface PostComposerProps {
  websiteId: string;
  slug: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
  defaultName?: string;
}

export default function PostComposer({
  websiteId,
  slug,
  isLoggedIn,
  isAdmin,
  defaultName = '',
}: PostComposerProps) {
  const submitPost = useMemorialFeedStore((state) => state.submitPost);
  const isSubmitting = useMemorialFeedStore((state) => state.isSubmitting);
  const storeError = useMemorialFeedStore((state) => state.error);

  const [senderName, setSenderName] = useState(defaultName);
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [type, setType] = useState<'CONDOLENCE' | 'MEMORY' | 'ANNOUNCEMENT' | 'MERIT'>('CONDOLENCE');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    setCaptchaQuestion({ num1, num2, answer: num1 + num2 });
    setUserAnswer('');
  };

  useEffect(() => {
    if (!isLoggedIn) {
      generateCaptcha();
    }
  }, [isLoggedIn]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  const handleUploadAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLocalLoading(true);

    const activeName = isLoggedIn ? (isAnonymous ? 'ผู้ไว้อาลัย' : 'ผู้ดูแลระบบ') : senderName.trim();

    if (!activeName && !isAnonymous) {
      setError('กรุณากรอกชื่อผู้ส่ง');
      setLocalLoading(false);
      return;
    }

    if (!content.trim()) {
      setError('กรุณากรอกข้อความไว้อาลัย');
      setLocalLoading(false);
      return;
    }

    // Captcha validation for non-logged in users
    if (!isLoggedIn) {
      if (!userAnswer) {
        setError('กรุณากรอกผลลัพธ์เพื่อป้องกันสแปมบอท');
        setLocalLoading(false);
        return;
      }
      if (parseInt(userAnswer, 10) !== captchaQuestion.answer) {
        setError('ผลคำนวณป้องกันสแปมบอทไม่ถูกต้อง');
        generateCaptcha();
        setLocalLoading(false);
        return;
      }
    }

    try {
      let uploadedMediaUrl = '';

      // Upload media if present
      if (mediaFile) {
        const uploadQuotaRes = await fetch('/api/media/upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            websiteId,
            fileName: mediaFile.name,
            fileType: mediaFile.type,
            fileSize: mediaFile.size,
          }),
        });

        const quotaData = await uploadQuotaRes.json();
        if (!uploadQuotaRes.ok) throw new Error(quotaData.error || 'S3 Presign error');

        const uploadFileRes = await fetch(quotaData.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': mediaFile.type },
          body: mediaFile,
        });

        if (!uploadFileRes.ok) throw new Error('อัปโหลดรูปภาพล้มเหลว');
        uploadedMediaUrl = quotaData.filePath;
      }

      const postPayload = {
        senderName: activeName,
        content: content.trim(),
        isAnonymous,
        type,
        mediaUrls: uploadedMediaUrl ? [uploadedMediaUrl] : [],
        captchaAnswer: userAnswer,
      };

      const result = await submitPost(slug, postPayload);

      if (result) {
        setSuccess(
          isLoggedIn
            ? 'เผยแพร่โพสต์สำเร็จเรียบร้อย'
            : 'ส่งคำไว้อาลัยสำเร็จ ข้อความจะแสดงบนฟีดหลังได้รับการอนุมัติ'
        );
        setContent('');
        setMediaFile(null);
        if (!isLoggedIn) {
          setSenderName('');
          generateCaptcha();
        }
      } else {
        throw new Error(storeError || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <form onSubmit={handleUploadAndSubmit} className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5" style={{ color: 'var(--theme-primary, #0d9488)' }}>
          <PenTool className="w-4 h-4" />
          <span>เขียนข้อความไว้อาลัยและแสดงความระลึกถึง</span>
        </h3>
        {isLoggedIn && (
          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200/50 px-2 py-0.5 rounded-full font-bold">
            โหมดผู้ดูแลระบบ
          </span>
        )}
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-250/30 rounded-2xl text-xs text-red-700 font-semibold">⚠️ {error}</div>}
      {success && <div className="p-3 bg-emerald-50 border border-emerald-250/30 rounded-2xl text-xs text-emerald-800 font-semibold">✓ {success}</div>}

      <div className="space-y-4">
        {/* Author Name Section */}
        {!isLoggedIn ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">ชื่อผู้ส่ง</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="เช่น สมศักดิ์ รักดี"
                disabled={isAnonymous || localLoading}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-850 text-xs focus:bg-white focus:outline-none"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600 font-medium">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="accent-emerald-600 w-4 h-4 rounded-md"
                  disabled={localLoading}
                />
                <span>ส่งแบบไม่ระบุชื่อ (Anonymous)</span>
              </label>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">ประเภทโพสต์</label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-850 text-xs focus:bg-white focus:outline-none cursor-pointer"
                disabled={localLoading}
              >
                <option value="CONDOLENCE">คำไว้อาลัยทั่วไป</option>
                <option value="MEMORY">แบ่งปันความทรงจำ</option>
                {isAdmin && (
                  <>
                    <option value="ANNOUNCEMENT">ประกาศสวดอภิธรรม/ฌาปนกิจ (ปักหมุด)</option>
                    <option value="MERIT">การร่วมทำบุญ/บริจาค</option>
                  </>
                )}
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600 font-medium">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="accent-emerald-600 w-4 h-4 rounded-md"
                  disabled={localLoading}
                />
                <span>โพสต์แบบไม่ระบุชื่อผู้ดูแล</span>
              </label>
            </div>
          </div>
        )}

        {/* Content Box */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">ข้อความไว้อาลัย</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="ร่วมเขียนคำรำลึก ร่วมจุดเทียน หรือเล่าเรื่องราวความทรงจำอันงดงามแด่ผู้ล่วงลับ..."
            rows={4}
            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-stone-850 text-xs resize-none focus:bg-white focus:outline-none"
            disabled={localLoading}
          />
        </div>

        {/* Media Upload */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">
            แนบภาพถ่ายความทรงจำ (ถ้ามี)
          </label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 px-4 py-2 border border-stone-200 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-semibold cursor-pointer active:scale-95 transition">
              <Camera className="w-4 h-4" />
              <span>{mediaFile ? 'เปลี่ยนรูปภาพ' : 'แนบรูปภาพ'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={localLoading}
              />
            </label>
            {mediaFile && (
              <span className="text-[11px] text-stone-500 truncate max-w-xs font-medium">
                📎 {mediaFile.name} ({(mediaFile.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
            )}
          </div>
        </div>

        {/* Spam Protection for Guests */}
        {!isLoggedIn && (
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
                disabled={localLoading}
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
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={localLoading || isSubmitting || !content.trim()}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white transition active:scale-95 flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm"
            style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
          >
            <PenTool className="w-4 h-4" />
            <span>{localLoading || isSubmitting ? 'กำลังส่งข้อมูล...' : 'เผยแพร่โพสต์'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
