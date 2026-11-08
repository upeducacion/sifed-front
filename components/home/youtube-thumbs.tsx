"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { UnoptImage } from "@/components/ui/unopt-image";
import { YoutubeVideo } from "@/lib/youtube";

const formatoFecha = new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short", year: "numeric" });

export default function YoutubeThumbs({ videos }: { videos: YoutubeVideo[] }) {
  const [activo, setActivo] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {videos.map((video) => (
        <div key={video.id} className="flex flex-col gap-3">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border-subtle bg-brand-950">
            {activo === video.id ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`}
                title={video.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button
                type="button"
                onClick={() => setActivo(video.id)}
                className="group absolute inset-0 h-full w-full"
                aria-label={`Reproducir: ${video.titulo}`}
              >
                <UnoptImage
                  src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-brand-950/20 transition-colors group-hover:bg-brand-950/40" />
                <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-950 shadow-lg transition-transform group-hover:scale-110">
                  <Play className="ml-0.5 h-6 w-6 fill-current" />
                </span>
              </button>
            )}
          </div>
          <div className="px-1">
            {video.publicado && (
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-brand-400">
                {formatoFecha.format(new Date(video.publicado))}
              </span>
            )}
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-brand-950">{video.titulo}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
