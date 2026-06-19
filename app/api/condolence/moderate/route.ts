import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(request: Request) {
  try {
    // 1. Authenticate webmaster from cookie
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนทำรายการคัดกรอง' }, { status: 401 });
    }

    const decoded = await verifyToken(session);
    if (!decoded || !decoded.phone) {
      return NextResponse.json({ error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
    }

    // 2. Parse request variables
    const { condolenceId, action, websiteId } = await request.json();

    if (!condolenceId || !action || !websiteId) {
      return NextResponse.json({ error: 'กรุณาระบุรายละเอียดรายการให้ครบถ้วน' }, { status: 400 });
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
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์จัดการข้อมูลคำไว้อาลัยของเว็บไซต์นี้' }, { status: 403 });
    }

    // 4. Moderate the condolence record
    if (action === 'APPROVE') {
      await db.condolence.update({
        where: { id: condolenceId, websiteId },
        data: { isApproved: true },
      });
      
      // Log audit trail (BR036)
      await db.auditLog.create({
        data: {
          websiteId,
          webmasterId: webmaster.id,
          action: 'PUBLISH',
          details: `อนุมัติคำไว้อาลัยรหัส ${condolenceId} ออกเผยแพร่สำเร็จ`,
        },
      });
    } else if (action === 'DELETE') {
      await db.condolence.delete({
        where: { id: condolenceId, websiteId },
      });

      await db.auditLog.create({
        data: {
          websiteId,
          webmasterId: webmaster.id,
          action: 'DELETE',
          details: `ลบคำไว้อาลัยรหัส ${condolenceId} สำเร็จ`,
        },
      });
    } else {
      return NextResponse.json({ error: 'ประเภทการกระทำไม่ถูกต้อง (ระบุได้เพียง APPROVE หรือ DELETE)' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: action === 'APPROVE' ? 'อนุมัติข้อความสำเร็จ' : 'ลบข้อความสำเร็จ',
    });
  } catch (error) {
    console.error('Moderate condolence error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์ในการกลั่นกรองคำไว้อาลัย' }, { status: 500 });
  }
}
