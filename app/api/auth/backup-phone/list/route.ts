import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET() {
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

    // Resolve webmaster via WebmasterPhone
    const phoneRecord = await db.webmasterPhone.findUnique({
      where: { phone: decoded.phone },
      include: {
        webmaster: {
          include: {
            phones: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });

    if (!phoneRecord || !phoneRecord.webmaster) {
      return NextResponse.json({ phones: [] });
    }

    return NextResponse.json({
      success: true,
      phones: phoneRecord.webmaster.phones,
    });
  } catch (error) {
    console.error('List backup phones error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการโหลดรายการเบอร์โทรศัพท์' }, { status: 500 });
  }
}
