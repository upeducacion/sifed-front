"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { UnoptImage } from "@/components/ui/unopt-image";
import { getStorageUrl } from "@/lib/utils";

interface MarqueeRowProps {
  images: { url: string; title: string; category: string }[];
  direction?: "left" | "right";
  speed?: number;
  label: string;
}

export default function MarqueeRow({ images, direction = "left", speed = 30 }: MarqueeRowProps) {
  const [isPaused, setIsPaused] = useState(false);

  const xTranslation = direction === "left" ? [0, "-50%"] : ["-50%", "0"];

  return (
    <div 
      className="relative w-full overflow-hidden py-1 group cursor-pointer"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div 
        className="flex w-max gap-4"
        animate={{ x: xTranslation }}
        transition={{
          ease: "linear",
          duration: speed,
          repeat: Infinity,
        }}
        // Al usar style para paused, evitamos errores de tipos en transition
        style={{ animationPlayState: isPaused ? "paused" : "running" }}
      >
        {/* Renderizamos el set de imágenes dos veces para el loop */}
        {[...images, ...images].map((img, idx) => (
          <div 
            key={`${img.url}-${idx}`} 
            className="relative h-40 w-64 md:h-52 md:w-80 shrink-0 overflow-hidden rounded-2xl border border-white/5 bg-brand-900 shadow-xl"
          >
            <UnoptImage
              src={getStorageUrl(img.url)}
              alt={img.title}
              fill
              sizes="(max-width: 768px) 256px, 320px"
              className="object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
               <span className="text-[8px] font-black uppercase tracking-widest text-uncp-gold mb-1">{img.category}</span>
               <span className="text-[10px] font-bold text-white leading-tight line-clamp-2">{img.title}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
