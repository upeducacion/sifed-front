import Link from "next/link";
import { Docente } from "@/types/docente";
import { GraduationCap, ArrowRight } from "lucide-react";
import SmartProfileImage from "@/components/ui/smart-profile-image";
import Image from "next/image";

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
      className="block outline-none focus-visible:ring-4 focus-visible:ring-brand-500 rounded-2xl group"
      style={{ perspective: "1200px" }}
    >
      {/* Contenedor que rota en hover */}
      <div
        className="relative w-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
        style={{ aspectRatio: "3/4" }}
      >

        {/* ── CARA FRONTAL ── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden [backface-visibility:hidden]"
        >
          {/* Imagen */}
          <SmartProfileImage
            src={docente.foto_url}
            alt={docente.nombre_completo}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />

          {/* Gradiente inferior */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(5,8,18,0.92) 0%, rgba(5,8,18,0.45) 40%, transparent 100%)",
            }}
          />

          {/* Nombre y categoría sobre el gradiente */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p
              className="text-[9px] font-black uppercase tracking-[0.25em] mb-1.5"
              style={{ color: "rgba(180,145,60,0.85)" }}
            >
              Docente {docente.categoria}
            </p>
            <h3
              className="font-serif font-bold text-white text-base leading-tight line-clamp-2"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}
            >
              {docente.nombre_completo}
            </h3>
          </div>
        </div>

        {/* ── CARA TRASERA ── */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center px-5 py-6 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{
            background: "linear-gradient(160deg, #1e3152 0%, #112038 45%, #050810 100%)",
            border: "1px solid rgba(180,145,60,0.22)",
            boxShadow: "inset 0 1px 0 rgba(180,145,60,0.08)",
          }}
        >
          {/* Línea dorada superior */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
            style={{
              background:
                "linear-gradient(90deg, transparent, #b4913c, #d4a853, #b4913c, transparent)",
            }}
          />

          {/* Edificio UNCP desvanecido de fondo */}
          <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
            <Image
              src="/images/fondouncp1920x1080.webp"
              alt=""
              fill
              className="object-cover object-center select-none"
              style={{ opacity: 0.09, filter: "grayscale(1) brightness(1.4)" }}
              unoptimized
            />
          </div>

          {/* Separador dorado */}
          <div
            className="w-14 h-[1px] mb-5"
            style={{
              background: "linear-gradient(90deg, transparent, #b4913c, transparent)",
            }}
          />

          {/* Nombre */}
          <h3
            className="font-serif font-bold text-white text-center leading-snug mb-3 line-clamp-3"
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            {docente.nombre_completo}
          </h3>

          {/* Badge categoría */}
          <span
            className="px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-[0.25em]"
            style={{
              background: "rgba(180,145,60,0.12)",
              border: "1px solid rgba(180,145,60,0.3)",
              color: "#d4a853",
            }}
          >
            Docente {docente.categoria}
          </span>

          {/* Grado académico */}
          {gradoPrincipal && (
            <div
              className="flex items-start gap-2 mt-4 px-3 py-2.5 rounded-lg w-full"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <GraduationCap
                className="w-3.5 h-3.5 shrink-0 mt-0.5"
                style={{ color: "rgba(180,145,60,0.75)" }}
              />
              <p
                className="text-[13px] leading-snug line-clamp-3"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {gradoPrincipal}
              </p>
            </div>
          )}

          {/* CTA */}
          <div
            className="absolute bottom-4 right-5 flex items-center gap-1.5"
            style={{ color: "rgba(180,145,60,0.6)" }}
          >
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Ver perfil</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>

          {/* Línea dorada inferior */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px] rounded-b-2xl"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(180,145,60,0.3), transparent)",
            }}
          />
        </div>
      </div>
    </Link>
  );
}
