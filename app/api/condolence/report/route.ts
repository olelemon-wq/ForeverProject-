import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  CONDOLENCE_REPORT_DETAILS_MAX,
  CONDOLENCE_REPORT_REASONS,
  type CondolenceReportReason,
} from '@/lib/condolenceReport';
import { getReporterHash } from '@/lib/requestFingerprint';

const VALID_REASONS = new Set(CONDOLENCE_REPORT_REASONS.map((r) => r.value));

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      websiteId,
      condolenceId,
      reason,
      details,
      captchaNum1,
      captchaNum2,
      captchaAnswer,
    } = body;

    if (!websiteId || !condolenceId || !reason) {
      return NextResponse.json({ error: 'กรุณาระบุข้อมูลให้ครบถ้วน' }, { status: 400 });
    }

    if (!VALID_REASONS.has(reason as CondolenceReportReason)) {
      return NextResponse.json({ error: 'สาเหตุการแจ้งไม่ถูกต้อง' }, { status: 400 });
    }

    const num1 = Number(captchaNum1);
    const num2 = Number(captchaNum2);
    const answer = Number(captchaAnswer);
    if (!Number.isFinite(num1) || !Number.isFinite(num2) || !Number.isFinite(answer)) {
      return NextResponse.json({ error: 'กรุณายืนยันตัวตนด้วยคำตอบตัวเลข' }, { status: 400 });
    }
    if (num1 + num2 !== answer) {
      return NextResponse.json({ error: 'คำตอบยืนยันตัวตนไม่ถูกต้อง กรุณาลองอีกครั้ง' }, { status: 400 });
    }

    const trimmedDetails =
      typeof details === 'string' && details.trim()
        ? details.trim().slice(0, CONDOLENCE_REPORT_DETAILS_MAX)
        : null;

    const website = await db.tenant.findUnique({ where: { id: websiteId } });
    if (!website || website.status === 'SUSPENDED') {
      return NextResponse.json({ error: 'ไม่สามารถแจ้งข้อความนี้ได้ในขณะนี้' }, { status: 400 });
    }

    const condolence = await db.condolence.findFirst({
      where: { id: condolenceId, websiteId, isApproved: true },
    });
    if (!condolence) {
      return NextResponse.json({ error: 'ไม่พบข้อความที่ต้องการแจ้ง' }, { status: 404 });
    }

    const reporterHash = getReporterHash(request);

    const existing = await db.condolenceReport.findUnique({
      where: {
        condolenceId_reporterHash: {
          condolenceId,
          reporterHash,
        },
      },
    });
    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyReported: true,
        message: 'คุณได้ส่งรายงานข้อความนี้แล้ว ทีมงานจะตรวจสอบโดยเร็ว',
      });
    }

    await db.condolenceReport.create({
      data: {
        websiteId,
        condolenceId,
        reason,
        details: trimmedDetails,
        reporterHash,
        status: 'OPEN',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'ขอบคุณที่แจ้ง ทีมงานจะตรวจสอบข้อความนี้โดยเร็ว',
    });
  } catch (error) {
    console.error('Submit condolence report error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการส่งรายงาน' }, { status: 500 });
  }
}
