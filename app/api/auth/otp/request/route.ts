import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: 'กรุณาระบุเบอร์โทรศัพท์มือถือ' }, { status: 400 });
    }

    // Clean phone number (keep only digits)
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

    // Validate Thai mobile phone format: 10 digits, starts with 0
    if (cleanPhone.length !== 10 || !cleanPhone.startsWith('0')) {
      return NextResponse.json(
        { error: 'กรุณากรอกเบอร์โทรศัพท์มือถือ 10 หลักให้ถูกต้อง (เช่น 0812345678)' },
        { status: 400 }
      );
    }

    // 1. Throttling check (SMS Flood Protection): Limit to 1 OTP per 60 seconds
    const existingRequest = await db.otpRequest.findUnique({
      where: { phone: cleanPhone },
    });

    if (existingRequest) {
      const secondsSinceLastRequest = Math.floor(
        (Date.now() - new Date(existingRequest.createdAt).getTime()) / 1000
      );

      if (secondsSinceLastRequest < 60) {
        const remainingSeconds = 60 - secondsSinceLastRequest;
        return NextResponse.json(
          { error: `กรุณารออีก ${remainingSeconds} วินาทีก่อนขอรหัส OTP ใหม่อีกครั้ง` },
          { status: 429 }
        );
      }
    }

    // 2. Generate random 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Save/Upsert OTP request in DB (expires in 5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

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
        expiresAt,
      },
    });

    // Diagnostical logger for server console
    console.log(`[SMS OTP Simulator] OTP for ${cleanPhone} is: ${otpCode}`);

    // Return the generated OTP code in the response body (simulating SMS gateway delivery)
    return NextResponse.json({
      success: true,
      message: 'ส่งรหัส OTP สำเร็จ (จำลองการรับรหัส)',
      simulatedOtp: otpCode,
    });
  } catch (error) {
    console.error('OTP request error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดของระบบ กรุณาลองใหม่อีกครั้ง' }, { status: 500 });
  }
}
