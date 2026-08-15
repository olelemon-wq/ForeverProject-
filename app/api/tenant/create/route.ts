import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';
import { getInitialFeatureMapForCategory } from '@/lib/categories';
import { getSeedDefaultMedia } from '@/lib/defaultMedia';

const CATEGORY_PLACEHOLDER_NAME: Record<string, string> = {
  Memorial: 'เว็บไซต์รำลึกถึงผู้ล่วงลับ',
  'Family Legacy': 'เว็บไซต์เรื่องเล่าครอบครัว',
  Couple: 'เว็บไซต์เรื่องราวเธอกับฉัน',
  Wedding: 'เว็บไซต์งานวิวาห์',
  Friends: 'เว็บไซต์แก๊งเพื่อน',
  'Pet Memorial': 'เว็บไซต์น้องที่รัก',
};

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนทำการสร้างเว็บไซต์' }, { status: 401 });
    }

    const decoded = await verifyToken(session);
    if (!decoded || !decoded.phone) {
      return NextResponse.json({ error: 'เซสชันหมดอายุหรือเซสชันไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
    }

    const userPhone = decoded.phone;
    const body = await request.json();
    const { category, themeConfig } = body;

    if (!category) {
      return NextResponse.json({ error: 'กรุณาเลือกหมวดความทรงจำ' }, { status: 400 });
    }

    const existingPending = await db.tenant.findFirst({
      where: {
        ownerPhone: userPhone,
        status: 'PENDING_PAYMENT',
        category,
      },
      include: {
        payments: {
          where: { status: 'PENDING', type: 'NEW_WEBSITE' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existingPending) {
      let payment = existingPending.payments[0];
      if (!payment) {
        const paymentRef = `QR-${existingPending.slug}-${Math.floor(10000 + Math.random() * 90000)}`;
        payment = await db.payment.create({
          data: {
            websiteId: existingPending.id,
            refId: paymentRef,
            type: 'NEW_WEBSITE',
            amount: 2000.0,
            status: 'PENDING',
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'มีร่างเว็บไซต์รอชำระเงินอยู่แล้ว',
        id: existingPending.id,
        slug: existingPending.slug,
        status: existingPending.status,
        payment: {
          id: payment.id,
          refId: payment.refId,
          amount: payment.amount,
        },
      });
    }

    // Draft flow: category only → temporary slug + PENDING_PAYMENT
    const cleanSlug = `draft-${randomUUID().replace(/-/g, '').slice(0, 12)}`;
    const name = CATEGORY_PLACEHOLDER_NAME[category] || 'เว็บไซต์ใหม่';

    let webmaster = await db.webmaster.findUnique({
      where: { phone: userPhone },
    });

    if (!webmaster) {
      webmaster = await db.webmaster.create({
        data: { phone: userPhone },
      });
    }

    const expiredAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    const seedMedia = getSeedDefaultMedia(category);
    const defaultThemeConfig = {
      primaryColor: '#0d9488',
      secondaryColor: '#f59e0b',
      fontFamily: 'Inter',
      heroStyle: 'Classic',
      avatarUrl: seedMedia.avatarUrl,
      coverUrl: seedMedia.coverUrl,
      subjects: [{ name: '' }],
      ...(themeConfig || {}),
      features: getInitialFeatureMapForCategory(category),
    };

    if (!defaultThemeConfig.avatarUrl) defaultThemeConfig.avatarUrl = seedMedia.avatarUrl;
    if (!defaultThemeConfig.coverUrl) defaultThemeConfig.coverUrl = seedMedia.coverUrl;

    const result = await db.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          slug: cleanSlug,
          name,
          category,
          ownerPhone: userPhone,
          themeConfig: defaultThemeConfig,
          visibility: 'PRIVATE',
          status: 'PENDING_PAYMENT',
          expiredAt,
        },
      });

      await tx.menu.createMany({
        data: [
          { websiteId: tenant.id, title: 'หน้าแรก', pageType: 'HOME', sortOrder: 1, isVisible: true },
          { websiteId: tenant.id, title: 'คลังภาพรำลึก', pageType: 'GALLERY', sortOrder: 2, isVisible: true },
          { websiteId: tenant.id, title: 'สมุดไว้อาลัย', pageType: 'CONDOLENCE', sortOrder: 3, isVisible: true },
        ],
      });

      await tx.websiteWebmaster.create({
        data: {
          websiteId: tenant.id,
          webmasterId: webmaster.id,
          role: 'MAIN',
        },
      });

      const paymentRef = `QR-${cleanSlug}-${Math.floor(10000 + Math.random() * 90000)}`;
      const payment = await tx.payment.create({
        data: {
          websiteId: tenant.id,
          refId: paymentRef,
          type: 'NEW_WEBSITE',
          amount: 2000.0,
          status: 'PENDING',
        },
      });

      await tx.auditLog.create({
        data: {
          websiteId: tenant.id,
          webmasterId: webmaster.id,
          action: 'PUBLISH',
          details: `สร้างร่างเว็บไซต์หมวด ${category} รอชำระเงิน (slug ชั่วคราว ${cleanSlug})`,
        },
      });

      return { tenant, payment };
    });

    return NextResponse.json({
      success: true,
      message: 'ร่างเว็บไซต์ได้รับการบันทึกสำเร็จ กรุณาชำระเงินเพื่อเปิดใช้งาน',
      id: result.tenant.id,
      slug: result.tenant.slug,
      status: result.tenant.status,
      payment: {
        id: result.payment.id,
        refId: result.payment.refId,
        amount: result.payment.amount,
      },
    });
  } catch (error) {
    console.error('Create website error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลและสร้างร่างเว็บไซต์' }, { status: 500 });
  }
}
