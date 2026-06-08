"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { DocumentoForm } from "@/components/admin/documentos-normativos/documento-form";
import { documentosApi } from "@/lib/api/documentos";
import { DocumentoNormativo } from "@/types/documento-normativo";

export default function EditDocumentoPage() {
  const params = useParams();
  const [documento, setDocumento] = useState<DocumentoNormativo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        if (params.id) {
          const data = await documentosApi.getOne(params.id as string);
          setDocumento(data);
        }
      } catch (err) {
        setError("No se pudo cargar el documento.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error || !documento) {
    return (
      <div className="text-center text-red-500 p-8">
        {error || "Documento no encontrado"}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/portal/documentos-normativos"
          className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Link>
        <div>
          <h2 className="text-2xl font-serif font-bold text-brand-950">Editar Documento</h2>
          <p className="text-muted-foreground text-sm">Actualizando: {documento.titulo}</p>
        </div>
      </div>

      <DocumentoForm initialData={documento} />
    </div>
  );
}
