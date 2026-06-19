import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' }, { status: 401 });
    }

    const decoded = await verifyToken(session);
    if (!decoded || !decoded.phone) {
      return NextResponse.json({ error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
    }

    // 2. Parse request variables
    const { memberId, websiteId } = await request.json();

    if (!memberId || !websiteId) {
      return NextResponse.json({ error: 'กรุณาระบุรหัสสมาชิกเครือญาติและรหัสเว็บไซต์' }, { status: 400 });
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
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์ลบข้อมูลเครือญาติของเว็บไซต์นี้' }, { status: 403 });
    }

    // Retrieve name for logging before deleting
    const member = await db.familyMember.findUnique({
      where: { id: memberId, websiteId },
    });

    if (!member) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลสมาชิกเครือญาตินี้ในระบบ' }, { status: 400 });
    }

    // 4. Delete record
    await db.familyMember.delete({
      where: { id: memberId, websiteId },
    });

    // Log action in audit trail
    await db.auditLog.create({
      data: {
        websiteId,
        webmasterId: webmaster.id,
        action: 'DELETE',
        details: `ลบสมาชิกเครือญาติสำเร็จ: ${member.name} (ความสัมพันธ์: ${member.relationship})`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'ลบข้อมูลสมาชิกเครือญาติสำเร็จ',
    });
  } catch (error) {
    console.error('Delete family member error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์ในการลบข้อมูลญาติ' }, { status: 500 });
  }
}
