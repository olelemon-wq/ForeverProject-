import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET() {
  try {
    // 1. Authenticate user from session token
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' }, { status: 401 });
    }

    const decoded = await verifyToken(session);
    if (!decoded || !decoded.phone) {
      return NextResponse.json({ error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
    }

    // 2. Fetch all website relations for this Webmaster phone number
    const webmaster = await db.webmaster.findUnique({
      where: { phone: decoded.phone },
      include: {
        websites: {
          include: {
            website: true,
          },
        },
      },
    });

    if (!webmaster) {
      return NextResponse.json({ websites: [] });
    }

    const managedSites = webmaster.websites.map((relation) => ({
      id: relation.website.id,
      slug: relation.website.slug,
      name: relation.website.name,
      category: relation.website.category,
      status: relation.website.status,
      expiredAt: relation.website.expiredAt,
      donationPromptPay: relation.website.donationPromptPay,
      donationAccountName: relation.website.donationAccountName,
      donationActive: relation.website.donationActive,
      themeConfig: relation.website.themeConfig,
      role: relation.role,
    }));

    return NextResponse.json({
      success: true,
      websites: managedSites,
    });
  } catch (error) {
    console.error('List user websites error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์ในการดึงข้อมูลเว็บไซต์ของคุณ' },
      { status: 500 }
    );
  }
}
