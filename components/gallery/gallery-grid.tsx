"use client";

import { useState, useEffect, useCallback } from "react";
import { UnoptImage } from "@/components/ui/unopt-image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  folder: string;
  images: string[];
  title: string;
  description?: string;
}

export default function GalleryGrid({ folder, images, title, description }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const open = (index: number) => setActiveIndex(index);
  const close = useCallback(() => setActiveIndex(null), []);

  const next = useCallback(() =>
    setActiveIndex((prev) => (prev! + 1) % images.length), [images.length]);

  const prev = useCallback(() =>
    setActiveIndex((prev) => (prev! - 1 + images.length) % images.length), [images.length]);

  // 👉 Permite navegar con teclado
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, close, next, prev]);

  return (
    <section className="py-24 bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-[1600px] mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-serif font-bold text-brand-950 mb-5">
            {title}
          </h1>

          {description && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* GRID ESTILO GOOGLE ARTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((img, index) => (
            <div
              key={img}
              className="group relative overflow-hidden rounded-2xl cursor-pointer bg-neutral-100"
              onClick={() => open(index)}
            >
              {/* Imagen en máxima calidad */}
              <UnoptImage
                src={`/galeria/${folder}/${img}`}
                alt={img}
                width={2000}
                height={1500}
                sizes="(max-width:768px) 100vw,
                       (max-width:1400px) 50vw,
                       25vw"
                quality={100}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay moderno */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-end p-6">
                <span className="text-white text-sm tracking-wide">
                  Ver fotografía
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX PROFESIONAL */}
      {activeIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center">

          {/* Cerrar */}
          <button
            onClick={close}
            className="absolute top-8 right-10 text-white hover:scale-110 transition"
          >
            <X size={36} />
          </button>

          {/* Prev */}
          <button
            onClick={prev}
            className="absolute left-8 text-white hover:scale-110 transition"
          >
            <ChevronLeft size={48} />
          </button>

          {/* Imagen Full Calidad */}
          <div className="max-w-[92vw] max-h-[90vh]">
            <UnoptImage
              src={`/galeria/${folder}/${images[activeIndex]}`}
              alt=""
              width={3000}
              height={2000}
              sizes="100vw"
              quality={100}
              priority
              className="w-auto h-auto max-h-[90vh] object-contain"
            />
          </div>

          {/* Next */}
          <button
            onClick={next}
            className="absolute right-8 text-white hover:scale-110 transition"
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </section>
  );
}
