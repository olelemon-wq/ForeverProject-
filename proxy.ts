import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of reserved keywords that cannot be used as tenant slugs
const RESERVED_WORDS = [
  'admin',
  'manage',
  'api',
  'payment',
  'www',
  'test',
  'billing',
  'login',
  'register',
  'system',
  'support',
  'root',
  'mail',
  'ftp',
  'demo',
  'favicon.ico',
  '_next',
  'static',
  'public',
  'images',
  'assets',
];

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const pathname = url.pathname;

  // Skip middleware execution for static files, API routes, or next system assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 1. Resolve subdomain if present (e.g., somchai.forever.co.th)
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
  let subdomain = '';

  if (!isLocalhost) {
    const parts = hostname.split('.');
    // Expecting at least 3 parts for a subdomain: e.g. subdomain.forever.co.th (parts length 4)
    if (parts.length >= 3) {
      const firstPart = parts[0].toLowerCase();
      if (firstPart !== 'www' && firstPart !== 'forever') {
        subdomain = firstPart;
      }
    }
  }

  // 2. Rewrite subdomain request to path segment: /slug/path
  if (subdomain && !RESERVED_WORDS.includes(subdomain)) {
    url.pathname = `/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // 3. Prevent users from manually typing reserved keywords as path slug
  const firstPathSegment = pathname.split('/')[1]?.toLowerCase();
  if (firstPathSegment && RESERVED_WORDS.includes(firstPathSegment)) {
    // Allow static routing requests to manage, admin, login, etc.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all paths except static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
