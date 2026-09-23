import { ViewTransition, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getGroup, procedureGroups, proceduresInGroup, type CatalogProcedure } from "@/lib/tramites/catalog";
import { StepBadge } from "./procedure-nav";
import MesaDePartesCallout from "./mesa-de-partes-callout";

const stagger = (index: number) => ({ "--i": index }) as CSSProperties;

function MorphTitle({ procedure, className }: Readonly<{ procedure: CatalogProcedure; className: string }>) {
  return (
    <ViewTransition name={`tramite-title-${procedure.slug}`} share="morph" default="none">
      <span className={className}>{procedure.title}</span>
    </ViewTransition>
  );
}

function GradoPath() {
  const group = getGroup("grado");
  const steps = proceduresInGroup("grado");

  return (
    <section aria-labelledby="grupo-grado" className="tramite-rise relative overflow-hidden rounded-lg bg-brand-950 p-5 text-white shadow-lg sm:p-8" style={stagger(0)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_0%,color-mix(in_srgb,var(--color-gold-500)_18%,transparent),transparent_40%)]" aria-hidden="true" />
      <div className="relative">
        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-uncp-gold">Paso a paso</span>
        <h2 id="grupo-grado" className="mt-2 font-serif text-2xl font-black text-white sm:text-3xl">{group.title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-50">{group.description}</p>

        <ol className="mt-6 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((procedure, index) => (
            <li key={procedure.slug} className="tramite-rise" style={stagger(index + 1)}>
              <Link
                href={`/tramites/${procedure.slug}`}
                transitionTypes={["nav-forward"]}
                className="group flex h-full items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-uncp-gold/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uncp-gold active:translate-y-0"
              >
                <StepBadge procedure={procedure} className={procedure.step?.optional ? "border-dashed border-brand-300 bg-transparent text-brand-50" : "border-uncp-gold bg-uncp-gold text-brand-950 transition-transform duration-300 group-hover:scale-110"} />
                <span className="min-w-0 flex-1">
                  <MorphTitle procedure={procedure} className="block text-sm font-bold leading-snug" />
                  {procedure.step?.optional && <span className="mt-1.5 inline-block rounded-full border border-dashed border-brand-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-50">Opcional · {procedure.step.optional.toLowerCase()}</span>}
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-brand-300 transition duration-300 group-hover:translate-x-1 group-hover:text-uncp-gold" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function TramitesOverview() {
  const otherGroups = procedureGroups.filter((group) => group.id !== "grado");

  return (
    <div className="space-y-5 sm:space-y-6">
      <GradoPath />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {otherGroups.map((group, groupIndex) => {
          const GroupIcon = group.icon;
          return (
            <section key={group.id} aria-labelledby={`grupo-${group.id}`} className="tramite-rise flex flex-col rounded-lg border border-brand-50 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6" style={stagger(groupIndex + 3)}>
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-950 text-uncp-gold">
                  <GroupIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 id={`grupo-${group.id}`} className="font-serif text-xl font-black leading-tight">{group.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{group.description}</p>
                </div>
              </div>
              <ul className="mt-5 space-y-1 border-t border-brand-50 pt-3">
                {proceduresInGroup(group.id).map((procedure) => {
                  const Icon = procedure.icon;
                  return (
                    <li key={procedure.slug}>
                      <Link
                        href={`/tramites/${procedure.slug}`}
                        transitionTypes={["nav-forward"]}
                        className="group -mx-2 flex items-start gap-3 rounded-lg p-2 transition-colors duration-200 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uncp-gold"
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 transition-transform duration-300 group-hover:scale-110 group-hover:text-brand-800" aria-hidden="true" />
                        <span className="min-w-0 flex-1">
                          <MorphTitle procedure={procedure} className="block text-sm font-bold text-brand-950" />
                          <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{procedure.description}</span>
                        </span>
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-300 transition duration-300 group-hover:translate-x-1 group-hover:text-brand-800" aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="tramite-rise" style={stagger(6)}><MesaDePartesCallout layout="banner" /></div>
    </div>
  );
}
