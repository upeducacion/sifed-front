import Image, { ImageProps } from "next/image";
import { getStorageUrl, shouldUnoptimize } from "@/lib/utils";

interface UnoptImageProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string | null;
  alt: string; // Hacemos alt explícitamente requerido para accesibilidad
}

/**
 * Wrapper de next/image que maneja automáticamente:
 * 1. Resolución de URLs (assets estáticos vs storage de Laravel).
 * 2. Desactivación de optimización (unoptimized) en desarrollo o IPs locales.
 * 3. Graceful degradation si src es nulo o indefinido.
 */
export function UnoptImage({ src, unoptimized, alt, ...props }: UnoptImageProps) {
  // Si no hay src, podemos retornar un placeholder o simplemente no renderizar la imagen
  if (!src) return null;

  const isDev = process.env.NODE_ENV === 'development';
  // Desactivamos la optimización si se pide explícitamente, estamos en desarrollo, 
  // o la función utilitaria determina que no se debe optimizar (ej. IPs locales).
  const shouldSkipOptimization = unoptimized || isDev || shouldUnoptimize(src);
  
  return (
    <Image 
      src={getStorageUrl(src)} 
      alt={alt}
      unoptimized={shouldSkipOptimization} 
      {...props} 
    />
  );
}
