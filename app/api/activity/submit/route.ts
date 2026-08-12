import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';
import { normalizeActivityImages, normalizeActivityRow } from '@/lib/activities';

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

    const {
      id,
      websiteId,
      title,
      description,
      images,
      pdfUrl,
      eventDate,
      isRecurring,
      sortOrder,
    } = await request.json();

    if (!websiteId || !title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'กรุณาระบุชื่อกิจกรรม' }, { status: 400 });
    }

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
      return NextResponse.json(
        { error: 'คุณไม่มีสิทธิ์จัดการกิจกรรมของเว็บไซต์นี้' },
        { status: 403 },
      );
    }

    const parsedDate =
      typeof eventDate === 'string' && eventDate.trim()
        ? new Date(eventDate)
        : null;
    if (parsedDate && Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'รูปแบบวันที่ไม่ถูกต้อง' }, { status: 400 });
    }

    const payload = {
      title: title.trim(),
      description: typeof description === 'string' ? description.trim() || null : null,
      images: normalizeActivityImages(images),
      pdfUrl: typeof pdfUrl === 'string' && pdfUrl.trim() ? pdfUrl.trim() : null,
      eventDate: parsedDate,
      isRecurring: isRecurring === true,
      sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
    };

    const activity = id
      ? await db.activity.update({
          where: { id, websiteId },
          data: payload,
        })
      : await db.activity.create({
          data: {
            websiteId,
            ...payload,
          },
        });

    await db.auditLog.create({
      data: {
        websiteId,
        webmasterId: webmaster.id,
        action: 'PUBLISH',
        details: id
          ? `แก้ไขกิจกรรมสำเร็จ: ${activity.title}`
          : `เพิ่มกิจกรรมใหม่สำเร็จ: ${activity.title}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'บันทึกข้อมูลกิจกรรมสำเร็จ',
      activity: normalizeActivityRow(activity),
    });
  } catch (error) {
    console.error('Submit activity error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์ในการบันทึกข้อมูลกิจกรรม' },
      { status: 500 },
    );
  }
}
