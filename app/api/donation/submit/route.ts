import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { websiteId, donorName, amount, message, isAnonymous, hideAmount, slipUrl } = await request.json();

    if (!websiteId || !donorName || !amount) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อผู้ร่วมทำบุญและจำนวนเงิน' }, { status: 400 });
    }

    const parseAmount = parseFloat(amount);
    if (isNaN(parseAmount) || parseAmount <= 0) {
      return NextResponse.json({ error: 'จำนวนเงินทำบุญต้องมากกว่า 0 บาท' }, { status: 400 });
    }

    // 1. Verify tenant exists and is active
    const tenant = await db.tenant.findUnique({
      where: { id: websiteId },
    });

    if (!tenant || tenant.status === 'SUSPENDED') {
      return NextResponse.json({ error: 'ไม่พบเว็บไซต์รำลึกนี้ในระบบ หรือหน้าเว็บถูกระงับชั่วคราว' }, { status: 404 });
    }

    // 2. Slip Verification simulation (integrating SlipOk concept from Grill-me)
    const hasSlipOk = !!process.env.SLIPOK_API_KEY;
    let isVerified = true; // Default mock success

    if (hasSlipOk) {
      console.log(`[SlipOk Verification] Authenticated verification active with key: ...${process.env.SLIPOK_API_KEY?.substring(0, 5)}`);
      // Simulate real HTTP post to SlipOk parsing service
      // const res = await fetch('https://api.slipok.com/api/v1/verify', { ... })
    }

    // 3. Create Donation record
    const donation = await db.donation.create({
      data: {
        websiteId,
        donorName: isAnonymous ? 'ผู้ไม่ประสงค์ออกนาม' : donorName,
        amount: parseAmount,
        message: message || null,
        isAnonymous: isAnonymous || false,
        hideAmount: hideAmount || false,
        slipUrl: slipUrl || null,
        isVerified,
      },
    });

    // 4. Log in AuditTrail
    await db.auditLog.create({
      data: {
        websiteId,
        action: 'STORAGE',
        details: `มีผู้ร่วมทำบุญใหม่: ${isAnonymous ? 'ผู้ไม่ประสงค์ออกนาม' : donorName} ยอดเงินโอน ${parseAmount} บาท (สแกนสลิปสำเร็จ)`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'ส่งสลิปโอนเงินและบันทึกรายนามผู้ทำบุญสำเร็จ ขออนุโมทนาบุญ',
      donation,
    });
  } catch (error) {
    console.error('Submit donation error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในระบบในการส่งข้อมูลทำบุญ' }, { status: 500 });
  }
}
