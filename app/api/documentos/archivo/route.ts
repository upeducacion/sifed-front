import { getStorageUrl } from "@/lib/utils";

const ALLOWED_PREFIX = "/storage/documentos_normativos/";

export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path") ?? "";
  const isAllowed = path.startsWith(ALLOWED_PREFIX) && path.endsWith(".docx") && !path.includes("..");
  if (!isAllowed) return new Response("Archivo no permitido", { status: 400 });

  const upstream = await fetch(getStorageUrl(path), { next: { revalidate: 3600 } });
  if (!upstream.ok) return new Response("Archivo no encontrado", { status: 404 });

  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/octet-stream",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
