import Link from "next/link";
import type { ReactNode } from "react";
import type { Coleccion } from "@/lib/api/biblioteca";
import { COLECCION_LABELS } from "@/lib/repositorio/tipos";
import SearchInput from "@/components/portal/repositorio/search-input";
import type { ParsedFiltros } from "@/lib/repositorio/params";

const DESCRIPTIONS: Record<"todo" | Coleccion, string> = {
  todo: "Tesis, artículos, libros y capítulos producidos en la Unidad de Posgrado, en un mismo lugar.",
  investigacion: "Tesis, artículos y ponencias de la producción científica del posgrado.",
  biblioteca: "Libros, guías e informes recomendados para tu formación de posgrado.",
};

/**
 * Parte estática de la cabecera (no depende de la búsqueda a la API): banda
 * brand-950, breadcrumb, título, descripción y el buscador. El bloque de
 * estadísticas + pestañas de colección se pinta debajo, dentro de Suspense.
 */
export default function RepositorioHeroShell({
  coleccion,
  filtros,
  statsSlot,
  tabsSlot,
}: Readonly<{ coleccion?: Coleccion; filtros: ParsedFiltros; statsSlot: ReactNode; tabsSlot: ReactNode }>) {
  const titulo = coleccion ? COLECCION_LABELS[coleccion] : "Repositorio Institucional";
  const descripcion = DESCRIPTIONS[coleccion ?? "todo"];

  return (
    <section className="relative overflow-hidden bg-brand-950 text-white">
      <div className="page-shell-wide relative pb-10 pt-8 sm:pb-14 sm:pt-10">
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-brand-300">
          <Link href="/" className="transition hover:text-white">Inicio</Link>
          <span aria-hidden="true">/</span>
          {coleccion ? (
            <Link href="/repositorio" className="transition hover:text-white">Repositorio</Link>
          ) : (
            <span className="text-brand-100" aria-current="page">Repositorio</span>
          )}
          {coleccion && <span aria-hidden="true">/</span>}
          {coleccion && <span className="text-brand-100" aria-current="page">{COLECCION_LABELS[coleccion]}</span>}
        </nav>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:gap-12">
          <div className="max-w-2xl">
            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gold-400">
              Repositorio Institucional · UP Educación UNCP
            </span>
            <h1 className="font-serif text-4xl font-bold leading-[1.05] text-white sm:text-5xl">{titulo}</h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-brand-100/80">{descripcion}</p>

            <SearchInput filtros={filtros} />
          </div>

          <div className="mt-9 lg:mt-0">{statsSlot}</div>
        </div>

        {tabsSlot}
      </div>
    </section>
  );
}
