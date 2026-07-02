import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/jwt';

// Helper to get active webmaster from session
async function getWebmaster() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    if (!session) return null;

    const decoded = await verifyToken(session);
    if (!decoded || !decoded.phone) return null;

    return await db.webmaster.findUnique({
      where: { phone: decoded.phone },
    });
  } catch {
    return null;
  }
}

// GET: Paginated feed posts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const cursor = searchParams.get('cursor');
    const type = searchParams.get('type') as any;
    const limit = parseInt(searchParams.get('limit') || '6', 10);

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
    }

    const tenant = await db.tenant.findUnique({
      where: { slug: slug.toLowerCase() },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Dedup key for current user (userId if logged in, guestKey cookie if guest)
    const cookieStore = await cookies();
    let guestKey = cookieStore.get('guest_key')?.value;
    if (!guestKey) {
      guestKey = crypto.randomUUID();
      // Set long-lived guest key cookie
      cookieStore.set('guest_key', guestKey, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        path: '/',
      });
    }

    const webmaster = await getWebmaster();
    const userId = webmaster?.id || null;

    let pinnedPosts: any[] = [];
    let unpinnedPosts: any[] = [];

    // Fetch pinned announcements only on page 1 (cursor is null)
    if (!cursor) {
      pinnedPosts = await db.memorialPost.findMany({
        where: {
          tenantId: tenant.id,
          status: 'PUBLISHED',
          isPinned: true,
          ...(type ? { type } : {}),
        },
        orderBy: { createdAt: 'desc' },
        include: {
          reactions: true,
          comments: {
            where: { status: 'PUBLISHED' },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    }

    // Fetch unpinned posts with cursor pagination
    unpinnedPosts = await db.memorialPost.findMany({
      where: {
        tenantId: tenant.id,
        status: 'PUBLISHED',
        isPinned: false,
        ...(type ? { type } : {}),
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: 'desc' },
      include: {
        reactions: true,
        comments: {
          where: { status: 'PUBLISHED' },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    const hasMore = unpinnedPosts.length > limit;
    const paginatedUnpinned = hasMore ? unpinnedPosts.slice(0, limit) : unpinnedPosts;
    const nextCursor = hasMore ? paginatedUnpinned[paginatedUnpinned.length - 1].id : null;

    const allPosts = [...pinnedPosts, ...paginatedUnpinned];

    // Format posts into the unified clean structure
    const formattedPosts = allPosts.map((post) => {
      const reactionCounts = {
        PRAY: post.reactions.filter((r: any) => r.type === 'PRAY').length,
        LOVE: post.reactions.filter((r: any) => r.type === 'LOVE').length,
        CANDLE: post.reactions.filter((r: any) => r.type === 'CANDLE').length,
        FLOWER: post.reactions.filter((r: any) => r.type === 'FLOWER').length,
      };

      // Determine if current user reacted
      let userReaction: string | null = null;
      if (userId) {
        const found = post.reactions.find((r: any) => r.userId === userId);
        if (found) userReaction = found.type;
      } else if (guestKey) {
        const found = post.reactions.find((r: any) => r.guestKey === guestKey);
        if (found) userReaction = found.type;
      }

      return {
        id: post.id,
        authorName: post.authorName,
        authorAvatar: post.authorAvatar,
        isAnonymous: post.isAnonymous,
        type: post.type,
        content: post.content,
        mediaUrls: post.mediaUrls,
        isPinned: post.isPinned,
        createdAt: post.createdAt.toISOString(),
        reactionCounts,
        userReaction,
        comments: post.comments.map((c: any) => ({
          id: c.id,
          authorName: c.authorName,
          authorAvatar: c.authorAvatar,
          isAnonymous: c.isAnonymous,
          content: c.content,
          createdAt: c.createdAt.toISOString(),
        })),
      };
    });

    return NextResponse.json({
      posts: formattedPosts,
      hasMore,
      nextCursor,
    });
  } catch (error) {
    console.error('Fetch posts error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a new post
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
    }

    const tenant = await db.tenant.findUnique({
      where: { slug: slug.toLowerCase() },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Block submission if website is suspended (BR021)
    if (tenant.status === 'SUSPENDED') {
      return NextResponse.json(
        { error: 'ขออภัย เว็บไซต์นี้ถูกระงับการทำงานชั่วคราว ไม่สามารถส่งข้อความได้' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { senderName, content, isAnonymous, type, mediaUrls } = body;

    if (!senderName || !content) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อและข้อความไว้อาลัย' }, { status: 400 });
    }

    const webmaster = await getWebmaster();

    // Check if webmaster is admin of the current website
    let isAdmin = false;
    if (webmaster) {
      const isWebmasterAdmin = await db.websiteWebmaster.findFirst({
        where: {
          websiteId: tenant.id,
          webmasterId: webmaster.id,
        },
      });
      isAdmin = !!isWebmasterAdmin;
    }

    // Role safety restrictions: Only admins can post ANNOUNCEMENT or MERIT types
    if ((type === 'ANNOUNCEMENT' || type === 'MERIT') && !isAdmin) {
      return NextResponse.json(
        { error: 'เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถสร้างประกาศหรือโพสต์ทำบุญได้' },
        { status: 403 }
      );
    }

    // Default status: Admins get PUBLISHED immediately, general guests get PENDING (moderation)
    const status = isAdmin ? 'PUBLISHED' : 'PENDING';

    const post = await db.memorialPost.create({
      data: {
        tenantId: tenant.id,
        authorId: webmaster?.id || null,
        authorName: isAnonymous ? 'ผู้ไว้อาลัย' : senderName,
        authorAvatar: webmaster?.name ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(webmaster.name)}` : null,
        isAnonymous: !!isAnonymous,
        type: type || 'CONDOLENCE',
        content,
        mediaUrls: mediaUrls || [],
        status,
        isPinned: type === 'ANNOUNCEMENT' ? true : false,
      },
    });

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        authorName: post.authorName,
        authorAvatar: post.authorAvatar,
        isAnonymous: post.isAnonymous,
        type: post.type,
        content: post.content,
        mediaUrls: post.mediaUrls,
        isPinned: post.isPinned,
        status: post.status,
        createdAt: post.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
