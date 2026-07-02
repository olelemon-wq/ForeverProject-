'use client';

import React, { useState } from 'react';
import { Share2, Check, Download, Loader2 } from 'lucide-react';

export default function AnnouncementControls({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    
    // Construct public share URL
    const shareUrl = `${window.location.origin}/${slug}/announcement`;
    
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const [downloading, setDownloading] = useState(false);

  const handleDownloadImage = async () => {
    if (typeof window === 'undefined') return;
    const cardEl = document.getElementById('announcement-card');
    if (!cardEl) return;

    setDownloading(true);
    try {
      const { toPng } = await import('html-to-image');
      
      // Generate PNG at 2x pixel ratio for extremely sharp text when shared
      const dataUrl = await toPng(cardEl, {
        cacheBust: true,
        pixelRatio: 2,
        style: {
          width: '672px',
          maxWidth: '672px',
          margin: '0',
          transform: 'none',
        }
      });

      const link = document.createElement('a');
      link.download = `announcement-${slug}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to save card as image:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex gap-2 w-full sm:w-auto">
      <button 
        type="button"
        onClick={handleShare}
        className={`
          flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95
          ${copied 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold' 
            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-bold'
          }
        `}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>คัดลอกลิงก์แล้ว!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5" />
            <span>แชร์การ์ดประกาศ</span>
          </>
        )}
      </button>

      <button 
        type="button"
        onClick={handleDownloadImage}
        disabled={downloading}
        className="flex-1 sm:flex-none px-4 py-2 bg-stone-100 hover:bg-stone-200/80 active:scale-95 text-stone-850 text-xs font-bold rounded-xl border border-stone-200 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {downloading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>กำลังเซฟรูปภาพ...</span>
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5" />
            <span>บันทึกเป็นรูปภาพ</span>
          </>
        )}
      </button>
    </div>
  );
}
