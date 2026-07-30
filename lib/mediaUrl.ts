import { resolveDefaultMediaSrc } from '@/lib/defaultMedia';

const UPLOADS_CDN =
  process.env.NEXT_PUBLIC_S3_PUBLIC_DOMAIN ||
  process.env.S3_PUBLIC_DOMAIN ||
  'https://storage.forever.co.th';

function encodePathSegments(path: string): string {
  return path
    .split('/')
    .map((seg, i) => (i === 0 || !seg ? seg : encodeURIComponent(decodeURIComponent(seg))))
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

  if (normalized.startsWith('/demo-media/')) {
    return encodePathSegments(normalized);
  }

  if (normalized.startsWith('/uploads/')) {
    const bundled = `/demo-media${normalized.slice('/uploads'.length)}`;
    if (UPLOADS_CDN && UPLOADS_CDN !== 'https://storage.forever.co.th') {
      return encodePathSegments(`${UPLOADS_CDN.replace(/\/$/, '')}${normalized}`);
    }
    return encodePathSegments(bundled);
  }

  if (normalized.startsWith('/')) {
    return encodePathSegments(normalized);
  }

  return encodePathSegments(`/${normalized}`);
}
