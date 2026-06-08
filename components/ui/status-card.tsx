import Link from "next/link";
import { UnoptImage } from "@/components/ui/unopt-image";
import { LucideIcon, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: "brand" | "gold" | "red" | "green";
  actionLabel?: string;
  actionHref?: string;
}

export default function StatusCard({
  icon: Icon,
  title,
  description,
  color = "brand",
  actionLabel = "Volver al Inicio",
  actionHref = "/",
}: StatusCardProps) {
  
  const colorStyles = {
    brand: "text-brand-600 bg-brand-50/50",
    gold: "text-uncp-gold bg-yellow-50/50",
    red: "text-red-600 bg-red-50/50",
    green: "text-uncp-green bg-green-50/50",
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
      
      {/* Fondo Decorativo Sutil */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-600 via-uncp-gold to-brand-600 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-50/30 rounded-full blur-[120px]"></div>
      </div>

      {/* Contenido Limpio (Sin Tarjeta) */}
      <div className="relative z-10 max-w-lg w-full text-center animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
        
        {/* Branding */}
        <div className="flex items-center gap-3 mb-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <UnoptImage src="/images/logo-posgrado-educacion.webp" alt="Posgrado Educación" width={72} height={72} className="object-contain" />
        </div>

        {/* Icono Flotante */}
        <div className={cn(
          "h-24 w-24 rounded-3xl flex items-center justify-center mb-8 transition-transform hover:scale-105 duration-300",
          colorStyles[color]
        )}>
          <Icon className="h-12 w-12" strokeWidth={1.5} />
        </div>

        {/* Textos */}
        <h1 className="font-serif text-4xl md:text-5xl font-black text-brand-950 mb-6 tracking-tight leading-tight">
          {title}
        </h1>
        
        <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-md mx-auto">
          {description}
        </p>

        {/* Acción Minimalista */}
        <Link 
          href={actionHref}
          className="group inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors border-b-2 border-transparent hover:border-brand-200 pb-0.5"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {actionLabel}
        </Link>

        {/* Footer info */}
        <div className="mt-16 text-[10px] text-muted-foreground/40 font-mono uppercase tracking-widest">
           UP Educación &bull; UNCP &bull; 2026
        </div>
      </div>
    </div>
  );
}
