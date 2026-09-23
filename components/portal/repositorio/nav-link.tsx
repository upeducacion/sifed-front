"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useRepositorioNav } from "@/components/portal/repositorio/transition-context";

type NavLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & { children?: ReactNode };

/**
 * Link real (crawlable, funciona sin JS, respeta cmd/ctrl/click-medio) que además
 * navega dentro de la transición compartida de /repositorio para evitar el
 * parpadeo del fallback de Suspense en cada clic (paginación, chips, tabs).
 */
export default function NavLink({ href, onClick, children, ...props }: NavLinkProps) {
  const { navigate } = useRepositorioNav();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(typeof href === "string" ? href : href.toString());
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
