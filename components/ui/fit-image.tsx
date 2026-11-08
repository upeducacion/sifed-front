import { ComponentProps } from "react";
import { UnoptImage } from "@/components/ui/unopt-image";
import { cn } from "@/lib/utils";

type FitImageProps = Omit<ComponentProps<typeof UnoptImage>, "fill">;

/**
 * Muestra la imagen completa (sin recortar) dentro de su contenedor y rellena
 * el espacio sobrante con la misma imagen desenfocada de fondo.
 * Pensado para flyers y afiches con texto, que pueden ser verticales u horizontales.
 * El contenedor padre debe ser `relative` y tener tamaño definido.
 */
export function FitImage({ className, alt, priority, sizes, ...props }: FitImageProps) {
  return (
    <>
      <UnoptImage
        {...props}
        alt=""
        aria-hidden
        fill
        sizes="10vw"
        className="scale-110 object-cover blur-2xl brightness-75"
      />
      <UnoptImage
        {...props}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-contain", className)}
      />
    </>
  );
}
