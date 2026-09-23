import Link from "next/link";
import type { Docente } from "@/types/docente";
import { GraduationCap, ArrowRight } from "lucide-react";
import SmartProfileImage from "@/components/ui/smart-profile-image";

export default function DocenteCard({ docente }: { docente: Docente }) {
  const formatText = (text: string) => {
    if (!text) return "";
    const lower = text.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const gradosList = (docente.grados || "")
    .split(".")
    .map((g) => g.trim())
    .filter((g) => g.length > 0);

  const gradoPrincipal = gradosList.length > 0 ? formatText(gradosList[0]) : "";

  return (
    <Link
      href={`/posgrado/plana-docente/${docente.slug}`}
      className="block outline-none focus-visible:ring-4 focus-visible:ring-brand-500 rounded-lg group"
    >
      <div
        className="relative w-full overflow-hidden rounded-lg"
        style={{ aspectRatio: "3/4" }}
      >

        <div className="absolute inset-0 overflow-hidden rounded-lg">
          {/* Imagen */}
          <SmartProfileImage
            src={docente.foto_url}
            alt={docente.nombre_completo}
            className="transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />

          {/* Gradiente inferior */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, color-mix(in srgb, var(--color-brand-950) 92%, transparent) 0%, color-mix(in srgb, var(--color-brand-950) 45%, transparent) 40%, transparent 100%)",
            }}
          />

          {/* Nombre y categoría sobre el gradiente */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-200 group-hover:opacity-0 group-focus-within:opacity-0">
            <p
              className="text-[9px] font-black uppercase tracking-[0.25em] mb-1.5"
              style={{ color: "color-mix(in srgb, var(--color-gold-600) 85%, transparent)" }}
            >
              Docente {docente.categoria}
            </p>
            <h3
              className="font-serif font-bold text-white text-base leading-tight line-clamp-2"
              style={{ textShadow: "0 2px 10px color-mix(in srgb, var(--color-carbon) 60%, transparent)" }}
            >
              {docente.nombre_completo}
            </h3>
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 z-10 flex h-[38%] translate-y-full flex-col items-start justify-end overflow-hidden px-4 py-4 transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0"
          style={{
            background: "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-brand-950) 88%, transparent) 35%, var(--color-brand-950) 100%)",
          }}
        >
          {gradoPrincipal && (
            <div
              className="relative flex w-full items-start gap-2 rounded-lg border border-white/10 bg-black/20 px-2.5 py-2"
              style={{ boxShadow: "0 6px 18px color-mix(in srgb, var(--color-carbon) 14%, transparent)" }}
            >
              <GraduationCap
                className="mt-0.5 h-3 w-3 shrink-0"
                style={{ color: "color-mix(in srgb, var(--color-gold-600) 75%, transparent)" }}
              />
              <p
                className="text-[11px] leading-snug text-white/70 line-clamp-2"
              >
                {gradoPrincipal}
              </p>
            </div>
          )}

          <div
            className="mt-2 flex w-full items-center justify-end gap-1.5"
            style={{ color: "color-mix(in srgb, var(--color-gold-600) 80%, transparent)" }}
          >
            <span className="text-[9px] font-black uppercase tracking-[0.18em]">Ver perfil</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </Link>
  );
}
