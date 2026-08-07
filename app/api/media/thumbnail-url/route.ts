import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';
import { toStoredMediaPath } from '@/lib/mediaUrl';
import { createUploadTarget } from '@/lib/mediaUploadStorage';

async function authorizeMediaEdit(websiteId: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    return { error: NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนทำการอัปโหลดไฟล์' }, { status: 401 }) };
  }

  const decoded = await verifyToken(session);
  if (!decoded?.phone) {
    return { error: NextResponse.json({ error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 }) };
  }

  const webmaster = await db.webmaster.findUnique({
    where: { phone: decoded.phone },
  });

  if (!webmaster) {
    return { error: NextResponse.json({ error: 'ไม่พบสิทธิ์ผู้ใช้งานดูแลระบบนี้' }, { status: 403 }) };
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
    return { error: NextResponse.json({ error: 'คุณไม่มีสิทธิ์อัปโหลดไฟล์สำหรับเว็บไซต์ความทรงจำนี้' }, { status: 403 }) };
  }

  return { webmaster };
}

export async function POST(request: Request) {
  try {
    const { websiteId, mediaId, fileSize } = await request.json();

    if (!websiteId || !mediaId || !fileSize) {
      return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    const auth = await authorizeMediaEdit(websiteId);
    if ('error' in auth && auth.error) return auth.error;

    const media = await db.media.findFirst({
      where: { id: mediaId, websiteId, isDeleted: false },
    });

    if (!media) {
      return NextResponse.json({ error: 'ไม่พบไฟล์วิดีโอ' }, { status: 404 });
    }

    if (!media.mimeType.startsWith('video/') || media.mimeType === 'video/youtube') {
      return NextResponse.json({ error: 'ไฟล์นี้ไม่รองรับภาพตัวอย่าง' }, { status: 400 });
    }

    const fileKey = `uploads/${websiteId}/thumbs/${mediaId}.jpg`;
    const { uploadUrl, fileUrl } = await createUploadTarget(fileKey, 'image/jpeg');

    return NextResponse.json({
      success: true,
      uploadUrl,
      thumbnailPath: toStoredMediaPath(fileUrl) || `/${fileKey}`,
    });
  } catch (error: any) {
    console.error('Thumbnail URL error:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการเตรียมอัปโหลดภาพตัวอย่าง' },
      { status: 500 }
    );
  }
}
