"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { NoticiaService } from "@/lib/services/noticia-service";
import { NoticiaCategoria } from "@/types/noticia-categoria";
import { CategoriaForm } from "@/components/admin/noticias/categoria-form";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditarCategoriaPage() {
  const { id } = useParams();
  const [categoria, setCategoria] = useState<NoticiaCategoria | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const data = await NoticiaService.getCategoryById(Number(id));
        setCategoria(data);
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoria();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-brand-950/40">Cargando configuración de sección...</p>
      </div>
    );
  }

  if (!categoria) return <div>No se encontró la sección.</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/portal/noticias" 
          className="p-2 hover:bg-brand-50 rounded-xl transition-colors text-brand-950/40 hover:text-brand-950"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <h2 className="text-3xl font-serif font-black text-brand-950 tracking-tight">Editar Sección</h2>
          <p className="text-sm text-muted-foreground font-medium">Actualiza la identidad visual y el orden de la exhibición.</p>
        </div>
      </div>

      <CategoriaForm key={categoria.id} initialData={categoria} />
    </div>
  );
}
