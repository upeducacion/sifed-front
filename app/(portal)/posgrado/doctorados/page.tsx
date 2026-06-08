import PageHero from "@/components/ui/page-hero";
import ProgramGrid from "@/components/posgrado/program-grid";
import { programasApi, mapToProgramData } from "@/lib/api/programas";
import { ProgramData } from "@/types/programa";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doctorado en Educación | Posgrado UNCP",
  description: "El máximo grado académico orientado a la investigación científica y producción académica de alto impacto.",
};



export default async function DoctoradosPage() {
  let doctorados: ProgramData[] = [];
  try {
    const rawPrograms = await programasApi.getPublicAll({ tipo: "doctorado" });
    doctorados = rawPrograms.map(mapToProgramData);
  } catch (error) {
    console.error("Error fetching doctorados:", error);
  }

  return (
    <>
      <PageHero
        title="DOCTORADO EN EDUCACIÓN"
        subtitle="POSTGRADO UNCP"
        description="Lidera investigaciones multidisciplinarias y diseña políticas públicas con rigor ético, científico y tecnológico."
        imageSrc="/images/fondouncp1920x1080.webp"
        size="compact"
        align="center"
        breadcrumbs={[
          { label: "Posgrado", href: "/posgrado" },
          { label: "Doctorados" }
        ]}
      />

      <ProgramGrid 
        programs={doctorados} 
        type="doctorado" 
      />
    </>
  );
}
