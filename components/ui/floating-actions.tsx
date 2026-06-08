"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUp, 
  Phone, 
  Mail, 
  X,
  Headset
} from "lucide-react";
import { cn } from "@/lib/utils";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    aria-hidden="true"
    viewBox="0 0 24 24" 
    className={className} 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03c0 2.12.551 4.189 1.596 6.027L0 24l6.135-1.61a11.802 11.802 0 005.911 1.586h.005c6.637 0 12.032-5.391 12.036-12.028.002-3.218-1.248-6.242-3.517-8.511z" />
  </svg>
);

export default function FloatingActions({ whatsappNumber = "51949260658" }: { whatsappNumber?: string }) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const contactOptions = [
    {
      icon: <WhatsAppIcon className="w-6 h-6" />,
      label: "WhatsApp",
      href: `https://wa.me/${whatsappNumber}`,
      color: "bg-emerald-500",
      delay: 0.1
    },
    {
      icon: <Phone aria-hidden="true" className="w-5 h-5" />,
      label: "Llamar",
      href: "tel:064481060",
      color: "bg-blue-500",
      delay: 0.2
    },
    {
      icon: <Mail aria-hidden="true" className="w-5 h-5" />,
      label: "Correo",
      href: "mailto:posgrado@uncp.edu.pe",
      color: "bg-brand-600",
      delay: 0.3
    }
  ];

  return (
    <div className="fixed bottom-8 right-6 lg:bottom-10 lg:right-10 z-[100] flex flex-col items-center gap-4">
      
      {/* ── MENÚ DE CONTACTO DESPLEGABLE ──────────────────── */}
      <div className="relative flex flex-col items-center gap-3">
        <AnimatePresence>
          {isMenuOpen && (
            <div className="flex flex-col items-center gap-3 mb-2">
              {contactOptions.map((option) => (
                <motion.a
                  key={option.label}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Contactar por ${option.label}`}
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: 20 }}
                  transition={{ duration: 0.2, delay: option.delay }}
                  className="group relative flex items-center"
                >
                  <span aria-hidden="true" className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-brand-950 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity shadow-xl pointer-events-none whitespace-nowrap">
                    {option.label}
                  </span>
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-110 active:scale-95",
                    option.color
                  )}>
                    {option.icon}
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Botón Principal de Contacto */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Cerrar menú de ayuda" : "Abrir menú de ayuda y contacto"}
          className={cn(
            "w-14 h-14 lg:w-16 lg:h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 transform hover:-translate-y-1 active:scale-95",
            isMenuOpen ? "bg-brand-950 rotate-90" : "bg-brand-950"
          )}
        >
          {isMenuOpen ? (
            <X aria-hidden="true" className="w-6 h-6 lg:w-7 lg:h-7" />
          ) : (
            <Headset aria-hidden="true" className="w-6 h-6 lg:w-7 lg:h-7 text-uncp-gold" />
          )}
        </button>
      </div>

      {/* ── BOTÓN VOLVER ARRIBA ────────────────────────────── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center text-brand-950 shadow-xl hover:bg-brand-50 transition-all active:scale-90 focus-visible:outline-brand-600 focus-visible:outline-2"
            aria-label="Volver arriba"
          >
            <ArrowUp aria-hidden="true" className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
