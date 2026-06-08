"use client";

import DashboardShell from "@/components/dashboard/shell";
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardCheck, 
  User, 
  MessageSquare 
} from "lucide-react";

const docenteNavItems = [
  {
    title: "Dashboard",
    href: "/docente/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Mis Cursos",
    href: "/docente/cursos",
    icon: BookOpen,
  },
  {
    title: "Calificaciones",
    href: "/docente/notas",
    icon: ClipboardCheck,
  },
  {
    title: "Foros",
    href: "/docente/foros",
    icon: MessageSquare,
  },
  {
    title: "Mi Perfil",
    href: "/docente/perfil",
    icon: User,
  },
];

import RoleGuard from "@/components/auth/role-guard";

export default function DocenteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['docente', 'admin']}>
      <DashboardShell navItems={docenteNavItems} title="Portal del Docente">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
