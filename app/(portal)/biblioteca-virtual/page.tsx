import { bibliotecaApi, PublicBibliotecaResponse } from "@/lib/api/biblioteca";
import BibliotecaContent from "@/components/portal/biblioteca/biblioteca-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biblioteca Virtual | Facultad de Educación UNCP",
  description: "Repositorio de recursos académicos seleccionados para fortalecer tu formación profesional de nuestra comunidad universitaria.",
};

export default async function BibliotecaVirtualPage() {
  // Fetch inicial en el servidor para SEO e ISR On-Demand
  // Esto quedará cacheado con el tag ['biblioteca'] definido en bibliotecaApi
  let initialData: PublicBibliotecaResponse = { recursos: { data: [], current_page: 1, last_page: 1, total: 0 }, categorias: [] };
  
  try {
    initialData = await bibliotecaApi.getPublic();
  } catch (error) {
    console.error("Error fetching initial library data:", error);
  }

  return <BibliotecaContent initialData={initialData} />;
}
