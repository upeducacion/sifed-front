"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { NoticiaForm } from "@/components/admin/noticias/noticia-form";
import { NoticiaService } from "@/lib/services/noticia-service";
import { Noticia } from "@/types/noticia";

export default function EditarNoticiaPage() {
  const params = useParams();
  const id = Number(params.id);
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchNoticia = async () => {
      try {
        const data = await NoticiaService.getByIdAdmin(id);
        setNoticia(data);
      } catch (error) {
        console.error("Error loading noticia:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNoticia();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-brand-950">Noticia no encontrada</h3>
        <Link href="/admin/portal/noticias" className="text-brand-600 hover:underline mt-2 inline-block">
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/portal/noticias"
          className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Link>
        <div>
          <h2 className="text-2xl font-serif font-bold text-brand-950">Editar Noticia</h2>
          <p className="text-muted-foreground text-sm">Modifica la información de la publicación.</p>
        </div>
      </div>

      <NoticiaForm initialData={noticia} />
    </div>
  );
}