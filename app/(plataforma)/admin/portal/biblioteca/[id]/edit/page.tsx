"use client";

import { use, useMemo } from "react";
import useSWR from "swr";
import BibliotecaForm from "@/components/admin/biblioteca-form";
import { bibliotecaApi } from "@/lib/api/biblioteca";
import Loader from "@/components/ui/loader";

export default function EditarRecursoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const resourceId = useMemo(() => parseInt(resolvedParams.id), [resolvedParams.id]);

  const { data, error, isLoading } = useSWR(
    resourceId ? `/api/admin/biblioteca/${resourceId}` : null,
    () => bibliotecaApi.getById(resourceId)
  );

  if (error) return (
    <div className="p-20 text-center space-y-4">
       <p className="text-red-500 font-bold text-xl">Error al cargar el recurso académico</p>
       <p className="text-muted-foreground text-sm">El recurso no existe o hubo un problema de conexión.</p>
    </div>
  );

  if (isLoading || !data) return <Loader text="Obteniendo información del repositorio..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-bold text-brand-950">Editar Recurso</h2>
        <p className="text-muted-foreground text-sm">Actualiza los detalles y el archivo PDF del recurso seleccionado.</p>
      </div>
      
      <BibliotecaForm initialData={data} isEditing={true} />
    </div>
  );
}
