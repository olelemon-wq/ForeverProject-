import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';
import { MANDATORY_FEATURES } from '@/lib/categories';
import { normalizeFeatureMap } from '@/lib/features';

/**
 * Save the per-feature visibility map for a tenant.
 *
 * Used by the post-payment checklist and by the "ฟีเจอร์ที่เปิดใช้งาน"
 * section in /manage settings. Merges the normalized map into
 * `themeConfig.features` and keeps the legacy `donationActive` /
 * `themeConfig.announcement.active` flags in sync so existing gates that read
 * those two fields keep working.
 */
export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนบันทึกการตั้งค่า' }, { status: 401 });
    }

    const decoded = await verifyToken(session);
    if (!decoded || !decoded.phone) {
      return NextResponse.json({ error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
    }

    // 2. Parse params
    const { websiteId, features } = await request.json();

    if (!websiteId) {
      return NextResponse.json({ error: 'กรุณาระบุรหัสเว็บไซต์ความทรงจำ' }, { status: 400 });
    }

    const featureMap = normalizeFeatureMap(features);
    // Enforce mandatory features are always true
    for (const key of MANDATORY_FEATURES) {
      featureMap[key] = true;
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

    // 4. Merge feature map into themeConfig, keeping legacy flags in sync
    const tenant = await db.tenant.findUnique({ where: { id: websiteId } });
    if (!tenant) {
      return NextResponse.json({ error: 'ไม่พบเว็บไซต์ความทรงจำนี้' }, { status: 404 });
    }

    if (tenant.status === 'PENDING_PAYMENT') {
      return NextResponse.json({ error: 'ไม่สามารถปรับปรุงฟีเจอร์ได้เนื่องจากเว็บไซต์อยู่ในสถานะรอชำระเงิน' }, { status: 403 });
    }

    const currentConfig =
      tenant.themeConfig && typeof tenant.themeConfig === 'object'
        ? (tenant.themeConfig as Record<string, unknown>)
        : {};
    const currentAnnouncement =
      currentConfig.announcement && typeof currentConfig.announcement === 'object'
        ? (currentConfig.announcement as Record<string, unknown>)
        : {};

    const newThemeConfig = {
      ...currentConfig,
      features: featureMap,
      announcement: {
        ...currentAnnouncement,
        active: featureMap.announcement,
      },
    };

    const updatedTenant = await db.tenant.update({
      where: { id: websiteId },
      data: {
        themeConfig: newThemeConfig,
        donationActive: featureMap.donation,
      },
    });

    // 5. Audit trail (BR036)
    await db.auditLog.create({
      data: {
        websiteId,
        webmasterId: webmaster.id,
        action: 'PUBLISH',
        details: `อัปเดตฟีเจอร์ที่เปิดใช้งานสำหรับ /${updatedTenant.slug}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'บันทึกฟีเจอร์ที่เปิดใช้งานสำเร็จ',
      features: featureMap,
    });
  } catch (error) {
    console.error('Update features error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการบันทึกฟีเจอร์ที่เปิดใช้งาน' },
      { status: 500 }
    );
  }
}
