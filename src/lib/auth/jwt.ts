import { SignJWT, jwtVerify } from 'jose';
import { JWTPayload } from '@/src/types/auth';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
);

const EXPIRATION_TIME = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Genera un token JWT
 */
export async function generateToken(payload: JWTPayload): Promise<string> {
  try {
    const token = await new SignJWT({
      userId: payload.userId,
      username: payload.username,
      email: payload.email,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(EXPIRATION_TIME)
      .sign(SECRET_KEY);

    return token;
  } catch (error) {
    console.error('Error al generar token:', error);
    throw new Error('No se pudo generar el token');
  }
}

/**
 * Verifica y decodifica un token JWT
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      userId: payload.userId as string,
      username: payload.username as string,
      email: payload.email as string,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (error) {
    console.error('Token inválido:', error);
    return null;
  }
}

/**
 * Extrae el token de las cookies
 */
export function getTokenFromCookies(cookies: string): string | null {
  const tokenCookie = cookies
    .split(';')
    .find((c) => c.trim().startsWith('auth-token='));

  if (!tokenCookie) return null;

  return tokenCookie.split('=')[1];
}
