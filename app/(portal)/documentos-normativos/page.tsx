import DocumentosNormativosContent from "@/components/home/documentos-normativos-content";
import TramitesContent from "@/components/home/tramites-content";
import { documentosApi } from "@/lib/api/documentos";
import { procedures, type ProcedureSlug } from "@/components/home/tramite-detail-content";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Documentos y formatos | Facultad de Educación UNCP",
  description: "Encuentra formatos, flujos, guías y normativa oficial para realizar tus trámites académicos.",
};

export default async function DocumentosNormativosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // En Next.js 15, searchParams es asíncrono
  const params = await searchParams;
  const view = typeof params.view === 'string' ? params.view : '';
  const categoria = typeof params.categoria === 'string' ? params.categoria : '';
  const search = typeof params.search === 'string' ? params.search : '';
  const type = typeof params.type === 'string' ? params.type : '';

  if (view === 'tramites') {
    return <TramitesContent />;
  }

  if (type && Object.hasOwn(procedures, type)) {
    redirect(`/tramites/${type as ProcedureSlug}`);
  }

  // SSR / ISR Fetching: Ambas promesas se ejecutan en paralelo
  const [categorias, documentos] = await Promise.all([
    documentosApi.getCategoriasPublicas(),
    documentosApi.getPublicos({
      categoria_slug: categoria || undefined,
      search: search || undefined,
      type: type || undefined
    })
  ]);

  return (
    <>
      <DocumentosNormativosContent 
        documentos={documentos}
        categorias={categorias}
        currentCategoria={categoria}
        searchQuery={search}
        currentType={type}
      />
    </>
  );
}
