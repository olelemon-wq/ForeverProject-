import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    // 1. Verify cron authorization token (protection from public trigger)
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const expectedToken = process.env.CRON_SECRET || 'forever-cron-token-2026';

    if (token !== expectedToken) {
      return NextResponse.json({ error: 'ไม่ได้รับอนุญาตให้เรียกใช้งานเครื่องมือจัดตารางเวลานี้' }, { status: 401 });
    }

    const now = new Date();
    const updatedTenants: Array<{ id: string; slug: string; oldStatus: string; newStatus: string }> = [];

    // 2. Fetch all tenants that are not yet flagged for admin review but might need lifecycle updates
    const tenants = await db.tenant.findMany({
      where: {
        status: { in: ['ACTIVE', 'READ_ONLY', 'SUSPENDED', 'ARCHIVED'] },
      },
    });

    for (const tenant of tenants) {
      const expirationDate = new Date(tenant.expiredAt);
      
      // If the subscription has expired
      if (now > expirationDate) {
        const msDiff = now.getTime() - expirationDate.getTime();
        const daysExpired = Math.floor(msDiff / (1000 * 60 * 60 * 24)) + 1;
        
        let targetStatus = tenant.status;

        // Apply rules from BR021 & BR022
        if (daysExpired >= 1 && daysExpired <= 30) {
          targetStatus = 'READ_ONLY';
        } else if (daysExpired >= 31 && daysExpired <= 60) {
          targetStatus = 'SUSPENDED';
        } else if (daysExpired >= 61) {
          targetStatus = 'ARCHIVED'; // Hides from public, data preserved
        }

        // If status needs update, execute update transaction
        if (tenant.status !== targetStatus) {
          await db.$transaction(async (tx) => {
            await tx.tenant.update({
              where: { id: tenant.id },
              data: { status: targetStatus },
            });

            // Log action in audit trail
            await tx.auditLog.create({
              data: {
                websiteId: tenant.id,
                action: 'STORAGE',
                details: `อัปเดตสถานะเว็บไซต์อัตโนมัติเนื่องจากหมดอายุสัญญามาแล้ว ${daysExpired} วัน (สถานะเดิม: ${tenant.status} -> สถานะใหม่: ${targetStatus})`,
              },
            });
          });

          updatedTenants.push({
            id: tenant.id,
            slug: tenant.slug,
            oldStatus: tenant.status,
            newStatus: targetStatus,
          });
        }
      } else {
        // If it was read_only or suspended but has been renewed (expiresAt is now in the future)
        if (tenant.status === 'READ_ONLY' || tenant.status === 'SUSPENDED' || tenant.status === 'ARCHIVED') {
          await db.$transaction(async (tx) => {
            await tx.tenant.update({
              where: { id: tenant.id },
              data: { status: 'ACTIVE' },
            });

            await tx.auditLog.create({
              data: {
                websiteId: tenant.id,
                action: 'STORAGE',
                details: `กู้คืนสถานะเว็บไซต์เป็น ACTIVE สำเร็จหลังการต่ออายุ (สถานะเดิม: ${tenant.status})`,
              },
            });
          });

          updatedTenants.push({
            id: tenant.id,
            slug: tenant.slug,
            oldStatus: tenant.status,
            newStatus: 'ACTIVE',
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      processedAt: now.toISOString(),
      updatedCount: updatedTenants.length,
      updates: updatedTenants,
    });
  } catch (error) {
    console.error('Subscription lifecycle cron error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการประมวลผลการจัดตารางเวลาต่ออายุ' }, { status: 500 });
  }
}
