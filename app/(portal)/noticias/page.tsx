import { NoticiaService } from "@/lib/services/noticia-service";
import CategorySection from "@/components/ui/category-section";
import PageHero from "@/components/ui/page-hero";
import { Metadata } from "next";
import { NoticiaCategoria } from "@/types/noticia-categoria";

export const metadata: Metadata = {
  title: "Noticias | Facultad de Educación UNCP",
  description: "Un portal dedicado a la difusión del conocimiento, logros institucionales y la vibrante vida universitaria de nuestra comunidad.",
};

// Mapeo de estilos visuales para la Exhibición de Arte Digital
const VISUAL_STYLES: Record<string, { accent: string, bg: string, text: string, border: string }> = {
  green: {
    accent: "text-brand-600",
    bg: "bg-white",
    text: "text-brand-950",
    border: "border-brand-100"
  },
  gold: {
    accent: "text-uncp-gold",
    bg: "bg-brand-50/50",
    text: "text-brand-950",
    border: "border-uncp-gold/10"
  },
  blue: {
    accent: "text-blue-600",
    bg: "bg-blue-50/10",
    text: "text-brand-950",
    border: "border-blue-100"
  },
  brand: {
    accent: "text-brand-800",
    bg: "bg-neutral-50",
    text: "text-brand-950",
    border: "border-brand-200"
  }
};

export default async function NoticiasPage() {
  let categorias: NoticiaCategoria[] = [];
  
  try {
    categorias = await NoticiaService.getCategoriesWithNews();
  } catch (error) {
    console.error("Error fetching categorias with news:", error);
  }

  return (
    <>
      <PageHero 
        title="CRÓNICAS DE EXCELENCIA"
        subtitle="FACULTAD DE EDUCACIÓN - ACTUALIDAD"
        description="Un portal dedicado a la difusión del conocimiento, logros institucionales y la vibrante vida universitaria de nuestra comunidad."
        imageSrc="/images/portada-4.webp"
        breadcrumbs={[
          { label: "Noticias" }
        ]}
      />

      <div className="bg-white min-h-screen">
        {categorias.length > 0 ? (
          categorias.map((cat, index) => (
            <CategorySection 
              key={cat.id}
              titulo={cat.nombre}
              noticias={cat.noticias || []}
              descripcion={cat.descripcion || ""}
              isReversed={index % 2 !== 0}
              colorScheme={VISUAL_STYLES[cat.estilo_visual] || VISUAL_STYLES.green}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <h3 className="text-2xl font-serif font-bold text-brand-950 mb-2">Aún no hay noticias publicadas</h3>
            <p className="text-muted-foreground">Vuelve pronto para enterarte de las novedades de nuestra facultad.</p>
          </div>
        )}
      </div>
    </>
  );
}
