'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Smile, MessageSquare, Share2 } from 'lucide-react';
import { useMemorialFeedStore } from '@/stores/useMemorialFeedStore';

interface ReactionBarProps {
  postId: string;
  slug: string;
  reactionCounts: {
    PRAY: number;
    LOVE: number;
    CANDLE: number;
    FLOWER: number;
  };
  userReaction: 'PRAY' | 'LOVE' | 'CANDLE' | 'FLOWER' | null;
  commentsCount: number;
  onCommentClick?: () => void;
}

// Reusable Image Renderer for high-resolution static reaction JPEG assets
// 0: icon1.jpg (Ribbon), 1: icon2.jpg (Heart), 2: icon4.jpg (Candle), 3: icon3.jpg (Lotus)
interface IconsetSpriteProps {
  index: number;
  size?: number;
  className?: string;
}

export function IconsetSprite({ index, size = 18, className = '' }: IconsetSpriteProps) {
  const iconUrls = [
    '/iconset/icon1.jpg', // 0: Ribbon
    '/iconset/icon2.jpg', // 1: Heart
    '/iconset/icon4.jpg', // 2: Candle (mapped from icon4)
    '/iconset/icon3.jpg', // 3: Lotus (mapped from icon3)
  ];

  return (
    <img
      src={iconUrls[index]}
      alt={`reaction-${index}`}
      width={size}
      height={size}
      className={`inline-block shrink-0 object-contain rounded-full transition-transform ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      onError={(e) => {
        (e.target as HTMLImageElement).style.backgroundColor = '#f5f5f4';
      }}
    />
  );
}

export default function ReactionBar({
  postId,
  slug,
  reactionCounts,
  userReaction,
  commentsCount,
  onCommentClick,
}: ReactionBarProps) {
  const toggleReaction = useMemorialFeedStore((state) => state.toggleReaction);
  const [showPicker, setShowPicker] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const pickerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shareTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);

  const reactionsConfig = [
    {
      type: 'PRAY' as const,
      label: 'สาธุ',
      spriteIndex: 3,
      activeColor: 'text-amber-600',
      activeBg: 'bg-amber-50 border-amber-200/50',
      textColor: 'text-amber-600',
      hoverBg: 'hover:bg-stone-50',
    },
    {
      type: 'LOVE' as const,
      label: 'รักและคิดถึง',
      spriteIndex: 1,
      activeColor: 'text-rose-600',
      activeBg: 'bg-rose-50 border-rose-200/50',
      textColor: 'text-rose-600',
      hoverBg: 'hover:bg-rose-50',
    },
    {
      type: 'CANDLE' as const,
      label: 'จุดเทียนรำลึก',
      spriteIndex: 2,
      activeColor: 'text-orange-600',
      activeBg: 'bg-orange-50 border-orange-200/50',
      textColor: 'text-orange-600',
      hoverBg: 'hover:bg-stone-50',
    },
    {
      type: 'FLOWER' as const,
      label: 'ร่วมอาลัย',
      spriteIndex: 0,
      activeColor: 'text-stone-600',
      activeBg: 'bg-stone-50 border-stone-200/50',
      textColor: 'text-stone-600',
      hoverBg: 'hover:bg-stone-50',
    },
  ];

  const handleReact = async (type: 'PRAY' | 'LOVE' | 'CANDLE' | 'FLOWER') => {
    await toggleReaction(slug, postId, type);
    setShowPicker(false);
  };

  const handleMouseEnter = () => {
    if (pickerTimeoutRef.current) {
      clearTimeout(pickerTimeoutRef.current);
      pickerTimeoutRef.current = null;
    }
    setShowPicker(true);
  };

  const handleMouseLeave = () => {
    pickerTimeoutRef.current = setTimeout(() => {
      setShowPicker(false);
    }, 450);
  };

  const handleShareMouseEnter = () => {
    if (shareTimeoutRef.current) {
      clearTimeout(shareTimeoutRef.current);
      shareTimeoutRef.current = null;
    }
    setShowShareMenu(true);
  };

  const handleShareMouseLeave = () => {
    shareTimeoutRef.current = setTimeout(() => {
      setShowShareMenu(false);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (pickerTimeoutRef.current) clearTimeout(pickerTimeoutRef.current);
      if (shareTimeoutRef.current) clearTimeout(shareTimeoutRef.current);
    };
  }, []);

  const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0);
  const activeCfg = userReaction ? reactionsConfig.find((r) => r.type === userReaction) : null;

  const activeReactionTypes = reactionsConfig.filter(cfg => reactionCounts[cfg.type] > 0);
  const shareUrl = `${window.location.origin}/${slug}/feed#${postId}`;

  return (
    <div className="w-full py-1 select-none flex items-center justify-between">
      {/* Action Buttons Left Aligned */}
      <div className="flex items-center gap-5 text-stone-605">
        
        {/* 1. Reaction Trigger (Like) */}
        <div 
          className="relative flex items-center"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Reaction Picker Popover */}
          {showPicker && (
            <div 
              className="absolute bottom-[130%] left-0 z-30 bg-white border border-stone-200/95 p-1.5 rounded-full shadow-[0_12px_24px_-4px_rgba(0,0,0,0.12),0_8px_16px_-6px_rgba(0,0,0,0.06)] flex items-center gap-2 animate-scale-up"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ minWidth: '180px' }}
            >
              {reactionsConfig.map((cfg) => {
                const isActive = userReaction === cfg.type;
                return (
                  <div key={cfg.type} className="relative group/tooltip">
                    <button
                      type="button"
                      onClick={() => handleReact(cfg.type)}
                      className={`p-1 rounded-full cursor-pointer transition-all duration-200 active:scale-75 ${
                        isActive 
                          ? `bg-stone-50 border border-stone-200/40` 
                          : `hover:bg-stone-50`
                      }`}
                    >
                      <IconsetSprite 
                        index={cfg.spriteIndex} 
                        size={30} 
                        className="transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:scale-140 hover:-translate-y-2 hover:rotate-6"
                      />
                    </button>
                    <span className="absolute bottom-[115%] left-1/2 -translate-x-1/2 bg-stone-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition duration-150 shadow-sm whitespace-nowrap z-40">
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            className={`flex items-center gap-2 p-2 rounded-xl text-sm font-bold transition active:scale-95 cursor-pointer hover:bg-stone-50 ${
              activeCfg ? `${activeCfg.activeColor}` : 'text-stone-605 hover:text-stone-900'
            }`}
          >
            {activeCfg ? (
              <IconsetSprite index={activeCfg.spriteIndex} size={20} />
            ) : (
              <Smile size={18} />
            )}
            {totalReactions > 0 && <span className="font-mono text-xs">{totalReactions}</span>}
          </button>
        </div>

        {/* 2. Comment Trigger */}
        <button
          type="button"
          onClick={onCommentClick}
          className="flex items-center gap-2 p-2 rounded-xl text-sm font-bold text-stone-605 hover:text-stone-900 hover:bg-stone-50 transition active:scale-95 cursor-pointer"
        >
          <MessageSquare size={18} />
          {commentsCount > 0 && <span className="font-mono text-xs">{commentsCount}</span>}
        </button>

        {/* 3. Share Trigger with Dropdown */}
        <div 
          className="relative flex items-center"
          onMouseEnter={handleShareMouseEnter}
          onMouseLeave={handleShareMouseLeave}
        >
          {/* Share Dropdown Menu */}
          {showShareMenu && (
            <div 
              className="absolute bottom-[125%] left-0 z-30 bg-white border border-stone-200/90 rounded-2xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.12),0_8px_16px_-8px_rgba(0,0,0,0.08)] p-2 min-w-[170px] flex flex-col gap-0.5 text-[11px] font-bold text-stone-700 animate-scale-up"
              onMouseEnter={handleShareMouseEnter}
              onMouseLeave={handleShareMouseLeave}
            >
              {/* LINE share option */}
              <a
                href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowShareMenu(false)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl text-left cursor-pointer transition"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-[9px] select-none shadow-2xs">L</span>
                <span>แชร์ไปยัง LINE</span>
              </a>

              {/* Facebook share option */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowShareMenu(false)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 hover:text-blue-800 rounded-xl text-left cursor-pointer transition"
              >
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-[9px] select-none shadow-2xs">F</span>
                <span>แชร์ไปยัง Facebook</span>
              </a>

              {/* Copy Link share option */}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  setShareSuccess(true);
                  setTimeout(() => setShareSuccess(false), 2000);
                  setShowShareMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-2 hover:bg-stone-50 rounded-xl text-left cursor-pointer w-full text-stone-700 font-bold transition"
              >
                <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-black text-[9px] select-none shadow-2xs">🔗</span>
                <span>คัดลอกลิงก์</span>
              </button>

              {/* Native OS share option fallback */}
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'ฟีดไว้อาลัย', url: shareUrl }).catch(console.error);
                  }
                  setShowShareMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-2 hover:bg-stone-50 rounded-xl text-left cursor-pointer w-full text-stone-700 font-bold transition"
              >
                <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-black text-[9px] select-none shadow-2xs">📱</span>
                <span>ตัวเลือกอื่นๆ</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center gap-2 p-2 rounded-xl text-sm font-bold text-stone-605 hover:text-stone-900 hover:bg-stone-50 transition active:scale-95 cursor-pointer relative"
          >
            <Share2 size={18} />
            
            {shareSuccess && (
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-stone-900/90 text-white text-[9px] font-bold px-2 py-1 rounded-lg animate-fade-in shadow-md whitespace-nowrap z-50">
                คัดลอกลิงก์แล้ว
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Right Side: Visual Overlapping reaction badges using scaled Iconset sprites */}
      <div className="flex items-center gap-1 select-none">
        {totalReactions > 0 && (
          <div className="flex -space-x-1.5 items-center">
            {activeReactionTypes.map((cfg) => {
              return (
                <IconsetSprite 
                  key={cfg.type} 
                  index={cfg.spriteIndex} 
                  size={18} 
                  className="rounded-full border border-white shadow-2xs" 
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
