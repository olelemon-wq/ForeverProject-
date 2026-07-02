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
    const { websiteId, orderedIds } = await request.json();

    if (!websiteId || !Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'ข้อมูลสำหรับจัดเรียงรูปภาพไม่ถูกต้อง' }, { status: 400 });
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
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์จัดเรียงรูปภาพของเว็บไซต์นี้' }, { status: 403 });
    }

    // 4. Update sort orders in transaction
    await db.$transaction(
      orderedIds.map((id, index) =>
        db.media.update({
          where: { id, websiteId },
          data: { sortOrder: index },
        })
      )
    );

    // 5. Log action in AuditLog
    await db.auditLog.create({
      data: {
        websiteId,
        webmasterId: webmaster.id,
        action: 'PUBLISH',
        details: `จัดเรียงรูปภาพคลังภาพรำลึกจำนวน ${orderedIds.length} รูปใหม่สำเร็จ`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'จัดเรียงลำดับรูปภาพคลังภาพรำลึกสำเร็จ',
    });
  } catch (error) {
    console.error('Reorder media error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการจัดเรียงรูปภาพ' }, { status: 500 });
  }
}
