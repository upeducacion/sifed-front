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
      title: "Repositorio Institucional",
      desc: "Tesis, artículos y biblioteca virtual de la Unidad de Posgrado.",
      link: "/repositorio",
      image: "/images/logo-posgrado-educacion.webp"
    },
    cols: [
      {
        title: "Repositorio",
        links: [
          { label: "Todo el repositorio", href: "/repositorio" },
          { label: "Investigación", href: "/repositorio?coleccion=investigacion" },
          { label: "Biblioteca virtual", href: "/repositorio?coleccion=biblioteca" }
        ]
      },
      {
        title: "Producción Científica",
        links: [
          { label: "Tesis de maestría", href: "/repositorio?tipo=tesis_maestria" },
          { label: "Tesis de doctorado", href: "/repositorio?tipo=tesis_doctorado" },
          { label: "Artículos científicos", href: "/repositorio?tipo=articulo" },
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
  { label: "Trámites", href: "/tramites" },
  { label: "Portales", href: "/portales-institucionales" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const activeMenuItem = menuItems.find((item) => item.label === activeSubmenu);

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
      <header style={{ viewTransitionName: "site-header" }} className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b font-sans",
        "h-16 lg:h-20", // Altura fija para evitar layout shifts
        scrolled 
          ? "bg-background/90 backdrop-blur-xl border-border/80 shadow-soft"
          : "bg-background border-border",
        !isVisible && !mobileMenuOpen && "-translate-y-full shadow-none" // Ocultar al bajar
      )}>
        <div className="page-shell-wide relative z-50 grid h-full grid-cols-[minmax(0,1fr)_auto] items-center lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          
          {/* BRAND */}
          <Link href="/" className="group relative z-50 flex min-w-0 max-w-full shrink-0 cursor-pointer items-center gap-2 justify-self-start lg:max-w-none lg:gap-4">
            {/* Logo Posgrado */}
            <span className="relative block h-9 w-9 shrink-0 lg:h-10 lg:w-10">
              <UnoptImage src="/images/logo-posgrado-educacion.webp" alt="Posgrado Educación UNCP" fill className="object-contain" />
            </span>
            
            {/* Texto */}
              <div className="min-w-0 overflow-hidden lg:flex lg:items-center lg:gap-3">
               <div className="flex flex-col justify-center min-w-0 py-0.5">
                <span className="hidden text-[7px] font-black uppercase tracking-widest text-muted-foreground leading-tight truncate mb-0.5 sm:block">
                   Universidad Nacional del Centro del Perú
                 </span>
                 <span className={cn(
                   "block truncate text-[9px] font-black uppercase tracking-tight text-brand-800 leading-none sm:text-xs lg:text-sm"
                 )}>
                   Facultad de Educación
                 </span>
                 <span className={cn(
                   "mt-0.5 block truncate font-serif text-sm font-black leading-none text-brand-950 transition-colors duration-200 group-hover:text-brand-600 sm:text-base lg:text-[1.35rem]"
                 )}>
                   Unidad de Posgrado
                 </span>
               </div>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav
            className="relative hidden h-full items-center gap-1 justify-self-center lg:flex"
            onMouseLeave={() => setActiveSubmenu(null)}
          >
            {menuItems.map((item) => {
              const isActive = item.cols.some(col => col.links.some(link => pathname === link.href));
              
              return (
                <div key={item.label} className="h-full flex items-center">
                  <button
                    type="button"
                    onMouseEnter={() => setActiveSubmenu(item.label)}
                    className={cn(
                    "relative flex h-full items-center gap-1.5 px-3.5 text-sm font-bold transition-colors duration-[var(--motion-duration-standard)] ease-[var(--motion-ease)]",
                    isActive
                      ? "text-brand-600"
                      : "text-muted-foreground hover:text-brand-600 after:absolute after:inset-x-3 after:bottom-5 after:h-px after:origin-left after:scale-x-0 after:bg-brand-300 after:transition-transform after:duration-[var(--motion-duration-standard)] after:ease-[var(--motion-ease)] hover:after:scale-x-100"
                  )}>
                    {item.label}
                    <ChevronDown className={cn(
                      "h-3.5 w-3.5 text-muted-foreground/50 transition-transform duration-[var(--motion-duration-standard)] ease-[var(--motion-ease)]",
                      activeSubmenu === item.label && "rotate-180 text-brand-600"
                    )} />
                    {isActive && <motion.div layoutId="activeNav" className="absolute bottom-5 left-3 right-3 h-0.5 bg-uncp-gold" />}
                  </button>
                </div>
              );
            })}

            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setActiveSubmenu(null)}
                onClick={() => setActiveSubmenu(null)}
                className={cn(
                  "relative flex h-full items-center gap-1.5 px-3.5 text-sm font-bold transition-colors duration-[var(--motion-duration-standard)] ease-[var(--motion-ease)]",
                  pathname === link.href
                    ? "text-brand-600"
                    : "text-muted-foreground hover:text-brand-600 after:absolute after:inset-x-3 after:bottom-5 after:h-px after:origin-left after:scale-x-0 after:bg-brand-300 after:transition-transform after:duration-[var(--motion-duration-standard)] after:ease-[var(--motion-ease)] hover:after:scale-x-100"
                )}
              >
                {link.label}
                {pathname === link.href && <motion.div layoutId="activeNav" className="absolute bottom-5 left-3 right-3 h-0.5 bg-uncp-gold" />}
              </Link>
            ))}

            {activeMenuItem && (
              <div className="absolute left-1/2 top-full z-40 w-[min(64rem,calc(100vw-2rem))] -translate-x-1/2 border border-t-0 border-border bg-background/95 shadow-float backdrop-blur-xl">
                <div className="flex overflow-hidden rounded-b-md">
                  <div className="relative w-[30%] shrink-0 border-r border-border/50 bg-brand-50/50 p-8">
                    <div className="pointer-events-none absolute right-0 top-0 p-3 opacity-[0.03]">
                      <UnoptImage src="/images/logo-posgrado-educacion.webp" alt="Logo de fondo" width={200} height={200} style={{ width: 'auto', height: 'auto' }} />
                    </div>
                    <div className="relative z-10">
                      <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.3em] text-brand-600">Destacado</span>
                      <h3 className="mb-3 font-serif text-xl font-black leading-tight text-brand-950">{activeMenuItem.featured.title}</h3>
                      <p className="mb-6 text-sm font-medium leading-relaxed text-muted-foreground">{activeMenuItem.featured.desc}</p>
                      <Link href={activeMenuItem.featured.link} onClick={() => setActiveSubmenu(null)} className="group/link inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-brand-950 transition-colors hover:text-brand-600">
                        Ver más <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white shadow-soft transition-transform group-hover/link:translate-x-1"><ChevronRight className="h-4 w-4" /></span>
                      </Link>
                    </div>
                  </div>
                  <div className="grid w-[70%] grid-cols-2 gap-x-10 gap-y-8 bg-white/40 p-8">
                    {activeMenuItem.cols.map((col) => (
                      <div key={col.title}>
                        <h4 className="mb-6 flex items-center gap-2 border-b border-border pb-2 text-[10px] font-black uppercase tracking-widest text-brand-950">
                          <span className="h-1.5 w-1.5 rounded-full bg-uncp-gold" />
                          {col.title}
                        </h4>
                        <ul className="space-y-3.5">
                          {col.links.map((link) => (
                            <li key={link.label}>
                              <Link href={link.href} onClick={() => setActiveSubmenu(null)} className={cn("group/item relative flex min-h-7 items-center pl-4 text-sm transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-ease)] before:absolute before:left-0 before:top-1/2 before:h-px before:w-2 before:-translate-y-1/2 before:origin-left before:scale-x-0 before:bg-uncp-gold before:transition-transform before:duration-[var(--motion-duration-fast)]", pathname === link.href ? "font-bold text-brand-600 before:scale-x-100" : "text-muted-foreground hover:text-brand-950 hover:before:scale-x-100")}>
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
            )}

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
          <div className="relative z-50 flex items-center gap-2 justify-self-end sm:gap-3 lg:gap-4">
             <a 
              href={EXTERNAL_LINKS.AULA_VIRTUAL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex group items-center gap-2 rounded-lg bg-brand-950 px-5 py-2.5 lg:px-6 lg:py-3 text-xs font-black uppercase tracking-widest text-white transition-[background-color,box-shadow,transform] duration-[var(--motion-duration-standard)] ease-[var(--motion-ease)] hover:bg-brand-800 hover:shadow-float hover:-translate-y-0.5 active:translate-y-0"
            >
              <LogIn className="h-4 w-4 text-uncp-gold group-hover:scale-[1.03] transition-transform duration-200" />
              <span>Aula Virtual</span>
            </a>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-brand-950 transition-colors hover:bg-brand-50 lg:hidden"
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
              "fixed inset-0 z-40 flex flex-col overflow-y-auto bg-background px-4 pb-8 shadow-float sm:px-6 lg:hidden",
              scrolled ? "pt-14" : "pt-16"
            )}
          >
            <div className="mt-4 flex-1 space-y-4 sm:mt-6 sm:space-y-6">
              {menuItems.map((item) => (
                <div key={item.label} className="border-b border-border pb-1">
                  <button 
                    onClick={() => toggleSubmenu(item.label)}
                    className="flex min-h-12 w-full items-center justify-between py-3 text-base font-bold text-brand-950 sm:text-lg"
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
                      className="flex items-center gap-3 rounded-lg bg-brand-50 p-3"
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
                                  className="relative block py-1 text-sm font-medium text-muted-foreground transition-colors duration-[var(--motion-duration-fast)] hover:text-brand-600"
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
                  className="flex min-h-12 items-center justify-between border-b border-border py-3 text-base font-bold text-brand-950 sm:text-lg"
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
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-4 text-base font-extrabold text-white shadow-soft active:scale-95 transition-transform"
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
        "hidden lg:block fixed inset-0 bg-brand-950/20 backdrop-blur-[2px] opacity-0 pointer-events-none transition-opacity duration-300 z-30 group-hover:opacity-100 has-[:hover]:opacity-100",
        scrolled ? "top-20" : "top-24"
      )} />
    </>
  );
}