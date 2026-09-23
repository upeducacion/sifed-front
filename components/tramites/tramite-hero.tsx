import { ViewTransition } from "react";
import DirectionalTransition from "./directional-transition";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { getGroup, navTransition, type CatalogProcedure } from "@/lib/tramites/catalog";
import { stepCaption } from "./grado-step-nav";

export default function TramiteHero({ procedure }: Readonly<{ procedure?: CatalogProcedure }>) {
  const group = procedure ? getGroup(procedure.group) : null;
  const caption = procedure ? stepCaption(procedure) : null;

  return (
    <section className="relative overflow-hidden bg-brand-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,color-mix(in_srgb,var(--color-gold-500)_22%,transparent),transparent_32%),linear-gradient(120deg,var(--color-brand-950)_0%,var(--color-brand-800)_65%,var(--color-brand-600)_100%)]" />
      <div className="page-shell-wide relative pb-8 pt-5 sm:pb-12 sm:pt-8 lg:pb-16">
        <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 overflow-hidden text-[10px] font-bold uppercase tracking-[0.14em] text-brand-300 sm:mb-12 sm:text-xs sm:tracking-[0.16em]">
          <Link href="/" className="transition hover:text-uncp-gold">Inicio</Link>
          <span className="text-brand-600">/</span>
          {procedure
            ? <Link href="/tramites" transitionTypes={navTransition(procedure.slug, null)} className="transition hover:text-uncp-gold">Trámites</Link>
            : <span className="text-uncp-gold" aria-current="page">Trámites</span>}
          {group && <><span className="text-brand-600">/</span><span className="truncate text-uncp-gold" aria-current="page">{group.title}</span></>}
        </nav>

        <DirectionalTransition name="tramite-hero-copy" transitionKey={procedure?.slug ?? "tramites"}>
          <div className="max-w-4xl">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-uncp-gold">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              {group ? [group.title, caption].filter(Boolean).join(" · ") : "Atención académica · Posgrado"}
            </span>
            <ViewTransition name={`tramite-title-${procedure?.slug ?? "index"}`} share="morph" default="none">
              <h1 className="min-h-[2.04em] max-w-3xl font-serif text-3xl font-black leading-[1.02] text-white sm:text-4xl md:text-6xl">
                {procedure ? procedure.title : "Trámites académicos"}
              </h1>
            </ViewTransition>
            <p className="mt-4 min-h-[3.25em] max-w-2xl text-sm leading-relaxed text-brand-50 sm:mt-5 sm:text-base md:text-lg">
              {procedure?.description ?? "Encuentra el procedimiento que necesitas y descarga sus requisitos y modelos de solicitud desde un solo lugar."}
            </p>
          </div>
        </DirectionalTransition>
      </div>
    </section>
  );
}
