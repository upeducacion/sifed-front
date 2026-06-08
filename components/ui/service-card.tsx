"use client";

import { UnoptImage } from "@/components/ui/unopt-image";
import { motion } from "framer-motion";
import { Lock, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  href: string;
  isLocked?: boolean;
  onLockedClick?: () => void;
  className?: string;
  variant?: "default" | "special";
}

/**
 * ServiceCard: Refinado bajo una estética editorial de "Alta Gama".
 */
export default function ServiceCard({
  title,
  subtitle = "Servicio Académico",
  imageSrc = "/images/logo-posgrado-educacion.webp",
  href,
  isLocked = false,
  onLockedClick,
  className,
  variant = "default",
}: ServiceCardProps) {
  
  const content = (
    <motion.div
      whileHover={!isLocked ? { y: -5 } : {}}
      className={cn(
        "group relative flex flex-col h-full min-h-[200px] p-8 rounded-[2rem] transition-all duration-500",
        "bg-white border border-brand-100/60",
        "shadow-[0_10px_30px_-15px_rgba(0,27,72,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,27,72,0.12)]",
        "hover:border-brand-200",
        variant === "special" && "bg-brand-50/30 border-dashed border-brand-200",
        isLocked && "cursor-default opacity-90",
        className
      )}
    >
      {/* Indicador de Acceso (Esquina Superior Derecha) */}
      <div className="absolute top-6 right-6">
        {isLocked ? (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-brand-50 border border-brand-100">
            <Lock className="h-3.5 w-3.5 text-uncp-gold" />
          </div>
        ) : (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-brand-950 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <ArrowUpRight className="h-4 w-4 text-uncp-gold" />
          </div>
        )}
      </div>

      {/* Contenedor del Logo (Identidad UNCP) */}
      <div className="mb-6 relative h-14 w-14 transition-transform duration-500 group-hover:scale-110">
        <UnoptImage
          src={imageSrc}
          alt={title}
          fill
          className={cn(
            "object-contain transition-all duration-500",
            isLocked ? "grayscale opacity-30" : "drop-shadow-sm opacity-80 group-hover:opacity-100"
          )}
          sizes="56px"
        />
      </div>

      {/* Bloque de Texto Editorial */}
      <div className="mt-auto">
        <p className={cn(
          "text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 transition-colors",
          isLocked ? "text-brand-950/20" : "text-brand-600/60 group-hover:text-uncp-gold"
        )}>
          {subtitle}
        </p>
        <h3 className={cn(
          "font-serif text-xl font-black leading-[1.1] tracking-tighter",
          isLocked ? "text-brand-950/30" : "text-brand-950"
        )}>
          {title}
        </h3>
      </div>

      {/* Efecto de Vidrio para Bloqueo */}
      {isLocked && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-[2rem] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-brand-950 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-xl">
            Acceso Restringido
          </span>
        </div>
      )}
    </motion.div>
  );

  const handleClick = () => {
    if (isLocked && onLockedClick) {
      onLockedClick();
    }
  };

  if (isLocked) {
    return (
      <button onClick={handleClick} className="w-full text-left h-full block focus:outline-none">
        {content}
      </button>
    );
  }

  return (
    <a href={href} className="w-full text-left h-full block focus:outline-none">
      {content}
    </a>
  );
}

