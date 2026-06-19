import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { slug, newOwnerPhone } = await request.json();

    if (!slug || !newOwnerPhone) {
      return NextResponse.json({ error: 'กรุณาระบุ URL Slug และเบอร์โทรศัพท์เจ้าของใหม่' }, { status: 400 });
    }

    const cleanSlug = slug.trim().toLowerCase();
    const cleanPhone = newOwnerPhone.trim();

    // 1. Find the Tenant/Website
    const tenant = await db.tenant.findUnique({
      where: { slug: cleanSlug },
      include: {
        webmasters: true,
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: `ไม่พบเว็บไซต์รำลึกที่ใช้ Slug /${cleanSlug}` }, { status: 404 });
    }

    // 2. Resolve/Create new Webmaster profile
    let newOwner = await db.webmaster.findUnique({
      where: { phone: cleanPhone },
    });

    if (!newOwner) {
      newOwner = await db.webmaster.create({
        data: { phone: cleanPhone },
      });
    }

    const oldOwnerPhone = tenant.ownerPhone;

    // 3. Database transaction to transfer MAIN role and update Tenant ownership (BR037)
    await db.$transaction(async (tx) => {
      // Update owner phone in Tenant
      await tx.tenant.update({
        where: { id: tenant.id },
        data: { ownerPhone: cleanPhone },
      });

      // Demote all existing webmasters of this site from MAIN to CO
      await tx.websiteWebmaster.updateMany({
        where: { websiteId: tenant.id, role: 'MAIN' },
        data: { role: 'CO' },
      });

      // Upsert WebsiteWebmaster relation for the new owner as MAIN
      const existingRelation = await tx.websiteWebmaster.findUnique({
        where: {
          websiteId_webmasterId: {
            websiteId: tenant.id,
            webmasterId: newOwner.id,
          },
        },
      });

      if (existingRelation) {
        await tx.websiteWebmaster.update({
          where: { id: existingRelation.id },
          data: { role: 'MAIN' },
        });
      } else {
        await tx.websiteWebmaster.create({
          data: {
            websiteId: tenant.id,
            webmasterId: newOwner.id,
            role: 'MAIN',
          },
        });
      }

      // Create Audit Log entry (BR036)
      await tx.auditLog.create({
        data: {
          websiteId: tenant.id,
          action: 'PAYMENT', // Classified as structural/payment context audit
          details: `แอดมินระบบทำการโอนย้ายสิทธิ์ความเป็นเจ้าของหลัก (Ownership Dispute Resolution): โอนจากเบอร์ ${oldOwnerPhone} ไปยังเบอร์ใหม่ ${cleanPhone}`,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: `โอนย้ายสิทธิ์ความเป็นเจ้าของเว็บไซต์ /${cleanSlug} ไปยังเบอร์ ${cleanPhone} สำเร็จแล้ว`,
    });
  } catch (error) {
    console.error('Transfer ownership error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์ในการโอนย้ายสิทธิ์เว็บไซต์' }, { status: 500 });
  }
}
