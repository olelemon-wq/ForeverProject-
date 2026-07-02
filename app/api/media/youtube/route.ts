import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

function extractYoutubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate user from JWT session cookie
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ' }, { status: 401 });
    }

    const decoded = await verifyToken(session);
    if (!decoded || !decoded.phone) {
      return NextResponse.json({ error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
    }

    const { youtubeUrl, title, websiteId } = await request.json();

    if (!youtubeUrl || !websiteId) {
      return NextResponse.json({ error: 'กรุณาระบุลิงก์ YouTube และรหัสเว็บไซต์' }, { status: 400 });
    }

    const videoId = extractYoutubeId(youtubeUrl);
    if (!videoId) {
      return NextResponse.json({ error: 'ลิงก์ YouTube ไม่ถูกต้อง กรุณาใช้ลิงก์เช่น https://www.youtube.com/watch?v=... หรือ https://youtu.be/...' }, { status: 400 });
    }

    // 2. Resolve Webmaster profile in DB
    const webmaster = await db.webmaster.findUnique({
      where: { phone: decoded.phone },
    });

    if (!webmaster) {
      return NextResponse.json({ error: 'ไม่พบสิทธิ์ผู้ใช้งานดูแลระบบนี้' }, { status: 403 });
    }

    // 3. Permission checks
    const permission = await db.websiteWebmaster.findUnique({
      where: {
        websiteId_webmasterId: {
          websiteId,
          webmasterId: webmaster.id,
        },
      },
    });

    if (!permission) {
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์จัดเก็บข้อมูลของเว็บไซต์ความทรงจำนี้' }, { status: 403 });
    }

    // 4. Record metadata in Media DB
    const media = await db.media.create({
      data: {
        websiteId,
        filePath: `https://www.youtube.com/watch?v=${videoId}`,
        fileName: title || 'วิดีโอ YouTube',
        fileSize: BigInt(0), // YouTube uses 0 storage space on our S3/R2 storage
        mimeType: 'video/youtube',
        fileHash: `youtube-${videoId}`,
        album: 'GALLERY',
      },
    });

    await db.auditLog.create({
      data: {
        websiteId,
        webmasterId: webmaster.id,
        action: 'STORAGE',
        details: `เพิ่มลิงก์วิดีโอ YouTube สำเร็จ: ${title || 'วิดีโอ YouTube'}`,
      },
    });

    return NextResponse.json({
      success: true,
      filePath: media.filePath,
      mediaId: media.id,
    });
  } catch (error) {
    console.error('YouTube link submit error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดภายในระบบในการบันทึกลิงก์ YouTube' },
      { status: 500 }
    );
  }
}
