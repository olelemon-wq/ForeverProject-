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

const getFormLabels = (category: string) => {
  if (category === 'Couple' || category === 'Wedding') {
    return {
      title: 'แชร์เรื่องราวความทรงจำแสนรัก',
      subtitle: 'เขียนบอกเล่าเรื่องราวความประทับใจและความรู้สึกดี ๆ ระหว่างเรา',
      btnText: 'ร่วมเขียนบอกเล่าเรื่องราว',
      ctaTitle: 'ร่วมแบ่งปันเรื่องราวความทรงจำแสนรัก',
      ctaDesc: 'คุณสามารถโพสต์รูปถ่ายในอดีต บันทึกเรื่องเล่าสั้น หรือคำอวยพรที่คุณมีต่อคู่รัก เพื่อเก็บบันทึกความทรงจำแสนรักร่วมกัน',
      writerLabel: 'ชื่อผู้ร่วมอวยพร / เพื่อนรัก',
      writerPlaceholder: 'เช่น เพื่อนสนิทกิ่งแก้ว',
      topicLabel: 'หัวข้อเรื่องราว (ระบุหรือไม่ก็ได้)',
      topicPlaceholder: 'เช่น ทริปประทับใจ หรือ ยินดีกับคู่บ่าวสาว',
      contentPlaceholder: 'ร่วมแบ่งปันเรื่องราวน่ารักๆ ความประทับใจ หรือคำอวยพรหวานๆ แด่คู่รัก...',
      emojiLabel: 'เลือกรูปแบบข้อความหรือใส่อีโมจิความรัก/อวยพร',
      emojis: [
        { char: '❤️', label: 'หัวใจแดง' },
        { char: '💖', label: 'หัวใจประกาย' },
        { char: '✨', label: 'ประกายวิบวับ' },
        { char: '🥂', label: 'ชนแก้ว' },
        { char: '💐', label: 'ช่อดอกไม้' },
        { char: '💍', label: 'แหวน' },
        { char: '🎉', label: 'ปาร์ตี้' },
      ],
    };
  }
  if (category === 'Pet Memorial') {
    return {
      title: 'แชร์เรื่องราวบันทึกการเดินทางของน้อง',
      subtitle: 'ร่วมแบ่งปันช่วงเวลาแสนสุข ความน่ารัก และความทรงจำดี ๆ ที่มีต่อน้อง',
      btnText: 'ร่วมเขียนบันทึกส่งน้อง',
      ctaTitle: 'ร่วมแบ่งปันบันทึกการเดินทางของน้อง',
      ctaDesc: 'คุณสามารถโพสต์รูปถ่ายของน้อง เขียนเรื่องเล่าสุนัข/แมว หรือบันทึกความทรงจำ เพื่อแชร์ไดอารี่การเดินทางของน้องร่วมกัน',
      writerLabel: 'ชื่อพี่ ๆ / แฟนคลับน้อง',
      writerPlaceholder: 'เช่น พี่สมดี / มะหมาแฟนคลับ',
      topicLabel: 'หัวข้อความทรงจำ (ระบุหรือไม่ก็ได้)',
      topicPlaceholder: 'เช่น วีรกรรมความซน หรือ วันแรกที่เจอกัน',
      contentPlaceholder: 'ร่วมแบ่งปันความซน ความน่ารัก หรือเขียนคำอำลาส่งน้องกลับดาวบริวาร...',
      emojiLabel: 'เลือกรูปแบบข้อความหรือใส่อีโมจิส่งน้องกลับดาว',
      emojis: [
        { char: '🐾', label: 'อุ้งเท้า' },
        { char: '🐶', label: 'น้องหมา' },
        { char: '🐱', label: 'น้องแมว' },
        { char: '🌈', label: 'สายรุ้ง' },
        { char: '✨', label: 'ประกายวิบวับ' },
        { char: '🤍', label: 'หัวใจขาว' },
        { char: '🧸', label: 'ตุ๊กตาหมี' },
      ],
    };
  }
  if (category === 'Family Legacy') {
    return {
      title: 'บันทึกสายใยความผูกพันตระกูล',
      subtitle: 'ร่วมบันทึกความทรงจำ คำสอน หรือความผูกพันของสมาชิกในครอบครัว',
      btnText: 'ร่วมเขียนบันทึกความผูกพัน',
      ctaTitle: 'ร่วมบันทึกสายใยความผูกพันในตระกูล',
      ctaDesc: 'คุณสามารถโพสต์รูปถ่ายครอบครัว บันทึกคำสอน หรือเรื่องราวของเครือญาติ เพื่อบันทึกความรักความผูกพันในตระกูลร่วมกัน',
      writerLabel: 'ชื่อลูกหลาน / สมาชิกครอบครัว',
      writerPlaceholder: 'เช่น หลานสะใภ้พิมพ์ใจ',
      topicLabel: 'หัวข้อบันทึก (ระบุหรือไม่ก็ได้)',
      topicPlaceholder: 'เช่น คำสั่งสอนอันทรงคุณค่า หรือ บันทึกวันรวมญาติ',
      contentPlaceholder: 'ร่วมบันทึกคุณงามความดี คำสอน หรือแชร์ภาพบรรยากาศความผูกพันในตระกูล...',
      emojiLabel: 'เลือกรูปแบบข้อความหรือใส่อีโมจิครอบครัว',
      emojis: [
        { char: '🌳', label: 'ต้นไม้ตระกูล' },
        { char: '🏠', label: 'บ้าน' },
        { char: '👨‍👩‍👧‍👦', label: 'ครอบครัว' },
        { char: '🤍', label: 'หัวใจขาว' },
        { char: '📜', label: 'บันทึก' },
        { char: '🕯️', label: 'เทียน' },
        { char: '🙏', label: 'ไหว้' },
      ],
    };
  }
  if (category === 'Friends') {
    return {
      title: 'แชร์เรื่องราววีรกรรมวันวาน',
      subtitle: 'เขียนบอกเล่าเรื่องราวความสนุก มิตรภาพ และความทรงจำร่วมกัน',
      btnText: 'ร่วมเขียนย้อนวันวาน',
      ctaTitle: 'ร่วมแชร์วีรกรรมความสนุกวันวาน',
      ctaDesc: 'คุณสามารถโพสต์รูปภาพวันวาน เขียนวีรกรรมสุดฮา หรือความทรงจำมิตรภาพ เพื่อย้อนเวลาความประทับใจร่วมกัน',
      writerLabel: 'ชื่อเพื่อนรัก / เพื่อนร่วมรุ่น',
      writerPlaceholder: 'เช่น เพื่อนห้อง 4/2 หรือ สมชายสายลุย',
      topicLabel: 'หัวข้อเรื่องเล่า (ระบุหรือไม่ก็ได้)',
      topicPlaceholder: 'เช่น วีรกรรมสุดป่วนสมัยเรียน หรือ มิตรภาพที่ยั่งยืน',
      contentPlaceholder: 'ร่วมย้อนวันวาน ย้อนเรื่องราวสุดป่วน หรือเสียงหัวเราะที่มีร่วมกัน...',
      emojiLabel: 'เลือกรูปแบบข้อความหรือใส่อีโมจิมิตรภาพ',
      emojis: [
        { char: '🎓', label: 'หมวกปริญญา' },
        { char: '🍻', label: 'ชนแก้ว' },
        { char: '📸', label: 'กล้องถ่ายรูป' },
        { char: '🎒', label: 'กระเป๋าเป้' },
        { char: '💬', label: 'กล่องแชท' },
        { char: '💛', label: 'หัวใจเหลือง' },
        { char: '✨', label: 'ประกาย' },
      ],
    };
  }
  return {
    title: 'แชร์เรื่องราวกระดานความทรงจำ',
    subtitle: 'เขียนบอกเล่าเรื่องราวประทับใจและความรู้สึกระหว่างเรา',
    btnText: 'ร่วมเขียนบอกเล่าเรื่องราว',
    ctaTitle: 'ร่วมแบ่งปันเรื่องราวความทรงจำอันงดงาม',
    ctaDesc: 'คุณสามารถโพสต์รูปถ่ายในอดีต บันทึกเรื่องเล่าสั้น หรือความประทับใจที่คุณมีต่อผู้ล่วงลับ เพื่อเก็บบันทึกความทรงจำร่วมกัน',
    writerLabel: 'ชื่อผู้ร่วมรำลึก',
    writerPlaceholder: 'เช่น หลานสมฤดี',
    topicLabel: 'หัวข้อเรื่องเล่า (ระบุหรือไม่ก็ได้)',
    topicPlaceholder: 'เช่น ภาพความประทับใจสมัยเด็ก',
    contentPlaceholder: 'ร่วมแบ่งปันความประทับใจหรือบรรยายรูปภาพนี้...',
    emojiLabel: 'เลือกรูปแบบข้อความหรือใส่อีโมจิไว้อาลัย',
    emojis: [
      { char: '🕯️', label: 'เทียนไว้อาลัย' },
      { char: '🕊️', label: 'นกพิราบความสงบ' },
      { char: '🙏', label: 'ไหว้เคารพ' },
      { char: '🤍', label: 'หัวใจสีขาว' },
      { char: '🥀', label: 'ดอกไม้เหี่ยว' },
      { char: '🖤', label: 'หัวใจสีดำ' },
      { char: '🌹', label: 'ดอกไม้ระลึกถึง' },
    ],
  };
};

function MemoryPostCard({ p, parseMessage }: { p: MemoryPost; parseMessage: (msg: string | null) => React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const text = p.content || '';
  const shouldTruncate = text.length > 250;
  const displayText = shouldTruncate && !isExpanded ? text.slice(0, 220) + '...' : text;

  return (
    <div className="relative py-6 pl-1 transition flex flex-col md:flex-row gap-6 items-start text-left w-full">
      <div className="flex-1 min-w-0 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-stone-850">
            {p.senderName}
          </span>
          <span className="text-[10px] text-stone-450 font-semibold font-mono ml-auto">
            {new Date(p.createdAt).toLocaleDateString('th-TH', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>

        {p.title && (
          <h4 className="text-sm font-bold text-stone-900" style={{ color: 'var(--theme-primary, #0d9488)' }}>
            {p.title}
          </h4>
        )}

        {p.content && (
          <div className="space-y-1">
            <p className="text-stone-605 text-xs sm:text-sm leading-relaxed whitespace-pre-line break-words">
              "{parseMessage(displayText)}"
            </p>
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[10px] font-bold text-emerald-700 hover:text-emerald-850 transition cursor-pointer mt-1 focus:outline-none flex items-center gap-0.5"
                style={{ color: 'var(--theme-primary, #0d9488)' }}
              >
                <span>{isExpanded ? 'ย่อข้อความ' : 'อ่านเพิ่มเติม'}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {p.mediaUrl && (
        <div className="w-full md:w-44 flex-shrink-0 mt-3 md:mt-0">
          <div className="relative rounded-2xl overflow-hidden bg-stone-50 border border-stone-200/80 md:aspect-square flex items-center justify-center shadow-sm max-w-full mx-auto md:mx-0">
            <img 
              src={p.mediaUrl.startsWith('http') || p.mediaUrl.startsWith('/') ? p.mediaUrl : `/${p.mediaUrl}`} 
              alt={p.title || 'Memory Image'}
              className="max-h-64 sm:max-h-72 md:max-h-none md:w-full md:h-full object-contain md:object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function MemoryWallClient({ 
  websiteId, 
  initialPosts,
  category = 'Memorial'
}: { 
  websiteId: string; 
  initialPosts: MemoryPost[];
  category?: string;
}) {
  const [posts, setPosts] = useState<MemoryPost[]>(initialPosts);
  const mLabels = getFormLabels(category);
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
            {mLabels.ctaTitle}
          </h3>
          <p className="text-stone-500 text-xs mb-6 max-w-md mx-auto leading-normal">
            {mLabels.ctaDesc}
          </p>
          <button 
            onClick={openForm}
            className="px-6 py-3 text-xs sm:text-sm font-semibold rounded-full text-white hover:brightness-105 active:scale-95 transition flex items-center gap-1.5 mx-auto"
            style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
          >
            <PenTool className="w-4 h-4" />
            <span>{mLabels.btnText}</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl border border-stone-200 bg-white space-y-4 w-full shadow-xl relative animate-fade-in text-left">
          <header className="flex justify-between items-center border-b border-stone-200 pb-3">
            <h3 className="text-base font-bold text-stone-900">{mLabels.title}</h3>
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
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">{mLabels.writerLabel}</label>
              <input 
                type="text" 
                value={senderName} 
                onChange={(e) => setSenderName(e.target.value)} 
                placeholder={mLabels.writerPlaceholder}
                className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-850 text-xs focus:bg-white focus:outline-none"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">{mLabels.topicLabel}</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder={mLabels.topicPlaceholder}
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
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide block mb-1">รายละเอียดและเนื้อเรื่องเล่า</label>
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
                {mLabels.emojis.map((item) => (
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
                {mLabels.emojiLabel}
              </span>
            </div>
            <textarea 
              id="memory-content-textarea"
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder={mLabels.contentPlaceholder}
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
            {posts.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-sm border border-dashed border-stone-250 rounded-3xl bg-white shadow-sm">
                ยังไม่มีผู้ร่วมแชร์เรื่องราวกระดานความทรงจำในขณะนี้
              </div>
            ) : (
              <div className="divide-y divide-stone-150">
                {currentPosts.map(p => (
                  <MemoryPostCard key={p.id} p={p} parseMessage={parseMessage} />
                ))}
              </div>
            )}

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
