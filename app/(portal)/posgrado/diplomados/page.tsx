import PageHero from "@/components/ui/page-hero";
import ProgramGrid from "@/components/posgrado/program-grid";
import { programasApi, mapToProgramData } from "@/lib/api/programas";
import { ProgramData } from "@/types/programa";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diplomados en Educación | Posgrado UNCP",
  description: "Explora nuestros diplomados de especialización para potenciar tus habilidades educativas.",
};



export default async function DiplomadosPage() {
  let diplomados: ProgramData[] = [];
  try {
    const rawPrograms = await programasApi.getPublicAll({ tipo: "diplomado" });
    diplomados = rawPrograms.map(mapToProgramData);
  } catch (error) {
    console.error("Error fetching diplomados:", error);
  }

  return (
    <>
      <PageHero
        title="DIPLOMADOS EN EDUCACIÓN"
        subtitle="POSTGRADO UNCP"
        description="Programas de especialización diseñados para actualizar y potenciar tus competencias profesionales en el campo educativo."
        imageSrc="/images/fondouncp1920x1080.webp"
        size="compact"
        align="center"
        breadcrumbs={[
          { label: "Posgrado", href: "/posgrado" },
          { label: "Diplomados" }
        ]}
      />

      <ProgramGrid 
        programs={diplomados} 
        type="diplomado" 
      />
    </>
  );
}
