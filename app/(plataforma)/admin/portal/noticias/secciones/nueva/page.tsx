import { CategoriaForm } from "@/components/admin/noticias/categoria-form";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NuevaCategoriaPage() {
  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/portal/noticias" 
          className="p-2 hover:bg-brand-50 rounded-xl transition-colors text-brand-950/40 hover:text-brand-950"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <h2 className="text-3xl font-serif font-black text-brand-950 tracking-tight">Nueva Sección</h2>
          <p className="text-sm text-muted-foreground font-medium">Configura un nuevo canal editorial para la exhibición.</p>
        </div>
      </div>

      <CategoriaForm />
    </div>
  );
}
