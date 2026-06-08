import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind de manera inteligente, resolviendo conflictos.
 * Ejemplo: cn("bg-red-500", "bg-blue-500") -> "bg-blue-500"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Genera la URL completa para un recurso de almacenamiento (imagen, documento).
 * Maneja rutas relativas y absolutas - para unoptimiced de next 
 */
export function getStorageUrl(path?: string | null): string {
  if (!path) return "";
  
  // Si ya es una URL absoluta, devolverla tal cual
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // REGLA CRÍTICA DE ASSETS HÍBRIDOS (UP Educación)
  // Si la ruta NO empieza con /storage/, es un asset estático que vive en Next.js /public
  // Ej: "/images/galeria/foto.webp"
  // NO debemos usar encodeURI aquí porque next/image lo codificará internamente,
  // y si lo pre-codificamos, generaremos un doble escape (ej. %2520 en vez de %20)
  if (!path.startsWith("/storage/")) {
    return path;
  }
  
  // Si empieza con /storage/, es un asset dinámico de Laravel.
  // Usamos NEXT_PUBLIC_BACKEND_URL si existe, de lo contrario limpiamos API_URL.
  let baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 
                process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") || 
                "";
  
  // Limpiar barras finales del baseUrl y barras iniciales del path para evitar el error de doble barra //
  baseUrl = baseUrl.replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");
  
  const finalUrl = `${baseUrl}/${cleanPath}`;

  // Para URLs externas de Laravel devolvemos la ruta como absolute string.
  return finalUrl;
}

/**
 * Determina si una imagen debe cargarse sin optimización.
 * Útil para desarrollo local y para evitar errores de resolución de IP privada en Next.js.
 */
export function shouldUnoptimize(path?: string | null): boolean {
  if (process.env.NODE_ENV === 'development') return true;
  if (!path) return false;
  
  const url = getStorageUrl(path);
  return url.includes('localhost') || url.includes('127.0.0.1');
}
