"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
  className?: string;
}

export function BackButton({ label = "Volver", className }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`inline-flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-brand-600 transition-colors uppercase tracking-wider ${className || ''}`}
    >
      <ArrowLeft className="h-4 w-4" /> {label}
    </button>
  );
}
