"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NoticiaForm } from "@/components/admin/noticias/noticia-form";

export default function NuevaNoticiaPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/portal/noticias"
          className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Link>
        <div>
          <h2 className="text-2xl font-serif font-bold text-brand-950">Nueva Noticia</h2>
          <p className="text-muted-foreground text-sm">Completa la información para publicar.</p>
        </div>
      </div>

      <NoticiaForm />
    </div>
  );
}