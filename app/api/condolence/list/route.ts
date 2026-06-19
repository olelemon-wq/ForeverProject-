import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');

    if (!websiteId) {
      return NextResponse.json({ error: 'กรุณาระบุรหัสเว็บไซต์ (websiteId)' }, { status: 400 });
    }

    // 1. Fetch only approved messages (BR027)
    const condolences = await db.condolence.findMany({
      where: {
        websiteId,
        isApproved: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 2. Perform in-memory priority sorting (BR028: Family messages must be displayed before General messages)
    const sortedCondolences = condolences.sort((a, b) => {
      if (a.type === 'FAMILY' && b.type !== 'FAMILY') return -1;
      if (a.type !== 'FAMILY' && b.type === 'FAMILY') return 1;
      return 0; // maintain original chronological sort order
    });

    return NextResponse.json({
      success: true,
      condolences: sortedCondolences,
    });
  } catch (error) {
    console.error('List condolences error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลบอร์ดไว้อาลัย' },
      { status: 500 }
    );
  }
}
