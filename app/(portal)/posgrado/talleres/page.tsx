import PageHero from "@/components/ui/page-hero";
import ProgramGrid from "@/components/posgrado/program-grid";
import { programasApi, mapToProgramData } from "@/lib/api/programas";
import { ProgramData } from "@/types/programa";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talleres Prácticos | Posgrado UNCP",
  description: "Talleres prácticos y aplicados para docentes e investigadores.",
};



export default async function TalleresPage() {
  let talleres: ProgramData[] = [];
  try {
    const rawPrograms = await programasApi.getPublicAll({ tipo: "taller" });
    talleres = rawPrograms.map(mapToProgramData);
  } catch (error) {
    console.error("Error fetching talleres:", error);
  }

  return (
    <>
      <PageHero
        title="TALLERES PRÁCTICOS"
        subtitle="POSTGRADO UNCP"
        description="Aprende haciendo. Talleres intensivos para aplicar directamente metodologías y estrategias en el aula."
        imageSrc="/images/fondouncp1920x1080.webp"
        size="compact"
        align="center"
        breadcrumbs={[
          { label: "Posgrado", href: "/posgrado" },
          { label: "Talleres" }
        ]}
      />

      <ProgramGrid 
        programs={talleres} 
        type="taller" 
      />
    </>
  );
}
