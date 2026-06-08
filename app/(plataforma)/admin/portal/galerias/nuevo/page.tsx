import GaleriaForm from "@/components/admin/galeria-form";

export default function NuevaGaleriaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-bold text-brand-950">Nuevo Álbum</h2>
        <p className="text-muted-foreground">Crea una nueva galería de fotos para el portal institucional.</p>
      </div>
      
      <GaleriaForm />
    </div>
  );
}
