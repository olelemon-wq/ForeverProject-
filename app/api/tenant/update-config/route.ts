import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนอัปเดตการตั้งค่า' }, { status: 401 });
    }

    const decoded = await verifyToken(session);
    if (!decoded || !decoded.phone) {
      return NextResponse.json({ error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
    }

    // 2. Parse variables including new donation parameters
    const { 
      websiteId, 
      name, 
      category, 
      themeConfig, 
      visibility, 
      donationPromptPay, 
      donationAccountName, 
      donationActive 
    } = await request.json();

    if (!websiteId) {
      return NextResponse.json({ error: 'กรุณาระบุรหัสเว็บไซต์ความทรงจำ' }, { status: 400 });
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
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์อัปเดตข้อมูลของเว็บไซต์ความทรงจำนี้' }, { status: 403 });
    }

    const tenant = await db.tenant.findUnique({
      where: { id: websiteId }
    });

    if (tenant && tenant.status === 'PENDING_PAYMENT') {
      return NextResponse.json({ error: 'ไม่สามารถอัปเดตข้อมูลได้เนื่องจากเว็บไซต์อยู่ในสถานะรอชำระเงิน' }, { status: 403 });
    }

    // 4. Update fields
    const updatedTenant = await db.tenant.update({
      where: { id: websiteId },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(themeConfig && { themeConfig }),
        ...(visibility && { visibility }),
        ...(donationPromptPay !== undefined && { donationPromptPay }),
        ...(donationAccountName !== undefined && { donationAccountName }),
        ...(donationActive !== undefined && { donationActive }),
      },
    });

    // 5. Log audit trail (BR036)
    await db.auditLog.create({
      data: {
        websiteId,
        webmasterId: webmaster.id,
        action: 'PUBLISH',
        details: `ปรับแต่งการตั้งค่าเว็บไซต์และตารางทำบุญ Donation QR สำหรับ /${updatedTenant.slug}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'บันทึกการตั้งค่าเว็บไซต์ความทรงจำสำเร็จ',
      tenant: updatedTenant,
    });
  } catch (error) {
    console.error('Update tenant config error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลความทรงจำ' },
      { status: 500 }
    );
  }
}
