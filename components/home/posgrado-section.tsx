import { programasApi, Programa } from "@/lib/api/programas";
import { getStorageUrl } from "@/lib/utils";
import PosgradoFluid from "./posgrado-fluid";

interface ProgramaResumen {
  id: number;
  titulo: string;
  slug: string;
  tipo: string;
  imagen: string;
}

export default async function PosgradoSection() {
  let maestrias: ProgramaResumen[] = [];
  let doctorados: ProgramaResumen[] = [];

  try {
    const allPrograms: Programa[] = await programasApi.getPublicAll();

    maestrias = allPrograms
      .filter(p => p.tipo === "maestria")
      .map(p => ({
        id: p.id,
        titulo: p.titulo,
        slug: p.slug,
        tipo: p.tipo,
        // Traer la imagen real y procesarla con getStorageUrl
        imagen: p.imagen_portada_url ? getStorageUrl(p.imagen_portada_url) : "/images/portada.webp"
      }));

    doctorados = allPrograms
      .filter(p => p.tipo === "doctorado")
      .map(p => ({
        id: p.id,
        titulo: p.titulo,
        slug: p.slug,
        tipo: p.tipo,
        imagen: p.imagen_portada_url ? getStorageUrl(p.imagen_portada_url) : "/images/portada.webp"
      }));

  } catch (error) {
    console.error("Error fetching programs for PosgradoSection:", error);
  }

  return (
    <div className="relative">
      <PosgradoFluid
        maestrias={maestrias} 
        doctorados={doctorados}
      />
    </div>
  );
}

