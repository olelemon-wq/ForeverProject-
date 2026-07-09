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

    const { phoneId } = await request.json();

    if (!phoneId) {
      return NextResponse.json({ error: 'กรุณาระบุรหัสรายการเบอร์โทรศัพท์ที่ต้องการลบ' }, { status: 400 });
    }

    // Resolve owner
    const ownerPhoneRecord = await db.webmasterPhone.findUnique({
      where: { phone: decoded.phone },
      include: { webmaster: true },
    });

    if (!ownerPhoneRecord || !ownerPhoneRecord.webmaster) {
      return NextResponse.json({ error: 'ไม่พบสิทธิ์บัญชีผู้ใช้ระบบนี้' }, { status: 403 });
    }

    const webmaster = ownerPhoneRecord.webmaster;

    // Fetch the target phone to delete
    const targetPhone = await db.webmasterPhone.findUnique({
      where: { id: phoneId },
    });

    if (!targetPhone || targetPhone.webmasterId !== webmaster.id) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลเบอร์โทรศัพท์นี้ในบัญชีของคุณ' }, { status: 404 });
    }

    // Security Check 1: Ensure total phones >= 2 before deleting
    const allPhones = await db.webmasterPhone.findMany({
      where: { webmasterId: webmaster.id },
    });

    if (allPhones.length <= 1) {
      return NextResponse.json({ error: 'ต้องมีเบอร์โทรศัพท์ยืนยันตนในระบบอย่างน้อย 1 เบอร์เสมอเพื่อป้องกันการสูญเสียบัญชี' }, { status: 400 });
    }

    // Security Check 2: Prevent deleting primary phone
    if (targetPhone.isPrimary) {
      return NextResponse.json({ error: 'ไม่สามารถลบเบอร์โทรศัพท์หลักได้ กรุณาตั้งค่าเบอร์โทรศัพท์อื่นเป็นเบอร์หลักก่อนทำการลบ' }, { status: 400 });
    }

    // Delete phone record
    await db.webmasterPhone.delete({
      where: { id: phoneId },
    });

    return NextResponse.json({
      success: true,
      message: 'ลบเบอร์โทรศัพท์สำรองสำเร็จ',
    });
  } catch (error) {
    console.error('Delete backup phone error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการลบเบอร์โทรศัพท์' }, { status: 500 });
  }
}
