"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { buildRepositorioHref, type ParsedFiltros } from "@/lib/repositorio/params";
import { useRepositorioNav } from "@/components/portal/repositorio/transition-context";

/**
 * Formulario de búsqueda real (funciona sin JS vía GET a /repositorio) que además
 * se comporta como filtro en vivo: cada tecleo dispara una navegación debounced
 * (300ms) dentro de la transición compartida; Enter/click en "Buscar" navega al toque.
 */
export default function SearchInput({ filtros }: Readonly<{ filtros: ParsedFiltros }>) {
  const { navigate } = useRepositorioNav();
  const [value, setValue] = useState(filtros.q);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reconcilia con `filtros.q` (navegación externa) ajustando el estado en el
  // propio render, en vez de un efecto — evita el re-render en cascada.
  const [prevQ, setPrevQ] = useState(filtros.q);
  if (filtros.q !== prevQ) {
    setPrevQ(filtros.q);
    setValue(filtros.q);
  }

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const commitNow = (q: string) => {
    if (timer.current) clearTimeout(timer.current);
    navigate(buildRepositorioHref(filtros, { q: q || undefined }));
  };

  return (
    <form
      role="search"
      method="GET"
      action="/repositorio"
      onSubmit={(e) => {
        e.preventDefault();
        commitNow(value);
      }}
      className="mt-8 flex w-full max-w-2xl items-center gap-1 rounded-lg border border-white/15 bg-white/[0.06] p-1.5 transition-colors focus-within:border-uncp-gold/50"
    >
      <label htmlFor="repositorio-q" className="sr-only">
        Buscar en el repositorio
      </label>
      <Search className="ml-2.5 h-4 w-4 shrink-0 text-brand-300" aria-hidden="true" />
      <input
        id="repositorio-q"
        name="q"
        type="search"
        value={value}
        onChange={(e) => {
          const next = e.target.value;
          setValue(next);
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => commitNow(next), 300);
        }}
        placeholder="Buscar por título, autor o palabra clave…"
        className="h-12 min-w-0 flex-1 bg-transparent px-2 text-[0.95rem] text-white outline-none placeholder:text-brand-300/70 sm:h-14"
      />
      {filtros.coleccion && <input type="hidden" name="coleccion" value={filtros.coleccion} />}
      {filtros.tipos.length > 0 && <input type="hidden" name="tipo" value={filtros.tipos.join(",")} />}
      {filtros.categoriaId && <input type="hidden" name="categoria_id" value={filtros.categoriaId} />}
      {filtros.programaId && <input type="hidden" name="programa_id" value={filtros.programaId} />}
      {filtros.anioDesde && <input type="hidden" name="anio_desde" value={filtros.anioDesde} />}
      {filtros.anioHasta && <input type="hidden" name="anio_hasta" value={filtros.anioHasta} />}
      {filtros.autor && <input type="hidden" name="autor" value={filtros.autor} />}
      <button
        type="submit"
        className="shrink-0 rounded-md bg-uncp-gold px-5 py-3 text-sm font-semibold text-brand-950 transition-colors hover:bg-gold-400"
      >
        Buscar
      </button>
    </form>
  );
}
