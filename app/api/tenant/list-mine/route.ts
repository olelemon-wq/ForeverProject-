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

    const cleanPhone = String(decoded.phone).replace(/[^0-9]/g, '');

    // 2. Resolve Webmaster via WebmasterPhone (heal legacy Webmaster.phone if needed)
    let phoneRecord = await db.webmasterPhone.findUnique({
      where: { phone: cleanPhone },
      include: {
        webmaster: {
          include: {
            websites: {
              include: {
                website: true,
              },
            },
          },
        },
      },
    });

    let webmaster = phoneRecord?.webmaster ?? null;

    if (!webmaster) {
      const legacy = await db.webmaster.findUnique({
        where: { phone: cleanPhone },
        include: {
          websites: {
            include: {
              website: true,
            },
          },
        },
      });
      if (legacy) {
        webmaster = legacy;
        await db.webmasterPhone
          .create({
            data: {
              webmasterId: legacy.id,
              phone: cleanPhone,
              isPrimary: true,
            },
          })
          .catch(() => {});
      }
    }

    if (!webmaster) {
      return NextResponse.json({ websites: [] });
    }

    // 3. Heal missing WebsiteWebmaster rows when Tenant.ownerPhone matches this phone
    const ownedTenants = await db.tenant.findMany({
      where: { ownerPhone: cleanPhone },
      select: { id: true },
    });
    const linkedIds = new Set(webmaster.websites.map((r) => r.websiteId));
    for (const tenant of ownedTenants) {
      if (linkedIds.has(tenant.id)) continue;
      await db.websiteWebmaster
        .create({
          data: {
            websiteId: tenant.id,
            webmasterId: webmaster.id,
            role: 'MAIN',
          },
        })
        .catch(() => {});
      linkedIds.add(tenant.id);
    }

    // 4. Re-fetch relations after heal
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
