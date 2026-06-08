import PageHero from "@/components/ui/page-hero";
import ProgramGrid from "@/components/posgrado/program-grid";
import { programasApi, mapToProgramData } from "@/lib/api/programas";
import { ProgramData } from "@/types/programa";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maestrías en Educación | Posgrado UNCP",
  description: "Explora nuestras maestrías en Gestión, Educación Superior, Psicología y Enseñanza Estratégica.",
};



export default async function MaestríasPage() {
  let maestrias: ProgramData[] = [];
  try {
    const rawPrograms = await programasApi.getPublicAll({ tipo: "maestria" });
    maestrias = rawPrograms.map(mapToProgramData);
  } catch (error) {
    console.error("Error fetching maestrías:", error);
  }

  return (
    <>
      <PageHero
        title="MAESTRÍAS EN EDUCACIÓN"
        subtitle="POSTGRADO UNCP"
        description="Programas de alto nivel académico diseñados para formar líderes en la gestión, investigación e innovación pedagógica."
        imageSrc="/images/fondouncp1920x1080.webp"
        size="compact"
        align="center"
        breadcrumbs={[
          { label: "Posgrado", href: "/posgrado" },
          { label: "Maestrías" }
        ]}
      />

      <ProgramGrid 
        programs={maestrias} 
        type="maestria" 
      />
    </>
  );
}
