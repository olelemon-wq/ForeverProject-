'use client';

import React, { useRef } from 'react';
import { Pin, Gift } from 'lucide-react';
import { MemorialPostFeedItem } from '@/stores/useMemorialFeedStore';

import ReactionBar from './ReactionBar';
import CommentThread from './CommentThread';

interface FeedItemProps {
  post: MemorialPostFeedItem;
  slug: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
}

function formatRelativeTime(dateString: string) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'เมื่อครู่นี้';
    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`;

    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function FeedItem({
  post,
  slug,
  isLoggedIn,
  isAdmin,
}: FeedItemProps) {
  const isAnonymous = post.isAnonymous;
  const displayName = isAnonymous ? 'ผู้ไม่ประสงค์ออกนาม' : post.authorName;
  const avatarLetter = displayName.charAt(0);
  const avatarUrl = isAnonymous 
    ? null 
    : post.authorAvatar;

  const isAnnouncement = post.type === 'ANNOUNCEMENT';
  const isMerit = post.type === 'MERIT';

  const commentInputRef = useRef<HTMLInputElement>(null);

  const displayMediaUrl = (url: string) => {
    if (url.startsWith('http') || url.startsWith('/')) return url;
    return `https://storage.forever.co.th/${url}`;
  };

  return (
    <div 
      className={`rounded-3xl border transition flex flex-col justify-between shadow-sm relative bg-white ${
        isAnnouncement 
          ? 'border-amber-200/80 shadow-[0_4px_20px_rgba(245,158,11,0.04)]' 
          : 'border-stone-200/80'
      }`}
    >
      {/* Pinned Info */}
      {post.isPinned && (
        <div className="absolute top-5 right-5 text-amber-600 z-10" title="ปักหมุดโดยผู้ดูแล">
          <Pin className="w-5 h-5 rotate-45 fill-current" />
        </div>
      )}

      <div>
        {/* Header Block (padded) */}
        <div className="p-6 pb-3 flex items-center gap-3 relative">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-stone-200 bg-stone-100 flex items-center justify-center font-bold text-stone-600 text-sm select-none">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span>{avatarLetter}</span>
            )}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-stone-900">{displayName}</span>
              
              {/* Special type badges */}
              {isAnnouncement && (
                <span className="text-[9px] font-black bg-amber-600 text-white px-2 py-0.5 rounded-full shadow-2xs">
                  ประกาศสำคัญ
                </span>
              )}
              {isMerit && (
                <span className="text-[9px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-2xs">
                  ร่วมทำบุญ
                </span>
              )}
            </div>
            <p className="text-[10px] text-stone-400 font-semibold font-mono">
              {formatRelativeTime(post.createdAt)}
            </p>
          </div>
        </div>

        {/* Post Text content Block (padded) */}
        <div className="px-6 pb-4 text-left">
          <p className="text-xs sm:text-sm text-stone-705 leading-relaxed whitespace-pre-line font-medium">
            {post.content}
          </p>
        </div>

        {/* Attached image file (FULL-BLEED: Spanning border to border without padding!) */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="w-full bg-stone-50 overflow-hidden flex items-center justify-center border-y border-stone-100/60">
            <img 
              src={displayMediaUrl(post.mediaUrls[0])} 
              alt="Post Media Attachment" 
              className="w-full h-auto block"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600';
              }}
            />
          </div>
        )}

        {/* CTA Merit Section (padded margin) */}
        {isMerit && (
          <div className="mx-6 my-4 p-4 bg-emerald-50/45 border border-emerald-250/20 rounded-2xl flex items-center justify-between gap-4 flex-wrap text-left">
            <div className="space-y-0.5 flex-1 min-w-[200px]">
              <h5 className="text-xs font-bold text-emerald-800">ขอเชิญร่วมทำบุญอุทิศกุศล</h5>
              <p className="text-[11px] text-stone-500 leading-normal">
                ท่านสามารถร่วมสมทบทุนทำบุญตามความประสงค์ เพื่ออุทิศเป็นกุศลผลบุญแด่ผู้วายชนม์
              </p>
            </div>
            <a 
              href={`/${slug}/donation`}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold active:scale-95 transition shadow-sm text-center flex items-center gap-1"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>ร่วมทำบุญบริจาค</span>
            </a>
          </div>
        )}

        {/* Footer Actions & Comments Block (padded) */}
        <div className="p-6 pt-3">
          <div className="border-t border-stone-100/80 pt-1">
            <ReactionBar
              postId={post.id}
              slug={slug}
              reactionCounts={post.reactionCounts}
              userReaction={post.userReaction}
              commentsCount={post.comments.length}
              onCommentClick={() => commentInputRef.current?.focus()}
            />
          </div>

          <div className="border-t border-stone-100/80 pt-4 mt-2">
            <CommentThread
              postId={post.id}
              slug={slug}
              comments={post.comments}
              isLoggedIn={isLoggedIn}
              webmasterName={displayName}
              inputRef={commentInputRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
