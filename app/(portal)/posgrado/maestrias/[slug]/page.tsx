import { programasApi, mapToProgramData, Programa } from "@/lib/api/programas";
import ProgramDetailLayout from "@/components/posgrado/program-detail-layout";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ADMISSION_CONFIG, AdmissionData } from "@/data/admission-config";
import { unidadPosgradoApi } from "@/lib/api/unidad-posgrado";
import { getStorageUrl } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const rawProgram = await programasApi.getPublicBySlug(slug);
    if (!rawProgram || rawProgram.tipo !== "maestria") return { title: "Programa no encontrado" };
    
    return {
      title: `${rawProgram.titulo} | Maestrías`,
      description: rawProgram.descripcion_corta,
      openGraph: {
        title: `${rawProgram.titulo} | Maestrías UP Educación`,
        description: rawProgram.descripcion_corta,
        url: `https://upeducacion-uncp.edu.pe/posgrado/maestrias/${slug}`,
        images: [
          {
            url: rawProgram.imagen_portada_url || "/opengraph-image.png",
            width: 1200,
            height: 630,
            alt: rawProgram.titulo,
          },
        ],
      },
    };
  } catch {
    return { title: "Programa no encontrado" };
  }
}

export default async function MaestriaDetailPage({ params }: Props) {
  const { slug } = await params;
  
  let rawProgram;
  try {
    rawProgram = await programasApi.getPublicBySlug(slug);
  } catch {
    notFound();
  }
  
  if (!rawProgram || rawProgram.tipo !== "maestria") {
    notFound();
  }

  const program = mapToProgramData(rawProgram);

  // Obtener datos globales de admisión
  const baseData = ADMISSION_CONFIG.maestria;
  let dynamicAdmissionData: AdmissionData = { ...baseData };

  try {
    const unidadData = await unidadPosgradoApi.getPublic();
    if (unidadData && unidadData.admision_json) {
      dynamicAdmissionData = {
        ...baseData,
        period: unidadData.admision_json.periodo_actual || baseData.period,
        whatsappNumber: unidadData.admision_json.whatsapp_contacto || "51949260658",
        documentUrl: unidadData.admision_json.documentos?.maestria 
          ? getStorageUrl(unidadData.admision_json.documentos.maestria) 
          : baseData.documentUrl,
      };
    }
  } catch (error) {
    console.error("Error fetching unidad posgrado data for program:", error);
  }

  return <ProgramDetailLayout program={program} globalAdmissionData={dynamicAdmissionData} />;
}

export async function generateStaticParams() {
  try {
    const programs = await programasApi.getPublicAll({ tipo: "maestria" });
    return (programs as Programa[]).map((p) => ({
      slug: p.slug,
    }));
  } catch {
    return [];
  }
}
