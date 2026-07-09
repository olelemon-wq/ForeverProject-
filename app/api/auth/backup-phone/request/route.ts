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

    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: 'กรุณาระบุเบอร์โทรศัพท์มือถือที่ต้องการเพิ่ม' }, { status: 400 });
    }

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

    if (cleanPhone.length !== 10 || !cleanPhone.startsWith('0')) {
      return NextResponse.json({ error: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง ต้องเป็นตัวเลข 10 หลักและขึ้นต้นด้วยเลข 0' }, { status: 400 });
    }

    // Check if phone number is already registered anywhere
    const existing = await db.webmasterPhone.findUnique({
      where: { phone: cleanPhone },
    });

    if (existing) {
      return NextResponse.json({ error: 'เบอร์โทรศัพท์นี้ถูกลงทะเบียนไว้ในระบบความปลอดภัยแล้ว ไม่สามารถเพิ่มซ้ำได้' }, { status: 400 });
    }

    // Generate simulated 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Upsert OTP Request
    await db.otpRequest.upsert({
      where: { phone: cleanPhone },
      update: {
        code: otpCode,
        attempts: 0,
        expiresAt,
        createdAt: new Date(),
      },
      create: {
        phone: cleanPhone,
        code: otpCode,
        attempts: 0,
        expiresAt,
      },
    });

    console.log(`[Backup Phone SMS Simulation] Send OTP ${otpCode} to ${cleanPhone}`);

    return NextResponse.json({
      success: true,
      message: 'ส่งรหัส OTP เรียบร้อยแล้ว (จำลองส่ง SMS)',
      simulatedOtp: otpCode,
    });
  } catch (error) {
    console.error('Request backup phone OTP error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการส่งคำขอ OTP สำหรับเบอร์สำรอง' }, { status: 500 });
  }
}
