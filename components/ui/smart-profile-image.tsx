"use client";

import { useState } from "react";
import { UnoptImage } from "@/components/ui/unopt-image";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface SmartProfileImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  objectFit?: "cover" | "contain";
  objectPosition?: "top" | "center" | "bottom";
}

export default function SmartProfileImage({ 
  src, 
  alt, 
  className,
  objectFit = "cover",
  objectPosition = "top"
}: SmartProfileImageProps) {
  const [error, setError] = useState(false);

  return (
    <div className={cn("absolute inset-0 w-full h-full bg-brand-50 overflow-hidden", className)}>
      {/* Placeholder de fondo: Siempre presente por si la imagen tarda o falla */}
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
        <User className="w-1/3 h-1/3 text-brand-200" />
      </div>

      {/* Imagen real: Solo se renderiza si hay src y no hay error crítico */}
      {src && !error && (
        <UnoptImage
          src={src}
          alt={alt}
          fill
          className={cn(
            "transition-opacity duration-500",
            objectFit === "cover" ? "object-cover" : "object-contain",
            objectPosition === "top" ? "object-top" : objectPosition === "bottom" ? "object-bottom" : objectPosition === "center" ? "object-center" : "object-top"
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
