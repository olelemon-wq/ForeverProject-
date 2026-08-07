/** Capture a JPEG thumbnail from a local video File (browser only). */
export async function captureVideoThumbnail(
  file: File,
  seekSeconds = 1
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    const cleanup = () => URL.revokeObjectURL(objectUrl);

    video.onloadedmetadata = () => {
      const target = Number.isFinite(video.duration)
        ? Math.min(seekSeconds, Math.max(0, video.duration * 0.1))
        : seekSeconds;
      video.currentTime = target;
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 360;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        cleanup();
        reject(new Error('ไม่สามารถสร้างภาพตัวอย่างได้'));
        return;
      }

      ctx.drawImage(video, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          cleanup();
          if (blob) resolve(blob);
          else reject(new Error('ไม่สามารถแปลงภาพตัวอย่างได้'));
        },
        'image/jpeg',
        0.85
      );
    };

    video.onerror = () => {
      cleanup();
      reject(new Error('โหลดวิดีโอเพื่อสร้างภาพตัวอย่างไม่สำเร็จ'));
    };
  });
}
