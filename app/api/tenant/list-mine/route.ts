import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';
import {
  ensureWebmasterForPhone,
  healOwnedWebsiteLinks,
} from '@/lib/auth/webmaster';

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

    const cleanPhone = String(decoded.phone).replace(/[^0-9]/g, '');
    const webmaster = await ensureWebmasterForPhone(cleanPhone);

    const linkedIds = new Set(
      (webmaster.websites || []).map((r: { websiteId: string }) => r.websiteId)
    );
    await healOwnedWebsiteLinks(webmaster.id, cleanPhone, linkedIds);

    const fresh = await db.webmaster.findUnique({
      where: { id: webmaster.id },
      include: {
        websites: {
          include: {
            website: true,
          },
        },
      },
    });

    const managedSites = (fresh?.websites || []).map((relation) => ({
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
