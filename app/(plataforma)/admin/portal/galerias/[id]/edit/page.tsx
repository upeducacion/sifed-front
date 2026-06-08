"use client";

import { use } from "react";
import useSWR from "swr";
import GaleriaForm from "@/components/admin/galeria-form";
import { galeriasApi } from "@/lib/api/galerias";
import Loader from "@/components/ui/loader";

export default function EditarGaleriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data, error, isLoading } = useSWR(
    id ? `/api/admin/galerias/${id}` : null,
    () => galeriasApi.getById(parseInt(id))
  );

  if (error) return <div>Error al cargar los datos</div>;
  if (isLoading || !data) return <Loader text="Cargando galería..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-bold text-brand-950">Editar Álbum</h2>
        <p className="text-muted-foreground">Modifica la información y las fotos de la galería.</p>
      </div>
      
      <GaleriaForm initialData={data} isEditing={true} />
    </div>
  );
}
