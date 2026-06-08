import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, USER_COOKIE_NAME } from "@/lib/auth-config";

export async function POST() {
  const cookieStore = await cookies();
  
  // Eliminamos las cookies de sesión
  cookieStore.delete(AUTH_COOKIE_NAME);
  cookieStore.delete(USER_COOKIE_NAME);

  return Response.json({ success: true, message: "Sesión cerrada correctamente" });
}
