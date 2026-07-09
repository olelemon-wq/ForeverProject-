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
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนบันทึกการ์ด' }, { status: 401 });
    }

    const decoded = await verifyToken(session);
    if (!decoded || !decoded.phone) {
      return NextResponse.json({ error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
    }

    // 2. Parse request body
    const { 
      websiteId, 
      name, // Deceased Name
      announcementActive,
      announcementText,
      announcementStyle,
      announcementWaterDate,
      announcementWaterTime,
      announcementAbhidhammaDateRange,
      announcementAbhidhammaTime,
      announcementCremationDate,
      announcementCremationTime,
      announcementTempleName,
      announcementPavilion,
      announcementMapLink,
      announcementDressCode,
      announcementWreathPolicy,
      announcementContactPhone,
      subjects,
      elements, // Canvas text elements
      background, // Canvas bg color
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

    // 4. Load current tenant themeConfig
    const tenant = await db.tenant.findUnique({
      where: { id: websiteId },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'ไม่พบเว็บไซต์ความทรงจำนี้' }, { status: 404 });
    }

    if (tenant.status === 'PENDING_PAYMENT') {
      return NextResponse.json({ error: 'ไม่สามารถบันทึกข้อมูลหน้าเขียนการ์ดได้เนื่องจากเว็บไซต์อยู่ในสถานะรอชำระเงิน' }, { status: 403 });
    }

    const currentConfig = (tenant.themeConfig as Record<string, any>) || {};
    
    // Update themeConfig variables
    const updatedThemeConfig = {
      ...currentConfig,
      // If font family was selected in properties panel, keep it updated
      fontFamily: currentConfig.fontFamily || 'LINE Seed Sans TH',
      subjects: subjects || currentConfig.subjects || [],
      features: {
        ...(currentConfig.features || {}),
        announcement: announcementActive,
      },
      announcement: {
        ...(currentConfig.announcement || {}),
        active: announcementActive,
        text: announcementText,
        style: announcementStyle,
        fontFamily: elements[0]?.fontFamily || currentConfig.announcement?.fontFamily || 'LINE Seed Sans TH',
        waterDate: announcementWaterDate,
        waterTime: announcementWaterTime,
        abhidhammaDateRange: announcementAbhidhammaDateRange,
        abhidhammaTime: announcementAbhidhammaTime,
        cremationDate: announcementCremationDate,
        cremationTime: announcementCremationTime,
        templeName: announcementTempleName,
        pavilion: announcementPavilion,
        mapLink: announcementMapLink,
        dressCode: announcementDressCode,
        wreathPolicy: announcementWreathPolicy,
        contactPhone: announcementContactPhone,
        // Also cache elements list inside config for easy access
        canvasElements: elements,
        canvasBg: background,
      }
    };

    // 5. Update Tenant (updates Deceased name and the themeConfig)
    const updatedTenant = await db.tenant.update({
      where: { id: websiteId },
      data: {
        name: name || tenant.name,
        themeConfig: updatedThemeConfig,
      },
    });

    // 6. Upsert into Template table
    const templateData = {
      width: 600,
      height: 600,
      background,
      elements,
    };

    await db.template.upsert({
      where: { id: websiteId },
      create: {
        id: websiteId,
        name: `${updatedTenant.name}'s Custom Announcement`,
        data: templateData,
        ownerId: websiteId,
      },
      update: {
        name: `${updatedTenant.name}'s Custom Announcement`,
        data: templateData,
        updatedAt: new Date(),
      },
    });

    // 7. Log audit trail (BR036)
    await db.auditLog.create({
      data: {
        websiteId,
        webmasterId: webmaster.id,
        action: 'PUBLISH',
        details: `ปรับปรุงและจัดวางเทมเพลตการ์ดกำหนดการดิจิทัลออนไลน์ผ่าน Template Editor สำหรับ /${updatedTenant.slug}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'บันทึกการจัดแต่งการ์ดและกำหนดการสำเร็จ',
      tenant: updatedTenant,
    });
  } catch (error) {
    console.error('Save editor error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลเทมเพลตการ์ด' },
      { status: 500 }
    );
  }
}
