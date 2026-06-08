import BibliotecaForm from "@/components/admin/biblioteca-form";

export default function NuevoRecursoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-bold text-brand-950">Nuevo Recurso</h2>
        <p className="text-muted-foreground text-sm">Agrega un nuevo libro, tesis o artículo al repositorio académico.</p>
      </div>
      <BibliotecaForm />
    </div>
  );
}
