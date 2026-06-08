import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { docentesApi } from "@/lib/api/docentes";
import { Docente } from "@/types/docente";
import PageHero from "@/components/ui/page-hero";
import { GraduationCap, FileText, ChevronLeft, Linkedin, Globe, Link as LinkIcon, User } from "lucide-react";
import SmartProfileImage from "@/components/ui/smart-profile-image";
import { getStorageUrl } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const docente: Docente = await docentesApi.getPortalSlug(resolvedParams.slug);
    return {
      title: `${docente.nombre_completo} | Plana Docente | UP Educación`,
      description: docente.biografia?.substring(0, 160) || `Perfil de ${docente.nombre_completo}, docente en la Universidad Nacional del Centro del Perú.`,
    };
  } catch {
    return {
      title: "Docente no encontrado | UP Educación",
    };
  }
}

export default async function DocenteProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  let docente: Docente | null = null;
  
  try {
    docente = await docentesApi.getPortalSlug(resolvedParams.slug);
  } catch {
    notFound();
  }

  if (!docente) {
    notFound();
  }

  const gradosList = (docente.grados || "")
    .split(".")
    .map((g) => g.trim())
    .filter((g) => g.length > 0);

  const formatText = (text: string) => {
    if (!text) return "";
    const lower = text.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const {
    mostrar_cv = false,
    mostrar_bio = false,
    mostrar_redes = false,
  } = docente.config_visibilidad || {};

  return (
    <>
      <PageHero
        title={docente.nombre_completo}
        subtitle="PERFIL DOCENTE"
        description={gradosList[0] || "Docente de Posgrado"}
        imageSrc="/images/portada-5.webp"
        size="compact"
        align="center"
        breadcrumbs={[
          { label: "Posgrado", href: "/posgrado" },
          { label: "Plana Docente", href: "/posgrado/plana-docente" },
          { label: "Perfil" }
        ]}
      />

      <section className="w-full py-16 px-4 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          
          <Link 
            href="/posgrado/plana-docente"
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 font-bold mb-12 transition-colors uppercase tracking-widest text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver a la plana docente
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* Columna Izquierda: Retrato Inmersivo & Enlaces Rápidos (Fija) */}
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
              
              {/* Contenedor de Imagen Retrato */}
              <div className="relative w-full aspect-[9/16] max-h-[600px] rounded-[2.5rem] bg-gradient-to-t from-brand-100 to-brand-50 border border-brand-200/50 overflow-hidden shadow-2xl shadow-brand-900/10">
                <SmartProfileImage
                  src={docente.foto_url}
                  alt={docente.nombre_completo}
                  className="drop-shadow-2xl"
                />
                
                {/* Etiqueta de Categoría Flotante */}
                <div className="absolute top-6 right-6">
                  <span className="inline-block px-4 py-1.5 bg-white/90 backdrop-blur-sm text-brand-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm border border-brand-100">
                    {docente.categoria}
                  </span>
                </div>
              </div>

              {/* Botones de Acción y Redes */}
              <div className="space-y-4">
                {mostrar_cv && docente.cv_url && (
                  <a 
                    href={getStorageUrl(docente.cv_url)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 bg-brand-950 hover:bg-brand-800 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-brand-950/20 hover:-translate-y-1"
                  >
                    <FileText className="w-5 h-5" />
                    Descargar Currículum (PDF)
                  </a>
                )}

                {mostrar_redes && docente.detalles_json?.enlaces_sociales && Object.keys(docente.detalles_json.enlaces_sociales).length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(docente.detalles_json.enlaces_sociales).map(([red, url]) => {
                      if (!url) return null;
                      const redLower = red.toLowerCase();
                      let Icon = LinkIcon;
                      let hoverColors = "hover:bg-brand-100 hover:text-brand-900 border-brand-200";
                      
                      if (redLower.includes("linkedin")) { Icon = Linkedin; hoverColors = "hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30 border-brand-200"; }
                      else if (redLower.includes("orcid")) { Icon = Globe; hoverColors = "hover:bg-[#A6CE39]/10 hover:text-[#A6CE39] hover:border-[#A6CE39]/30 border-brand-200"; }
                      else if (redLower.includes("scholar") || redLower.includes("google")) { Icon = GraduationCap; hoverColors = "hover:bg-[#4285F4]/10 hover:text-[#4285F4] hover:border-[#4285F4]/30 border-brand-200"; }

                      return (
                        <a 
                          key={red} 
                          href={url as string} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 p-3 bg-white rounded-xl text-brand-600 transition-all border ${hoverColors} shadow-sm`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-bold">{red}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Columna Derecha: Contenido Modular */}
            <div className="lg:col-span-8 space-y-12 pb-24">
              
              {/* Módulo 1: Formación Académica */}
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-brand-400 flex items-center gap-3">
                  <GraduationCap className="w-5 h-5" />
                  Grados Académicos
                </h3>
                <div className="grid gap-4">
                  {gradosList.map((grado, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-brand-100 shadow-sm flex items-start gap-4 hover:border-brand-300 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center shrink-0 border border-brand-100">
                        <span className="text-brand-700 font-serif font-bold">{index + 1}</span>
                      </div>
                      <p className="text-brand-900 font-medium leading-relaxed pt-2">
                        {formatText(grado)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Módulo 2: Biografía (Si está activa) */}
              {mostrar_bio && docente.biografia && (
                <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.25em] text-brand-400 flex items-center gap-3">
                    <User className="w-5 h-5" />
                    Trayectoria Profesional
                  </h3>
                  <div className="bg-white p-8 md:p-10 rounded-3xl border border-brand-100 shadow-sm">
                    <div className="prose prose-brand prose-lg max-w-none text-brand-800/80 text-pretty font-medium leading-loose">
                      {docente.biografia.split('\n').map((paragraph, idx) => (
                        paragraph.trim() ? (
                          <p key={idx} className="mb-6 last:mb-0">
                            {paragraph}
                          </p>
                        ) : null
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Módulo 3: Especialidades (Si existen) */}
              {docente.detalles_json?.especialidades && docente.detalles_json.especialidades.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.25em] text-brand-400 flex items-center gap-3">
                    <FileText className="w-5 h-5" />
                    Áreas de Especialidad
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {docente.detalles_json.especialidades.map((esp, idx) => (
                      <span key={idx} className="px-5 py-2.5 bg-brand-50 text-brand-900 rounded-xl text-sm font-bold border border-brand-100 shadow-sm">
                        {esp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>
    </>
  );
}

export async function generateStaticParams() {
  try {
    const response = await docentesApi.getPortalList({ per_page: 100 });
    return response.data.map((d: Docente) => ({
      slug: d.slug,
    }));
  } catch {
    return [];
  }
}

