import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(request: Request) {
  try {
    // 1. Authenticate webmaster
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
    const { postId, action, websiteId } = await request.json();

    if (!postId || !action || !websiteId) {
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
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์จัดการข้อมูลเรื่องราวของเว็บไซต์นี้' }, { status: 403 });
    }

    // 4. Moderate the MemoryPost record
    if (action === 'APPROVE') {
      await db.memoryPost.update({
        where: { id: postId, websiteId },
        data: { isApproved: true },
      });
      
      // Log audit log (BR036)
      await db.auditLog.create({
        data: {
          websiteId,
          webmasterId: webmaster.id,
          action: 'PUBLISH',
          details: `อนุมัติเรื่องราวรำลึกรหัส ${postId} โพสต์บน Memory Wall สำเร็จ`,
        },
      });
    } else if (action === 'DELETE') {
      await db.memoryPost.delete({
        where: { id: postId, websiteId },
      });

      await db.auditLog.create({
        data: {
          websiteId,
          webmasterId: webmaster.id,
          action: 'DELETE',
          details: `ลบเรื่องราวรำลึกรหัส ${postId} สำเร็จ`,
        },
      });
    } else {
      return NextResponse.json({ error: 'ประเภทการกระทำไม่ถูกต้อง (ระบุได้เพียง APPROVE หรือ DELETE)' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: action === 'APPROVE' ? 'อนุมัติโพสต์สำเร็จ' : 'ลบโพสต์สำเร็จ',
    });
  } catch (error) {
    console.error('Moderate memory post error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์ในการกลั่นกรองโพสต์รำลึก' }, { status: 500 });
  }
}
