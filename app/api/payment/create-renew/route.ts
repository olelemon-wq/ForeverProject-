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

    const { websiteId } = await request.json();
    if (!websiteId) {
      return NextResponse.json({ error: 'กรุณาระบุรหัสเว็บไซต์' }, { status: 400 });
    }

    const webmaster = await db.webmaster.findUnique({
      where: { phone: decoded.phone },
    });

    if (!webmaster) {
      return NextResponse.json({ error: 'ไม่พบสิทธิ์ผู้ดูแลระบบ' }, { status: 403 });
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
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์จัดการบิลลิ่งของเว็บไซต์นี้' }, { status: 403 });
    }

    const tenant = await db.tenant.findUnique({
      where: { id: websiteId },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'ไม่พบเว็บไซต์ความทรงจำนี้' }, { status: 404 });
    }

    // Generate unique reference ID for renewal PromptPay QR code
    const refId = `QR-RENEW-${tenant.slug}-${Math.floor(10000 + Math.random() * 90000)}`;

    const payment = await db.payment.create({
      data: {
        websiteId,
        refId,
        type: 'RENEWAL',
        amount: 2000.00,
        status: 'PENDING',
      },
    });

    // Log action in audit logs
    await db.auditLog.create({
      data: {
        websiteId,
        webmasterId: webmaster.id,
        action: 'PAYMENT',
        details: `ร้องขอต่ออายุบริการเว็บไซต์ (รายปี) รหัสอ้างอิง: ${refId}`,
      },
    });

    return NextResponse.json({
      success: true,
      refId,
      amount: payment.amount,
    });
  } catch (error) {
    console.error('Create renewal payment error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์ในการขอต่ออายุบริการ' }, { status: 500 });
  }
}
