'use client';

import React, { useState } from 'react';

interface MemoryPost {
  id: string;
  title: string | null;
  content: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  senderName: string;
  createdAt: string;
}

export default function MemoryWallClient({ 
  websiteId, 
  initialPosts 
}: { 
  websiteId: string; 
  initialPosts: MemoryPost[] 
}) {
  const [posts, setPosts] = useState<MemoryPost[]>(initialPosts);
  const [isOpen, setIsOpen] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Math Captcha bot protection
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 1; // 1-9
    const num2 = Math.floor(Math.random() * 9) + 1; // 1-9
    setCaptchaQuestion({ num1, num2, answer: num1 + num2 });
    setUserAnswer('');
  };

  const openForm = () => {
    generateCaptcha();
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!senderName || (!content && !mediaUrl)) {
      setError('กรุณากรอกชื่อผู้ส่ง และระบุเนื้อหาเรื่องราวหรือป้อนที่อยู่รูปภาพ');
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
      const res = await fetch('/api/memory/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId,
          title,
          content,
          mediaUrl,
          mediaType: mediaUrl ? 'IMAGE' : 'NONE',
          senderName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('ส่งเรื่องราวของคุณขึ้นกระดานความทรงจำสำเร็จแล้ว และจะแสดงผลเมื่อผู้ดูแลอนุมัติ');
      setSenderName('');
      setTitle('');
      setContent('');
      setMediaUrl('');
      setUserAnswer('');
      
      // Auto close after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการแชร์เรื่องราว');
      generateCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Write a Story Call to Action button */}
      {!isOpen ? (
        <div className="p-8 rounded-3xl border border-dashed border-stone-300 bg-white text-center shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-stone-850 mb-2">
            ร่วมแบ่งปันเรื่องราวความทรงจำอันงดงาม
          </h3>
          <p className="text-stone-500 text-xs mb-6 max-w-md mx-auto leading-normal">
            คุณสามารถโพสต์รูปถ่ายในอดีต บันทึกเรื่องเล่าสั้น หรือความประทับใจที่คุณมีต่อผู้ล่วงลับ เพื่อเก็บบันทึกความทรงจำร่วมกัน
          </p>
          <button 
            onClick={openForm}
            className="px-6 py-3 text-xs sm:text-sm font-semibold rounded-full text-white hover:brightness-105 active:scale-95 transition"
            style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
          >
            ✍️ ร่วมเขียนบอกเล่าเรื่องราว
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl border border-stone-200 bg-white space-y-4 max-w-xl mx-auto shadow-xl relative animate-fade-in text-left">
          <header className="flex justify-between items-center border-b border-stone-200 pb-3">
            <h3 className="text-base font-bold text-stone-900">แชร์เรื่องราวกระดานความทรงจำ</h3>
            <button 
              type="button" 
              onClick={() => setIsOpen(false)} 
              className="text-xs text-stone-400 hover:text-stone-700 transition"
            >
              ปิดฟอร์ม [x]
            </button>
          </header>

          {error && <div className="p-3 bg-red-5 border border-red-200 rounded-xl text-xs text-red-700 font-medium">⚠️ {error}</div>}
          {success && <div className="p-3 bg-emerald-5 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium">✓ {success}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">ชื่อผู้ร่วมรำลึก</label>
              <input 
                type="text" 
                value={senderName} 
                onChange={(e) => setSenderName(e.target.value)} 
                placeholder="เช่น หลานสมฤดี"
                className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-850 text-xs focus:bg-white focus:outline-none"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">หัวข้อเรื่องเล่า (ระบุหรือไม่ก็ได้)</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="เช่น ภาพความประทับใจสมัยเด็ก"
                className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-850 text-xs focus:bg-white focus:outline-none"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">ที่อยู่อ้างอิงลิงก์รูปถ่าย (ถ้ามี)</label>
            <input 
              type="text" 
              value={mediaUrl} 
              onChange={(e) => setMediaUrl(e.target.value)} 
              placeholder="วางที่อยู่ลิงก์รูปภาพ เช่น https://..."
              className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-850 text-xs focus:bg-white focus:outline-none"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">เนื้อหาเรื่องเล่าบอกต่อความทรงจำ</label>
            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="ร่วมแบ่งปันความประทับใจหรือบรรยายรูปภาพนี้..."
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
                className="px-3 py-2 text-xs bg-stone-100 text-stone-500 hover:text-stone-800 rounded-xl border border-stone-200 transition"
                title="เปลี่ยนคำถาม"
              >
                🔄
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
              className="px-5 py-2 text-xs font-bold rounded-xl text-white hover:brightness-105 transition"
              style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
              disabled={isLoading}
            >
              {isLoading ? 'กำลังส่งข้อมูล...' : '✍️ เผยแพร่เรื่องราว'}
            </button>
          </div>
        </form>
      )}

      {/* Memory posts board grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-stone-500 text-sm border border-dashed border-stone-250 rounded-3xl">
            ยังไม่มีผู้ร่วมแชร์เรื่องราวกระดานความทรงจำในขณะนี้
          </div>
        ) : (
          posts.map(p => (
            <div key={p.id} className="rounded-3xl border border-stone-200/80 bg-white p-6 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                {p.mediaUrl && (
                  <div className="w-full h-48 bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 relative flex items-center justify-center">
                    <span className="text-4xl text-stone-400">📸</span>
                    {/* Placeholder visual link indicator */}
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[8px] bg-black/60 text-white font-mono">{p.mediaUrl.substring(0, 20)}...</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">โพสต์โดย: {p.senderName}</span>
                    <span className="text-[10px] text-stone-450 font-semibold font-mono">
                      {new Date(p.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {p.title && <h4 className="text-sm font-bold text-stone-900" style={{ color: 'var(--theme-primary)' }}>{p.title}</h4>}
                  {p.content && <p className="text-xs text-stone-600 leading-relaxed">{p.content}</p>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
