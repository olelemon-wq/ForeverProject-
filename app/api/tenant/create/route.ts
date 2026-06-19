import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(request: Request) {
  try {
    // 1. Authenticate user from JWT session cookie
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

    // 2. Parse request parameters
    const { slug, name, category, themeConfig, deceasedName } = await request.json();

    if (!slug || !name || !category || !deceasedName) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' }, { status: 400 });
    }

    const cleanSlug = slug.trim().toLowerCase();

    // 3. Re-validate slug uniqueness to prevent race conditions
    const existingTenant = await db.tenant.findUnique({
      where: { slug: cleanSlug },
    });

    if (existingTenant) {
      return NextResponse.json({ error: 'ชื่อลิงก์ URL นี้ถูกใช้งานไปแล้ว กรุณาป้อนชื่ออื่น' }, { status: 400 });
    }

    // 4. Retrieve or create Webmaster in database
    let webmaster = await db.webmaster.findUnique({
      where: { phone: userPhone },
    });

    if (!webmaster) {
      webmaster = await db.webmaster.create({
        data: { phone: userPhone },
      });
    }

    // 5. Calculate default values
    const expiredAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Default 1 year subscription duration
    const defaultThemeConfig = themeConfig || {
      primaryColor: '#0d9488',
      secondaryColor: '#f59e0b',
      fontFamily: 'Inter',
      heroStyle: 'Classic',
    };

    // 6. DB Transaction to create Tenant, default Menu pages, Webmaster connection, and pending payment
    const result = await db.$transaction(async (tx) => {
      // Create Tenant
      const tenant = await tx.tenant.create({
        data: {
          slug: cleanSlug,
          name,
          category,
          ownerPhone: userPhone,
          themeConfig: defaultThemeConfig,
          visibility: 'PUBLIC',
          status: 'ACTIVE', // Initial status set to ACTIVE but subscription will be created on payment success
          expiredAt,
        },
      });

      // Create default pages structure (Home, Gallery, Condolence - BR008 & default pages requirement)
      await tx.menu.createMany({
        data: [
          { websiteId: tenant.id, title: 'หน้าแรก', pageType: 'HOME', sortOrder: 1, isVisible: true },
          { websiteId: tenant.id, title: 'คลังภาพรำลึก', pageType: 'GALLERY', sortOrder: 2, isVisible: true },
          { websiteId: tenant.id, title: 'สมุดไว้อาลัย', pageType: 'CONDOLENCE', sortOrder: 3, isVisible: true },
        ],
      });

      // Bind webmaster to website as MAIN Owner
      await tx.websiteWebmaster.create({
        data: {
          websiteId: tenant.id,
          webmasterId: webmaster.id,
          role: 'MAIN',
        },
      });

      // Create pending Payment log (F004)
      const paymentRef = `QR-${cleanSlug}-${Math.floor(10000 + Math.random() * 90000)}`;
      const payment = await tx.payment.create({
        data: {
          websiteId: tenant.id,
          refId: paymentRef,
          type: 'NEW_WEBSITE',
          amount: 2000.0, // First year is 2000 baht (BR011)
          status: 'PENDING',
        },
      });

      // Create initial audit log (BR036)
      await tx.auditLog.create({
        data: {
          websiteId: tenant.id,
          webmasterId: webmaster.id,
          action: 'PUBLISH',
          details: `สร้างร่างเว็บไซต์สำเร็จและรอการชำระเงินสำหรับ /${cleanSlug}`,
        },
      });

      return { tenant, payment };
    });

    return NextResponse.json({
      success: true,
      message: 'ร่างเว็บไซต์ได้รับการบันทึกสำเร็จ กรุณาชำระเงินเพื่อเปิดใช้งาน',
      slug: result.tenant.slug,
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
