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

    const { phoneNumber, otpCode } = await request.json();

    if (!phoneNumber || !otpCode) {
      return NextResponse.json({ error: 'กรุณาระบุเบอร์โทรศัพท์และรหัส OTP ที่ถูกต้อง' }, { status: 400 });
    }

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

    // Fetch the OTP request
    const otpRequest = await db.otpRequest.findUnique({
      where: { phone: cleanPhone },
    });

    if (!otpRequest) {
      return NextResponse.json({ error: 'ไม่มีข้อมูลการขอรหัส OTP หรือหมดอายุแล้ว กรุณาส่งรหัสใหม่อีกครั้ง' }, { status: 400 });
    }

    if (otpRequest.attempts >= 5) {
      return NextResponse.json({ error: 'ป้อนรหัส OTP ผิดพลาดเกินกำหนด กรุณาขอรหัสความปลอดภัยใหม่' }, { status: 400 });
    }

    if (new Date() > new Date(otpRequest.expiresAt)) {
      await db.otpRequest.delete({ where: { phone: cleanPhone } }).catch(() => {});
      return NextResponse.json({ error: 'รหัส OTP หมดอายุการใช้งานแล้ว กรุณาส่งใหม่อีกครั้ง' }, { status: 400 });
    }

    if (otpRequest.code !== otpCode) {
      await db.otpRequest.update({
        where: { phone: cleanPhone },
        data: { attempts: { increment: 1 } },
      });
      const rem = 5 - (otpRequest.attempts + 1);
      return NextResponse.json({ error: `รหัส OTP ไม่ถูกต้อง (ป้อนผิดได้อีก ${rem} ครั้ง)` }, { status: 400 });
    }

    // Clean up OTP Request
    await db.otpRequest.delete({ where: { phone: cleanPhone } }).catch(() => {});

    // Resolve owner
    const phoneRecord = await db.webmasterPhone.findUnique({
      where: { phone: decoded.phone },
      include: { webmaster: true },
    });

    if (!phoneRecord || !phoneRecord.webmaster) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลผู้ดูแลหลักที่จะรับผูกเบอร์' }, { status: 403 });
    }

    const webmaster = phoneRecord.webmaster;

    // Check if phone number is already registered anywhere
    const existing = await db.webmasterPhone.findUnique({
      where: { phone: cleanPhone },
    });

    if (existing) {
      return NextResponse.json({ error: 'เบอร์โทรศัพท์นี้ถูกใช้งานไปแล้ว' }, { status: 400 });
    }

    // Insert phone record linked to the webmaster profile
    const newPhone = await db.webmasterPhone.create({
      data: {
        webmasterId: webmaster.id,
        phone: cleanPhone,
        isPrimary: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'เชื่อมต่อเบอร์โทรศัพท์สำรองสำเร็จ',
      phone: newPhone,
    });
  } catch (error) {
    console.error('Verify backup phone OTP error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการตรวจสอบรหัส OTP' }, { status: 500 });
  }
}
