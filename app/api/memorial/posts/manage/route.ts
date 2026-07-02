import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/jwt';

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');

    if (!websiteId) {
      return NextResponse.json({ error: 'Missing websiteId parameter' }, { status: 400 });
    }

    const webmaster = await getWebmaster();
    if (!webmaster) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify if webmaster is admin of the website
    const isAdmin = await db.websiteWebmaster.findFirst({
      where: {
        websiteId,
        webmasterId: webmaster.id,
      },
    });

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all posts (PENDING, PUBLISHED, HIDDEN)
    const posts = await db.memorialPost.findMany({
      where: {
        tenantId: websiteId,
      },
      orderBy: [
        { status: 'asc' }, // PENDING first
        { createdAt: 'desc' },
      ],
      include: {
        reactions: true,
        comments: true,
      },
    });

    const formatted = posts.map((post) => {
      const reactionCounts = {
        PRAY: post.reactions.filter((r) => r.type === 'PRAY').length,
        LOVE: post.reactions.filter((r) => r.type === 'LOVE').length,
        CANDLE: post.reactions.filter((r) => r.type === 'CANDLE').length,
        FLOWER: post.reactions.filter((r) => r.type === 'FLOWER').length,
      };

      return {
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
        reactionCounts,
        commentsCount: post.comments.length,
      };
    });

    return NextResponse.json({
      success: true,
      posts: formatted,
    });
  } catch (error) {
    console.error('Fetch manage posts error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
