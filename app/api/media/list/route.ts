import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAnnouncementCardMedia } from '@/lib/galleryMedia';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');

    if (!websiteId) {
      return NextResponse.json({ error: 'กรุณาระบุรหัสเว็บไซต์ (websiteId)' }, { status: 400 });
    }

    // 1. Fetch gallery media list
    const tenant = await db.tenant.findUnique({
      where: { id: websiteId },
      select: { themeConfig: true },
    });

    const mediaList = await db.media.findMany({
      where: {
        websiteId,
        album: { in: ['GALLERY', 'VIDEO'] },
        isDeleted: false,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    const visibleMediaList = mediaList.filter((media) => {
      if (media.album !== 'GALLERY') return true;
      return !isAnnouncementCardMedia(media, tenant?.themeConfig);
    });

    // 2. Fetch total storage usage (all non-deleted media files for the site)
    const mediaUsage = await db.media.aggregate({
      where: { websiteId, isDeleted: false },
      _sum: { fileSize: true },
    });
    const totalUsageBytes = mediaUsage._sum.fileSize || BigInt(0);

    // 3. Fetch active subscription quota
    const subscription = await db.subscription.findFirst({
      where: { websiteId, status: 'ACTIVE' },
    });
    const quotaBytes = subscription?.storageQuota || BigInt(1073741824); // Default 1GB

    return NextResponse.json({
      success: true,
      mediaList: visibleMediaList.map(m => ({
        id: m.id,
        filePath: m.filePath,
        fileName: m.fileName,
        mimeType: m.mimeType,
        fileSize: m.fileSize.toString(),
        createdAt: m.createdAt.toISOString(),
      })),
      totalUsageBytes: totalUsageBytes.toString(),
      quotaBytes: quotaBytes.toString(),
    });
  } catch (error) {
    console.error('List media error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลคลังภาพ' },
      { status: 500 }
    );
  }
}
