import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';
import { toStoredMediaPath } from '@/lib/mediaUrl';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนทำการอัปโหลดไฟล์' }, { status: 401 });
    }

    const decoded = await verifyToken(session);
    if (!decoded?.phone) {
      return NextResponse.json({ error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
    }

    const { websiteId, mediaId, thumbnailPath } = await request.json();

    if (!websiteId || !mediaId || !thumbnailPath) {
      return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    const webmaster = await db.webmaster.findUnique({
      where: { phone: decoded.phone },
    });

    if (!webmaster) {
      return NextResponse.json({ error: 'ไม่พบสิทธิ์ผู้ใช้งานดูแลระบบนี้' }, { status: 403 });
    }

    const permission = await db.websiteWebmaster.findUnique({
      where: {
        websiteId_webmasterId: {
          websiteId,
          webmasterId: webmaster.id,
        },
      },
    });

    if (!permission) {
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์แก้ไขเว็บไซต์นี้' }, { status: 403 });
    }

    const media = await db.media.findFirst({
      where: { id: mediaId, websiteId, isDeleted: false },
    });

    if (!media) {
      return NextResponse.json({ error: 'ไม่พบไฟล์วิดีโอ' }, { status: 404 });
    }

    const storedPath = toStoredMediaPath(thumbnailPath);
    if (!storedPath.startsWith('/uploads/')) {
      return NextResponse.json({ error: 'เส้นทางภาพตัวอย่างไม่ถูกต้อง' }, { status: 400 });
    }

    await db.media.update({
      where: { id: mediaId },
      data: { thumbnailPath: storedPath },
    });

    return NextResponse.json({ success: true, thumbnailPath: storedPath });
  } catch (error) {
    console.error('Set thumbnail error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการบันทึกภาพตัวอย่าง' },
      { status: 500 }
    );
  }
}
