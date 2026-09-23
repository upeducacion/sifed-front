"use client";

import { createContext, useContext, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface RepositorioNavContextValue {
  navigate: (href: string) => void;
  isPending: boolean;
}

const RepositorioNavContext = createContext<RepositorioNavContextValue | null>(null);

/**
 * Contexto compartido para que filtros, orden, búsqueda y paginación naveguen
 * con `router.replace` dentro de una misma transición: React mantiene los
 * resultados anteriores visibles (atenuados) en vez de mostrar el fallback de
 * Suspense en cada cambio de filtro.
 */
export function RepositorioTransitionProvider({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (href: string) => {
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  };

  return (
    <RepositorioNavContext.Provider value={{ navigate, isPending }}>
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-16 z-40 h-0.5 overflow-hidden lg:top-20">
        <div
          className={cn(
            "h-full w-full origin-left bg-uncp-gold transition-transform duration-300 ease-out",
            isPending ? "scale-x-100 animate-pulse" : "scale-x-0"
          )}
        />
      </div>
      <div className={cn("transition-opacity duration-200 ease-out", isPending && "opacity-60")}>{children}</div>
    </RepositorioNavContext.Provider>
  );
}

export function useRepositorioNav(): RepositorioNavContextValue {
  const ctx = useContext(RepositorioNavContext);
  if (!ctx) {
    throw new Error("useRepositorioNav debe usarse dentro de RepositorioTransitionProvider");
  }
  return ctx;
}
