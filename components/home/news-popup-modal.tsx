"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { X, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Noticia } from "@/types/noticia";
import { getStorageUrl } from "@/lib/utils";
import { UnoptImage } from "@/components/ui/unopt-image";

interface NewsPopupModalProps {
  noticias: Noticia[];
}

const NEWS_POPUP_PAGE_LOAD_KEY = "upeducacion_news_popup_page_load_id";

export default function NewsPopupModal({ noticias }: NewsPopupModalProps) {
  const popupNoticias = useMemo(() => {
    return noticias
      .filter((noticia) => noticia.estado === "publicado" && noticia.destacada)
      .slice(0, 3);
  }, [noticias]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (popupNoticias.length === 0 || typeof window === "undefined") {
      return;
    }

    const currentPageLoadId = String(window.performance.timeOrigin);
    const storedPageLoadId = window.sessionStorage.getItem(NEWS_POPUP_PAGE_LOAD_KEY);

    if (storedPageLoadId !== currentPageLoadId) {
      window.sessionStorage.setItem(NEWS_POPUP_PAGE_LOAD_KEY, currentPageLoadId);
      setCurrentIndex(0);
      setIsOpen(true);
    }
  }, [popupNoticias.length]);

  if (!isOpen || popupNoticias.length === 0) {
    return null;
  }

  const currentNoticia = popupNoticias[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < popupNoticias.length - 1;

  const handleClose = () => {
    setIsOpen(false);
  };

  const handlePrevious = () => {
    if (!hasPrevious) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!hasNext) return;
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-950/65 px-4 py-6 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-[2rem] bg-white shadow-2xl"
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-brand-950 shadow-lg transition-colors hover:bg-brand-950 hover:text-white"
            aria-label="Cerrar aviso"
          >
            <X className="h-5 w-5" />
          </button>

          {currentNoticia.imagen_url && (
            <div className="w-full max-h-[52vh] overflow-hidden bg-brand-50">
              <UnoptImage
                src={getStorageUrl(currentNoticia.imagen_url)}
                alt={currentNoticia.titulo}
                width={1200}
                height={1600}
                sizes="(max-width: 640px) 100vw, 560px"
                className="block w-full h-auto object-cover object-top"
              />
            </div>
          )}

          <div className="space-y-5 p-6 md:p-7">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-uncp-gold/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-brand-900">
                  Aviso importante
                </span>

                {currentNoticia.fecha_humana && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {currentNoticia.fecha_humana}
                  </span>
                )}
              </div>

              <h2 className="font-serif text-2xl font-black leading-tight text-brand-950">
                {currentNoticia.titulo}
              </h2>

              {currentNoticia.resumen && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {currentNoticia.resumen}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-border pt-5">
              <div className="text-xs font-bold text-muted-foreground">
                {popupNoticias.length > 1 ? (
                  <>
                    Aviso {currentIndex + 1} de {popupNoticias.length}
                  </>
                ) : (
                  <>Aviso de la Unidad de Posgrado</>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={!hasPrevious}
                  className="inline-flex items-center justify-center rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-center text-[11px] font-black uppercase tracking-widest text-brand-800 transition-colors hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-brand-50"
                >
                  Anterior
                </button>

                <Link
                  href={`/noticias/${currentNoticia.slug}`}
                  className="inline-flex items-center justify-center rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-center text-[11px] font-black uppercase tracking-widest text-brand-800 transition-colors hover:bg-brand-100"
                >
                  Ver detalle
                </Link>

                {hasNext ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center rounded-xl bg-brand-950 px-4 py-3 text-center text-[11px] font-black uppercase tracking-widest text-white transition-colors hover:bg-brand-800"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center justify-center rounded-xl bg-brand-950 px-4 py-3 text-center text-[11px] font-black uppercase tracking-widest text-white transition-colors hover:bg-brand-800"
                  >
                    Cerrar
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}