import { create } from 'zustand';

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar: string | null;
  isAnonymous: boolean;
  content: string;
  createdAt: string;
}

export interface MemorialPostFeedItem {
  id: string;
  authorName: string;
  authorAvatar: string | null;
  isAnonymous: boolean;
  type: 'CONDOLENCE' | 'MEMORY' | 'ANNOUNCEMENT' | 'MERIT';
  content: string;
  mediaUrls: string[];
  isPinned: boolean;
  createdAt: string;
  reactionCounts: {
    PRAY: number;
    LOVE: number;
    CANDLE: number;
    FLOWER: number;
  };
  userReaction: 'PRAY' | 'LOVE' | 'CANDLE' | 'FLOWER' | null;
  comments: PostComment[];
}

interface MemorialFeedState {
  posts: MemorialPostFeedItem[];
  isLoading: boolean;
  isSubmitting: boolean;
  hasMore: boolean;
  nextCursor: string | null;
  error: string | null;

  setPosts: (posts: MemorialPostFeedItem[]) => void;
  fetchPosts: (slug: string, cursor?: string | null) => Promise<void>;
  submitPost: (
    slug: string,
    payload: {
      senderName: string;
      content: string;
      isAnonymous: boolean;
      type: 'CONDOLENCE' | 'MEMORY' | 'ANNOUNCEMENT' | 'MERIT';
      mediaUrls: string[];
      captchaAnswer: string;
    }
  ) => Promise<boolean>;
  toggleReaction: (slug: string, postId: string, reactionType: 'PRAY' | 'LOVE' | 'CANDLE' | 'FLOWER') => Promise<void>;
  submitComment: (
    slug: string,
    postId: string,
    payload: {
      authorName: string;
      content: string;
      isAnonymous: boolean;
    }
  ) => Promise<boolean>;
}

export const useMemorialFeedStore = create<MemorialFeedState>((set, get) => ({
  posts: [],
  isLoading: false,
  isSubmitting: false,
  hasMore: true,
  nextCursor: null,
  error: null,

  setPosts: (posts) => set({ posts }),

  fetchPosts: async (slug, cursor = null) => {
    set({ isLoading: true, error: null });
    try {
      const url = `/api/memorial/posts?slug=${slug}${cursor ? `&cursor=${cursor}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch posts');
      
      set((state) => ({
        posts: cursor ? [...state.posts, ...data.posts] : data.posts,
        hasMore: data.hasMore,
        nextCursor: data.nextCursor,
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  submitPost: async (slug, payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await fetch(`/api/memorial/posts?slug=${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to submit post');

      // If the post status is PUBLISHED, add it directly to the local state list
      if (data.post && data.post.status === 'PUBLISHED') {
        const newPost: MemorialPostFeedItem = {
          id: data.post.id,
          authorName: data.post.authorName,
          authorAvatar: data.post.authorAvatar,
          isAnonymous: data.post.isAnonymous,
          type: data.post.type,
          content: data.post.content,
          mediaUrls: data.post.mediaUrls,
          isPinned: data.post.isPinned,
          createdAt: data.post.createdAt,
          reactionCounts: { PRAY: 0, LOVE: 0, CANDLE: 0, FLOWER: 0 },
          userReaction: null,
          comments: [],
        };
        
        set((state) => {
          // If the post is pinned, insert it before other posts. Otherwise, insert after pinned posts.
          const pinned = state.posts.filter((p) => p.isPinned);
          const normal = state.posts.filter((p) => !p.isPinned);
          return {
            posts: [newPost, ...pinned, ...normal],
          };
        });
      }
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  toggleReaction: async (slug, postId, reactionType) => {
    // 1. Optimistic Update in State
    const previousPosts = get().posts;
    const updatedPosts = previousPosts.map((post) => {
      if (post.id !== postId) return post;

      const prevReaction = post.userReaction;
      const counts = { ...post.reactionCounts };

      if (prevReaction === reactionType) {
        // Remove reaction
        counts[reactionType] = Math.max(0, counts[reactionType] - 1);
        return { ...post, userReaction: null, reactionCounts: counts };
      } else {
        // Toggle/Add reaction
        if (prevReaction) {
          counts[prevReaction] = Math.max(0, counts[prevReaction] - 1);
        }
        counts[reactionType] = (counts[reactionType] || 0) + 1;
        return { ...post, userReaction: reactionType, reactionCounts: counts };
      }
    });

    set({ posts: updatedPosts });

    // 2. Submit to Backend API
    try {
      const res = await fetch(`/api/memorial/posts/${postId}/react?slug=${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: reactionType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Optionally sync reaction counts with actual server values returned
      if (data.reactionCounts) {
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId
              ? { ...p, reactionCounts: data.reactionCounts, userReaction: data.userReaction }
              : p
          ),
        }));
      }
    } catch (err) {
      console.error('Optimistic reaction sync failed, rolling back:', err);
      // Rollback on error
      set({ posts: previousPosts });
    }
  },

  submitComment: async (slug, postId, payload) => {
    try {
      const res = await fetch(`/api/memorial/posts/${postId}/comments?slug=${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to submit comment');

      if (data.comment && data.comment.status === 'PUBLISHED') {
        const newComment: PostComment = {
          id: data.comment.id,
          authorName: data.comment.authorName,
          authorAvatar: data.comment.authorAvatar,
          isAnonymous: data.comment.isAnonymous,
          content: data.comment.content,
          createdAt: data.comment.createdAt,
        };

        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
          ),
        }));
      }
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },
}));
