import Link from "next/link";
import { bibliotecaApi, type Coleccion } from "@/lib/api/biblioteca";
import { buildRepositorioHref, filtrosToApiParams, type ParsedFiltros } from "@/lib/repositorio/params";
import { COLECCION_LABELS } from "@/lib/repositorio/tipos";
import { cn } from "@/lib/utils";

function StatCell({ value, label }: Readonly<{ value: number | string; label: string }>) {
  return (
    <div className="p-4">
      <dt className="text-[11px] uppercase tracking-[0.08em] text-brand-300">{label}</dt>
      <dd className="mt-1 font-serif text-xl tabular-nums text-white">
        {typeof value === "number" ? value.toLocaleString("es-PE") : value}
      </dd>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-2 divide-x divide-y divide-white/10 rounded-md border border-white/10">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2 p-4">
          <div className="h-2.5 w-14 rounded bg-white/10" />
          <div className="h-6 w-10 rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export function ColeccionTabsSkeleton() {
  return (
    <div className="mt-6 flex animate-pulse gap-6 border-t border-white/10 pt-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-4 w-24 rounded bg-white/10" />
      ))}
    </div>
  );
}

/** Estadísticas del repositorio como grilla 2×2 con divisores hairline (columna derecha del hero en desktop). */
export default async function Stats({ filtros }: Readonly<{ filtros: ParsedFiltros }>) {
  const data = await bibliotecaApi.getPublic(filtrosToApiParams(filtros));
  const { stats } = data;

  return (
    <dl className="grid grid-cols-2 divide-x divide-y divide-white/10 rounded-md border border-white/10">
      <StatCell value={stats.total_obras} label="Obras" />
      <StatCell value={stats.total_autores} label="Autores" />
      <StatCell value={stats.total_descargas} label="Descargas" />
      <StatCell value={`${stats.anio_min}–${stats.anio_max}`} label="Cobertura" />
    </dl>
  );
}

/** Pestañas de colección (Todo / Investigación / Biblioteca), fila completa bajo el hero. */
export async function ColeccionTabs({ filtros }: Readonly<{ filtros: ParsedFiltros }>) {
  const data = await bibliotecaApi.getPublic(filtrosToApiParams(filtros));
  const { facets } = data;
  const totalTodo = facets.coleccion.reduce((acc, c) => acc + c.count, 0);

  const tabs: { value?: Coleccion; label: string; count: number }[] = [
    { value: undefined, label: "Todo", count: totalTodo },
    ...facets.coleccion.map((c) => ({
      value: c.value as Coleccion,
      label: COLECCION_LABELS[c.value as Coleccion] ?? c.label,
      count: c.count,
    })),
  ];

  return (
    <nav aria-label="Colección" className="mt-6 flex gap-6 overflow-x-auto border-t border-white/10 pt-4">
      {tabs.map((tab) => {
        const active = (filtros.coleccion ?? undefined) === tab.value;
        const href = buildRepositorioHref(filtros, { coleccion: tab.value, page: 1 });
        return (
          <Link
            key={tab.label}
            href={href}
            scroll={false}
            className={cn(
              "whitespace-nowrap border-b-2 pb-3 text-sm transition-colors",
              active ? "border-uncp-gold font-semibold text-white" : "border-transparent text-brand-300 hover:text-white"
            )}
          >
            {tab.label} <span className="ml-1 tabular-nums text-brand-400">{tab.count}</span>
          </Link>
        );
      })}
    </nav>
  );
}
