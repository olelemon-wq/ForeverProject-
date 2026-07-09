import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth/jwt';
import { getInitialFeatureMapForCategory } from '@/lib/categories';

export async function POST(request: Request) {
  try {
    const { phoneNumber, otpCode, category } = await request.json();

    if (!phoneNumber || !otpCode) {
      return NextResponse.json(
        { error: 'กรุณาระบุเบอร์โทรศัพท์และรหัส OTP' },
        { status: 400 }
      );
    }

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

    // 1. Fetch the OTP request from DB
    const otpRequest = await db.otpRequest.findUnique({
      where: { phone: cleanPhone },
    });

    if (!otpRequest) {
      return NextResponse.json(
        { error: 'ไม่มีข้อมูลการขอรหัส OTP หรือรหัสอาจหมดอายุแล้ว กรุณาส่งใหม่อีกครั้ง' },
        { status: 400 }
      );
    }

    // 2. Security Check: Block if wrong attempts exceed 5
    if (otpRequest.attempts >= 5) {
      return NextResponse.json(
        { error: 'คุณพิมพ์รหัส OTP ผิดเกิน 5 ครั้งเนื่องจากระบบความปลอดภัย กรุณาขอรหัส OTP ใหม่' },
        { status: 400 }
      );
    }

    // 3. Expiration Check
    if (new Date() > new Date(otpRequest.expiresAt)) {
      await db.otpRequest.delete({ where: { phone: cleanPhone } }).catch(() => {});
      return NextResponse.json(
        { error: 'รหัส OTP หมดอายุแล้ว (เกิน 5 นาที) กรุณาขอรหัสใหม่อีกครั้ง' },
        { status: 400 }
      );
    }

    // 4. Code verification check
    if (otpRequest.code !== otpCode) {
      // Increment wrong attempts counter
      await db.otpRequest.update({
        where: { phone: cleanPhone },
        data: { attempts: { increment: 1 } },
      });

      const remainingAttempts = 5 - (otpRequest.attempts + 1);
      return NextResponse.json(
        { error: `รหัส OTP ไม่ถูกต้อง (คุณป้อนผิดได้อีก ${remainingAttempts} ครั้ง)` },
        { status: 400 }
      );
    }

    // 5. Successful login path: Clean up OTP Request
    await db.otpRequest.delete({
      where: { phone: cleanPhone },
    }).catch(() => {});

    // 6. Auto-register / Retrieve Webmaster profile via WebmasterPhone
    let phoneRecord = await db.webmasterPhone.findUnique({
      where: { phone: cleanPhone },
      include: { webmaster: true },
    });

    let webmaster;
    if (phoneRecord) {
      webmaster = phoneRecord.webmaster;
    } else {
      // Fallback: Check if a Webmaster already exists with this phone number (legacy record)
      const existingWebmaster = await db.webmaster.findUnique({
        where: { phone: cleanPhone },
      });

      if (existingWebmaster) {
        webmaster = existingWebmaster;
        // Create the WebmasterPhone relation so we heal the database automatically
        await db.webmasterPhone.create({
          data: {
            webmasterId: webmaster.id,
            phone: cleanPhone,
            isPrimary: true,
          },
        }).catch((err) => {
          console.warn('Failed to auto-heal WebmasterPhone record:', err);
        });
      } else {
        // Create new Webmaster + WebmasterPhone
        webmaster = await db.webmaster.create({
          data: {
            phone: cleanPhone,
            name: '',
            phones: {
              create: {
                phone: cleanPhone,
                isPrimary: true,
              },
            },
          },
        });
      }
    }

    // 7. If Category param is provided, create a PENDING_PAYMENT Draft website with temp slug (draft-<uuid>)
    let draftTenantId: string | null = null;
    if (category) {
      const uuid = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
      const tempSlug = `draft-${uuid}`;
      const expiredAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
      
      const defaultThemeConfig = {
        primaryColor: '#0071e3', // New royal blue accent default (spec)
        secondaryColor: '#f59e0b',
        fontFamily: 'Inter',
        heroStyle: 'Classic',
        features: getInitialFeatureMapForCategory(category),
      };

      const result = await db.$transaction(async (tx) => {
        const tenant = await tx.tenant.create({
          data: {
            slug: tempSlug,
            name: `ความทรงจำแสนรัก (${category === 'Pet Memorial' ? 'สัตว์เลี้ยง' : category})`,
            category,
            ownerPhone: cleanPhone,
            themeConfig: defaultThemeConfig,
            visibility: 'PUBLIC',
            status: 'PENDING_PAYMENT', // Gated state
            expiredAt,
          },
        });

        // Default menu tabs
        await tx.menu.createMany({
          data: [
            { websiteId: tenant.id, title: 'หน้าแรก', pageType: 'HOME', sortOrder: 1, isVisible: true },
            { websiteId: tenant.id, title: 'คลังภาพรำลึก', pageType: 'GALLERY', sortOrder: 2, isVisible: true },
            { websiteId: tenant.id, title: 'สมุดไว้อาลัย', pageType: 'CONDOLENCE', sortOrder: 3, isVisible: true },
          ],
        });

        // Main webmaster link
        await tx.websiteWebmaster.create({
          data: {
            websiteId: tenant.id,
            webmasterId: webmaster.id,
            role: 'MAIN',
          },
        });

        // Payment record
        const paymentRef = `QR-${tempSlug}-${Math.floor(10000 + Math.random() * 90000)}`;
        await tx.payment.create({
          data: {
            websiteId: tenant.id,
            refId: paymentRef,
            type: 'NEW_WEBSITE',
            amount: 2000.0,
            status: 'PENDING',
          },
        });

        return tenant;
      });

      draftTenantId = result.id;
    }

    // 8. Sign token & write session cookie (90 days)
    const token = await signToken({ phone: cleanPhone });

    const response = NextResponse.json({
      success: true,
      message: 'ยืนยันตัวตนสำเร็จ ยินดีต้อนรับเข้าสู่ระบบ',
      webmaster,
      draftTenantId,
    });

    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 90 * 24 * 60 * 60, // 90 days
    });

    return response;
  } catch (error: any) {
    console.error('OTP verify error:', error);
    return NextResponse.json(
      { error: `เกิดข้อผิดพลาดของระบบ: ${error.message || error}` },
      { status: 500 }
    );
  }
}
