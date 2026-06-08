"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";

export interface HeroAction {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline";
  icon?: React.ReactNode;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageSrc: string;
  actions?: HeroAction[];
  breadcrumbs?: BreadcrumbItem[];
  align?: "center" | "left";
  size?: "full" | "compact";
}

export default function PageHero({
  title,
  subtitle,
  description,
  imageSrc,
  actions = [],
  breadcrumbs = [],
  align = "center",
  size = "full",
}: PageHeroProps) {
  const isCompact = size === "compact";

  return (
    <section 
      className={cn(
        "relative w-full flex items-center justify-center overflow-hidden bg-black",
        isCompact ? "h-[50vh] min-h-[400px]" : "h-[calc(100vh-80px)]"
      )}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center grayscale opacity-60 contrast-110 brightness-50 z-0 transition-transform duration-[20s] hover:scale-105"
          style={{ backgroundImage: `url('${imageSrc}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/40 to-transparent z-10" />
      </div>

      {/* Breadcrumbs - Superior Izquierda (Estilo Sistema Glass) */}
      {breadcrumbs.length > 0 && (
        <div className="absolute top-8 left-0 w-full z-30 px-6 lg:px-12">
          <motion.nav 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            aria-label="Breadcrumb" 
            className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest shadow-sm"
          >
            <Link 
              href="/" 
              className="flex items-center gap-1 text-white/90 hover:text-uncp-gold transition-colors duration-300"
            >
              <Home className="w-3.5 h-3.5 mb-0.5" />
              <span className="sr-only">Inicio</span>
            </Link>
            
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3 text-white/40" />
                {item.href ? (
                  <Link 
                    href={item.href} 
                    className="text-white/90 hover:text-uncp-gold transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-uncp-gold drop-shadow-sm">{item.label}</span>
                )}
              </div>
            ))}
          </motion.nav>
        </div>
      )}

      {/* Contenido Principal */}
      <div className={cn("container mx-auto px-6 lg:px-12 relative z-20", align === "center" ? "text-center" : "text-left")}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {subtitle && (
            <span className={cn(
              "text-uncp-gold font-bold uppercase tracking-[0.3em] block mb-4 drop-shadow-md",
              isCompact ? "text-[10px]" : "text-xs mb-6"
            )}>
              {subtitle}
            </span>
          )}
          
          <h1 className={cn(
            "font-black text-white leading-[1.1] tracking-tighter mb-6 drop-shadow-xl",
            isCompact ? "text-4xl md:text-5xl lg:text-6xl" : "text-5xl md:text-7xl lg:text-8xl"
          )}>
            {title}
          </h1>
          
          {description && (
            <p className={cn(
              "text-brand-50/90 leading-relaxed font-medium drop-shadow-md",
              align === "center" && "mx-auto",
              isCompact ? "text-base max-w-xl mb-6" : "text-lg md:text-xl max-w-2xl mb-10"
            )}>
              {description}
            </p>
          )}

          {/* Action Buttons */}
          {actions.length > 0 && (
            <div className={cn("flex flex-wrap gap-4", align === "center" && "justify-center")}>
              {actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-1 shadow-lg",
                    isCompact ? "px-6 py-3 text-xs" : "px-8 py-4 text-sm",
                    
                    // Primary: Brand color solid
                    action.variant === "primary" && 
                    "bg-brand-600 text-white hover:bg-brand-500 shadow-brand-900/40 border border-brand-500",
                    
                    // Secondary: White/Glass
                    (action.variant === "secondary" || !action.variant) && 
                    "bg-white/10 text-white backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/40",
                    
                    // Outline: Minimalist
                    action.variant === "outline" && 
                    "bg-transparent text-brand-200 border border-brand-800 hover:text-white hover:border-brand-400"
                  )}
                >
                  {action.icon}
                  {action.label}
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
