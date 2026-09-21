import TramiteWorkspace from "@/components/home/tramite-workspace";
import { documentosApi } from "@/lib/api/documentos";

export const metadata = {
  title: "Constancia de egresado | Facultad de Educación UNCP",
};

export default async function ConstanciaEgresadoPage({ searchParams }: Readonly<{ searchParams: Promise<{ search?: string }> }>) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const [categorias, documentos] = await Promise.all([
    documentosApi.getCategoriasPublicas(),
    documentosApi.getPublicos({ type: "constancia-egresado", search: search || undefined }),
  ]);
  return <TramiteWorkspace selectedSlug="constancia-egresado" documentos={documentos} categorias={categorias} searchQuery={search} />;
}
