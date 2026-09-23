import DirectionalTransition from "@/components/tramites/directional-transition";
import TramiteHero from "@/components/tramites/tramite-hero";
import TramitesOverview from "@/components/tramites/tramites-overview";

export default function TramitesContent() {
  return (
    <main className="min-h-full flex-1 bg-parchment text-brand-950">
      <TramiteHero />
      <DirectionalTransition transitionKey="tramites">
        <section className="page-shell-wide py-5 sm:py-8 lg:py-12">
          <TramitesOverview />
        </section>
      </DirectionalTransition>
    </main>
  );
}
