import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';
import { getCondolenceReportReasonLabel } from '@/lib/condolenceReport';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');

    if (!websiteId) {
      return NextResponse.json({ error: 'กรุณาระบุรหัสเว็บไซต์ (websiteId)' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' }, { status: 401 });
    }

    const decoded = await verifyToken(session);
    if (!decoded?.phone) {
      return NextResponse.json({ error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
    }

    const webmaster = await db.webmaster.findUnique({ where: { phone: decoded.phone } });
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
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์เข้าดูข้อมูลคัดกรองสำหรับเว็บไซต์นี้' }, { status: 403 });
    }

    const openReports = await db.condolenceReport.findMany({
      where: { websiteId, status: 'OPEN' },
      include: {
        condolence: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const grouped = new Map<
      string,
      {
        condolence: (typeof openReports)[number]['condolence'];
        reports: Array<{
          id: string;
          reason: string;
          reasonLabel: string;
          details: string | null;
          createdAt: string;
        }>;
      }
    >();

    for (const report of openReports) {
      if (!report.condolence?.isApproved) continue;
      const entry = grouped.get(report.condolenceId) ?? {
        condolence: report.condolence,
        reports: [],
      };
      entry.reports.push({
        id: report.id,
        reason: report.reason,
        reasonLabel: getCondolenceReportReasonLabel(report.reason),
        details: report.details,
        createdAt: report.createdAt.toISOString(),
      });
      grouped.set(report.condolenceId, entry);
    }

    return NextResponse.json({
      success: true,
      items: Array.from(grouped.values()),
    });
  } catch (error) {
    console.error('Fetch reported condolences error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการดึงรายการแจ้ง' }, { status: 500 });
  }
}
