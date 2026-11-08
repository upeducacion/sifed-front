import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, Clock, ImageIcon, Pin } from "lucide-react";
import { UnoptImage } from "@/components/ui/unopt-image";
import { getStorageUrl, cn } from "@/lib/utils";
import { venceEl } from "@/lib/noticias";
import { Noticia } from "@/types/noticia";

const formatoVigencia = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "long" });
const DIA_MS = 24 * 60 * 60 * 1000;

function diasRestantes(noticia: Noticia, hoy: Date) {
  return Math.max(1, Math.ceil((venceEl(noticia).getTime() - hoy.getTime()) / DIA_MS));
}

type Variante = "permanente" | "temporal";

const estilos = {
  permanente: {
    panel: "bg-brand-950 text-white",
    encabezado: "text-white",
    icono: "bg-white/10 text-uncp-gold",
    descripcion: "text-white/60",
    contador: "bg-white/10 text-white/80",
    divisor: "divide-white/10 border-white/10",
    fila: "hover:bg-white/5",
    titulo: "text-white group-hover:text-uncp-gold",
    resumen: "text-white/60",
    miniatura: "bg-white/10",
    flecha: "text-white/30 group-hover:text-uncp-gold",
  },
  temporal: {
    panel: "bg-surface-warm text-brand-950 ring-1 ring-inset ring-gold-200",
    encabezado: "text-brand-950",
    icono: "bg-gold-100 text-gold-700",
    descripcion: "text-brand-950/60",
    contador: "bg-gold-100 text-gold-800",
    divisor: "divide-gold-200 border-gold-200",
    fila: "hover:bg-gold-100/60",
    titulo: "text-brand-950 group-hover:text-brand-600",
    resumen: "text-brand-950/60",
    miniatura: "bg-gold-100",
    flecha: "text-brand-950/30 group-hover:text-brand-600",
  },
} as const;

function Panel({
  variante,
  titulo,
  descripcion,
  icono,
  noticias,
  meta,
}: {
  variante: Variante;
  titulo: string;
  descripcion: string;
  icono: ReactNode;
  noticias: Noticia[];
  meta: (noticia: Noticia) => ReactNode;
}) {
  const e = estilos[variante];
  return (
    <div className={cn("flex flex-col rounded-lg p-5 sm:p-7", e.panel)}>
      <div className="mb-5 flex items-start gap-3">
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", e.icono)}>{icono}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className={cn("font-serif text-xl font-black leading-tight", e.encabezado)}>{titulo}</h3>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-black", e.contador)}>{noticias.length}</span>
          </div>
          <p className={cn("mt-0.5 text-sm", e.descripcion)}>{descripcion}</p>
        </div>
      </div>

      <ul className={cn("divide-y border-t", e.divisor)}>
        {noticias.map((noticia) => (
          <li key={noticia.id}>
            <Link
              href={`/noticias/${noticia.slug}`}
              className={cn("group -mx-2 flex items-center gap-4 rounded-md px-2 py-4 transition-colors", e.fila)}
            >
              <div className={cn("relative h-16 w-16 shrink-0 overflow-hidden rounded-md", e.miniatura)}>
                {noticia.imagen_url ? (
                  <UnoptImage
                    src={getStorageUrl(noticia.imagen_url)}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 opacity-40" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1">{meta(noticia)}</div>
                <h4 className={cn("line-clamp-2 font-bold leading-snug transition-colors", e.titulo)}>{noticia.titulo}</h4>
                {noticia.resumen && (
                  <p className={cn("mt-1 line-clamp-1 text-sm", e.resumen)}>{noticia.resumen}</p>
                )}
              </div>
              <ChevronRight className={cn("h-5 w-5 shrink-0 transition-all group-hover:translate-x-0.5", e.flecha)} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ComunicadosPanel({
  permanentes,
  temporales,
  hoy = new Date(),
}: {
  permanentes: Noticia[];
  temporales: Noticia[];
  hoy?: Date;
}) {
  if (permanentes.length === 0 && temporales.length === 0) return null;
  const ambos = permanentes.length > 0 && temporales.length > 0;

  return (
    <div className="mb-14 sm:mb-20">
      <div className="mb-6 border-b border-border pb-5 sm:mb-8 sm:pb-6">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-uncp-gold mb-2 block">
          Información Oficial
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-black text-brand-950 leading-tight">
          Comunicados
        </h2>
      </div>

      <div className={cn("grid grid-cols-1 gap-6", ambos && "lg:grid-cols-2")}>
        {permanentes.length > 0 && (
          <Panel
            variante="permanente"
            titulo="Información Importante"
            descripcion="Lo que siempre debes tener a mano."
            icono={<Pin className="h-5 w-5" />}
            noticias={permanentes}
            meta={(n) => (
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">{n.fecha_humana}</span>
            )}
          />
        )}

        {temporales.length > 0 && (
          <Panel
            variante="temporal"
            titulo="Avisos"
            descripcion="Vigentes por tiempo limitado."
            icono={<Clock className="h-5 w-5" />}
            noticias={temporales}
            meta={(n) => {
              const dias = diasRestantes(n, hoy);
              return (
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-gold-800"
                  title={`Vigente hasta el ${formatoVigencia.format(venceEl(n))}`}
                >
                  <Clock className="h-3 w-3" />
                  {dias === 1 ? "Último día" : `Quedan ${dias} días`}
                </span>
              );
            }}
          />
        )}
      </div>
    </div>
  );
}
