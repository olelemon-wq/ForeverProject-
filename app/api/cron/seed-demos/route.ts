import { NextResponse } from 'next/server';
import { seedDemoSites } from '@/lib/seedDemoSites';

export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const expectedToken = process.env.CRON_SECRET || 'forever-cron-token-2026';

    if (token !== expectedToken) {
      return NextResponse.json({ error: 'ไม่ได้รับอนุญาตให้เรียกใช้งานเครื่องมือนี้' }, { status: 401 });
    }

    const result = await seedDemoSites();

    return NextResponse.json({
      success: true,
      message: `Seeded ${result.count} demo sites`,
      ...result,
    });
  } catch (error) {
    console.error('Demo seed error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดภายในระบบ' },
      { status: 500 }
    );
  }
}
