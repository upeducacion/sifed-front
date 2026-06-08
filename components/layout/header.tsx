"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UnoptImage } from "@/components/ui/unopt-image";
import { ChevronDown, LogIn, ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { EXTERNAL_LINKS } from "@/lib/constants";

// Estructura de datos optimizada y realista
const menuItems = [
  {
    label: "Programas",
    featured: {
      title: "Oferta Académica",
      desc: "Explora todos nuestros programas de posgrado y formación continua.",
      link: "/posgrado/programas",
      image: "/images/logo-posgrado-educacion.webp"
    },
    cols: [
      {
        title: "Posgrado",
        links: [
          { label: "Maestrías", href: "/posgrado/maestrias" },
          { label: "Doctorados", href: "/posgrado/doctorados" }
        ]
      },
      {
        title: "Formación Continua",
        links: [
          { label: "Diplomados", href: "/posgrado/diplomados" },
          { label: "Cursos", href: "/posgrado/cursos" },
          { label: "Talleres", href: "/posgrado/talleres" }
        ]
      },
      {
        title: "Admisión",
        links: [
          { label: "Información General", href: "/posgrado/admision" },
          { label: "Admisión Maestría", href: "/posgrado/admision/maestria" },
          { label: "Admisión Doctorado", href: "/posgrado/admision/doctorado" }
        ]
      }
    ]
  },
  {
    label: "Investigación",
    featured: {
      title: "Biblioteca e Investigación",
      desc: "Accede a nuestra biblioteca virtual, producción científica y sustentaciones.",
      link: "/biblioteca-virtual",
      image: "/images/logo-posgrado-educacion.webp"
    },
    cols: [
      {
        title: "Recursos y Normativa",
        links: [
          { label: "Biblioteca Virtual", href: "/biblioteca-virtual" }
        ]
      },
      {
        title: "Producción Científica",
        links: [
          { label: "Memoria Visual y Sustentaciones", href: "/galeria-fotos" }
        ]
      }
    ]
  }

  // Noticias queda comentado temporalmente.
  // Luego se trabajará la lógica de avisos/noticias sin perder las rutas ni el admin.
  /*
  {
    label: "Actualidad",
    featured: {
      title: "Noticias y Eventos",
      desc: "Entérate de las últimas novedades, comunicados y eventos de la facultad.",
      link: "/noticias",
      image: "/images/logo-posgrado-educacion.webp"
    },
    cols: [
      {
        title: "Información",
        links: [
          { label: "Últimas Noticias", href: "/noticias" }
        ]
      },
      {
        title: "Multimedia",
        links: [
          { label: "Galería Institucional", href: "/galeria-fotos" }
        ]
      }
    ]
  },
  */
];

const mainLinks = [
  { label: "Plana Docente", href: "/posgrado/plana-docente" },
  { label: "Trámites", href: "/documentos-normativos" },
  { label: "Portales", href: "/portales-institucionales" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        // Scrolling down y pasado un umbral inicial
        setIsVisible(false);
      } else {
        // Scrolling up o en el tope de la página
        setIsVisible(true);
      }

      setScrolled(currentScrollY > 20);
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    const t = setTimeout(() => {
      setMobileMenuOpen(false);
      setActiveSubmenu(null);
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(t);
  }, [pathname]);

  // Bloquear scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const toggleSubmenu = (label: string) => {
    setActiveSubmenu(activeSubmenu === label ? null : label);
  };

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 border-b font-sans",
        "h-20 lg:h-20", // Altura fija para evitar layout shifts
        scrolled 
          ? "bg-background/90 backdrop-blur-xl border-border/80 shadow-lg" 
          : "bg-background border-border",
        !isVisible && !mobileMenuOpen && "-translate-y-full shadow-none" // Ocultar al bajar
      )}>
        <div className="mx-auto flex h-full max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-12 relative z-50">
          
          {/* BRAND */}
          <Link href="/" className="flex items-center gap-2 lg:gap-4 flex-shrink-0 cursor-pointer group relative z-50 max-w-[85%] lg:max-w-none">
            {/* Logo Posgrado */}
            <UnoptImage src="/images/logo-posgrado-educacion.webp" alt="Posgrado Educación UNCP" width={60} height={60} className={cn("transition-all duration-500 object-contain shrink-0", scrolled ? "h-8 w-auto lg:h-10" : "h-10 w-auto lg:h-10")} />
            
            {/* Texto */}
            <div className="flex items-center gap-2 lg:gap-3 overflow-hidden">
               <div className="flex flex-col justify-center min-w-0 py-0.5">
                 <span className="text-[5px] sm:text-[6px] lg:text-[7px] font-black uppercase tracking-widest text-muted-foreground leading-tight truncate mb-0.5">
                   Universidad Nacional del Centro del Perú
                 </span>
                 <span className={cn(
                   "font-black uppercase tracking-tight text-brand-800 leading-none truncate transition-all duration-500",
                   scrolled ? "text-[9px] sm:text-[11px] lg:text-[12px]" : "text-[10px] sm:text-xs lg:text-sm"
                 )}>
                   Facultad de Educación
                 </span>
                 <span className={cn(
                   "font-serif font-black leading-none text-brand-950 group-hover:text-brand-600 transition-all duration-500 truncate mt-0.5",
                   scrolled ? "text-xs sm:text-sm lg:text-[1.15rem]" : "text-sm sm:text-base lg:text-[1.35rem]"
                 )}>
                   Unidad de Posgrado
                 </span>
               </div>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex h-full items-center gap-1">
            {menuItems.map((item) => {
              const isActive = item.cols.some(col => col.links.some(link => pathname === link.href));
              
              return (
                <div key={item.label} className="group h-full flex items-center">
                  <button className={cn(
                    "relative flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-all rounded-lg",
                    isActive ? "text-brand-600" : "text-muted-foreground hover:text-brand-600 hover:bg-brand-50"
                  )}>
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180 text-muted-foreground/50 group-hover:text-brand-600" />
                    {isActive && <motion.div layoutId="activeNav" className="absolute bottom-0 left-4 right-4 h-0.5 bg-uncp-gold rounded-full" />}
                  </button>

                  {/* Mega Menu Dropdown */}
                  <div className="absolute left-0 top-full w-full bg-background/95 backdrop-blur-xl border-t border-border shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-40">
                     <div className="max-w-[1920px] mx-auto overflow-hidden">
                        <div className="flex">
                            
                            {/* COLUMNA DESTACADA */}
                            <div className="w-1/4 bg-brand-50/50 p-10 border-r border-border/50 flex flex-col justify-between shrink-0 relative">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                                   <UnoptImage src="/images/logo-posgrado-educacion.webp" alt="Logo de fondo" width={200} height={200} style={{ width: 'auto', height: 'auto' }} />
                                </div>
                                <div className="relative z-10">
                                    <span className="text-[10px] font-black text-brand-600 uppercase tracking-[0.3em] mb-4 block">Destacado</span>
                                    <h3 className="font-serif text-2xl font-black text-brand-950 mb-3 leading-tight">{item.featured.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-8 font-medium">{item.featured.desc}</p>
                                    <Link href={item.featured.link} className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-brand-950 hover:text-brand-600 transition-colors group/link">
                                        Ver más <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center transition-transform group-hover/link:translate-x-1 shadow-sm"><ChevronRight className="h-4 w-4" /></div>
                                    </Link>
                                </div>
                            </div>

                            {/* COLUMNAS DE ENLACES */}
                            <div className="w-3/4 p-10 grid grid-cols-3 gap-x-12 gap-y-10 bg-white/40">
                               {item.cols.map((col) => (
                                  <div key={col.title}>
                                     <h4 className="text-[10px] font-black text-brand-950 mb-6 pb-2 border-b border-border flex items-center gap-2 uppercase tracking-widest">
                                        <span className="w-1.5 h-1.5 rounded-full bg-uncp-gold"></span>
                                        {col.title}
                                     </h4>
                                     <ul className="space-y-3.5">
                                        {col.links.map((link) => (
                                           <li key={link.label}>
                                            <Link
                                              href={link.href}
                                              className={cn(
                                                "group/item text-sm transition-all flex items-center gap-2",
                                                pathname === link.href 
                                                  ? "text-brand-600 font-bold translate-x-1" 
                                                  : "text-muted-foreground hover:text-brand-950 hover:translate-x-1"
                                              )}
                                            >
                                              <div className={cn(
                                                "w-1.5 h-1.5 rounded-full bg-uncp-gold scale-0 transition-transform duration-300",
                                                pathname === link.href ? "scale-100" : "group-hover/item:scale-100"
                                              )} />
                                              {link.label}
                                            </Link>
                                           </li>
                                        ))}
                                     </ul>
                                  </div>
                               ))}
                            </div>

                        </div>
                     </div>
                  </div>
                </div>
              );
            })}

            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-all rounded-lg",
                  pathname === link.href ? "text-brand-600 bg-brand-50" : "text-muted-foreground hover:text-brand-600 hover:bg-brand-50"
                )}
              >
                {link.label}
                {pathname === link.href && <motion.div layoutId="activeNav" className="absolute bottom-0 left-4 right-4 h-0.5 bg-uncp-gold rounded-full" />}
              </Link>
            ))}

            {/* Noticias queda comentado temporalmente del menú principal */}
            {/*
            <Link
              href="/noticias"
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-all rounded-lg",
                pathname === "/noticias" ? "text-brand-600 bg-brand-50" : "text-muted-foreground hover:text-brand-600 hover:bg-brand-50"
              )}
            >
              Noticias
              {pathname === "/noticias" && <motion.div layoutId="activeNav" className="absolute bottom-0 left-4 right-4 h-0.5 bg-uncp-gold rounded-full" />}
            </Link>
            */}
          </nav>

          {/* ACTIONS & MOBILE TOGGLE */}
          <div className="flex items-center gap-3 lg:gap-4 relative z-50">
             <a 
              href={EXTERNAL_LINKS.AULA_VIRTUAL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex group items-center gap-2 rounded-xl bg-brand-950 px-5 py-2.5 lg:px-6 lg:py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-brand-800 hover:shadow-xl hover:shadow-brand-950/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              <LogIn className="h-4 w-4 text-uncp-gold group-hover:scale-110 transition-transform" />
              <span>Aula Virtual</span>
            </a>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-brand-950 hover:bg-brand-50 transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY - Moved OUTSIDE header tag to fix clipping issues */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "fixed inset-0 bg-background z-40 lg:hidden flex flex-col pb-8 px-6 overflow-y-auto shadow-2xl",
              scrolled ? "pt-16" : "pt-20"
            )}
          >
            <div className="flex-1 space-y-6 mt-6">
              {menuItems.map((item) => (
                <div key={item.label} className="border-b border-border pb-2">
                  <button 
                    onClick={() => toggleSubmenu(item.label)}
                    className="flex w-full items-center justify-between py-3 text-lg font-bold text-brand-950"
                  >
                    {item.label}
                    <ChevronDown 
                      className={cn(
                        "h-5 w-5 text-brand-400 transition-transform duration-300",
                        activeSubmenu === item.label && "rotate-180 text-brand-600"
                      )} 
                    />
                  </button>
                  
                  <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out space-y-4",
                    activeSubmenu === item.label ? "max-h-[1000px] opacity-100 pt-2 pb-4" : "max-h-0 opacity-0"
                  )}>
                    {/* Mobile Featured Link */}
                    <Link 
                      href={item.featured.link}
                      className="flex items-center gap-3 p-3 bg-brand-50 rounded-xl"
                    >
                      <div className="h-8 w-8 rounded-lg bg-white p-1 flex items-center justify-center border border-brand-100">
                        <UnoptImage src={item.featured.image} alt="" width={20} height={20} className="object-contain" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-brand-600 uppercase tracking-wider block">Principal</span>
                        <span className="text-sm font-bold text-brand-950">{item.featured.title}</span>
                      </div>
                    </Link>

                    {/* Mobile Columns */}
                    <div className="space-y-6 pl-2">
                      {item.cols.map((col) => (
                        <div key={col.title}>
                          <h5 className="text-xs font-black uppercase tracking-widest text-brand-400 mb-3 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-brand-400"></span>
                            {col.title}
                          </h5>
                          <ul className="space-y-3 pl-3 border-l border-brand-100">
                            {col.links.map((link) => (
                              <li key={link.label}>
                                <Link 
                                  href={link.href}
                                  className="text-sm font-medium text-muted-foreground hover:text-brand-600 block"
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {mainLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between text-lg font-bold text-brand-950 py-3 border-b border-border"
                >
                  {link.label} <ChevronRight className="h-5 w-5 text-brand-300" />
                </Link>
              ))}

              {/* Noticias queda comentado temporalmente del menú móvil */}
              {/*
              <Link 
                href="/noticias" 
                className="flex items-center justify-between text-lg font-bold text-brand-950 py-3 border-b border-border"
              >
                Noticias <ChevronRight className="h-5 w-5 text-brand-300" />
              </Link>
              */}
            </div>

            {/* Mobile Footer Actions */}
            <div className="mt-8 pt-8 border-t border-border space-y-4">
              <a 
                href={EXTERNAL_LINKS.AULA_VIRTUAL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-4 text-base font-extrabold text-white shadow-lg active:scale-95 transition-transform"
              >
                <LogIn className="h-5 w-5" />
                Ingresar al Aula Virtual
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para oscurecer el fondo en desktop */}
      <div className={cn(
        "hidden lg:block fixed inset-0 bg-brand-950/20 backdrop-blur-[2px] opacity-0 pointer-events-none transition-all duration-500 z-30 group-hover:opacity-100 has-[:hover]:opacity-100",
        scrolled ? "top-20" : "top-24"
      )} />
    </>
  );
}