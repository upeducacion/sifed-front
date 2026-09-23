import { ViewTransition } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GRADO_TOTAL_STEPS, getAdjacentSteps, navTransition, proceduresInGroup, type Procedure, type ProcedureSlug } from "@/lib/tramites/catalog";

export function stepCaption(procedure: Procedure) {
  if (!procedure.step) return null;
  if (procedure.step.optional) return `Paso ${procedure.step.label} · opcional`;
  return `Paso ${procedure.step.label} de ${GRADO_TOTAL_STEPS}`;
}

export function GradoProgress({ slug }: Readonly<{ slug: ProcedureSlug }>) {
  const steps = proceduresInGroup("grado");
  const currentIndex = steps.findIndex((procedure) => procedure.slug === slug);

  return (
    <nav aria-label="Progreso en la ruta del grado" className="mt-5 border-t border-brand-50 pt-4">
      <ol className="flex items-center gap-1">
        {steps.map((procedure, index) => {
          const isCurrent = index === currentIndex;
          return (
            <li key={procedure.slug} className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Link
                href={`/tramites/${procedure.slug}`}
                transitionTypes={navTransition(slug, procedure.slug)}
                scroll={false}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Paso ${procedure.step?.label}: ${procedure.title}`}
                title={procedure.title}
                className={cn(
                  "relative block h-1.5 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uncp-gold",
                  index < currentIndex ? "bg-brand-800 hover:bg-brand-600" : "bg-brand-50 hover:bg-brand-300",
                  procedure.step?.optional && !isCurrent && "opacity-60"
                )}
              >
                {isCurrent && (
                  <ViewTransition name="grado-progress-current" share="morph" default="none">
                    <span className="absolute inset-0 rounded-full bg-uncp-gold" aria-hidden="true" />
                  </ViewTransition>
                )}
              </Link>
              <span className={cn("text-center text-[10px] font-black transition-colors", isCurrent ? "text-brand-950" : "text-muted-foreground")} aria-hidden="true">
                {procedure.step?.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function GradoStepPager({ slug }: Readonly<{ slug: ProcedureSlug }>) {
  const { previous, next } = getAdjacentSteps(slug);
  if (!previous && !next) return null;

  return (
    <nav aria-label="Pasos de la ruta del grado" className="mt-6 grid gap-3 sm:grid-cols-2">
      {previous ? (
        <Link href={`/tramites/${previous.slug}#documentos`} transitionTypes={["nav-back"]} className="group flex items-center gap-3 rounded-lg border border-brand-50 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uncp-gold active:translate-y-0">
          <ArrowLeft className="h-4 w-4 shrink-0 text-brand-300 transition group-hover:-translate-x-1 group-hover:text-brand-800" aria-hidden="true" />
          <span className="min-w-0">
            <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-gold-700">Paso anterior · {previous.step?.label}</span>
            <span className="mt-1 block truncate text-sm font-bold text-brand-950">{previous.title}</span>
          </span>
        </Link>
      ) : <span className="hidden sm:block" />}
      {next && (
        <Link href={`/tramites/${next.slug}#documentos`} transitionTypes={["nav-forward"]} className="group flex items-center justify-end gap-3 rounded-lg bg-brand-950 p-4 text-right text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uncp-gold active:translate-y-0">
          <span className="min-w-0">
            <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-uncp-gold">Siguiente paso · {next.step?.label}</span>
            <span className="mt-1 block truncate text-sm font-bold">{next.title}</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-uncp-gold transition group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}
