import { galeriasApi, GaleriaResponse } from "@/lib/api/galerias";
import GalleryContent from "@/components/portal/gallery/gallery-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galería de Fotos | Facultad de Educación UNCP",
  description: "Archivo visual de los eventos, investigación y vida institucional de la Facultad de Educación.",
};

export default async function GaleriaFotosPage() {
  // Fetch inicial en el servidor para SEO e ISR On-Demand
  // Esto quedará cacheado con el tag ['galerias'] definido en galeriasApi
  let initialData: GaleriaResponse = { data: [], current_page: 1, last_page: 1, total: 0 };
  
  try {
    initialData = await galeriasApi.getPublic({ per_page: 100 });
  } catch (error) {
    console.error("Error fetching initial gallery data:", error);
  }

  return <GalleryContent initialData={initialData} />;
}
