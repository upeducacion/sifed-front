"use client";

import { UnoptImage } from "@/components/ui/unopt-image";

const images = [
  "foto1.jpg",
  "doctorado1.jpg",
  "evento2025.png",
  "aula.jpeg",
];

export default function GallerySection() {
  return (
    <section className="w-full py-20 bg-muted/40">
      <div className="container mx-auto px-6">
        {/* Título */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Galería de Actividades Académicas
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Conoce nuestras experiencias formativas, investigación, sustentaciones
            y participación académica del Doctorado en Educación.
          </p>
        </div>

        {/* Grid de imágenes */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-md"
            >
              <UnoptImage
                src={`/galeria/${img}`}
                alt={`Galería ${index + 1}`}
                width={500}
                height={400}
                className="h-[260px] w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
