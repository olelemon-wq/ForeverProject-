'use client';

import React, { useState } from 'react';
import { Camera, PenTool, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface MemoryPost {
  id: string;
  title: string | null;
  content: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  senderName: string;
  createdAt: string;
}

function MemoryPostCard({ p, parseMessage }: { p: MemoryPost; parseMessage: (msg: string | null) => React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const text = p.content || '';
  const shouldTruncate = text.length > 250;
  const displayText = shouldTruncate && !isExpanded ? text.slice(0, 220) + '...' : text;

  return (
    <div className="rounded-3xl border border-stone-200/80 bg-white p-6 flex flex-col justify-between shadow-sm min-h-[220px]">
      <div className="space-y-4">
        {p.mediaUrl && (
          <div className="w-full h-48 bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 relative flex items-center justify-center">
            <img 
              src={p.mediaUrl.startsWith('http') || p.mediaUrl.startsWith('/') ? p.mediaUrl : `/${p.mediaUrl}`} 
              alt={p.title || 'Memory Image'}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600';
              }}
            />
          </div>
        )}
        
        <div className="space-y-2 text-left">
          <div className="flex justify-between items-center gap-2">
            <span className="text-xs font-bold text-stone-900">โพสต์โดย: {p.senderName}</span>
            <span className="text-[10px] text-stone-450 font-semibold font-mono">
              {new Date(p.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          {p.title && <h4 className="text-sm font-bold text-stone-900" style={{ color: 'var(--theme-primary)' }}>{p.title}</h4>}
          {p.content && (
            <div>
              <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
                {parseMessage(displayText)}
              </p>
              {shouldTruncate && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-850 transition cursor-pointer mt-2 focus:outline-none flex items-center gap-0.5"
                  style={{ color: 'var(--theme-primary, #0d9488)' }}
                >
                  <span>{isExpanded ? 'ย่อข้อความ' : 'อ่านเพิ่มเติม'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MemoryWallClient({ 
  websiteId, 
  initialPosts 
}: { 
  websiteId: string; 
  initialPosts: MemoryPost[] 
}) {
  const [posts, setPosts] = useState<MemoryPost[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const [isOpen, setIsOpen] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  
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

  const insertFormatting = (tag: 'bold' | 'italic') => {
    const textarea = document.getElementById('memory-content-textarea') as HTMLTextAreaElement;
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
    setContent(newText);

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
    const textarea = document.getElementById('memory-content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const newText = text.substring(0, start) + emoji + text.substring(end);
    setContent(newText);

    // Reposition cursor after the inserted emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  const parseMessage = (msg: string | null) => {
    if (!msg) return '';
    const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
    const parts = msg.split(regex);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-extrabold text-stone-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="italic text-stone-850">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!senderName || (!content && !mediaFile)) {
      setError('กรุณากรอกชื่อผู้ส่ง และระบุเนื้อหาเรื่องราวหรือแนบรูปภาพความทรงจำ');
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
      let uploadedMediaUrl = '';
      if (mediaFile) {
        const quotaRes = await fetch('/api/media/upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            websiteId,
            fileName: mediaFile.name,
            fileType: mediaFile.type,
            fileSize: mediaFile.size,
          }),
        });
        const quotaData = await quotaRes.json();
        if (!quotaRes.ok) throw new Error(quotaData.error);

        if (quotaData.uploadUrl) {
          await fetch(quotaData.uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': mediaFile.type },
            body: mediaFile,
          });
        }

        uploadedMediaUrl = quotaData.filePath;
      }

      const res = await fetch('/api/memory/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId,
          title,
          content,
          mediaUrl: uploadedMediaUrl,
          mediaType: uploadedMediaUrl ? 'IMAGE' : 'NONE',
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
      setMediaFile(null);
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
            className="px-6 py-3 text-xs sm:text-sm font-semibold rounded-full text-white hover:brightness-105 active:scale-95 transition flex items-center gap-1.5 mx-auto"
            style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
          >
            <PenTool className="w-4 h-4" />
            <span>ร่วมเขียนบอกเล่าเรื่องราว</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl border border-stone-200 bg-white space-y-4 w-full shadow-xl relative animate-fade-in text-left">
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
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">
              แนบรูปภาพความทรงจำ (ถ้ามี)
            </label>
            <input 
              type="file" 
              accept="image/*"
              key={mediaFile ? mediaFile.name : 'empty'}
              onChange={(e) => setMediaFile(e.target.files ? e.target.files[0] : null)}
              className="w-full text-stone-500 text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:bg-stone-200 file:text-stone-700 hover:file:bg-stone-300 cursor-pointer"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">เนื้อหาเรื่องเล่าบอกต่อความทรงจำ</label>
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

              <div className="h-4 w-px bg-stone-200 mx-1"></div>

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
              id="memory-content-textarea"
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
              className="px-5 py-2 text-xs font-bold rounded-xl text-white hover:brightness-105 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
              disabled={isLoading}
            >
              <PenTool className="w-4 h-4" />
              <span>{isLoading ? 'กำลังส่งข้อมูล...' : 'เผยแพร่เรื่องราว'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Memory posts board grid list */}
      {(() => {
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
        const totalPages = Math.ceil(posts.length / postsPerPage);

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.length === 0 ? (
                <div className="col-span-full text-center py-12 text-stone-500 text-sm border border-dashed border-stone-250 rounded-3xl">
                  ยังไม่มีผู้ร่วมแชร์เรื่องราวกระดานความทรงจำในขณะนี้
                </div>
              ) : (
                currentPosts.map(p => (
                  <MemoryPostCard key={p.id} p={p} parseMessage={parseMessage} />
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      currentPage === pageNumber
                        ? 'text-white bg-emerald-600 shadow-sm'
                        : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                    style={currentPage === pageNumber ? { backgroundColor: 'var(--theme-primary, #0d9488)' } : {}}
                  >
                    {pageNumber}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
