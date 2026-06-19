import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { websiteId, title, content, mediaUrl, mediaType, senderName } = await request.json();

    if (!websiteId || !senderName || (!content && !mediaUrl)) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อผู้ส่งและเนื้อหาหรือรูปภาพสำหรับการโพสต์เรื่องราวรำลึก' },
        { status: 400 }
      );
    }

    // 1. Fetch website status
    const website = await db.tenant.findUnique({
      where: { id: websiteId },
    });

    if (!website) {
      return NextResponse.json({ error: 'ไม่พบเว็บไซต์ความทรงจำนี้ในระบบ' }, { status: 400 });
    }

    if (website.status === 'SUSPENDED') {
      return NextResponse.json(
        { error: 'ขออภัย เว็บไซต์นี้ถูกระงับการทำงานชั่วคราว ไม่สามารถร่วมแชร์โพสต์เรื่องราวได้' },
        { status: 403 }
      );
    }

    // 2. Create the Memory Post record in pending state (isApproved = false by default)
    const post = await db.memoryPost.create({
      data: {
        websiteId,
        title: title || '',
        content: content || '',
        mediaUrl: mediaUrl || '',
        mediaType: mediaType || 'NONE',
        senderName,
        isApproved: false, // Default requires manual verification
      },
    });

    return NextResponse.json({
      success: true,
      message: 'ส่งเรื่องราวรำลึกสำเร็จ โพสต์ของคุณจะปรากฏบนบอร์ดความทรงจำหลังได้รับการอนุมัติจากผู้ดูแล',
      postId: post.id,
    });
  } catch (error) {
    console.error('Submit memory post error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการร่วมแชร์เรื่องราวความทรงจำ' },
      { status: 500 }
    );
  }
}
