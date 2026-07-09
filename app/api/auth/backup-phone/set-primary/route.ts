import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken, signToken } from '@/lib/auth/jwt';

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
      return NextResponse.json({ error: 'กรุณาระบุรหัสรายการเบอร์โทรศัพท์ที่ต้องการตั้งเป็นเบอร์หลัก' }, { status: 400 });
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

    // Fetch target phone record
    const targetPhone = await db.webmasterPhone.findUnique({
      where: { id: phoneId },
    });

    if (!targetPhone || targetPhone.webmasterId !== webmaster.id) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลเบอร์โทรศัพท์นี้ในบัญชีของคุณ' }, { status: 404 });
    }

    // DB transaction: set all other phones to false, set target to true, update Webmaster.phone
    await db.$transaction(async (tx) => {
      // 1. Set all phones for this webmaster to non-primary
      await tx.webmasterPhone.updateMany({
        where: { webmasterId: webmaster.id },
        data: { isPrimary: false },
      });

      // 2. Set target phone to primary
      await tx.webmasterPhone.update({
        where: { id: phoneId },
        data: { isPrimary: true },
      });

      // 3. Sync target phone to Webmaster.phone column for compatibility
      await tx.webmaster.update({
        where: { id: webmaster.id },
        data: { phone: targetPhone.phone },
      });
    });

    // Re-sign session token with the new primary phone number
    const token = await signToken({ phone: targetPhone.phone });

    const response = NextResponse.json({
      success: true,
      message: 'ตั้งค่าเบอร์โทรศัพท์หลักสำเร็จ เซสชันได้รับการปรับปรุงแล้ว',
    });

    // Update session cookie
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 90 * 24 * 60 * 60, // 90 days sliding renewal
    });

    return response;
  } catch (error) {
    console.error('Set primary phone error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการตั้งค่าเบอร์โทรศัพท์หลัก' }, { status: 500 });
  }
}
