import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

function looksLikePlaceholder(value: string) {
  return (
    !value ||
    /[<>]|account_id|your[_-]|xxx|example\.com|changeme|placeholder/i.test(value)
  );
}

export function getS3Config() {
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

  const isServerless =
    process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

  return { s3Endpoint, s3AccessKey, s3SecretKey, s3Bucket, s3PublicDomain, hasS3Config, isServerless };
}

export async function createUploadTarget(
  fileKey: string,
  contentType: string
): Promise<{ uploadUrl: string; fileUrl: string }> {
  const { s3Endpoint, s3AccessKey, s3SecretKey, s3Bucket, s3PublicDomain, hasS3Config, isServerless } =
    getS3Config();

  if (isServerless && hasS3Config && looksLikePlaceholder(s3PublicDomain)) {
    throw new Error(
      'ยังไม่ได้ตั้ง S3_PUBLIC_DOMAIN บน Vercel (เช่น https://pub-xxxx.r2.dev) กรุณาใส่แล้ว Redeploy'
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
        ContentType: contentType,
      });

      const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      const publicDomain = s3PublicDomain.replace(/\/+$/, '');
      const fileUrl = publicDomain
        ? `${publicDomain}/${fileKey}`
        : `${s3Endpoint.replace(/\/+$/, '')}/${s3Bucket}/${fileKey}`;

      return { uploadUrl, fileUrl };
    } catch (s3Err) {
      console.error('Error generating S3 presigned URL:', s3Err);
      if (isServerless) {
        throw new Error(
          'ตั้งค่าที่เก็บไฟล์ (Cloudflare R2) ไม่สำเร็จ กรุณาตรวจ S3_ENDPOINT / Access Key บน Vercel แล้ว Redeploy'
        );
      }
    }
  } else if (isServerless) {
    throw new Error(
      'เว็บจริงยังไม่ได้ตั้งค่าที่เก็บไฟล์ (Cloudflare R2) กรุณาใส่ S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_ENDPOINT, S3_BUCKET_NAME, S3_PUBLIC_DOMAIN บน Vercel แล้ว Redeploy'
    );
  }

  return {
    uploadUrl: `/api/media/upload-mock?key=${encodeURIComponent(fileKey)}`,
    fileUrl: `/${fileKey}`,
  };
}
