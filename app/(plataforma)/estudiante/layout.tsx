"use client";

import DashboardShell from "@/components/dashboard/shell";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  FileText,
  User
} from "lucide-react";

const estudianteNavItems = [
  {
    title: "Mi Aula",
    href: "/estudiante/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Mis Cursos",
    href: "/estudiante/cursos",
    icon: BookOpen,
  },
  {
    title: "Calendario",
    href: "/estudiante/calendario",
    icon: Calendar,
  },
  {
    title: "Notas",
    href: "/estudiante/notas",
    icon: FileText,
  },
  {
    title: "Mi Perfil",
    href: "/estudiante/perfil",
    icon: User,
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
