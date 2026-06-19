import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { refId, status, amount, signature } = await request.json();

    if (!refId || !status || !amount || !signature) {
      return NextResponse.json(
        { error: 'ข้อมูลคำขอไม่ครบถ้วนสำหรับการทำรายการชำระเงิน' },
        { status: 400 }
      );
    }

    // 1. Verify digital signature from Payment Gateway (Mock verification)
    const expectedSignature = 'MOCK_SIGNATURE_OK_2026';
    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: 'ลายเซ็นดิจิทัลไม่ถูกต้อง ไม่สามารถอนุมัติรายการได้' },
        { status: 401 }
      );
    }

    // 2. Retrieve payment details
    const payment = await db.payment.findUnique({
      where: { refId },
      include: { website: true },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'ไม่พบประวัติการจองชำระเงินของรหัสอ้างอิงนี้' },
        { status: 400 }
      );
    }

    // 3. Idempotency check: If already SUCCESS, return success immediately (BR018 duplicate protection)
    if (payment.status === 'SUCCESS') {
      return NextResponse.json({
        success: true,
        message: 'รายการชำระเงินนี้ได้รับการประมวลผลเสร็จสิ้นไปแล้ว',
        alreadyProcessed: true,
      });
    }

    if (status !== 'SUCCESS') {
      await db.payment.update({
        where: { refId },
        data: { status: 'FAILED' },
      });
      return NextResponse.json(
        { error: 'สถานะการทำรายการธนาคารแจ้งไม่สำเร็จ' },
        { status: 400 }
      );
    }

    // 4. Transaction execution: Update Payment, Create Subscription, update Tenant status
    const result = await db.$transaction(async (tx) => {
      // Update Payment status
      const updatedPayment = await tx.payment.update({
        where: { refId },
        data: {
          status: 'SUCCESS',
          receiptNo: `REC-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          invoiceNo: `INV-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        },
      });

      // Calculate subscription dates
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year (BR011)
      const defaultStorageQuota = BigInt(1073741824); // 1 GB initial storage (BR011, BR013)

      // Create Active Subscription record (BR010: created ONLY after payment success)
      const subscription = await tx.subscription.create({
        data: {
          websiteId: payment.websiteId,
          plan: 'FIRST_YEAR',
          storageQuota: defaultStorageQuota,
          status: 'ACTIVE',
          startDate,
          endDate,
        },
      });

      // Activate Tenant details in website record (BR018)
      await tx.tenant.update({
        where: { id: payment.websiteId },
        data: {
          status: 'ACTIVE',
          expiredAt: endDate,
        },
      });

      // Log audit trail (BR036)
      await tx.auditLog.create({
        data: {
          websiteId: payment.websiteId,
          action: 'PAYMENT',
          details: `ชำระค่าบริการสำเร็จ ยอดโอน ${amount} บาท เปิดบริการเว็บไซต์และเปิดสิทธิ์เก็บข้อมูลความจุ 1 GB`,
        },
      });

      return { updatedPayment, subscription };
    });

    console.log(`[Payment Webhook] Activated website subscription for Tenant ID: ${payment.websiteId}`);

    return NextResponse.json({
      success: true,
      message: 'ชำระเงินเสร็จสิ้นและเปิดใช้งานสมาชิกในระบบเรียบร้อยแล้ว',
      receiptNo: result.updatedPayment.receiptNo,
      invoiceNo: result.updatedPayment.invoiceNo,
    });
  } catch (error) {
    console.error('Payment callback verification error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดภายในระบบในการเปิดใช้งานบริการ' },
      { status: 500 }
    );
  }
}
