"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
       if (!user) {
         router.push("/login");
       } else {
         const hasRole = user.roles.some((role) => allowedRoles.includes(role));
         if (!hasRole) {
           router.push("/acceso-denegado");
         }
       }
    }
  }, [user, loading, allowedRoles, router]);

  // Mientras carga o si no hay usuario/rol, mostrar loader o null
  if (loading || !user || !user.roles.some((r) => allowedRoles.includes(r))) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-brand-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-brand-600 animate-spin" />
          <p className="text-sm font-bold text-brand-900 animate-pulse">Verificando credenciales...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
