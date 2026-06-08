import PageHero from "@/components/ui/page-hero";
import { BookOpen, GraduationCap, Award, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { UnoptImage } from "@/components/ui/unopt-image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oferta Académica | Posgrado Educación UNCP",
  description: "Conoce todos nuestros programas: Maestrías, Doctorados, Diplomados y Cursos de Especialización.",
};

const programCategories = [
  {
    title: "Maestrías",
    desc: "4 menciones especializadas para el desarrollo profesional y la investigación pedagógica.",
    icon: <BookOpen className="w-8 h-8" />,
    href: "/posgrado/maestrias",
    image: "/images/portada-2.webp",
    stats: "4 Menciones"
  },
  {
    title: "Doctorados",
    desc: "Formación científica de alto nivel orientada a la producción de conocimiento original.",
    icon: <GraduationCap className="w-8 h-8" />,
    href: "/posgrado/doctorados",
    image: "/images/portada-3.webp",
    stats: "1 Programa"
  },
  {
    title: "Diplomados",
    desc: "Programas de actualización profesional de corta duración.",
    icon: <Award className="w-8 h-8" />,
    href: "/posgrado/diplomados",
    image: "/images/portada-4.webp",
    stats: "Especialización"
  },
  {
    title: "Formación Continua",
    desc: "Capacitación continua en herramientas digitales y nuevas metodologías.",
    icon: <Zap className="w-8 h-8" />,
    href: "/posgrado/formacion-continua",
    image: "/images/portada-5.webp",
    stats: "Cursos y Talleres"
  }
];

export default function ProgramasHubPage() {
  return (
    <>
      <PageHero
        title="OFERTA ACADÉMICA"
        subtitle="POSTGRADO EDUCACIÓN"
        description="Explora los diferentes niveles de formación que ofrecemos para potenciar tu carrera profesional."
        imageSrc="/images/fondouncp1920x1080.webp"
        size="compact"
        align="center"
        breadcrumbs={[
          { label: "Posgrado", href: "/posgrado" },
          { label: "Programas" }
        ]}
      />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {programCategories.map((cat) => (
              <Link 
                key={cat.title} 
                href={cat.href}
                className="group relative h-[350px] md:h-[400px] overflow-hidden rounded-[2.5rem] flex flex-col justify-end p-8 md:p-12 transition-all duration-700 hover:shadow-2xl shadow-xl"
              >
                {/* Background Image with Overlays */}
                <UnoptImage 
                  src={cat.image} 
                  alt={cat.title} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/60 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-0 bg-brand-950/20 group-hover:bg-transparent transition-colors duration-500" />

                {/* Top Badge */}
                <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-500 group-hover:bg-uncp-gold group-hover:text-brand-950 group-hover:border-uncp-gold">
                    {cat.icon}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-uncp-gold">
                    {cat.stats}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h2 className="font-serif text-3xl md:text-4xl font-black text-white mb-3 leading-tight tracking-tighter transition-transform duration-500 group-hover:-translate-y-1">
                    {cat.title}
                  </h2>
                  <p className="text-sm md:text-base text-white/90 line-clamp-2 max-w-md mb-6 font-medium transition-transform duration-500 group-hover:-translate-y-1">
                    {cat.desc}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-uncp-gold transition-transform duration-500 group-hover:translate-x-2">
                    Explorar <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Corner Decoration */}
                <div className="absolute -bottom-12 -right-12 opacity-5 text-white transition-transform duration-1000 group-hover:scale-150 group-hover:-rotate-12">
                  {cat.icon}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
