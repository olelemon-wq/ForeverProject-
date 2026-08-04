import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { websiteId, senderName, relationship, message, type } = await request.json();

    if (!websiteId || !senderName || !relationship || !message || !type) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลส่วนประกอบให้ครบถ้วนสำหรับการเขียนคำไว้อาลัย' },
        { status: 400 },
      );
    }

    const website = await db.tenant.findUnique({
      where: { id: websiteId },
    });

    if (!website) {
      return NextResponse.json({ error: 'ไม่พบรายชื่อเว็บไซต์ความทรงจำนี้ในระบบ' }, { status: 400 });
    }

    if (website.status === 'SUSPENDED') {
      return NextResponse.json(
        { error: 'ขออภัย เว็บไซต์นี้ถูกระงับการทำงานชั่วคราวเนื่องจากข้อตกลงสมาชิก ไม่สามารถส่งข้อความได้' },
        { status: 403 },
      );
    }

    const condolence = await db.condolence.create({
      data: {
        websiteId,
        senderName,
        relationship,
        message,
        type,
        isApproved: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'ส่งข้อความสำเร็จ ข้อความของคุณจะปรากฏบนบอร์ดหลังได้รับการอนุมัติจากผู้ดูแล',
      condolenceId: condolence.id,
    });
  } catch (error) {
    console.error('Submit condolence error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในระบบตรวจรับข้อความไว้อาลัย' },
      { status: 500 },
    );
  }
}
