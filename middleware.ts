import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/src/lib/auth/jwt';

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/api/auth/login'];

// Rutas de autenticación (redirigir si ya está autenticado)
const authRoutes = ['/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Obtener token de las cookies
  const token = request.cookies.get('auth-token')?.value;

  // Verificar si la ruta es pública
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Si no hay token y la ruta no es pública, redirigir al login
  if (!token && !isPublicRoute) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Si hay token, verificarlo
  if (token) {
    const payload = await verifyToken(token);

    // Si el token es inválido y la ruta no es pública, redirigir al login
    if (!payload && !isPublicRoute) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }

    // Si el token es válido y está en una ruta de auth, redirigir al dashboard
    if (payload && isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Configurar qué rutas debe interceptar el middleware
export const config = {
  matcher: [
  ],
};
