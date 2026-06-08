import { galeriasApi, Galeria } from "@/lib/api/galerias";
import GalleryDetailContent from "@/components/portal/gallery/gallery-detail-content";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const galeria = await galeriasApi.getBySlug(slug);
    if (!galeria) return { title: "Álbum no encontrado" };
    return {
      title: `${galeria.titulo} | Galería Educación UNCP`,
      description: galeria.descripcion || `Álbum de fotos: ${galeria.titulo}`,
    };
  } catch {
    return { title: "Álbum no encontrado" };
  }
}

export default async function DetalleGaleriaPage({ params }: Props) {
  const { slug } = await params;
  
  let galeria;
  try {
    galeria = await galeriasApi.getBySlug(slug);
  } catch (error) {
    console.error("Error fetching gallery detail:", error);
    notFound();
  }
  
  if (!galeria) {
    notFound();
  }

  return <GalleryDetailContent galeria={galeria} />;
}

export async function generateStaticParams() {
  try {
    const response = await galeriasApi.getPublic({ per_page: 100 });
    return response.data.map((g: Galeria) => ({
      slug: g.slug,
    }));
  } catch {
    return [];
  }
}
