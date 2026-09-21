import TramiteWorkspace from "@/components/home/tramite-workspace";
import { documentosApi } from "@/lib/api/documentos";

export const metadata = {
  title: "Récord académico | Facultad de Educación UNCP",
};

export default async function RecordAcademicoPage({ searchParams }: Readonly<{ searchParams: Promise<{ search?: string }> }>) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const [categorias, documentos] = await Promise.all([
    documentosApi.getCategoriasPublicas(),
    documentosApi.getPublicos({ type: "record-academico", search: search || undefined }),
  ]);
  return <TramiteWorkspace selectedSlug="record-academico" documentos={documentos} categorias={categorias} searchQuery={search} />;
}
