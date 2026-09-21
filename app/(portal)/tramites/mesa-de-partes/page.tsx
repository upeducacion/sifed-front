import TramiteWorkspace from "@/components/home/tramite-workspace";
import { documentosApi } from "@/lib/api/documentos";

export const metadata = {
  title: "Mesa de partes | Facultad de Educación UNCP",
};

export default async function MesaDePartesPage({ searchParams }: Readonly<{ searchParams: Promise<{ search?: string }> }>) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const [categorias, documentos] = await Promise.all([
    documentosApi.getCategoriasPublicas(),
    documentosApi.getPublicos({ type: "mesa-de-partes", search: search || undefined }),
  ]);
  return <TramiteWorkspace selectedSlug="mesa-de-partes" documentos={documentos} categorias={categorias} searchQuery={search} />;
}
