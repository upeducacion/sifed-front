import { Suspense } from "react";
import type { Metadata } from "next";
import type { Coleccion } from "@/lib/api/biblioteca";
import { COLECCION_LABELS } from "@/lib/repositorio/tipos";
import { parseFiltros, filtrosSearchKey, type RawSearchParams } from "@/lib/repositorio/params";
import RepositorioHeroShell from "@/components/portal/repositorio/hero-shell";
import Stats, { ColeccionTabs, ColeccionTabsSkeleton, StatsSkeleton } from "@/components/portal/repositorio/stats-tabs";
import ContenidoPrincipal, { ContenidoPrincipalSkeleton } from "@/components/portal/repositorio/contenido-principal";
import { RepositorioTransitionProvider } from "@/components/portal/repositorio/transition-context";

interface RepositorioPageProps {
  searchParams: Promise<RawSearchParams>;
}

export async function generateMetadata({ searchParams }: RepositorioPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const filtros = parseFiltros(sp);
  const coleccion = filtros.coleccion as Coleccion | undefined;
  const label = coleccion ? COLECCION_LABELS[coleccion] : "Repositorio Institucional";

  return {
    title: `${label} | UP Educación UNCP`,
    description:
      "Tesis, artículos, libros y biblioteca virtual de la Unidad de Posgrado de la Facultad de Educación — Universidad Nacional del Centro del Perú.",
  };
}

export default async function RepositorioPage({ searchParams }: Readonly<RepositorioPageProps>) {
  const sp = await searchParams;
  const filtros = parseFiltros(sp);
  const searchKey = filtrosSearchKey(filtros);

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <RepositorioTransitionProvider>
        <RepositorioHeroShell
          coleccion={filtros.coleccion}
          filtros={filtros}
          statsSlot={
            <Suspense key={searchKey} fallback={<StatsSkeleton />}>
              <Stats filtros={filtros} />
            </Suspense>
          }
          tabsSlot={
            <Suspense key={searchKey} fallback={<ColeccionTabsSkeleton />}>
              <ColeccionTabs filtros={filtros} />
            </Suspense>
          }
        />

        <Suspense key={searchKey} fallback={<ContenidoPrincipalSkeleton />}>
          <ContenidoPrincipal filtros={filtros} />
        </Suspense>
      </RepositorioTransitionProvider>
    </div>
  );
}
