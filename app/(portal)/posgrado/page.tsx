import PageHero from "@/components/ui/page-hero";
import PosgradoCTA from "@/components/posgrado/posgrado-cta";
import { GraduationCap, BookOpen, Users, FileText, Award, Zap, Building } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Unidad de Posgrado | Facultad de Educación - UNCP",
  description: "Lideramos la educación de posgrado en la región con un enfoque en la investigación científica y la calidad académica internacional.",
};

export default function PosgradoPage() {
  return (
    <>
      <PageHero 
        title="POSGRADO"
        subtitle="EXCELENCIA EN"
        description="Formamos investigadores y líderes educativos con los más altos estándares científicos y compromiso social en la región central del país."
        imageSrc="/images/fondouncp1920x1080.webp"
        breadcrumbs={[
          { label: "Posgrado" }
        ]}
        actions={[
          { 
            label: "Maestrías", 
            href: "/posgrado/maestrias", 
            variant: "primary",
            icon: <BookOpen className="w-4 h-4" />
          },
          { 
            label: "Doctorados", 
            href: "/posgrado/doctorados", 
            variant: "primary",
            icon: <GraduationCap className="w-4 h-4" />
          },
          { 
            label: "Diplomados", 
            href: "/posgrado/diplomados", 
            variant: "primary",
            icon: <Award className="w-4 h-4" />
          },
          { 
            label: "Formación Continua", 
            href: "/posgrado/formacion-continua", 
            variant: "primary",
            icon: <Zap className="w-4 h-4" />
          },
          { 
            label: "Admisión", 
            href: "/posgrado/admision", 
            variant: "secondary",
            icon: <FileText className="w-4 h-4" />
          },
          { 
            label: "Plana Docente", 
            href: "/posgrado/plana-docente", 
            variant: "secondary",
            icon: <Users className="w-4 h-4" />
          }
        ]}
      />

      {/* CTA Institucional (Reemplaza la Identidad estática) */}
      <section className="bg-brand-50 border-y border-border py-12">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl md:text-2xl font-serif font-black text-brand-950 mb-2">Conoce a la Unidad de Posgrado</h2>
            <p className="text-sm text-muted-foreground font-medium">Descubre nuestra historia, misión, visión y al equipo directivo que lidera la excelencia académica.</p>
          </div>
          <Link href="/posgrado/nosotros" className="shrink-0 inline-flex items-center gap-2 bg-white border border-brand-200 text-brand-700 px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow-md hover:border-uncp-gold transition-all">
            <Building className="h-4 w-4" />
            Identidad Institucional
          </Link>
        </div>
      </section>

      <PosgradoCTA />
    </>
  );
}
