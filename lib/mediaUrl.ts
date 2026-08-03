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

/** Normalize upload API / CDN URLs to a stable site-relative path for themeConfig. */
export function toStoredMediaPath(src: string | null | undefined): string {
  if (!src) return '';
  const trimmed = src.trim();
  if (!trimmed) return '';

  if (
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('/demo-media/') ||
    trimmed.startsWith('/defaults/')
  ) {
    return trimmed;
  }

  if (trimmed.startsWith('uploads/')) {
    return `/${trimmed}`;
  }

  try {
    const url = new URL(trimmed);
    if (url.pathname.startsWith('/uploads/')) {
      return url.pathname;
    }
  } catch {
    // not an absolute URL
  }

  return trimmed;
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
    if (UPLOADS_CDN && UPLOADS_CDN !== 'https://storage.forever.co.th') {
      return encodePathSegments(`${UPLOADS_CDN.replace(/\/$/, '')}${normalized}`);
    }
    // Local uploads are written to public/uploads (mock uploader).
    return encodePathSegments(normalized);
  }

  if (normalized.startsWith('/')) {
    return encodePathSegments(normalized);
  }

  return encodePathSegments(`/${normalized}`);
}
