import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, signToken } from '@/lib/auth/jwt';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json({ authenticated: false });
    }

    const decoded = await verifyToken(session);
    if (!decoded || !decoded.phone) {
      return NextResponse.json({ authenticated: false });
    }

    // SLIDING RENEWAL: Re-sign token and re-issue the cookie
    const newToken = await signToken({ phone: decoded.phone });

    const response = NextResponse.json({
      authenticated: true,
      phone: decoded.phone,
    });

    response.cookies.set('session', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 90 * 24 * 60 * 60, // 90 days sliding renewal
    });

    return response;
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
