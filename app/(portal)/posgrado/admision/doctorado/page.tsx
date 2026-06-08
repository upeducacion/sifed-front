import AdmissionUnifiedSection from "@/components/posgrado/admission-unified-section";
import PageHero from "@/components/ui/page-hero";
import { ADMISSION_CONFIG, AdmissionData } from "@/data/admission-config";
import { unidadPosgradoApi } from "@/lib/api/unidad-posgrado";
import { getStorageUrl } from "@/lib/utils";

export const metadata = {
  title: "Admisión Doctorado 2026-I | Posgrado Educación",
  description: "Guía completa para el proceso de admisión al Doctorado en Ciencias de la Educación. Requisitos, cronograma y pagos.",
};

export default async function AdmisionDoctoradoPage() {
  const baseData = ADMISSION_CONFIG.doctorado;
  let dynamicData: AdmissionData = { ...baseData };

  try {
    const unidadData = await unidadPosgradoApi.getPublic();
    if (unidadData && unidadData.admision_json) {
      dynamicData = {
        ...baseData,
        period: unidadData.admision_json.periodo_actual || baseData.period,
        whatsappNumber: unidadData.admision_json.whatsapp_contacto || "51949260658",
        documentUrl: unidadData.admision_json.documentos?.doctorado 
          ? getStorageUrl(unidadData.admision_json.documentos.doctorado) 
          : baseData.documentUrl,
      };
    }
  } catch (error) {
    console.error("Error fetching unidad posgrado data:", error);
  }

  return (
    <>
      <PageHero
        title="ADMISIÓN DOCTORADO"
        subtitle={`PROCESO ${dynamicData.period}`}
        imageSrc="/images/fondouncp1920x1080.webp"
        size="compact"
        align="center"
        breadcrumbs={[
          { label: "Posgrado", href: "/posgrado" },
          { label: "Admisión", href: "/posgrado/admision" },
          { label: "Doctorado" }
        ]}
      />

      <div className="bg-neutral-50 min-h-screen">
        <AdmissionUnifiedSection data={dynamicData} />
      </div>
    </>
  );
}
