/**
 * Configuración centralizada para la gestión de autenticación y cookies.
 * Sigue principios de seguridad para entornos de producción y desarrollo.
 */

export const AUTH_COOKIE_NAME = "sifed_session_token";
export const USER_COOKIE_NAME = "sifed_user_data";

export const isProduction = process.env.NODE_ENV === "production";

export const COOKIE_OPTIONS = {
  httpOnly: false, // Cambiado temporalmente a false para permitir que el cliente envíe el Bearer token
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24,
};

// Opciones para la cookie del usuario (necesaria para el cliente, por eso no es httpOnly)
export const USER_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  httpOnly: false, // Permitimos que el cliente lea los datos básicos del usuario
};
