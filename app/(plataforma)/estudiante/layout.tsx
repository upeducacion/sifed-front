"use client";

import DashboardShell from "@/components/dashboard/shell";
import { 
  LayoutDashboard
} from "lucide-react";

const estudianteNavItems = [
  {
    title: "Mi Aula",
    href: "/estudiante/dashboard",
    icon: LayoutDashboard,
  },
];

import RoleGuard from "@/components/auth/role-guard";

export default function EstudianteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['estudiante', 'admin']}>
      <DashboardShell navItems={estudianteNavItems} title="Aula Virtual">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
