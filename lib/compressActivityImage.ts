const MAX_WIDTH = 1600;
const MAX_HEIGHT = 2200;
const JPEG_QUALITY = 0.82;
const SKIP_BELOW_BYTES = 350 * 1024;

/** Resize and re-encode activity images in the browser before upload. */
export async function compressActivityImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  if (file.type === 'image/gif') return file;
  if (file.size <= SKIP_BELOW_BYTES && file.type === 'image/jpeg') return file;

  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);

      let width = img.naturalWidth;
      let height = img.naturalHeight;
      if (!width || !height) {
        resolve(file);
        return;
      }

      const scale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height, 1);
      width = Math.max(1, Math.round(width * scale));
      height = Math.max(1, Math.round(height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const baseName = file.name.replace(/\.[^.]+$/, '') || 'activity-image';
          resolve(
            new File([blob], `${baseName}.jpg`, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            }),
          );
        },
        'image/jpeg',
        JPEG_QUALITY,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}

export async function compressActivityImages(files: File[]): Promise<File[]> {
  return Promise.all(files.map((file) => compressActivityImage(file)));
}
