"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Check, Download, GraduationCap, X } from "lucide-react";
import { UnoptImage } from "@/components/ui/unopt-image";
import { cn } from "@/lib/utils";
import {
  ADMISION_2026_II,
  buildDriveDownloadUrl,
  type BrochureAdmision,
} from "@/data/admision-2026-ii";

/**
 * Campaña flotante "Admisión 2026-II".
 *
 * Se monta una sola vez en el layout del portal, de modo que:
 *  - el modal se abre en cada carga/recarga real de la página (montaje del layout)
 *    y no vuelve a interrumpir durante la navegación cliente entre secciones;
 *  - el botón flotante y el modal comparten el mismo estado y el mismo componente.
 *
 * Mapa de apilamiento vigente en el portal (revisado antes de fijar estos valores):
 *   header sticky ............... z-50
 *   menú móvil / velo del mega menú .. z-40 / z-30
 *   FloatingActions (contacto) ...... z-[100]
 *   NewsPopupModal (avisos) ......... z-[9999]
 * La campaña debe quedar por encima del popup de noticias sin modificarlo, y su
 * botón por encima de las acciones flotantes pero por debajo de cualquier modal.
 */
const Z_BOTON_FLOTANTE = "z-[101]";
const Z_MODAL = "z-[10000]";

/**
 * El botón se ancla arriba de la pila de FloatingActions (`bottom-8`/`lg:bottom-10`,
 * hasta 120px/128px de alto cuando aparece "volver arriba"), dejando ~16px de aire.
 */
const POSICION_BOTON =
  "bottom-[calc(10.5rem_+_env(safe-area-inset-bottom))] lg:bottom-[calc(11.5rem_+_env(safe-area-inset-bottom))]";

const SELECTOR_FOCUSABLES =
  'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

const MS_FEEDBACK_DESCARGA = 2500;

export default function AdmisionCampaign() {
  // Arranca abierto también en SSR: evita el parpadeo del modal y no genera
  // desajuste de hidratación. El <noscript> de abajo lo neutraliza si no hay JS.
  const [isOpen, setIsOpen] = useState(true);
  const [descargando, setDescargando] = useState<BrochureAdmision["id"] | null>(null);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const focoPrevioRef = useRef<HTMLElement | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const abrir = useCallback(() => setIsOpen(true), []);

  const cerrar = useCallback(() => {
    setIsOpen(false);
    const focoPrevio = focoPrevioRef.current;
    if (focoPrevio && focoPrevio.isConnected && focoPrevio !== document.body) {
      focoPrevio.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, []);

  // Bloquea el scroll de fondo solo mientras el modal está abierto y siempre restaura.
  useEffect(() => {
    if (!isOpen) return;
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflowPrevio;
    };
  }, [isOpen]);

  // Escape + foco atrapado dentro del diálogo.
  useEffect(() => {
    if (!isOpen) return;

    focoPrevioRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        cerrar();
        return;
      }
      if (event.key !== "Tab") return;

      const contenedor = dialogRef.current;
      if (!contenedor) return;

      const focusables = Array.from(
        contenedor.querySelectorAll<HTMLElement>(SELECTOR_FOCUSABLES)
      );
      if (focusables.length === 0) return;

      const primero = focusables[0];
      const ultimo = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === primero) {
        event.preventDefault();
        ultimo.focus();
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, cerrar]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  /**
   * Dispara la descarga con un ancla temporal sin `target`: Drive responde con
   * `Content-Disposition: attachment`, así que el navegador descarga el archivo,
   * cancela la navegación y el usuario permanece en la página con el modal abierto.
   */
  const descargar = (brochure: BrochureAdmision) => {
    if (descargando === brochure.id) return; // evita la doble descarga por doble clic

    const enlace = document.createElement("a");
    enlace.href = buildDriveDownloadUrl(brochure.driveFileId);
    enlace.download = brochure.nombreArchivo;
    enlace.rel = "noopener";
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    setDescargando(brochure.id);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = setTimeout(
      () => setDescargando(null),
      MS_FEEDBACK_DESCARGA
    );
  };

  const brochureDescargando = ADMISION_2026_II.brochures.find(
    (brochure) => brochure.id === descargando
  );

  return (
    <MotionConfig reducedMotion="user">
      {/* Sin JavaScript el velo quedaría fijo y sin botón operativo: lo ocultamos. */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: "[data-admision-overlay]{display:none !important}",
          }}
        />
      </noscript>

      {/* ── BOTÓN FLOTANTE GLOBAL ─────────────────────────────── */}
      <button
        ref={triggerRef}
        type="button"
        onClick={abrir}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={cn(
          "fixed right-6 lg:right-10",
          POSICION_BOTON,
          Z_BOTON_FLOTANTE,
          "flex items-center gap-2.5 rounded-2xl bg-brand-950 py-3 pl-3.5 pr-4",
          "shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500",
          "hover:-translate-y-1 hover:brightness-125 active:scale-95",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uncp-gold"
        )}
      >
        <GraduationCap aria-hidden="true" className="h-5 w-5 shrink-0 text-uncp-gold" />
        <span className="whitespace-nowrap text-[11px] font-black tracking-wide text-white lg:text-xs">
          {ADMISION_2026_II.etiqueta}
        </span>
      </button>

      {/* ── MODAL DE CAMPAÑA ──────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="admision-overlay"
            data-admision-overlay=""
            className={cn(
              "fixed inset-0 flex items-center justify-center px-4 py-6",
              Z_MODAL
            )}
            style={{ backgroundColor: "rgba(5, 8, 18, 0.82)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={cerrar}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="admision-2026-ii-titulo"
              aria-describedby="admision-2026-ii-descripcion"
              className="relative flex max-h-[92dvh] w-full max-w-[640px] flex-col overflow-hidden rounded-[1.75rem] bg-brand-950"
              style={{
                boxShadow:
                  "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(245,166,35,0.18), inset 0 1px 0 rgba(245,166,35,0.10)",
              }}
              initial={{ opacity: 0, y: 52, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 28, scale: 0.95 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              {/* Línea de acento superior */}
              <div
                aria-hidden="true"
                className="absolute left-0 right-0 top-0 z-20 h-[2px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #F5A623, #ffc46b, #F5A623, transparent)",
                }}
              />

              {/* Botón cerrar */}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={cerrar}
                aria-label="Cerrar el aviso de Admisión 2026-II"
                className={cn(
                  // 44px de target táctil hasta desktop; solo se reduce en lg (puntero fino)
                  "absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full lg:h-10 lg:w-10",
                  "bg-white/[0.07] text-white/55 transition-all duration-200",
                  "hover:scale-110 hover:bg-white/15 hover:text-white",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uncp-gold"
                )}
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>

              <div className="overflow-y-auto overscroll-contain px-5 pb-7 pt-8 sm:px-8 sm:pb-8">
                {/* Encabezado */}
                <div className="pr-12">
                  <div className="mb-3 flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="h-[1px] w-5 shrink-0 bg-uncp-gold"
                    />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-uncp-gold">
                      {ADMISION_2026_II.eyebrow}
                    </span>
                  </div>

                  <h2
                    id="admision-2026-ii-titulo"
                    className="font-serif font-black leading-tight tracking-tight text-white"
                    style={{ fontSize: "clamp(1.5rem, 6vw, 2.125rem)" }}
                  >
                    {ADMISION_2026_II.etiqueta}
                  </h2>

                  <p
                    id="admision-2026-ii-descripcion"
                    className="mt-2.5 text-sm leading-relaxed text-white/60"
                  >
                    {ADMISION_2026_II.descripcion}
                  </p>
                </div>

                {/* Tarjetas Maestrías / Doctorados */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5">
                  {ADMISION_2026_II.brochures.map((brochure) => {
                    const estaDescargando = descargando === brochure.id;

                    return (
                      <button
                        key={brochure.id}
                        type="button"
                        onClick={() => descargar(brochure)}
                        aria-label={`Descargar en PDF el brochure de ${brochure.titulo} — ${brochure.descriptor}, Admisión 2026-II`}
                        className={cn(
                          "group relative flex flex-col overflow-hidden rounded-2xl text-left",
                          "border border-uncp-gold/25 bg-white/[0.03] transition-all duration-300",
                          "hover:-translate-y-1 hover:border-uncp-gold/60 hover:bg-white/[0.06] active:scale-[0.98]",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uncp-gold"
                        )}
                      >
                        <span className="relative block aspect-square w-full overflow-hidden">
                          <UnoptImage
                            src={brochure.imagen}
                            alt={`Portada del brochure de ${brochure.descriptor}`}
                            fill
                            sizes="(max-width: 640px) 45vw, 280px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/10 to-transparent"
                          />
                        </span>

                        <span className="flex items-center justify-between gap-2 px-3.5 py-3 sm:px-4">
                          <span className="min-w-0">
                            <span className="block font-serif text-base font-black leading-tight tracking-tight text-white sm:text-lg">
                              {brochure.titulo}
                            </span>
                            <span className="mt-1 block text-[9px] font-black uppercase leading-tight tracking-[0.16em] text-uncp-gold/85">
                              {estaDescargando ? "Descarga iniciada" : "Descargar PDF"}
                            </span>
                          </span>
                          <span
                            aria-hidden="true"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-uncp-gold text-brand-950 transition-transform duration-300 group-hover:scale-110"
                          >
                            {estaDescargando ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p
                  aria-live="polite"
                  className="mt-5 text-center text-[11px] leading-relaxed text-white/40"
                >
                  {brochureDescargando
                    ? `Descargando el brochure de ${brochureDescargando.titulo}…`
                    : "La descarga se inicia sin salir de esta página."}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
