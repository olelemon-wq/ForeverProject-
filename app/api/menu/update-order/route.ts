import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(request: Request) {
  try {
    // 1. Authenticate user from session token
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนทำการตั้งค่าเมนู' }, { status: 401 });
    }

    const decoded = await verifyToken(session);
    if (!decoded || !decoded.phone) {
      return NextResponse.json({ error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
    }

    // 2. Parse request variables
    const { menuItems, websiteId } = await request.json();

    if (!menuItems || !Array.isArray(menuItems) || !websiteId) {
      return NextResponse.json({ error: 'ข้อมูลสำหรับบันทึกรายการเมนูไม่ถูกต้อง' }, { status: 400 });
    }

    // 3. Resolve Webmaster credentials
    const webmaster = await db.webmaster.findUnique({
      where: { phone: decoded.phone },
    });

    if (!webmaster) {
      return NextResponse.json({ error: 'ไม่พบสิทธิ์ผู้ใช้งานระบบ' }, { status: 403 });
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
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์จัดการข้อมูลเว็บไซต์นี้' }, { status: 403 });
    }

    // 4. Update the order and visibility of all menus in a transaction
    await db.$transaction(
      menuItems.map((item: { id: string; sortOrder: number; isVisible: boolean }) =>
        db.menu.update({
          where: {
            id: item.id,
            websiteId, // secure query scoping
          },
          data: {
            sortOrder: item.sortOrder,
            isVisible: item.isVisible,
          },
        })
      )
    );

    // 5. Update audit log (BR036)
    await db.auditLog.create({
      data: {
        websiteId,
        webmasterId: webmaster.id,
        action: 'PUBLISH',
        details: `อัปเดตสเปกความเรียงและสลับลำดับเมนูเพจหลักจำนวน ${menuItems.length} เมนู`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'บันทึกการจัดเรียงลำดับและซ่อนหน้าเมนูสำเร็จ',
    });
  } catch (error) {
    console.error('Update menu order error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์ในการบันทึกเมนู' },
      { status: 500 }
    );
  }
}
