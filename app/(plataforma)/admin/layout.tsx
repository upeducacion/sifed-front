"use client";

import DashboardShell from "@/components/dashboard/shell";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  FileText, 
  Settings, 
  Image as ImageIcon,
  Globe,
  School,
  Scale,
  Library,
  Newspaper
} from "lucide-react";const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Gestión del Portal",
    href: "/admin/portal",
    icon: Globe,
    children: [
      {
        title: "Unidad de Posgrado",
        href: "/admin/portal/unidad",
        icon: School,
      },
      {
        title: "Noticias",
        href: "/admin/portal/noticias",
        icon: Newspaper,
      },
      {
        title: "Programas Académicos",
        href: "/admin/portal/programas",
        icon: GraduationCap,
      },
      {
        title: "Documentos Normativos",
        href: "/admin/portal/documentos-normativos",
        icon: Scale,
      },
      {
        title: "Plana Docente",
        href: "/admin/portal/docentes",
        icon: Users,
      },
      {
        title: "Biblioteca Virtual",
        href: "/admin/portal/biblioteca",
        icon: Library,
      },
      {
        title: "Galería de Fotos",
        href: "/admin/portal/galerias",
        icon: ImageIcon,
      },
      {
        title: "Trámites",
        href: "/admin/portal/tramites",
        icon: FileText,
      },
    ]
  },
  {
    title: "Usuarios y Roles",
    href: "/admin/usuarios",
    icon: Users,
  },
  {
    title: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
  },
];

import RoleGuard from "@/components/auth/role-guard";
import { ToastProvider } from "@/hooks/use-toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <ToastProvider>
        <DashboardShell navItems={adminNavItems} title="Panel de Administración">
          {children}
        </DashboardShell>
      </ToastProvider>
    </RoleGuard>
  );
}