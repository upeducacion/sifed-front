import ScrubReveal from "@/components/ui/scrub-reveal";

export default function StatementBand() {
  return (
    <section className="relative flex min-h-[70svh] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-brand-600 via-brand-800 to-brand-950 px-4 py-24 md:min-h-svh md:px-8">
      <ScrubReveal from={{ scale: 0.71, opacity: 0.81, y: 48 }} className="page-shell-wide text-center">
        <span className="mb-6 block text-[10px] font-black uppercase tracking-[0.4em] text-uncp-gold">
          Unidad de Posgrado · Facultad de Educación
        </span>
        <h2 className="mx-auto max-w-5xl font-serif text-[clamp(2.75rem,5.3vw,5rem)] font-black leading-[0.95] tracking-tighter text-white">
          Formamos líderes que <span className="text-uncp-gold">transforman</span> la educación
        </h2>
      </ScrubReveal>
    </section>
  );
}
