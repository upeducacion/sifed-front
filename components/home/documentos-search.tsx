"use client";

import { Search, X } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";

export default function DocumentosSearch({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (query.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
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
    <form onSubmit={handleSearch} className="relative group">
      <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors", query && "text-brand-600")} />
      <input
        type="text"
        placeholder="Buscar por código, título..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-11 pr-12 py-3.5 bg-neutral-50/50 border border-border rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all placeholder:text-muted-foreground"
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
  );
}
