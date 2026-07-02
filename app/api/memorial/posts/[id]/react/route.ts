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

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await props.params;
    const body = await request.json();
    const { type: reactionType } = body;

    const validTypes = ['PRAY', 'LOVE', 'CANDLE', 'FLOWER'];
    if (!validTypes.includes(reactionType)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
    }

    const post = await db.memorialPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const cookieStore = await cookies();
    const webmaster = await getWebmaster();
    const userId = webmaster?.id || null;

    let guestKey = cookieStore.get('guest_key')?.value;
    if (!userId && !guestKey) {
      guestKey = crypto.randomUUID();
      cookieStore.set('guest_key', guestKey, {
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: true,
        path: '/',
      });
    }

    // Toggle logic: Check if reaction already exists
    let existingReaction = null;
    if (userId) {
      existingReaction = await db.postReaction.findFirst({
        where: { postId, userId },
      });
    } else {
      existingReaction = await db.postReaction.findFirst({
        where: { postId, guestKey },
      });
    }

    let userReaction: string | null = null;

    if (existingReaction) {
      if (existingReaction.type === reactionType) {
        // Toggle off (remove)
        await db.postReaction.delete({
          where: { id: existingReaction.id },
        });
        userReaction = null;
      } else {
        // Toggle type (update)
        await db.postReaction.update({
          where: { id: existingReaction.id },
          data: { type: reactionType as any },
        });
        userReaction = reactionType;
      }
    } else {
      // Create new reaction
      await db.postReaction.create({
        data: {
          postId,
          userId,
          guestKey: userId ? null : guestKey,
          type: reactionType as any,
        },
      });
      userReaction = reactionType;
    }

    // Fetch updated reaction counts
    const reactions = await db.postReaction.findMany({
      where: { postId },
    });

    const reactionCounts = {
      PRAY: reactions.filter((r) => r.type === 'PRAY').length,
      LOVE: reactions.filter((r) => r.type === 'LOVE').length,
      CANDLE: reactions.filter((r) => r.type === 'CANDLE').length,
      FLOWER: reactions.filter((r) => r.type === 'FLOWER').length,
    };

    return NextResponse.json({
      success: true,
      userReaction,
      reactionCounts,
    });
  } catch (error) {
    console.error('Toggle reaction error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
