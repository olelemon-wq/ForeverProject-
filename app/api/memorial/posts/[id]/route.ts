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

// PATCH: Moderate post (Approve, Hide, Pinned status)
export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await props.params;
    const body = await request.json();
    const { status, isPinned } = body;

    const post = await db.memorialPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const webmaster = await getWebmaster();
    if (!webmaster) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify if webmaster is admin of the post's tenant
    const isAdmin = await db.websiteWebmaster.findFirst({
      where: {
        websiteId: post.tenantId,
        webmasterId: webmaster.id,
      },
    });

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await db.memorialPost.update({
      where: { id: postId },
      data: {
        ...(status ? { status } : {}),
        ...(typeof isPinned === 'boolean' ? { isPinned } : {}),
      },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error('Moderate post PATCH error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Completely remove post
export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await props.params;

    const post = await db.memorialPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const webmaster = await getWebmaster();
    if (!webmaster) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify if webmaster is admin of the post's tenant
    const isAdmin = await db.websiteWebmaster.findFirst({
      where: {
        websiteId: post.tenantId,
        webmasterId: webmaster.id,
      },
    });

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.memorialPost.delete({
      where: { id: postId },
    });

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Moderate post DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
