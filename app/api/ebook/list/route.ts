import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');

    if (!websiteId) {
      return NextResponse.json({ error: 'กรุณาระบุรหัสเว็บไซต์ (websiteId)' }, { status: 400 });
    }

    const ebooks = await db.ebook.findMany({
      where: { websiteId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      ebooks,
    });
  } catch (error) {
    console.error('List ebooks error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือที่ระลึก' },
      { status: 500 }
    );
  }
}
