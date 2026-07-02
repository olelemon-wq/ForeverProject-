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

// GET: Retrieve comments for a post
export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await props.params;

    const comments = await db.postComment.findMany({
      where: {
        postId,
        status: 'PUBLISHED',
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({
      comments: comments.map((c) => ({
        id: c.id,
        authorName: c.authorName,
        authorAvatar: c.authorAvatar,
        isAnonymous: c.isAnonymous,
        content: c.content,
        createdAt: c.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Fetch comments error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add a new comment to a post
export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await props.params;
    const body = await request.json();
    const { authorName, content, isAnonymous } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'กรุณากรอกข้อความแสดงความคิดเห็น' }, { status: 400 });
    }

    const post = await db.memorialPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const webmaster = await getWebmaster();

    const activeName = webmaster
      ? (isAnonymous ? 'ผู้ไว้อาลัย' : 'ผู้ดูแลระบบ')
      : (isAnonymous ? 'ผู้ไม่ประสงค์ออกนาม' : (authorName || 'ผู้ไว้อาลัย'));

    // Default comment status: Approved/PUBLISHED immediately, or PENDING if website owner requires moderation
    // We default to PUBLISHED as specified in schema, but we can set it to PUBLISHED or PENDING.
    // Let's set it to PUBLISHED for all to allow simple discussions, or PENDING for guests if we want.
    // Let's check webmaster presence: if webmaster is logged in, it's PUBLISHED. If guest, default to PUBLISHED as schema.
    const status = 'PUBLISHED';

    const comment = await db.postComment.create({
      data: {
        postId,
        authorId: webmaster?.id || null,
        authorName: activeName,
        authorAvatar: webmaster?.name ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(webmaster.name)}` : null,
        isAnonymous: !!isAnonymous,
        content: content.trim(),
        status,
      },
    });

    return NextResponse.json({
      success: true,
      comment: {
        id: comment.id,
        authorName: comment.authorName,
        authorAvatar: comment.authorAvatar,
        isAnonymous: comment.isAnonymous,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        status: comment.status,
      },
    });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
