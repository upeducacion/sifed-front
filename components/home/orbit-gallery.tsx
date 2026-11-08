"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { UnoptImage } from "@/components/ui/unopt-image";

interface OrbitPhoto {
  url: string;
  title: string;
}

interface OrbitGalleryProps {
  photos: OrbitPhoto[];
}

// Geometría medida en la referencia: 12 tarjetas a 15° entre sí, girando
// alrededor de un pivote muy por debajo de ellas (~6° por cada 1000px de scroll).
const MAX_CARDS = 12;
const STEP_DEG = 15;
const RADIUS = 1700; // px desde el borde superior de la tarjeta al pivote
const SPIN_DEG = 4; // giro a cada lado mientras la sección cruza el viewport (~6° por 1000px)

export default function OrbitGallery({ photos }: OrbitGalleryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Lineal, sin easing: la tarjeta central queda derecha a mitad del recorrido.
  const rotate = useTransform(scrollYProgress, [0, 1], [SPIN_DEG, -SPIN_DEG]);

  const cards = photos.slice(0, MAX_CARDS);
  const firstAngle = -((cards.length - 1) * STEP_DEG) / 2;

  return (
    <div
      ref={ref}
      className="relative h-[300px] w-full overflow-hidden sm:h-[420px] lg:h-[560px]"
      aria-label="Galería de fotos institucionales"
    >
      {/* El escalado responsive va en un contenedor aparte para no mover el pivote del giro */}
      <div className="absolute left-1/2 top-6 h-0 w-0 origin-top scale-[0.55] sm:scale-75 lg:top-10 lg:scale-100">
      <motion.div
        className="absolute left-0 top-0 h-0 w-0 motion-reduce:transform-none!"
        style={{ rotate: reduceMotion ? 0 : rotate, transformOrigin: `0px ${RADIUS}px` }}
      >
        {cards.map((photo, i) => (
          <div
            key={`${photo.url}-${i}`}
            className="absolute left-0 top-0 h-[400px] w-[320px] overflow-hidden rounded-lg bg-brand-900"
            style={{
              transform: `translateX(-50%) rotate(${firstAngle + i * STEP_DEG}deg)`,
              transformOrigin: `50% ${RADIUS}px`,
            }}
          >
            <UnoptImage
              src={photo.url}
              alt={photo.title}
              fill
              sizes="320px"
              className="object-cover"
            />
          </div>
        ))}
      </motion.div>
      </div>
    </div>
  );
}
