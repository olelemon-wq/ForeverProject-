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
    if (!decoded?.phone) {
      return NextResponse.json({ error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
    }

    const { condolenceId, action, websiteId } = await request.json();
    if (!condolenceId || !action || !websiteId) {
      return NextResponse.json({ error: 'กรุณาระบุรายละเอียดรายการให้ครบถ้วน' }, { status: 400 });
    }

    if (action !== 'DELETE' && action !== 'KEEP') {
      return NextResponse.json({ error: 'ประเภทการกระทำไม่ถูกต้อง' }, { status: 400 });
    }

    const webmaster = await db.webmaster.findUnique({ where: { phone: decoded.phone } });
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
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์จัดการข้อมูลคำไว้อาลัยของเว็บไซต์นี้' }, { status: 403 });
    }

    const condolence = await db.condolence.findFirst({
      where: { id: condolenceId, websiteId, isApproved: true },
    });
    if (!condolence) {
      return NextResponse.json({ error: 'ไม่พบข้อความที่ระบุ' }, { status: 404 });
    }

    const now = new Date();

    if (action === 'DELETE') {
      await db.condolenceReport.updateMany({
        where: { condolenceId, websiteId, status: 'OPEN' },
        data: { status: 'RESOLVED_DELETED', resolvedAt: now },
      });

      await db.condolence.delete({ where: { id: condolenceId, websiteId } });

      await db.auditLog.create({
        data: {
          websiteId,
          webmasterId: webmaster.id,
          action: 'DELETE',
          details: `ลบคำไว้อาลัยรหัส ${condolenceId} หลังได้รับการแจ้งจากผู้เยี่ยมชม`,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'ลบข้อความตามรายงานเรียบร้อยแล้ว',
      });
    }

    await db.condolenceReport.updateMany({
      where: { condolenceId, websiteId, status: 'OPEN' },
      data: { status: 'RESOLVED_KEPT', resolvedAt: now },
    });

    await db.auditLog.create({
      data: {
        websiteId,
        webmasterId: webmaster.id,
        action: 'PUBLISH',
        details: `ปิดรายงานคำไว้อาลัยรหัส ${condolenceId} — คงข้อความไว้`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'ปิดรายงานแล้ว — ข้อความยังแสดงอยู่',
    });
  } catch (error) {
    console.error('Moderate condolence report error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการจัดการรายงาน' }, { status: 500 });
  }
}
