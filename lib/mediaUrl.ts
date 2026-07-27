import { resolveDefaultMediaSrc } from '@/lib/defaultMedia';

const UPLOADS_CDN =
  process.env.NEXT_PUBLIC_S3_PUBLIC_DOMAIN ||
  process.env.S3_PUBLIC_DOMAIN ||
  'https://storage.forever.co.th';

function encodePathSegments(path: string): string {
  return path
    .split('/')
    .map((seg, i) => (i === 0 || !seg ? seg : encodeURIComponent(seg)))
    .join('/');
}

/** Resolve stored media paths for public rendering (local defaults + R2 uploads). */
export function resolveMediaSrc(src: string | null | undefined): string {
  if (!src) return '';

  const normalized = resolveDefaultMediaSrc(src).trim();
  if (!normalized) return '';

  if (/^https?:\/\//i.test(normalized)) {
    try {
      const url = new URL(normalized);
      url.pathname = url.pathname
        .split('/')
        .map((seg) => (seg ? encodeURIComponent(decodeURIComponent(seg)) : ''))
        .join('/');
      return url.toString();
    } catch {
      return normalized;
    }
  }

  if (normalized.startsWith('/uploads/')) {
    return encodePathSegments(`${UPLOADS_CDN.replace(/\/$/, '')}${normalized}`);
  }

  if (normalized.startsWith('/')) {
    return encodePathSegments(normalized);
  }

  return encodePathSegments(`/${normalized}`);
}
