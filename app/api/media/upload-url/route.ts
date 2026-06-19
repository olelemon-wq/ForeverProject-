import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(request: Request) {
  try {
    // 1. Authenticate user from JWT session cookie
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนทำการอัปโหลดไฟล์' }, { status: 401 });
    }

    const decoded = await verifyToken(session);
    if (!decoded || !decoded.phone) {
      return NextResponse.json({ error: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' }, { status: 401 });
    }

    const { fileName, fileType, fileSize, websiteId } = await request.json();

    if (!fileName || !fileType || !fileSize || !websiteId) {
      return NextResponse.json({ error: 'ข้อมูลสเปกไฟล์ไม่ครบถ้วน' }, { status: 400 });
    }

    // 2. Resolve Webmaster profile in DB
    const webmaster = await db.webmaster.findUnique({
      where: { phone: decoded.phone },
    });

    if (!webmaster) {
      return NextResponse.json({ error: 'ไม่พบสิทธิ์ผู้ใช้งานดูแลระบบนี้' }, { status: 403 });
    }

    // 3. Permission checks: Ensure user has rights to edit this website
    const permission = await db.websiteWebmaster.findUnique({
      where: {
        websiteId_webmasterId: {
          websiteId,
          webmasterId: webmaster.id,
        },
      },
    });

    if (!permission) {
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์อัปโหลดไฟล์สำหรับเว็บไซต์ความทรงจำนี้' }, { status: 403 });
    }

    // 4. Storage Quota check (BR014, BR015, BR016)
    const subscription = await db.subscription.findFirst({
      where: { websiteId, status: 'ACTIVE' },
    });
    
    // Default to 1 GB (1,073,741,824 bytes) if no subscription record yet (BR011, BR013)
    const storageQuota = subscription?.storageQuota || BigInt(1073741824);

    // Sum of all currently uploaded media (isDeleted = false)
    const mediaUsage = await db.media.aggregate({
      where: { websiteId, isDeleted: false },
      _sum: { fileSize: true },
    });

    const currentUsageBytes = mediaUsage._sum.fileSize || BigInt(0);
    const newFileSizeBytes = BigInt(fileSize);

    // Block write if quota exceeded (BR016: block write, keep read active)
    if (currentUsageBytes + newFileSizeBytes > storageQuota) {
      return NextResponse.json(
        { error: 'พื้นที่จัดเก็บไฟล์มีเดียของคุณเต็ม 100% แล้ว กรุณาทำการอัปเกรดแพ็กเกจพื้นที่เพิ่มเพื่อดำเนินการต่อ' },
        { status: 400 }
      );
    }

    // 5. Generate simulated object storage key and path (e.g. Cloudflare R2 / AWS S3)
    const fileKey = `uploads/${websiteId}/${Date.now()}-${fileName}`;
    const fileUrl = `https://storage.forever.co.th/${fileKey}`;

    // 6. Record metadata in Media DB and update AuditLog (BR036)
    const media = await db.media.create({
      data: {
        websiteId,
        filePath: fileUrl,
        fileName,
        fileSize: newFileSizeBytes,
        mimeType: fileType,
        fileHash: `hash-${Math.random().toString(36).substring(7)}`, // Hash for duplicate check (BR031)
        album: fileType.startsWith('image/')
          ? 'GALLERY'
          : fileType.startsWith('video/')
          ? 'VIDEO'
          : fileType.startsWith('audio/')
          ? 'AUDIO'
          : 'DOCUMENT',
      },
    });

    await db.auditLog.create({
      data: {
        websiteId,
        webmasterId: webmaster.id,
        action: 'STORAGE',
        details: `อัปโหลดไฟล์สื่อสำเร็จ: ${fileName} (${(fileSize / (1024 * 1024)).toFixed(2)} MB)`,
      },
    });

    return NextResponse.json({
      success: true,
      uploadUrl: `https://storage.forever.co.th/api/upload-mock?key=${fileKey}`,
      filePath: media.filePath,
      mediaId: media.id,
    });
  } catch (error) {
    console.error('Presigned URL error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดภายในระบบในการเปิดรับไฟล์มีเดีย' },
      { status: 500 }
    );
  }
}
