"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { X, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Noticia } from "@/types/noticia";
import { getStorageUrl } from "@/lib/utils";
import { UnoptImage } from "@/components/ui/unopt-image";

interface NewsPopupModalProps {
  noticias: Noticia[];
}

const NEWS_POPUP_PAGE_LOAD_KEY = "upeducacion_news_popup_page_load_id";
const AUTOPLAY_MS = 6000;
const TICK_MS = 80;

export default function NewsPopupModal({ noticias }: NewsPopupModalProps) {
  const popupNoticias = useMemo(() => {
    return noticias
      .filter((noticia) => noticia.estado === "publicado" && noticia.destacada)
      .slice(0, 3);
  }, [noticias]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // — lógica original intacta —
  useEffect(() => {
    if (popupNoticias.length === 0 || typeof window === "undefined") return;

    const currentPageLoadId = String(window.performance.timeOrigin);
    const storedPageLoadId = window.sessionStorage.getItem(NEWS_POPUP_PAGE_LOAD_KEY);

    if (storedPageLoadId !== currentPageLoadId) {
      window.sessionStorage.setItem(NEWS_POPUP_PAGE_LOAD_KEY, currentPageLoadId);
      setCurrentIndex(0);
      setIsOpen(true);
    }
  }, [popupNoticias.length]);

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < popupNoticias.length - 1;

  const handleClose = () => setIsOpen(false);

  const handlePrevious = useCallback(() => {
    if (!hasPrevious) return;
    setDirection(-1);
    setCurrentIndex((prev) => prev - 1);
    setProgress(0);
  }, [hasPrevious]);

  const handleNext = useCallback(() => {
    if (!hasNext) return;
    setDirection(1);
    setCurrentIndex((prev) => prev + 1);
    setProgress(0);
  }, [hasNext]);

  const goToIndex = (i: number) => {
    setDirection(i > currentIndex ? 1 : -1);
    setCurrentIndex(i);
    setProgress(0);
  };

  // autoplay
  useEffect(() => {
    if (!isOpen || isPaused || popupNoticias.length <= 1) return;

    const step = (100 / AUTOPLAY_MS) * TICK_MS;

    const ticker = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          setDirection(1);
          setCurrentIndex((ci) => (ci + 1) % popupNoticias.length);
          return 0;
        }
        return prev + step;
      });
    }, TICK_MS);

    return () => clearInterval(ticker);
  }, [isOpen, isPaused, popupNoticias.length, currentIndex]);

  if (!isOpen || popupNoticias.length === 0) return null;

  const currentNoticia = popupNoticias[currentIndex];

  const imageVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0, scale: 1.04 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0, scale: 0.98 }),
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6"
        style={{ backgroundColor: "rgba(5, 8, 18, 0.82)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={handleClose}
      >
        <motion.div
          className="relative w-full max-w-[620px] rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
          style={{
            background: "linear-gradient(160deg, #0d1623 0%, #0a1018 100%)",
            border: "1px solid rgba(180,145,60,0.25)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(180,145,60,0.12), inset 0 1px 0 rgba(180,145,60,0.08)",
          }}
          initial={{ opacity: 0, y: 52, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 28, scale: 0.95 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Línea de acento dorado superior */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] z-30"
            style={{ background: "linear-gradient(90deg, transparent, #b4913c, #d4a853, #b4913c, transparent)" }}
          />

          {/* Barra de progreso — inferior, solo la actual */}
          {popupNoticias.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 z-20 h-[3px]"
              style={{ backgroundColor: "rgba(180,145,60,0.15)" }}
            >
              <motion.div
                className="h-full"
                style={{ background: "linear-gradient(90deg, #b4913c, #d4a853)" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.08, ease: "linear" }}
              />
            </div>
          )}

          {/* Flechas flotantes fuera del card */}
          {popupNoticias.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevious}
                disabled={!hasPrevious}
                className="absolute -left-12 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none hover:scale-110"
                style={{ backgroundColor: "rgba(180,145,60,0.18)", border: "1px solid rgba(180,145,60,0.35)", color: "#d4a853", backdropFilter: "blur(8px)" }}
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!hasNext}
                className="absolute -right-12 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none hover:scale-110"
                style={{ backgroundColor: "rgba(180,145,60,0.18)", border: "1px solid rgba(180,145,60,0.35)", color: "#d4a853", backdropFilter: "blur(8px)" }}
                aria-label="Siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Botón cerrar */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-3 z-30 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)" }}
            aria-label="Cerrar aviso"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          {/* ─── ÁREA DE IMAGEN CON HOVER-REVEAL ─── */}
          <Link href={`/noticias/${currentNoticia.slug}`} className="group relative h-[50vw] max-h-[300px] min-h-[220px] overflow-hidden cursor-pointer block">
            <AnimatePresence custom={direction} mode="popLayout">
              <motion.div
                key={currentIndex}
                className="absolute inset-0"
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Capa A: imagen — se vuelve translúcida al hover */}
                {currentNoticia.imagen_url ? (
                  <UnoptImage
                    src={getStorageUrl(currentNoticia.imagen_url)}
                    alt={currentNoticia.titulo}
                    fill
                    sizes="460px"
                    className="object-cover object-top transition-opacity duration-500 group-hover:opacity-15"
                  />
                ) : (
                  <div
                    className="w-full h-full transition-opacity duration-500 group-hover:opacity-15"
                    style={{ background: "linear-gradient(135deg, #0d1623 0%, #1a2a4a 100%)" }}
                  />
                )}

                {/* Capa B: overlay oscuro — aparece al hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "rgba(10,16,24,0.88)" }}
                />

                {/* Capa C: texto — sube y aparece al hover */}
                <div className="absolute inset-0 flex flex-col justify-center px-7 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out z-10">

                  {/* Label dorado */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="h-[1px] w-5 flex-shrink-0" style={{ backgroundColor: "#b4913c" }} />
                    <span
                      className="text-[9px] font-black uppercase tracking-[0.35em]"
                      style={{ color: "#d4a853" }}
                    >
                      Comunicado Institucional
                    </span>
                  </div>

                  {/* Título */}
                  <h2
                    className="font-serif font-black leading-snug text-white mb-3 line-clamp-3"
                    style={{ fontSize: "clamp(1rem, 3.5vw, 1.25rem)", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
                  >
                    {currentNoticia.titulo}
                  </h2>

                  {/* Fecha */}
                  {currentNoticia.fecha_humana && (
                    <p
                      className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-2"
                      style={{ color: "rgba(180,145,60,0.75)" }}
                    >
                      {currentNoticia.fecha_humana} · UPG UNCP
                    </p>
                  )}

                  {/* Resumen */}
                  {currentNoticia.resumen && (
                    <p
                      className="text-sm leading-relaxed line-clamp-3"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      {currentNoticia.resumen}
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

          </Link>

          {/* Separador dorado */}
          <div
            className="mx-6 mt-0 h-[1px]"
            style={{ background: "linear-gradient(90deg, rgba(180,145,60,0.4), rgba(180,145,60,0.08))" }}
          />

          {/* Footer: dots + CTA */}
          <div className="flex items-center justify-between px-6 py-4">
            {popupNoticias.length > 1 ? (
              <div className="flex items-center gap-2">
                {popupNoticias.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goToIndex(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === currentIndex ? "20px" : "6px",
                      height: "4px",
                      backgroundColor: i === currentIndex ? "#b4913c" : "rgba(255,255,255,0.15)",
                    }}
                  />
                ))}
              </div>
            ) : (
              <span
                className="text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                UPG · UNCP
              </span>
            )}

            <Link
              href={`/noticias/${currentNoticia.slug}`}
              className="group/btn inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #b4913c, #d4a853)", color: "#0a1018" }}
            >
              Leer más
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
