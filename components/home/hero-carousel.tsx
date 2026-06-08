"use client";

import Link from "next/link";
import { UnoptImage } from "@/components/ui/unopt-image";
import {
  ArrowRight, ChevronRight, ChevronLeft, BookOpen,
  ClipboardList, Clock, GraduationCap, Layers, LucideIcon,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const AUTOPLAY_DELAY = 12000;

interface Slide {
  id: number;
  src: string;
  alt: string;
  badge: string;
  preTitle: string;
  title: string;
  subtitle: string;
  description: string;
  stats: { iconName: string; label: string; value: string }[];
  curriculumLink: string;
  inscripcionLink: string;
}

// Mapa de iconos para resolver el componente en el cliente
const ICON_MAP: Record<string, LucideIcon> = {
  Clock,
  Layers,
  GraduationCap,
  BookOpen,
};

interface HeroCarouselProps {
  slides: Slide[];
}

// Variantes

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: (delay = 0) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: {
      delay: delay * 0.7,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const
    },
  }),
  exit: { opacity: 0, y: -12, filter: "blur(4px)", transition: { duration: 0.2 } },
};

const statsCard: Variants = {
  hidden: { opacity: 0, x: 40, filter: "blur(6px)" },
  visible: (delay = 0) => ({
    opacity: 1, x: 0, filter: "blur(0px)",
    transition: {
      delay: delay * 0.7,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const
    },
  }),
  exit: { opacity: 0, x: 30, filter: "blur(4px)", transition: { duration: 0.15 } },
};

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 }, [
    Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false, stopOnMouseEnter: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const slide = slides[selectedIndex] ?? slides[0];

  return (
    <section className="relative w-full min-h-[calc(100vh-5rem)] bg-brand-950 overflow-hidden group/hero" aria-label="Carrusel de Programas Académicos Destacados">

      {/* Imágenes */}
      <div className="overflow-hidden absolute inset-0" ref={emblaRef}>
        <div className="flex h-full w-full touch-pan-y">
          {slides.map((s, idx) => (
            <div className="flex-[0_0_100%] min-w-0 relative h-full" key={s.id}>
              <UnoptImage
                src={s.src} alt={s.alt} fill
                quality={85}
                sizes="100vw"
                className={cn(
                  "object-cover object-center transition-transform duration-[9000ms] ease-linear",
                  idx === selectedIndex ? "scale-[1.08]" : "scale-100"
                )}
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Overlays */}
      <div aria-hidden="true" className="absolute inset-0 z-[1] bg-gradient-to-r from-brand-950/98 via-brand-950/80 to-brand-950/40 pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-[1] h-48 bg-gradient-to-t from-brand-950/90 to-transparent pointer-events-none" />

      {/* Orbes decorativos animados */}
      <div aria-hidden="true" className="absolute top-1/4 right-[20%] z-[1] w-[28rem] h-[28rem] rounded-full bg-brand-600/10 blur-[100px] animate-pulse pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-1/4 right-[30%] z-[1] w-72 h-72 rounded-full bg-uncp-gold/6 blur-[80px] pointer-events-none"
        style={{ animation: "pulse 5s ease-in-out infinite", animationDelay: "2.5s" }} />

      {/* Número de slide decorativo */}
      <AnimatePresence mode="wait">
        <motion.span
          key={`num-${selectedIndex}`}
          aria-hidden="true"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute right-6 bottom-16 z-[2] font-serif font-black select-none pointer-events-none text-white/[0.06] leading-none"
          style={{ fontSize: "clamp(8rem, 20vw, 18rem)" }}
        >
          {String(selectedIndex + 1).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>

      {/* Contenido principal */}
      <div className="absolute inset-0 z-10 flex items-center px-8 md:px-16 xl:px-24 pointer-events-none">
        <div className="w-full flex items-center justify-between gap-8 xl:gap-12">

          {/* Texto (izquierda) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${selectedIndex}`}
              className="flex-1 max-w-4xl pointer-events-auto"
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {slide.preTitle && (
                <motion.span
                  variants={fadeUp} custom={0.05}
                  className="block text-uncp-gold font-bold uppercase tracking-[0.3em] text-xs mb-4 drop-shadow-md"
                >
                  {slide.preTitle}
                </motion.span>
              )}

              {/* Título */}
              <h1 className="font-serif text-5xl md:text-6xl xl:text-7xl 2xl:text-[5.5rem] font-black leading-[1.05] text-white tracking-tighter mb-5 drop-shadow-xl">
                {slide.title.split(" ").map((word, i) => (
                  <motion.span
                    key={`${selectedIndex}-w${i}`}
                    initial={{ opacity: 0, y: 32, rotateX: -20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ delay: 0.2 + i * 0.09, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="inline-block mr-[0.28em] last:mr-0"
                    style={{ perspective: 500 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              {/* Subtítulo */}
              <motion.p
                variants={fadeUp} custom={0.45}
                className="text-base md:text-xl font-semibold text-uncp-gold mb-5 tracking-wide max-w-3xl"
              >
                {slide.subtitle}
              </motion.p>

              {/* Línea acento */}
              <motion.div
                variants={fadeUp} custom={0.52}
                aria-hidden="true"
                className="flex items-center gap-3 mb-6"
              >
                <div className="h-px w-10 bg-uncp-gold/80 rounded-full" />
                <div className="h-px flex-1 max-w-[4rem] bg-white/30 rounded-full" />
              </motion.div>

              {/* Descripción */}
              <motion.p
                variants={fadeUp} custom={0.6}
                className="text-sm md:text-base text-white/90 font-medium leading-relaxed mb-8 max-w-2xl"
              >
                {slide.description}
              </motion.p>

              {/* Botones */}
              <motion.div
                variants={fadeUp} custom={0.7}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href={slide.curriculumLink}
                  aria-label={`Conocer más detalles de la ${slide.title}`}
                  className="group/btn relative overflow-hidden flex h-14 items-center justify-center gap-3 rounded-xl bg-brand-600 px-8 text-sm font-extrabold text-white shadow-lg shadow-brand-950/40 transition-all hover:bg-brand-500 hover:-translate-y-0.5 hover:shadow-2xl border border-brand-500/40"
                >
                  <span aria-hidden="true" className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                  <BookOpen aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                  <span>Conocer más</span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-hover/btn:translate-x-1" strokeWidth={2.5} />
                </Link>

                <Link
                  href={slide.inscripcionLink}
                  aria-label={`Guía de inscripción para la ${slide.title}`}
                  className="group/btn flex h-14 items-center justify-center gap-3 rounded-xl bg-white/10 backdrop-blur-md border-2 border-white/30 px-8 text-sm font-bold text-white transition-all hover:bg-uncp-gold hover:border-uncp-gold hover:text-brand-950 hover:-translate-y-0.5"
                >
                  <ClipboardList aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                  <span>Guía de Inscripción</span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-hover/btn:translate-x-1" strokeWidth={2.5} />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* —— Stats (derecha, desktop) —— */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`stats-${selectedIndex}`}
              className="hidden xl:flex flex-col gap-4 shrink-0 w-64 pointer-events-auto"
              initial="hidden" animate="visible" exit="exit"
            >
              {slide.stats.map((stat, i) => {
                const IconComponent = ICON_MAP[stat.iconName] || BookOpen;
                return (
                  <motion.div
                    key={stat.label}
                    variants={statsCard}
                    custom={0.35 + i * 0.12}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3.5 hover:bg-white/15 hover:border-white/30 transition-all"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600/40 border border-brand-500/40">
                      <IconComponent aria-hidden="true" className="h-4 w-4 text-white" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">{stat.label}</p>
                      <p className="text-sm font-black text-white leading-tight">{stat.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* Flechas */}
      <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-4 pointer-events-none">
        <button
          onClick={scrollPrev}
          className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center justify-center pointer-events-auto opacity-0 group-hover/hero:opacity-100 transition-all duration-300 hover:bg-brand-600 hover:border-brand-600 hover:scale-110 focus:opacity-100"
          aria-label="Ver slide anterior"
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <button
          onClick={scrollNext}
          className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center justify-center pointer-events-auto opacity-0 group-hover/hero:opacity-100 transition-all duration-300 hover:bg-brand-600 hover:border-brand-600 hover:scale-110 focus:opacity-100"
          aria-label="Ver slide siguiente"
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      {/* Barra de progreso + indicadores */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col gap-4 pb-6 px-8 md:px-16">

        {/* Línea de progreso */}
        <div aria-hidden="true" className="relative w-full h-px bg-white/20 rounded-full overflow-hidden">
          <motion.div
            key={selectedIndex}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-uncp-gold/50 to-uncp-gold rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: AUTOPLAY_DELAY / 1000, ease: "linear" }}
          />
        </div>

        {/* Dots + contador */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 pointer-events-auto" role="tablist">
            {scrollSnaps.map((_, idx) => (
              <button
                key={idx}
                role="tab"
                aria-selected={idx === selectedIndex}
                onClick={() => scrollTo(idx)}
                aria-label={`Ir al slide ${idx + 1}`}
                className="focus-visible:outline-white focus-visible:outline-2 focus-visible:outline-offset-4 rounded-full"
              >
                <motion.span
                  animate={{
                    width: idx === selectedIndex ? "2rem" : "0.375rem",
                    backgroundColor: idx === selectedIndex ? "var(--color-uncp-gold)" : "rgba(255,255,255,0.5)",
                  }}
                  transition={{ duration: 0.4 }}
                  className="block h-1.5 rounded-full"
                />
              </button>
            ))}
          </div>

          <span aria-live="polite" className="text-white/70 text-xs font-bold tabular-nums select-none">
            {String(selectedIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      </div>

    </section>
  );
}
