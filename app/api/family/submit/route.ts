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
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูลญาติ' }, { status: 401 });
    }

    const decoded = await verifyToken(session);
    if (!decoded || !decoded.phone) {
      return NextResponse.json({ error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
    }

    // 2. Parse request variables
    const { 
      id, 
      websiteId, 
      name, 
      nickname,
      relationship, 
      birthYear, 
      deathYear, 
      isDeceased, 
      hideAge,
      avatarUrl, 
      avatarScale,
      avatarX,
      avatarY,
      avatarRotate,
      spouseOfId, 
      parentId 
    } = await request.json();

    if (!websiteId || !name || !relationship) {
      return NextResponse.json({ error: 'กรุณาระบุรหัสเว็บไซต์ ชื่อญาติ และความสัมพันธ์' }, { status: 400 });
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
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์จัดการข้อมูลเครือญาติของเว็บไซต์นี้' }, { status: 403 });
    }

    // 4. Save/Upsert the FamilyMember record
    let member;
    if (id) {
      member = await db.familyMember.update({
        where: { id, websiteId },
        data: {
          name,
          nickname: nickname || null,
          relationship,
          birthYear: birthYear || null,
          deathYear: deathYear || null,
          isDeceased: isDeceased || false,
          hideAge: hideAge || false,
          avatarUrl: avatarUrl || null,
          avatarScale: avatarScale !== undefined ? avatarScale : 1.0,
          avatarX: avatarX !== undefined ? avatarX : 0.0,
          avatarY: avatarY !== undefined ? avatarY : 0.0,
          avatarRotate: avatarRotate !== undefined ? avatarRotate : 0.0,
          spouseOfId: spouseOfId || null,
          parentId: parentId || null,
        },
      });
    } else {
      member = await db.familyMember.create({
        data: {
          websiteId,
          name,
          nickname: nickname || null,
          relationship,
          birthYear: birthYear || null,
          deathYear: deathYear || null,
          isDeceased: isDeceased || false,
          hideAge: hideAge || false,
          avatarUrl: avatarUrl || null,
          avatarScale: avatarScale !== undefined ? avatarScale : 1.0,
          avatarX: avatarX !== undefined ? avatarX : 0.0,
          avatarY: avatarY !== undefined ? avatarY : 0.0,
          avatarRotate: avatarRotate !== undefined ? avatarRotate : 0.0,
          spouseOfId: spouseOfId || null,
          parentId: parentId || null,
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
          ? `แก้ไขข้อมูลญาติสำเร็จ: ${name} (ความสัมพันธ์: ${relationship})` 
          : `เพิ่มสมาชิกญาติใหม่สำเร็จ: ${name} (ความสัมพันธ์: ${relationship})`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'บันทึกข้อมูลสมาชิกเครือญาติสำเร็จ',
      member,
    });
  } catch (error) {
    console.error('Submit family member error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์ในการบันทึกข้อมูลเครือญาติ' }, { status: 500 });
  }
}
