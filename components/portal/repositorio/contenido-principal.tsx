import { BookX } from "lucide-react";
import { bibliotecaApi } from "@/lib/api/biblioteca";
import { buildFiltroChips, filtrosToApiParams, type ParsedFiltros } from "@/lib/repositorio/params";
import { TIPO_LABELS } from "@/lib/repositorio/tipos";
import NavLink from "@/components/portal/repositorio/nav-link";
import FiltrosPanel from "@/components/portal/repositorio/filtros-panel";
import FiltrosDrawer from "@/components/portal/repositorio/filtros-drawer";
import SortSelect from "@/components/portal/repositorio/sort-select";
import ResultadoRow from "@/components/portal/repositorio/resultado-row";
import Paginacion from "@/components/portal/repositorio/paginacion";

export function ContenidoPrincipalSkeleton() {
  return (
    <div className="page-shell-wide py-10 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="hidden animate-pulse space-y-6 lg:block">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 rounded bg-neutral-200" />
              {Array.from({ length: 4 }).map((__, j) => (
                <div key={j} className="h-3 w-full rounded bg-neutral-100" />
              ))}
            </div>
          ))}
        </div>
        <div className="animate-pulse">
          <div className="mb-6 h-4 w-40 rounded bg-neutral-200" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-b border-border py-6">
              <div className="mb-2 h-4 w-24 rounded-full bg-neutral-100" />
              <div className="mb-2 h-5 w-2/3 rounded bg-neutral-200" />
              <div className="mb-1 h-3 w-1/2 rounded bg-neutral-100" />
              <div className="h-3 w-full max-w-lg rounded bg-neutral-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ContenidoPrincipal({ filtros }: Readonly<{ filtros: ParsedFiltros }>) {
  const data = await bibliotecaApi.getPublic(filtrosToApiParams(filtros));
  const { recursos, facets, categorias } = data;

  const categoriaLabel = filtros.categoriaId
    ? categorias.find((c) => String(c.id) === filtros.categoriaId)?.nombre
    : undefined;
  const programaLabel = filtros.programaId
    ? facets.programa.find((p) => String(p.id) === filtros.programaId)?.titulo
    : undefined;

  const chips = buildFiltroChips(filtros, {
    tipoLabels: TIPO_LABELS,
    categoriaLabel,
    programaLabel,
  });

  const total = recursos.total;
  const resultLabel = total === 1 ? "1 resultado" : `${total.toLocaleString("es-PE")} resultados`;

  return (
    <div className="page-shell-wide py-10 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <aside aria-label="Filtros" className="hidden min-w-0 lg:sticky lg:top-24 lg:block">
          <FiltrosPanel facets={facets} filtros={filtros} mode="instant" />
        </aside>

        <main>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FiltrosDrawer facets={facets} filtros={filtros} />
              <p aria-live="polite" className="text-[0.9rem] text-neutral-600">
                {filtros.q ? (
                  <>
                    {resultLabel} para <span className="font-medium text-neutral-900">&ldquo;{filtros.q}&rdquo;</span>
                  </>
                ) : (
                  resultLabel
                )}
              </p>
            </div>
            <SortSelect filtros={filtros} />
          </div>

          {chips.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <NavLink
                  key={chip.key}
                  href={chip.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-[13px] text-neutral-600 transition-colors hover:border-brand-300 hover:text-brand-700"
                >
                  {chip.label}
                  <span aria-hidden="true" className="text-neutral-400">×</span>
                </NavLink>
              ))}
              <NavLink
                href="/repositorio"
                className="text-[13px] font-medium text-brand-600 hover:text-brand-800 hover:underline"
              >
                Limpiar todo
              </NavLink>
            </div>
          )}

          {recursos.data.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
              <BookX className="mx-auto h-8 w-8 text-neutral-300" aria-hidden="true" />
              <h2 className="mt-4 font-serif text-lg font-semibold text-brand-950">No encontramos resultados</h2>
              <p className="mx-auto mt-2 max-w-sm text-[0.9rem] text-neutral-500">
                Prueba con otros términos o quita algunos filtros para ampliar la búsqueda.
              </p>
              <NavLink
                href="/repositorio"
                className="mt-5 inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-brand-950 transition-colors hover:bg-muted"
              >
                Limpiar filtros
              </NavLink>
            </div>
          ) : (
            <ol className="list-none">
              {recursos.data.map((recurso) => (
                <ResultadoRow key={recurso.id} recurso={recurso} />
              ))}
            </ol>
          )}

          <Paginacion filtros={filtros} currentPage={recursos.current_page} totalPages={recursos.last_page} />
        </main>
      </div>
    </div>
  );
}
