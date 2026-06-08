import DocumentosNormativosContent from "@/components/home/documentos-normativos-content";
import { documentosApi } from "@/lib/api/documentos";

export const metadata = {
  title: "Documentos Normativos | Facultad de Educación UNCP",
  description: "Accede a la normativa nacional, formatos, plantillas, flujos y documentos oficiales para trámites académicos.",
};

export default async function DocumentosNormativosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // En Next.js 15, searchParams es asíncrono
  const params = await searchParams;
  const categoria = typeof params.categoria === 'string' ? params.categoria : '';
  const search = typeof params.search === 'string' ? params.search : '';

  // SSR / ISR Fetching: Ambas promesas se ejecutan en paralelo
  const [categorias, documentos] = await Promise.all([
    documentosApi.getCategoriasPublicas(),
    documentosApi.getPublicos({
      categoria_slug: categoria || undefined,
      search: search || undefined
    })
  ]);

  return (
    <>
      <DocumentosNormativosContent 
        documentos={documentos}
        categorias={categorias}
        currentCategoria={categoria}
        searchQuery={search}
      />
    </>
  );
}
