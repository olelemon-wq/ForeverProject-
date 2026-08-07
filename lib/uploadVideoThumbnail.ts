import { captureVideoThumbnail } from '@/lib/captureVideoThumbnail';

export async function uploadVideoThumbnail(
  websiteId: string,
  mediaId: string,
  videoFile: File
): Promise<void> {
  const thumbBlob = await captureVideoThumbnail(videoFile);

  const res = await fetch('/api/media/thumbnail-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      websiteId,
      mediaId,
      fileSize: thumbBlob.size,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'ไม่สามารถเตรียมอัปโหลดภาพตัวอย่างได้');

  if (data.uploadUrl) {
    const putRes = await fetch(data.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'image/jpeg' },
      body: thumbBlob,
    });
    if (!putRes.ok) {
      throw new Error('อัปโหลดภาพตัวอย่างไม่สำเร็จ');
    }
  }

  const completeRes = await fetch('/api/media/set-thumbnail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      websiteId,
      mediaId,
      thumbnailPath: data.thumbnailPath,
    }),
  });

  const completeData = await completeRes.json();
  if (!completeRes.ok) {
    throw new Error(completeData.error || 'บันทึกภาพตัวอย่างไม่สำเร็จ');
  }
}
