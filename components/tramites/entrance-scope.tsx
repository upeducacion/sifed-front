"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";

const initialLocation = typeof window === "undefined" ? null : window.location.pathname + window.location.search;
let navigatedAway = false;

/**
 * Scopes the CSS stagger (`.tramite-rise`) to the first paint of the URL the visitor
 * landed on. Every later navigation, including coming back to that URL, renders without
 * the flag so the view transition owns the motion and content never animates twice.
 */
export default function EntranceScope({ className, children }: Readonly<{ className?: string; children: ReactNode }>) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const location = search ? `${pathname}?${search}` : pathname;
  const isFirstPaint = initialLocation === null || (!navigatedAway && location === initialLocation);

  useEffect(() => {
    if (location !== initialLocation) navigatedAway = true;
  }, [location]);

  return (
    <main className={className} data-entrance={isFirstPaint ? "" : undefined}>
      {children}
    </main>
  );
}
