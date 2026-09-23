"use client";

import { useId, useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RepositorioFacets } from "@/lib/api/biblioteca";
import { buildRepositorioHref, contarFiltrosActivos, type ParsedFiltros } from "@/lib/repositorio/params";
import { useRepositorioNav } from "@/components/portal/repositorio/transition-context";

interface FiltrosPanelProps {
  facets: RepositorioFacets;
  filtros: ParsedFiltros;
  mode: "instant" | "batched";
  onApplied?: () => void;
}

interface PendingState {
  tipos: string[];
  categoriaId?: string;
  programaId?: string;
  anioDesde: string;
  anioHasta: string;
}

function toPending(filtros: ParsedFiltros): PendingState {
  return {
    tipos: filtros.tipos,
    categoriaId: filtros.categoriaId,
    programaId: filtros.programaId,
    anioDesde: filtros.anioDesde ?? "",
    anioHasta: filtros.anioHasta ?? "",
  };
}

const checkboxClass =
  "peer sr-only";
const checkboxVisual =
  "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-border-strong bg-white transition-colors peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/40";

function CheckOption({
  name,
  checked,
  onChange,
  label,
  count,
}: Readonly<{ name: string; checked: boolean; onChange: () => void; label: string; count: number }>) {
  return (
    <label className="flex min-h-11 w-full cursor-pointer items-start gap-2.5 rounded-md px-2 py-2.5 text-[0.9rem] leading-snug text-neutral-700 transition-colors hover:bg-muted">
      <span className="relative mt-0.5 flex items-center">
        <input type="checkbox" name={name} className={checkboxClass} checked={checked} onChange={onChange} />
        <span className={checkboxVisual} aria-hidden="true">
          {checked && (
            <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-none stroke-white stroke-[2.5]">
              <path d="M2 6.2 4.8 9 10 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </span>
      <span className="min-w-0 flex-1 text-pretty">{label}</span>
      <span className="mt-0.5 shrink-0 text-xs tabular-nums text-neutral-400">{count}</span>
    </label>
  );
}

function RadioOption({
  name,
  checked,
  onChange,
  label,
  count,
}: Readonly<{ name: string; checked: boolean; onChange: () => void; label: string; count?: number }>) {
  return (
    <label className="flex min-h-11 w-full cursor-pointer items-start gap-2.5 rounded-md px-2 py-2.5 text-[0.9rem] leading-snug text-neutral-700 transition-colors hover:bg-muted">
      <span className="relative mt-0.5 flex items-center">
        <input type="radio" name={name} className={checkboxClass} checked={checked} onChange={onChange} />
        <span
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border-strong bg-white transition-colors",
            checked && "border-brand-600"
          )}
          aria-hidden="true"
        >
          {checked && <span className="h-2 w-2 rounded-full bg-brand-600" />}
        </span>
      </span>
      <span className="min-w-0 flex-1 text-pretty">{label}</span>
      {count !== undefined && <span className="mt-0.5 shrink-0 text-xs tabular-nums text-neutral-400">{count}</span>}
    </label>
  );
}

function FacetGroup({
  title,
  children,
  defaultOpen = true,
}: Readonly<{ title: string; children: React.ReactNode; defaultOpen?: boolean }>) {
  return (
    <details open={defaultOpen} className="group border-b border-border pb-4 last:border-0 last:pb-0">
      <summary className="flex cursor-pointer list-none items-center justify-between py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500 [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="details-reveal mt-3">{children}</div>
    </details>
  );
}

function TopN<T>({ items, render, limit = 5 }: Readonly<{ items: T[]; render: (item: T) => React.ReactNode; limit?: number }>) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, limit);
  const hidden = items.length - limit;
  return (
    <div className="space-y-0.5">
      {visible.map(render)}
      {!expanded && hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-1 px-1 text-[0.8125rem] text-brand-600 hover:text-brand-800 hover:underline"
        >
          Ver {hidden} más
        </button>
      )}
    </div>
  );
}

export default function FiltrosPanel({ facets, filtros, mode, onApplied }: Readonly<FiltrosPanelProps>) {
  const { navigate } = useRepositorioNav();
  const [pending, setPending] = useState<PendingState>(() => toPending(filtros));
  // Reconcilia el estado local con los filtros de la URL cuando cambian (navegación
  // externa, atrás/adelante) sin pasar por un efecto: se ajusta en el propio render,
  // el patrón recomendado por React para "derivar estado de props".
  const [prevFiltros, setPrevFiltros] = useState(filtros);
  if (filtros !== prevFiltros) {
    setPrevFiltros(filtros);
    setPending(toPending(filtros));
  }
  const uid = useId();

  const commit = (next: PendingState) => {
    const href = buildRepositorioHref(filtros, {
      tipos: next.tipos,
      categoriaId: next.categoriaId,
      programaId: next.programaId,
      anioDesde: next.anioDesde || undefined,
      anioHasta: next.anioHasta || undefined,
    });
    navigate(href);
    onApplied?.();
  };

  const update = (patch: Partial<PendingState>) => {
    const next = { ...pending, ...patch };
    setPending(next);
    if (mode === "instant") commit(next);
  };

  const toggleTipo = (value: string) => {
    const tipos = pending.tipos.includes(value)
      ? pending.tipos.filter((t) => t !== value)
      : [...pending.tipos, value];
    update({ tipos });
  };

  const limpiar = () => {
    const cleared: PendingState = { tipos: [], categoriaId: undefined, programaId: undefined, anioDesde: "", anioHasta: "" };
    setPending(cleared);
    commit(cleared);
  };

  const currentYear = new Date().getFullYear();
  const activos = contarFiltrosActivos({ ...filtros, ...pending, q: filtros.q, sort: filtros.sort, page: filtros.page });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-semibold text-neutral-900">Filtrar por</h2>
        {activos > 0 && (
          <button type="button" onClick={limpiar} className="inline-flex items-center gap-1 text-[0.8125rem] text-brand-600 hover:text-brand-800">
            <RotateCcw className="h-3 w-3" aria-hidden="true" /> Limpiar
          </button>
        )}
      </div>

      <FacetGroup title="Tipo de documento">
        {facets.tipo.length === 0 ? (
          <p className="text-[0.8125rem] text-neutral-400">Sin datos disponibles.</p>
        ) : (
          <TopN
            items={facets.tipo}
            render={(opt) => (
              <CheckOption
                key={opt.value}
                name={`${uid}-tipo`}
                checked={pending.tipos.includes(opt.value)}
                onChange={() => toggleTipo(opt.value)}
                label={opt.label}
                count={opt.count}
              />
            )}
          />
        )}
      </FacetGroup>

      <FacetGroup title="Año de publicación">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label htmlFor={`${uid}-anio-desde`} className="sr-only">Año desde</label>
              <input
                id={`${uid}-anio-desde`}
                type="number"
                inputMode="numeric"
                placeholder="Desde"
                value={pending.anioDesde}
                onChange={(e) => update({ anioDesde: e.target.value })}
                className="w-full rounded-md border border-border bg-white px-2.5 py-1.5 text-[0.9rem] tabular-nums text-neutral-700 outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
              />
            </div>
            <span className="text-neutral-400" aria-hidden="true">–</span>
            <div className="flex-1">
              <label htmlFor={`${uid}-anio-hasta`} className="sr-only">Año hasta</label>
              <input
                id={`${uid}-anio-hasta`}
                type="number"
                inputMode="numeric"
                placeholder="Hasta"
                value={pending.anioHasta}
                onChange={(e) => update({ anioHasta: e.target.value })}
                className="w-full rounded-md border border-border bg-white px-2.5 py-1.5 text-[0.9rem] tabular-nums text-neutral-700 outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => update({ anioDesde: String(currentYear - 4), anioHasta: String(currentYear) })}
            className="rounded-md border border-border px-3 py-1 text-[0.8125rem] text-neutral-500 transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            Últimos 5 años
          </button>
        </div>
      </FacetGroup>

      {facets.programa.length > 0 && (
        <FacetGroup title="Programa">
          <fieldset className="min-w-0 space-y-0.5">
            <legend className="sr-only">Filtrar por programa</legend>
            <RadioOption name={`${uid}-programa`} checked={!pending.programaId} onChange={() => update({ programaId: undefined })} label="Todos" />
            <TopN
              items={facets.programa}
              render={(opt) => (
                <RadioOption
                  key={opt.id}
                  name={`${uid}-programa`}
                  checked={pending.programaId === String(opt.id)}
                  onChange={() => update({ programaId: String(opt.id) })}
                  label={opt.titulo}
                  count={opt.count}
                />
              )}
            />
          </fieldset>
        </FacetGroup>
      )}

      {facets.categoria.length > 0 && (
        <FacetGroup title="Categoría / Materia">
          <fieldset className="min-w-0 space-y-0.5">
            <legend className="sr-only">Filtrar por categoría</legend>
            <RadioOption name={`${uid}-categoria`} checked={!pending.categoriaId} onChange={() => update({ categoriaId: undefined })} label="Todas" />
            <TopN
              items={facets.categoria}
              render={(opt) => (
                <RadioOption
                  key={opt.id}
                  name={`${uid}-categoria`}
                  checked={pending.categoriaId === String(opt.id)}
                  onChange={() => update({ categoriaId: String(opt.id) })}
                  label={opt.nombre}
                  count={opt.count}
                />
              )}
            />
          </fieldset>
        </FacetGroup>
      )}

      {mode === "batched" && (
        <div className="sticky bottom-0 -mx-4 flex gap-3 border-t border-border bg-white px-4 pb-1 pt-4">
          <button
            type="button"
            onClick={limpiar}
            className="flex-1 rounded-lg border border-border px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-muted"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={() => commit(pending)}
            className="flex-1 rounded-lg bg-brand-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            Aplicar filtros
          </button>
        </div>
      )}
    </div>
  );
}
