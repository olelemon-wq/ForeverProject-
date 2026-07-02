'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function ShareButton({ slug }: { slug: string }) {
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

  return (
    <button 
      type="button"
      onClick={handleShare}
      className={`
        flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95
        ${copied 
          ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
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
  );
}
