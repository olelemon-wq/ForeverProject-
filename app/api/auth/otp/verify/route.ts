import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth/jwt';
import { ensureWebmasterForPhone } from '@/lib/auth/webmaster';

export async function POST(request: Request) {
  try {
    const { phoneNumber, otpCode, category } = await request.json();

    if (!phoneNumber || !otpCode) {
      return NextResponse.json(
        { error: 'กรุณาระบุเบอร์โทรศัพท์และรหัส OTP' },
        { status: 400 }
      );
    }

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

    // 1. Fetch the OTP request from DB
    const otpRequest = await db.otpRequest.findUnique({
      where: { phone: cleanPhone },
    });

    if (!otpRequest) {
      return NextResponse.json(
        { error: 'ไม่มีข้อมูลการขอรหัส OTP หรือรหัสอาจหมดอายุแล้ว กรุณาส่งใหม่อีกครั้ง' },
        { status: 400 }
      );
    }

    // 2. Security Check: Block if wrong attempts exceed 5
    if (otpRequest.attempts >= 5) {
      return NextResponse.json(
        { error: 'คุณพิมพ์รหัส OTP ผิดเกิน 5 ครั้งเนื่องจากระบบความปลอดภัย กรุณาขอรหัส OTP ใหม่' },
        { status: 400 }
      );
    }

    // 3. Expiration Check
    if (new Date() > new Date(otpRequest.expiresAt)) {
      await db.otpRequest.delete({ where: { phone: cleanPhone } }).catch(() => {});
      return NextResponse.json(
        { error: 'รหัส OTP หมดอายุแล้ว (เกิน 5 นาที) กรุณาขอรหัสใหม่อีกครั้ง' },
        { status: 400 }
      );
    }

    // 4. Code verification check
    if (otpRequest.code !== otpCode) {
      // Increment wrong attempts counter
      await db.otpRequest.update({
        where: { phone: cleanPhone },
        data: { attempts: { increment: 1 } },
      });

      const remainingAttempts = 5 - (otpRequest.attempts + 1);
      return NextResponse.json(
        { error: `รหัส OTP ไม่ถูกต้อง (คุณป้อนผิดได้อีก ${remainingAttempts} ครั้ง)` },
        { status: 400 }
      );
    }

    // 5. Successful login path: Clean up OTP Request
    await db.otpRequest.delete({
      where: { phone: cleanPhone },
    }).catch(() => {});

    // 6. Auto-register / Retrieve Webmaster (legacy-safe if WebmasterPhone table missing)
    const webmaster = await ensureWebmasterForPhone(cleanPhone);

    // 7. Sign token & write session cookie (90 days)
    const token = await signToken({ phone: cleanPhone });

    const response = NextResponse.json({
      success: true,
      message: 'ยืนยันตัวตนสำเร็จ ยินดีต้อนรับเข้าสู่ระบบ',
      webmaster,
      category: category || null,
    });

    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 90 * 24 * 60 * 60, // 90 days
    });

    return response;
  } catch (error: any) {
    console.error('OTP verify error:', error);
    return NextResponse.json(
      { error: `เกิดข้อผิดพลาดของระบบ: ${error.message || error}` },
      { status: 500 }
    );
  }
}
