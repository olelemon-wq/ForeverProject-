import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

    const { fileName, fileType, fileSize, websiteId, album } = await request.json();

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

    // 5. Generate storage key
    const fileKey = `uploads/${websiteId}/${Date.now()}-${fileName}`;

    // Determine upload URL strategy (Real S3/R2 or local mock fallback)
    let uploadUrl = '';
    let fileUrl = '';

    const looksLikePlaceholder = (value: string) =>
      !value ||
      /[<>]|account_id|your[_-]|xxx|example\.com|changeme|placeholder/i.test(value);

    const s3Endpoint = (process.env.S3_ENDPOINT || '').trim();
    const s3AccessKey = (process.env.S3_ACCESS_KEY_ID || '').trim();
    const s3SecretKey = (process.env.S3_SECRET_ACCESS_KEY || '').trim();
    const s3Bucket = (process.env.S3_BUCKET_NAME || '').trim();
    const s3PublicDomain = (process.env.S3_PUBLIC_DOMAIN || '').trim();

    const hasS3Config =
      /^https?:\/\//i.test(s3Endpoint) &&
      !looksLikePlaceholder(s3Endpoint) &&
      !looksLikePlaceholder(s3AccessKey) &&
      !looksLikePlaceholder(s3SecretKey) &&
      !looksLikePlaceholder(s3Bucket);

    // Vercel / production cannot persist files to the local filesystem.
    // Mock upload would report success but leave broken images.
    const isServerless =
      process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

    if (isServerless && hasS3Config && looksLikePlaceholder(s3PublicDomain)) {
      return NextResponse.json(
        {
          error:
            'ยังไม่ได้ตั้ง S3_PUBLIC_DOMAIN บน Vercel (เช่น https://pub-xxxx.r2.dev) กรุณาใส่แล้ว Redeploy',
        },
        { status: 503 }
      );
    }

    if (hasS3Config) {
      try {
        const s3Client = new S3Client({
          region: 'auto',
          endpoint: s3Endpoint,
          credentials: {
            accessKeyId: s3AccessKey,
            secretAccessKey: s3SecretKey,
          },
        });

        const command = new PutObjectCommand({
          Bucket: s3Bucket,
          Key: fileKey,
          ContentType: fileType,
        });

        uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        // Public domain (r2.dev / custom) is already bound to the bucket.
        const publicDomain = s3PublicDomain.replace(/\/+$/, '');
        fileUrl = publicDomain
          ? `${publicDomain}/${fileKey}`
          : `${s3Endpoint.replace(/\/+$/, '')}/${s3Bucket}/${fileKey}`;
      } catch (s3Err) {
        console.error('Error generating real S3 presigned URL:', s3Err);
        if (isServerless) {
          return NextResponse.json(
            {
              error:
                'ตั้งค่าที่เก็บไฟล์ (Cloudflare R2) ไม่สำเร็จ กรุณาตรวจ S3_ENDPOINT / Access Key บน Vercel แล้ว Redeploy',
            },
            { status: 503 }
          );
        }
        uploadUrl = `/api/media/upload-mock?key=${encodeURIComponent(fileKey)}`;
        fileUrl = `/${fileKey}`;
      }
    } else if (isServerless) {
      return NextResponse.json(
        {
          error:
            'เว็บจริงยังไม่ได้ตั้งค่าที่เก็บไฟล์ (Cloudflare R2) กรุณาใส่ S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_ENDPOINT, S3_BUCKET_NAME, S3_PUBLIC_DOMAIN บน Vercel แล้ว Redeploy',
        },
        { status: 503 }
      );
    } else {
      // Local development only: write into public/uploads
      uploadUrl = `/api/media/upload-mock?key=${encodeURIComponent(fileKey)}`;
      fileUrl = `/${fileKey}`;
    }

    // 6. Record metadata in Media DB and update AuditLog (BR036)
    const media = await db.media.create({
      data: {
        websiteId,
        filePath: fileUrl,
        fileName,
        fileSize: newFileSizeBytes,
        mimeType: fileType,
        fileHash: `hash-${Math.random().toString(36).substring(7)}`, // Hash for duplicate check (BR031)
        album: album || (fileType.startsWith('image/')
          ? 'GALLERY'
          : fileType.startsWith('video/')
          ? 'VIDEO'
          : fileType.startsWith('audio/')
          ? 'AUDIO'
          : 'DOCUMENT'),
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
      uploadUrl,
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
