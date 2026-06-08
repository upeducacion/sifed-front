import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, USER_COOKIE_NAME, COOKIE_OPTIONS, USER_COOKIE_OPTIONS } from "@/lib/auth-config";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!baseUrl) {
      return new Response(JSON.stringify({ 
        message: "Error de configuración de servidor: NEXT_PUBLIC_API_URL no está definida."
      }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    const targetUrl = `${baseUrl}/login`;

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Capturamos la respuesta del backend
    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ 
        message: data.message || "Credenciales inválidas",
        errors: data.errors 
      }), { 
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Configuración de cookies seguras desde el servidor
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, data.token, COOKIE_OPTIONS);
    cookieStore.set(USER_COOKIE_NAME, JSON.stringify(data.user), USER_COOKIE_OPTIONS);

    return new Response(JSON.stringify({ success: true, user: data.user }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return new Response(JSON.stringify({ 
      message: "Error en el servidor de autenticación (BFF)",
      detail: message 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
