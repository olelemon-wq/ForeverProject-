import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(request: Request) {
  try {
    // 1. Authenticate webmaster
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' }, { status: 401 });
    }

    const decoded = await verifyToken(session);
    if (!decoded || !decoded.phone) {
      return NextResponse.json({ error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
    }

    // 2. Parse request variables
    const { id, websiteId, title, author, pdfUrl, totalPages, pages } = await request.json();

    if (!websiteId || !title || !author || !pdfUrl || !totalPages || !pages) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลหนังสือให้ครบถ้วน' }, { status: 400 });
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
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์จัดการข้อมูลหนังสือที่ระลึกของเว็บไซต์นี้' }, { status: 403 });
    }

    // 4. Save/Upsert the Ebook record
    let ebook;
    if (id) {
      ebook = await db.ebook.update({
        where: { id, websiteId },
        data: {
          title,
          author,
          pdfUrl,
          totalPages: parseInt(totalPages, 10),
          pages,
        },
      });
    } else {
      ebook = await db.ebook.create({
        data: {
          websiteId,
          title,
          author,
          pdfUrl,
          totalPages: parseInt(totalPages, 10),
          pages,
        },
      });
    }

    // Log action in audit trail (BR036)
    await db.auditLog.create({
      data: {
        websiteId,
        webmasterId: webmaster.id,
        action: 'PUBLISH',
        details: id 
          ? `แก้ไขหนังสือธรรมะ/ของชำร่วยสำเร็จ: ${title} (โดย: ${author})` 
          : `อัปโหลดหนังสือธรรมะ/ของชำร่วยใหม่สำเร็จ: ${title} (โดย: ${author})`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'บันทึกข้อมูลหนังสือที่ระลึกสำเร็จ',
      ebook,
    });
  } catch (error) {
    console.error('Submit ebook error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์ในการบันทึกข้อมูลหนังสือ' }, { status: 500 });
  }
}
