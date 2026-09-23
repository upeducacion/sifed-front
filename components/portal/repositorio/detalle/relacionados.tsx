import Link from "next/link";
import type { Recurso } from "@/lib/api/biblioteca";
import { tipoMeta } from "@/lib/repositorio/tipos";
import { cn } from "@/lib/utils";

export default function Relacionados({ items }: Readonly<{ items: Recurso[] }>) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="relacionados-heading" className="mt-14 border-t border-border pt-8">
      <h2 id="relacionados-heading" className="mb-5 font-serif text-xl font-semibold text-brand-950">
        Obras relacionadas
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const meta = tipoMeta(item.tipo);
          const Icon = meta.icon;
          return (
            <li key={item.id} className="rounded-lg border border-border bg-white p-4">
              <span className={cn("mb-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", meta.badgeClass)}>
                <Icon className="h-3 w-3" aria-hidden="true" />
                {meta.label}
              </span>
              <h3 className="font-serif text-[0.95rem] font-semibold leading-snug text-brand-950">
                <Link href={`/repositorio/${item.slug}`} className="hover:underline">
                  {item.titulo}
                </Link>
              </h3>
              <p className="mt-1 text-[13px] text-neutral-500">
                {item.autores.slice(0, 2).join("; ")}
                {item.autores.length > 2 ? ", et al." : ""} · {item.anio}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
