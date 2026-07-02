'use client';

import React, { useEffect, useState } from 'react';
import { Camera, ChevronDown, RefreshCw } from 'lucide-react';
import { useMemorialFeedStore } from '@/stores/useMemorialFeedStore';
import PostComposer from './PostComposer';
import FeedItem from './FeedItem';

interface MemorialFeedProps {
  websiteId: string;
  slug: string;
}

export default function MemorialFeed({ websiteId, slug }: MemorialFeedProps) {
  const posts = useMemorialFeedStore((state) => state.posts);
  const isLoading = useMemorialFeedStore((state) => state.isLoading);
  const hasMore = useMemorialFeedStore((state) => state.hasMore);
  const nextCursor = useMemorialFeedStore((state) => state.nextCursor);
  const fetchPosts = useMemorialFeedStore((state) => state.fetchPosts);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [webmasterName, setWebmasterName] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    // 1. Fetch auth status
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated) {
          setIsLoggedIn(true);
          // Check if this webmaster is the admin of the current website
          const adminCheckRes = await fetch(`/api/tenant/list-mine`);
          const adminCheckData = await adminCheckRes.json();
          if (adminCheckData.websites) {
            const currentSite = adminCheckData.websites.find(
              (w: any) => w.slug.toLowerCase() === slug.toLowerCase()
            );
            if (currentSite) {
              setIsAdmin(true);
              setWebmasterName(currentSite.name || 'ผู้ดูแลระบบ');
            }
          }
        }
      } catch (err) {
        console.error('Failed to check auth status:', err);
      }
    }

    checkAuth();
  }, [slug]);

  useEffect(() => {
    // 2. Fetch initial posts
    fetchPosts(slug);
  }, [slug, fetchPosts]);

  const handleLoadMore = () => {
    if (hasMore && nextCursor && !isLoading) {
      fetchPosts(slug, nextCursor);
    }
  };

  // Filter posts client-side if needed, or we can fetch them with filters
  const filteredPosts = posts.filter((p) => {
    if (filterType === 'ALL') return true;
    return p.type === filterType;
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* 1. Composer Box */}
      <PostComposer 
        websiteId={websiteId} 
        slug={slug} 
        isLoggedIn={isLoggedIn} 
        isAdmin={isAdmin}
        defaultName={webmasterName}
      />

      {/* 2. Filter Bar */}
      <div className="flex items-center justify-between bg-white border border-stone-200/80 rounded-2xl p-4 shadow-sm text-xs font-semibold flex-wrap gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { label: 'แสดงทั้งหมด', value: 'ALL' },
            { label: 'คำไว้อาลัย 🕯️', value: 'CONDOLENCE' },
            { label: 'ความทรงจำ 📸', value: 'MEMORY' },
            { label: 'ประกาศสวดอภิธรรม 📌', value: 'ANNOUNCEMENT' },
            { label: 'ร่วมทำบุญ 🎗️', value: 'MERIT' },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilterType(tab.value)}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                filterType === tab.value
                  ? 'bg-stone-850 text-white shadow-2xs'
                  : 'text-stone-500 hover:bg-stone-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => fetchPosts(slug)}
          className="p-1.5 text-stone-400 hover:text-stone-800 transition rounded-lg hover:bg-stone-50 cursor-pointer active:scale-95 flex items-center justify-center"
          title="รีเฟรชข้อมูลฟีด"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* 3. Posts Stream Feed Grid */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="bg-white border border-stone-200/80 rounded-3xl p-12 text-center text-stone-500 text-xs shadow-sm space-y-2">
            <p className="font-semibold text-stone-605">ยังไม่มีข้อความไว้อาลัยบนกระดานฟีดรำลึกร่วม</p>
            <p className="text-stone-400">ร่วมพิมพ์คำไว้อาลัย จุดเทียน หรือเล่าเรื่องราวความทรงจำของคุณเป็นคนแรกด้านบน</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <FeedItem 
              key={post.id} 
              post={post} 
              slug={slug} 
              isLoggedIn={isLoggedIn} 
              isAdmin={isAdmin}
            />
          ))
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-200" />
                  <div className="space-y-2 flex-grow">
                    <div className="h-3.5 bg-stone-200 rounded-md w-32" />
                    <div className="h-2.5 bg-stone-200 rounded-md w-20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-stone-200 rounded-md w-full" />
                  <div className="h-3 bg-stone-200 rounded-md w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !isLoading && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleLoadMore}
              className="px-6 py-2.5 border border-stone-200 rounded-2xl bg-white hover:bg-stone-50 text-stone-600 text-xs font-bold active:scale-95 transition flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <span>โหลดคำไว้อาลัยเพิ่มเติม</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
