// este archivo es un middleware para la aplicación pero se llama proxy.ts por convencion de Next.js
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth-config";

// Rutas que requieren autenticación
const protectedRoutes = ["/admin", "/docente", "/estudiante"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  // 1. Si el usuario intenta entrar a una ruta protegida y NO tiene token
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    const loginUrl = new URL("/login", request.url);
    // Guardamos la URL de destino para volver después del login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Si el usuario ya está logueado e intenta ir al login
  // Permitimos el acceso a /login para que funcione como Hub de Servicios/Perfil
  
  return NextResponse.next();
}

// Configuración de los matchers para optimizar el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
