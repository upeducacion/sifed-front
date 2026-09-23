import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MesaDePartesCallout({ layout = "card" }: Readonly<{ layout?: "card" | "banner" }>) {
  return (
    <div className={cn("rounded-lg bg-gold-100 p-4 text-xs text-brand-950 sm:p-5 sm:text-sm", layout === "banner" && "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between")}>
      <div>
        <p className="font-black">¿Ya tienes tus documentos listos?</p>
        <p className="mt-1 leading-relaxed text-brand-800">Presenta tu solicitud a través de la Mesa de Partes Virtual.</p>
      </div>
      <a
        href="https://erpcampus.uncp.edu.pe/"
        target="_blank"
        rel="noopener noreferrer"
        className={cn("inline-flex shrink-0 items-center gap-2 text-xs font-black uppercase tracking-wide text-brand-950 underline decoration-uncp-gold decoration-2 underline-offset-4", layout === "card" && "mt-4")}
      >
        Ir a Mesa de Partes <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    </div>
  );
}
