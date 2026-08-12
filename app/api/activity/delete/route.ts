import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' }, { status: 401 });
    }

    const decoded = await verifyToken(session);
    if (!decoded || !decoded.phone) {
      return NextResponse.json({ error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
    }

    const { activityId, websiteId } = await request.json();

    if (!activityId || !websiteId) {
      return NextResponse.json({ error: 'กรุณาระบุรหัสกิจกรรมและรหัสเว็บไซต์' }, { status: 400 });
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
      return NextResponse.json(
        { error: 'คุณไม่มีสิทธิ์ลบกิจกรรมของเว็บไซต์นี้' },
        { status: 403 },
      );
    }

    const activity = await db.activity.findUnique({
      where: { id: activityId, websiteId },
    });

    if (!activity) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลกิจกรรมในระบบ' }, { status: 404 });
    }

    await db.activity.delete({
      where: { id: activityId, websiteId },
    });

    await db.auditLog.create({
      data: {
        websiteId,
        webmasterId: webmaster.id,
        action: 'DELETE',
        details: `ลบกิจกรรมสำเร็จ: ${activity.title}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'ลบข้อมูลกิจกรรมสำเร็จ',
    });
  } catch (error) {
    console.error('Delete activity error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์ในการลบข้อมูลกิจกรรม' },
      { status: 500 },
    );
  }
}
