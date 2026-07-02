import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(request: Request) {
  try {
    // 1. Authenticate user from JWT session cookie
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' }, { status: 401 });
    }

    const decoded = await verifyToken(session);
    if (!decoded || !decoded.phone) {
      return NextResponse.json({ error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
    }

    // 2. Parse request parameters
    const { mediaId, websiteId } = await request.json();

    if (!mediaId || !websiteId) {
      return NextResponse.json({ error: 'ข้อมูลสำหรับลบมีเดียไม่ครบถ้วน' }, { status: 400 });
    }

    // 3. Resolve permissions
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
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์ลบข้อมูลมีเดียของเว็บไซต์นี้' }, { status: 403 });
    }

    // 4. Retrieve media info for logging
    const media = await db.media.findUnique({
      where: { id: mediaId, websiteId },
    });

    if (!media) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลไฟล์มีเดียในระบบ' }, { status: 400 });
    }

    // 5. Update record to isDeleted = true
    await db.media.update({
      where: { id: mediaId },
      data: { isDeleted: true },
    });

    // 6. Log in AuditLog
    await db.auditLog.create({
      data: {
        websiteId,
        webmasterId: webmaster.id,
        action: 'DELETE',
        details: `ลบไฟล์สื่อสำเร็จ: ${media.fileName} (${(Number(media.fileSize) / (1024 * 1024)).toFixed(2)} MB)`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'ลบไฟล์สื่อสำเร็จ',
    });
  } catch (error) {
    console.error('Delete media error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการลบไฟล์สื่อ' }, { status: 500 });
  }
}
