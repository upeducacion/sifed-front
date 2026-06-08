import { docentesApi } from "@/lib/api/docentes";
import DocenteContent from "@/components/portal/posgrado/docente-content";
import PageHero from "@/components/ui/page-hero";
import { Metadata } from "next";
import { PaginatedDocentes } from "@/types/docente";

export const metadata: Metadata = {
  title: "Plana Docente | Facultad de Educación UNCP",
  description: "Contamos con un destacado equipo de profesionales dedicados a la formación de investigadores y líderes educativos.",
};

export default async function PlanaDocentePage() {
  // Fetch inicial en el servidor para SEO e ISR On-Demand
  // Esto quedará cacheado con el tag ['docentes'] definido en docentesApi
  let initialData: PaginatedDocentes = { 
    data: [], 
    current_page: 1, 
    last_page: 1, 
    total: 0, 
    per_page: 16,
    first_page_url: "",
    from: 1,
    last_page_url: "",
    next_page_url: null,
    path: "",
    prev_page_url: null,
    to: 1
  };
  
  try {
    initialData = await docentesApi.getPortalList({ per_page: 16 });
  } catch (error) {
    console.error("Error fetching initial docentes data:", error);
  }

  return (
    <>
      <PageHero
        title="PLANA DOCENTE"
        subtitle="EXCELENCIA ACADÉMICA"
        description="Contamos con un destacado equipo de profesionales dedicados a la formación de investigadores y líderes educativos."
        imageSrc="/images/portada-5.webp"
        size="compact"
        align="center"
        breadcrumbs={[
          { label: "Posgrado", href: "/posgrado" },
          { label: "Plana Docente" }
        ]}
      />

      <DocenteContent initialData={initialData} />
    </>
  );
}
