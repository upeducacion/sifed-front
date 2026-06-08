import PageHero from "@/components/ui/page-hero";
import ProgramGrid from "@/components/posgrado/program-grid";
import { programasApi, mapToProgramData } from "@/lib/api/programas";
import { ProgramData } from "@/types/programa";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cursos de Actualización | Posgrado UNCP",
  description: "Cursos cortos de actualización en nuevas metodologías y herramientas educativas.",
};



export default async function CursosPage() {
  let cursos: ProgramData[] = [];
  try {
    const rawPrograms = await programasApi.getPublicAll({ tipo: "curso" });
    cursos = rawPrograms.map(mapToProgramData);
  } catch (error) {
    console.error("Error fetching cursos:", error);
  }

  return (
    <>
      <PageHero
        title="CURSOS DE ACTUALIZACIÓN"
        subtitle="POSTGRADO UNCP"
        description="Cursos cortos y enfocados en brindarte las herramientas más modernas para tu desarrollo profesional."
        imageSrc="/images/fondouncp1920x1080.webp"
        size="compact"
        align="center"
        breadcrumbs={[
          { label: "Posgrado", href: "/posgrado" },
          { label: "Cursos" }
        ]}
      />

      <ProgramGrid 
        programs={cursos} 
        type="curso" 
      />
    </>
  );
}
