import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocumentosSearch from "@/components/home/documentos-search";
import DirectionalTransition from "@/components/tramites/directional-transition";
import MesaDePartesCallout from "@/components/tramites/mesa-de-partes-callout";
import ProcedureNav from "@/components/tramites/procedure-nav";
import TramiteHero from "@/components/tramites/tramite-hero";
import { TramiteDocuments, TramiteDocumentsSkeleton } from "@/components/tramites/tramite-documents";
import { GradoProgress, GradoStepPager, stepCaption } from "@/components/tramites/grado-step-nav";
import { getGroup, getProcedure, isProcedureSlug } from "@/lib/tramites/catalog";

type TramitePageProps = Readonly<{
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ search?: string }>;
}>;

export async function generateMetadata({ params }: TramitePageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isProcedureSlug(slug)) return {};
  const procedure = getProcedure(slug);
  return {
    title: `${procedure.title} | Facultad de Educación UNCP`,
    description: procedure.description,
  };
}

export default async function TramitePage({ params, searchParams }: TramitePageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  if (!isProcedureSlug(slug)) notFound();

  const search = typeof query.search === "string" ? query.search : "";
  const procedure = getProcedure(slug);

  return (
    <main className="min-h-full flex-1 bg-parchment text-brand-950">
      <TramiteHero procedure={procedure} />

      <section className="page-shell-wide grid gap-5 py-5 sm:gap-8 sm:py-8 lg:grid-cols-[19rem_minmax(0,1fr)] lg:py-12">
        <aside className="space-y-3 sm:space-y-4 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto">
          <ProcedureNav selectedSlug={slug} />
          <div className="hidden lg:block"><MesaDePartesCallout /></div>
        </aside>

        <DirectionalTransition transitionKey={slug}>
          <div className="min-w-0">
            <div id="documentos" className="mb-5 scroll-mt-24 rounded-lg border border-brand-50 bg-white p-4 shadow-sm sm:mb-6 sm:p-6 md:p-7 lg:scroll-mt-28">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-gold-700">{stepCaption(procedure) ?? getGroup(procedure.group).title}</span>
                  <h2 className="mt-2 font-serif text-2xl font-black md:text-3xl">Documentos del trámite</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Revisa los requisitos y descarga el modelo de solicitud.</p>
                </div>
                <div className="w-full md:max-w-xs">
                  <DocumentosSearch key={search} initialQuery={search} label="Buscar en este trámite" placeholder="Buscar por título" />
                </div>
              </div>
              {procedure.step && <GradoProgress slug={slug} />}
            </div>

            <Suspense key={slug} fallback={<TramiteDocumentsSkeleton />}>
              <TramiteDocuments slug={slug} search={search} />
            </Suspense>

            {procedure.step && <GradoStepPager slug={slug} />}
            <div className="mt-6 lg:hidden"><MesaDePartesCallout /></div>
          </div>
        </DirectionalTransition>
      </section>
    </main>
  );
}
