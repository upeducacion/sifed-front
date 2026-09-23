import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildRepositorioHref, type ParsedFiltros } from "@/lib/repositorio/params";
import NavLink from "@/components/portal/repositorio/nav-link";

function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

export default function Paginacion({
  filtros,
  currentPage,
  totalPages,
}: Readonly<{ filtros: ParsedFiltros; currentPage: number; totalPages: number }>) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Paginación de resultados" className="mt-10 flex items-center justify-center gap-1 border-t border-border pt-8">
      <NavLink
        href={buildRepositorioHref(filtros, { page: Math.max(1, currentPage - 1) })}
        aria-label="Página anterior"
        aria-disabled={currentPage === 1}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-muted",
          currentPage === 1 && "pointer-events-none opacity-30"
        )}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </NavLink>

      {pageNumbers(currentPage, totalPages).map((page, index) =>
        page === "…" ? (
          <span key={`ellipsis-${index}`} className="px-2 text-sm text-neutral-400">…</span>
        ) : (
          <NavLink
            key={page}
            href={buildRepositorioHref(filtros, { page })}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "flex h-10 min-w-10 items-center justify-center rounded-md px-2 text-sm tabular-nums transition-colors",
              page === currentPage ? "bg-brand-950 font-semibold text-white" : "text-neutral-600 hover:bg-muted"
            )}
          >
            {page}
          </NavLink>
        )
      )}

      <NavLink
        href={buildRepositorioHref(filtros, { page: Math.min(totalPages, currentPage + 1) })}
        aria-label="Página siguiente"
        aria-disabled={currentPage === totalPages}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-muted",
          currentPage === totalPages && "pointer-events-none opacity-30"
        )}
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </NavLink>
    </nav>
  );
}
