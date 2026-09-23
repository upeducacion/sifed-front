import type { Coleccion, RepositorioSearchParams, RepositorioSort } from "@/lib/api/biblioteca";

export type RawSearchParams = Record<string, string | string[] | undefined>;

export interface ParsedFiltros {
  q: string;
  coleccion?: Coleccion;
  tipos: string[];
  categoriaId?: string;
  programaId?: string;
  anioDesde?: string;
  anioHasta?: string;
  autor?: string;
  sort: RepositorioSort;
  page: number;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Lee los searchParams crudos de la URL y los normaliza en un objeto tipado. */
export function parseFiltros(sp: RawSearchParams): ParsedFiltros {
  const tipoRaw = first(sp.tipo);
  const coleccionRaw = first(sp.coleccion);
  const sortRaw = first(sp.sort);
  return {
    q: first(sp.q) ?? "",
    coleccion: coleccionRaw === "investigacion" || coleccionRaw === "biblioteca" ? coleccionRaw : undefined,
    tipos: tipoRaw ? tipoRaw.split(",").filter(Boolean) : [],
    categoriaId: first(sp.categoria_id),
    programaId: first(sp.programa_id),
    anioDesde: first(sp.anio_desde),
    anioHasta: first(sp.anio_hasta),
    autor: first(sp.autor),
    sort: (sortRaw as RepositorioSort) || "recientes",
    page: Math.max(1, Number(first(sp.page)) || 1),
  };
}

/** Convierte los filtros normalizados en los params que espera la API. */
export function filtrosToApiParams(filtros: ParsedFiltros, perPage = 12): RepositorioSearchParams {
  return {
    q: filtros.q || undefined,
    coleccion: filtros.coleccion,
    tipo: filtros.tipos.length ? filtros.tipos.join(",") : undefined,
    categoria_id: filtros.categoriaId,
    programa_id: filtros.programaId,
    anio_desde: filtros.anioDesde,
    anio_hasta: filtros.anioHasta,
    autor: filtros.autor,
    sort: filtros.sort,
    page: filtros.page,
    per_page: perPage,
  };
}

/** Clave estable para forzar el remount del Suspense boundary cuando cambian los filtros. */
export function filtrosSearchKey(filtros: ParsedFiltros): string {
  return JSON.stringify(filtros);
}

export type FiltrosOverride = Partial<{
  q: string;
  coleccion: Coleccion | undefined;
  tipos: string[];
  categoriaId: string | undefined;
  programaId: string | undefined;
  anioDesde: string | undefined;
  anioHasta: string | undefined;
  autor: string | undefined;
  sort: RepositorioSort;
  page: number;
}>;

/**
 * Construye la URL de /repositorio aplicando cambios sobre los filtros actuales.
 * Por defecto, cualquier cambio reinicia la página a 1 (excepto si `page` viene explícito).
 */
export function buildRepositorioHref(filtros: ParsedFiltros, overrides: FiltrosOverride): string {
  const merged = { ...filtros, ...overrides };
  const next: Record<string, string> = {};

  if (merged.q) next.q = merged.q;
  if (merged.coleccion) next.coleccion = merged.coleccion;
  if (merged.tipos.length) next.tipo = merged.tipos.join(",");
  if (merged.categoriaId) next.categoria_id = merged.categoriaId;
  if (merged.programaId) next.programa_id = merged.programaId;
  if (merged.anioDesde) next.anio_desde = merged.anioDesde;
  if (merged.anioHasta) next.anio_hasta = merged.anioHasta;
  if (merged.autor) next.autor = merged.autor;
  if (merged.sort && merged.sort !== "recientes") next.sort = merged.sort;

  const page = overrides.page !== undefined ? overrides.page : 1;
  if (page > 1) next.page = String(page);

  const qs = new URLSearchParams(next).toString();
  return qs ? `/repositorio?${qs}` : "/repositorio";
}

export function contarFiltrosActivos(filtros: ParsedFiltros): number {
  let n = filtros.tipos.length;
  if (filtros.categoriaId) n += 1;
  if (filtros.programaId) n += 1;
  if (filtros.anioDesde || filtros.anioHasta) n += 1;
  if (filtros.autor) n += 1;
  return n;
}

export interface FiltroChip {
  key: string;
  label: string;
  href: string;
}

/** Genera los chips removibles de filtros activos (sin incluir `q`, que tiene su propio control). */
export function buildFiltroChips(
  filtros: ParsedFiltros,
  meta: {
    tipoLabels: Record<string, string>;
    categoriaLabel?: string;
    programaLabel?: string;
  }
): FiltroChip[] {
  const chips: FiltroChip[] = [];

  for (const tipo of filtros.tipos) {
    chips.push({
      key: `tipo-${tipo}`,
      label: meta.tipoLabels[tipo] ?? tipo,
      href: buildRepositorioHref(filtros, { tipos: filtros.tipos.filter((t) => t !== tipo) }),
    });
  }

  if (filtros.categoriaId && meta.categoriaLabel) {
    chips.push({
      key: "categoria",
      label: meta.categoriaLabel,
      href: buildRepositorioHref(filtros, { categoriaId: undefined }),
    });
  }

  if (filtros.programaId && meta.programaLabel) {
    chips.push({
      key: "programa",
      label: meta.programaLabel,
      href: buildRepositorioHref(filtros, { programaId: undefined }),
    });
  }

  if (filtros.anioDesde || filtros.anioHasta) {
    const label = `${filtros.anioDesde ?? "…"} – ${filtros.anioHasta ?? "…"}`;
    chips.push({
      key: "anio",
      label,
      href: buildRepositorioHref(filtros, { anioDesde: undefined, anioHasta: undefined }),
    });
  }

  if (filtros.autor) {
    chips.push({
      key: "autor",
      label: `Autor: ${filtros.autor}`,
      href: buildRepositorioHref(filtros, { autor: undefined }),
    });
  }

  return chips;
}
