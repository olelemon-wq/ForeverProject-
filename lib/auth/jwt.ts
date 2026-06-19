import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-forever-jwt-secret-key-123456';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: { phone: string }): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d') // Session lasts for 30 days
    .sign(secretKey);
  return token;
}

export async function verifyToken(token: string): Promise<{ phone: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });
    return payload as { phone: string };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}
