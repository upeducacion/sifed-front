"use client";

import { ReactNode, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrubRevealProps {
  children: ReactNode;
  className?: string;
  /** Escala, opacidad y desplazamiento vertical iniciales (al asomar por abajo). */
  from?: { scale: number; opacity: number; y?: number };
}

/**
 * Crece hasta su tamaño real siguiendo el scroll (sin easing): empieza cuando
 * el borde superior toca el fondo del viewport y termina al llegar arriba.
 * Con reduced motion se muestra directamente en su estado final.
 */
export default function ScrubReveal({
  children,
  className,
  from = { scale: 0.58, opacity: 0.67 },
}: ScrubRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [from.scale, 1]);
  // Transform con función: framer-motion acelera la opacidad mapeada por rangos con un
  // ScrollTimeline nativo que ignora el `offset` del target y da valores incorrectos.
  const opacity = useTransform(scrollYProgress, (p) => from.opacity + (1 - from.opacity) * p);
  const y = useTransform(scrollYProgress, [0, 1], [from.y ?? 0, 0]);

  return (
    // El SSR pinta el estado inicial inline y framer-motion no siempre lo limpia al detectar
    // reduced motion; las clases motion-reduce lo fuerzan al estado final (también sin JS).
    <motion.div
      ref={ref}
      className={cn("motion-reduce:opacity-100! motion-reduce:transform-none!", className)}
      style={reduceMotion ? { scale: 1, opacity: 1, y: 0 } : { scale, opacity, y }}
    >
      {children}
    </motion.div>
  );
}
