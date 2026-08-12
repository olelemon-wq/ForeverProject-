import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { normalizeActivityRow } from '@/lib/activities';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');

    if (!websiteId) {
      return NextResponse.json({ error: 'กรุณาระบุรหัสเว็บไซต์ (websiteId)' }, { status: 400 });
    }

    const rows = await db.activity.findMany({
      where: { websiteId },
      orderBy: [{ sortOrder: 'asc' }, { eventDate: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({
      success: true,
      activities: rows.map(normalizeActivityRow),
    });
  } catch (error) {
    console.error('List activities error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม' },
      { status: 500 },
    );
  }
}
