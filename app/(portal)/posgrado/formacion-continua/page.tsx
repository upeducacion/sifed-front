import PageHero from "@/components/ui/page-hero";
import ProgramGrid from "@/components/posgrado/program-grid";
import { programasApi, mapToProgramData } from "@/lib/api/programas";
import { ProgramData } from "@/types/programa";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formación Continua | Posgrado UNCP",
  description: "Cursos y talleres de actualización profesional para potenciar tus habilidades educativas.",
};



export default async function FormacionContinuaPage() {
  let formacionContinua: ProgramData[] = [];
  try {
    const rawCursos = await programasApi.getPublicAll({ tipo: "curso" });
    const rawTalleres = await programasApi.getPublicAll({ tipo: "taller" });
    formacionContinua = [...rawCursos, ...rawTalleres].map(mapToProgramData);
  } catch (error) {
    console.error("Error fetching formacion continua:", error);
  }

  return (
    <>
      <PageHero
        title="FORMACIÓN CONTINUA"
        subtitle="POSTGRADO UNCP"
        description="Cursos y talleres enfocados en brindarte las herramientas más modernas para tu desarrollo profesional."
        imageSrc="/images/fondouncp1920x1080.webp"
        size="compact"
        align="center"
        breadcrumbs={[
          { label: "Posgrado", href: "/posgrado" },
          { label: "Formación Continua" }
        ]}
      />

      <ProgramGrid 
        programs={formacionContinua} 
        type="curso" 
      />
    </>
  );
}
