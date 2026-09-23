"use client";

import { useId } from "react";
import { buildRepositorioHref, type ParsedFiltros } from "@/lib/repositorio/params";
import { SORT_LABELS } from "@/lib/repositorio/tipos";
import { useRepositorioNav } from "@/components/portal/repositorio/transition-context";
import type { RepositorioSort } from "@/lib/api/biblioteca";

const BASE_OPTIONS: RepositorioSort[] = ["recientes", "antiguos", "titulo", "descargas"];

export default function SortSelect({ filtros }: Readonly<{ filtros: ParsedFiltros }>) {
  const { navigate } = useRepositorioNav();
  const id = useId();
  const options = filtros.q ? (["relevancia", ...BASE_OPTIONS] as RepositorioSort[]) : BASE_OPTIONS;

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-[13px] text-neutral-500">
        Ordenar por
      </label>
      <select
        id={id}
        value={filtros.sort}
        onChange={(e) => navigate(buildRepositorioHref(filtros, { sort: e.target.value as RepositorioSort }))}
        className="rounded-md border border-border bg-white px-2.5 py-1.5 text-[0.9rem] text-neutral-800 outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
      >
        {options.map((value) => (
          <option key={value} value={value}>
            {SORT_LABELS[value]}
          </option>
        ))}
      </select>
    </div>
  );
}
