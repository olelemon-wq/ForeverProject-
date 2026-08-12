'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Expand,
  Heart,
  PawPrint,
  PenTool,
  RotateCw,
  Shield,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { resolveMediaSrc } from '@/lib/mediaUrl';
import GalleryImageLightbox from '@/components/public/GalleryImageLightbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface MemoryPost {
  id: string;
  title: string | null;
  content: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  senderName: string;
  createdAt: string;
}

const getEmptyStateText = (category: string) => {
  if (category === 'Couple') {
    return 'ยังไม่มีบันทึก — เริ่มเขียนเรื่องราวแรกของเราได้เลย';
  }
  if (category === 'Pet Memorial') {
    return 'ยังไม่มีใครแชร์เรื่องราว — เป็นคนแรกที่เขียนบันทึกความทรงจำของน้องได้เลย';
  }
  if (category === 'Friends') {
    return 'ยังไม่มีใครแชร์เรื่องราว — เป็นคนแรกที่เล่าวีรกรรมวันวานได้เลย';
  }
  if (category === 'Wedding') {
    return 'ยังไม่มีใครแชร์เรื่องราว — เป็นคนแรกที่เขียนคำอวยพรได้เลย';
  }
  return 'ยังไม่มีใครแชร์เรื่องราว — เป็นคนแรกที่เขียนบันทึกความทรงจำได้เลย';
};

const getFormLabels = (category: string) => {
  if (category === 'Couple') {
    return {
      title: 'เขียนไดอารี่ความทรงจำ',
      subtitle: 'บันทึกช่วงเวลาที่อยากเก็บไว้ ย้อนอ่านความรู้สึกดี ๆ ของเราสองคน',
      btnText: 'ร่วมเขียนบันทึกความทรงจำ',
      ctaTitle: 'ร่วมเขียนไดอารี่ความทรงจำ',
      ctaDesc: 'โพสต์รูป เขียนเรื่องเล่า หรือบันทึกช่วงเวลาที่อยากเก็บไว้ — ไว้ย้อนอ่านความรู้สึกดี ๆ ของเราสองคน',
      writerLabel: 'ชื่อผู้เขียน',
      writerPlaceholder: 'เช่น เราสองคน / คนที่หนึ่ง',
      topicLabel: 'หัวข้อบันทึก (ระบุหรือไม่ก็ได้)',
      topicPlaceholder: 'เช่น ทริปประทับใจ หรือ วันที่เราเจอกัน',
      contentPlaceholder: 'เล่าเรื่องราว ความประทับใจ หรือความรู้สึกที่อยากเก็บไว้...',
      emojiLabel: 'เลือกรูปแบบข้อความหรือใส่อีโมจิความรัก',
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
  if (category === 'Wedding') {
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
      contentPlaceholder: 'ร่วมแบ่งปันเรื่องราวน่ารื่น ความประทับใจ หรือคำอวยพรหวาน ๆ แด่คู่รัก...',
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
      title: 'ไดอารี่ความสุข',
      subtitle: 'ร่วมแบ่งปันช่วงเวลาแสนสุข ความน่ารัก และเรื่องราวของน้อง',
      btnText: 'ร่วมเขียนบันทึก',
      ctaTitle: 'ร่วมแบ่งปันเรื่องราวของน้อง',
      ctaDesc: 'โพสต์รูป เขียนเรื่องเล่า หรือบันทึกโมเมนต์น่ารักของน้อง เพื่อแชร์ไดอารี่ร่วมกัน',
      writerLabel: 'ชื่อพี่ ๆ / คนรักน้อง',
      writerPlaceholder: 'เช่น พี่สมดี / มะหมาแฟนคลับ',
      topicLabel: 'หัวข้อ (ระบุหรือไม่ก็ได้)',
      topicPlaceholder: 'เช่น วีรกรรมความซน หรือ วันแรกที่เจอกัน',
      contentPlaceholder: 'เล่าความซน ความน่ารัก หรือช่วงเวลาที่อยากเก็บไว้...',
      emojiLabel: 'เลือกรูปแบบข้อความหรืออีโมจิ',
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

function MemoryPostCard({
  p,
  parseMessage,
  postIcon: PostIcon,
  onImageClick,
}: {
  p: MemoryPost;
  parseMessage: (msg: string | null) => React.ReactNode;
  postIcon: LucideIcon;
  onImageClick?: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const text = p.content || '';
  const shouldTruncate = text.length > 250;
  const displayText = shouldTruncate && !isExpanded ? `${text.slice(0, 220)}...` : text;

  return (
    <article className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8 lg:gap-10">
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex items-start gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--theme-primary, #0d9488) 10%, white)',
            }}
          >
            <PostIcon
              className="h-4 w-4"
              style={{ color: 'var(--theme-primary, #0d9488)' }}
              aria-hidden
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-stone-900">{p.senderName}</span>
              <time
                dateTime={p.createdAt}
                className="ml-auto rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-400"
              >
                {new Date(p.createdAt).toLocaleDateString('th-TH', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </time>
            </div>
          </div>
        </div>

        {p.title && (
          <h4
            className="text-sm font-bold text-stone-900 sm:text-base"
            style={{ color: 'var(--theme-primary, #0d9488)' }}
          >
            {p.title}
          </h4>
        )}

        {p.content && (
          <div className="space-y-1.5">
            <p className="whitespace-pre-line break-words text-sm leading-relaxed text-stone-600">
              {parseMessage(displayText)}
            </p>
            {shouldTruncate && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-bold transition hover:opacity-80"
                style={{ color: 'var(--theme-primary, #0d9488)' }}
              >
                {isExpanded ? 'ย่อข้อความ' : 'อ่านเพิ่มเติม'}
              </button>
            )}
          </div>
        )}
      </div>

      {p.mediaUrl && (
        <button
          type="button"
          onClick={onImageClick}
          className="group relative mx-auto w-full max-w-sm shrink-0 overflow-hidden rounded-2xl border border-stone-200/50 bg-stone-50/80 shadow-none sm:mx-0 sm:ml-auto sm:w-36 sm:opacity-90 md:w-40 lg:opacity-[0.85]"
          aria-label={`ขยายรูปจาก ${p.senderName}`}
        >
          <img
            src={resolveMediaSrc(p.mediaUrl)}
            alt={p.title || `รูปจาก ${p.senderName}`}
            className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02] sm:aspect-square"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
            <span className="flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">
              <Expand className="h-3.5 w-3.5" aria-hidden />
              ขยาย
            </span>
          </span>
        </button>
      )}
    </article>
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const PostIcon =
    category === 'Pet Memorial' ? PawPrint : category === 'Couple' ? Heart : PenTool;

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการแชร์เรื่องราว';
      setError(message);
      generateCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const lightboxItems = useMemo(
    () =>
      currentPosts
        .filter((p) => p.mediaUrl)
        .map((p) => ({
          id: p.id,
          displayUrl: resolveMediaSrc(p.mediaUrl!),
          fileName: p.title || `รูปจาก ${p.senderName}`,
        })),
    [currentPosts],
  );

  return (
    <div className="space-y-10">
      <div className="space-y-8">
        {posts.length === 0 ? (
          <div
            className={`rounded-2xl border border-dashed px-6 py-14 text-center ${
              category === 'Couple'
                ? 'border-[#EDD5C8]/70 bg-white/50'
                : 'border-stone-200 bg-white/60'
            }`}
          >
            <PostIcon
              className="mx-auto mb-3 h-8 w-8 opacity-30"
              style={{ color: 'var(--theme-primary, #0d9488)' }}
              aria-hidden
            />
            <p className="text-sm text-stone-500">{getEmptyStateText(category)}</p>
          </div>
        ) : (
          <ul className="space-y-8">
            {currentPosts.map((p) => (
              <li key={p.id}>
                <MemoryPostCard
                  p={p}
                  parseMessage={parseMessage}
                  postIcon={PostIcon}
                  onImageClick={
                    p.mediaUrl
                      ? () => {
                          const idx = lightboxItems.findIndex((item) => item.id === p.id);
                          if (idx >= 0) setLightboxIndex(idx);
                        }
                      : undefined
                  }
                />
              </li>
            ))}
          </ul>
        )}

        <GalleryImageLightbox
          items={lightboxItems}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="cursor-pointer rounded-xl border border-stone-200 p-2 text-stone-600 transition hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setCurrentPage(pageNumber)}
                className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  currentPage === pageNumber
                    ? 'text-white shadow-sm'
                    : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
                style={
                  currentPage === pageNumber
                    ? { backgroundColor: 'var(--theme-primary, #0d9488)' }
                    : {}
                }
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="cursor-pointer rounded-xl border border-stone-200 p-2 text-stone-600 transition hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div
        className={`border-t pt-8 ${
          category === 'Couple' ? 'border-[#EDD5C8]/60' : 'border-stone-200/80'
        }`}
      >
        {!isOpen ? (
          <div className="space-y-4 text-center">
            <div
              className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${
                category === 'Couple' ? 'bg-white/70' : 'bg-white/80'
              }`}
            >
              <UserRound
                className="h-5 w-5"
                style={{ color: 'var(--theme-primary, #0d9488)' }}
                aria-hidden
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-stone-900 sm:text-lg">{mLabels.ctaTitle}</h3>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-stone-500">
                {mLabels.ctaDesc}
              </p>
            </div>
            <Button
              type="button"
              onClick={openForm}
              className="mx-auto min-h-11 rounded-full px-6 text-sm font-bold text-white hover:brightness-105"
              style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
            >
              <PenTool className="h-4 w-4" aria-hidden />
              {mLabels.btnText}
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="animate-fade-in space-y-5 rounded-2xl border border-stone-200/80 bg-white/80 p-6 text-left shadow-sm sm:p-8"
          >
            <header className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-stone-900">{mLabels.title}</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs text-stone-400 transition hover:text-stone-700"
              >
                ปิดฟอร์ม
              </button>
            </header>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{success}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="memory-sender">{mLabels.writerLabel}</Label>
                <Input
                  id="memory-sender"
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder={mLabels.writerPlaceholder}
                  className="min-h-10 rounded-xl bg-stone-50/80"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="memory-title">{mLabels.topicLabel}</Label>
                <Input
                  id="memory-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={mLabels.topicPlaceholder}
                  className="min-h-10 rounded-xl bg-stone-50/80"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="memory-photo">แนบรูปภาพความทรงจำ (ถ้ามี)</Label>
              <Input
                id="memory-photo"
                type="file"
                accept="image/*"
                key={mediaFile ? mediaFile.name : 'empty'}
                onChange={(e) => setMediaFile(e.target.files ? e.target.files[0] : null)}
                className="min-h-10 rounded-xl bg-stone-50/80 file:mr-3 file:rounded-lg file:border-0 file:bg-stone-200 file:px-3 file:py-1.5 file:text-xs file:font-semibold"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memory-content-textarea">รายละเอียดและเนื้อเรื่องเล่า</Label>
              <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertFormatting('bold')}
                  className="h-7 rounded-lg px-2.5 text-xs font-black"
                >
                  B
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertFormatting('italic')}
                  className="h-7 rounded-lg px-2.5 text-xs italic"
                >
                  I
                </Button>
                <div className="mx-1 h-4 w-px bg-stone-200" />
                <div className="flex items-center gap-1">
                  {mLabels.emojis.map((item) => (
                    <button
                      key={item.char}
                      type="button"
                      onClick={() => insertEmoji(item.char)}
                      className="cursor-pointer rounded-md p-1 text-sm transition hover:bg-stone-100 active:scale-90"
                      title={item.label}
                    >
                      {item.char}
                    </button>
                  ))}
                </div>
                <span className="ml-auto hidden text-xs text-stone-400 sm:inline">
                  {mLabels.emojiLabel}
                </span>
              </div>
              <Textarea
                id="memory-content-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={mLabels.contentPlaceholder}
                rows={4}
                className="min-h-28 rounded-xl bg-stone-50/80"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2 rounded-2xl border border-stone-200 bg-stone-50/80 p-4">
              <Label className="flex items-center gap-1.5 text-stone-700">
                <Shield className="h-3.5 w-3.5" aria-hidden />
                การป้องกันสแปมบอท (กรุณาคำนวณผลลัพธ์)
              </Label>
              <div className="flex items-center gap-3">
                <span className="select-none rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-bold text-stone-800">
                  {captchaQuestion.num1} + {captchaQuestion.num2} = ?
                </span>
                <Input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="คำตอบของคุณ"
                  className="min-h-10 flex-1 rounded-xl bg-white"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={generateCaptcha}
                  className="shrink-0 rounded-xl"
                  title="เปลี่ยนคำถาม"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="min-h-10 rounded-xl"
                disabled={isLoading}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                className="min-h-10 rounded-xl text-white"
                style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
                disabled={isLoading}
              >
                <PenTool className="h-4 w-4" aria-hidden />
                {isLoading ? 'กำลังส่งข้อมูล...' : 'เผยแพร่เรื่องราว'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
