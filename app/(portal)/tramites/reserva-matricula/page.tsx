import TramiteWorkspace from "@/components/home/tramite-workspace";
import { documentosApi } from "@/lib/api/documentos";

export const metadata = {
  title: "Reserva de matrícula | Facultad de Educación UNCP",
};

export default async function ReservaMatriculaPage({ searchParams }: Readonly<{ searchParams: Promise<{ search?: string }> }>) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const [categorias, documentos] = await Promise.all([
    documentosApi.getCategoriasPublicas(),
    documentosApi.getPublicos({ type: "reserva-matricula", search: search || undefined }),
  ]);
  return <TramiteWorkspace selectedSlug="reserva-matricula" documentos={documentos} categorias={categorias} searchQuery={search} />;
}
