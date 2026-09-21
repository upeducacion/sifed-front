"use client";

import { Search, X } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";

interface DocumentosSearchProps {
  initialQuery: string;
  label?: string;
  placeholder?: string;
}

export default function DocumentosSearch({
  initialQuery,
  label = "Buscar documentos",
  placeholder = "Código o título del documento",
}: DocumentosSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (normalizedQuery === initialQuery.trim()) return;

    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (normalizedQuery) params.set("search", normalizedQuery);
      else params.delete("search");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [initialQuery, pathname, query, router, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector("input");
    input?.blur();
  };

  const handleClear = () => {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div>
      <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-brand-700" htmlFor="document-search">
        {label}
      </label>
      <form onSubmit={handleSearch} className="relative group" aria-label={label}>
      <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors", query && "text-brand-600")} />
      <input
        id="document-search"
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-11 pr-12 py-3.5 bg-neutral-50/50 border border-border rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all placeholder:text-muted-foreground"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-brand-950 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <button type="submit" className="sr-only">Buscar</button>
      </form>
    </div>
  );
}
