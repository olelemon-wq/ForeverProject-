import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

const RESERVED_WORDS = [
  'admin', 'manage', 'api', 'payment', 'www', 'test', 'billing', 'login',
  'register', 'system', 'support', 'root', 'mail', 'ftp', 'demo',
  'favicon.ico', '_next', 'static', 'public', 'images', 'assets',
];

export async function POST(request: Request) {
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

    const { websiteId, slug } = await request.json();

    if (!websiteId || !slug) {
      return NextResponse.json({ error: 'กรุณาระบุรหัสเว็บไซต์และชื่อลิงก์ URL ที่ต้องการ' }, { status: 400 });
    }

    const cleanSlug = slug.trim().toLowerCase();

    // 1. Length validation (3 to 50 characters)
    if (cleanSlug.length < 3 || cleanSlug.length > 50) {
      return NextResponse.json({ error: 'ชื่อลิงก์ URL ต้องมีความยาวระหว่าง 3 ถึง 50 ตัวอักษร' }, { status: 400 });
    }

    // 2. Character set validation (a-z, 0-9, and hyphen)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(cleanSlug)) {
      return NextResponse.json({ error: 'ชื่อลิงก์ URL ต้องประกอบด้วยตัวภาษาอังกฤษพิมพ์เล็ก (a-z), ตัวเลข (0-9) หรือขีดกลาง (-) เท่านั้น' }, { status: 400 });
    }

    // 3. Reserved keywords check
    if (RESERVED_WORDS.includes(cleanSlug)) {
      return NextResponse.json({ error: 'ชื่อลิงก์นี้เป็นชื่อสงวนระบบ ไม่สามารถเลือกใช้ได้' }, { status: 400 });
    }

    // 4. Resolve owner permissions
    const webmaster = await db.webmaster.findUnique({
      where: { phone: decoded.phone },
    });

    if (!webmaster) {
      return NextResponse.json({ error: 'ไม่พบสิทธิ์บัญชีผู้ใช้ระบบนี้' }, { status: 403 });
    }

    const permission = await db.websiteWebmaster.findUnique({
      where: {
        websiteId_webmasterId: {
          websiteId,
          webmasterId: webmaster.id,
        },
      },
    });

    if (!permission || permission.role !== 'MAIN') {
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์เป็นเจ้าของหลักในการปรับแก้ชื่อลิงก์ของเว็บไซต์นี้' }, { status: 403 });
    }

    // 5. Database duplicate check
    const existing = await db.tenant.findFirst({
      where: {
        slug: cleanSlug,
        id: { not: websiteId },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'ชื่อลิงก์นี้ถูกผู้อื่นใช้งานไปแล้ว กรุณาป้อนชื่อใหม่อีกครั้ง' }, { status: 400 });
    }

    // 6. Update slug
    const updated = await db.tenant.update({
      where: { id: websiteId },
      data: { slug: cleanSlug },
    });

    return NextResponse.json({
      success: true,
      message: 'อัปเดตชื่อลิงก์ URL สำเร็จ',
      tenant: updated,
    });
  } catch (error) {
    console.error('Update tenant slug error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในระบบในการอัปเดตชื่อลิงก์' }, { status: 500 });
  }
}
