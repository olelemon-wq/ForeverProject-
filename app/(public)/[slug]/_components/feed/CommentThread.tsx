'use client';

import React, { useState } from 'react';
import { Send, User } from 'lucide-react';
import { useMemorialFeedStore, PostComment } from '@/stores/useMemorialFeedStore';

interface CommentThreadProps {
  postId: string;
  slug: string;
  comments: PostComment[];
  isLoggedIn: boolean;
  webmasterName?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

function formatRelativeTime(dateString: string) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'เมื่อครู่นี้';
    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;

    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function CommentThread({
  postId,
  slug,
  comments,
  isLoggedIn,
  webmasterName = '',
  inputRef,
}: CommentThreadProps) {
  const submitComment = useMemorialFeedStore((state) => state.submitComment);

  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setError('');
    setLocalLoading(true);

    const activeName = isLoggedIn 
      ? (isAnonymous ? 'ผู้ไว้อาลัย' : 'ผู้ดูแลระบบ') 
      : (isAnonymous ? 'ผู้ไม่ประสงค์ออกนาม' : authorName.trim());

    if (!isLoggedIn && !isAnonymous && !activeName) {
      setError('กรุณากรอกชื่อของคุณ');
      setLocalLoading(false);
      return;
    }

    try {
      const payload = {
        authorName: activeName,
        content: content.trim(),
        isAnonymous,
      };

      const result = await submitComment(slug, postId, payload);
      if (result) {
        setContent('');
        if (!isLoggedIn) {
          setAuthorName('');
        }
      } else {
        throw new Error('เกิดข้อผิดพลาดในการส่งความคิดเห็น');
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="pt-4 mt-3 border-t border-stone-100 space-y-4">
      {/* 1. Comments list */}
      {comments.length > 0 && (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {comments.map((comment) => {
            const dispName = comment.isAnonymous ? 'ผู้ไม่ประสงค์ออกนาม' : comment.authorName;
            const letter = dispName.charAt(0);
            return (
              <div key={comment.id} className="flex gap-2.5 items-start text-xs text-left bg-stone-50 border border-stone-250/30 p-3 rounded-2xl">
                <div className="w-7 h-7 rounded-full bg-stone-200 border border-stone-300/40 flex items-center justify-center font-bold text-stone-500 text-[10px] select-none flex-shrink-0">
                  {comment.authorAvatar && !comment.isAnonymous ? (
                    <img src={comment.authorAvatar} alt={dispName} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span>{letter}</span>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-bold text-stone-900">{dispName}</span>
                    <span className="text-[9px] text-stone-400 font-mono">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-stone-700 leading-relaxed font-medium whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Error message */}
      {error && <div className="text-[10px] text-red-650 font-bold text-left px-1">⚠️ {error}</div>}

      {/* 3. Input form */}
      <form onSubmit={handleSubmit} className="space-y-2 text-left">
        {/* Author info (guests only) */}
        {!isLoggedIn ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="ชื่อของคุณ..."
              disabled={isAnonymous || localLoading}
              className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-850 text-xs focus:bg-white focus:outline-none"
            />
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-stone-500 font-semibold select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="accent-emerald-600 rounded-md"
                disabled={localLoading}
              />
              <span>ไม่ระบุตัวตน</span>
            </label>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-250/25 px-2 py-0.5 rounded-full font-bold">
              ตอบในฐานะ: {isAnonymous ? 'ผู้ไว้อาลัย' : 'ผู้ดูแลระบบ'}
            </span>
            <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-stone-500 font-semibold select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="accent-emerald-600 rounded-md"
                disabled={localLoading}
              />
              <span>ซ่อนชื่อผู้เขียน</span>
            </label>
          </div>
        )}

        {/* Input box */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="เขียนข้อความแสดงความเห็นหรือเล่าเรื่อง..."
            disabled={localLoading}
            className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-850 text-xs focus:bg-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={localLoading || !content.trim()}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold active:scale-95 transition flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            style={{ backgroundColor: 'var(--theme-primary, #0d9488)' }}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
