import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');

    if (!websiteId) {
      return NextResponse.json({ error: 'กรุณาระบุรหัสเว็บไซต์ (websiteId)' }, { status: 400 });
    }

    const members = await db.familyMember.findMany({
      where: { websiteId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({
      success: true,
      members,
    });
  } catch (error) {
    console.error('List family members error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผังเครือญาติ' },
      { status: 500 }
    );
  }
}
